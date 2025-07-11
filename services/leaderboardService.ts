import { API_CONFIG } from '../config/api';

export interface LeaderboardEntry {
  id: string;
  leaderboardId: string;
  score: number;
  timestamp: string;
  userId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}

class LeaderboardService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.apiPath}`;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getUserLeaderboardEntries(authToken: string, username: string): Promise<LeaderboardEntry[]> {
    const response = await this.makeRequest(`/leaderboards/users/${username}/entries`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data || [];
  }

  async getLeaderboard(authToken: string, leaderboardId: string, page = 1, limit = 10): Promise<LeaderboardEntry[]> {
    const response = await this.makeRequest(`/leaderboards/${leaderboardId}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data || [];
  }

  async getLeaderboardEntries(authToken: string, leaderboardId: string, options: { page?: number; limit?: number } = {}): Promise<{ data: LeaderboardEntry[]; total?: number; page?: number; limit?: number }> {
    const { page = 1, limit = 10 } = options;
    const response = await this.makeRequest(`/leaderboards/${leaderboardId}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return {
      data: response.data || [],
      total: response.total,
      page: response.page,
      limit: response.limit
    };
  }

  async getAllLeaderboards(authToken: string): Promise<any[]> {
    const response = await this.makeRequest('/leaderboards', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response || [];
  }

  async submitScore(authToken: string, leaderboardId: string, score: number): Promise<void> {
    await this.makeRequest('/leaderboards/submit', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        leaderboardId,
        score,
      }),
    });
  }

  async getUserScoreForLeaderboard(authToken: string, leaderboardId: string, username: string): Promise<LeaderboardEntry | null> {
    try {
      const response = await this.makeRequest(`/leaderboards/${leaderboardId}/users/${username}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response || null;
    } catch (error) {
      console.error('Error getting user score for leaderboard:', error);
      return null;
    }
  }
}

export const leaderboardService = new LeaderboardService();