/**
 * 404 Not Found page.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
    <p className="text-8xl font-bold text-gray-200">404</p>
    <h1 className="mt-4 text-2xl font-semibold text-gray-800">Page not found</h1>
    <p className="mt-2 text-sm text-gray-500">
      The page you're looking for doesn't exist.
    </p>
    <Link
      to="/dashboard"
      className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
    >
      Back to Dashboard
    </Link>
  </div>
);
