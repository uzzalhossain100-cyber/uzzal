import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { showSuccess, showError } from '@/utils/toast';
import { useTranslation } from '@/lib/translations'; // Import useTranslation

interface Profile {
  id: string;
  username: string;
  mobile_number: string | null;
  is_active: boolean;
  email: string;
  created_at: string;
  is_guest?: boolean; // Added for guest users
}

interface PresenceState {
  [key: string]: {
    user_id: string;
    username: string;
    email: string;
    online_at: number;
    is_guest?: boolean; // Added for guest users in presence
  }[];
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  onlineUsers: Profile[]; // New: List of currently online users
  signIn: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (username: string, email: string, mobileNumber: string, password: string) => Promise<{ success: boolean; error?: string }>;
  guestSignIn: (username: string) => Promise<{ success: boolean; error?: string }>; // Updated: Only username
  signOut: () => Promise<void>;
  getUsersProfiles: () => Promise<Profile[] | null>;
  updateUserProfileStatus: (userId: string, isActive: boolean) => Promise<{ success: boolean; error?: string }>;
  recordVisit: (visitData: { userId?: string; guestId?: string; username?: string; email?: string; ipAddress?: string; isGuestVisit: boolean }) => Promise<void>; // New: Function to record visits
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<Profile[]>([]);
  const presenceChannelRef = useRef<any>(null); // Ref for Supabase Realtime channel
  const authListenerRef = useRef<any>(null); // Ref to store the auth listener subscription
  const { t } = useTranslation(); // Initialize useTranslation

