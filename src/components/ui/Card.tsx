/**
 * Card container with optional header and padding variants.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
}) => (
  <div
    className={cn(
      'bg-white rounded-xl border border-gray-200 shadow-sm',
      paddingClasses[padding],
      className
    )}
  >
    {children}
  </div>
);

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  className,
}) => (
  <Card className={cn('flex items-center gap-4', className)}>
    {icon && (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        {icon}
      </div>
    )}
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </Card>
);
