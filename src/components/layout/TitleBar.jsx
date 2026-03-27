export function TitleBar() {
  function minimize() { window.voidAPI?.windowMinimize(); }
  function maximize() { window.voidAPI?.windowMaximize(); }
  function close()    { window.voidAPI?.windowClose(); }

  return (
    <div className="titlebar">
      <div className="titlebar-controls">
        <button className="tb-btn tb-close"  onClick={close}    title="关闭" />
        <button className="tb-btn tb-min"    onClick={minimize} title="最小化" />
        <button className="tb-btn tb-max"    onClick={maximize} title="最大化" />
      </div>
      <div className="titlebar-title">VOIDMIND</div>
    </div>
  );
}
