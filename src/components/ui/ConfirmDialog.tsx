/**
 * Confirmation dialog for destructive actions.
 */

import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex w-full gap-3">
        <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" fullWidth onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);
