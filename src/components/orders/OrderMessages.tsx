/**
 * Message thread component — displays inbound/outbound messages as chat bubbles.
 */

import React from 'react';
import { cn, formatDate } from '@/lib/utils';
import type { Message } from '@/types';

interface OrderMessagesProps {
  messages: Message[];
}

export const OrderMessages: React.FC<OrderMessagesProps> = ({ messages }) => {
  if (!messages.length) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-gray-400">
        No messages yet
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4 py-4">
      {messages.map((msg) => {
        const isOutbound = msg.direction === 'outbound';
        return (
          <div
            key={msg.id}
            className={cn('flex', isOutbound ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                isOutbound
                  ? 'rounded-tr-sm bg-whatsapp-500 text-white'
                  : 'rounded-tl-sm bg-white text-gray-800 border border-gray-200'
              )}
            >
              <p className="whitespace-pre-wrap break-words">{msg.body}</p>
              <p
                className={cn(
                  'mt-1 text-right text-[10px]',
                  isOutbound ? 'text-white/70' : 'text-gray-400'
                )}
              >
                {formatDate(msg.sent_at ?? msg.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
