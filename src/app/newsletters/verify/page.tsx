"use client";

import { NewsletterVerificationForm } from '@/components/NewsletterVerificationForm';

export default function NewsletterVerificationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">メルマガ照合</h1>
      <NewsletterVerificationForm />
    </div>
  );
}
