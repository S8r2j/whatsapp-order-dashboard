/**
 * React Query hooks for social connection data.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { QUERY_KEYS } from '@/lib/constants';
import { getMetaOAuthUrl, getConnection, disconnectConnection, listConnections, manualConnect, type ManualConnectPayload } from '@/lib/connections';
import type { ConnectMetaResponse, SocialConnection } from '@/types';

export function useConnections(): UseQueryResult<SocialConnection[]> {
  return useQuery({
    queryKey: QUERY_KEYS.connections.list(),
    queryFn: listConnections,
  });
}

export function useConnection(id?: string): UseQueryResult<SocialConnection> {
  return useQuery({
    queryKey: QUERY_KEYS.connections.detail(id ?? ''),
    queryFn: () => getConnection(id!),
    enabled: Boolean(id),
  });
}

export function useConnectMeta(): UseMutationResult<ConnectMetaResponse, unknown, void> {
  return useMutation({
    mutationFn: getMetaOAuthUrl,
    onSuccess: (data) => {
      window.location.href = data.oauth_url;
    },
    onError: () => {
      toast.error('Unable to start WhatsApp connection');
    },
  });
}

export function useManualConnect(): UseMutationResult<SocialConnection, unknown, ManualConnectPayload> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: manualConnect,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.connections.all });
      toast.success('WhatsApp connected successfully');
    },
    onError: () => {
      toast.error('Failed to connect WhatsApp');
    },
  });
}

export function useDisconnectConnection(): UseMutationResult<void, unknown, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: disconnectConnection,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.connections.all });
      toast.success('WhatsApp disconnected');
    },
    onError: () => {
      toast.error('Failed to disconnect WhatsApp');
    },
  });
}
