"use client"; // 追加

import MarkdownRenderer from '@/components/MarkdownRenderer';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface NewsletterDetailPageProps {
  params: { id: string };
}

export default function NewsletterDetailPage({ params }: NewsletterDetailPageProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNewsletter() {
      try {
        const { data, error } = await supabase
          .from('newsletters')
          .select('title, content')
          .eq('id', params.id)
          .single();

        if (error) throw error;

        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error('Error fetching newsletter:', error);
        setError(error instanceof Error ? error.message : 'エラーが発生しました。');
      } finally {
        setLoading(false);
      }
    }

    fetchNewsletter();
  }, [params.id]);

  const handleProgressLoaded = (position: number) => {
    if (contentRef.current) {
      const scrollPosition = (position / 100) * (document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo(0, scrollPosition);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-6 bg-white dark:bg-gray-900" ref={contentRef}>
      <ReadingProgressBar newsletterId={params.id} onProgressLoaded={handleProgressLoaded} />
      <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">{title}</h1>
      <MarkdownRenderer content={content || ''} />
    </div>
  );
}
