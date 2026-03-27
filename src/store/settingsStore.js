import { create } from 'zustand';
import { DEFAULT_MODEL } from '../utils/constants.js';

const defaultSettings = {
  setupCompleted: false,
  model: DEFAULT_MODEL,
  maxTokens: 2048,
  systemPrompt: '',
  contextWindow: 10,
  autoTitle: true,
  discordTrigger: 'mention',
  theme: 'dark',
};

export const useSettingsStore = create((set, get) => ({
  ...defaultSettings,
  loaded: false,

  loadSettings: async () => {
    if (!window.voidAPI) return;
    const s = await window.voidAPI.getSettings();
    set({ ...s, loaded: true });
  },

  updateSetting: async (key, value) => {
    set({ [key]: value });
    if (window.voidAPI) {
      await window.voidAPI.setSettings({ [key]: value });
    }
  },

  updateSettings: async (patch) => {
    set(patch);
    if (window.voidAPI) {
      await window.voidAPI.setSettings(patch);
    }
  },
}));
