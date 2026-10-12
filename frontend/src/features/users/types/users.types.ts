import { User } from '@/types/api.types';

export interface UsersListResponse {
  message: string;
  users: User[];
  count: number;
}

export interface UserDetailResponse {
  message: string;
  user: User;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
}
