/**
 * Customers list page — searchable, paginated table.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useCustomers } from '@/hooks/useCustomers';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { formatDate, formatPhone, getInitials } from '@/lib/utils';

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useCustomers({ page, size: 20 });
  const customers = data?.items ?? [];

  return (
    <div className="p-6 space-y-5">
      <PageHeader
        title="Customers"
        subtitle={data ? `${data.total} total customers` : undefined}
      />

      {/* Search — visual only for now; wire to API when search param is added */}
      <div className="max-w-sm">
        <Input
          placeholder="Search by name or phone…"
          leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
          disabled
          helperText="Search coming soon"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" className="text-brand-600" />
          </div>
        ) : customers.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="h-8 w-8" />}
            title="No customers yet"
            description="Customers will appear here once they send their first WhatsApp order."
          />
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Customer', 'Phone', 'Total Orders', 'First Seen', ''].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => navigate(`/dashboard/customers/${customer.id}`)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
                          {getInitials(customer.name ?? customer.phone_number)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {customer.name ?? '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {formatPhone(customer.phone_number)}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">
                      {customer.total_orders}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {formatDate(customer.created_at)}
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-brand-600 hover:text-brand-700">
                      View →
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-gray-100 px-5 py-3">
              <Pagination
                page={data?.page ?? 1}
                pages={data?.pages ?? 1}
                total={data?.total ?? 0}
                size={data?.size ?? 20}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
