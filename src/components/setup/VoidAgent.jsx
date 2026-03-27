import { useState, useEffect, useRef } from 'react';

const MOOD_COLORS = {
  neutral:  'var(--p-500)',
  excited:  'var(--p-400)',
  thinking: 'var(--text-3)',
  success:  'var(--success)',
  warning:  'var(--warning)',
};

export function VoidAgent({ message, mood = 'neutral', action }) {
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const prevMsg = useRef('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (message === prevMsg.current) return;
    prevMsg.current = message;

    setDisplayed('');
    setTyping(true);
    let i = 0;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(message.slice(0, i));
      if (i >= message.length) {
        clearInterval(timerRef.current);
        setTyping(false);
      }
    }, 18);

    return () => clearInterval(timerRef.current);
  }, [message]);

  return (
    <div className="void-agent">
      <div className="void-avatar" style={{ borderColor: MOOD_COLORS[mood] }}>
        VM
      </div>
      <div>
        <div className="void-bubble">
          {displayed}
          {typing && <span className="typewriter-cursor" />}
        </div>
        {!typing && action && (
          <button
            className="void-action-link"
            onClick={() => window.voidAPI?.openExternal(action.url)}
          >
            ↗ {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
