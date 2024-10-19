"use client"; // 追加

import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose max-w-none text-white"> {/* 色を白に変更 */}
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
