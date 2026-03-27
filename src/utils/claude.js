import Anthropic from '@anthropic-ai/sdk';

/**
 * 流式发送消息
 */
export async function streamMessage({
  apiKey, model, messages, systemPrompt,
  maxTokens = 2048, onChunk, onComplete, onError, signal,
}) {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  let fullText = '';

  try {
    const stream = client.messages.stream({
      model,
      max_tokens: maxTokens,
      system: systemPrompt || undefined,
      messages,
    });

    for await (const chunk of stream) {
      if (signal?.aborted) break;
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta?.type === 'text_delta'
      ) {
        const text = chunk.delta.text;
        fullText += text;
        onChunk?.(text);
      }
    }
    onComplete?.(fullText);
  } catch (err) {
    if (err.name !== 'AbortError') {
      onError?.(err);
    }
  }

  return fullText;
}

/**
 * 验证 API Key
 */
export async function validateApiKey(apiKey) {
  try {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
    await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 5,
      messages: [{ role: 'user', content: 'hi' }],
    });
    return { valid: true };
  } catch (err) {
    return { valid: false, error: err.message, status: err.status };
  }
}

/**
 * 根据错误诊断给出友好提示
 */
export function diagnoseApiKeyError(errorMessage = '', status) {
  if (status === 401 || errorMessage.includes('401') || errorMessage.includes('authentication') || errorMessage.includes('invalid')) {
    return {
      text: '这个 Key 无效或已被撤销。请去 Anthropic 控制台检查一下 Key 是否还存在，或者重新生成一个。',
      action: { label: '打开控制台', url: 'https://console.anthropic.com/settings/keys' },
    };
  }
  if (errorMessage.includes('quota') || errorMessage.includes('billing') || errorMessage.includes('credit') || status === 402) {
    return {
      text: '你的账户余额不足。请去控制台充值（最低 $5），充值后这个 Key 就能用了。',
      action: { label: '去充值', url: 'https://console.anthropic.com/settings/billing' },
    };
  }
  if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('Failed to fetch')) {
    return {
      text: '网络连接有问题。请检查你的网络，或确认是否需要代理 / VPN 才能访问 Anthropic。',
      action: null,
    };
  }
  if (errorMessage.includes('rate') || status === 429) {
    return {
      text: '请求频率过高，请稍等片刻再试。',
      action: null,
    };
  }
  return {
    text: '出现了一个未知错误。请确认 Key 完整复制了，没有多余的空格，然后重试。',
    action: null,
  };
}
