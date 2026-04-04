/**
 * Empty state placeholder shown when a list has no items.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center py-12 text-center',
      className
    )}
  >
    {icon && (
      <div className="mb-4 rounded-full bg-gray-100 p-4 text-gray-400">
        {icon}
      </div>
    )}
    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    {description && (
      <p className="mt-1 text-sm text-gray-500 max-w-xs">{description}</p>
    )}
    {action && (
      <div className="mt-4">
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      </div>
    )}
  </div>
);
