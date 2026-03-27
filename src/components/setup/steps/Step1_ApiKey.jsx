import { useState } from 'react';
import { VoidAgent } from '../VoidAgent.jsx';
import { Input } from '../../ui/Input.jsx';
import { Button } from '../../ui/Button.jsx';
import { validateApiKey, diagnoseApiKeyError } from '../../../utils/claude.js';

const VOID_MESSAGES = {
  idle:    { text: '我需要一把"钥匙"才能连接 AI。你去 Anthropic 那里拿一下，我帮你完成剩下的所有事。', mood: 'neutral', action: null },
  loading: { text: '正在验证钥匙... 稍等一秒。', mood: 'thinking', action: null },
  success: { text: '完美！钥匙有效，我们可以继续了。', mood: 'success', action: null },
};

export function Step1_ApiKey({ onNext }) {
  const [key, setKey]           = useState('');
  const [state, setState]       = useState('idle');   // idle | loading | success | error
  const [errorInfo, setErrorInfo] = useState(null);
  const [guideOpen, setGuideOpen] = useState(false);

  const voidMsg = state === 'error'
    ? { text: errorInfo?.text || '出现了错误，请重试。', mood: 'warning', action: errorInfo?.action }
    : VOID_MESSAGES[state] || VOID_MESSAGES.idle;

  async function handleVerify() {
    if (!key.trim()) return;
    setState('loading');
    const result = await validateApiKey(key.trim());
    if (result.valid) {
      setState('success');
      // Save the key
      if (window.voidAPI) await window.voidAPI.setApiKey(key.trim());
    } else {
      const info = diagnoseApiKeyError(result.error || '', result.status);
      setErrorInfo(info);
      setState('error');
    }
  }

  return (
    <div>
      <div className="wizard-step-counter">步骤 1 / 3</div>
      <div className="step-title">配置 API Key</div>
      <div className="step-sub">让 VOIDMIND 连接到 Claude AI</div>

      <VoidAgent message={voidMsg.text} mood={voidMsg.mood} action={voidMsg.action} />

      {/* Guide toggle */}
      <button className="guide-toggle" onClick={() => setGuideOpen(v => !v)}>
        <span>{guideOpen ? '▾' : '▸'}</span>
        不知道怎么获取 API Key？点这里查看步骤
      </button>

      {guideOpen && (
        <div className="guide-content">
          {[
            {
              n: 1,
              text: '打开 Anthropic 控制台',
              link: { label: '打开 console.anthropic.com →', url: 'https://console.anthropic.com' },
            },
            { n: 2, text: '注册 / 登录 → 左侧点「API Keys」→ 点「Create Key」' },
            { n: 3, text: '复制生成的 Key（以 sk-ant-api03- 开头）' },
          ].map(s => (
            <div key={s.n} className="guide-step">
              <span className="guide-step-num">{s.n}</span>
              <div>
                <span>{s.text}</span>
                {s.link && (
                  <button className="void-action-link" style={{ display: 'block', marginTop: 4 }}
                    onClick={() => window.voidAPI?.openExternal(s.link.url)}>
                    ↗ {s.link.label}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Input
        type="password"
        placeholder="sk-ant-api03-..."
        value={key}
        onChange={e => { setKey(e.target.value); if (state !== 'idle') setState('idle'); }}
        validState={state === 'success' ? 'valid' : state === 'error' ? 'invalid' : undefined}
        onKeyDown={e => e.key === 'Enter' && handleVerify()}
      />

      {state === 'success' ? (
        <Button variant="primary" full onClick={onNext}>
          继续 →
        </Button>
      ) : (
        <Button
          variant="primary"
          full
          loading={state === 'loading'}
          disabled={!key.trim() || state === 'loading'}
          onClick={handleVerify}
        >
          {state === 'loading' ? '验证中...' : '验证并继续'}
        </Button>
      )}
    </div>
  );
}
