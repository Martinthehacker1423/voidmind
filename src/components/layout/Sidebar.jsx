import { useState } from 'react';
import { useChatStore } from '../../store/chatStore.js';
import { useUIStore } from '../../store/uiStore.js';
import { ConvItem } from '../chat/ConvItem.jsx';
import { StatusDot } from '../ui/StatusDot.jsx';
import { useDiscord } from '../../hooks/useDiscord.js';
import { FeedbackPanel } from '../feedback/FeedbackPanel.jsx';

export function Sidebar() {
  const { conversations, activeId, newConversation, deleteConversation, setActive } = useChatStore();
  const { openSettings } = useUIStore();
  const { status } = useDiscord();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">VOIDMIND</div>

      <button className="btn-new-chat" onClick={newConversation}>
        <span style={{ fontSize: 16 }}>+</span> 新对话
      </button>

      {conversations.length > 0 && (
        <div className="sidebar-section-label">历史对话</div>
      )}

      <div className="conv-list">
        {conversations.map(conv => (
          <ConvItem
            key={conv.id}
            conv={conv}
            active={conv.id === activeId}
            onSelect={() => setActive(conv.id)}
            onDelete={() => deleteConversation(conv.id)}
          />
        ))}
      </div>

      <div className="sidebar-bottom">
        {status.connected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: '0 var(--sp-1) var(--sp-2)', fontSize: 'var(--text-xs)', color: 'var(--text-3)' }}>
            <StatusDot status="online" />
            Discord 已连接
          </div>
        )}
        <button className="sidebar-action-btn" onClick={() => openSettings('api')}>
          ⚙ 设置
        </button>
        <button className="sidebar-action-btn" onClick={() => openSettings('discord')}>
          🎮 Discord Bot
        </button>
        <button className="sidebar-action-btn" onClick={() => setFeedbackOpen(true)}>
          💬 反馈
        </button>
      </div>

      <FeedbackPanel open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </aside>
  );
}
