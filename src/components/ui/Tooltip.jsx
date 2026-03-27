import { useState } from 'react';

export function Tooltip({ content, children }) {
  const [visible, setVisible] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && content && (
        <span style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--void-4)',
          border: '1px solid var(--border-2)',
          borderRadius: 'var(--r-sm)',
          padding: '4px 8px',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-2)',
          whiteSpace: 'nowrap',
          zIndex: 300,
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          {content}
        </span>
      )}
    </span>
  );
}
