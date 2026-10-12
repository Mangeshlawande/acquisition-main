import axios, { AxiosError } from 'axios';
import { ENV } from '@/config/env';

export interface SecurityEventDetail {
  type: 'rate_limit' | 'shield' | 'bot' | 'generic_security';
  message: string;
  statusCode: number;
}

type SecurityListener = (detail: SecurityEventDetail) => void;
const securityListeners: Set<SecurityListener> = new Set();

export function subscribeToSecurityEvents(listener: SecurityListener) {
  securityListeners.add(listener);
  return () => {
    securityListeners.delete(listener);
  };
}

function notifySecurityEvent(detail: SecurityEventDetail) {
  securityListeners.forEach(fn => fn(detail));
}

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true, // Sends and receives httpOnly authentication cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('acq_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const message =
        data?.message || data?.error || 'A network error occurred';

      // 401: Token expired or unauthorized
      if (status === 401) {
        localStorage.removeItem('acq_token');
        localStorage.removeItem('acq_user');
        if (
          typeof window !== 'undefined' &&
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/signup'
        ) {
          window.location.href = '/login';
        }
      }
      // Arcjet 429: Rate Limit
      else if (
        status === 429 ||
        (status === 403 && message.toLowerCase().includes('limit exceeded'))
      ) {
        notifySecurityEvent({
          type: 'rate_limit',
          message:
            message || 'Rate limit reached. Please slow down your requests.',
          statusCode: status,
        });
      }
      // Arcjet 403: Bot or Shield detection
      else if (
        status === 403 &&
        (message.toLowerCase().includes('bot') ||
          message.toLowerCase().includes('policy') ||
          message.toLowerCase().includes('forbidden'))
      ) {
        notifySecurityEvent({
          type: message.toLowerCase().includes('bot') ? 'bot' : 'shield',
          message:
            message || 'Request blocked by Arcjet security shield policy.',
          statusCode: status,
        });
      }
    }
    return Promise.reject(error);
  }
);
