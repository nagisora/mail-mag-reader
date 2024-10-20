"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/lib/supabase';

interface NewsletterVerificationFormProps {
  newsletterId: string;
}

export function NewsletterVerificationForm({ newsletterId }: NewsletterVerificationFormProps) {
  const [content, setContent] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult(null);
    setError(null);

    if (!content.trim()) {
      setError('メルマガの本文を入力してください。');
      setIsVerifying(false);
      return;
    }

    try {
      const response = await fetch('/api/newsletters/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: newsletterId, content }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.success) {
          setVerificationResult('メルマガの照合に成功しました。');
          
          // ユーザーIDを取得
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('ユーザーが認証されていません。');

          // reading_progressテーブルを更新または作成
          const { data, error } = await supabase
            .from('reading_progress')
            .upsert({
              user_id: user.id,
              newsletter_id: newsletterId,
              is_verified: true,
              position: 0, // 初期位置を0に設定
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,newsletter_id'
            });

          if (error) throw error;

          // ページをリロードして更新されたコンテンツを表示
          window.location.reload();
        } else {
          setError(`メルマガの照合に失敗しました。類似度: ${result.similarity}`);
        }
      } else {
        setError(result.error || 'メルマガの照合中にエラーが発生しました。');
      }
    } catch (error) {
      console.error('Error verifying newsletter:', error);
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="メルマガの本文を入力してください"
        rows={10}
        required
      />
      <Button type="submit" disabled={isVerifying || !content.trim()}>
        {isVerifying ? '照合中...' : 'メルマガを照合'}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {verificationResult && (
        <Alert>
          <AlertDescription>{verificationResult}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
