import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  full_name: string;
  id_number?: string;
  passport_number?: string;
  phone?: string;
  address?: string;
  role: 'national' | 'province' | 'region' | 'branch' | 'vd' | 'member';
  province?: string;
  region?: string;
  branch?: string;
  vd?: string;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithOtp: (email: string) => Promise<{ error: string | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, profileData: Omit<Profile, 'id' | 'role'>) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(userProfile);
      }
      setLoading(false);
    };

    fetchSessionAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    session,
    user,
    profile,
    loading,
    signInWithOtp: async (email: string) => {
      const { error } = await supabase.auth.signInWithOtp({ email });
      return { error: error?.message ?? null };
    },
    signInWithPassword: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
    },
    signUp: async (email, password, profileData) => {
      // Step 1: Create the user in the auth schema
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

      if (authError) {
        return { error: authError.message };
      }
      if (!authData.user) {
        return { error: 'Sign up successful, but no user data returned.' };
      }

      // Step 2: Create the profile in the public schema
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        ...profileData,
        role: 'member', // Default role for new sign-ups
      });

      if (profileError) {
        // This is a tricky situation. The user exists in auth, but not in public.
        // A robust solution might involve a database trigger or cleanup function.
        // For now, we'll return the profile error.
        console.error('Error creating profile for new user:', profileError);
        return { error: `User created, but profile could not be saved: ${profileError.message}` };
      }

      return { error: null };
    },
    signOut: async () => {
      await supabase.auth.signOut();
    }
  }), [session, user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

