import { supabase } from './supabase';

export async function handleFirstLogin(userId: string) {
  try {
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
  } catch (error) {
    console.error('Error in first login process:', error);
    throw new Error('初期設定中にエラーが発生しました。管理者に連絡してください。');
  }
}
