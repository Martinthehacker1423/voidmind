import Anthropic from '@anthropic-ai/sdk';
import { streamReply } from './streamReply.js';

// Per-channel conversation history: channelId -> Message[]
const histories = new Map();

export async function handleMessage({ message, settings, botUserId }) {
  const { apiKey, model, maxTokens, systemPrompt, contextWindow, trigger } = settings;

  // Check trigger mode
  const isMention = message.mentions.has(botUserId);
  if (trigger === 'mention' && !isMention) return;

  // Strip bot mention from content
  let content = message.content.replace(/<@!?\d+>/g, '').trim();
  if (!content) return;

  // Build history
  const channelId = message.channelId;
  if (!histories.has(channelId)) histories.set(channelId, []);
  const history = histories.get(channelId);

  history.push({ role: 'user', content });

  // Trim to context window
  const window = contextWindow || 10;
  const trimmed = history.slice(-window * 2);

  // Start typing indicator
  await message.channel.sendTyping().catch(() => {});

  const client = new Anthropic({ apiKey });
  const { append, finish } = await streamReply({ channel: message.channel });

  let fullText = '';

  try {
    const stream = client.messages.stream({
      model: model || 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens || 2048,
      system: systemPrompt || undefined,
      messages: trimmed,
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta?.type === 'text_delta'
      ) {
        const text = chunk.delta.text;
        fullText += text;
        append(text);
      }
    }
  } catch (err) {
    append(`\n\n⚠️ 出错了：${err.message}`);
  }

  await finish();

  // Save assistant reply to history
  history.push({ role: 'assistant', content: fullText });
  // Keep history trimmed
  while (history.length > window * 2 + 2) history.shift();
}

export function clearChannelHistory(channelId) {
  if (channelId) histories.delete(channelId);
  else histories.clear();
}
