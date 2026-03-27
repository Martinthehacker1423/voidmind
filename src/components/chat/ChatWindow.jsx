import { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore.js';
import { useChat } from '../../hooks/useChat.js';
import { MessageBubble } from './MessageBubble.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';
import { EmptyChat } from './EmptyChat.jsx';
import { InputBar } from './InputBar.jsx';

export function ChatWindow() {
  const { activeConversation, activeId } = useChatStore();
  const { send, stop, streaming } = useChat();
  const bottomRef = useRef(null);

  const conv = activeConversation();
  const messages = conv?.messages || [];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, streaming]);

  function handleSuggestion(text) {
    window.dispatchEvent(new CustomEvent('void:set-input', { detail: { text } }));
  }

  const showTyping = streaming && messages.length > 0 && messages[messages.length - 1]?.role === 'user';

  return (
    <div className="chat-area">
      {messages.length === 0 ? (
        <>
          <EmptyChat onSuggestion={handleSuggestion} />
          <InputBar onSend={send} onStop={stop} streaming={streaming} disabled={!activeId} />
        </>
      ) : (
        <>
          <div className="msg-list">
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {showTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
          <InputBar onSend={send} onStop={stop} streaming={streaming} />
        </>
      )}
    </div>
  );
}
