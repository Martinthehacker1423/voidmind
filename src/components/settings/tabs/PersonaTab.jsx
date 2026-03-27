import { useState } from 'react';
import { useSettingsStore } from '../../../store/settingsStore.js';
import { PERSONAS } from '../../../utils/constants.js';
import { Button } from '../../ui/Button.jsx';
import { useToast } from '../../../hooks/useToast.js';

export function PersonaTab() {
  const { systemPrompt, updateSetting } = useSettingsStore();
  const [custom, setCustom] = useState(systemPrompt);
  const toast = useToast();

  function applyPreset(preset) {
    setCustom(preset.systemPrompt);
    updateSetting('systemPrompt', preset.systemPrompt);
    toast.success(`已切换为「${preset.name}」`);
  }

  async function saveCustom() {
    await updateSetting('systemPrompt', custom);
    toast.success('系统提示词已保存');
  }

  return (
    <div>
      <div className="settings-section-title">预设风格</div>
      <div className="persona-grid" style={{ marginBottom: 'var(--sp-5)' }}>
        {PERSONAS.map(p => {
          const isActive = systemPrompt === p.systemPrompt;
          return (
            <div key={p.id} className={`persona-card ${isActive ? 'selected' : ''}`} onClick={() => applyPreset(p)}>
              <div className="persona-check">✓</div>
              <div className="persona-icon">{p.icon}</div>
              <div className="persona-name">{p.name}</div>
              <div className="persona-desc">{p.desc}</div>
            </div>
          );
        })}
      </div>

      <div className="settings-section-title">自定义系统提示词</div>
      <textarea
        style={{
          width: '100%',
          background: 'var(--void-3)',
          border: '1px solid var(--border-2)',
          borderRadius: 'var(--r-md)',
          padding: 'var(--sp-3)',
          color: 'var(--text-1)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          lineHeight: 1.6,
          resize: 'vertical',
          minHeight: 100,
          outline: 'none',
          marginBottom: 'var(--sp-3)',
        }}
        placeholder="在这里输入自定义系统提示词..."
        value={custom}
        onChange={e => setCustom(e.target.value)}
        onFocus={e => { e.target.style.borderColor = 'var(--border-4)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border-2)'; }}
      />
      <Button variant="primary" onClick={saveCustom}>保存</Button>
    </div>
  );
}
