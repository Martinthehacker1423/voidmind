import Store from 'electron-store';
import { safeStorage } from 'electron';

const schema = {
  setupCompleted: { type: 'boolean', default: false },
  model: { type: 'string', default: 'claude-sonnet-4-20250514' },
  maxTokens: { type: 'number', default: 2048 },
  systemPrompt: { type: 'string', default: '' },
  contextWindow: { type: 'number', default: 10 },
  autoTitle: { type: 'boolean', default: true },
  discordTrigger: { type: 'string', default: 'mention' },
  theme: { type: 'string', default: 'dark' },
  conversations: { type: 'array', default: [] },
};

const store = new Store({ schema, name: 'voidmind-config' });

// Encrypted key helpers
export function setApiKey(key) {
  if (!key) { store.delete('apiKeyEncrypted'); return; }
  try {
    const enc = safeStorage.encryptString(key);
    store.set('apiKeyEncrypted', enc.toString('base64'));
  } catch {
    store.set('apiKeyEncrypted', Buffer.from(key).toString('base64'));
  }
}

export function getApiKey() {
  const enc = store.get('apiKeyEncrypted');
  if (!enc) return '';
  try {
    return safeStorage.decryptString(Buffer.from(enc, 'base64'));
  } catch {
    return Buffer.from(enc, 'base64').toString();
  }
}

export function setDiscordToken(token) {
  if (!token) { store.delete('discordTokenEncrypted'); return; }
  try {
    const enc = safeStorage.encryptString(token);
    store.set('discordTokenEncrypted', enc.toString('base64'));
  } catch {
    store.set('discordTokenEncrypted', Buffer.from(token).toString('base64'));
  }
}

export function getDiscordToken() {
  const enc = store.get('discordTokenEncrypted');
  if (!enc) return '';
  try {
    return safeStorage.decryptString(Buffer.from(enc, 'base64'));
  } catch {
    return Buffer.from(enc, 'base64').toString();
  }
}

export default store;
