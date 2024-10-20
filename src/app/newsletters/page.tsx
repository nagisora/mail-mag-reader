'use client';

import { NewsletterList } from '@/components/NewsletterList';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function NewsletterListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">メルマガ一覧</h1>
        <Button asChild>
          <Link href="/newsletters/verify">メルマガ照合</Link>
        </Button>
      </div>
      <NewsletterList />
    </div>
  );
}
