'use client';
import { useState, useCallback, useEffect } from 'react';
import { sendMessage as sendMessageApi } from '@/lib/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
        localStorage.removeItem('chatMessages');
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;
    
    // Clear any previous errors
    setError(null);
    
    // Add user message to chat
    const userMessage = {
      
      role: 'user',
      content,
      timestamp: new Date().toISOString(),

    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Send to API
      const response = await sendMessageApi(content);
      
      // Add AI response to chat
      const aiMessage = {
        role: 'assistant',
        content: response.content,
        conversation_id: response.conversation_id,
        timestamp: new Date(response.timestamp).toISOString(),
        model_used: response.model_used
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to get response from the AI');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading,
    error,
  };
}