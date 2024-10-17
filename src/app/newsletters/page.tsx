import NewsletterCard from '@/components/NewsletterCard';

// この部分は後でAPIから取得するデータに置き換えます
const dummyNewsletters = [
  { id: '1', title: 'テストメルマガ1', createdAt: '2024-03-01T00:00:00Z' },
  { id: '2', title: 'テストメルマガ2', createdAt: '2024-03-02T00:00:00Z' },
  { id: '3', title: 'テストメルマガ3', createdAt: '2024-03-03T00:00:00Z' },
];

export default function NewsletterListPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">メルマガ一覧</h1>
      {dummyNewsletters.map((newsletter) => (
        <NewsletterCard
          key={newsletter.id}
          id={newsletter.id}
          title={newsletter.title}
          createdAt={newsletter.createdAt}
        />
      ))}
    </div>
  );
}
