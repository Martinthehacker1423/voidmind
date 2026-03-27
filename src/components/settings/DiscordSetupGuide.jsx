import { useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';

const STEPS = [
  {
    title: '创建应用',
    items: [
      { text: '打开 Discord Developer Portal', link: { label: '点击打开 →', url: 'https://discord.com/developers/applications' } },
      { text: '点击右上角「New Application」' },
      { text: '随意输入名称（比如 VOIDMIND），点确认' },
    ],
  },
  {
    title: '创建 Bot',
    items: [
      { text: '左侧菜单点「Bot」' },
      { text: '找到 Token 区域，点「Reset Token」，复制保存' },
    ],
  },
  {
    title: '开启权限（重要！）',
    warning: '在同一页面往下滚，必须开启这 3 个开关：',
    items: [
      { text: '✓ PRESENCE INTENT' },
      { text: '✓ SERVER MEMBERS INTENT' },
      { text: '✓ MESSAGE CONTENT INTENT  ← 这个最关键' },
    ],
  },
  {
    title: '邀请 Bot 进服务器',
    items: [
      { text: '左侧点「OAuth2」→「URL Generator」' },
      { text: 'Scopes 勾：bot, applications.commands' },
      { text: 'Permissions 勾：Send Messages, Read Message History' },
      { text: '复制链接在浏览器打开，选你的服务器' },
    ],
  },
  {
    title: '填入 Token',
    items: [
      { text: '把刚才复制的 Token 粘贴到设置里' },
      { text: '点「启动 Bot」，看到绿点就成功了 🎉' },
    ],
  },
];

export function DiscordSetupGuide({ open, onClose }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <Modal open={open} onClose={onClose} width={480}>
      <div className="modal-header">
        <span className="modal-title">Discord Bot 配置向导</span>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
      <div style={{ padding: 'var(--sp-6)' }}>
        {/* Progress dots */}
        <div className="stepper-progress">
          {STEPS.map((_, i) => (
            <>
              <div key={i} className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </>
          ))}
        </div>

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', marginBottom: 'var(--sp-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          步骤 {step + 1} / {STEPS.length}
        </div>
        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-1)', marginBottom: 'var(--sp-4)' }}>
          {current.title}
        </div>

        {current.warning && (
          <div style={{ background: 'var(--warning-bg)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--r-md)', padding: 'var(--sp-3)', marginBottom: 'var(--sp-3)', fontSize: 'var(--text-sm)', color: 'var(--warning)' }}>
            ⚠ {current.warning}
          </div>
        )}

        <div className="guide-content" style={{ marginBottom: 'var(--sp-5)' }}>
          {current.items.map((item, i) => (
            <div key={i} className="guide-step">
              <span className="guide-step-num">{i + 1}</span>
              <div>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)' }}>{item.text}</span>
                {item.link && (
                  <button className="void-action-link" style={{ display: 'block', marginTop: 4 }}
                    onClick={() => window.voidAPI?.openExternal(item.link.url)}>
                    ↗ {item.link.label}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep(s => s - 1)}>
            ← 上一步
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={() => setStep(s => s + 1)}>
              下一步 →
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              完成 ✓
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
