import { useEffect, useState } from 'react';
import { VoidAgent } from '../VoidAgent.jsx';
import { Button } from '../../ui/Button.jsx';

export function Step3_Ready({ onStart }) {
  const [btnVisible, setBtnVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBtnVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <span className="ready-star">✦</span>
      <div className="ready-title">已就绪！</div>
      <div className="ready-sub">
        你的 AI 助手已准备好了。<br />
        随时可以在设置里调整所有配置。
      </div>

      <VoidAgent
        mood="success"
        message="全部搞定！你现在可以开始和我聊天了。随时可以在设置里改这些配置。"
      />

      {btnVisible && (
        <div style={{ animation: 'fadeUp 0.4s var(--ease-out)' }}>
          <Button variant="primary" full onClick={onStart}>
            开始使用 VOIDMIND ✦
          </Button>
        </div>
      )}
    </div>
  );
}
