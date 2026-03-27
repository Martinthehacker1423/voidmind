export function Button({ variant = 'primary', children, className = '', loading, disabled, full, ...props }) {
  const cls = [
    'btn',
    `btn-${variant}`,
    full && 'btn-full',
    loading && 'btn-loading',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      {loading && <span className="spin-icon">⟳</span>}
      {children}
    </button>
  );
}
