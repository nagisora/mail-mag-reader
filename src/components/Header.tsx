"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
          メルマガリーダー
        </Link>
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/newsletters" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                メルマガ一覧
              </Link>
              <Button onClick={handleLogout} variant="outline">ログアウト</Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                ログイン
              </Link>
              <Link href="/register" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                新規登録
              </Link>
            </>
          )}
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
