import { useChatStore } from '../../../store/chatStore.js';
import { useSettingsStore } from '../../../store/settingsStore.js';
import { useUIStore } from '../../../store/uiStore.js';
import { Toggle } from '../../ui/Toggle.jsx';
import { useToast } from '../../../hooks/useToast.js';

export function DataTab() {
  const { conversations } = useChatStore();
  const { autoTitle, updateSetting } = useSettingsStore();
  const { showConfirm } = useUIStore();
  const toast = useToast();

  function clearAllData() {
    showConfirm({
      title: '清空所有数据？',
      desc: '这将删除所有对话历史、设置和 API Key。此操作不可撤销。',
      danger: true,
      onConfirm: async () => {
        await window.voidAPI?.saveConversations([]);
        await window.voidAPI?.setApiKey('');
        await window.voidAPI?.setDiscordToken('');
        await window.voidAPI?.setSettings({ setupCompleted: false });
        toast.success('所有数据已清空，请重启应用');
      },
    });
  }

  const totalMessages = conversations.reduce((sum, c) => sum + c.messages.length, 0);

  return (
    <div>
      <div className="settings-section-title">对话数据</div>
      <div className="discord-status-card">
        <div className="discord-stat">
          <span>对话总数</span>
          <span className="discord-stat-val">{conversations.length}</span>
        </div>
        <div className="discord-stat">
          <span>消息总数</span>
          <span className="discord-stat-val">{totalMessages}</span>
        </div>
      </div>

      <div className="settings-section-title" style={{ marginTop: 'var(--sp-5)' }}>偏好设置</div>
      <div className="settings-row">
        <div>
          <div className="settings-label">自动生成对话标题</div>
          <div className="settings-desc">根据第一条消息自动命名对话</div>
        </div>
        <Toggle value={autoTitle} onChange={v => updateSetting('autoTitle', v)} />
      </div>

      <div className="settings-section-title" style={{ marginTop: 'var(--sp-5)', color: 'var(--error)' }}>危险操作</div>
      <button
        style={{
          background: 'var(--error-bg)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 'var(--r-md)',
          padding: 'var(--sp-3) var(--sp-4)',
          color: 'var(--error)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          transition: 'all var(--dur-fast)',
        }}
        onClick={clearAllData}
      >
        🗑 清空所有数据（对话、Key、设置）
      </button>
    </div>
  );
}
