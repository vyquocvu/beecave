import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  show: (toast: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (toast) => {
    const id = Math.random().toString(36).slice(2);
    const t: Toast = { id, duration: 3500, ...toast };
    set((s) => ({ toasts: [...s.toasts, t] }));
    setTimeout(() => get().dismiss(id), t.duration);
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

export const showToast = (t: Omit<Toast, 'id'>) => useToastStore.getState().show(t);
