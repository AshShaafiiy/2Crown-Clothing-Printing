"use client";
import { create } from 'zustand';
import { User } from '../domain/models';
import { services } from '../services';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: { name: string; email: string; phone?: string }) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string): Promise<User> => {
    set({ isLoading: true, error: null });
    try {
      const user = await services.auth.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
      return user;
    } catch (err: any) {
      const message = err?.message || err?.data?.error || 'Invalid credentials';
      set({ user: null, isAuthenticated: false, isLoading: false, error: message });
      throw err;
    }
  },

  logout: async () => {
    try {
      await services.auth.logout();
    } catch {
      // ignore logout errors
    }
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await services.auth.getCurrentUser();
      if (user) {
        // Verify user has admin-level role
        const adminRoles = ['root_super_admin', 'super_admin', 'admin'];
        if (adminRoles.includes(user.role)) {
          set({ user, isAuthenticated: true, isLoading: false });
        } else {
          // Customer role - not authorized for admin
          await services.auth.logout();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  
  updateProfile: async (data: { name: string; email: string; phone?: string }) => {
    try {
      const user = await services.auth.updateProfile(data);
      set({ user });
    } catch (err: any) {
      throw err;
    }
  }
}));
