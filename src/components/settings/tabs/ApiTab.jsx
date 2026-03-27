import { useState } from 'react';
import { Input } from '../../ui/Input.jsx';
import { Button } from '../../ui/Button.jsx';
import { validateApiKey, diagnoseApiKeyError } from '../../../utils/claude.js';
import { useToast } from '../../../hooks/useToast.js';

export function ApiTab() {
  const [key, setKey]     = useState('');
  const [state, setState] = useState('idle');
  const [loaded, setLoaded] = useState(false);
  const toast = useToast();

  // Load masked key on first render
  useState(() => {
    window.voidAPI?.getApiKey().then(k => {
      if (k) { setKey('•'.repeat(20)); setLoaded(true); setState('masked'); }
    });
  });

  async function handleVerify() {
    if (!key.trim() || state === 'masked') return;
    setState('loading');
    const result = await validateApiKey(key.trim());
    if (result.valid) {
      await window.voidAPI?.setApiKey(key.trim());
      setState('success');
      toast.success('API Key 已保存');
    } else {
      const info = diagnoseApiKeyError(result.error, result.status);
      setState('error');
      toast.error(info.text);
    }
  }

  function handleEdit() {
    setKey('');
    setState('idle');
    setLoaded(false);
  }

  return (
    <div>
      <div className="settings-section-title">Claude API Key</div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', marginBottom: 'var(--sp-4)', lineHeight: 1.6 }}>
        API Key 经过系统加密存储，不会以明文保存到磁盘。
      </p>

      <Input
        type="password"
        placeholder="sk-ant-api03-..."
        value={key}
        onChange={e => { setKey(e.target.value); setState('idle'); }}
        validState={state === 'success' ? 'valid' : state === 'error' ? 'invalid' : undefined}
        disabled={state === 'masked'}
      />

      <div style={{ display: 'flex', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)' }}>
        {state === 'masked' ? (
          <Button variant="secondary" onClick={handleEdit}>修改 Key</Button>
        ) : (
          <Button
            variant="primary"
            loading={state === 'loading'}
            disabled={!key.trim() || state === 'loading'}
            onClick={handleVerify}
          >
            {state === 'loading' ? '验证中...' : state === 'success' ? '已验证 ✓' : '验证并保存'}
          </Button>
        )}
        <Button variant="ghost" onClick={() => window.voidAPI?.openExternal('https://console.anthropic.com/settings/keys')}>
          ↗ 打开控制台
        </Button>
      </div>
    </div>
  );
}
