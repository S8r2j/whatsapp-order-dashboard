/**
 * Application-wide constants.
 * Centralising these here avoids magic strings scattered across components.
 */

import type { OrderStatus, ConnectionStatus } from '@/types';

export const ORDER_STATUSES: OrderStatus[] = [
  'new',
  'confirmed',
  'ready',
  'delivered',
  'cancelled',
];

export const KANBAN_COLUMNS: OrderStatus[] = ['new', 'confirmed', 'ready', 'delivered'];

/** Visual config for each order status — used by StatusBadge and Kanban headers. */
export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  new: {
    label: 'New',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
  },
  ready: {
    label: 'Ready',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
  },
  delivered: {
    label: 'Delivered',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
  },
};

/** Next status in the order lifecycle — used for the quick-advance button. */
export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  new: 'confirmed',
  confirmed: 'ready',
  ready: 'delivered',
};

/** React Query key factory — keeps query keys consistent across hooks. */
export const QUERY_KEYS = {
  orders: {
    all: ['orders'] as const,
    list: (filters?: object) => ['orders', 'list', filters] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },
  customers: {
    all: ['customers'] as const,
    list: (params?: object) => ['customers', 'list', params] as const,
    detail: (id: string) => ['customers', 'detail', id] as const,
    orders: (id: string) => ['customers', id, 'orders'] as const,
  },
  connections: {
    all: ['connections'] as const,
    list: () => ['connections', 'list'] as const,
    detail: (id: string) => ['connections', 'detail', id] as const,
  },
  shop: {
    profile: ['shop', 'profile'] as const,
  },
} as const;

export const CONNECTION_STATUS_CONFIG: Record<
  ConnectionStatus,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  connected: {
    label: 'Connected',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: '✓',
  },
  expired: {
    label: 'Token Expired',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: '⚠',
  },
  revoked: {
    label: 'Disconnected',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: '✕',
  },
  error: {
    label: 'Error',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: '✕',
  },
};

/** Polling interval for orders (milliseconds). */
export const ORDERS_POLL_INTERVAL = 30_000;
