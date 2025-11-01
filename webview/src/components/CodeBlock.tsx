import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CodeBlockProps {
  content: string;
  language?: string;
}

export default function CodeBlock({ content, language = 'text' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (language === 'markdown') {
    return (
      <div className="markdown-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-language">{language}</span>
        <button 
          className="copy-button"
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy code'}
        >
          <span className={`codicon codicon-${copied ? 'check' : 'copy'}`}></span>
        </button>
      </div>
      <pre className="code-content">
        <code className={`language-${language}`}>{content}</code>
      </pre>
    </div>
  );
}
