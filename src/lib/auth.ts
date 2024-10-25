import { supabase } from './supabase';

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
        try {
          // 初回ログイン処理
          await handleFirstLogin(user.id);
        } catch (error) {
          console.error('Error in first login process:', error);
          throw new Error('初期設定中にエラーが発生しました。管理者に連絡してください。');
        }
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

async function handleFirstLogin(userId: string) {
  // 1. reading_progress を作成
  const { error: progressError } = await supabase
    .from('reading_progress')
    .upsert({
      user_id: userId,
      newsletter_id: 'b1fc1499-7388-441e-a3c5-1de7f31b3c0b',
      position: 0,
      is_verified: true,
      updated_at: new Date().toISOString()
    });

  if (progressError) throw progressError;

  // 2. is_first_login フラグを更新
  const { error: updateError } = await supabase
    .from('users')
    .update({ 
      is_first_login: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (updateError) throw updateError;
}
