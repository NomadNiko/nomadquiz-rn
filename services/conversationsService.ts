import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

const API_BASE = `${API_CONFIG.baseUrl}${API_CONFIG.apiPath}`;

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photo?: {
    id: string;
    path: string;
  } | null;
  role?: {
    id: string | number;
    name?: string;
  };
}

export interface Conversation {
  id: string;
  participants: User[];
  name?: string;
  lastMessageAt: string;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId?: User; // Optional for system messages
  content: string;
  timestamp: string;
  type?: 'user' | 'system';
  createdAt: string;
  updatedAt: string;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateConversationDto {
  participantIds: string[];
  name?: string;
}

export interface UpdateConversationDto {
  name?: string;
}

export interface SendMessageDto {
  content: string;
}

// Helper function to clean conversation data (minimal processing needed now)
const cleanConversationData = (conversation: any): Conversation => {
  if (!conversation) {
    throw new Error('Conversation data is null or undefined');
  }

  return conversation;
};

// Helper function to clean message data (minimal processing needed now)
const cleanMessageData = (message: any): Message => {
  return message;
};

class ConversationsService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('nomadquiz_token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE}/conversations`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        const cleanedConversations = data.map(cleanConversationData);
        return cleanedConversations;
      }

      return [];
    } catch (error) {
      console.error('Get conversations error:', error);
      throw error;
    }
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE}/conversations/${conversationId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch conversation: ${response.status}`);
      }

      const data = await response.json();

      const cleanedConversation = cleanConversationData(data);
      return cleanedConversation;
    } catch (error) {
      console.error('Get conversation error:', error);
      throw error;
    }
  }

  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<MessagesResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const url = `${API_BASE}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`;

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();

      const cleanedMessages = {
        ...data,
        messages: data.messages?.map(cleanMessageData) || [],
      };

      return cleanedMessages;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  async sendMessage(conversationId: string, messageData: SendMessageDto): Promise<Message> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const data = await response.json();

      const cleanedMessage = cleanMessageData(data);
      return cleanedMessage;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  async createConversation(conversationData: CreateConversationDto): Promise<Conversation> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE}/conversations`, {
        method: 'POST',
        headers,
        body: JSON.stringify(conversationData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create conversation: ${response.status}`);
      }

      const data = await response.json();

      const cleanedConversation = cleanConversationData(data);
      return cleanedConversation;
    } catch (error) {
      console.error('Create conversation error:', error);
      throw error;
    }
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const headers = await this.getAuthHeaders();
      const url = `${API_BASE}/conversations/users/search?q=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to search users: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        return data;
      }

      return [];
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }


  async deleteConversation(conversationId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE}/conversations/${conversationId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to delete conversation: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete conversation error:', error);
      throw error;
    }
  }

  async updateConversation(
    conversationId: string,
    updateData: UpdateConversationDto
  ): Promise<Conversation> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE}/conversations/${conversationId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update conversation: ${response.status}`);
      }

      const data = await response.json();
      const cleanedConversation = cleanConversationData(data);
      return cleanedConversation;
    } catch (error) {
      console.error('Update conversation error:', error);
      throw error;
    }
  }

  async addParticipant(conversationId: string, participantId: string): Promise<Conversation> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE}/conversations/${conversationId}/participants`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ participantId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Service: Add participant error response:', errorText);
        throw new Error(`Failed to add participant: ${response.status}`);
      }

      const data = await response.json();
      const cleanedConversation = cleanConversationData(data);
      return cleanedConversation;
    } catch (error) {
      console.error('Add participant error:', error);
      throw error;
    }
  }

  async removeParticipant(conversationId: string, participantId: string): Promise<Conversation> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(
        `${API_BASE}/conversations/${conversationId}/participants/${participantId}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Service: Remove participant error response:', errorText);
        throw new Error(`Failed to remove participant: ${response.status}`);
      }

      const data = await response.json();
      const cleanedConversation = cleanConversationData(data);
      return cleanedConversation;
    } catch (error) {
      console.error('Remove participant error:', error);
      throw error;
    }
  }
}

export default new ConversationsService();
