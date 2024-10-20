import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Typography } from "@/components/ui/typography";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // URLを検出してMarkdownのリンク形式に変換する関数
  const convertUrlsToLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `[${url}](${url})`);
  };

  // コンテンツ全体のURLをリンクに変換
  const contentWithLinks = convertUrlsToLinks(content);

  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => (
          <Typography variant="h2" className="text-4xl font-bold mt-6 mb-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <Typography variant="h3" className="text-3xl font-semibold mt-5 mb-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <Typography variant="h4" className="text-2xl font-semibold mt-4 mb-2" {...props} />
        ),
        p: ({ node, ...props }) => (
          <Typography variant="p" className="mt-2 mb-4">
            {React.Children.map(props.children, child => {
              if (typeof child === 'string') {
                return <span dangerouslySetInnerHTML={{ __html: convertUrlsToLinks(child) }} />;
              }
              return child;
            })}
          </Typography>
        ),
        a: ({ node, href, children, ...props }) => (
          <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
            {children}
          </a>
        ),
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {contentWithLinks}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
