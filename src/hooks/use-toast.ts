"use client";

import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

const toastState: ToastState = {
  toasts: [],
};

let toastId = 0;

export function useToast() {
  const [, forceUpdate] = useState({});

  const toast = useCallback(({ title, description, variant = 'default', duration = 5000 }: Omit<Toast, 'id'>) => {
    const id = (++toastId).toString();
    const newToast: Toast = {
      id,
      title,
      description,
      variant,
      duration,
    };

    toastState.toasts.push(newToast);
    forceUpdate({});

    // Auto remove toast after duration
    setTimeout(() => {
      toastState.toasts = toastState.toasts.filter(t => t.id !== id);
      forceUpdate({});
    }, duration);

    return {
      id,
      dismiss: () => {
        toastState.toasts = toastState.toasts.filter(t => t.id !== id);
        forceUpdate({});
      },
    };
  }, []);

  return {
    toast,
    toasts: toastState.toasts,
    dismiss: (toastId: string) => {
      toastState.toasts = toastState.toasts.filter(t => t.id !== toastId);
      forceUpdate({});
    },
  };
}