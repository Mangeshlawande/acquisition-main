import { User } from '@/types/api.types';

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}
