/**
 * Utility functions used across the application.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * Use this instead of template literals for conditional class names.
 *
 * @example cn('px-4 py-2', isActive && 'bg-blue-500', 'rounded')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO 8601 date string to a human-readable datetime.
 * @example "Mar 18, 2026 3:45 PM"
 */
export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, yyyy h:mm a');
  } catch {
    return iso;
  }
}

/**
 * Format an ISO 8601 date string to a short date.
 * @example "Mar 18"
 */
export function formatDateShort(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d');
  } catch {
    return iso;
  }
}

/**
 * Return a relative time string ("2 hours ago", "just now").
 */
export function timeAgo(iso: string): string {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true });
  } catch {
    return iso;
  }
}

/**
 * Extract initials from a name string.
 * @example getInitials("John Doe") → "JD"
 * @example getInitials("Alice") → "A"
 */
export function getInitials(name: string): string {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Format a numeric amount as Indian Rupees.
 * @example formatCurrency(1234.5) → "₹1,234.50"
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a phone number for display.
 * Strips the country code for brevity in list views.
 * @example formatPhone("+919876543210") → "+91 98765 43210"
 */
export function formatPhone(phone: string): string {
  if (!phone) return '—';
  // Basic formatting for Indian numbers: +91 XXXXX XXXXX
  const match = phone.match(/^(\+\d{2})(\d{5})(\d{5})$/);
  if (match) return `${match[1]} ${match[2]} ${match[3]}`;
  return phone;
}

/**
 * Summarise order items into a short readable string.
 * @example summariseItems([{name:'Momos',qty:2},{name:'Tea',qty:1}]) → "2× Momos, 1× Tea"
 */
export function summariseItems(
  items: Array<{ name: string; qty: number }> | null | undefined
): string {
  if (!items?.length) return 'No items parsed';
  return items.map((i) => `${i.qty}× ${i.name}`).join(', ');
}

/**
 * Truncate a string to a maximum length, appending "…" if needed.
 */
export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max) + '…';
}
