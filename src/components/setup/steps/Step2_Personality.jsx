import { useState } from 'react';
import { VoidAgent } from '../VoidAgent.jsx';
import { Button } from '../../ui/Button.jsx';
import { PERSONAS } from '../../../utils/constants.js';
import { useSettingsStore } from '../../../store/settingsStore.js';

export function Step2_Personality({ onNext, onSkip }) {
  const [selected, setSelected] = useState('default');
  const updateSettings = useSettingsStore(s => s.updateSettings);

  async function handleConfirm() {
    const persona = PERSONAS.find(p => p.id === selected);
    await updateSettings({ systemPrompt: persona?.systemPrompt || '' });
    onNext();
  }

  return (
    <div>
      <div className="wizard-step-counter">步骤 2 / 3</div>
      <div className="step-title">选择助手风格</div>
      <div className="step-sub">决定 AI 的初始个性，随时可以在设置里修改</div>

      <VoidAgent
        mood="neutral"
        message="接下来，你想让我是什么风格的助手？或者直接跳过，默认就挺好的。"
      />

      <div className="persona-grid">
        {PERSONAS.map(p => (
          <div
            key={p.id}
            className={`persona-card ${selected === p.id ? 'selected' : ''}`}
            onClick={() => setSelected(p.id)}
          >
            <div className="persona-check">✓</div>
            <div className="persona-icon">{p.icon}</div>
            <div className="persona-name">{p.name}</div>
            <div className="persona-desc">{p.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        <Button variant="primary" full onClick={handleConfirm}>
          确认并继续 →
        </Button>
        <Button variant="ghost" full onClick={onSkip}>
          跳过，以后再设置
        </Button>
      </div>
    </div>
  );
}
