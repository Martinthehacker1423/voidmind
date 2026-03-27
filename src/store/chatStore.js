import { create } from 'zustand';
import { uuid, truncate } from '../utils/format.js';

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeId: null,

  loadConversations: async () => {
    if (!window.voidAPI) return;
    const convs = await window.voidAPI.getConversations();
    const sorted = [...convs].sort((a, b) => b.updatedAt - a.updatedAt);
    set({ conversations: sorted });
    if (sorted.length > 0 && !get().activeId) {
      set({ activeId: sorted[0].id });
    }
  },

  persist: async () => {
    if (!window.voidAPI) return;
    await window.voidAPI.saveConversations(get().conversations);
  },

  newConversation: () => {
    const id = uuid();
    const conv = {
      id,
      title: '新对话',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      model: null,
      systemPrompt: null,
      source: 'gui',
      discordChannelId: null,
    };
    set(s => ({
      conversations: [conv, ...s.conversations],
      activeId: id,
    }));
    get().persist();
    return id;
  },

  deleteConversation: (id) => {
    set(s => {
      const filtered = s.conversations.filter(c => c.id !== id);
      let activeId = s.activeId;
      if (activeId === id) {
        activeId = filtered.length > 0 ? filtered[0].id : null;
      }
      return { conversations: filtered, activeId };
    });
    get().persist();
  },

  setActive: (id) => set({ activeId: id }),

  activeConversation: () => {
    const { conversations, activeId } = get();
    return conversations.find(c => c.id === activeId) || null;
  },

  addMessage: (convId, message) => {
    set(s => ({
      conversations: s.conversations.map(c => {
        if (c.id !== convId) return c;
        const messages = [...c.messages, message];
        // Auto-title from first user message
        let title = c.title;
        if (title === '新对话' && message.role === 'user') {
          title = truncate(message.content, 30) || '新对话';
        }
        return { ...c, messages, title, updatedAt: Date.now() };
      }),
    }));
    get().persist();
  },

  updateLastAssistantMessage: (convId, content) => {
    set(s => ({
      conversations: s.conversations.map(c => {
        if (c.id !== convId) return c;
        const messages = [...c.messages];
        const lastIdx = messages.length - 1;
        if (lastIdx >= 0 && messages[lastIdx].role === 'assistant') {
          messages[lastIdx] = { ...messages[lastIdx], content };
        }
        return { ...c, messages, updatedAt: Date.now() };
      }),
    }));
  },

  finalizeAssistantMessage: (convId) => {
    get().persist();
  },

  clearConversationMessages: (convId) => {
    set(s => ({
      conversations: s.conversations.map(c =>
        c.id !== convId ? c : { ...c, messages: [], updatedAt: Date.now() },
      ),
    }));
    get().persist();
  },
}));
