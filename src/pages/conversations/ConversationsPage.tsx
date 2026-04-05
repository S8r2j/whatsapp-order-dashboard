/**
 * Conversations list — one row per customer, ordered by most recent message.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useConversations } from '@/hooks/useConversations';
import { PageHeader } from '@/components/common/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { cn, timeAgo } from '@/lib/utils';
import type { ConversationSummary } from '@/types';

export const ConversationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: conversations, isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  const items = conversations ?? [];

  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title="Conversations"
        subtitle="All customer WhatsApp threads"
      />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
          <ChatBubbleLeftRightIcon className="h-12 w-12 mb-3 text-gray-300" />
          <p className="text-sm">No conversations yet.</p>
          <p className="text-xs mt-1">Messages from your WhatsApp will appear here.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden">
          {items.map((conv) => (
            <ConversationRow
              key={conv.customer_id}
              conv={conv}
              onClick={() => navigate(`/dashboard/conversations/${conv.customer_id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ConversationRow: React.FC<{
  conv: ConversationSummary;
  onClick: () => void;
}> = ({ conv, onClick }) => {
  const displayName = conv.customer_name || conv.customer_phone;
  const isUnread = conv.unread_count > 0;

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 h-11 w-11 rounded-full bg-whatsapp-100 text-whatsapp-700 font-semibold grid place-items-center text-sm">
        {displayName.slice(0, 2).toUpperCase()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={cn('text-sm truncate', isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-800')}>
            {displayName}
          </p>
          <span className="flex-shrink-0 text-xs text-gray-400">
            {conv.last_message_at ? timeAgo(conv.last_message_at) : ''}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={cn('text-xs truncate', isUnread ? 'text-gray-700' : 'text-gray-400')}>
            {conv.last_direction === 'outbound' ? '↗ ' : ''}
            {conv.last_message}
          </p>
          {isUnread && (
            <span className="flex-shrink-0 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-whatsapp-500 text-white text-xs font-bold">
              {conv.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};
