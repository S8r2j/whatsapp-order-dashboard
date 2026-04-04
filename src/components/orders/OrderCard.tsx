/**
 * Kanban card representing a single order.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';
import { cn, formatCurrency, getInitials, summariseItems, timeAgo } from '@/lib/utils';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();
  const customerName = order.customer_name ?? order.customer_phone ?? 'Unknown';
  const initials = getInitials(customerName);

  return (
    <div
      onClick={() => navigate(`/dashboard/orders/${order.id}`)}
      className={cn(
        'cursor-pointer rounded-xl bg-white border border-gray-200',
        'p-3 shadow-sm hover:shadow-md hover:border-brand-300',
        'transition-all duration-150 animate-in'
      )}
    >
      {/* Customer row */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{customerName}</p>
          {order.customer_phone && (
            <p className="truncate text-xs text-gray-400">{order.customer_phone}</p>
          )}
        </div>
        {order.total_amount != null && (
          <span className="flex-shrink-0 text-xs font-medium text-gray-600">
            {formatCurrency(order.total_amount)}
          </span>
        )}
      </div>

      {/* Items */}
      {order.items?.length > 0 && (
        <p className="mt-2 text-xs text-gray-600 line-clamp-2">
          {summariseItems(order.items)}
        </p>
      )}

      {/* Footer */}
      <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
        <ClockIcon className="h-3 w-3" />
        <span>{timeAgo(order.created_at)}</span>
      </div>
    </div>
  );
};
