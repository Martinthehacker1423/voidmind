export function ProgressBar({ value, max, style }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ width: '100%', height: 4, background: 'var(--void-5)', borderRadius: 'var(--r-full)', overflow: 'hidden', ...style }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: 'linear-gradient(90deg, var(--p-600), var(--p-400))',
        borderRadius: 'var(--r-full)',
        transition: 'width var(--dur-slow) var(--ease-out)',
      }} />
    </div>
  );
}
