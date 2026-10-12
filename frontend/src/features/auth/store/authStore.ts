import { create } from 'zustand';
import { User } from '@/types/api.types';
import { authApi } from '../api/authApi';
import { AvatarStyle } from '@/components/ui/Avatar';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  avatarStyle: AvatarStyle;
  avatarSeed: string;
  setUser: (user: User | null, token?: string) => void;
  setAvatarStyle: (style: AvatarStyle) => void;
  setAvatarSeed: (seed: string) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    try {
      const stored = localStorage.getItem('acq_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  isAuthenticated: Boolean(localStorage.getItem('acq_user')),
  isLoading: false,
  avatarStyle:
    (localStorage.getItem('acq_avatar_style') as AvatarStyle) || 'lorelei',
  avatarSeed: localStorage.getItem('acq_avatar_seed') || '',

  setUser: (user: User | null, token?: string) => {
    if (user) {
      localStorage.setItem('acq_user', JSON.stringify(user));
      if (token) {
        localStorage.setItem('acq_token', token);
      }
      set({ user, isAuthenticated: true });
    } else {
      localStorage.removeItem('acq_user');
      localStorage.removeItem('acq_token');
      set({ user: null, isAuthenticated: false });
    }
  },

  setAvatarStyle: (style: AvatarStyle) => {
    localStorage.setItem('acq_avatar_style', style);
    set({ avatarStyle: style });
  },

  setAvatarSeed: (seed: string) => {
    localStorage.setItem('acq_avatar_seed', seed);
    set({ avatarSeed: seed });
  },

  logout: async () => {
    try {
      await authApi.signout();
    } catch (e) {
      console.warn('Signout API call failed:', e);
    } finally {
      localStorage.removeItem('acq_user');
      localStorage.removeItem('acq_token');
      set({ user: null, isAuthenticated: false });
      window.location.href = '/login';
    }
  },

  checkSession: async () => {
    if (
      !localStorage.getItem('acq_user') &&
      !localStorage.getItem('acq_token')
    ) {
      return;
    }
    try {
      set({ isLoading: true });
      const { user } = await authApi.getMe();
      get().setUser(user);
    } catch {
      localStorage.removeItem('acq_user');
      localStorage.removeItem('acq_token');
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
