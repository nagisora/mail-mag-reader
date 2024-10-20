"use client"; // 追加

import ReactMarkdown from 'react-markdown';
import './markdownStyles.css'; // 新しいCSSファイルをインポート

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert markdown-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
