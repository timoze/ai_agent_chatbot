'use client';
import { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSendMessage, isLoading, disabled }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  
  // Auto resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Set new height
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, [message]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading || disabled) return;
    
    onSendMessage(message);
    setMessage('');
  };
  
  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 bg-white dark:bg-gray-800">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-grow resize-none py-3 px-4 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200 max-h-[200px] min-h-[56px]"
          rows={1}
        />
        
        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className={`p-3 m-1 rounded-md ${
            !message.trim() || isLoading || disabled
              ? 'text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
              : 'text-white bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          } transition-colors duration-200`}
          aria-label="Send message"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
      
      {disabled && !isLoading && (
        <p className="mt-2 text-xs text-center text-red-500">
          The chat is currently unavailable. Please check your connection to the API.
        </p>
      )}
      
      <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
        {isLoading ? 'AI is thinking...' : 'Press Enter to send, Shift+Enter for new line'}
      </p>
    </form>
  );
}