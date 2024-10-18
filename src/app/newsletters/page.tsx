'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import NewsletterCard from '@/components/NewsletterCard';

export default function NewsletterListPage() {
  const [newsletters, setNewsletters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNewsletters() {
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching newsletters:', error);
        setError('エラーが発生しました。');
      } else {
        console.log('Fetched newsletters:', data);
        setNewsletters(data);
      }
    }

    fetchNewsletters();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">メルマガ一覧</h1>
      {newsletters.length === 0 ? (
        <div>メルマガはありません。</div>
      ) : (
        newsletters.map((newsletter) => (
          <NewsletterCard
            key={newsletter.id}
            id={newsletter.id}
            title={newsletter.title}
            createdAt={newsletter.created_at}
          />
        ))
      )}
    </div>
  );
}
