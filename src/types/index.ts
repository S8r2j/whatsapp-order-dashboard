/**
 * Shared TypeScript type definitions for the WhatsApp Order Manager.
 * All types mirror the backend Pydantic schemas for consistency.
 */

// ── Core entity types ─────────────────────────────────────────────────────────

export interface Shop {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  business_hours?: Record<string, string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  has_whatsapp_connected?: boolean;
}

export type ConnectionStatus = 'connected' | 'expired' | 'revoked' | 'error';
export type SocialPlatform = 'whatsapp' | 'instagram' | 'facebook' | 'messenger';

export interface SocialConnection {
  id: string;
  shop_id: string;
  platform: SocialPlatform;
  platform_account_id: string;
  phone_number_id: string;
  display_phone_number: string;
  status: ConnectionStatus;
  token_expires_at: string | null;
  scopes: string[] | null;
  last_sync_at: string | null;
  error_message: string | null;
  meta: Record<string, unknown> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConnectMetaResponse {
  oauth_url: string;
}

export type OrderStatus = 'new' | 'confirmed' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  name: string;
  qty: number;
  notes?: string;
}

export interface Order {
  id: string;
  shop_id: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  raw_message?: string;
  items: OrderItem[];
  status: OrderStatus;
  total_amount?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderDetail extends Order {
  customer?: Customer;
  messages?: Message[];
}

export interface Customer {
  id: string;
  shop_id: string;
  phone_number: string;
  name?: string;
  total_orders: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  shop_id: string;
  customer_id: string;
  order_id?: string;
  direction: 'inbound' | 'outbound';
  body: string;
  wa_message_id?: string;
  sent_at?: string;
  created_at: string;
}

// ── Conversations ─────────────────────────────────────────────────────────────

export interface ConversationSummary {
  customer_id: string;
  customer_name?: string;
  customer_phone: string;
  last_message: string;
  last_message_at?: string;
  last_direction: 'inbound' | 'outbound';
  unread_count: number;
}

export interface ConversationDetail {
  customer_id: string;
  customer_name?: string;
  customer_phone: string;
  messages: Message[];
}

// ── API response wrappers ─────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  shop: Shop;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown[];
    request_id?: string;
    timestamp: string;
  };
}

// ── Form input types ──────────────────────────────────────────────────────────

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone_number?: string;
}

export interface UpdateProfileFormValues {
  name: string;
  phone_number?: string;
}

// ── UI utility types ──────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
