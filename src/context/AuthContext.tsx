import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { showSuccess, showError } from '@/utils/toast';
import { useTranslation } from '@/lib/translations'; // Import useTranslation
import { sanitizeToAscii } from '@/lib/utils'; // Import sanitizeToAscii

interface Profile {
  id: string;
  username: string | null; // Made nullable
  mobile_number: string | null; // Made nullable
  is_active: boolean;
  email: string;
  created_at: string;
  first_name?: string | null; // Added first_name
  last_name?: string | null;  // Added last_name
}

interface PresenceState {
  [key: string]: {
    user_id: string;
    username: string | null; // Made nullable
    email: string;
    online_at: number;
  }[];
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  onlineUsers: Profile[];
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>; // Changed identifier to email
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>; // Simplified to email and password
  signOut: () => Promise<void>;
  getUsersProfiles: () => Promise<Profile[] | null>;
  updateUserProfileStatus: (userId: string, isActive: boolean) => Promise<{ success: boolean; error?: string }>;
  recordVisit: (visitData: { userId?: string; username?: string; email?: string; ipAddress?: string; }) => Promise<void>;
}

// Initialize AuthContext with null and specify type as AuthContextType | null
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<Profile[]>([]);
  const presenceChannelRef = useRef<any>(null);
  const authListenerRef = useRef<any>(null);
  const { t } = useTranslation();

  const updateOnlineUsers = async (presenceState: PresenceState) => {
    const currentOnlineUserIds = new Set<string>();
    const newOnlineUsers: Profile[] = [];

    for (const key in presenceState) {
      if (presenceState.hasOwnProperty(key)) {
        presenceState[key].forEach(p => {
          if (!currentOnlineUserIds.has(p.user_id)) {
            currentOnlineUserIds.add(p.user_id);
            newOnlineUsers.push({
              id: p.user_id,
              username: sanitizeToAscii(p.username), // Sanitize here
              email: sanitizeToAscii(p.email),     // Sanitize here
              mobile_number: null,
              is_active: true,
              created_at: new Date(p.online_at).toISOString(),
            });
          }
        });
      }
    }
    setOnlineUsers(newOnlineUsers);
  };

  const setMockAdminSession = () => {
    const adminUser: User = { id: 'admin-id', email: 'uzzal@admin.com', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User;
    const adminProfile: Profile = { id: 'admin-id', username: 'Uzzal', mobile_number: '01713236980', is_active: true, email: 'uzzal@admin.com', created_at: new Date().toISOString(), first_name: 'Uzzal', last_name: 'Hossain' };
    
    // Sanitize adminProfile explicitly for consistency
    const sanitizedAdminProfile: Profile = {
      ...adminProfile,
      username: sanitizeToAscii(adminProfile.username),
      email: sanitizeToAscii(adminProfile.email),
      first_name: sanitizeToAscii(adminProfile.first_name),
      last_name: sanitizeToAscii(adminProfile.last_name),
      mobile_number: sanitizeToAscii(adminProfile.mobile_number),
    };

    setUser(adminUser);
    setProfile(sanitizedAdminProfile);
    localStorage.setItem('isMockAdminLoggedIn', 'true');

    setOnlineUsers(prev => {
      if (!prev.some(u => u.id === sanitizedAdminProfile.id)) {
        return [...prev, sanitizedAdminProfile];
      }
      return prev;
    });
  };

  const clearMockAdminSession = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('isMockAdminLoggedIn');
    setOnlineUsers(prev => prev.filter(u => u.id !== 'admin-id'));
  };

  useEffect(() => {
    const setupPresenceChannel = (sessionUser: User, userProfile: Profile) => {
      if (presenceChannelRef.current) {
        presenceChannelRef.current.unsubscribe();
        presenceChannelRef.current = null;
      }

      presenceChannelRef.current = supabase.channel('online-users', {
        config: {
          presence: {
            key: sessionUser.id,
          },
        },
      });

      presenceChannelRef.current.on('presence', { event: 'sync' }, () => {
        const newState = presenceChannelRef.current.presenceState();
        updateOnlineUsers(newState);
      });

      presenceChannelRef.current.on('presence', { event: 'join' }, ({ newPresences }: { newPresences: any[] }) => {
        const newState = presenceChannelRef.current.presenceState();
        updateOnlineUsers(newState);
      });

      presenceChannelRef.current.on('presence', { event: 'leave' }, ({ leftPresences }: { leftPresences: any[] }) => {
        const newState = presenceChannelRef.current.presenceState();
        updateOnlineUsers(newState);
      });

      presenceChannelRef.current.subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          const { error: presenceError } = await presenceChannelRef.current.track({
            user_id: sessionUser.id,
            username: sanitizeToAscii(userProfile.username),
            email: sanitizeToAscii(userProfile.email),
            first_name: sanitizeToAscii(userProfile.first_name), // Sanitize first_name
            last_name: sanitizeToAscii(userProfile.last_name),   // Sanitize last_name
            online_at: Date.now(),
          });
          if (presenceError) {
            console.error("Error tracking presence:", presenceError);
          }
        }
      });
    };

    const fetchUserAndProfile = async (sessionUser: User | null) => {
      setLoading(true);
      if (sessionUser) {
        setUser(sessionUser);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setProfile(null);
        } else if (data) {
          // Sanitize profile data immediately after fetching from DB
          const sanitizedProfile: Profile = {
            ...data,
            username: sanitizeToAscii(data.username),
            email: sanitizeToAscii(data.email),
            first_name: sanitizeToAscii(data.first_name), // Sanitize first_name
            last_name: sanitizeToAscii(data.last_name),   // Sanitize last_name
            mobile_number: sanitizeToAscii(data.mobile_number), // Sanitize mobile_number
          };
          setProfile(sanitizedProfile);
          if (!sanitizedProfile.is_active) { // Use sanitizedProfile here
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            showError(t("common.account_deactivated"));
            clearMockAdminSession();
          } else {
            setupPresenceChannel(sessionUser, sanitizedProfile); // Use sanitizedProfile here
          }
        }
        localStorage.removeItem('isMockAdminLoggedIn');
      } else {
        if (localStorage.getItem('isMockAdminLoggedIn') === 'true') {
          setMockAdminSession();
          const adminUser: User = { id: 'admin-id', email: 'uzzal@admin.com', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User;
          const adminProfile: Profile = { id: 'admin-id', username: 'Uzzal', mobile_number: '01713236980', is_active: true, email: 'uzzal@admin.com', created_at: new Date().toISOString(), first_name: 'Uzzal', last_name: 'Hossain' };
          setupPresenceChannel(adminUser, adminProfile);
        } else {
          if (presenceChannelRef.current) {
            try {
              presenceChannelRef.current.unsubscribe();
            } catch (e) {
              console.warn("Warning: Error unsubscribing presence channel in fetchUserAndProfile:", e);
            }
            presenceChannelRef.current = null;
          }
          setUser(null);
          setProfile(null);
          setOnlineUsers([]);
        }
      }
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        await fetchUserAndProfile(session?.user || null);
      }
    );
    authListenerRef.current = authListener;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await fetchUserAndProfile(session?.user || null);
    });

    return () => {
      if (authListenerRef.current && authListenerRef.current.subscription) {
        try {
          authListenerRef.current.subscription.unsubscribe();
        } catch (e) {
          console.warn("Warning: Error unsubscribing auth listener during useEffect cleanup:", e);
        }
      }
      if (presenceChannelRef.current) {
        try {
          presenceChannelRef.current.unsubscribe();
        } catch (e) {
          console.warn("Warning: Error unsubscribing presence channel during useEffect cleanup:", e);
        }
        presenceChannelRef.current = null;
      }
    };
  }, [t]);

  const signIn = async (email: string, password: string) => {
    if (email === 'uzzal@admin.com' && password === 'Goodman') {
      setMockAdminSession();
      showSuccess(t("common.admin_login_success"));
      return { success: true };
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const sanitizedEmail = trimmedEmail.replace(/[^\x00-\x7F]/g, '');
    const sanitizedPassword = trimmedPassword.replace(/[^\x00-\x7F]/g, '');

    if (sanitizedEmail !== trimmedEmail || sanitizedPassword !== trimmedPassword) {
      showError(t("common.non_ascii_characters_detected_all"));
      return { success: false, error: t("common.non_ascii_characters_detected_all") };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: sanitizedEmail, password: sanitizedPassword });
    if (error) {
      showError(error.message);
      return { success: false, error: error.message };
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();

    if (profileError || !profileData) {
      showError(t("common.failed_to_load_profile"));
      await supabase.auth.signOut();
      clearMockAdminSession();
      return { success: false, error: t("common.failed_to_load_profile") };
    }

    if (!profileData.is_active) {
      showError(t("common.account_deactivated"));
      await supabase.auth.signOut();
      clearMockAdminSession();
      return { success: false, error: t("common.account_deactivated") };
    }

    // Sanitize profile data after successful login
    const sanitizedProfile: Profile = {
      ...profileData,
      username: sanitizeToAscii(profileData.username),
      email: sanitizeToAscii(profileData.email),
      first_name: sanitizeToAscii(profileData.first_name),
      last_name: sanitizeToAscii(profileData.last_name),
      mobile_number: sanitizeToAscii(profileData.mobile_number),
    };

    setUser(data.user);
    setProfile(sanitizedProfile);
    localStorage.removeItem('isMockAdminLoggedIn');
    showSuccess(t("common.login_successful"));
    return { success: true };
  };

  const signUp = async (email: string, password: string) => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const sanitizedEmail = trimmedEmail.replace(/[^\x00-\x7F]/g, '');
    const sanitizedPassword = trimmedPassword.replace(/[^\x00-\x7F]/g, '');

    if (sanitizedEmail !== trimmedEmail || sanitizedPassword !== trimmedPassword) {
      showError(t("common.non_ascii_characters_detected_all"));
      return { success: false, error: t("common.non_ascii_characters_detected_all") };
    }

    // Log sanitized values before sending to Supabase
    console.log("Attempting signup with sanitized email:", sanitizedEmail);
    console.log("Attempting signup with sanitized password (length):", sanitizedPassword.length); // Log length for security

    const { data: existingProfiles, error: checkError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', sanitizedEmail);

    if (checkError) {
      console.error("Error checking existing profiles:", checkError);
      showError(checkError.message || t("common.signup_failed_check_error"));
      return { success: false, error: checkError.message };
    }

    if (existingProfiles && existingProfiles.length > 0) {
      showError(t("common.account_exists"));
      return { success: false, error: t("common.account_exists") };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email: sanitizedEmail,
      password: sanitizedPassword,
      options: {
        data: { // Explicitly set user_metadata to empty, sanitized strings
          first_name: sanitizeToAscii(""),
          last_name: sanitizeToAscii(""),
          username: sanitizeToAscii(""),
          mobile_number: sanitizeToAscii(""),
        }
      }
    });

    if (authError) {
      showError(authError.message);
      return { success: false, error: authError.message };
    }
    
    showSuccess(t("common.signup_successful"));
    return { success: true };
  };

  const signOut = async () => {
    if (profile?.email === 'uzzal@admin.com' && localStorage.getItem('isMockAdminLoggedIn') === 'true') {
      clearMockAdminSession();
      showSuccess(t("common.logout_successful"));
      return;
    }

    if (presenceChannelRef.current) {
      try {
        await presenceChannelRef.current.untrack();
      } catch (e) {
        console.warn("Warning: Error untracking presence channel during signOut:", e);
      }

      if (presenceChannelRef.current) {
        try {
          presenceChannelRef.current.unsubscribe();
        } catch (e) {
          console.warn("Warning: Error unsubscribing presence channel during signOut:", e);
        }
        presenceChannelRef.current = null;
      }
    }

    localStorage.removeItem('isMockAdminLoggedIn');

    setUser(null);
    setProfile(null);
    setOnlineUsers([]);
    showSuccess(t("common.logout_successful"));

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during Supabase signOut:", error.message);
      showError(t("common.logout_failed") + error.message);
    }
  };

  const getUsersProfiles = async (): Promise<Profile[] | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      showError(error.message);
      return null;
    }
    // Sanitize fetched profiles before returning
    return data.map(p => ({
      ...p,
      username: sanitizeToAscii(p.username),
      email: sanitizeToAscii(p.email),
      first_name: sanitizeToAscii(p.first_name),
      last_name: sanitizeToAscii(p.last_name),
      mobile_number: sanitizeToAscii(p.mobile_number),
    }));
  };

  const updateUserProfileStatus = async (userId: string, isActive: boolean): Promise<{ success: boolean; error?: string }> => {
    if (profile?.email !== 'uzzal@admin.com') {
      showError(t("common.permission_denied"));
      return { success: false, error: t("common.permission_denied") };
    }
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId);

    if (error) {
      showError(error.message);
      return { success: false, error: error.message };
    }
    showSuccess(t("common.user_status_updated", { status: isActive ? t("common.active") : t("common.inactive") }));
    return { success: true };
  };

  const recordVisit = async (visitData: { userId?: string; username?: string; email?: string; ipAddress?: string; }) => {
    const { error } = await supabase.from('visits').insert({
      user_id: visitData.userId,
      username: sanitizeToAscii(visitData.username),
      email: sanitizeToAscii(visitData.email),
      ip_address: sanitizeToAscii(visitData.ipAddress), // Sanitize IP address as well
      is_guest_visit: false,
    });

    if (error) {
      console.error("Error recording visit:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, onlineUsers, signIn, signUp, signOut, getUsersProfiles, updateUserProfileStatus, recordVisit }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // Check for null instead of undefined
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};