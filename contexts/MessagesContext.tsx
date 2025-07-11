import React, { createContext, useContext, useState, ReactNode } from 'react';
import conversationsService, { Message, SendMessageDto } from '../services/conversationsService';

interface MessagesContextType {
  // State
  messages: Message[];
  currentPage: number;
  hasMoreMessages: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean;
  error: string | null;

  // Actions
  loadMessages: (conversationId: string, page?: number) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const useMessages = (): MessagesContextType => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};

interface MessagesProviderProps {
  children: ReactNode;
}

export const MessagesProvider: React.FC<MessagesProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = async (conversationId: string, page: number = 1) => {
    setIsLoadingMessages(true);
    setError(null);
    try {
      const conversation = await conversationsService.getConversation(conversationId);
      
      if (page === 1) {
        // First load - replace all messages
        setMessages(conversation.messages || []);
        setCurrentPage(1);
      } else {
        // Pagination - append messages
        const newMessages = conversation.messages || [];
        setMessages(prev => [...prev, ...newMessages]);
        setCurrentPage(page);
      }
      
      // Simple pagination check - if we got fewer than expected, we're at the end
      setHasMoreMessages((conversation.messages?.length || 0) >= 20);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!content.trim()) return;
    
    setIsSendingMessage(true);
    setError(null);
    
    // Optimistic update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'user'
    };
    
    setMessages(prev => [tempMessage, ...prev]);
    
    try {
      const sentMessage = await conversationsService.sendMessage(conversationId, {
        content: content.trim()
      });
      
      // Replace temp message with real one
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? sentMessage : msg
      ));
    } catch (err) {
      console.error('Error sending message:', err);
      // Remove temp message on failure
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setError('Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setCurrentPage(1);
    setHasMoreMessages(true);
  };

  const clearError = () => {
    setError(null);
  };

  const value: MessagesContextType = {
    messages,
    currentPage,
    hasMoreMessages,
    isLoadingMessages,
    isSendingMessage,
    error,
    loadMessages,
    sendMessage,
    clearMessages,
    clearError,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};