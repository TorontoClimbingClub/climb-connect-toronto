
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authCleanup';

export function useAuthActions() {
  const signIn = async (email: string, password: string) => {
    try {
      // Clean up any existing state first
      cleanupAuthState();
      
      // Attempt global sign out before signing in
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Pre-signin cleanup error (continuing):', err);
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Clean up any existing state first
      cleanupAuthState();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      console.error('Sign out error:', error);
      // Force redirect even if sign out fails
      window.location.href = '/auth';
    }
  };

  return { signIn, signUp, signOut };
}
