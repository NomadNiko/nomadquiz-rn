import { API_CONFIG } from '../config/api';

export interface Friend {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  photo?: {
    path: string;
  };
}

export interface FriendRequest {
  id: string;
  requester: Friend;
  recipient: Friend;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

class FriendsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.apiPath}`;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If we can't parse the error response, use the default message
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getFriendsList(authToken: string): Promise<Friend[]> {
    const response = await this.makeRequest('/friends/list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    // Extract friends from the friend requests - handle both requester and recipient
    if (!response.data) return [];
    
    const currentUserId = response.currentUserId;
    return response.data.map((friendRequest: FriendRequest) => {
      // Return the friend (the other person in the friendship)
      if (friendRequest.requester?.id === currentUserId) {
        return friendRequest.recipient;
      } else {
        return friendRequest.requester;
      }
    }).filter(Boolean).filter(friend => friend && friend.id); // Filter out null/undefined friends
  }

  async sendFriendRequest(authToken: string, recipientUsername: string): Promise<void> {
    await this.makeRequest('/friends/requests', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ recipientUsername }),
    });
  }

  async sendFriendRequestById(authToken: string, recipientId: string, recipientUsername: string): Promise<void> {
    // Use username for the API call since that's what the backend expects
    await this.sendFriendRequest(authToken, recipientUsername);
  }

  async getReceivedRequests(authToken: string): Promise<FriendRequest[]> {
    const response = await this.makeRequest('/friends/requests/received', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data || [];
  }

  async getSentRequests(authToken: string): Promise<FriendRequest[]> {
    const response = await this.makeRequest('/friends/requests/sent', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data || [];
  }

  async acceptFriendRequest(authToken: string, requestId: string): Promise<void> {
    await this.makeRequest(`/friends/requests/${requestId}/accept`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  async rejectFriendRequest(authToken: string, requestId: string): Promise<void> {
    await this.makeRequest(`/friends/requests/${requestId}/reject`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  async cancelFriendRequest(authToken: string, requestId: string): Promise<void> {
    await this.makeRequest(`/friends/requests/${requestId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  async searchUsers(authToken: string, search: string): Promise<Friend[]> {
    const response = await this.makeRequest(`/friends/search?search=${encodeURIComponent(search)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data || [];
  }
}

export const friendsService = new FriendsService();