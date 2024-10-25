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
