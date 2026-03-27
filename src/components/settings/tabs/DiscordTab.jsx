import { useState } from 'react';
import { Input } from '../../ui/Input.jsx';
import { Button } from '../../ui/Button.jsx';
import { StatusDot } from '../../ui/StatusDot.jsx';
import { DiscordSetupGuide } from '../DiscordSetupGuide.jsx';
import { useDiscord } from '../../../hooks/useDiscord.js';
import { useSettingsStore } from '../../../store/settingsStore.js';
import { useUIStore } from '../../../store/uiStore.js';
import { useToast } from '../../../hooks/useToast.js';

export function DiscordTab() {
  const [token, setToken]     = useState('');
  const [tokenSaved, setTokenSaved] = useState(false);
  const [guideOpen, setGuideOpen]   = useState(false);
  const { status, loading, startBot, stopBot } = useDiscord();
  const { discordTrigger, updateSetting } = useSettingsStore();
  const { showConfirm } = useUIStore();
  const toast = useToast();

  // Load masked token on mount
  useState(() => {
    window.voidAPI?.getDiscordToken().then(t => {
      if (t) { setToken('•'.repeat(20)); setTokenSaved(true); }
    });
  });

  async function handleSaveToken() {
    if (!token.trim() || tokenSaved) return;
    await window.voidAPI?.setDiscordToken(token.trim());
    setTokenSaved(true);
    setToken('•'.repeat(20));
    toast.success('Token 已保存');
  }

  async function handleStart() {
    const result = await startBot();
    if (result.ok) {
      toast.success(`VOID 已在 Discord 上线 (${result.tag})`);
    } else {
      toast.error(result.error || '启动失败，请检查 Token');
    }
  }

  function handleStop() {
    showConfirm({
      title: '停止 Discord Bot？',
      desc: 'Bot 将下线，在 Discord 中将无法回复消息。',
      onConfirm: async () => {
        await stopBot();
        toast.warning('Bot 已下线');
      },
    });
  }

  function clearHistory() {
    showConfirm({
      title: '清空 Discord 对话历史？',
      desc: '这将清除所有频道的对话记忆，Bot 将忘记之前的上下文。',
      danger: true,
      onConfirm: () => toast.info('Discord 对话历史已清空'),
    });
  }

  return (
    <div>
      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
        <StatusDot status={status.connected ? 'online' : 'offline'} />
        <span style={{ fontSize: 'var(--text-sm)', color: status.connected ? 'var(--success)' : 'var(--text-3)' }}>
          {status.connected ? `已连接 · ${status.tag}` : '未连接'}
        </span>
      </div>

      {status.connected && (
        <div className="discord-status-card" style={{ marginBottom: 'var(--sp-4)' }}>
          <div className="discord-stat">
            <span>今日消息</span>
            <span className="discord-stat-val">{status.messageCount} 条</span>
          </div>
          <div className="discord-stat">
            <span>服务器数</span>
            <span className="discord-stat-val">{status.guildCount} 个</span>
          </div>
        </div>
      )}

      {/* Token input */}
      <div className="settings-section-title">Bot Token</div>
      <Input
        type="password"
        placeholder="MTxxxxxxxxxxxxxxxxxxxxxxxx..."
        value={token}
        onChange={e => { setToken(e.target.value); setTokenSaved(false); }}
        disabled={tokenSaved}
      />
      <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)' }}>
        {tokenSaved ? (
          <Button variant="secondary" onClick={() => { setToken(''); setTokenSaved(false); }}>修改 Token</Button>
        ) : (
          <Button variant="secondary" disabled={!token.trim()} onClick={handleSaveToken}>保存 Token</Button>
        )}
        <button className="void-action-link" style={{ fontSize: 'var(--text-sm)' }}
          onClick={() => setGuideOpen(true)}>
          不知道怎么拿 Token？
        </button>
      </div>

      {/* Trigger mode */}
      <div className="settings-section-title">触发方式</div>
      <div className="radio-group" style={{ marginBottom: 'var(--sp-5)' }}>
        {[
          { id: 'mention', label: '仅 @提及时回复', desc: '只有 @VOIDMIND 才会回复' },
          { id: 'all',     label: '所有消息都回复', desc: '频道内每条消息都会回复' },
        ].map(opt => (
          <div key={opt.id} className={`radio-option ${discordTrigger === opt.id ? 'selected' : ''}`}
            onClick={() => updateSetting('discordTrigger', opt.id)}>
            <div className="radio-circle"><div className="radio-dot" /></div>
            <div>
              <div className="radio-label">{opt.label}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', marginTop: 2 }}>{opt.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
        {status.connected ? (
          <>
            <Button variant="secondary" loading={loading} onClick={handleStop}>停止 Bot</Button>
            <Button variant="ghost" onClick={clearHistory}>清空对话历史</Button>
          </>
        ) : (
          <Button variant="primary" loading={loading} disabled={!tokenSaved || loading} onClick={handleStart}>
            {loading ? '连接中...' : '启动 Bot'}
          </Button>
        )}
      </div>

      <DiscordSetupGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
