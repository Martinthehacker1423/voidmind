import { useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { useFeedbackStore } from '../../store/feedbackStore.js';
import { useToast } from '../../hooks/useToast.js';
import { formatTime } from '../../utils/format.js';

// ── 改成你自己的 GitHub 仓库 ──
const GITHUB_REPO = 'Martinthehacker1423/voidmind';

const CATEGORIES = [
  { id: 'bug',      icon: '🐛', label: 'Bug 报告' },
  { id: 'feature',  icon: '✦',  label: '功能建议' },
  { id: 'ux',       icon: '✨', label: '使用体验' },
  { id: 'other',    icon: '💬', label: '其他' },
];

const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function FeedbackPanel({ open, onClose }) {
  const [tab, setTab]       = useState('submit');   // submit | history
  const [score, setScore]   = useState(0);
  const [category, setCat]  = useState('');
  const [text, setText]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { entries, add } = useFeedbackStore();
  const toast = useToast();

  function reset() {
    setScore(0); setCat(''); setText(''); setSubmitting(false);
  }

  async function handleSubmit() {
    if (!score || !text.trim()) return;
    setSubmitting(true);

    const entry = await add({ score, category: category || 'other', text: text.trim() });
    toast.success('反馈已保存到本地');
    reset();
    setTab('history');
  }

  function openGitHubIssue(entry) {
    const cat = CATEGORIES.find(c => c.id === entry.category);
    const title = encodeURIComponent(`[${cat?.label ?? '反馈'}] 用户评分 ${entry.score}/10`);
    const body = encodeURIComponent(
`**类型：** ${cat?.label ?? '其他'}
**评分：** ${entry.score} / 10
**时间：** ${new Date(entry.createdAt).toLocaleString()}

---

${entry.text}

---
*via VOIDMIND in-app feedback*`
    );
    const label = entry.score <= 4 ? 'bug' : entry.score <= 7 ? 'enhancement' : 'feedback';
    const url = `https://github.com/${GITHUB_REPO}/issues/new?title=${title}&body=${body}&labels=${label}`;
    window.voidAPI?.openExternal(url);
  }

  function scoreColor(s) {
    if (s <= 4)  return 'var(--error)';
    if (s <= 6)  return 'var(--warning)';
    if (s <= 8)  return 'var(--p-400)';
    return 'var(--success)';
  }

  return (
    <Modal open={open} onClose={onClose} width={500}>
      <div className="modal-header">
        <span className="modal-title">用户反馈</span>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>

      {/* Tab 切换 */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-1)' }}>
        {[
          { id: 'submit',  label: '提交反馈' },
          { id: 'history', label: `历史记录 (${entries.length})` },
        ].map(t => (
          <button key={t.id}
            style={{
              flex: 1,
              padding: 'var(--sp-3)',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? '2px solid var(--p-500)' : '2px solid transparent',
              color: tab === t.id ? 'var(--text-1)' : 'var(--text-3)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              transition: 'all var(--dur-fast)',
              marginBottom: '-1px',
            }}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 'var(--sp-6)', maxHeight: '60vh', overflowY: 'auto' }}>

        {/* ── 提交表单 ── */}
        {tab === 'submit' && (
          <div>
            {/* NPS 评分 */}
            <div style={{ marginBottom: 'var(--sp-5)' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)', marginBottom: 'var(--sp-3)' }}>
                你有多大可能向朋友推荐 VOIDMIND？
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-1)', flexWrap: 'wrap' }}>
                {SCORES.map(s => (
                  <button key={s}
                    onClick={() => setScore(s)}
                    style={{
                      width: 40, height: 40,
                      borderRadius: 'var(--r-md)',
                      border: `1px solid ${score === s ? scoreColor(s) : 'var(--border-2)'}`,
                      background: score === s ? `${scoreColor(s)}22` : 'var(--void-3)',
                      color: score === s ? scoreColor(s) : 'var(--text-3)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: score === s ? 700 : 400,
                      cursor: 'pointer',
                      transition: 'all var(--dur-fast)',
                    }}>
                    {s}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-4)', marginTop: 'var(--sp-2)' }}>
                <span>极不可能</span>
                <span>非常愿意</span>
              </div>
            </div>

            {/* 分类 */}
            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)', marginBottom: 'var(--sp-2)' }}>
                反馈类型
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                {CATEGORIES.map(c => (
                  <button key={c.id}
                    onClick={() => setCat(c.id)}
                    style={{
                      padding: 'var(--sp-2) var(--sp-3)',
                      borderRadius: 'var(--r-full)',
                      border: `1px solid ${category === c.id ? 'var(--p-500)' : 'var(--border-2)'}`,
                      background: category === c.id ? 'var(--void-5)' : 'var(--void-3)',
                      color: category === c.id ? 'var(--text-accent)' : 'var(--text-3)',
                      fontSize: 'var(--text-xs)',
                      cursor: 'pointer',
                      transition: 'all var(--dur-fast)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 文字 */}
            <textarea
              placeholder="告诉我们你的想法、遇到的问题、或者希望添加的功能..."
              value={text}
              onChange={e => setText(e.target.value)}
              style={{
                width: '100%',
                minHeight: 100,
                background: 'var(--void-3)',
                border: '1px solid var(--border-2)',
                borderRadius: 'var(--r-md)',
                padding: 'var(--sp-3)',
                color: 'var(--text-1)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none',
                marginBottom: 'var(--sp-4)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--border-4)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-2)'}
            />

            <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
              <Button variant="primary"
                disabled={!score || !text.trim()}
                loading={submitting}
                onClick={handleSubmit}>
                保存反馈
              </Button>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', lineHeight: 1.4 }}>
                反馈存在本地，你可以选择提交到 GitHub
              </span>
            </div>
          </div>
        )}

        {/* ── 历史记录 ── */}
        {tab === 'history' && (
          <div>
            {entries.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: 'var(--sp-10) 0', fontSize: 'var(--text-sm)' }}>
                还没有反馈记录
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {entries.map(e => {
                  const cat = CATEGORIES.find(c => c.id === e.category);
                  return (
                    <div key={e.id} style={{
                      background: 'var(--void-3)',
                      border: '1px solid var(--border-2)',
                      borderRadius: 'var(--r-lg)',
                      padding: 'var(--sp-4)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                          <span style={{
                            fontWeight: 700,
                            color: scoreColor(e.score),
                            fontSize: 'var(--text-sm)',
                          }}>{e.score}/10</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)' }}>
                            {cat?.icon} {cat?.label}
                          </span>
                        </div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)' }}>
                          {formatTime(e.createdAt)}
                        </span>
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 'var(--sp-3)' }}>
                        {e.text}
                      </p>
                      <button
                        onClick={() => openGitHubIssue(e)}
                        style={{
                          background: 'none',
                          border: '1px solid var(--border-2)',
                          borderRadius: 'var(--r-sm)',
                          padding: '4px 10px',
                          color: 'var(--text-3)',
                          fontSize: 'var(--text-xs)',
                          cursor: 'pointer',
                          transition: 'all var(--dur-fast)',
                        }}
                        onMouseEnter={e => { e.target.style.borderColor = 'var(--p-500)'; e.target.style.color = 'var(--p-400)'; }}
                        onMouseLeave={e => { e.target.style.borderColor = 'var(--border-2)'; e.target.style.color = 'var(--text-3)'; }}
                      >
                        ↗ 提交到 GitHub Issue
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
