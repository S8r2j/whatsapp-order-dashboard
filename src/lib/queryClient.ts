/**
 * TanStack React Query client configuration.
 *
 * Global defaults:
 * - staleTime: 30 seconds — data is considered fresh for 30s after fetch.
 * - retry: 1 — retry failed requests once before showing error state.
 * - refetchOnWindowFocus: true — refresh data when user returns to tab.
 */

import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { ApiError } from '@/types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: {
      onError: (error: unknown) => {
        const apiError = error as { response?: { data?: ApiError } };
        const message =
          apiError?.response?.data?.error?.message ??
          'Something went wrong. Please try again.';
        toast.error(message);
      },
    },
  },
});
