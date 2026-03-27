export function StatusDot({ status = 'offline' }) {
  return <span className={`status-dot ${status}`} />;
}
