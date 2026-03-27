import { create } from 'zustand';

export const useUIStore = create((set) => ({
  settingsOpen: false,
  settingsTab: 'api',
  discordGuideOpen: false,
  confirmDialog: null,  // { title, desc, onConfirm, danger }

  openSettings: (tab = 'api') => set({ settingsOpen: true, settingsTab: tab }),
  closeSettings: () => set({ settingsOpen: false }),
  setSettingsTab: (tab) => set({ settingsTab: tab }),

  openDiscordGuide: () => set({ discordGuideOpen: true }),
  closeDiscordGuide: () => set({ discordGuideOpen: false }),

  showConfirm: (dialog) => set({ confirmDialog: dialog }),
  closeConfirm: () => set({ confirmDialog: null }),
}));
