import { useState } from 'react';

export function Input({ type = 'text', validState, suffix, className = '', ...props }) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPw ? 'text' : type;

  const fieldClass = [
    'input-field',
    validState === 'valid' && 'valid',
    validState === 'invalid' && 'invalid',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="input-field-wrap">
      <input className={fieldClass} type={inputType} {...props} />
      <div className="input-field-suffix">
        {validState === 'valid'   && <span className="validation-icon" style={{ color: 'var(--success)' }}>✓</span>}
        {validState === 'invalid' && <span className="validation-icon" style={{ color: 'var(--error)' }}>✗</span>}
        {isPassword && (
          <button className="pw-toggle" type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
            {showPw ? '🙈' : '👁'}
          </button>
        )}
        {suffix}
      </div>
    </div>
  );
}
