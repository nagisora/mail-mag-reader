'use client';

import { NewsletterList } from '@/components/NewsletterList';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function NewsletterListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>メルマガ一覧</CardTitle>
          <CardDescription>購読中のメルマガ一覧です</CardDescription>
        </CardHeader>
        <CardContent>
          <NewsletterList />
        </CardContent>
      </Card>
    </div>
  );
}
