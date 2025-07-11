import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import conversationsService, { Conversation } from '../services/conversationsService';

interface ConversationsListContextType {
  // State
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadConversations: () => Promise<void>;
  selectConversation: (conversation: Conversation) => void;
  createConversation: (participantIds: string[], name?: string) => Promise<Conversation>;
  deleteConversation: (conversationId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

const ConversationsListContext = createContext<ConversationsListContextType | undefined>(undefined);

export const useConversationsList = (): ConversationsListContextType => {
  const context = useContext(ConversationsListContext);
  if (!context) {
    throw new Error('useConversationsList must be used within a ConversationsListProvider');
  }
  return context;
};

interface ConversationsListProviderProps {
  children: ReactNode;
}

export const ConversationsListProvider: React.FC<ConversationsListProviderProps> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const conversationsList = await conversationsService.getConversations();
      setConversations(conversationsList);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  const createConversation = async (participantIds: string[], name?: string) => {
    try {
      const newConversation = await conversationsService.createConversation({
        participantIds,
        name
      });
      setConversations(prev => [newConversation, ...prev]);
      return newConversation;
    } catch (err) {
      console.error('Error creating conversation:', err);
      throw err;
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await conversationsService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
      throw err;
    }
  };

  const refreshData = async () => {
    await loadConversations();
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const value: ConversationsListContextType = {
    conversations,
    currentConversation,
    isLoading,
    error,
    loadConversations,
    selectConversation,
    createConversation,
    deleteConversation,
    refreshData,
    clearError,
  };

  return (
    <ConversationsListContext.Provider value={value}>
      {children}
    </ConversationsListContext.Provider>
  );
};