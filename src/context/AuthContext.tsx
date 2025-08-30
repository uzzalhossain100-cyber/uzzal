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
  guestSignIn: (username: string, email: string) => Promise<{ success: boolean; error?: string }>; // New: Guest sign-in
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
    const adminUser: User = { id: 'admin-id', email: 'Uzzal', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User;
    const adminProfile: Profile = { id: 'admin-id', username: 'Uzzal', mobile_number: '01713236980', is_active: true, email: 'Uzzal', created_at: new Date().toISOString(), is_guest: false };
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

  // Helper function to set guest session
  const setGuestSession = (guestUsername: string, guestEmail: string) => {
    const guestId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
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
  };

  // Helper function to clear guest session
  const clearGuestSession = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('guestUser');
    localStorage.removeItem('guestProfile');
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
            showError("আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।");
            clearMockAdminSession();
            clearGuestSession();
          } else {
            setupPresenceChannel(sessionUser, data);
          }
        }
        localStorage.removeItem('isMockAdminLoggedIn'); // Clear mock admin if a real user logs in
        localStorage.removeItem('guestUser'); // Clear guest if a real user logs in
        localStorage.removeItem('guestProfile');
      } else {
        // If no Supabase user, check for mock admin session
        if (localStorage.getItem('isMockAdminLoggedIn') === 'true') {
          setMockAdminSession();
          // Setup presence for mock admin
          const adminUser: User = { id: 'admin-id', email: 'Uzzal', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User;
          const adminProfile: Profile = { id: 'admin-id', username: 'Uzzal', mobile_number: '01713236980', is_active: true, email: 'Uzzal', created_at: new Date().toISOString(), is_guest: false };
          setupPresenceChannel(adminUser, adminProfile);
        }
        // If no Supabase user and no mock admin, check for guest session
        else if (localStorage.getItem('guestUser') && localStorage.getItem('guestProfile')) {
          const storedGuestUser = JSON.parse(localStorage.getItem('guestUser')!);
          const storedGuestProfile = JSON.parse(localStorage.getItem('guestProfile')!);
          setUser(storedGuestUser);
          setProfile(storedGuestProfile);
          setupPresenceChannel(storedGuestUser, storedGuestProfile);
        }
        else {
          // If no user and no mock admin and no guest, ensure presence channel is unsubscribed
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
      clearGuestSession(); // Clear guest if a real user profile fails to load
      return { success: false, error: "প্রোফাইল ডেটা লোড করতে ব্যর্থ।" };
    }

    if (!profileData.is_active) {
      showError("আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।");
      await supabase.auth.signOut();
      clearMockAdminSession(); // Clear mock admin if a real user is inactive
      clearGuestSession(); // Clear guest if a real user is inactive
      return { success: false, error: "আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।" };
    }

    setUser(data.user);
    setProfile(profileData);
    localStorage.removeItem('isMockAdminLoggedIn'); // Ensure mock admin flag is cleared if a real user logs in
    localStorage.removeItem('guestUser'); // Ensure guest flag is cleared if a real user logs in
    localStorage.removeItem('guestProfile');
    showSuccess("লগইন সফল!");
    return { success: true };
  };

  const signUp = async (username: string, email: string, mobileNumber: string, password: string) => {
    // Check if username, email, or mobile number already exists
    const { data: existingProfiles, error: checkError } = await supabase
      .from('profiles')
      .select('id, username, email, mobile_number')
      .or(`username.eq.${username},email.eq.${email},mobile_number.eq.${mobileNumber}`);

    if (checkError) {
      console.error("Error checking existing profiles:", checkError);
      showError("সাইন আপ চেক করতে সমস্যা হয়েছে।");
      return { success: false, error: "Error checking existing profiles." };
    }

    if (existingProfiles && existingProfiles.length > 0) {
      showError("আপনার নামে একটি একাউন্ট আছে।");
      return { success: false, error: "An account already exists with your details." };
    }

    // Proceed with Supabase Auth signup
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
    showSuccess("সাইন আপ সফল হয়েছে!");
    return { success: true };
  };

  const guestSignIn = async (username: string, email: string) => {
    // Clear any existing Supabase or mock admin sessions
    await supabase.auth.signOut();
    clearMockAdminSession();

    // Set guest session
    setGuestSession(username, email);
    showSuccess("সাধারণ ইউজার হিসেবে লগইন সফল!");
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
      clearGuestSession(); // Clear guest session on sign out
      setUser(null);
      setProfile(null);
      setOnlineUsers([]);
      showSuccess("লগআউট সফল!");
    }
  };

  const getUsersProfiles = async (): Promise<Profile[] | null> => {
    // Only fetch real user profiles from Supabase
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
    <AuthContext.Provider value={{ user, profile, loading, onlineUsers, signIn, signUp, guestSignIn, signOut, getUsersProfiles, updateUserProfileStatus }}>
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