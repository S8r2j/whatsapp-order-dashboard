/**
 * React Query hooks for shop profile fetching and mutations.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { get, patch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import type { Shop } from '@/types';

/** Fetch the authenticated shop's profile. */
export function useShop() {
  return useQuery({
    queryKey: QUERY_KEYS.shop.profile,
    queryFn: () => get<Shop>('/api/v1/shop/profile'),
  });
}

/** Update shop display name and/or phone number. */
export function useUpdateShop() {
  const qc = useQueryClient();
  const updateShopInStore = useAuthStore((s) => s.updateShop);

  return useMutation({
    mutationFn: (data: { name?: string; phone_number?: string }) =>
      patch<Shop>('/api/v1/shop/profile', data),
    onSuccess: (data) => {
      qc.setQueryData(QUERY_KEYS.shop.profile, data);
      updateShopInStore({ name: data.name, phone_number: data.phone_number });
      toast.success('Profile saved');
    },
  });
}

/** Update business hours. */
export function useUpdateBusinessHours() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (hours: Record<string, string>) =>
      patch<Shop>('/api/v1/shop/hours', { hours }),
    onSuccess: (data) => {
      qc.setQueryData(QUERY_KEYS.shop.profile, data);
      toast.success('Business hours updated');
    },
  });
}
