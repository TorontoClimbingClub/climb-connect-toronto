
import React, { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, session, loading } = useAuthState();
  const { signIn, signUp, signOut } = useAuthActions();

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Instead of throwing an error, return default values for public routes
    console.warn('useAuth called outside of AuthProvider context, returning default values');
    return {
      user: null,
      session: null,
      loading: false,
      signIn: async () => ({ error: new Error('Auth not available') }),
      signUp: async () => ({ error: new Error('Auth not available') }),
      signOut: async () => {},
    };
  }
  return context;
};
