import { apiClient } from '@/lib/api-client';
import {
  UsersListResponse,
  UserDetailResponse,
  UpdateUserPayload,
} from '../types/users.types';
import { User } from '@/types/api.types';

export const usersApi = {
  // Admin only
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<UsersListResponse>('/users');
    return response.data.users || [];
  },

  // Authenticated user (own profile) or Admin (any user)
  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get<UserDetailResponse>(`/users/${id}`);
    return response.data.user;
  },

  // Update user profile (Admin can change role; regular user can change own name/email)
  updateUser: async (id: number, payload: UpdateUserPayload): Promise<User> => {
    const response = await apiClient.put<UserDetailResponse>(
      `/users/${id}`,
      payload
    );
    return response.data.user;
  },

  // Admin only (cannot delete self)
  deleteUser: async (id: number): Promise<User> => {
    const response = await apiClient.delete<UserDetailResponse>(`/users/${id}`);
    return response.data.user;
  },
};
