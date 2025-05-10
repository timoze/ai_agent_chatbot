'use client';
import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatBox from '@/components/ChatBox';
import NavBar from '@/components/NavBar';

export default function Home() {
  const { messages, sendMessage, isLoading, error } = useChat();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Update document class for dark mode
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <main className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
      <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="flex flex-col flex-grow w-full p-4 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
            AI Chat Assistant
          </h1>
          
          <div className="flex-grow flex flex-col">
            <ChatBox 
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              error={error}
            />
          </div>
          
          <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} AI Chat Assistant. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </main>
  );
}