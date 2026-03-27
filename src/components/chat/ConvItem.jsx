import { formatTime } from '../../utils/format.js';

export function ConvItem({ conv, active, onSelect, onDelete }) {
  return (
    <div className={`conv-item ${active ? 'active' : ''}`} onClick={onSelect}>
      <div className="conv-item-body">
        <div className="conv-item-title">{conv.title || '新对话'}</div>
        <div className="conv-item-time">{formatTime(conv.updatedAt)}</div>
      </div>
      {conv.source === 'discord' && (
        <span className="badge badge-discord" style={{ fontSize: 10, padding: '1px 5px' }}>DC</span>
      )}
      <button
        className="conv-item-delete"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        title="删除对话"
      >
        ×
      </button>
    </div>
  );
}
