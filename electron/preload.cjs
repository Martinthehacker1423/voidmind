const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('voidAPI', {
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSettings: (data) => ipcRenderer.invoke('set-settings', data),
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  setApiKey: (key) => ipcRenderer.invoke('set-api-key', key),
  getDiscordToken: () => ipcRenderer.invoke('get-discord-token'),
  setDiscordToken: (token) => ipcRenderer.invoke('set-discord-token', token),

  // Conversations
  getConversations: () => ipcRenderer.invoke('get-conversations'),
  saveConversations: (convs) => ipcRenderer.invoke('save-conversations', convs),

  // Feedback
  getFeedback: () => ipcRenderer.invoke('get-feedback'),
  saveFeedback: (entries) => ipcRenderer.invoke('save-feedback', entries),

  // Discord Bot
  startBot: () => ipcRenderer.invoke('discord-start'),
  stopBot: () => ipcRenderer.invoke('discord-stop'),
  getBotStatus: () => ipcRenderer.invoke('discord-status'),

  // Listeners
  onDiscordStatus: (cb) => {
    ipcRenderer.on('discord-status-update', (_e, status) => cb(status));
    return () => ipcRenderer.removeAllListeners('discord-status-update');
  },
  onDiscordMessage: (cb) => {
    ipcRenderer.on('discord-message', (_e, data) => cb(data));
    return () => ipcRenderer.removeAllListeners('discord-message');
  },

  // Updater
  updaterCheck: () => ipcRenderer.invoke('updater-check'),
  updaterInstall: () => ipcRenderer.invoke('updater-install'),
  onUpdater: (cb) => {
    ipcRenderer.on('updater', (_e, data) => cb(data));
    return () => ipcRenderer.removeAllListeners('updater');
  },

  // Shell
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // Window controls
  windowMinimize: () => ipcRenderer.send('window-minimize'),
  windowMaximize: () => ipcRenderer.send('window-maximize'),
  windowClose: () => ipcRenderer.send('window-close'),
});
