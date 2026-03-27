import { useState, useRef, useEffect } from 'react';

export function InputBar({ onSend, onStop, streaming, disabled }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
  }, [text]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    if (streaming) { onStop(); return; }
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  // Allow setting text from outside (suggestion cards)
  useEffect(() => {
    if (disabled) return;
    const handler = (e) => {
      if (e.detail?.text) {
        setText(e.detail.text);
        setTimeout(() => textareaRef.current?.focus(), 50);
      }
    };
    window.addEventListener('void:set-input', handler);
    return () => window.removeEventListener('void:set-input', handler);
  }, [disabled]);

  return (
    <div className="input-bar">
      <div className="input-wrap">
        <textarea
          ref={textareaRef}
          className="input-textarea"
          placeholder="发送消息... (Enter 发送，Shift+Enter 换行)"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
        />
        <button
          className={`btn-send ${streaming ? 'streaming' : ''}`}
          onClick={handleSend}
          disabled={!streaming && (!text.trim() || disabled)}
          title={streaming ? '停止生成' : '发送'}
        >
          {streaming ? '■' : '↑'}
        </button>
      </div>
      <div className="input-hint">Enter 发送 · Shift+Enter 换行</div>
    </div>
  );
}
