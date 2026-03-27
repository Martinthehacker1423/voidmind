import { useSettingsStore } from '../store/settingsStore.js';

export function useSettings() {
  const store = useSettingsStore();
  return {
    settings: {
      setupCompleted: store.setupCompleted,
      model: store.model,
      maxTokens: store.maxTokens,
      systemPrompt: store.systemPrompt,
      contextWindow: store.contextWindow,
      autoTitle: store.autoTitle,
      discordTrigger: store.discordTrigger,
      theme: store.theme,
    },
    loaded: store.loaded,
    updateSetting: store.updateSetting,
    updateSettings: store.updateSettings,
    loadSettings: store.loadSettings,
  };
}
