import { useState, useEffect } from 'react';

export function useDiscord() {
  const [status, setStatus] = useState({
    connected: false,
    tag: '',
    guildCount: 0,
    messageCount: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.voidAPI) return;

    // Get initial status
    window.voidAPI.getBotStatus().then(s => s && setStatus(s));

    // Listen for real-time updates
    const unsub = window.voidAPI.onDiscordStatus((s) => setStatus(s));
    return () => unsub?.();
  }, []);

  async function startBot() {
    if (!window.voidAPI) return { ok: false, error: 'API not available' };
    setLoading(true);
    const result = await window.voidAPI.startBot();
    setLoading(false);
    return result;
  }

  async function stopBot() {
    if (!window.voidAPI) return;
    setLoading(true);
    await window.voidAPI.stopBot();
    setLoading(false);
  }

  return { status, loading, startBot, stopBot };
}
