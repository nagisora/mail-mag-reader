"use client"; // 追加

import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose max-w-none text-gray-800">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
