"use client"; // 追加

import MarkdownRenderer from '@/components/MarkdownRenderer';
import ReadingProgressBar from '@/components/ReadingProgressBar';

// この部分は後でAPIから取得するデータに置き換えます
const dummyContent = `
# テストメルマガ

これはテスト用のメルマガコンテンツです。

## セクション1

Lorem ipsum dolor sit amet, consectetur adipiscing elit.

## セクション2

Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
`;

export default function NewsletterDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <ReadingProgressBar />
      <h1 className="text-3xl font-bold mb-4">メルマガ詳細</h1>
      <p className="mb-4 text-gray-600">メルマガID: {params.id}</p>
      <MarkdownRenderer content={dummyContent} />
    </div>
  );
}
