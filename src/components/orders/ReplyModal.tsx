/**
 * Modal for sending a free-form WhatsApp reply to a customer.
 */

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { useReplyToOrder } from '@/hooks/useOrders';

interface ReplyModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const MAX_CHARS = 4096;

export const ReplyModal: React.FC<ReplyModalProps> = ({ orderId, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const replyMutation = useReplyToOrder();

  const handleSend = async () => {
    if (!message.trim()) return;
    await replyMutation.mutateAsync({ id: orderId, message: message.trim() });
    setMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Reply" size="md">
      <div className="space-y-4">
        <Textarea
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Type your reply to the customer…"
          helperText="Note: Free-form messages can only be sent within the 24-hour customer service window."
          maxLength={MAX_CHARS}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {message.length}/{MAX_CHARS}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              loading={replyMutation.isPending}
              disabled={!message.trim()}
              size="sm"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
