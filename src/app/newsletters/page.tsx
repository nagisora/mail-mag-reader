'use client';

import { NewsletterList } from '@/components/NewsletterList';

export default function NewsletterListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">メルマガ一覧</h1>
      <NewsletterList />
    </div>
  );
}
