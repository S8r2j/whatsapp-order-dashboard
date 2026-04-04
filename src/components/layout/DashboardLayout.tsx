/**
 * Main dashboard layout — sidebar + scrollable main content area.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => (
  <div className="flex h-screen overflow-hidden bg-gray-50">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);
