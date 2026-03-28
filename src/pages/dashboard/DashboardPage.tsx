/**
 * Dashboard overview page — shows today's order stats and recent orders.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';
import { useOrders } from '@/hooks/useOrders';
import { StatCard } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency, summariseItems, timeAgo } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useConnections } from '@/hooks/useConnections';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const { data: connections } = useConnections();
  const hasWhatsAppConnected = connections?.some(
    (connection) =>
      connection.platform === 'whatsapp' &&
      connection.status === 'connected' &&
      connection.is_active
  );

  const { data: allOrders, isLoading } = useOrders({
    from_date: `${today}T00:00:00`,
    size: 100,
  });

  const { data: recentOrders } = useOrders({ size: 5 });

  const orders = allOrders?.items ?? [];

  const totalToday = orders.length;
  const newOrders = orders.filter((o) => o.status === 'new').length;
  const pending = orders.filter(
    (o) => o.status === 'confirmed' || o.status === 'ready'
  ).length;
  const revenue = orders
    .filter((o) => o.total_amount != null)
    .reduce((sum, o) => sum + (o.total_amount ?? 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {!hasWhatsAppConnected && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-5 py-4 text-sm text-orange-900 flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold">⚠ No WhatsApp connected</p>
            <p className="text-xs text-orange-900/80">
              Connect your WhatsApp Business Account to receive and manage WhatsApp orders.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/settings')}>
            Connect WhatsApp →
          </Button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Orders Today"
          value={totalToday}
          icon={<ClipboardDocumentListIcon className="h-6 w-6" />}
        />
        <StatCard
          title="New Orders"
          value={newOrders}
          subtitle={newOrders > 0 ? 'Need confirmation' : 'All confirmed'}
          icon={<ClockIcon className="h-6 w-6" />}
        />
        <StatCard
          title="In Progress"
          value={pending}
          icon={<CheckCircleIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Revenue Today"
          value={formatCurrency(revenue)}
          icon={<CurrencyRupeeIcon className="h-6 w-6" />}
        />
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <button
            onClick={() => navigate('/dashboard/orders')}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {(recentOrders?.items ?? []).length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              No orders yet. Waiting for your first WhatsApp order!
            </div>
          ) : (
            (recentOrders?.items ?? []).map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {order.customer_name ?? order.customer_phone ?? 'Unknown customer'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {summariseItems(order.items)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={order.status} />
                  <span className="text-xs text-gray-400">{timeAgo(order.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Status bar chart */}
      {totalToday > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Today's Breakdown</h2>
          <div className="space-y-2">
            {(['new', 'confirmed', 'ready', 'delivered', 'cancelled'] as const).map((status) => {
              const count = orders.filter((o) => o.status === status).length;
              const pct = totalToday > 0 ? (count / totalToday) * 100 : 0;
              const colors: Record<string, string> = {
                new: 'bg-blue-400',
                confirmed: 'bg-yellow-400',
                ready: 'bg-green-400',
                delivered: 'bg-gray-400',
                cancelled: 'bg-red-400',
              };
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-gray-500 capitalize">{status}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${colors[status]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs font-medium text-gray-700">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
