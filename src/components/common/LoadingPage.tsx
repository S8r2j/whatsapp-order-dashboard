/**
 * Full-page loading screen shown while auth state is being restored.
 */

import React from 'react';
import { Spinner } from '@/components/ui/Spinner';

export const LoadingPage: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" className="text-brand-600" />
      <p className="text-sm text-gray-500">Loading…</p>
    </div>
  </div>
);
