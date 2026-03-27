import { SUGGESTIONS } from '../../utils/constants.js';

export function EmptyChat({ onSuggestion }) {
  return (
    <div className="empty-chat">
      <div className="empty-logo">VOIDMIND</div>
      <div className="empty-sub">今天想聊点什么？</div>
      <div className="suggestion-cards">
        {SUGGESTIONS.map((s, i) => (
          <div key={i} className="suggestion-card" onClick={() => onSuggestion(s)}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
