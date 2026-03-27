export function Toggle({ value, onChange }) {
  return (
    <div
      className={`toggle-wrap ${value ? 'on' : ''}`}
      onClick={() => onChange(!value)}
      role="switch"
      aria-checked={value}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' || e.key === ' ' ? onChange(!value) : null}
    >
      <div className="toggle-knob" />
    </div>
  );
}
