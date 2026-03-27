import { create } from 'zustand';
import { uuid } from '../utils/format.js';

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: ({ type = 'info', message, duration = 3500 }) => {
    const id = uuid();
    set(s => ({ toasts: [...s.toasts, { id, type, message, exiting: false }] }));

    setTimeout(() => {
      // Mark as exiting
      set(s => ({ toasts: s.toasts.map(t => t.id === id ? { ...t, exiting: true } : t) }));
      // Remove after animation
      setTimeout(() => {
        set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
      }, 250);
    }, duration);

    return id;
  },

  removeToast: (id) => {
    set(s => ({ toasts: s.toasts.map(t => t.id === id ? { ...t, exiting: true } : t) }));
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
    }, 250);
  },
}));

export function useToast() {
  const { addToast } = useToastStore();
  return {
    success: (message) => addToast({ type: 'success', message }),
    error:   (message) => addToast({ type: 'error', message, duration: 5000 }),
    warning: (message) => addToast({ type: 'warning', message }),
    info:    (message) => addToast({ type: 'info', message }),
  };
}
