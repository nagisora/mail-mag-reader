"use client"; // 追加

import MarkdownRenderer from '@/components/MarkdownRenderer';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsletterDetailPageProps {
  params: { id: string };
}

export default function NewsletterDetailPage({ params }: NewsletterDetailPageProps) {
  const [newsletter, setNewsletter] = useState<{ title: string; content: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNewsletter() {
      const { data, error } = await supabase
        .from('newsletters')
        .select('title, content')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching newsletter:', error);
        setError('メルマガの取得中にエラーが発生しました。');
      } else {
        setNewsletter(data);
      }
    }

    fetchNewsletter();
  }, [params.id]);

  const handleProgressLoaded = (position: number) => {
    if (position > 0) {
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
      <ReadingProgressBar newsletterId={params.id} onProgressLoaded={handleProgressLoaded} />
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{newsletter.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownRenderer content={newsletter.content} />
        </CardContent>
      </Card>
    </div>
  );
}