  // Function to update online users based on presence state
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
              username: p.username,
              email: p.email,
              mobile_number: null, // Mobile number is not part of presence payload
              is_active: true, // Assume online users are active
              created_at: new Date(p.online_at).toISOString(),
              is_guest: p.is_guest || false, // Include is_guest from presence
            });
          }
        });
      }
    }
    setOnlineUsers(newOnlineUsers);
  };

  // Helper function to set mock admin state
  const setMockAdminSession = () => {
    const adminUser: User = { id: 'admin-id', email: 'uzzal@admin.com', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User;
    const adminProfile: Profile = { id: 'admin-id', username: 'Uzzal', mobile_number: '01713236980', is_active: true, email: 'uzzal@admin.com', created_at: new Date().toISOString(), is_guest: false };
    setUser(adminUser);
    setProfile(adminProfile);
    localStorage.setItem('isMockAdminLoggedIn', 'true'); // Persist mock admin state

    // Manually add mock admin to onlineUsers for immediate display
    setOnlineUsers(prev => {
      if (!prev.some(u => u.id === adminProfile.id)) {
        return [...prev, adminProfile];
      }
      return prev;
    });
  };

  // Helper function to clear mock admin state
  const clearMockAdminSession = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('isMockAdminLoggedIn');
    // Manually remove mock admin from onlineUsers
    setOnlineUsers(prev => prev.filter(u => u.id !== 'admin-id'));
  };

  // Helper function to set guest session
  const setGuestSession = (guestUsername: string) => {
    const guestId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const guestEmail = `${guestUsername.toLowerCase().replace(/[^a-z0-9]/g, '')}@guest.com`; // Generate dummy email
    const guestUser: User = {
      id: guestId,
      email: guestEmail,
      app_metadata: { is_guest: true },
      user_metadata: { username: guestUsername },
      aud: 'authenticated', // Or a custom aud for guests
      created_at: new Date().toISOString(),
    } as User;
    const guestProfile: Profile = {
      id: guestId,
      username: guestUsername,
      mobile_number: null,
      is_active: true,
      email: guestEmail,
      created_at: new Date().toISOString(),
      is_guest: true,
    };
    setUser(guestUser);
    setProfile(guestProfile);
    localStorage.setItem('guestUser', JSON.stringify(guestUser));
    localStorage.setItem('guestProfile', JSON.stringify(guestProfile));

    // Manually add guest to onlineUsers for immediate display
    setOnlineUsers(prev => {
      if (!prev.some(u => u.id === guestProfile.id)) {
        return [...prev, guestProfile];
      }
      return prev;
    });
  };

  // Helper function to clear guest session
  const clearGuestSession = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('guestUser');
    localStorage.removeItem('guestProfile');
    // Manually remove guest from onlineUsers
    setOnlineUsers(prev => prev.filter(u => !u.is_guest)); // Filter out all guests
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
            username: userProfile.username,
            email: userProfile.email,
            online_at: Date.now(),
            is_guest: userProfile.is_guest || false,
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
          setProfile(data);
          if (!data.is_active) {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            showError(t("common.account_deactivated"));
            clearMockAdminSession();
            clearGuestSession();
          } else {
            setupPresenceChannel(sessionUser, data);
          }
        }
        // Ensure these are cleared if a real user logs in over a mock/guest session
        localStorage.removeItem('isMockAdminLoggedIn');
        localStorage.removeItem('guestUser');
        localStorage.removeItem('guestProfile');
      } else {
        if (localStorage.getItem('isMockAdminLoggedIn') === 'true') {
          setMockAdminSession();
          const adminUser: User = { id: 'admin-id', email: 'uzzal@admin.com', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User;
          const adminProfile: Profile = { id: 'admin-id', username: 'Uzzal', mobile_number: '01713236980', is_active: true, email: 'uzzal@admin.com', created_at: new Date().toISOString(), is_guest: false };
          setupPresenceChannel(adminUser, adminProfile);
        } else if (localStorage.getItem('guestUser') && localStorage.getItem('guestProfile')) {
          const storedGuestUser = JSON.parse(localStorage.getItem('guestUser')!);
          const storedGuestProfile = JSON.parse(localStorage.getItem('guestProfile')!);
          setUser(storedGuestUser);
          setProfile(storedGuestProfile);
          setupPresenceChannel(storedGuestUser, storedGuestProfile);
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
  }, [t]); // Added t to dependency array

  const signIn = async (identifier: string, password: string) => {
    if (identifier === 'Uzzal' && password === '200186') {
      setMockAdminSession();
      showSuccess(t("common.admin_login_success"));
      return { success: true };
    }

    let emailToSignIn = identifier;

    if (!identifier.includes('@')) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identifier)
        .single();

      if (profileError || !profileData) {
        showError(t("common.wrong_username_password"));
        return { success: false, error: t("common.wrong_username_password") };
      }
      emailToSignIn = profileData.email;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: emailToSignIn, password });
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
      clearGuestSession();
      return { success: false, error: t("common.failed_to_load_profile") };
    }

    if (!profileData.is_active) {
      showError(t("common.account_deactivated"));
      await supabase.auth.signOut();
      clearMockAdminSession();
      clearGuestSession();
      return { success: false, error: t("common.account_deactivated") };
    }

    setUser(data.user);
    setProfile(profileData);
    localStorage.removeItem('isMockAdminLoggedIn');
    localStorage.removeItem('guestUser');
    localStorage.removeItem('guestProfile');
    showSuccess(t("common.login_successful"));
    return { success: true };
  };

  const signUp = async (username: string, email: string, mobileNumber: string, password: string) => {
    const { data: existingProfiles, error: checkError } = await supabase
      .from('profiles')
      .select('id, username, email, mobile_number')
      .or(`username.eq.${username},email.eq.${email},mobile_number.eq.${mobileNumber}`);

    if (checkError) {
      console.error("Error checking existing profiles:", checkError);
      showError(t("common.signup_failed_check_error"));
      return { success: false, error: t("common.signup_failed_check_error") };
    }

    if (existingProfiles && existingProfiles.length > 0) {
      showError(t("common.account_exists"));
      return { success: false, error: t("common.account_exists") };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      showError(authError.message);
      return { success: false, error: authError.message };
    }

    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        username,
        email,
        mobile_number: mobileNumber,
        is_active: true,
      });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        showError(profileError.message);
        return { success: false, error: profileError.message };
      }
    }
    showSuccess(t("common.signup_successful"));
    return { success: true };
  };

  const guestSignIn = async (username: string) => { // Only username as parameter
    await supabase.auth.signOut();
    clearMockAdminSession();

    setGuestSession(username); // Pass only username
    showSuccess(t("common.guest_login_successful"));
    return { success: true };
  };

  const signOut = async () => {
    // Always untrack/unsubscribe presence
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

    // Always clear local storage items related to mock/guest sessions
    localStorage.removeItem('isMockAdminLoggedIn');
    localStorage.removeItem('guestUser');
    localStorage.removeItem('guestProfile');

    // Optimistically clear state for immediate UI update
    setUser(null);
    setProfile(null);
    setOnlineUsers([]);
    showSuccess(t("common.logout_successful")); // Show success immediately

    // Only call Supabase signOut for real users (not mock admin or guest)
    if (!(profile?.is_guest || profile?.email === 'uzzal@admin.com')) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during Supabase signOut:", error.message);
        showError(t("common.logout_failed") + error.message);
      }
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
    return data;
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

  const recordVisit = async (visitData: { userId?: string; guestId?: string; username?: string; email?: string; ipAddress?: string; isGuestVisit: boolean }) => {
    const { error } = await supabase.from('visits').insert({
      user_id: visitData.userId,
      guest_id: visitData.guestId,
      username: visitData.username,
      email: visitData.email,
      ip_address: visitData.ipAddress,
      is_guest_visit: visitData.isGuestVisit,
    });

    if (error) {
      console.error("Error recording visit:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, onlineUsers, signIn, signUp, guestSignIn, signOut, getUsersProfiles, updateUserProfileStatus, recordVisit }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};