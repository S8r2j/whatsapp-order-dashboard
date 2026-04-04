/**
 * Application sidebar with navigation links and logout.
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS = [
  { to: '/dashboard', icon: HomeIcon, label: 'Dashboard', end: true },
  { to: '/dashboard/conversations', icon: ChatBubbleLeftRightIcon, label: 'Conversations', end: false },
  { to: '/dashboard/orders', icon: ClipboardDocumentListIcon, label: 'Orders', end: false },
  { to: '/dashboard/customers', icon: UsersIcon, label: 'Customers', end: false },
  { to: '/dashboard/settings', icon: Cog6ToothIcon, label: 'Settings', end: false },
];

export const Sidebar: React.FC = () => {
  const { shop, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-whatsapp-500 text-white font-bold text-sm">
          WA
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {shop?.name ?? 'My Shop'}
          </p>
          <p className="truncate text-xs text-gray-400">Order Manager</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 p-3">
        <div className="mb-2 px-3 py-1">
          <p className="text-xs text-gray-400 truncate">{shop?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};
