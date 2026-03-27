import { useState, useEffect } from 'react';

export function UpdateBanner() {
  const [state, setState] = useState(null);
  // state: null | { type: 'available', version } | { type: 'downloaded', version } | { type: 'progress', percent }

  useEffect(() => {
    if (!window.voidAPI?.onUpdater) return;
    const unsub = window.voidAPI.onUpdater((data) => {
      if (data.event === 'available') {
        setState({ type: 'available', version: data.version });
      } else if (data.event === 'progress') {
        setState({ type: 'progress', percent: data.percent });
      } else if (data.event === 'downloaded') {
        setState({ type: 'downloaded', version: data.version });
      } else if (data.event === 'error') {
        setState(null);
      }
    });
    return () => unsub?.();
  }, []);

  if (!state) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 80,
      right: 'var(--sp-6)',
      maxWidth: 320,
      background: 'var(--void-3)',
      border: '1px solid var(--border-3)',
      borderLeft: '3px solid var(--p-500)',
      borderRadius: 'var(--r-lg)',
      padding: 'var(--sp-4)',
      zIndex: 'calc(var(--z-toast) - 1)',
      boxShadow: 'var(--glow-md), 0 8px 32px rgba(0,0,0,0.4)',
      animation: 'toastIn 0.3s var(--ease-spring)',
    }}>
      {state.type === 'available' && (
        <>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>
            ✦ 发现新版本 {state.version}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)' }}>
            正在后台下载，完成后退出时自动安装
          </div>
        </>
      )}

      {state.type === 'progress' && (
        <>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-1)', marginBottom: 8 }}>
            正在下载更新... {state.percent}%
          </div>
          <div style={{ height: 3, background: 'var(--void-5)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${state.percent}%`,
              background: 'linear-gradient(90deg, var(--p-600), var(--p-400))',
              borderRadius: 'var(--r-full)',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </>
      )}

      {state.type === 'downloaded' && (
        <>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>
            ✓ 版本 {state.version} 已下载完成
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', marginBottom: 'var(--sp-3)' }}>
            重启应用即可完成更新
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <button
              onClick={() => window.voidAPI?.updaterInstall()}
              style={{
                padding: '4px 12px',
                background: 'var(--p-600)',
                border: 'none',
                borderRadius: 'var(--r-sm)',
                color: 'white',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                fontWeight: 500,
              }}>
              立即重启
            </button>
            <button
              onClick={() => setState(null)}
              style={{
                padding: '4px 12px',
                background: 'none',
                border: '1px solid var(--border-2)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--text-3)',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
              }}>
              稍后
            </button>
          </div>
        </>
      )}
    </div>
  );
}
