'use client';
import { useState, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { checkHealth } from '@/lib/api';

export default function ChatBox({ onSendMessage, messages, isLoading, error }) {
  const [apiStatus, setApiStatus] = useState({ isOnline: false, checking: true });
  
  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await checkHealth();
        setApiStatus({ isOnline: true, checking: false });
      } catch (err) {
        console.error('API health check failed:', err);
        setApiStatus({ isOnline: false, checking: false });
      }
    };
    
    checkApiHealth();
  }, []);
  
  return (
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
      {/* API Status Check */}
      {apiStatus.checking ? (
        <div className="p-3 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Checking API connection...</span>
        </div>
      ) : !apiStatus.isOnline ? (
        <div className="p-3 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm flex items-center justify-center">
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>API is offline. Please check your backend server.</span>
        </div>
      ) : null}
      
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* Chat History */}
      <div className="flex-grow overflow-y-auto p-4">
        <ChatHistory messages={messages} />
      </div>
      
      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <ChatInput 
          onSendMessage={onSendMessage} 
          isLoading={isLoading} 
          disabled={!apiStatus.isOnline || isLoading}
        />
      </div>
    </div>
  );
}