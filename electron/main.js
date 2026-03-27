import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import store, { getApiKey, setApiKey, getDiscordToken, setDiscordToken } from './store.js';
import { startBot, stopBot, getBotStatus } from './discord/bot.js';
import { initUpdater, checkForUpdates, quitAndInstall } from './updater.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 820,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#07070e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      partition: 'persist:voidmind',
    },
    show: false,
  });

  if (isDev) {
    const port = process.env.VITE_DEV_PORT || '5173';
    mainWindow.loadURL(`http://localhost:${port}`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    initUpdater(mainWindow);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', async () => {
  await stopBot();
  if (process.platform !== 'darwin') app.quit();
});

// Window controls
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.on('window-close', () => mainWindow?.close());

// Settings IPC
ipcMain.handle('get-settings', () => ({
  setupCompleted: store.get('setupCompleted'),
  model: store.get('model'),
  maxTokens: store.get('maxTokens'),
  systemPrompt: store.get('systemPrompt'),
  contextWindow: store.get('contextWindow'),
  autoTitle: store.get('autoTitle'),
  discordTrigger: store.get('discordTrigger'),
  theme: store.get('theme'),
}));

ipcMain.handle('set-settings', (_e, data) => {
  const allowed = ['setupCompleted','model','maxTokens','systemPrompt','contextWindow','autoTitle','discordTrigger','theme'];
  for (const key of allowed) {
    if (key in data) store.set(key, data[key]);
  }
  return true;
});

ipcMain.handle('get-api-key', () => getApiKey());
ipcMain.handle('set-api-key', (_e, key) => { setApiKey(key); return true; });
ipcMain.handle('get-discord-token', () => getDiscordToken());
ipcMain.handle('set-discord-token', (_e, token) => { setDiscordToken(token); return true; });

// Conversations IPC
ipcMain.handle('get-conversations', () => store.get('conversations', []));
ipcMain.handle('save-conversations', (_e, convs) => { store.set('conversations', convs); return true; });

// Feedback IPC
ipcMain.handle('get-feedback', () => store.get('feedback', []));
ipcMain.handle('save-feedback', (_e, entries) => { store.set('feedback', entries); return true; });

// Discord Bot IPC
ipcMain.handle('discord-start', async () => {
  const token = getDiscordToken();
  const apiKey = getApiKey();
  const settings = {
    model: store.get('model'),
    maxTokens: store.get('maxTokens'),
    systemPrompt: store.get('systemPrompt'),
    contextWindow: store.get('contextWindow'),
    trigger: store.get('discordTrigger'),
  };
  return startBot({ token, apiKey, settings, mainWindow });
});

ipcMain.handle('discord-stop', async () => stopBot());
ipcMain.handle('discord-status', () => getBotStatus());

// Updater IPC
ipcMain.handle('updater-check', () => checkForUpdates().catch(e => ({ error: e.message })));
ipcMain.handle('updater-install', () => quitAndInstall());

// Shell
ipcMain.handle('open-external', (_e, url) => {
  shell.openExternal(url);
  return true;
});

export { mainWindow };
