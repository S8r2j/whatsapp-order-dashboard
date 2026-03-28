/** TanStack Query hooks for conversations. */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getConversation, listConversations, sendReply } from '@/lib/conversations';

export const CONVERSATION_KEYS = {
  all: ['conversations'] as const,
  detail: (customerId: string) => ['conversations', customerId] as const,
};

/** List all conversations — refetches every 5 s for near-real-time updates. */
export function useConversations() {
  return useQuery({
    queryKey: CONVERSATION_KEYS.all,
    queryFn: listConversations,
    refetchInterval: 5_000,
  });
}

/** Full message thread for one customer — refetches every 3 s. */
export function useConversationMessages(customerId: string) {
  return useQuery({
    queryKey: CONVERSATION_KEYS.detail(customerId),
    queryFn: () => getConversation(customerId),
    refetchInterval: 3_000,
    enabled: Boolean(customerId),
  });
}

/** Send an outbound reply from the shop. */
export function useSendReply(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: string) => sendReply(customerId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATION_KEYS.detail(customerId) });
      queryClient.invalidateQueries({ queryKey: CONVERSATION_KEYS.all });
    },
    onError: () => toast.error('Failed to send message'),
  });
}
