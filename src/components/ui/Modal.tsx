/**
 * Accessible modal dialog built on Headless UI.
 */

import React from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import type { ModalSize } from '@/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  hideCloseButton?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  hideCloseButton = false,
}) => (
  <Transition show={isOpen} as={React.Fragment}>
    <Dialog onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <TransitionChild
        as={React.Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      </TransitionChild>

      {/* Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPanel
            className={cn(
              'w-full bg-white rounded-2xl shadow-xl p-6',
              sizeClasses[size]
            )}
          >
            {(title || !hideCloseButton) && (
              <div className="flex items-center justify-between mb-4">
                {title && (
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    {title}
                  </DialogTitle>
                )}
                {!hideCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-auto rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
            {children}
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </Transition>
);
