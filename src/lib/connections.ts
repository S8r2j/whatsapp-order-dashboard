/** API helpers for social connections. */

import { get, post, del } from '@/lib/api';
import type { ConnectMetaResponse, SocialConnection } from '@/types';

export async function listConnections(): Promise<SocialConnection[]> {
  return get<SocialConnection[]>('/api/v1/connections');
}

export async function getConnection(id: string): Promise<SocialConnection> {
  return get<SocialConnection>(`/api/v1/connections/${id}`);
}

export async function disconnectConnection(id: string): Promise<void> {
  await del<void>(`/api/v1/connections/${id}`);
}

export async function getMetaOAuthUrl(): Promise<ConnectMetaResponse> {
  return get<ConnectMetaResponse>('/api/v1/auth/meta/connect');
}

export interface ManualConnectPayload {
  phone_number_id: string;
  waba_id: string;
  display_phone_number: string;
  access_token: string;
}

export async function manualConnect(payload: ManualConnectPayload): Promise<SocialConnection> {
  return post<SocialConnection>('/api/v1/connections/manual', payload);
}
