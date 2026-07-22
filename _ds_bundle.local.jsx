/* Local reconstruction of the Mesh Finance Design System component bundle.
   The Claude Design project's compiled _ds_bundle.js (271KB) exceeds the
   256KB cap on the design-sync read tool, so this file is assembled from
   the individual components sources instead, using the same
   try/catch-per-component + shared __ds_scope pattern the real bundle uses
   (visible in the first ~256KB of the real bundle, which did fetch cleanly).
   Loaded via <script type="text/babel"> so Babel transpiles the JSX here,
   rather than shipping pre-compiled React.createElement calls. */

(() => {

const __ds_ns = (window.MeshFinanceDesignSystem_5c98d0 = window.MeshFinanceDesignSystem_5c98d0 || {});
const __ds_scope = {};
(__ds_ns.__errors = __ds_ns.__errors || []);

// components/feedback/Alert.jsx
try { (() => {
(function injectAlertCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-alert-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-alert-css";
  s.textContent = `
.mesh-alert{ display:flex; gap:12px; padding:14px 16px; border-radius:var(--radius-md);
  border:1px solid; font-family:var(--font-body); font-size:var(--text-sm); line-height:1.5; }
.mesh-alert__icon{ flex:none; width:20px; height:20px; }
.mesh-alert__body{ flex:1; color:var(--text-body); }
.mesh-alert__title{ font-weight:var(--fw-semibold); color:var(--text-strong); margin-bottom:2px; }
.mesh-alert--info{ background:var(--blue-50); border-color:var(--blue-200); }
.mesh-alert--info .mesh-alert__icon{ color:var(--blue-600); }
.mesh-alert--success{ background:var(--green-50); border-color:#bfe3cd; }
.mesh-alert--success .mesh-alert__icon{ color:var(--green-600); }
.mesh-alert--warning{ background:var(--amber-50); border-color:#f1d59b; }
.mesh-alert--warning .mesh-alert__icon{ color:var(--amber-600); }
.mesh-alert--danger{ background:var(--red-50); border-color:#f2c1c1; }
.mesh-alert--danger .mesh-alert__icon{ color:var(--red-600); }
`;
  document.head.appendChild(s);
})();

const ICONS = {
  info: <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 5.2v.1m0 2.7v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>,
  success: <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-3.4 8.2l2.2 2.2 4.6-4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  warning: <path d="M10 2.5l8 14H2l8-14zm0 5v4m0 2.4v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  danger: <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-3 5l6 6m0-6l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>,
};

function Alert({ variant = "info", title, children, className = "", ...rest }) {
  const cls = ["mesh-alert", `mesh-alert--${variant}`, className].filter(Boolean).join(" ");
  return (
    <div role="note" className={cls} {...rest}>
      <svg className="mesh-alert__icon" viewBox="0 0 20 20" aria-hidden="true">{ICONS[variant]}</svg>
      <div className="mesh-alert__body">
        {title && <div className="mesh-alert__title">{title}</div>}
        {children}
      </div>
    </div>
  );
}
Object.assign(__ds_scope, { Alert });
Object.assign(__ds_ns, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/feedback/Badge.jsx
try { (() => {
(function injectBadgeCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-badge-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-badge-css";
  s.textContent = `
.mesh-badge{ display:inline-flex; align-items:center; gap:5px; font-family:var(--font-body);
  font-weight:var(--fw-semibold); font-size:var(--text-xs); line-height:1; padding:5px 10px;
  border-radius:var(--radius-pill); white-space:nowrap; }
.mesh-badge__dot{ width:6px; height:6px; border-radius:50%; background:currentColor; }
.mesh-badge--blue{ background:var(--blue-50); color:var(--blue-700); }
.mesh-badge--navy{ background:var(--navy-700); color:#fff; }
.mesh-badge--neutral{ background:var(--gray-100); color:var(--gray-700); }
.mesh-badge--success{ background:var(--green-50); color:var(--green-600); }
.mesh-badge--warning{ background:var(--amber-50); color:var(--amber-600); }
.mesh-badge--danger{ background:var(--red-50); color:var(--red-600); }
.mesh-badge--solid{ background:var(--color-primary); color:#fff; }
`;
  document.head.appendChild(s);
})();

function Badge({ children, color = "blue", dot = false, className = "", ...rest }) {
  const cls = ["mesh-badge", `mesh-badge--${color}`, className].filter(Boolean).join(" ");
  return (
    <span className={cls} {...rest}>
      {dot && <span className="mesh-badge__dot" />}
      {children}
    </span>
  );
}
Object.assign(__ds_scope, { Badge });
Object.assign(__ds_ns, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/feedback/Tag.jsx
try { (() => {
(function injectTagCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-tag-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-tag-css";
  s.textContent = `
.mesh-tag{ display:inline-flex; align-items:center; gap:6px; font-family:var(--font-body);
  font-weight:var(--fw-medium); font-size:var(--text-sm); line-height:1; padding:7px 12px;
  border-radius:var(--radius-pill); background:#fff; border:1px solid var(--border-default);
  color:var(--text-body); transition:border-color var(--duration-base) var(--ease-standard),
  background var(--duration-base) var(--ease-standard), color var(--duration-base) var(--ease-standard); }
.mesh-tag--selectable{ cursor:pointer; }
.mesh-tag--selectable:hover{ border-color:var(--color-primary); color:var(--color-primary); }
.mesh-tag--selected{ background:var(--color-primary-soft); border-color:var(--color-primary); color:var(--blue-700); }
.mesh-tag__x{ display:inline-flex; cursor:pointer; border:none; background:none; padding:0;
  color:currentColor; opacity:.6; }
.mesh-tag__x:hover{ opacity:1; }
`;
  document.head.appendChild(s);
})();

function Tag({ children, selected = false, selectable = false, onRemove, onClick, className = "", ...rest }) {
  const cls = [
    "mesh-tag",
    selectable ? "mesh-tag--selectable" : "",
    selected ? "mesh-tag--selected" : "",
    className,
  ].filter(Boolean).join(" ");
  return (
    <span className={cls} onClick={onClick} {...rest}>
      {children}
      {onRemove && (
        <button type="button" className="mesh-tag__x" aria-label="Remove"
          onClick={(e) => { e.stopPropagation(); onRemove(e); }}>
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>
      )}
    </span>
  );
}
Object.assign(__ds_scope, { Tag });
Object.assign(__ds_ns, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/feedback/Tooltip.jsx
try { (() => {
(function injectTooltipCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-tooltip-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-tooltip-css";
  s.textContent = `
.mesh-tooltip{ position:relative; display:inline-flex; }
.mesh-tooltip__bubble{ position:absolute; z-index:30; left:50%; transform:translateX(-50%) translateY(4px);
  bottom:calc(100% + 8px); background:var(--navy-700); color:#fff; font-family:var(--font-body);
  font-size:var(--text-xs); line-height:1.4; padding:7px 10px; border-radius:var(--radius-sm);
  white-space:nowrap; max-width:240px; box-shadow:var(--shadow-md); opacity:0; pointer-events:none;
  transition:opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-out); }
.mesh-tooltip__bubble::after{ content:""; position:absolute; top:100%; left:50%; transform:translateX(-50%);
  border:5px solid transparent; border-top-color:var(--navy-700); }
.mesh-tooltip:hover .mesh-tooltip__bubble,
.mesh-tooltip:focus-within .mesh-tooltip__bubble{ opacity:1; transform:translateX(-50%) translateY(0); }
`;
  document.head.appendChild(s);
})();

function Tooltip({ content, children, className = "", ...rest }) {
  return (
    <span className={["mesh-tooltip", className].filter(Boolean).join(" ")} {...rest}>
      {children}
      <span className="mesh-tooltip__bubble" role="tooltip">{content}</span>
    </span>
  );
}
Object.assign(__ds_scope, { Tooltip });
Object.assign(__ds_ns, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/forms/Button.jsx
try { (() => {
(function injectButtonCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-btn-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-btn-css";
  s.textContent = `
.mesh-btn{
  --_bg:var(--color-primary); --_fg:var(--text-on-color); --_bd:transparent;
  display:inline-flex; align-items:center; justify-content:center; gap:var(--space-2);
  font-family:var(--font-body); font-weight:var(--fw-semibold); line-height:1;
  border:1px solid var(--_bd); border-radius:var(--radius-pill); cursor:pointer;
  background:var(--_bg); color:var(--_fg); white-space:nowrap; text-decoration:none;
  transition:background var(--duration-base) var(--ease-standard),
             transform var(--duration-fast) var(--ease-standard),
             box-shadow var(--duration-base) var(--ease-standard),
             border-color var(--duration-base) var(--ease-standard);
}
.mesh-btn:hover{ text-decoration:none; }
.mesh-btn:active{ transform:translateY(1px); }
.mesh-btn:focus-visible{ outline:none; box-shadow:var(--ring); }
.mesh-btn[disabled],.mesh-btn[aria-disabled="true"]{ opacity:.5; cursor:not-allowed; transform:none; }

/* sizes */
.mesh-btn--sm{ font-size:var(--text-sm); padding:8px 16px; }
.mesh-btn--md{ font-size:var(--text-base); padding:12px 24px; }
.mesh-btn--lg{ font-size:var(--text-md); padding:15px 32px; }
.mesh-btn--block{ width:100%; }

/* variants */
.mesh-btn--primary{ --_bg:var(--color-primary); --_fg:#fff; box-shadow:var(--shadow-sm); }
.mesh-btn--primary:hover{ --_bg:var(--color-primary-hover); box-shadow:var(--shadow-md); }
.mesh-btn--primary:active{ --_bg:var(--color-primary-active); }

.mesh-btn--secondary{ --_bg:#fff; --_fg:var(--navy-700); --_bd:var(--border-default); }
.mesh-btn--secondary:hover{ --_bg:var(--gray-50); --_bd:var(--border-strong); }

.mesh-btn--navy{ --_bg:var(--navy-700); --_fg:#fff; }
.mesh-btn--navy:hover{ --_bg:var(--navy-600); }

.mesh-btn--ghost{ --_bg:transparent; --_fg:var(--color-primary); }
.mesh-btn--ghost:hover{ --_bg:var(--color-primary-soft); }

.mesh-btn--danger{ --_bg:var(--color-danger); --_fg:#fff; }
.mesh-btn--danger:hover{ --_bg:var(--red-600); }

.mesh-btn__spinner{ width:1em; height:1em; border-radius:50%;
  border:2px solid currentColor; border-right-color:transparent;
  animation:mesh-spin .6s linear infinite; }
@keyframes mesh-spin{ to{ transform:rotate(360deg); } }
`;
  document.head.appendChild(s);
})();

function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  as = "button",
  className = "",
  ...rest
}) {
  const Tag = as;
  const cls = [
    "mesh-btn",
    `mesh-btn--${variant}`,
    `mesh-btn--${size}`,
    block ? "mesh-btn--block" : "",
    className,
  ].filter(Boolean).join(" ");

  const isDisabled = disabled || loading;
  const extra = Tag === "button"
    ? { disabled: isDisabled }
    : { "aria-disabled": isDisabled || undefined };

  return (
    <Tag className={cls} {...extra} {...rest}>
      {loading && <span className="mesh-btn__spinner" aria-hidden="true" />}
      {!loading && iconLeft}
      {children}
      {!loading && iconRight}
    </Tag>
  );
}
Object.assign(__ds_scope, { Button });
Object.assign(__ds_ns, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/forms/Checkbox.jsx
try { (() => {
(function injectChoiceCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-choice-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-choice-css";
  s.textContent = `
.mesh-choice{ display:inline-flex; align-items:flex-start; gap:10px; cursor:pointer;
  font-family:var(--font-body); font-size:var(--text-base); color:var(--text-body); line-height:1.4; }
.mesh-choice input{ position:absolute; opacity:0; width:0; height:0; }
.mesh-choice__box{ flex:none; width:20px; height:20px; margin-top:1px; background:#fff;
  border:1.5px solid var(--border-strong); display:inline-flex; align-items:center; justify-content:center;
  transition:background var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard); }
.mesh-choice--check .mesh-choice__box{ border-radius:var(--radius-xs); }
.mesh-choice--radio .mesh-choice__box{ border-radius:50%; }
.mesh-choice__box svg{ opacity:0; transform:scale(.6); transition:opacity var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out); }
.mesh-choice__dot{ width:9px; height:9px; border-radius:50%; background:#fff; opacity:0; transform:scale(.4);
  transition:opacity var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out); }
.mesh-choice:hover .mesh-choice__box{ border-color:var(--color-primary); }
.mesh-choice input:checked + .mesh-choice__box{ background:var(--color-primary); border-color:var(--color-primary); }
.mesh-choice input:checked + .mesh-choice__box svg{ opacity:1; transform:scale(1); }
.mesh-choice input:checked + .mesh-choice__box .mesh-choice__dot{ opacity:1; transform:scale(1); }
.mesh-choice input:focus-visible + .mesh-choice__box{ box-shadow:var(--ring); }
.mesh-choice input:disabled + .mesh-choice__box{ background:var(--gray-100); border-color:var(--border-default); }
.mesh-choice:has(input:disabled){ color:var(--text-muted); cursor:not-allowed; }
`;
  document.head.appendChild(s);
})();

function Checkbox({ label, className = "", ...rest }) {
  return (
    <label className={["mesh-choice", "mesh-choice--check", className].filter(Boolean).join(" ")}>
      <input type="checkbox" {...rest} />
      <span className="mesh-choice__box" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6.2L4.8 9 10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
Object.assign(__ds_scope, { Checkbox });
Object.assign(__ds_ns, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/forms/Field.jsx
try { (() => {
(function injectFieldWrapCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-fieldwrap-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-fieldwrap-css";
  s.textContent = `
.mesh-field{ display:flex; flex-direction:column; gap:6px; }
.mesh-field__label{ font-family:var(--font-body); font-weight:var(--fw-semibold);
  font-size:var(--text-sm); color:var(--text-strong); }
.mesh-field__req{ color:var(--color-danger); margin-left:2px; }
.mesh-field__hint{ font-size:var(--text-sm); color:var(--text-muted); }
.mesh-field__error{ font-size:var(--text-sm); color:var(--color-danger); font-weight:var(--fw-medium); }
`;
  document.head.appendChild(s);
})();

function Field({ label, required, hint, error, htmlFor, children, className = "" }) {
  return (
    <div className={["mesh-field", className].filter(Boolean).join(" ")}>
      {label && (
        <label className="mesh-field__label" htmlFor={htmlFor}>
          {label}{required && <span className="mesh-field__req">*</span>}
        </label>
      )}
      {children}
      {error
        ? <span className="mesh-field__error">{error}</span>
        : hint && <span className="mesh-field__hint">{hint}</span>}
    </div>
  );
}
Object.assign(__ds_scope, { Field });
Object.assign(__ds_ns, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/forms/IconButton.jsx
try { (() => {
(function injectIconBtnCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-iconbtn-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-iconbtn-css";
  s.textContent = `
.mesh-iconbtn{
  display:inline-flex; align-items:center; justify-content:center;
  border:1px solid transparent; border-radius:var(--radius-pill); cursor:pointer;
  color:var(--navy-700); background:transparent; padding:0;
  transition:background var(--duration-base) var(--ease-standard),
             color var(--duration-base) var(--ease-standard),
             border-color var(--duration-base) var(--ease-standard);
}
.mesh-iconbtn svg{ display:block; }
.mesh-iconbtn:focus-visible{ outline:none; box-shadow:var(--ring); }
.mesh-iconbtn[disabled]{ opacity:.45; cursor:not-allowed; }
.mesh-iconbtn--sm{ width:32px; height:32px; }
.mesh-iconbtn--md{ width:40px; height:40px; }
.mesh-iconbtn--lg{ width:48px; height:48px; }
.mesh-iconbtn--ghost:hover{ background:var(--color-primary-soft); color:var(--color-primary); }
.mesh-iconbtn--solid{ background:var(--color-primary); color:#fff; }
.mesh-iconbtn--solid:hover{ background:var(--color-primary-hover); }
.mesh-iconbtn--outline{ border-color:var(--border-default); }
.mesh-iconbtn--outline:hover{ background:var(--gray-50); border-color:var(--border-strong); }
`;
  document.head.appendChild(s);
})();

function IconButton({
  children,
  label,
  variant = "ghost",
  size = "md",
  disabled = false,
  className = "",
  ...rest
}) {
  const cls = ["mesh-iconbtn", `mesh-iconbtn--${variant}`, `mesh-iconbtn--${size}`, className]
    .filter(Boolean).join(" ");
  return (
    <button type="button" className={cls} aria-label={label} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
Object.assign(__ds_scope, { IconButton });
Object.assign(__ds_ns, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/forms/Input.jsx
try { (() => {
function injectFieldCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-field-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-field-css";
  s.textContent = `
.mesh-control{
  font-family:var(--font-body); font-size:var(--text-base); color:var(--text-strong);
  background:#fff; border:1px solid var(--border-default); border-radius:var(--radius-md);
  padding:11px 14px; width:100%; line-height:1.4; appearance:none;
  transition:border-color var(--duration-base) var(--ease-standard),
             box-shadow var(--duration-base) var(--ease-standard);
}
.mesh-control::placeholder{ color:var(--text-subtle); }
.mesh-control:hover{ border-color:var(--border-strong); }
.mesh-control:focus{ outline:none; border-color:var(--border-focus); box-shadow:var(--ring); }
.mesh-control:disabled{ background:var(--gray-100); color:var(--text-muted); cursor:not-allowed; }
.mesh-control[aria-invalid="true"]{ border-color:var(--color-danger); }
.mesh-control[aria-invalid="true"]:focus{ box-shadow:0 0 0 3px rgba(214,69,69,.30); }
.mesh-control--sm{ padding:7px 11px; font-size:var(--text-sm); }
textarea.mesh-control{ resize:vertical; min-height:96px; }

/* select chevron */
.mesh-select-wrap{ position:relative; }
.mesh-select-wrap select.mesh-control{ padding-right:40px; cursor:pointer; }
.mesh-select-wrap::after{
  content:""; position:absolute; right:15px; top:50%; width:9px; height:9px;
  margin-top:-6px; border-right:2px solid var(--gray-500); border-bottom:2px solid var(--gray-500);
  transform:rotate(45deg); pointer-events:none;
}
`;
  document.head.appendChild(s);
}

function Input({ size = "md", invalid = false, className = "", ...rest }) {
  injectFieldCss();
  const cls = ["mesh-control", size === "sm" ? "mesh-control--sm" : "", className]
    .filter(Boolean).join(" ");
  return <input className={cls} aria-invalid={invalid || undefined} {...rest} />;
}
Object.assign(__ds_scope, { injectFieldCss, Input });
Object.assign(__ds_ns, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/forms/Radio.jsx
try { (() => {
function Radio({ label, className = "", ...rest }) {
  return (
    <label className={["mesh-choice", "mesh-choice--radio", className].filter(Boolean).join(" ")}>
      <input type="radio" {...rest} />
      <span className="mesh-choice__box" aria-hidden="true">
        <span className="mesh-choice__dot" />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
Object.assign(__ds_scope, { Radio });
Object.assign(__ds_ns, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/forms/Select.jsx
try { (() => {
function Select({ children, size = "md", invalid = false, placeholder, className = "", ...rest }) {
  __ds_scope.injectFieldCss();
  const cls = ["mesh-control", size === "sm" ? "mesh-control--sm" : "", className]
    .filter(Boolean).join(" ");
  return (
    <span className="mesh-select-wrap">
      <select className={cls} aria-invalid={invalid || undefined} {...rest}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {children}
      </select>
    </span>
  );
}
Object.assign(__ds_scope, { Select });
Object.assign(__ds_ns, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/forms/Switch.jsx
try { (() => {
(function injectSwitchCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-switch-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-switch-css";
  s.textContent = `
.mesh-switch{ display:inline-flex; align-items:center; gap:10px; cursor:pointer;
  font-family:var(--font-body); font-size:var(--text-base); color:var(--text-body); }
.mesh-switch input{ position:absolute; opacity:0; width:0; height:0; }
.mesh-switch__track{ position:relative; width:44px; height:26px; flex:none; border-radius:var(--radius-pill);
  background:var(--gray-300); transition:background var(--duration-base) var(--ease-standard); }
.mesh-switch__thumb{ position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%;
  background:#fff; box-shadow:var(--shadow-sm); transition:transform var(--duration-base) var(--ease-out); }
.mesh-switch input:checked + .mesh-switch__track{ background:var(--color-primary); }
.mesh-switch input:checked + .mesh-switch__track .mesh-switch__thumb{ transform:translateX(18px); }
.mesh-switch input:focus-visible + .mesh-switch__track{ box-shadow:var(--ring); }
.mesh-switch:has(input:disabled){ color:var(--text-muted); cursor:not-allowed; }
.mesh-switch input:disabled + .mesh-switch__track{ background:var(--gray-200); }
`;
  document.head.appendChild(s);
})();

function Switch({ label, className = "", ...rest }) {
  return (
    <label className={["mesh-switch", className].filter(Boolean).join(" ")}>
      <input type="checkbox" role="switch" {...rest} />
      <span className="mesh-switch__track" aria-hidden="true">
        <span className="mesh-switch__thumb" />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
Object.assign(__ds_scope, { Switch });
Object.assign(__ds_ns, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/forms/Textarea.jsx
try { (() => {
function Textarea({ invalid = false, rows = 4, className = "", ...rest }) {
  __ds_scope.injectFieldCss();
  const cls = ["mesh-control", className].filter(Boolean).join(" ");
  return <textarea className={cls} rows={rows} aria-invalid={invalid || undefined} {...rest} />;
}
Object.assign(__ds_scope, { Textarea });
Object.assign(__ds_ns, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/layout/Card.jsx
try { (() => {
(function injectCardCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-card-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-card-css";
  s.textContent = `
.mesh-card{ background:var(--surface-card); border:1px solid var(--border-subtle);
  border-radius:var(--radius-card); overflow:hidden; }
.mesh-card--sm{ border-radius:var(--radius-md); }
.mesh-card--shadow{ box-shadow:var(--shadow-sm); border-color:transparent; }
.mesh-card--shadow-lg{ box-shadow:var(--shadow-md); border-color:transparent; }
.mesh-card--interactive{ cursor:pointer; transition:transform var(--duration-base) var(--ease-out),
  box-shadow var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard); }
.mesh-card--interactive:hover{ transform:translateY(-3px); box-shadow:var(--shadow-lg); border-color:transparent; }
.mesh-card__pad{ padding:var(--space-6); }
.mesh-card--accent{ border-top:3px solid var(--color-primary); }
`;
  document.head.appendChild(s);
})();

function Card({
  children,
  elevation = "border",
  interactive = false,
  accent = false,
  padded = true,
  size = "md",
  className = "",
  ...rest
}) {
  const cls = [
    "mesh-card",
    size === "sm" ? "mesh-card--sm" : "",
    elevation === "shadow" ? "mesh-card--shadow" : "",
    elevation === "shadow-lg" ? "mesh-card--shadow-lg" : "",
    interactive ? "mesh-card--interactive" : "",
    accent ? "mesh-card--accent" : "",
    className,
  ].filter(Boolean).join(" ");
  return (
    <div className={cls} {...rest}>
      {padded ? <div className="mesh-card__pad">{children}</div> : children}
    </div>
  );
}
Object.assign(__ds_scope, { Card });
Object.assign(__ds_ns, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/layout/ServiceCard.jsx
try { (() => {
(function injectServiceCardCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-service-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-service-css";
  s.textContent = `
.mesh-service{ display:flex; flex-direction:column; gap:14px; background:var(--surface-card);
  border:1px solid var(--border-subtle); border-radius:var(--radius-card); padding:var(--space-6);
  text-decoration:none; color:inherit; transition:transform var(--duration-base) var(--ease-out),
  box-shadow var(--duration-base) var(--ease-standard); }
a.mesh-service:hover{ transform:translateY(-3px); box-shadow:var(--shadow-md); text-decoration:none; }
.mesh-service__icon{ width:52px; height:52px; border-radius:var(--radius-md); display:inline-flex;
  align-items:center; justify-content:center; background:var(--color-primary-soft); color:var(--color-primary); }
.mesh-service__icon svg{ width:26px; height:26px; }
.mesh-service__title{ font-family:var(--font-display); font-weight:var(--fw-bold); font-size:var(--text-lg);
  color:var(--text-strong); margin:0; }
.mesh-service__desc{ font-size:var(--text-sm); color:var(--text-muted); margin:0; line-height:1.5; flex:1; }
.mesh-service__cta{ display:inline-flex; align-items:center; gap:6px; font-weight:var(--fw-semibold);
  font-size:var(--text-sm); color:var(--color-primary); }
.mesh-service__cta svg{ transition:transform var(--duration-base) var(--ease-out); }
a.mesh-service:hover .mesh-service__cta svg{ transform:translateX(3px); }
.mesh-service--navy{ background:var(--navy-700); }
.mesh-service--navy .mesh-service__title{ color:#fff; }
.mesh-service--navy .mesh-service__desc{ color:rgba(255,255,255,.72); }
.mesh-service--navy .mesh-service__icon{ background:rgba(255,255,255,.12); color:#fff; }
`;
  document.head.appendChild(s);
})();

function ServiceCard({ icon, title, description, cta = "Learn more", href, tone = "light", className = "", ...rest }) {
  const Tag = href ? "a" : "div";
  const cls = ["mesh-service", tone === "navy" ? "mesh-service--navy" : "", className].filter(Boolean).join(" ");
  return (
    <Tag className={cls} href={href} {...rest}>
      {icon && <span className="mesh-service__icon">{icon}</span>}
      <h3 className="mesh-service__title">{title}</h3>
      {description && <p className="mesh-service__desc">{description}</p>}
      {cta && (
        <span className="mesh-service__cta">
          {cta}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      )}
    </Tag>
  );
}
Object.assign(__ds_scope, { ServiceCard });
Object.assign(__ds_ns, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/ServiceCard.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/layout/StatCard.jsx
try { (() => {
(function injectStatCardCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-stat-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-stat-css";
  s.textContent = `
.mesh-stat{ display:flex; flex-direction:column; gap:4px; padding:var(--space-5) var(--space-6); }
.mesh-stat__value{ font-family:var(--font-display); font-weight:var(--fw-extrabold);
  font-size:var(--text-3xl); line-height:1; color:var(--color-primary); letter-spacing:var(--tracking-tight); }
.mesh-stat__label{ font-size:var(--text-sm); color:var(--text-muted); font-weight:var(--fw-medium); }
.mesh-stat--navy .mesh-stat__value{ color:#fff; }
.mesh-stat--navy .mesh-stat__label{ color:rgba(255,255,255,.7); }
`;
  document.head.appendChild(s);
})();

function StatCard({ value, label, tone = "light", className = "", ...rest }) {
  const cls = ["mesh-stat", tone === "navy" ? "mesh-stat--navy" : "", className].filter(Boolean).join(" ");
  return (
    <div className={cls} {...rest}>
      <span className="mesh-stat__value">{value}</span>
      <span className="mesh-stat__label">{label}</span>
    </div>
  );
}
Object.assign(__ds_scope, { StatCard });
Object.assign(__ds_ns, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/StatCard.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/navigation/Accordion.jsx
try { (() => {
(function injectAccordionCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-accordion-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-accordion-css";
  s.textContent = `
.mesh-accordion{ display:flex; flex-direction:column; }
.mesh-acc-item{ border-bottom:1px solid var(--border-subtle); }
.mesh-acc-head{ width:100%; appearance:none; background:none; border:none; cursor:pointer;
  display:flex; align-items:center; justify-content:space-between; gap:16px; text-align:left;
  padding:18px 4px; font-family:var(--font-display); font-weight:var(--fw-semibold);
  font-size:var(--text-md); color:var(--text-strong); }
.mesh-acc-head:hover{ color:var(--color-primary); }
.mesh-acc-head:focus-visible{ outline:none; box-shadow:var(--ring); border-radius:var(--radius-xs); }
.mesh-acc-icon{ flex:none; width:24px; height:24px; border-radius:50%; background:var(--color-primary-soft);
  color:var(--color-primary); display:inline-flex; align-items:center; justify-content:center;
  transition:transform var(--duration-base) var(--ease-out), background var(--duration-base) var(--ease-standard); }
.mesh-acc-item--open .mesh-acc-icon{ transform:rotate(45deg); background:var(--color-primary); color:#fff; }
.mesh-acc-panel{ overflow:hidden; max-height:0; transition:max-height var(--duration-slow) var(--ease-standard); }
.mesh-acc-panel__inner{ padding:0 4px 28px; color:var(--text-body); font-size:var(--text-base); line-height:1.6; }
`;
  document.head.appendChild(s);
})();

function Accordion({ items = [], allowMultiple = false, defaultOpen = [], className = "" }) {
  const [open, setOpen] = React.useState(() => new Set(defaultOpen));
  /* Measure each answer's true height so an open panel's max-height matches its
     content exactly — no clipping at any width, and a smooth open/close. */
  const innerRefs = React.useRef([]);
  const [heights, setHeights] = React.useState({});
  React.useLayoutEffect(() => {
    const measure = () => {
      const next = {};
      innerRefs.current.forEach((el, i) => { if (el) next[i] = el.scrollHeight; });
      setHeights(next);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items]);
  const toggle = (i) => {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };
  return (
    <div className={["mesh-accordion", className].filter(Boolean).join(" ")}>
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className={["mesh-acc-item", isOpen ? "mesh-acc-item--open" : ""].filter(Boolean).join(" ")}>
            <button type="button" className="mesh-acc-head" aria-expanded={isOpen} onClick={() => toggle(i)}>
              <span>{it.question}</span>
              <span className="mesh-acc-icon" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 13 13"><path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </span>
            </button>
            <div className="mesh-acc-panel" style={{ maxHeight: isOpen ? ((heights[i] || 2000) + "px") : "0" }}>
              <div className="mesh-acc-panel__inner" ref={(el) => { innerRefs.current[i] = el; }}>{it.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
Object.assign(__ds_scope, { Accordion });
Object.assign(__ds_ns, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Accordion.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/navigation/Breadcrumb.jsx
try { (() => {
(function injectBreadcrumbCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-breadcrumb-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-breadcrumb-css";
  s.textContent = `
.mesh-breadcrumb{ display:flex; align-items:center; flex-wrap:wrap; gap:8px;
  font-family:var(--font-body); font-size:var(--text-sm); }
.mesh-breadcrumb a{ color:var(--text-muted); text-decoration:none; }
.mesh-breadcrumb a:hover{ color:var(--color-primary); }
.mesh-breadcrumb__sep{ color:var(--text-subtle); }
.mesh-breadcrumb__current{ color:var(--text-strong); font-weight:var(--fw-semibold); }
`;
  document.head.appendChild(s);
})();

function Breadcrumb({ items = [], className = "" }) {
  return (
    <nav className={["mesh-breadcrumb", className].filter(Boolean).join(" ")} aria-label="Breadcrumb">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {last
              ? <span className="mesh-breadcrumb__current" aria-current="page">{it.label}</span>
              : <a href={it.href || "#"} onClick={it.onClick}>{it.label}</a>}
            {!last && <span className="mesh-breadcrumb__sep" aria-hidden="true">/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
Object.assign(__ds_scope, { Breadcrumb });
Object.assign(__ds_ns, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); console.error(e); }

// components/navigation/Tabs.jsx
try { (() => {
(function injectTabsCss() {
  if (typeof document === "undefined" || document.getElementById("mesh-tabs-css")) return;
  const s = document.createElement("style");
  s.id = "mesh-tabs-css";
  s.textContent = `
.mesh-tabs__list{ display:flex; gap:4px; border-bottom:1px solid var(--border-subtle); }
.mesh-tab{ appearance:none; background:none; border:none; cursor:pointer; font-family:var(--font-body);
  font-weight:var(--fw-semibold); font-size:var(--text-base); color:var(--text-muted); padding:12px 16px;
  position:relative; border-bottom:2px solid transparent; margin-bottom:-1px;
  transition:color var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard); }
.mesh-tab:hover{ color:var(--text-strong); }
.mesh-tab--active{ color:var(--color-primary); border-bottom-color:var(--color-primary); }
.mesh-tab:focus-visible{ outline:none; box-shadow:var(--ring); border-radius:var(--radius-xs); }
.mesh-tabs__panel{ padding-top:var(--space-5); }
`;
  document.head.appendChild(s);
})();

function Tabs({ tabs = [], defaultIndex = 0, onChange, className = "" }) {
  const [active, setActive] = React.useState(defaultIndex);
  const select = (i) => { setActive(i); onChange && onChange(i); };
  return (
    <div className={["mesh-tabs", className].filter(Boolean).join(" ")}>
      <div className="mesh-tabs__list" role="tablist">
        {tabs.map((t, i) => (
          <button key={i} role="tab" aria-selected={i === active}
            className={["mesh-tab", i === active ? "mesh-tab--active" : ""].filter(Boolean).join(" ")}
            onClick={() => select(i)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="mesh-tabs__panel" role="tabpanel">
        {tabs[active] && tabs[active].content}
      </div>
    </div>
  );
}
Object.assign(__ds_scope, { Tabs });
Object.assign(__ds_ns, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); console.error(e); }

if (__ds_ns.__errors.length) { console.warn("MeshFinanceDesignSystem_5c98d0 load errors:", __ds_ns.__errors); }

})();
