'use client';

import type { AuthState, User } from '@vaultx/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user: User, token: string) => {
        localStorage.setItem('token', token);
        set({ user, isAuthenticated: true, isLoading: false });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
