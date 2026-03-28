/**
 * Customer detail page — profile, stats, and order history.
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useCustomer, useCustomerOrders, useUpdateCustomer } from '@/hooks/useCustomers';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { formatDate, formatPhone, getInitials, summariseItems, timeAgo } from '@/lib/utils';
import type { OrderStatus } from '@/types';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: customer, isLoading } = useCustomer(id);
  const { data: ordersData } = useCustomerOrders(id);
  const updateCustomer = useUpdateCustomer();

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');

  const startEditing = () => {
    setNameValue(customer?.name ?? '');
    setEditingName(true);
  };

  const saveName = () => {
    if (!id || !nameValue.trim()) return;
    updateCustomer.mutate(
      { id, name: nameValue.trim() },
      { onSuccess: () => setEditingName(false) }
    );
  };

  if (isLoading || !customer) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  const orders = ordersData?.items ?? [];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/customers')}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Customer Profile</h1>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Profile card */}
        <Card className="col-span-1">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 text-2xl font-bold">
              {getInitials(customer.name ?? customer.phone_number)}
            </div>

            {editingName ? (
              <div className="flex w-full gap-2">
                <Input
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  className="text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={saveName} loading={updateCustomer.isPending}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">
                  {customer.name ?? 'Unnamed customer'}
                </p>
                <button onClick={startEditing} className="text-gray-400 hover:text-gray-600">
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            <p className="text-sm text-gray-500">{formatPhone(customer.phone_number)}</p>
          </div>

          <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total orders</span>
              <span className="font-semibold">{customer.total_orders}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Customer since</span>
              <span className="font-medium">{formatDate(customer.created_at)}</span>
            </div>
          </div>
        </Card>

        {/* Orders history */}
        <Card className="col-span-2" padding="none">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Order History</h2>
          </div>
          {orders.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              No orders found for this customer.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {summariseItems(order.items)}
                    </p>
                    <p className="text-xs text-gray-400">{timeAgo(order.created_at)}</p>
                  </div>
                  <StatusBadge status={order.status as OrderStatus} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
