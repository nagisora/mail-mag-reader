"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function GoogleAuthPage() {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        await signInWithGoogle();
        
        // ユーザー情報を取得
        const { data: { user } } = await supabase.auth.getUser();
        
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
              // 1. reading_progress を作成
              const { error: progressError } = await supabase
                .from('reading_progress')
                .upsert({
                  user_id: user.id,
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
                .eq('id', user.id);

              if (updateError) throw updateError;

            } catch (error) {
              console.error('Error in first login process:', error);
              throw new Error('初期設定中にエラーが発生しました。管理者に連絡してください。');
            }
          }
        }

        router.push('/newsletters');
      } catch (error) {
        console.error('Google認証エラー:', error);
        router.push('/login');
      }
    };

    handleGoogleAuth();
  }, [signInWithGoogle, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Googleアカウントで認証中...</p>
      </div>
    </div>
  );
}
