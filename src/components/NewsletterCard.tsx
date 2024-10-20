import Link from 'next/link';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NewsletterCardProps {
  id: string;
  title: string;
  createdAt: string;
  isVerified: boolean;
}

export default function NewsletterCard({ id, title, createdAt, isVerified }: NewsletterCardProps) {
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/newsletters/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setVerificationStatus('照合成功');
        // ここでisVerifiedの状態を更新する処理を追加する必要があります
      } else {
        setVerificationStatus('照合失敗');
      }
    } catch (error) {
      setVerificationStatus('エラーが発生しました');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="border border-gray-300 p-4 mb-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
      {isVerified ? (
        <Link href={`/newsletters/${id}`} className="text-blue-600 hover:underline">
          詳細を見る
        </Link>
      ) : (
        <Button onClick={handleVerify} disabled={isVerifying}>
          {isVerifying ? '照合中...' : 'メルマガを照合'}
        </Button>
      )}
      {verificationStatus && (
        <Alert className="mt-2">
          <AlertDescription>{verificationStatus}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
