import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { showSuccess, showError } from '@/utils/toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // console.log("Auth state change:", event, session?.user); // For debugging
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // The initial session is handled by the 'INITIAL_SESSION' event of onAuthStateChange.
    // No need for a separate getSession() call here, as onAuthStateChange covers it.

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    // Special admin login for 'Uzzal'
    if (email === 'Uzzal' && password === '123321') {
      // For the purpose of this demo, we'll simulate a successful login
      // In a real app, you'd want to handle this securely, perhaps by creating a dedicated admin user in Supabase
      setUser({ id: 'admin-id', email: 'Uzzal', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User);
      showSuccess("Admin login successful!");
      return { success: true };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showError(error.message);
      return { success: false, error: error.message };
    }
    showSuccess("Login successful!");
    return { success: true };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      showError(error.message);
      return { success: false, error: error.message };
    }
    showSuccess("Signup successful! Please check your email to verify your account.");
    return { success: true };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError(error.message);
    } else {
      setUser(null);
      showSuccess("Logged out successfully!");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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