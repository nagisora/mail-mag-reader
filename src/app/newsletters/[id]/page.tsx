"use client"; // 追加

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { NewsletterVerificationForm } from '@/components/NewsletterVerificationForm';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import { Button } from "@/components/ui/button";

interface NewsletterDetailPageProps {
  params: { id: string };
}

export default function NewsletterDetailPage({ params }: NewsletterDetailPageProps) {
  const [newsletter, setNewsletter] = useState<{ title: string; content: string; is_verified: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchNewsletter() {
      if (!user) return;

      const { data: newsletterData, error: newsletterError } = await supabase
        .from('newsletters')
        .select('title, content')
        .eq('id', params.id)
        .single();

      if (newsletterError) {
        console.error('Error fetching newsletter:', newsletterError);
        setError('メルマガの取得中にエラーが発生しました。');
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

  const handleProgressLoaded = (position: number) => {
    if (contentRef.current) {
      const scrollPosition = (position / 100) * document.documentElement.scrollHeight;
      window.scrollTo(0, scrollPosition);
    }
  };

  const handleSavePosition = async () => {
    if (!user || !newsletter?.is_verified) return;
    
    setIsSaving(true);
    // 小数点以下を切り捨てて整数に変換
    const currentPosition = Math.floor((window.scrollY / document.documentElement.scrollHeight) * 100);

    const { error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: user.id,
        newsletter_id: params.id,
        position: currentPosition, // 整数値として保存
        is_verified: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,newsletter_id'
      });

    if (error) {
      console.error('Error saving position:', error);
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
      <div className="sticky top-0 z-10 bg-background border-b">
        {newsletter && newsletter.is_verified && (
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-end py-2">
              <ReadingProgressBar newsletterId={params.id} onProgressLoaded={handleProgressLoaded} />
              <Button
                onClick={handleSavePosition}
                disabled={isSaving}
                size="sm"
                className="ml-4"
              >
                位置を保存
              </Button>
            </div>
          </div>
        )}
      </div>

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
