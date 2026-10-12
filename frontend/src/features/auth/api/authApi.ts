import { apiClient } from '@/lib/api-client';
import { User } from '@/types/api.types';
import {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
} from '../types/auth.types';

export const authApi = {
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/sign-up',
      credentials
    );
    return response.data;
  },

  signin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/sign-in',
      credentials
    );
    return response.data;
  },

  signout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/auth/sign-out'
    );
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data;
  },
};
