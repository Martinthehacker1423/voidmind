import { autoUpdater } from 'electron-updater';
import { app } from 'electron';

let mainWindow = null;

function push(event, data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater', { event, ...data });
  }
}

export function initUpdater(win) {
  mainWindow = win;

  // 静默日志
  autoUpdater.logger = null;
  autoUpdater.autoDownload = true;        // 检测到新版自动后台下载
  autoUpdater.autoInstallOnAppQuit = true; // 退出时自动安装

  autoUpdater.on('checking-for-update', () => {
    push('checking', {});
  });

  autoUpdater.on('update-available', (info) => {
    push('available', { version: info.version, releaseNotes: info.releaseNotes });
  });

  autoUpdater.on('update-not-available', () => {
    push('not-available', {});
  });

  autoUpdater.on('download-progress', (p) => {
    push('progress', { percent: Math.round(p.percent), bytesPerSecond: p.bytesPerSecond });
  });

  autoUpdater.on('update-downloaded', (info) => {
    push('downloaded', { version: info.version });
  });

  autoUpdater.on('error', (err) => {
    push('error', { message: err.message });
  });

  // 启动 3 秒后静默检查（不打扰用户）
  if (app.isPackaged) {
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch(() => {});
    }, 3000);
  }
}

export function checkForUpdates() {
  return autoUpdater.checkForUpdates();
}

export function quitAndInstall() {
  autoUpdater.quitAndInstall();
}
