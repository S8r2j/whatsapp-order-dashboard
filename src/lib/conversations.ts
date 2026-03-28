/** API helpers for conversations. */

import { get, post } from '@/lib/api';
import type { ConversationDetail, ConversationSummary, Message } from '@/types';

export async function listConversations(): Promise<ConversationSummary[]> {
  return get<ConversationSummary[]>('/api/v1/conversations');
}

export async function getConversation(customerId: string): Promise<ConversationDetail> {
  return get<ConversationDetail>(`/api/v1/conversations/${customerId}/messages`);
}

export async function sendReply(customerId: string, message: string): Promise<Message> {
  return post<Message>(`/api/v1/conversations/${customerId}/reply`, { message });
}
