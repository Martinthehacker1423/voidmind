export function Slider({ value, onChange, min, max, step = 1, leftLabel, rightLabel, valueLabel }) {
  return (
    <div className="slider-wrap">
      {(leftLabel || rightLabel) && (
        <div className="slider-labels">
          <span>{leftLabel}</span>
          <span style={{ color: 'var(--text-2)' }}>{valueLabel ?? value}</span>
          <span>{rightLabel}</span>
        </div>
      )}
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  );
}
