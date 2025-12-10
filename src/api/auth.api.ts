import { apiClient } from './client';

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  value?: {
    user: {
      _id: string;
      email: string;
      name: string;
      role: string;
    };
    accessToken: string;
  };
  error?: {
    message: string;
  };
}

export const authApi = {
  login: async (data: LoginDto): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
