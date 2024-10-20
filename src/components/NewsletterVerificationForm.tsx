"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NewsletterVerificationForm() {
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
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationResult(data.match ? '照合成功：メルマガの閲覧が許可されました。' : '照合失敗：一致度が95%未満です。');
      } else {
        setVerificationResult('エラー：' + data.error);
      }
    } catch (error) {
      setVerificationResult('エラー：照合処理中に問題が発生しました。');
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
        className="h-40"
        required
      />
      <Button type="submit" disabled={isVerifying}>
        {isVerifying ? '照合中...' : 'メルマガを照合'}
      </Button>
      {verificationResult && (
        <Alert variant={verificationResult.startsWith('照合成功') ? 'default' : 'destructive'}>
          <AlertDescription>{verificationResult}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
