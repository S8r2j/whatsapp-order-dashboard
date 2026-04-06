import React from 'react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CONNECTION_STATUS_CONFIG } from '@/lib/constants';
import { cn, timeAgo } from '@/lib/utils';
import type { SocialConnection } from '@/types';

interface Props {
  connection?: SocialConnection;
  onConnect: () => void;
  onDisconnect: (id: string) => void;
  isConnecting: boolean;
  isDisconnecting: boolean;
}

export const WhatsAppConnectionCard: React.FC<Props> = ({
  connection,
  onConnect,
  onDisconnect,
  isConnecting,
  isDisconnecting,
}) => {
  const status: SocialConnection['status'] = connection?.status ?? 'revoked';
  const statusConfig = CONNECTION_STATUS_CONFIG[status];

  const expiresAt = connection?.token_expires_at
    ? new Date(connection.token_expires_at)
    : null;
  const expiresInDays = expiresAt
    ? Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;
  const expiresSoon = expiresInDays !== null && expiresInDays <= 7 && status === 'connected';

  const expiryCopy = connection
    ? expiresInDays === null
      ? 'Expiry unknown'
      : expiresInDays === 0
      ? 'Token expires today'
      : `Token expires in ${expiresInDays} day${expiresInDays > 1 ? 's' : ''}`
    : 'No WhatsApp connection yet';

  const lastSyncCopy = connection?.last_sync_at
    ? timeAgo(connection.last_sync_at)
    : 'Not synced yet';

  const displayNumber = connection?.display_phone_number ?? '—';
  const actionStatus = connection?.status;
  const showAction = Boolean(actionStatus);
  const buttonLabel = actionStatus === 'connected' ? 'Disconnect' : 'Reconnect WhatsApp';
  const buttonVariant = actionStatus === 'connected' ? 'danger' : 'secondary';
  const buttonLoading = actionStatus === 'connected' ? isDisconnecting : isConnecting;

  const handleAction = () => {
    if (connection && status === 'connected') {
      onDisconnect(connection.id);
    } else {
      onConnect();
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-green-50 text-green-600 font-semibold grid place-items-center">
            WA
          </div>
          <div>
            <p className="text-sm text-gray-500">WhatsApp Business</p>
            <p className="text-lg font-semibold text-gray-900">{displayNumber}</p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
            statusConfig.color,
            statusConfig.bgColor
          )}
        >
          <span>{statusConfig.icon}</span>
          <span>{statusConfig.label}</span>
        </span>
      </div>

      <div className="space-y-1 text-sm">
        <p className="text-gray-600">{expiryCopy}</p>
        {expiresSoon && (
          <p className="text-xs font-medium text-yellow-700">
            ⚠ Token expires soon. Reconnect to refresh permissions.
          </p>
        )}
        <p className="text-gray-600">Last synced {lastSyncCopy}</p>
        {status === 'error' && connection?.error_message && (
          <p className="text-xs font-medium text-red-700">{connection.error_message}</p>
        )}
      </div>

      {showAction && (
        <div className="flex items-center justify-end">
          <Button
            variant={buttonVariant}
            size="sm"
            loading={buttonLoading}
            onClick={handleAction}
          >
            {buttonLabel}
          </Button>
        </div>
      )}
    </Card>
  );
};
