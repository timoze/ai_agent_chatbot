'use client';
import { useRef, useEffect } from 'react';
import Message from './Message';
import LoadingDots from './LoadingDots';

export default function ChatHistory({ messages, isLoading }) {
  const bottomRef = useRef(null);
  
  // Scroll to bottom when messages change or when loading
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  // Welcome message content
  const WelcomeMessage = () => (
    <div className="text-center py-8 px-4">
      <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Welcome to AI Chat Assistant!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Ask me anything and I'll do my best to help you.
      </p>
      <div className="flex flex-col md:flex-row gap-2 justify-center">
        <ExamplePrompt text="Explain quantum computing" />
        <ExamplePrompt text="Write a poem about technology" />
        <ExamplePrompt text="Help me debug my code" />
      </div>
    </div>
  );
  
  // Example prompt button
  const ExamplePrompt = ({ text }) => (
    <button 
      className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
      onClick={() => console.log('Example clicked:', text)}
    >
      {text}
    </button>
  );
  
  return (
    <div className="flex flex-col space-y-4">
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        <>
          {messages.map((message) => (
            <Message key={message.conversation_id} message={message} />
          ))}
        </>
      )}
      
      {isLoading && (
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg max-w-md">
            <LoadingDots />
          </div>
        </div>
      )}
      
      {/* Invisible element to scroll to */}
      <div ref={bottomRef} />
    </div>
  );
}