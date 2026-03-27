import { useUIStore } from '../../store/uiStore.js';

export function ConfirmDialog() {
  const { confirmDialog, closeConfirm } = useUIStore();
  if (!confirmDialog) return null;

  const { title, desc, onConfirm, danger } = confirmDialog;

  function handleConfirm() {
    onConfirm?.();
    closeConfirm();
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeConfirm(); }}>
      <div className="confirm-box">
        <div className="confirm-icon">{danger ? '⚠️' : '❓'}</div>
        <div className="confirm-title">{title}</div>
        <div className="confirm-desc">{desc}</div>
        <div className="confirm-actions">
          <button
            className="btn btn-secondary"
            style={{ padding: 'var(--sp-2) var(--sp-5)' }}
            onClick={closeConfirm}
          >
            取消
          </button>
          <button
            className="btn btn-primary"
            style={{
              padding: 'var(--sp-2) var(--sp-5)',
              background: danger ? 'var(--error)' : undefined,
            }}
            onClick={handleConfirm}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}
