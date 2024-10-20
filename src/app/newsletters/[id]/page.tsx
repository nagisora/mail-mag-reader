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

interface NewsletterDetailPageProps {
  params: { id: string };
}

export default function NewsletterDetailPage({ params }: NewsletterDetailPageProps) {
  const [newsletter, setNewsletter] = useState<{ title: string; content: string; is_verified: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNewsletter() {
      if (!user) return;

      const { data, error } = await supabase
        .from('reading_progress')
        .select(`
          is_verified,
          position,
          newsletters (
            title,
            content
          )
        `)
        .eq('newsletter_id', params.id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching newsletter:', error);
        setError('メルマガの取得中にエラーが発生しました。');
      } else if (data) {
        setNewsletter({
          title: data.newsletters.title,
          content: data.newsletters.content,
          is_verified: data.is_verified
        });
        // 保存された位置にスクロール
        if (data.position && contentRef.current) {
          setTimeout(() => {
            const scrollPosition = (data.position / 100) * document.documentElement.scrollHeight;
            window.scrollTo(0, scrollPosition);
          }, 100);
        }
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
    <div className="container mx-auto px-4 py-8">
      {newsletter && newsletter.is_verified && (
        <ReadingProgressBar newsletterId={params.id} onProgressLoaded={handleProgressLoaded} />
      )}
      <Card className="w-full max-w-4xl mx-auto bg-background border-0 sm:border-0 rounded-none sm:rounded-lg shadow-none sm:shadow-sm">
        <CardHeader className="space-y-1 sm:px-6 px-0">
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">{newsletter.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 sm:px-6 px-0" ref={contentRef}>
          {newsletter.is_verified ? (
            <MarkdownRenderer content={newsletter.content} />
          ) : (
            <NewsletterVerificationForm newsletterId={params.id} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
