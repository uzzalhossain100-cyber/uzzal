import React, { createContext, useContext, useState, useEffect } from 'react';
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

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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
          // If profile not found or error, consider logging out or handling appropriately
          // For now, we'll just set profile to null
        } else if (data) {
          setProfile(data);
          if (!data.is_active) {
            // If user is inactive, sign them out
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            showError("আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।");
          }
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // console.log("Auth state change:", event, session?.user); // For debugging
        setLoading(true); // Set loading true on any auth state change
        await fetchUserAndProfile(session?.user || null);
      }
    );

    // Initial check for session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserAndProfile(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    // Special admin login for 'Uzzal'
    if (email === 'Uzzal' && password === '123321') {
      // Simulate admin user and profile
      const adminUser: User = { id: 'admin-id', email: 'Uzzal', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User;
      const adminProfile: Profile = { id: 'admin-id', username: 'Uzzal', mobile_number: '01713236980', is_active: true, email: 'Uzzal', created_at: new Date().toISOString() };
      setUser(adminUser);
      setProfile(adminProfile);
      showSuccess("এডমিন লগইন সফল!");
      return { success: true };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showError(error.message);
      return { success: false, error: error.message };
    }

    // After successful login, fetch profile to check active status
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();

    if (profileError || !profileData) {
      showError("প্রোফাইল ডেটা লোড করতে ব্যর্থ।");
      await supabase.auth.signOut(); // Log out if profile not found
      return { success: false, error: "প্রোফাইল ডেটা লোড করতে ব্যর্থ।" };
    }

    if (!profileData.is_active) {
      showError("আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।");
      await supabase.auth.signOut(); // Log out if inactive
      return { success: false, error: "আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।" };
    }

    setUser(data.user);
    setProfile(profileData);
    showSuccess("লগইন সফল!");
    return { success: true };
  };

  const signUp = async (username: string, email: string, mobileNumber: string, password: string) => {
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
        is_active: true, // New users are active by default
      });

      if (profileError) {
        console.error("Error creating profile:", profileError); // Log the error for debugging
        showError(profileError.message);
        // If profile creation fails, the auth.users entry still exists.
        // For a production app, you might want a server-side function to clean this up.
        return { success: false, error: profileError.message };
      }
    }
    showSuccess("সাইন আপ সফল! আপনার অ্যাকাউন্ট যাচাই করতে আপনার ইমেল চেক করুন।");
    return { success: true };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError(error.message);
    } else {
      setUser(null);
      setProfile(null);
      showSuccess("লগআউট সফল!");
    }
  };

  const getUsersProfiles = async (): Promise<Profile[] | null> => {
    if (profile?.email !== 'Uzzal') { // Only admin can view all profiles
      showError("এই অ্যাকশন করার অনুমতি আপনার নেই।");
      return null;
    }
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
    if (profile?.email !== 'Uzzal') { // Only admin can update user status
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
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, getUsersProfiles, updateUserProfileStatus }}>
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