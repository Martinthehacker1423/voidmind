import {
  Client,
  GatewayIntentBits,
  Partials,
} from 'discord.js';
import { handleMessage } from './messageHandler.js';

let client = null;
let statusInfo = { connected: false, tag: '', guildCount: 0, messageCount: 0 };
let currentSettings = null;

export function getBotStatus() {
  return { ...statusInfo };
}

export async function startBot({ token, apiKey, settings, mainWindow }) {
  if (!token) return { ok: false, error: 'No Discord token provided' };
  if (!apiKey) return { ok: false, error: 'No Claude API key provided' };

  // Stop existing bot if running
  if (client) await stopBot();

  currentSettings = { ...settings, apiKey };

  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Channel, Partials.Message],
  });

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ ok: false, error: '连接超时，请检查 Token 是否正确' });
    }, 15000);

    client.once('ready', () => {
      clearTimeout(timeout);
      statusInfo = {
        connected: true,
        tag: client.user.tag,
        guildCount: client.guilds.cache.size,
        messageCount: 0,
      };
      pushStatus(mainWindow);
      resolve({ ok: true, tag: client.user.tag });
    });

    client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      statusInfo.messageCount++;
      pushStatus(mainWindow);

      try {
        await handleMessage({
          message,
          settings: currentSettings,
          botUserId: client.user.id,
        });
      } catch (err) {
        console.error('[Discord] messageCreate error:', err);
      }
    });

    client.on('error', (err) => {
      console.error('[Discord] client error:', err);
      statusInfo = { connected: false, tag: '', guildCount: 0, messageCount: 0 };
      pushStatus(mainWindow);
    });

    client.on('disconnect', () => {
      statusInfo = { connected: false, tag: '', guildCount: 0, messageCount: 0 };
      pushStatus(mainWindow);
    });

    client.login(token).catch((err) => {
      clearTimeout(timeout);
      statusInfo = { connected: false, tag: '', guildCount: 0, messageCount: 0 };
      resolve({ ok: false, error: err.message });
    });
  });
}

export async function stopBot() {
  if (!client) return;
  try {
    await client.destroy();
  } catch {}
  client = null;
  statusInfo = { connected: false, tag: '', guildCount: 0, messageCount: 0 };
}

function pushStatus(mainWindow) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('discord-status-update', { ...statusInfo });
  }
}
