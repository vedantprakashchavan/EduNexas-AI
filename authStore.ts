import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAuth: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),
  setAccessToken: (token) => set((state) => ({
    user: state.user,
    accessToken: token,
    isAuthenticated: Boolean(state.user) || Boolean(token),
  })),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
  updateUser: (user) => set({ user, isAuthenticated: true }),
}));
