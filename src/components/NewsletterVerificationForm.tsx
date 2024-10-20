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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const response = await fetch('/api/newsletters/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: newsletterId, content }),
      });

      if (response.ok) {
        const result = await response.json();
        setVerificationResult('メルマガの照合に成功しました。');
        // メルマガのis_verifiedステータスを更新
        await supabase
          .from('newsletters')
          .update({ is_verified: true })
          .eq('id', newsletterId);
        // ページをリロードして更新されたコンテンツを表示
        window.location.reload();
      } else {
        setVerificationResult('メルマガの照合に失敗しました。');
      }
    } catch (error) {
      setVerificationResult('エラーが発生しました。もう一度お試しください。');
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
      />
      <Button type="submit" disabled={isVerifying}>
        {isVerifying ? '照合中...' : 'メルマガを照合'}
      </Button>
      {verificationResult && (
        <Alert>
          <AlertDescription>{verificationResult}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
