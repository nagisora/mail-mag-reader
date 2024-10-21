"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

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
        } else if (userData && userData.is_first_login) {
          // 初回ログイン時の処理
          const { error: progressError } = await supabase
            .from('reading_progress')
            .upsert({
              user_id: user.id,
              newsletter_id: 'b1fc1499-7388-441e-a3c5-1de7f31b3c0b',
              position: 0,
              is_verified: true,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,newsletter_id'
            });

          if (progressError) {
            console.error('Error creating reading progress:', progressError);
          } else {
            // is_first_login フラグを更新
            const { error: updateError } = await supabase
              .from('users')
              .update({ is_first_login: false })
              .eq('id', user.id);

            if (updateError) {
              console.error('Error updating is_first_login flag:', updateError);
            }
          }
        }
      }

      router.push('/newsletters');
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error instanceof Error ? error.message : 'ログインエラーが発生しました。');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>メルマガリーダーにログインしてください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1">メールアドレス</label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">パスワード</label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              ログイン
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
