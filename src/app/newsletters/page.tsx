import { supabase } from '@/lib/supabase';
import NewsletterCard from '@/components/NewsletterCard';

export default async function NewsletterListPage() {
  const { data: newsletters, error } = await supabase
    .from('newsletters')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching newsletters:', error);
    return <div>エラーが発生しました。</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">メルマガ一覧</h1>
      {newsletters.map((newsletter) => (
        <NewsletterCard
          key={newsletter.id}
          id={newsletter.id}
          title={newsletter.title}
          createdAt={newsletter.created_at}
        />
      ))}
    </div>
  );
}
