import { create } from 'zustand';
import { uuid } from '../utils/format.js';

// 本地持久化：借用 electron-store 存反馈
export const useFeedbackStore = create((set, get) => ({
  entries: [],
  loaded: false,

  load: async () => {
    if (!window.voidAPI) return;
    const s = await window.voidAPI.getSettings();
    // 反馈单独存在 store 的 feedback key
    const raw = await window.voidAPI.getFeedback?.() ?? [];
    set({ entries: raw, loaded: true });
  },

  add: async (entry) => {
    const item = { id: uuid(), createdAt: Date.now(), ...entry };
    const next = [item, ...get().entries];
    set({ entries: next });
    await window.voidAPI.saveFeedback?.(next);
    return item;
  },

  clear: async () => {
    set({ entries: [] });
    await window.voidAPI.saveFeedback?.([]);
  },
}));
