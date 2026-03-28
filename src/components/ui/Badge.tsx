/**
 * Badge component — small pill used for status labels and counts.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { STATUS_CONFIG } from '@/lib/constants';
import type { OrderStatus } from '@/types';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      badgeVariants[variant],
      className
    )}
  >
    {children}
  </span>
);
