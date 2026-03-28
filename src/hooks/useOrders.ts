/**
 * React Query hooks for order data fetching and mutations.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { get, patch, post } from '@/lib/api';
import { ORDERS_POLL_INTERVAL, QUERY_KEYS } from '@/lib/constants';
import type { Order, OrderDetail, PaginatedResponse } from '@/types';

interface OrderFilters {
  status?: string;
  customer_id?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  size?: number;
}

/** Fetch a paginated, filtered list of orders. Polls every 30 seconds. */
export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.list(filters),
    queryFn: () =>
      get<PaginatedResponse<Order>>('/api/v1/orders', { params: filters }),
    refetchInterval: ORDERS_POLL_INTERVAL,
  });
}

/** Fetch a single order with its full message thread. */
export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.detail(id!),
    queryFn: () => get<OrderDetail>(`/api/v1/orders/${id}`),
    enabled: Boolean(id),
  });
}

/** Update an order's status. Invalidates both list and detail queries. */
export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      patch<OrderDetail>(`/api/v1/orders/${id}/status`, { status }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      qc.setQueryData(QUERY_KEYS.orders.detail(data.id), data);
      toast.success(`Order marked as ${data.status}`);
    },
  });
}

/** Update order notes and/or total amount. */
export function useUpdateOrderNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      notes,
      total_amount,
    }: {
      id: string;
      notes?: string;
      total_amount?: number;
    }) => patch<OrderDetail>(`/api/v1/orders/${id}/notes`, { notes, total_amount }),
    onSuccess: (data) => {
      qc.setQueryData(QUERY_KEYS.orders.detail(data.id), data);
      toast.success('Notes saved');
    },
  });
}

/** Send a manual WhatsApp reply to the customer. */
export function useReplyToOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      post<{ sent: boolean; message: string }>(`/api/v1/orders/${id}/reply`, { message }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(variables.id) });
      toast.success('Reply sent');
    },
  });
}
