/**
 * Orders page — Kanban board with 4 status columns + Cancelled tab.
 * Auto-refreshes every 30 seconds via React Query's refetchInterval.
 */

import React, { useState } from 'react';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useOrders } from '@/hooks/useOrders';
import { OrderCard } from '@/components/orders/OrderCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { KANBAN_COLUMNS, STATUS_CONFIG } from '@/lib/constants';
import type { OrderStatus } from '@/types';

type ViewMode = 'kanban' | 'cancelled';

export const OrdersPage: React.FC = () => {
  const [view, setView] = useState<ViewMode>('kanban');
  const { data, isLoading, dataUpdatedAt } = useOrders({ size: 200 });

  const orders = data?.items ?? [];
  const newCount = orders.filter((o) => o.status === 'new').length;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          {newCount > 0 && (
            <span className="flex h-6 w-6 animate-pulse items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
              {newCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Last updated {new Date(dataUpdatedAt).toLocaleTimeString()}
        </div>
      </div>

      {/* View tabs */}
      <div className="flex gap-1 border-b border-gray-200 bg-white px-6 pt-1">
        {(['kanban', 'cancelled'] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              view === v
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {v === 'kanban' ? 'Active Orders' : 'Cancelled'}
          </button>
        ))}
      </div>

      {/* Kanban board */}
      {view === 'kanban' ? (
        <div className="flex flex-1 gap-4 overflow-x-auto p-6">
          {KANBAN_COLUMNS.map((status) => {
            const columnOrders = orders.filter((o) => o.status === status);
            const config = STATUS_CONFIG[status as OrderStatus];
            return (
              <div
                key={status}
                className="flex w-72 flex-shrink-0 flex-col rounded-xl bg-gray-100"
              >
                {/* Column header */}
                <div className="flex items-center justify-between rounded-t-xl px-4 py-3">
                  <span className="text-sm font-semibold text-gray-700 capitalize">
                    {config.label}
                  </span>
                  <span
                    className={`flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-xs font-bold ${config.bgColor} ${config.color}`}
                  >
                    {columnOrders.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-2 overflow-y-auto p-3 pt-0 scrollbar-thin">
                  {columnOrders.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
                      <p className="text-xs text-gray-400">No {config.label.toLowerCase()} orders</p>
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Cancelled list */
        <div className="flex-1 overflow-y-auto p-6">
          {orders.filter((o) => o.status === 'cancelled').length === 0 ? (
            <EmptyState
              icon={<ClipboardDocumentListIcon className="h-8 w-8" />}
              title="No cancelled orders"
              description="Cancelled orders will appear here."
            />
          ) : (
            <div className="space-y-2">
              {orders
                .filter((o) => o.status === 'cancelled')
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
