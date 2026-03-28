/**
 * Conversation detail — WhatsApp-style chat view for a single customer thread.
 * Polls every 3 s for new messages. Shop can send replies from the bottom input.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useConversationMessages, useSendReply } from '@/hooks/useConversations';
import { Spinner } from '@/components/ui/Spinner';
import { cn, timeAgo } from '@/lib/utils';
import type { Message } from '@/types';

export const ConversationDetailPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useConversationMessages(customerId ?? '');
  const sendReply = useSendReply(customerId ?? '');

  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessageCount = useRef(0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const count = data?.messages.length ?? 0;
    if (count !== prevMessageCount.current) {
      prevMessageCount.current = count;
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data?.messages.length]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text || sendReply.isPending) return;
    setDraft('');
    sendReply.mutate(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  const messages = data?.messages ?? [];
  const displayName = data?.customer_name || data?.customer_phone || 'Customer';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        <button
          onClick={() => navigate('/dashboard/conversations')}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="h-9 w-9 rounded-full bg-whatsapp-100 text-whatsapp-700 font-semibold grid place-items-center text-sm flex-shrink-0">
          {displayName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{displayName}</p>
          {data?.customer_name && (
            <p className="text-xs text-gray-400">{data.customer_phone}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            No messages yet.
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                showTime={shouldShowTime(messages, i)}
              />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Reply input */}
      <div className="flex items-end gap-3 px-4 py-3 border-t border-gray-200 bg-white flex-shrink-0">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          rows={1}
          className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-whatsapp-500 max-h-32 overflow-y-auto"
          style={{ minHeight: '42px' }}
        />
        <button
          onClick={handleSend}
          disabled={!draft.trim() || sendReply.isPending}
          className={cn(
            'flex-shrink-0 h-10 w-10 rounded-full grid place-items-center transition-colors',
            draft.trim()
              ? 'bg-whatsapp-500 text-white hover:bg-whatsapp-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          {sendReply.isPending ? (
            <Spinner size="sm" />
          ) : (
            <PaperAirplaneIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{ msg: Message; showTime: boolean }> = ({ msg, showTime }) => {
  const isOutbound = msg.direction === 'outbound';

  return (
    <div className={cn('flex flex-col', isOutbound ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[72%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
          isOutbound
            ? 'bg-whatsapp-500 text-white rounded-br-sm'
            : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{msg.body}</p>
      </div>
      {showTime && (
        <span className="mt-1 text-xs text-gray-400 px-1">
          {timeAgo(msg.sent_at || msg.created_at)}
        </span>
      )}
    </div>
  );
};

/** Show timestamp only when there's a gap > 5 min or it's the last message in a group. */
function shouldShowTime(messages: Message[], index: number): boolean {
  if (index === messages.length - 1) return true;
  const curr = new Date(messages[index].sent_at || messages[index].created_at).getTime();
  const next = new Date(messages[index + 1].sent_at || messages[index + 1].created_at).getTime();
  return next - curr > 5 * 60 * 1000;
}
