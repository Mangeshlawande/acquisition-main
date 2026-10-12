export interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
  error?: string;
  details?: string;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
  details?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at?: string;
  updated_at?: string;
}
