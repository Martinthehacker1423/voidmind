import { useState, useRef, useCallback } from 'react';
import { useChatStore } from '../store/chatStore.js';
import { useSettingsStore } from '../store/settingsStore.js';
import { streamMessage } from '../utils/claude.js';
import { uuid } from '../utils/format.js';

export function useChat() {
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef(null);

  const {
    activeId,
    activeConversation,
    newConversation,
    addMessage,
    updateLastAssistantMessage,
    finalizeAssistantMessage,
  } = useChatStore();

  const { model, maxTokens, systemPrompt, contextWindow } = useSettingsStore();

  const send = useCallback(async (text) => {
    if (!text.trim() || streaming) return;

    let convId = activeId;
    if (!convId) {
      convId = newConversation();
    }

    // Get API key from Electron
    let apiKey = '';
    if (window.voidAPI) {
      apiKey = await window.voidAPI.getApiKey();
    }
    if (!apiKey) return;

    // Add user message
    const userMsg = {
      id: uuid(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
      model: null,
    };
    addMessage(convId, userMsg);

    // Add empty assistant message placeholder
    const assistantMsg = {
      id: uuid(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      model,
    };
    addMessage(convId, assistantMsg);

    setStreaming(true);

    // Build message history for API (trim to contextWindow)
    const conv = useChatStore.getState().conversations.find(c => c.id === convId);
    const allMessages = conv?.messages || [];
    // Get all messages except the empty assistant placeholder
    const historyMsgs = allMessages
      .slice(0, -1)
      .map(m => ({ role: m.role, content: m.content }))
      .slice(-(contextWindow * 2));

    // AbortController for stop
    const controller = new AbortController();
    abortRef.current = controller;

    let accumulated = '';

    await streamMessage({
      apiKey,
      model,
      messages: historyMsgs,
      systemPrompt,
      maxTokens,
      signal: controller.signal,
      onChunk: (chunk) => {
        accumulated += chunk;
        updateLastAssistantMessage(convId, accumulated);
      },
      onComplete: () => {
        finalizeAssistantMessage(convId);
        setStreaming(false);
        abortRef.current = null;
      },
      onError: (err) => {
        updateLastAssistantMessage(convId, `⚠️ 错误：${err.message}`);
        finalizeAssistantMessage(convId);
        setStreaming(false);
        abortRef.current = null;
      },
    });
  }, [streaming, activeId, model, maxTokens, systemPrompt, contextWindow, newConversation, addMessage, updateLastAssistantMessage, finalizeAssistantMessage]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
  }, []);

  return { send, stop, streaming };
}
