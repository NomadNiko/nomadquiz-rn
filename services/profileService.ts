import { API_CONFIG } from '../config/api';

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  username?: string;
  photo?: {
    uri: string;
  };
}

interface FileUploadResponse {
  file: {
    id: string;
    path: string;
  };
}

class ProfileService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.apiPath}`;
  }

  async uploadFile(authToken: string, imageUri: string): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await fetch(`${this.baseUrl}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'File upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  async updateProfile(authToken: string, profileData: ProfileUpdateData): Promise<any> {
    try {
      const updateData: any = {};
      
      if (profileData.firstName) {
        updateData.firstName = profileData.firstName;
      }
      if (profileData.lastName) {
        updateData.lastName = profileData.lastName;
      }
      if (profileData.username) {
        updateData.username = profileData.username;
      }

      // If photo is provided, upload it first
      if (profileData.photo?.uri) {
        const uploadResponse = await this.uploadFile(authToken, profileData.photo.uri);
        updateData.photo = uploadResponse.file;
      }

      const response = await fetch(`${this.baseUrl}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Profile update failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }

  async uploadAvatar(authToken: string, imageUri: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);

      const response = await fetch(`${this.baseUrl}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Avatar upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Avatar upload failed:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();