"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { handleFirstLogin } from '@/lib/userUtils';

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
            await handleFirstLogin(user.id);
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
