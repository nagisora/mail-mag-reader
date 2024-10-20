'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import NewsletterCard from '@/components/NewsletterCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useUser } from '@/hooks/useUser';
import { Skeleton } from "@/components/ui/skeleton";

interface Newsletter {
  id: string;
  title: string;
  created_at: string;
  is_verified: boolean;
}

export function NewsletterList() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, loading } = useUser();

  useEffect(() => {
    async function fetchNewsletters() {
      if (!user) return;

      const { data, error } = await supabase
        .from('reading_progress')
        .select(`
          newsletter_id,
          is_verified,
          newsletters (
            id,
            title,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching newsletters:', error);
        setError('メルマガの取得中にエラーが発生しました。');
      } else {
        const newsletters = data?.map(item => ({
          id: item.newsletters.id,
          title: item.newsletters.title,
          created_at: item.newsletters.created_at,
          is_verified: item.is_verified
        }));
        setNewsletters(newsletters || []);
      }
    }

    if (user) {
      fetchNewsletters();
    }
  }, [user]);

  if (loading) {
    return <Skeleton className="w-full h-24" />;
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>エラー</AlertTitle>
        <AlertDescription>ユーザーが認証されていません。ログインしてください。</AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>エラー</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (newsletters.length === 0) {
    return <div className="text-gray-600 dark:text-gray-400">メルマガはありません。</div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {newsletters.map((newsletter) => (
        <NewsletterCard
          key={newsletter.id}
          id={newsletter.id}
          title={newsletter.title}
          createdAt={newsletter.created_at}
          isVerified={newsletter.is_verified}
        />
      ))}
    </div>
  );
}
