/**
 * Order detail page — two-column layout with order info and message thread.
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useOrder, useUpdateOrderNotes, useUpdateOrderStatus } from '@/hooks/useOrders';
import { OrderMessages } from '@/components/orders/OrderMessages';
import { ReplyModal } from '@/components/orders/ReplyModal';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Spinner } from '@/components/ui/Spinner';
import { Textarea } from '@/components/ui/Input';
import { NEXT_STATUS } from '@/lib/constants';
import {
  formatCurrency,
  formatDate,
  formatPhone,
  getInitials,
  summariseItems,
} from '@/lib/utils';
import type { OrderStatus } from '@/types';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const updateNotes = useUpdateOrderNotes();

  const [replyOpen, setReplyOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [notesInitialised, setNotesInitialised] = useState(false);

  // Initialise notes from order on first load
  if (order && !notesInitialised) {
    setNotes(order.notes ?? '');
    setNotesInitialised(true);
  }

  if (isLoading || !order) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  const nextStatus = NEXT_STATUS[order.status as OrderStatus];
  const canCancel = !['delivered', 'cancelled'].includes(order.status);

  const handleAdvanceStatus = () => {
    if (!nextStatus) return;
    updateStatus.mutate({ id: order.id, status: nextStatus });
  };

  const handleNotesBlur = () => {
    if (notes !== (order.notes ?? '')) {
      updateNotes.mutate({ id: order.id, notes });
    }
  };

  const handleCancel = () => {
    updateStatus.mutate(
      { id: order.id, status: 'cancelled' },
      { onSuccess: () => setCancelOpen(false) }
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-4">
        <button
          onClick={() => navigate('/dashboard/orders')}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900">Order</h1>
            <span className="text-xs font-mono text-gray-400">
              #{order.id.slice(0, 8)}
            </span>
            <StatusBadge status={order.status as OrderStatus} />
          </div>
          <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ChatBubbleLeftIcon className="h-4 w-4" />}
            onClick={() => setReplyOpen(true)}
          >
            Reply
          </Button>
          {nextStatus && (
            <Button
              size="sm"
              onClick={handleAdvanceStatus}
              loading={updateStatus.isPending}
            >
              Mark as {nextStatus}
            </Button>
          )}
          {canCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setCancelOpen(true)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Body — two columns */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — order details */}
        <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4">
          {/* Customer card */}
          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold text-sm">
                {getInitials(order.customer_name ?? order.customer_phone ?? '?')}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {order.customer_name ?? 'Unknown customer'}
                </p>
                <p className="text-xs text-gray-500">
                  {formatPhone(order.customer_phone ?? '')}
                </p>
                {order.customer && (
                  <p className="text-xs text-gray-400">
                    {order.customer.total_orders} total orders
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Items */}
          <Card padding="sm">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Order Items
            </h3>
            {order.items && order.items.length > 0 ? (
              <ul className="space-y-1">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-medium text-gray-900">×{item.qty}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">No items parsed</p>
            )}
            {order.total_amount != null && (
              <div className="mt-3 flex justify-between border-t border-gray-100 pt-2 text-sm font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            )}
          </Card>

          {/* Notes */}
          <Card padding="sm">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Internal Notes
            </h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              rows={3}
              placeholder="Add notes visible only to you…"
              className="text-sm"
            />
          </Card>

          {/* Raw message (collapsible) */}
          {order.raw_message && (
            <details className="rounded-lg border border-gray-200 bg-white">
              <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700">
                Original message
              </summary>
              <p className="px-3 pb-3 text-xs text-gray-600 whitespace-pre-wrap break-words">
                {order.raw_message}
              </p>
            </details>
          )}
        </div>

        {/* Right — message thread */}
        <div className="flex flex-1 flex-col overflow-hidden bg-gray-50">
          <div className="border-b border-gray-200 bg-white px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-700">Message Thread</h2>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <OrderMessages messages={order.messages ?? []} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReplyModal orderId={order.id} isOpen={replyOpen} onClose={() => setReplyOpen(false)} />
      <ConfirmDialog
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Cancel this order?"
        description="This action will notify the customer that their order has been cancelled."
        confirmLabel="Yes, cancel order"
        loading={updateStatus.isPending}
      />
    </div>
  );
};
