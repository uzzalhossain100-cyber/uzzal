import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { showSuccess, showError } from '@/utils/toast';

interface Profile {
  id: string;
  username: string;
  mobile_number: string | null;
  is_active: boolean;
  email: string;
  created_at: string;
}

interface PresenceState {
  [key: string]: {
    user_id: string;
    username: string;
    email: string;
    online_at: number;
  }[];
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  onlineUsers: Profile[]; // New: List of currently online users
  signIn: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (username: string, email: string, mobileNumber: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  getUsersProfiles: () => Promise<Profile[] | null>;
  updateUserProfileStatus: (userId: string, isActive: boolean) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<Profile[]>([]);
  const presenceChannelRef = useRef<any>(null); // Ref for Supabase Realtime channel

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
            });
          }
        });
      }
    }
    setOnlineUsers(newOnlineUsers);
  };

  // Helper function to set mock admin state
  const setMockAdminSession = () => {
    const adminUser: User = { id: 'admin-id', email: 'Uzzal', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User;
    const adminProfile: Profile = { id: 'admin-id', username: 'Uzzal', mobile_number: '01713236980', is_active: true, email: 'Uzzal', created_at: new Date().toISOString() };
    setUser(adminUser);
    setProfile(adminProfile);
    localStorage.setItem('isMockAdminLoggedIn', 'true'); // Persist mock admin state
  };

  // Helper function to clear mock admin state
  const clearMockAdminSession = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('isMockAdminLoggedIn');
  };

  useEffect(() => {
    const fetchUserAndProfile = async (sessionUser: User | null) => {
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
          // If profile fetch fails for a real user, consider signing them out or showing an error.
          // For now, just setting profile to null.
        } else if (data) {
          setProfile(data);
          if (!data.is_active) {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            showError("আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।");
            clearMockAdminSession(); // Also clear mock admin if a real user becomes inactive
          } else {
            // Join presence channel if user is active
            if (!presenceChannelRef.current) {
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
                    username: data.username,
                    email: data.email,
                    online_at: Date.now(),
                  });
                  if (presenceError) {
                    console.error("Error tracking presence:", presenceError);
                  }
                }
              });
            }
          }
        }
      } else {
        // If no Supabase user, check for mock admin session
        if (localStorage.getItem('isMockAdminLoggedIn') === 'true') {
          setMockAdminSession(); // Re-establish mock admin session
        } else {
          // If no user and no mock admin, ensure presence channel is unsubscribed
          if (presenceChannelRef.current) {
            presenceChannelRef.current.unsubscribe();
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

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await fetchUserAndProfile(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
      if (presenceChannelRef.current) {
        presenceChannelRef.current.unsubscribe();
      }
    };
  }, []);

  const signIn = async (identifier: string, password: string) => {
    // Special admin login for 'Uzzal'
    if (identifier === 'Uzzal' && password === '123321') {
      setMockAdminSession(); // Use the helper function
      showSuccess("এডমিন লগইন সফল!");
      return { success: true };
    }

    let emailToSignIn = identifier;

    // Check if identifier is an email or username
    if (!identifier.includes('@')) {
      // Assume it's a username, try to find the email
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identifier)
        .single();

      if (profileError || !profileData) {
        showError("ভুল ইউজারনেম বা পাসওয়ার্ড।");
        return { success: false, error: "ভুল ইউজারনেম বা পাসওয়ার্ড।" };
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
      showError("প্রোফাইল ডেটা লোড করতে ব্যর্থ।");
      await supabase.auth.signOut();
      clearMockAdminSession(); // Clear mock admin if a real user profile fails to load
      return { success: false, error: "প্রোফাইল ডেটা লোড করতে ব্যর্থ।" };
    }

    if (!profileData.is_active) {
      showError("আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।");
      await supabase.auth.signOut();
      clearMockAdminSession(); // Clear mock admin if a real user is inactive
      return { success: false, error: "আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।" };
    }

    setUser(data.user);
    setProfile(profileData);
    localStorage.removeItem('isMockAdminLoggedIn'); // Ensure mock admin flag is cleared if a real user logs in
    showSuccess("লগইন সফল!");
    return { success: true };
  };

  const signUp = async (username: string, email: string, mobileNumber: string, password: string) => {
    // Check if username already exists
    const { data: existingUsername, error: usernameCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUsername) {
      showError("এই ইউজারনেমটি ইতিমধ্যেই ব্যবহৃত হয়েছে। অন্য একটি ইউজারনেম ব্যবহার করুন।");
      return { success: false, error: "Username already taken." };
    }
    if (usernameCheckError && usernameCheckError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error("Error checking username:", usernameCheckError);
      showError("ইউজারনেম চেক করতে সমস্যা হয়েছে।");
      return { success: false, error: "Error checking username." };
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
    showSuccess("সাইন আপ সফল! এখন আপনি লগইন করতে পারেন।"); // Changed message
    return { success: true };
  };

  const signOut = async () => {
    if (presenceChannelRef.current) {
      await presenceChannelRef.current.untrack();
      presenceChannelRef.current.unsubscribe();
      presenceChannelRef.current = null;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError(error.message);
    } else {
      clearMockAdminSession(); // Clear mock admin session on sign out
      setUser(null);
      setProfile(null);
      setOnlineUsers([]);
      showSuccess("লগআউট সফল!");
    }
  };

  const getUsersProfiles = async (): Promise<Profile[] | null> => {
    // Allow any logged-in user to fetch profiles for ActiveUsersPage,
    // but only admin can see UserManagementPage.
    // The check for 'Uzzal' admin is for the UserManagementPage specifically.
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
    if (profile?.email !== 'Uzzal') {
      showError("এই অ্যাকশন করার অনুমতি আপনার নেই।");
      return { success: false, error: "অনুমতি নেই।" };
    }
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId);

    if (error) {
      showError(error.message);
      return { success: false, error: error.message };
    }
    showSuccess(`ইউজার ${isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে।`);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, onlineUsers, signIn, signUp, signOut, getUsersProfiles, updateUserProfileStatus }}>
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