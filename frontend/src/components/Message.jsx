'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function Message({ message }) {
  const [copied, setCopied] = useState(false);
  
  // Format the timestamp for display
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // User icon component
  const UserIcon = () => (
    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 text-primary-600 dark:text-primary-300">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  );
  
  // AI icon component
  const AIIcon = () => (
    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
    </div>
  );
  
  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={`flex space-x-3 mb-4 message-appear ${
      message.role === 'user' ? 'justify-end' : 'justify-start'
    }`}>
      {message.role !== 'user' && <AIIcon />}
      
      <div className={`relative max-w-md lg:max-w-2xl px-4 py-2 rounded-lg ${
        message.role === 'user' 
          ? 'bg-primary-500 text-white' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
      }`}>
        {/* Message content with markdown support */}
        <div className="prose dark:prose-invert prose-sm sm:prose-base">
          <ReactMarkdown
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark}
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
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        {/* Message footer with timestamp and copy button */}
        <div className="mt-1 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{formattedTime}</span>
          
          {message.role === 'assistant' && (
            <button 
              onClick={copyToClipboard}
              className="hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <span className="text-green-500 dark:text-green-400">Copied!</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      
      {message.role === 'user' && <UserIcon />}
    </div>
  );
}