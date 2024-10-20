'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import NewsletterCard from '@/components/NewsletterCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Newsletter {
  id: string;
  title: string;
  created_at: string;
  is_verified: boolean;
}

export function NewsletterList() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNewsletters() {
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching newsletters:', error);
        setError('メルマガの取得中にエラーが発生しました。');
      } else {
        setNewsletters(data || []);
      }
    }

    fetchNewsletters();
  }, []);

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
