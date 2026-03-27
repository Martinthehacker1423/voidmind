import { VoidAgent } from '../VoidAgent.jsx';
import { Button } from '../../ui/Button.jsx';

export function Step0_Welcome({ onNext, onSkip }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="welcome-logo">VOIDMIND</div>
      <div className="welcome-tagline">你的私人 AI 空间</div>

      <VoidAgent
        mood="excited"
        message="嘿！我是 VOID，你的私人 AI 助手。让我帮你完成快速设置，3 步搞定，不用打开任何命令行。"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        <Button variant="primary" full onClick={onNext}>
          开始设置 →
        </Button>
        <Button variant="ghost" full onClick={onSkip}>
          已有配置，跳过
        </Button>
      </div>
    </div>
  );
}
