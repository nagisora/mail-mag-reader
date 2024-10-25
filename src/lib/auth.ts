import { supabase } from './supabase';
import { handleFirstLogin } from './userUtils';

export function useAuth() {
  const signInWithEmail = async (email: string, password: string) => {
    const { error, data: { user } } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (user) {
      // ユーザーの is_first_login フラグを確認
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_first_login')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
      } else if (userData?.is_first_login) {
        await handleFirstLogin(user.id);
      }
    }

    return user;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  return {
    signInWithEmail,
    signInWithGoogle,
    signUp,
  };
}
