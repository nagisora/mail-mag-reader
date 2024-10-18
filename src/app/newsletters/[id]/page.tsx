"use client"; // 追加

import MarkdownRenderer from '@/components/MarkdownRenderer';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewsletterDetailPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewsletter() {
      const { data, error } = await supabase
        .from('newsletters')
        .select('content')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching newsletter:', error);
      } else {
        setContent(data.content);
      }
      setLoading(false);
    }

    fetchNewsletter();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <ReadingProgressBar />
      <h1 className="text-3xl font-bold mb-4">メルマガ詳細</h1>
      <p className="mb-4 text-white">メルマガID: {params.id}</p> {/* 色を白に変更 */}
      <MarkdownRenderer content={content || ''} />
    </div>
  );
}
