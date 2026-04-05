/**
 * React Query hooks for customer data fetching and mutations.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { get, patch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import type { Customer, Order, PaginatedResponse } from '@/types';

interface CustomerListParams {
  page?: number;
  size?: number;
}

/** Fetch a paginated list of customers. */
export function useCustomers(params: CustomerListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.customers.list(params),
    queryFn: () =>
      get<PaginatedResponse<Customer>>('/api/v1/customers', { params }),
  });
}

/** Fetch a single customer by ID. */
export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.customers.detail(id!),
    queryFn: () => get<Customer>(`/api/v1/customers/${id}`),
    enabled: Boolean(id),
  });
}

/** Fetch orders for a specific customer. */
export function useCustomerOrders(customerId: string | undefined, params: { page?: number; size?: number } = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.customers.orders(customerId!),
    queryFn: () =>
      get<PaginatedResponse<Order>>(`/api/v1/customers/${customerId}/orders`, { params }),
    enabled: Boolean(customerId),
  });
}

/** Update a customer's display name. */
export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      patch<Customer>(`/api/v1/customers/${id}`, { name }),
    onSuccess: (data) => {
      qc.setQueryData(QUERY_KEYS.customers.detail(data.id), data);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.customers.all });
      toast.success('Customer updated');
    },
  });
}
