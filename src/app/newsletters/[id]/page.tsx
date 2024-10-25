"use client"; // 追加

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { NewsletterVerificationForm } from '@/components/NewsletterVerificationForm';
import Header from '@/components/Header';

interface NewsletterDetailPageProps {
  params: { id: string };
}

export default function NewsletterDetailPage({ params }: NewsletterDetailPageProps) {
  const [newsletter, setNewsletter] = useState<{ title: string; content: string; is_verified: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null); // 保存メッセージの状態を追加

  useEffect(() => {
    // グローバル環境変数の設定
    window.env = {
      ENABLE_AUTO_SAVE_PROGRESS: false // ここで自動保存の有効/無効を切り替え
    };

    async function fetchNewsletter() {
      if (!user) return;

      const { data: newsletterData, error: newsletterError } = await supabase
        .from('newsletters')
        .select('title, content')
        .eq('id', params.id)
        .single();

      if (newsletterError) {
        console.error('Error fetching newsletter:', newsletterError);
        setError('メマガの取得中にエラーが発生しました。');
        return;
      }

      const { data: progressData, error: progressError } = await supabase
        .from('reading_progress')
        .select('is_verified, position')
        .eq('newsletter_id', params.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (progressError) {
        console.error('Error fetching reading progress:', progressError);
      }

      setNewsletter({
        title: newsletterData.title,
        content: newsletterData.content,
        is_verified: progressData?.is_verified ?? false
      });

      // 保存された位置にスクロール
      if (progressData?.position && contentRef.current) {
        setTimeout(() => {
          const scrollPosition = (progressData.position / 100) * document.documentElement.scrollHeight;
          window.scrollTo(0, scrollPosition);
        }, 100);
      }
    }

    fetchNewsletter();
  }, [params.id, user]);

  const handleSavePosition = async () => {
    if (!user || !newsletter?.is_verified) return;
    
    setIsSaving(true);
    const currentPosition = (window.scrollY / document.documentElement.scrollHeight) * 100;

    const { error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: user.id,
        newsletter_id: params.id,
        position: parseFloat(currentPosition.toFixed(2)), // 小数点第2位までに変換
        is_verified: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,newsletter_id'
      });

    if (error) {
      console.error('Error saving position:', error);
      setSaveMessage('保存に失敗しました。');
    } else {
      setSaveMessage('成功');
      setTimeout(() => {
        setSaveMessage(null);
      }, 1000);
    }
    setIsSaving(false);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!newsletter) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <Header
        showProgress={true}
        newsletterId={params.id}
        isVerified={newsletter?.is_verified}
        onSavePosition={handleSavePosition}
        isSaving={isSaving}
        saveMessage={saveMessage}
      />

      {/* 以下のコンテンツ部分は変更なし */}
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-background border-0 sm:border-0 rounded-none sm:rounded-lg shadow-none sm:shadow-sm">
          <CardHeader className="space-y-1 sm:px-6 px-0">
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
              {newsletter?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 sm:px-6 px-0" ref={contentRef}>
            {newsletter?.is_verified ? (
              <MarkdownRenderer content={newsletter.content} />
            ) : (
              <NewsletterVerificationForm newsletterId={params.id} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
