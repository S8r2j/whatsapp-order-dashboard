/**
 * Zustand authentication store with localStorage persistence.
 *
 * The token and shop are persisted to localStorage under the key 'auth-storage'
 * so the user remains logged in across page refreshes.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Shop } from '@/types';

interface AuthState {
  token: string | null;
  shop: Shop | null;
  isAuthenticated: boolean;

  /** Called after a successful login or registration. */
  login: (token: string, shop: Shop) => void;

  /** Clears all auth state — called on logout or 401. */
  logout: () => void;

  /** Partial update to the shop profile (e.g. after settings save). */
  updateShop: (updates: Partial<Shop>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      shop: null,
      isAuthenticated: false,

      login: (token, shop) =>
        set({ token, shop, isAuthenticated: true }),

      logout: () =>
        set({ token: null, shop: null, isAuthenticated: false }),

      updateShop: (updates) => {
        const current = get().shop;
        if (current) {
          set({ shop: { ...current, ...updates } });
        }
      },
    }),
    {
      name: 'auth-storage',
      // Only persist these fields — don't persist derived state
      partialize: (state) => ({
        token: state.token,
        shop: state.shop,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
