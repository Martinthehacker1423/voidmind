import { useSettingsStore } from '../../../store/settingsStore.js';
import { Slider } from '../../ui/Slider.jsx';
import { MODELS } from '../../../utils/constants.js';
import { useToast } from '../../../hooks/useToast.js';

export function ModelTab() {
  const { model, maxTokens, contextWindow, updateSetting } = useSettingsStore();
  const toast = useToast();

  async function update(key, val) {
    await updateSetting(key, val);
    toast.success('已保存');
  }

  return (
    <div>
      <div className="settings-section-title">AI 模型</div>
      <div className="radio-group" style={{ marginBottom: 'var(--sp-5)' }}>
        {MODELS.map(m => (
          <div key={m.id} className={`radio-option ${model === m.id ? 'selected' : ''}`}
            onClick={() => update('model', m.id)}>
            <div className="radio-circle"><div className="radio-dot" /></div>
            <div>
              <div className="radio-label">{m.label}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', marginTop: 2 }}>{m.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="settings-section-title">输出长度</div>
      <div style={{ marginBottom: 'var(--sp-5)' }}>
        <Slider
          value={maxTokens} min={256} max={8192} step={256}
          leftLabel="简短" rightLabel="超长"
          valueLabel={`${maxTokens} tokens`}
          onChange={v => update('maxTokens', v)}
        />
      </div>

      <div className="settings-section-title">记忆轮数</div>
      <Slider
        value={contextWindow} min={1} max={20} step={1}
        leftLabel="1 轮" rightLabel="20 轮"
        valueLabel={`${contextWindow} 轮`}
        onChange={v => update('contextWindow', v)}
      />
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', marginTop: 'var(--sp-2)', lineHeight: 1.5 }}>
        每次对话时向 AI 发送最近 N 轮对话作为上下文。越多越准确，但消耗更多 Token。
      </p>
    </div>
  );
}
