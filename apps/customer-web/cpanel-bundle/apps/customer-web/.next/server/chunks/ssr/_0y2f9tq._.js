module.exports=[425,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"useMergedRef",{enumerable:!0,get:function(){return e}});let d=a.r(26670);function e(a,b){let c=(0,d.useRef)(null),e=(0,d.useRef)(null);return(0,d.useCallback)(d=>{if(null===d){let a=c.current;a&&(c.current=null,a());let b=e.current;b&&(e.current=null,b())}else a&&(c.current=f(a,d)),b&&(e.current=f(b,d))},[a,b])}function f(a,b){if("function"!=typeof a)return a.current=b,()=>{a.current=null};{let c=a(b);return"function"==typeof c?c:()=>a(null)}}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},19441,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"warnOnce",{enumerable:!0,get:function(){return d}});let d=a=>{}},65455,(a,b,c)=>{"use strict";let d;Object.defineProperty(c,"__esModule",{value:!0});var e={getAssetToken:function(){return i},getAssetTokenQuery:function(){return j},getDeploymentId:function(){return g},getDeploymentIdQuery:function(){return h}};for(var f in e)Object.defineProperty(c,f,{enumerable:!0,get:e[f]});function g(){return d}function h(a=!1){return d?`${a?"&":"?"}dpl=${d}`:""}function i(){return!1}function j(a=!1){return""}d=void 0},56120,76989,34910,10246,97263,19827,5790,a=>{"use strict";var b=a.i(89272);let c={narrow:760,normal:1160,wide:1360},d=`
main[data-elite-shell] {
  --elite-ink: #111827;
  --elite-ink-soft: #334155;
  --elite-muted: #5b6b7f;
  --elite-line: rgba(15, 23, 42, 0.12);
  --elite-line-strong: rgba(15, 23, 42, 0.18);
  --elite-paper: #f4f7fb;
  --elite-paper-strong: rgba(255, 255, 255, 0.88);
  --elite-card: rgba(255, 255, 255, 0.86);
  --elite-card-strong: rgba(255, 255, 255, 0.96);
  --elite-deep: #0f3050;
  --elite-accent: #0f766e;
  --elite-accent-2: #0b5f5b;
  --elite-accent-soft: rgba(15, 118, 110, 0.12);
  --elite-warm: #b45309;
  --elite-success: #15803d;
  --elite-warning: #b45309;
  --elite-danger: #b91c1c;
  --elite-radius-sm: 14px;
  --elite-radius-md: 20px;
  --elite-radius-lg: 28px;
  --elite-radius-xl: 34px;
  --elite-shadow-sm: 0 12px 24px rgba(15, 23, 42, 0.06);
  --elite-shadow-md: 0 22px 50px rgba(15, 23, 42, 0.08);
  --elite-shadow-lg: 0 32px 72px rgba(15, 23, 42, 0.12);
  --elite-page-gutter: clamp(18px, 2.4vw, 30px);
  --elite-content-gap: 22px;
  --elite-card-padding: clamp(18px, 2.1vw, 28px);
  --elite-card-padding-compact: 18px;
  --elite-shell-topbar-height: 88px;
  color: var(--elite-ink);
  font-family: var(--elite-font-body, "IBM Plex Sans", "Segoe UI", sans-serif);
}

main[data-elite-shell][data-header-mode="hidden"] {
  padding: 0;
}

main[data-elite-shell][data-surface="customer"] {
  --elite-accent: #0b6a54;
  --elite-accent-2: #034635;
  --elite-accent-soft: rgba(11, 106, 84, 0.12);
  --elite-warm: #b8860b;
  --elite-warning: #b8860b;
  --elite-shell-bg:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.16), transparent 28%),
    radial-gradient(circle at bottom right, rgba(184, 134, 11, 0.12), transparent 30%),
    linear-gradient(180deg, #f5f7f4 0%, #edf2ec 100%);
  --elite-rail-bg:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(247, 251, 247, 0.88) 100%);
}

html[dir="rtl"] main[data-elite-shell][data-surface="customer"] {
  direction: rtl;
}

main[data-elite-shell][data-surface="admin"] {
  --elite-accent: #1d4ed8;
  --elite-accent-2: #0f3c96;
  --elite-accent-soft: rgba(29, 78, 216, 0.1);
  --elite-warm: #c2410c;
  --elite-warning: #c2410c;
  --elite-shell-bg:
    radial-gradient(circle at top left, rgba(29, 78, 216, 0.16), transparent 28%),
    radial-gradient(circle at top right, rgba(194, 65, 12, 0.16), transparent 24%),
    linear-gradient(180deg, #f5f7fb 0%, #edf1f7 100%);
  --elite-rail-bg:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(246, 248, 252, 0.9) 100%);
}

main[data-elite-shell][data-surface="neutral"] {
  --elite-shell-bg:
    radial-gradient(circle at top left, rgba(15, 118, 110, 0.14), transparent 26%),
    radial-gradient(circle at top right, rgba(15, 23, 42, 0.08), transparent 24%),
    linear-gradient(180deg, #f7f8fb 0%, #eff2f7 100%);
  --elite-rail-bg:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(247, 250, 252, 0.9) 100%);
}

main[data-elite-shell][data-density="compact"] {
  --elite-content-gap: 18px;
}

main[data-elite-shell] * {
  box-sizing: border-box;
}

main[data-elite-shell] h1,
main[data-elite-shell] h2,
main[data-elite-shell] h3,
main[data-elite-shell] .elite-display,
main[data-elite-shell] .elite-metric-value,
main[data-elite-shell] .elite-definition-value {
  font-family: var(--elite-font-display, "Space Grotesk", "IBM Plex Sans", sans-serif);
  letter-spacing: -0.03em;
}

main[data-elite-shell] p,
main[data-elite-shell] li,
main[data-elite-shell] span,
main[data-elite-shell] label,
main[data-elite-shell] input,
main[data-elite-shell] textarea,
main[data-elite-shell] select,
main[data-elite-shell] button {
  font-size: 0.98rem;
}

main[data-elite-shell] a {
  color: var(--elite-accent-2);
  text-decoration: none;
  border-bottom: 1px solid rgba(15, 48, 80, 0.18);
  transition: color 150ms ease, border-color 150ms ease;
}

main[data-elite-shell] a:hover {
  color: var(--elite-warm);
  border-color: rgba(180, 83, 9, 0.45);
}

main[data-elite-shell] button[data-elite-button],
main[data-elite-shell] button:not([data-unstyled-button]) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  appearance: none;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.82rem 1.15rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease, background 140ms ease, border-color 140ms ease;
  box-shadow: var(--elite-shadow-sm);
  background: linear-gradient(135deg, var(--elite-accent) 0%, var(--elite-accent-2) 100%);
  color: #f8fbfc;
}

main[data-elite-shell] button[data-elite-button][data-size="compact"] {
  padding: 0.65rem 0.9rem;
  font-size: 0.9rem;
}

main[data-elite-shell] button[data-elite-button][data-size="large"] {
  min-height: 3.55rem;
  padding: 1rem 1.25rem;
  font-size: 1rem;
}

main[data-elite-shell] button[data-elite-button][data-stretch="true"] {
  width: 100%;
}

main[data-elite-shell] button[data-elite-button][data-tone="secondary"] {
  background: var(--elite-card-strong);
  color: var(--elite-ink);
  border-color: var(--elite-line);
  box-shadow: none;
}

main[data-elite-shell] button[data-elite-button][data-tone="ghost"] {
  background: var(--elite-accent-soft);
  color: var(--elite-accent-2);
  border-color: transparent;
  box-shadow: none;
}

main[data-elite-shell] button[data-elite-button][data-tone="danger"] {
  background: linear-gradient(135deg, #d64545 0%, #a61d35 100%);
}

main[data-elite-shell] button:hover:not(:disabled) {
  transform: translateY(-1px);
}

main[data-elite-shell] button:disabled {
  opacity: 0.58;
  cursor: not-allowed;
  transform: none;
}

main[data-elite-shell] [data-elite-control] {
  width: 100%;
  border: 1px solid var(--elite-line);
  border-radius: 16px;
  padding: 0.95rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: var(--elite-ink);
  outline: none;
  transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;
}

main[data-elite-shell] [data-elite-control][aria-invalid="true"] {
  border-color: rgba(185, 28, 28, 0.28);
  background: rgba(254, 242, 242, 0.98);
}

main[data-elite-shell] [data-elite-control]:focus {
  border-color: rgba(15, 118, 110, 0.35);
  box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.12);
  background: #ffffff;
}

main[data-elite-shell][data-surface="admin"] [data-elite-control]:focus {
  border-color: rgba(29, 78, 216, 0.3);
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.12);
}

main[data-elite-shell] textarea[data-elite-control] {
  min-height: 120px;
  resize: vertical;
}

main[data-elite-shell] .elite-field {
  display: grid;
  gap: 0.5rem;
}

main[data-elite-shell] .elite-field-label,
main[data-elite-shell] .elite-checkbox-label {
  font-weight: 700;
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-field-hint {
  color: var(--elite-muted);
  font-size: 0.88rem;
  line-height: 1.5;
}

main[data-elite-shell] .elite-field[data-tone="danger"] .elite-field-label,
main[data-elite-shell] .elite-field[data-tone="danger"] .elite-field-hint {
  color: var(--elite-danger);
}

main[data-elite-shell] .elite-control-shell {
  position: relative;
}

main[data-elite-shell] .elite-control-shell-password [data-elite-control] {
  padding-right: 4.9rem;
}

main[data-elite-shell] .elite-control-toggle {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  border: 0;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  color: var(--elite-ink-soft);
  font-weight: 700;
  cursor: pointer;
  transition: background 140ms ease, color 140ms ease;
}

main[data-elite-shell] .elite-control-toggle:hover {
  background: rgba(15, 23, 42, 0.12);
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.76);
}

main[data-elite-shell] .elite-checkbox-row input {
  width: 1.1rem;
  height: 1.1rem;
  margin-top: 0.1rem;
  accent-color: var(--elite-accent);
}

main[data-elite-shell] .elite-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.38rem;
  padding: 0.45rem 0.76rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

main[data-elite-shell] .elite-status-badge[data-tone="neutral"] {
  background: rgba(15, 23, 42, 0.06);
  border-color: rgba(15, 23, 42, 0.08);
  color: var(--elite-ink-soft);
}

main[data-elite-shell] .elite-status-badge[data-tone="info"] {
  background: rgba(37, 99, 235, 0.1);
  border-color: rgba(37, 99, 235, 0.14);
  color: #15408b;
}

main[data-elite-shell] .elite-status-badge[data-tone="success"] {
  background: rgba(21, 128, 61, 0.1);
  border-color: rgba(21, 128, 61, 0.14);
  color: #166534;
}

main[data-elite-shell] .elite-status-badge[data-tone="warning"] {
  background: rgba(180, 83, 9, 0.12);
  border-color: rgba(180, 83, 9, 0.16);
  color: #9a3412;
}

main[data-elite-shell] .elite-status-badge[data-tone="danger"] {
  background: rgba(185, 28, 28, 0.1);
  border-color: rgba(185, 28, 28, 0.14);
  color: #991b1b;
}

main[data-elite-shell] [data-elite-card] {
  position: relative;
  overflow: hidden;
  border-radius: var(--elite-radius-lg);
  border: 1px solid var(--elite-line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 251, 254, 0.84) 100%);
  box-shadow: var(--elite-shadow-sm);
  padding: var(--elite-card-padding);
}

main[data-elite-shell] [data-elite-card]::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.24), transparent 35%),
    radial-gradient(circle at top right, rgba(15, 118, 110, 0.08), transparent 30%);
}

main[data-elite-shell][data-surface="admin"] [data-elite-card]::before {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.24), transparent 35%),
    radial-gradient(circle at top right, rgba(29, 78, 216, 0.08), transparent 30%);
}

main[data-elite-shell] [data-elite-card][data-density="compact"] {
  padding: var(--elite-card-padding-compact);
}

main[data-elite-shell] [data-elite-card][data-tone="success"] {
  border-color: rgba(21, 128, 61, 0.16);
}

main[data-elite-shell] [data-elite-card][data-tone="warning"] {
  border-color: rgba(180, 83, 9, 0.18);
}

main[data-elite-shell] [data-elite-card][data-tone="danger"] {
  border-color: rgba(185, 28, 28, 0.18);
}

main[data-elite-shell] .elite-card-header,
main[data-elite-shell] .elite-card-body {
  position: relative;
}

main[data-elite-shell] .elite-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

main[data-elite-shell] .elite-card-copy {
  display: grid;
  gap: 6px;
}

main[data-elite-shell] .elite-card-eyebrow {
  margin: 0;
  color: var(--elite-accent);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

main[data-elite-shell] [data-elite-card][data-tone="warning"] .elite-card-eyebrow {
  color: var(--elite-warning);
}

main[data-elite-shell] [data-elite-card][data-tone="danger"] .elite-card-eyebrow {
  color: var(--elite-danger);
}

main[data-elite-shell] .elite-card-title {
  margin: 0;
  font-size: clamp(1.25rem, 1.3vw + 1rem, 1.7rem);
  line-height: 1.04;
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-card-subtitle {
  margin: 0;
  max-width: 72ch;
  color: var(--elite-muted);
  line-height: 1.58;
}

main[data-elite-shell] .elite-card-body {
  margin-top: 18px;
}

main[data-elite-shell] .elite-section-grid,
main[data-elite-shell] .elite-metric-grid,
main[data-elite-shell] .elite-definition-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(var(--elite-grid-min, 220px), 1fr));
}

main[data-elite-shell] .elite-metric-card,
main[data-elite-shell] .elite-definition-item {
  padding: 1rem 1.05rem;
  border-radius: 20px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
}

main[data-elite-shell] .elite-metric-card[data-emphasis="strong"],
main[data-elite-shell] .elite-definition-item[data-emphasis="strong"] {
  background: var(--elite-card-strong);
  border-color: var(--elite-line-strong);
}

main[data-elite-shell] .elite-metric-card[data-tone="success"],
main[data-elite-shell] .elite-definition-item[data-tone="success"] {
  background: rgba(240, 253, 244, 0.95);
  border-color: rgba(21, 128, 61, 0.16);
}

main[data-elite-shell] .elite-metric-card[data-tone="warning"],
main[data-elite-shell] .elite-definition-item[data-tone="warning"] {
  background: rgba(255, 247, 237, 0.95);
  border-color: rgba(180, 83, 9, 0.18);
}

main[data-elite-shell] .elite-metric-card[data-tone="danger"],
main[data-elite-shell] .elite-definition-item[data-tone="danger"] {
  background: rgba(254, 242, 242, 0.95);
  border-color: rgba(185, 28, 28, 0.18);
}

main[data-elite-shell] .elite-metric-label,
main[data-elite-shell] .elite-definition-label {
  color: var(--elite-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 800;
}

main[data-elite-shell] .elite-metric-value,
main[data-elite-shell] .elite-definition-value {
  margin-top: 0.5rem;
  color: var(--elite-ink);
  font-size: clamp(1.1rem, 1vw + 1rem, 1.45rem);
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

main[data-elite-shell] .elite-metric-hint {
  margin-top: 0.42rem;
  color: var(--elite-muted);
  font-size: 0.88rem;
}

main[data-elite-shell] .elite-notice {
  border-radius: 18px;
  padding: 1rem 1.05rem;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.84);
}

main[data-elite-shell] .elite-notice[data-emphasis="strong"] {
  border-left-width: 4px;
  background: var(--elite-card-strong);
}

main[data-elite-shell] .elite-notice[data-tone="info"] {
  background: rgba(239, 246, 255, 0.94);
  border-color: rgba(37, 99, 235, 0.16);
}

main[data-elite-shell] .elite-notice[data-tone="success"] {
  background: rgba(240, 253, 244, 0.94);
  border-color: rgba(21, 128, 61, 0.18);
}

main[data-elite-shell] .elite-notice[data-tone="warning"] {
  background: rgba(255, 247, 237, 0.95);
  border-color: rgba(180, 83, 9, 0.18);
}

main[data-elite-shell] .elite-notice[data-tone="danger"] {
  background: rgba(254, 242, 242, 0.95);
  border-color: rgba(185, 28, 28, 0.18);
}

main[data-elite-shell] .elite-notice-title {
  margin-bottom: 0.42rem;
  font-weight: 800;
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.9rem;
}

main[data-elite-shell] .elite-list-item {
  display: grid;
  gap: 0.5rem;
  padding: 1rem 1.05rem;
  border-radius: 20px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.72);
}

main[data-elite-shell] .elite-list-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
  font-weight: 800;
}

main[data-elite-shell] .elite-list-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  color: var(--elite-muted);
  font-size: 0.9rem;
}

main[data-elite-shell] .elite-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
}

main[data-elite-shell][data-surface="customer"] .elite-toolbar {
  justify-content: flex-end;
}

main[data-elite-shell] .elite-shell-topbar {
  position: relative;
  grid-column: 1 / -1;
  z-index: 12;
  display: grid;
  grid-template-columns: minmax(248px, 292px) minmax(0, 1fr) auto;
  gap: 0.5rem 0.85rem;
  align-items: center;
  min-height: var(--elite-shell-topbar-height);
  padding: 0;
  border: 0;
  border-bottom: 1px solid var(--elite-line);
  border-radius: 0;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: none;
}

main[data-elite-shell][data-surface="customer"] .elite-shell-topbar {
  border-color: rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.98);
  position: sticky;
  top: 0;
  isolation: isolate;
  box-shadow:
    0 14px 28px rgba(15, 23, 42, 0.05),
    0 1px 0 rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(12px);
}

main[data-elite-shell][data-surface="customer"] .elite-shell-topbar::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.08));
  pointer-events: none;
}

main[data-elite-shell] .elite-shell-topbar-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  width: 100%;
  min-height: 100%;
  gap: 0.72rem;
  padding: 0.58rem 0.9rem;
  border-right: 1px solid rgba(15, 23, 42, 0.08);
  min-width: 0;
}

main[data-elite-shell] .elite-shell-topbar-brand-mark {
  width: 2.08rem;
  height: 2.08rem;
  flex: 0 0 auto;
  border-radius: 13px;
  background:
    radial-gradient(circle at 28% 28%, rgba(255, 241, 188, 0.9), rgba(255, 241, 188, 0.22) 50%, transparent 51%),
    linear-gradient(135deg, #0b6a54 0%, #034635 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.26), 0 8px 14px rgba(3, 70, 53, 0.12);
  overflow: hidden;
}

main[data-elite-shell] .elite-shell-topbar-brand-mark[data-has-image="true"] {
  width: 4.5rem;
  height: 4.5rem;
  background: transparent;
  box-shadow: none;
}

main[data-elite-shell] .elite-shell-topbar-brand-mark-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

main[data-elite-shell] .elite-shell-topbar-brand-copy {
  display: grid;
  gap: 0.04rem;
  min-width: 0;
}

main[data-elite-shell] .elite-shell-topbar-brand-launcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.05rem;
  height: 2.05rem;
  margin-left: 0.1rem;
  flex: 0 0 auto;
  border-radius: 0;
  border: 0;
  background: transparent;
  color: var(--elite-ink-soft);
  box-shadow: none;
}

main[data-elite-shell] button.elite-shell-topbar-brand-launcher {
  cursor: pointer;
  transition:
    color 140ms ease,
    opacity 140ms ease,
    transform 140ms ease;
}

main[data-elite-shell] button.elite-shell-topbar-brand-launcher:hover {
  color: var(--elite-ink);
  opacity: 0.9;
}

main[data-elite-shell] button.elite-shell-topbar-brand-launcher:focus-visible {
  outline: 2px solid rgba(29, 78, 216, 0.35);
  outline-offset: 4px;
}

main[data-elite-shell] button.elite-shell-topbar-brand-launcher[data-state="collapsed"] {
  transform: scale(0.96);
}

main[data-elite-shell][data-surface="customer"] .elite-shell-topbar-brand-launcher {
  color: var(--elite-accent-2);
}

main[data-elite-shell] .elite-shell-topbar-brand-launcher svg {
  width: 1.16rem;
  height: 1.16rem;
  fill: currentColor;
}

main[data-elite-shell] .elite-shell-topbar-brand-name {
  color: var(--elite-ink);
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.02;
  white-space: nowrap;
}

main[data-elite-shell] .elite-shell-topbar-brand-subtitle {
  color: var(--elite-muted);
  font-size: 0.72rem;
  line-height: 1.15;
  white-space: nowrap;
}

main[data-elite-shell] .elite-shell-topbar-center {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.58rem 0;
  min-width: 0;
  color: var(--elite-muted);
  font-size: 0.78rem;
}

main[data-elite-shell] .elite-shell-topbar-center > * {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
}

main[data-elite-shell][data-surface="customer"] .elite-shell-topbar-center {
  padding-left: 0.2rem;
}

main[data-elite-shell] .elite-customer-topbar-announcement {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
  max-width: 100%;
  color: var(--elite-muted);
  font-size: 0.8rem;
  line-height: 1.1;
}

main[data-elite-shell] .elite-customer-topbar-announcement-icon {
  flex: 0 0 auto;
  font-size: 1.22rem;
  line-height: 1;
}

main[data-elite-shell] .elite-customer-topbar-announcement-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
}

main[data-elite-shell] .elite-customer-topbar-announcement-copy strong {
  color: var(--elite-ink-soft);
  font-weight: 800;
}

main[data-elite-shell] .elite-customer-topbar-announcement-copy span {
  color: var(--elite-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-customer-topbar-announcement-link {
  color: #635bff;
  font-weight: 800;
  white-space: nowrap;
}

main[data-elite-shell] .elite-customer-topbar-summary {
  display: inline-flex;
  align-items: center;
  gap: 0.68rem;
  min-width: 0;
}

main[data-elite-shell] .elite-customer-topbar-summary-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.34rem 0.62rem;
  border-radius: 999px;
  background: rgba(11, 106, 84, 0.1);
  color: var(--elite-accent-2);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
}

main[data-elite-shell] .elite-customer-topbar-summary-line {
  display: grid;
  gap: 0.02rem;
  min-width: 0;
}

main[data-elite-shell] .elite-customer-topbar-summary-line strong {
  color: var(--elite-ink);
  font-size: 0.88rem;
  font-weight: 800;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-customer-topbar-summary-line span {
  color: var(--elite-muted);
  font-size: 0.72rem;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-shell-topbar-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.55rem;
  flex-wrap: wrap;
  padding: 0.58rem 0.9rem 0.58rem 0;
}

main[data-elite-shell] .elite-shell-topbar [data-elite-button],
main[data-elite-shell] .elite-shell-topbar [data-elite-control] {
  box-shadow: none;
}

main[data-elite-shell] .elite-customer-topbar-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.55rem;
}

main[data-elite-shell] .elite-customer-topbar-utilities {
  display: flex;
  align-items: center;
  gap: 0.42rem;
  flex-wrap: nowrap;
}

main[data-elite-shell] .elite-customer-topbar-language,
main[data-elite-shell] .elite-customer-topbar-utility {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  color: var(--elite-ink-soft);
  cursor: pointer;
}

main[data-elite-shell][data-surface="customer"] .elite-customer-topbar-language,
main[data-elite-shell][data-surface="customer"] .elite-customer-topbar-utility {
  color: var(--elite-ink-soft);
}

main[data-elite-shell] .elite-customer-topbar-language {
  gap: 0.42rem;
  min-height: 1.6rem;
  padding: 0;
  border-radius: 0;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-customer-topbar-language-flag {
  display: inline-flex;
  width: 1.54rem;
  height: 1.1rem;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 3px;
}

main[data-elite-shell] .elite-customer-topbar-language-flag svg {
  width: 100%;
  height: 100%;
  display: block;
}

main[data-elite-shell] .elite-customer-topbar-language-code {
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-customer-topbar-utility {
  position: relative;
  width: 2.08rem;
  height: 2.08rem;
  border-radius: 0;
}

main[data-elite-shell] .elite-customer-topbar-utility svg {
  width: 1.2rem;
  height: 1.2rem;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

main[data-elite-shell] .elite-customer-topbar-language[data-active="true"],
main[data-elite-shell] .elite-customer-topbar-utility[data-active="true"] {
  color: var(--elite-accent-2);
}

main[data-elite-shell] .elite-customer-topbar-language:hover:not(:disabled),
main[data-elite-shell] .elite-customer-topbar-utility:hover:not(:disabled) {
  transform: none;
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-customer-topbar-language:focus-visible,
main[data-elite-shell] .elite-customer-topbar-utility:focus-visible {
  outline: 2px solid rgba(11, 106, 84, 0.25);
  outline-offset: 2px;
}

main[data-elite-shell] .elite-customer-topbar-utility-badge {
  position: absolute;
  top: -0.28rem;
  right: -0.28rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.02rem;
  height: 1.02rem;
  padding: 0 0.22rem;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 0.56rem;
  font-weight: 800;
  line-height: 1;
  box-shadow: 0 6px 12px rgba(239, 68, 68, 0.22);
}

main[data-elite-shell] .elite-theme-menu {
  position: relative;
  min-width: 0;
  isolation: isolate;
}

main[data-elite-shell] .elite-theme-menu-trigger {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.08rem;
  height: 2.08rem;
  border-radius: 999px;
  color: var(--elite-ink-soft);
  cursor: pointer;
  transition: color 140ms ease, background 140ms ease, transform 140ms ease;
}

main[data-elite-shell] .elite-theme-menu-trigger:hover {
  color: var(--elite-ink);
  background: rgba(15, 23, 42, 0.04);
}

main[data-elite-shell] .elite-theme-menu-trigger:focus-visible {
  outline: 2px solid rgba(11, 106, 84, 0.25);
  outline-offset: 2px;
}

main[data-elite-shell][data-surface="admin"] .elite-theme-menu-trigger:focus-visible {
  outline-color: rgba(29, 78, 216, 0.28);
}

main[data-elite-shell] .elite-theme-menu[data-open="true"] .elite-theme-menu-trigger {
  color: var(--elite-accent-2);
}

main[data-elite-shell] .elite-theme-menu-trigger-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

main[data-elite-shell] .elite-theme-menu-trigger-icon svg,
main[data-elite-shell] .elite-theme-menu-item-icon svg {
  width: 1.18rem;
  height: 1.18rem;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

main[data-elite-shell] .elite-theme-menu-panel {
  position: absolute;
  top: calc(100% + 0.55rem);
  right: 0;
  z-index: 48;
  display: grid;
  gap: 0.45rem;
  min-width: 15.5rem;
  padding: 0.7rem;
  border-radius: 22px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.98);
  box-shadow:
    0 22px 42px rgba(15, 23, 42, 0.14),
    0 8px 18px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(14px);
}

html[dir="rtl"] main[data-elite-shell] .elite-theme-menu-panel {
  left: 0;
  right: auto;
}

main[data-elite-shell] .elite-theme-menu-item {
  all: unset;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.7rem;
  padding: 0.72rem 0.8rem;
  border-radius: 16px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.88);
  color: var(--elite-ink);
  box-sizing: border-box;
  cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease, color 140ms ease;
}

main[data-elite-shell] .elite-theme-menu-item:hover {
  border-color: var(--elite-line-strong);
  background: var(--elite-card-strong);
}

main[data-elite-shell] .elite-theme-menu-item:focus-visible {
  outline: 2px solid rgba(11, 106, 84, 0.24);
  outline-offset: 2px;
}

main[data-elite-shell][data-surface="admin"] .elite-theme-menu-item:focus-visible {
  outline-color: rgba(29, 78, 216, 0.24);
}

main[data-elite-shell] .elite-theme-menu-item[data-active="true"] {
  border-color: rgba(15, 118, 110, 0.18);
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.12) 0%, rgba(255, 255, 255, 0.98) 100%);
}

main[data-elite-shell][data-surface="admin"] .elite-theme-menu-item[data-active="true"] {
  border-color: rgba(29, 78, 216, 0.18);
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.12) 0%, rgba(255, 255, 255, 0.98) 100%);
}

main[data-elite-shell] .elite-theme-menu-item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--elite-accent-2);
}

main[data-elite-shell] .elite-theme-menu-item-copy {
  display: grid;
  gap: 0.08rem;
  min-width: 0;
}

main[data-elite-shell] .elite-theme-menu-item-copy strong {
  color: var(--elite-ink);
  font-size: 0.86rem;
  font-weight: 800;
  line-height: 1.1;
}

main[data-elite-shell] .elite-theme-menu-item-copy span {
  color: var(--elite-muted);
  font-size: 0.72rem;
  line-height: 1.15;
}

main[data-elite-shell] .elite-theme-menu-item-check {
  color: var(--elite-accent-2);
  font-size: 0.82rem;
}

main[data-elite-shell] .elite-customer-topbar-menu {
  position: relative;
  min-width: 0;
  isolation: isolate;
}

main[data-elite-shell] .elite-customer-topbar-menu > summary {
  list-style: none;
}

main[data-elite-shell] .elite-customer-topbar-menu > summary::-webkit-details-marker {
  display: none;
}

main[data-elite-shell] .elite-customer-topbar-user {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
  min-height: 2.55rem;
  padding: 0.34rem 0.58rem 0.34rem 0.38rem;
  border-radius: 999px;
  border: 1px solid rgba(11, 106, 84, 0.14);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: none;
  cursor: pointer;
  user-select: none;
}

main[data-elite-shell] .elite-customer-topbar-menu[open] .elite-customer-topbar-user {
  border-color: rgba(11, 106, 84, 0.26);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

main[data-elite-shell] .elite-customer-topbar-user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #0b6a54 0%, #034635 100%);
  color: #f8fbfc;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

main[data-elite-shell] .elite-customer-topbar-user-copy {
  display: grid;
  gap: 0.04rem;
  min-width: 0;
}

main[data-elite-shell] .elite-customer-topbar-user-copy strong {
  color: var(--elite-ink);
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.05;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-customer-topbar-user-copy span {
  color: var(--elite-muted);
  font-size: 0.68rem;
  line-height: 1.05;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-customer-topbar-user-caret {
  color: var(--elite-muted);
  font-size: 0.72rem;
  line-height: 1;
}

main[data-elite-shell] .elite-customer-topbar-menu-panel {
  position: absolute;
  top: calc(100% + 0.55rem);
  right: 0;
  z-index: 40;
  display: grid;
  gap: 0.78rem;
  width: min(21rem, calc(100vw - 1.25rem));
  min-width: max(17.5rem, 100%);
  padding: 0.92rem;
  border-radius: 24px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(255, 255, 255, 0.995);
  box-shadow:
    0 22px 42px rgba(15, 23, 42, 0.14),
    0 8px 18px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(14px);
  overflow: hidden;
}

html[dir="rtl"] main[data-elite-shell] .elite-customer-topbar-menu-panel {
  left: 0;
  right: auto;
}

main[data-elite-shell] .elite-customer-topbar-menu-panel::before {
  content: "";
  position: absolute;
  top: -0.4rem;
  right: 1.85rem;
  width: 0.9rem;
  height: 0.9rem;
  border-top: 1px solid rgba(15, 23, 42, 0.1);
  border-left: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(255, 255, 255, 0.995);
  transform: rotate(45deg);
}

html[dir="rtl"] main[data-elite-shell] .elite-customer-topbar-menu-panel::before {
  left: 1.85rem;
  right: auto;
  border-left: 0;
  border-right: 1px solid rgba(15, 23, 42, 0.1);
}

main[data-elite-shell] .elite-customer-topbar-menu-eyebrow {
  color: var(--elite-muted);
  font-size: 0.67rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-customer-topbar-menu-list {
  display: grid;
  gap: 0.45rem;
}

main[data-elite-shell] .elite-customer-topbar-menu-item {
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.72rem 0.84rem;
  border-radius: 16px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.92);
  color: var(--elite-ink);
  text-align: left;
  box-shadow: none;
  cursor: pointer;
  font: inherit;
  transition:
    border-color 140ms ease,
    background 140ms ease,
    transform 140ms ease,
    box-shadow 140ms ease;
}

html[dir="rtl"] main[data-elite-shell] .elite-customer-topbar-menu-item,
html[dir="rtl"] main[data-elite-shell] .elite-rail-link,
html[dir="rtl"] main[data-elite-shell] .elite-page-header,
html[dir="rtl"] main[data-elite-shell] .elite-auth-panel,
html[dir="rtl"] main[data-elite-shell] .elite-auth-hero,
html[dir="rtl"] .elite-help-dialog {
  text-align: right;
}

main[data-elite-shell] .elite-customer-topbar-menu-item[data-active="true"] {
  border-color: rgba(11, 106, 84, 0.22);
  background: linear-gradient(135deg, rgba(11, 106, 84, 0.12) 0%, rgba(255, 255, 255, 0.98) 100%);
  box-shadow: inset 3px 0 0 var(--elite-accent);
}

main[data-elite-shell] .elite-customer-topbar-menu-item:hover {
  border-color: rgba(11, 106, 84, 0.18);
  background: linear-gradient(135deg, rgba(11, 106, 84, 0.07) 0%, rgba(255, 255, 255, 0.98) 100%);
}

main[data-elite-shell] .elite-customer-topbar-menu-item:focus-visible {
  outline: 2px solid rgba(11, 106, 84, 0.24);
  outline-offset: 2px;
}

main[data-elite-shell] .elite-customer-topbar-menu-item-copy {
  display: grid;
  gap: 0.06rem;
  min-width: 0;
}

main[data-elite-shell] .elite-customer-topbar-menu-item-copy strong {
  color: var(--elite-ink);
  font-size: 0.84rem;
  font-weight: 800;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-customer-topbar-menu-item-copy span {
  color: var(--elite-muted);
  font-size: 0.72rem;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-customer-topbar-menu-item-state {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.8rem;
  min-height: 2rem;
  padding: 0 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(11, 106, 84, 0.16);
  background: rgba(248, 251, 250, 0.96);
  color: var(--elite-accent-2);
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-customer-topbar-menu-item[data-active="true"] .elite-customer-topbar-menu-item-state {
  border-color: rgba(11, 106, 84, 0.2);
  background: rgba(255, 255, 255, 0.88);
}

main[data-elite-shell] .elite-customer-topbar-menu-logout {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 3rem;
  padding: 0.78rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #ffffff;
  color: var(--elite-ink);
  cursor: pointer;
  font: inherit;
  font-size: 0.94rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  transition:
    border-color 140ms ease,
    background 140ms ease,
    box-shadow 140ms ease;
}

main[data-elite-shell] .elite-customer-topbar-menu-logout:hover {
  border-color: rgba(15, 23, 42, 0.2);
  background: rgba(248, 250, 252, 0.96);
}

main[data-elite-shell] .elite-customer-topbar-menu-logout:focus-visible {
  outline: 2px solid rgba(11, 106, 84, 0.24);
  outline-offset: 2px;
}

main[data-elite-shell] .elite-customer-topbar-menu-logout {
  width: 100%;
  justify-content: center;
  border-radius: 16px;
  box-shadow: none;
}

main[data-elite-shell] .elite-customer-topbar-menu-logout[data-tone="secondary"] {
  background: rgba(15, 23, 42, 0.04);
}

main[data-elite-shell] .elite-customer-topbar-menu-logout[data-tone="secondary"]:hover:not(:disabled) {
  background: rgba(15, 23, 42, 0.06);
}

main[data-elite-shell] .elite-empty-state {
  display: grid;
  gap: 0.7rem;
  padding: clamp(20px, 4vw, 34px);
  border-radius: 22px;
  border: 1px dashed var(--elite-line-strong);
  background: rgba(255, 255, 255, 0.58);
  text-align: left;
}

main[data-elite-shell] .elite-empty-state h3 {
  margin: 0;
  font-size: 1.1rem;
}

main[data-elite-shell] .elite-empty-state p {
  margin: 0;
  color: var(--elite-muted);
  line-height: 1.6;
}

main[data-elite-shell] .elite-anchor-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

main[data-elite-shell] .elite-anchor-nav a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.64rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.74);
  color: var(--elite-ink-soft);
  font-weight: 700;
}

main[data-elite-shell] .elite-anchor-nav a:hover {
  background: var(--elite-card-strong);
  border-color: rgba(15, 118, 110, 0.18);
}

main[data-elite-shell] .elite-auth-layout {
  display: grid;
  gap: 18px;
  align-items: start;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 100vh;
  max-width: none;
  margin: 0;
  padding: clamp(28px, 4vw, 64px) clamp(24px, 5vw, 72px);
  border-radius: 0;
  border: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 241, 188, 0.22), transparent 24%),
    radial-gradient(circle at 78% 28%, rgba(186, 138, 21, 0.18), transparent 18%),
    radial-gradient(circle at bottom left, rgba(7, 116, 88, 0.24), transparent 28%),
    linear-gradient(135deg, #052e24 0%, #063c2f 38%, #0a5a46 72%, #094738 100%);
  box-shadow: none;
  align-items: stretch;
  gap: 0;
  isolation: isolate;
}

main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"] {
  background:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.08), transparent 24%),
    radial-gradient(circle at bottom right, rgba(184, 134, 11, 0.08), transparent 26%),
    linear-gradient(180deg, #f7faf8 0%, #eef3ef 100%);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at -8% 115%, rgba(255, 241, 188, 0.16), transparent 30%),
    radial-gradient(circle at 24% 112%, rgba(255, 255, 255, 0.08), transparent 26%),
    radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.1), transparent 14%);
  pointer-events: none;
}

main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"]::before {
  background:
    radial-gradient(circle at 12% 10%, rgba(255, 255, 255, 0.48), transparent 18%),
    radial-gradient(circle at 90% 84%, rgba(184, 134, 11, 0.06), transparent 18%),
    radial-gradient(circle at 10% 86%, rgba(11, 106, 84, 0.05), transparent 22%);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero::after {
  content: "";
  position: absolute;
  top: clamp(54px, 8vw, 110px);
  left: clamp(28px, 6vw, 84px);
  width: clamp(110px, 12vw, 160px);
  height: clamp(110px, 12vw, 160px);
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, rgba(255, 241, 188, 0.24), rgba(255, 255, 255, 0.06) 70%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.01));
  pointer-events: none;
}

main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"] .elite-auth-hero::after {
  display: none;
}

main[data-elite-shell] .elite-auth-hero,
main[data-elite-shell] .elite-auth-panel {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid var(--elite-line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.97) 0%, rgba(248, 251, 254, 0.9) 100%);
  box-shadow: var(--elite-shadow-md);
  padding: clamp(22px, 2.8vw, 32px);
  animation: eliteFadeUp 220ms ease;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero,
main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel {
  border: 0;
  box-shadow: none;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: clamp(18px, 3vw, 34px);
  padding: clamp(18px, 1.6vw, 28px) clamp(20px, 2vw, 34px) clamp(18px, 1.8vw, 26px);
  background: transparent;
  border-radius: 30px 0 0 30px;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero[data-media-only="true"] {
  align-items: stretch;
  text-align: center;
  gap: 0;
  padding: 0;
  border-radius: 30px 0 0 30px;
}

main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"] .elite-auth-hero[data-media-only="true"] {
  justify-content: center;
  background: linear-gradient(180deg, #ffffff 0%, #f7faf8 100%);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel {
  width: 100%;
  max-width: none;
  justify-self: stretch;
  align-self: stretch;
  height: 100%;
  padding: clamp(1.5rem, 1.6vw, 2rem);
  border-radius: 0 30px 30px 0;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 28px 72px rgba(3, 70, 53, 0.22);
  margin-left: -1px;
}

main[data-elite-shell] .elite-auth-hero::before,
main[data-elite-shell] .elite-auth-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
}

main[data-elite-shell] .elite-auth-hero::before {
  background:
    radial-gradient(circle at top left, rgba(15, 118, 110, 0.15), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.22), transparent 32%);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero::before,
main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel::before {
  display: none;
}

main[data-elite-shell][data-surface="admin"] .elite-auth-hero::before {
  background:
    radial-gradient(circle at top left, rgba(29, 78, 216, 0.14), transparent 34%),
    radial-gradient(circle at bottom right, rgba(194, 65, 12, 0.12), transparent 30%);
}

main[data-elite-shell] .elite-auth-hero,
main[data-elite-shell] .elite-auth-panel-top,
main[data-elite-shell] .elite-auth-panel-body {
  display: grid;
  gap: 16px;
}

main[data-elite-shell] .elite-auth-kicker {
  position: relative;
  z-index: 1;
  width: fit-content;
  padding: 0.42rem 0.7rem;
  border-radius: 999px;
  background: var(--elite-accent-soft);
  color: var(--elite-accent-2);
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-kicker {
  background: rgba(255, 241, 188, 0.14);
  color: rgba(255, 248, 225, 0.96);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel .elite-auth-kicker {
  background: rgba(11, 106, 84, 0.1);
  color: #0b5e4a;
}

main[data-elite-shell] .elite-auth-hero-title,
main[data-elite-shell] .elite-auth-panel-title {
  position: relative;
  z-index: 1;
  margin: 0;
  line-height: 0.97;
}

main[data-elite-shell] .elite-auth-hero-title {
  font-size: clamp(2rem, 3vw, 3rem);
  max-width: 12ch;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero-title {
  max-width: 7ch;
  font-size: clamp(3.2rem, 5.4vw, 6rem);
  color: #ffffff;
  letter-spacing: -0.04em;
  line-height: 0.92;
}

main[data-elite-shell] .elite-auth-panel-title {
  font-size: clamp(1.5rem, 1.4vw + 1rem, 2rem);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-title {
  font-size: clamp(1.9rem, 1.6vw, 2.2rem);
  letter-spacing: -0.04em;
}

main[data-elite-shell] .elite-auth-hero-copy,
main[data-elite-shell] .elite-auth-panel-subtitle {
  position: relative;
  z-index: 1;
  color: var(--elite-muted);
  line-height: 1.65;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero-copy {
  max-width: 44ch;
  color: rgba(242, 250, 244, 0.88);
  font-size: clamp(1.04rem, 0.6vw + 0.94rem, 1.34rem);
  line-height: 1.75;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-subtitle {
  font-size: 1rem;
  line-height: 1.55;
  max-width: 30ch;
}

main[data-elite-shell] .elite-auth-highlight-grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

main[data-elite-shell] .elite-auth-highlight {
  padding: 1rem 1.05rem;
  border-radius: 22px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.76);
}

main[data-elite-shell] .elite-auth-highlight[data-tone="info"] {
  background: rgba(239, 246, 255, 0.95);
  border-color: rgba(37, 99, 235, 0.14);
}

main[data-elite-shell] .elite-auth-highlight[data-tone="warning"] {
  background: rgba(255, 247, 237, 0.95);
  border-color: rgba(180, 83, 9, 0.16);
}

main[data-elite-shell] .elite-auth-highlight[data-tone="success"] {
  background: rgba(240, 253, 244, 0.95);
  border-color: rgba(21, 128, 61, 0.16);
}

main[data-elite-shell] .elite-auth-highlight-label {
  color: var(--elite-muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-auth-highlight-value {
  margin-top: 0.45rem;
  font-family: var(--elite-font-display, "Space Grotesk", "IBM Plex Sans", sans-serif);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-auth-highlight-detail {
  margin-top: 0.35rem;
  color: var(--elite-muted);
  line-height: 1.5;
}

main[data-elite-shell] .elite-auth-checklist {
  position: relative;
  z-index: 1;
}

main[data-elite-shell] .elite-auth-hero-media {
  position: relative;
  z-index: 1;
  width: min(100%, 820px);
}

main[data-elite-shell] .elite-auth-hero-media img {
  display: block;
  width: 100%;
  height: auto;
}

main[data-elite-shell] .elite-auth-checklist ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

main[data-elite-shell] .elite-auth-checklist li {
  display: flex;
  gap: 0.7rem;
  color: var(--elite-ink-soft);
  line-height: 1.58;
}

main[data-elite-shell] .elite-auth-checklist li::before {
  content: "";
  width: 0.65rem;
  height: 0.65rem;
  margin-top: 0.42rem;
  border-radius: 999px;
  flex: 0 0 auto;
  background: linear-gradient(135deg, var(--elite-accent) 0%, var(--elite-warm) 100%);
  box-shadow: 0 0 0 6px rgba(15, 118, 110, 0.08);
}

main[data-elite-shell][data-surface="admin"] .elite-auth-checklist li::before {
  box-shadow: 0 0 0 6px rgba(29, 78, 216, 0.08);
}

main[data-elite-shell] .elite-auth-footnote {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  color: var(--elite-muted);
  font-size: 0.9rem;
}

main[data-elite-shell] .elite-auth-panel {
  display: grid;
  gap: 18px;
  align-content: start;
}

main[data-elite-shell] .elite-auth-panel-top {
  position: relative;
  z-index: 1;
  gap: 14px;
  align-content: start;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-top {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 0.8rem;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-action {
  justify-self: end;
  align-self: start;
  justify-content: flex-end;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-copy {
  min-width: 0;
}

main[data-elite-shell] .elite-auth-panel-action {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
}

main[data-elite-shell] .elite-auth-panel-body {
  position: relative;
  z-index: 1;
  align-content: start;
}

main[data-elite-shell] .elite-auth-form {
  display: grid;
  gap: 15px;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-form {
  gap: 0.9rem;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: clamp(1.1rem, 1.7vw, 1.6rem);
  padding: clamp(1.8rem, 2.1vw, 2.6rem);
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-top,
main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-body {
  width: min(100%, 38rem);
  margin-inline: auto;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-top {
  grid-template-columns: 1fr;
  gap: 1rem;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-copy {
  display: grid;
  gap: 0.7rem;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-top {
  z-index: 4;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-copy {
  position: relative;
  z-index: 1;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-action {
  position: relative;
  z-index: 10;
  order: -1;
  justify-self: stretch;
  align-self: auto;
  width: 100%;
  justify-content: flex-start;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel {
  overflow: visible;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-theme-menu-panel {
  z-index: 1000;
}

html[dir="rtl"] main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-action {
  justify-content: flex-end;
}

html[dir="rtl"] main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel {
  order: -1;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-subtitle {
  max-width: 34ch;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-form {
  gap: 1rem;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-inline-actions {
  margin-top: 0.2rem;
  justify-content: center;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-hero[data-media-only="true"] {
  background: #ffffff;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-login-brand-stage {
  background: #ffffff;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-login-brand-stage::before {
  display: none;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-login-brand-image {
  width: min(72%, 560px);
}

main[data-elite-shell] .elite-auth-oauth-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.62rem;
}

main[data-elite-shell] .elite-auth-oauth-label svg {
  width: 1.02rem;
  height: 1.02rem;
  flex: 0 0 auto;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] button[data-elite-button] {
  background: linear-gradient(135deg, #0b6a54 0%, #044433 100%);
  box-shadow: 0 18px 28px rgba(3, 70, 53, 0.22);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] button[data-elite-button][data-tone="secondary"] {
  background: rgba(255, 255, 255, 0.98);
  color: var(--elite-ink);
  border-color: rgba(148, 163, 184, 0.26);
  box-shadow: none;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] button[data-elite-button]:hover:not(:disabled) {
  box-shadow: 0 22px 34px rgba(3, 70, 53, 0.3);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] button[data-elite-button][data-tone="secondary"]:hover:not(:disabled) {
  box-shadow: none;
}

main[data-elite-shell] .elite-auth-panel-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;
  justify-content: flex-end;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-tools {
  width: 100%;
  justify-content: space-between;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-field {
  gap: 0.4rem;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-field-label {
  font-size: 0.76rem;
  letter-spacing: 0.03em;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-field-hint {
  font-size: 0.8rem;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] [data-elite-control] {
  min-height: 3.35rem;
  border-radius: 18px;
  padding: 0.95rem 1rem;
  background: #f4f7fd;
  border-color: rgba(148, 163, 184, 0.28);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] [data-elite-control]:focus {
  border-color: rgba(11, 106, 84, 0.34);
  box-shadow: 0 0 0 4px rgba(11, 106, 84, 0.12);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-control-shell-password [data-elite-control] {
  padding-right: 4.4rem;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-control-toggle {
  right: 0.6rem;
  padding: 0.32rem 0.58rem;
  font-size: 0.82rem;
}

main[data-elite-shell] .elite-auth-segmented {
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.35rem;
  padding: 0.35rem;
  border-radius: 999px;
  border: 1px solid var(--elite-line);
  background: rgba(244, 247, 251, 0.96);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-segmented {
  padding: 0.22rem;
  gap: 0.2rem;
  background: rgba(15, 23, 42, 0.04);
}

main[data-elite-shell] .elite-auth-segment {
  min-height: 2.6rem;
  padding: 0.68rem 1rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--elite-ink-soft);
  font-weight: 800;
  cursor: pointer;
  transition: background 140ms ease, color 140ms ease, box-shadow 140ms ease, transform 140ms ease;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-segment {
  min-height: 2.2rem;
  padding: 0.5rem 0.8rem;
  font-size: 0.86rem;
}

main[data-elite-shell] .elite-auth-segment[data-active="true"] {
  background: linear-gradient(135deg, #0b6a54 0%, #044433 100%);
  color: #f8fbfc;
  box-shadow: var(--elite-shadow-sm);
}

main[data-elite-shell] .elite-auth-segment:hover {
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-password-strength {
  display: grid;
  gap: 0.55rem;
  padding: 0.95rem 1rem;
  border-radius: 18px;
  border: 1px solid var(--elite-line);
  background: rgba(248, 250, 252, 0.94);
}

main[data-elite-shell] .elite-password-strength-bars {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.45rem;
}

main[data-elite-shell] .elite-password-strength-bar {
  height: 0.38rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.24);
}

main[data-elite-shell] .elite-password-strength[data-score="1"] .elite-password-strength-bar[data-active="true"] {
  background: #f59e0b;
}

main[data-elite-shell] .elite-password-strength[data-score="2"] .elite-password-strength-bar[data-active="true"] {
  background: #0f766e;
}

main[data-elite-shell] .elite-password-strength[data-score="3"] .elite-password-strength-bar[data-active="true"] {
  background: #15803d;
}

main[data-elite-shell][data-surface="admin"] .elite-password-strength[data-score="2"] .elite-password-strength-bar[data-active="true"] {
  background: #1d4ed8;
}

main[data-elite-shell] .elite-password-strength-copy {
  display: grid;
  gap: 0.2rem;
}

main[data-elite-shell] .elite-password-strength-copy strong {
  color: var(--elite-ink);
  font-size: 0.92rem;
}

main[data-elite-shell] .elite-password-strength-copy span {
  color: var(--elite-muted);
  font-size: 0.86rem;
  line-height: 1.45;
}

main[data-elite-shell] .elite-auth-inline-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  align-items: center;
  color: var(--elite-muted);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-inline-actions {
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.86rem;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-footnote {
  max-width: 44ch;
  color: rgba(242, 250, 244, 0.76);
  font-size: 0.98rem;
  line-height: 1.65;
}

main[data-elite-shell] .elite-auth-centered-stage {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: clamp(20px, 4vw, 56px);
}

main[data-elite-shell] .elite-auth-centered-card {
  width: min(100%, 720px);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero-media {
  margin-top: clamp(10px, 1.2vw, 18px);
  filter: none;
}

main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"] .elite-auth-hero[data-media-only="true"] .elite-auth-hero-media {
  width: 100%;
  max-width: none;
  height: 100%;
  margin-top: 0;
  filter: none;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero[data-media-only="true"] .elite-auth-hero-media {
  width: min(100%, 920px);
  margin-top: 0;
  filter: none;
}

main[data-elite-shell] .elite-login-brand-stage {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: clamp(24px, 3vw, 44px);
  background: #ffffff;
  border-radius: 30px 0 0 30px;
  overflow: hidden;
}

main[data-elite-shell] .elite-login-brand-stage::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 20%, rgba(11, 106, 84, 0.06), transparent 24%),
    radial-gradient(circle at 80% 78%, rgba(184, 134, 11, 0.05), transparent 22%);
  pointer-events: none;
}

main[data-elite-shell] .elite-login-brand-image {
  position: relative;
  z-index: 1;
  display: block;
  width: min(78%, 680px);
  height: auto;
  transform: none;
  filter: none;
}

main[data-elite-shell] .elite-auth-inline-actions button[data-unstyled-button] {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--elite-accent-2);
  font-weight: 700;
  cursor: pointer;
}

main[data-elite-shell] .elite-auth-inline-actions button[data-unstyled-button]:hover {
  color: var(--elite-warm);
}

main[data-elite-shell] .elite-auth-disclosure {
  border-radius: 18px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.72);
  overflow: hidden;
}

main[data-elite-shell] .elite-auth-disclosure summary {
  cursor: pointer;
  list-style: none;
  padding: 0.95rem 1rem;
  font-weight: 700;
  color: var(--elite-ink-soft);
}

main[data-elite-shell] .elite-auth-disclosure summary::-webkit-details-marker {
  display: none;
}

main[data-elite-shell] .elite-auth-disclosure-body {
  padding: 0 1rem 1rem;
}

main[data-elite-shell] .elite-help-icon-button {
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 999px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.94);
  color: var(--elite-accent-2);
  font-size: 1rem;
  font-weight: 900;
  box-shadow: var(--elite-shadow-sm);
  cursor: pointer;
  transition: transform 140ms ease, background 140ms ease, border-color 140ms ease, color 140ms ease;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-help-icon-button {
  width: 2.35rem;
  height: 2.35rem;
  box-shadow: none;
}

main[data-elite-shell] .elite-help-icon-button:hover {
  transform: translateY(-1px);
  border-color: rgba(15, 118, 110, 0.18);
  background: #ffffff;
  color: var(--elite-warm);
}

main[data-elite-shell] .elite-help-dialog-backdrop,
.elite-help-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(18px, 3vw, 28px);
  background: rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(8px);
}

main[data-elite-shell] .elite-help-dialog,
.elite-help-dialog {
  width: min(760px, 100%);
  max-height: min(82vh, 860px);
  overflow: auto;
  border-radius: 28px;
  border: 1px solid var(--elite-line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 250, 252, 0.96) 100%);
  box-shadow: var(--elite-shadow-lg);
  padding: clamp(20px, 3vw, 30px);
}

main[data-elite-shell] .elite-help-dialog-header,
.elite-help-dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.elite-help-dialog-copy {
  display: grid;
  gap: 0.75rem;
}

.elite-help-dialog-title {
  margin: 0;
  font-size: clamp(1.6rem, 1.5vw + 1rem, 2.2rem);
  line-height: 1;
}

.elite-help-dialog-intro {
  color: var(--elite-muted);
  line-height: 1.65;
  max-width: 65ch;
}

.elite-help-dialog-close {
  width: 2.4rem;
  height: 2.4rem;
  flex: 0 0 auto;
  border-radius: 999px;
  border: 1px solid var(--elite-line);
  background: rgba(15, 23, 42, 0.04);
  color: var(--elite-ink-soft);
  font-size: 1.35rem;
  cursor: pointer;
}

.elite-help-dialog-body {
  display: grid;
  gap: 1rem;
  margin-top: 1.15rem;
}

.elite-help-dialog-section {
  padding: 1rem 1.05rem;
  border-radius: 20px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.76);
}

.elite-help-dialog-section h3 {
  margin: 0 0 0.55rem;
  font-size: 1rem;
}

.elite-help-dialog-section p {
  margin: 0;
  color: var(--elite-muted);
  line-height: 1.6;
}

.elite-help-dialog-list {
  margin: 0.75rem 0 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.55rem;
  color: var(--elite-ink-soft);
}

.elite-help-dialog-footer {
  color: var(--elite-muted);
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  align-items: center;
}

main[data-elite-shell] .elite-mono-panel {
  margin-top: 1rem;
  border-radius: 20px;
  padding: 1rem;
  background: #122030;
  color: #eef4f8;
  overflow-x: auto;
  white-space: pre-wrap;
}

main[data-elite-shell] code {
  font-family: "SFMono-Regular", "Menlo", "Monaco", monospace;
  font-size: 0.93em;
  padding: 0.16rem 0.4rem;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.08);
  color: var(--elite-accent-2);
}

main[data-elite-shell] pre code {
  padding: 0;
  background: transparent;
  color: inherit;
}

main[data-elite-shell] .elite-sticky-panel {
  position: sticky;
  top: 18px;
}

main[data-elite-shell] .elite-shell-frame {
  display: grid;
  gap: 18px;
}

main[data-elite-shell][data-surface="customer"] .elite-shell-frame {
  gap: 0;
}

main[data-elite-shell] .elite-shell-aside {
  display: none;
}

main[data-elite-shell] .elite-shell-main {
  min-width: 0;
}

main[data-elite-shell] .elite-shell-mobile-nav {
  display: block;
}

main[data-elite-shell][data-nav-collapsed="true"] .elite-shell-mobile-nav {
  display: none;
}

main[data-elite-shell] .elite-shell-mobile-nav details {
  border-radius: 22px;
  border: 1px solid var(--elite-line);
  background: var(--elite-rail-bg);
  box-shadow: var(--elite-shadow-sm);
  overflow: hidden;
}

main[data-elite-shell] .elite-shell-mobile-nav summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0.95rem 1rem;
  font-weight: 800;
}

main[data-elite-shell] .elite-shell-mobile-nav summary::-webkit-details-marker {
  display: none;
}

main[data-elite-shell] .elite-shell-mobile-nav-body {
  padding: 0 0.9rem 0.9rem;
}

main[data-elite-shell] .elite-shell-content {
  width: 100%;
  display: grid;
  gap: var(--elite-content-gap);
}

main[data-elite-shell][data-header-mode="hidden"] .elite-shell-content {
  min-height: 100vh;
  max-width: none !important;
  gap: 0;
}

main[data-elite-shell][data-header-mode="hidden"] .elite-shell-main {
  min-height: 100vh;
}

main[data-elite-shell][data-header-mode="hidden"] .elite-page-stack {
  min-height: 100vh;
}

main[data-elite-shell] .elite-page-header {
  position: relative;
  overflow: hidden;
  border-radius: var(--elite-radius-xl);
  border: 1px solid var(--elite-line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 251, 254, 0.88) 100%);
  box-shadow: var(--elite-shadow-md);
  padding: clamp(22px, 3vw, 34px);
  display: grid;
  gap: 18px;
}

main[data-elite-shell][data-surface="customer"] .elite-page-header {
  position: relative;
  top: auto;
  z-index: auto;
  padding: 0.85rem 0.25rem 0.25rem;
  margin-top: 0.1rem;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  gap: 0.5rem;
}

main[data-elite-shell] .elite-page-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 30%),
    radial-gradient(circle at top right, rgba(15, 118, 110, 0.11), transparent 32%);
  pointer-events: none;
}

main[data-elite-shell][data-surface="admin"] .elite-page-header::before {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 30%),
    radial-gradient(circle at top right, rgba(29, 78, 216, 0.11), transparent 32%);
}

main[data-elite-shell][data-surface="customer"] .elite-page-header::before {
  display: none;
}

main[data-elite-shell] .elite-page-header-top {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

main[data-elite-shell][data-surface="customer"] .elite-page-header-top {
  display: none;
}

main[data-elite-shell] .elite-page-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: fit-content;
  padding: 0.52rem 0.82rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.94);
  color: #f8fbfc;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--elite-shadow-sm);
  text-transform: uppercase;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

main[data-elite-shell] .elite-page-brand-mark {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--elite-accent) 0%, var(--elite-warm) 100%);
}

main[data-elite-shell] .elite-page-header-body {
  position: relative;
  display: grid;
  gap: 12px;
}

main[data-elite-shell][data-surface="customer"] .elite-page-header-body {
  gap: 0.75rem;
}

main[data-elite-shell] .elite-page-header-row {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
}

main[data-elite-shell] .elite-page-header-body-customer {
  gap: 0.65rem;
}

main[data-elite-shell] .elite-page-breadcrumbs {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.45rem;
  min-width: 0;
  color: var(--elite-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

main[data-elite-shell] .elite-page-breadcrumbs a {
  border-bottom: 0;
  color: var(--elite-ink-soft);
}

main[data-elite-shell] .elite-page-breadcrumbs a:hover {
  color: var(--elite-warm);
}

main[data-elite-shell] .elite-page-breadcrumbs span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-page-breadcrumbs [aria-hidden="true"] {
  color: rgba(91, 107, 127, 0.72);
}

main[data-elite-shell] .elite-page-title {
  margin: 0;
  max-width: 18ch;
  font-size: clamp(2.1rem, 4vw, 3.7rem);
  line-height: 0.95;
}

main[data-elite-shell][data-surface="customer"] .elite-page-title {
  max-width: 18ch;
  font-size: clamp(2rem, 2.2vw + 0.95rem, 3.15rem);
  letter-spacing: -0.05em;
}

main[data-elite-shell] .elite-page-subtitle {
  margin: 0;
  max-width: 72ch;
  color: var(--elite-muted);
  font-size: 1rem;
  line-height: 1.68;
}

main[data-elite-shell][data-surface="customer"] .elite-page-subtitle {
  max-width: 64ch;
  font-size: 0.98rem;
  line-height: 1.6;
}

main[data-elite-shell] .elite-page-secondary-nav {
  position: sticky;
  top: 14px;
  z-index: 8;
  border-radius: 18px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  padding: 0.8rem 0.9rem;
  box-shadow: var(--elite-shadow-sm);
}

main[data-elite-shell] .elite-page-stack {
  display: grid;
  gap: var(--elite-content-gap);
}

main[data-elite-shell] .elite-page-footer {
  color: var(--elite-muted);
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

main[data-elite-shell] .elite-customer-dashboard {
  display: grid;
  gap: var(--elite-content-gap);
}

main[data-elite-shell] .elite-customer-dashboard-hero {
  overflow: hidden;
}

main[data-elite-shell] .elite-customer-dashboard-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
  gap: 1.25rem;
  align-items: stretch;
}

main[data-elite-shell] .elite-customer-dashboard-hero-copy,
main[data-elite-shell] .elite-customer-dashboard-stack,
main[data-elite-shell] .elite-customer-dashboard-notices {
  display: grid;
  gap: 1rem;
}

main[data-elite-shell] .elite-customer-dashboard-pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

main[data-elite-shell] .elite-customer-dashboard-hero-subtitle {
  margin: 0;
  max-width: 58ch;
  color: var(--elite-ink-soft);
  font-size: 1.02rem;
  line-height: 1.76;
}

main[data-elite-shell] .elite-customer-dashboard-operator {
  display: grid;
  gap: 0.25rem;
  padding: 1rem 1.1rem;
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(246, 250, 248, 0.88) 100%);
}

main[data-elite-shell] .elite-customer-dashboard-operator-label,
main[data-elite-shell] .elite-customer-dashboard-signal-label,
main[data-elite-shell] .elite-customer-dashboard-mini-card span {
  color: var(--elite-muted);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-customer-dashboard-operator strong,
main[data-elite-shell] .elite-customer-dashboard-fleet-top strong,
main[data-elite-shell] .elite-customer-dashboard-activity-top strong {
  font-size: 1.1rem;
  line-height: 1.2;
}

main[data-elite-shell] .elite-customer-dashboard-operator span:last-child,
main[data-elite-shell] .elite-customer-dashboard-action-copy span,
main[data-elite-shell] .elite-customer-dashboard-signal-hint,
main[data-elite-shell] .elite-customer-dashboard-fleet-top span,
main[data-elite-shell] .elite-customer-dashboard-activity-top span,
main[data-elite-shell] .elite-customer-dashboard-fleet-meta,
main[data-elite-shell] .elite-customer-dashboard-activity-meta {
  color: var(--elite-muted);
}

main[data-elite-shell] .elite-customer-dashboard-action-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
}

main[data-elite-shell] .elite-customer-dashboard-action {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.8rem;
  align-items: flex-start;
  min-height: 100%;
  padding: 1rem 1.05rem;
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  color: var(--elite-ink);
  text-align: left;
  text-decoration: none;
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background 140ms ease;
}

main[data-elite-shell] .elite-customer-dashboard-action[data-tone="primary"] {
  border-color: rgba(11, 106, 84, 0.18);
  background: linear-gradient(135deg, rgba(11, 106, 84, 0.92) 0%, rgba(3, 70, 53, 0.96) 100%);
  color: #f6fbf9;
}

main[data-elite-shell] .elite-customer-dashboard-action:hover,
main[data-elite-shell] .elite-customer-dashboard-action:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 20px 34px rgba(15, 23, 42, 0.08);
  border-color: rgba(15, 23, 42, 0.16);
}

main[data-elite-shell] .elite-customer-dashboard-action,
main[data-elite-shell] .elite-customer-dashboard-action:hover {
  border-bottom: 0;
}

main[data-elite-shell] .elite-customer-dashboard-action-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 16px;
  background: rgba(11, 106, 84, 0.1);
  color: var(--elite-accent);
}

main[data-elite-shell] .elite-customer-dashboard-action[data-tone="primary"] .elite-customer-dashboard-action-icon {
  background: rgba(255, 255, 255, 0.16);
  color: #f6fbf9;
}

main[data-elite-shell] .elite-customer-dashboard-action-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

main[data-elite-shell] .elite-customer-dashboard-action-copy {
  display: grid;
  gap: 0.2rem;
}

main[data-elite-shell] .elite-customer-dashboard-action-copy strong {
  font-size: 1rem;
  line-height: 1.15;
}

main[data-elite-shell] .elite-customer-dashboard-action[data-tone="primary"] .elite-customer-dashboard-action-copy span {
  color: rgba(246, 251, 249, 0.82);
}

main[data-elite-shell] .elite-customer-dashboard-signal-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

main[data-elite-shell] .elite-customer-dashboard-signal {
  display: grid;
  gap: 0.3rem;
  padding: 1rem 1.05rem;
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.9);
}

main[data-elite-shell] .elite-customer-dashboard-signal[data-tone="success"] {
  background: linear-gradient(135deg, rgba(220, 252, 231, 0.9) 0%, rgba(240, 253, 244, 0.96) 100%);
}

main[data-elite-shell] .elite-customer-dashboard-signal[data-tone="warning"] {
  background: linear-gradient(135deg, rgba(255, 247, 237, 0.92) 0%, rgba(255, 251, 235, 0.96) 100%);
}

main[data-elite-shell] .elite-customer-dashboard-signal[data-tone="info"] {
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.92) 0%, rgba(239, 246, 255, 0.97) 100%);
}

main[data-elite-shell] .elite-customer-dashboard-signal-value {
  font-family: var(--elite-font-display, "Space Grotesk", "IBM Plex Sans", sans-serif);
  font-size: 2rem;
  letter-spacing: -0.05em;
  line-height: 1;
}

main[data-elite-shell] .elite-customer-dashboard-main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  gap: var(--elite-content-gap);
}

main[data-elite-shell] .elite-customer-dashboard-card {
  height: 100%;
}

main[data-elite-shell] .elite-customer-dashboard-form {
  display: grid;
  gap: 1rem;
}

main[data-elite-shell] .elite-customer-dashboard-mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

main[data-elite-shell] .elite-customer-dashboard-mini-card {
  display: grid;
  gap: 0.3rem;
  padding: 0.9rem 1rem;
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.76);
}

main[data-elite-shell] .elite-customer-dashboard-mini-card strong {
  font-size: 1rem;
  line-height: 1.15;
}

main[data-elite-shell] .elite-customer-dashboard-empty {
  padding: 1rem 1.05rem;
  border-radius: 20px;
  border: 1px dashed rgba(15, 23, 42, 0.16);
  background: rgba(255, 255, 255, 0.64);
  color: var(--elite-muted);
}

main[data-elite-shell] .elite-customer-dashboard-activity-list,
main[data-elite-shell] .elite-customer-dashboard-token-list {
  display: grid;
  gap: 0.8rem;
}

main[data-elite-shell] .elite-customer-dashboard-activity-item,
main[data-elite-shell] .elite-customer-dashboard-fleet-card {
  display: grid;
  gap: 0.85rem;
  padding: 1rem 1.05rem;
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.82);
}

main[data-elite-shell] .elite-customer-dashboard-activity-top,
main[data-elite-shell] .elite-customer-dashboard-fleet-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

main[data-elite-shell] .elite-customer-dashboard-activity-top > div,
main[data-elite-shell] .elite-customer-dashboard-fleet-top > div {
  display: grid;
  gap: 0.2rem;
  min-width: 0;
}

main[data-elite-shell] .elite-customer-dashboard-activity-meta,
main[data-elite-shell] .elite-customer-dashboard-fleet-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
  font-size: 0.92rem;
}

main[data-elite-shell] .elite-customer-dashboard-workspace-list .elite-list-item[data-active="true"] {
  border-color: rgba(11, 106, 84, 0.2);
  background: linear-gradient(135deg, rgba(11, 106, 84, 0.08) 0%, rgba(255, 255, 255, 0.94) 100%);
}

main[data-elite-shell] .elite-customer-dashboard-token-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

main[data-elite-shell] .elite-customer-dashboard-fleet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.9rem;
}

main[data-elite-shell] .elite-rail {
  display: grid;
  align-content: start;
  gap: 14px;
  padding: 16px;
  border-radius: 24px;
  border: 1px solid var(--elite-line);
  background: var(--elite-rail-bg);
  box-shadow: var(--elite-shadow-sm);
}

main[data-elite-shell][data-surface="customer"] .elite-rail {
  position: relative;
  overflow: hidden;
  gap: 12px;
  padding: 12px 10px 14px;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.96);
  border-color: rgba(15, 23, 42, 0.09);
  border-right: 1px solid rgba(15, 23, 42, 0.1);
  box-shadow: inset -1px 0 0 rgba(15, 23, 42, 0.02);
  min-height: 100%;
}

main[data-elite-shell][data-surface="customer"] .elite-rail::before {
  display: none;
}

main[data-elite-shell] .elite-rail-header {
  display: grid;
  gap: 10px;
}

main[data-elite-shell][data-surface="customer"] .elite-rail-header {
  position: relative;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--elite-line);
}

main[data-elite-shell] .elite-rail-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

main[data-elite-shell] .elite-rail-brand-mark {
  width: 2.15rem;
  height: 2.15rem;
  border-radius: 15px;
  background:
    radial-gradient(circle at 28% 28%, rgba(255, 241, 188, 0.92), rgba(255, 241, 188, 0.2) 48%, transparent 49%),
    linear-gradient(135deg, #0b6a54 0%, #034635 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 8px 18px rgba(3, 70, 53, 0.15);
}

main[data-elite-shell] .elite-rail-brand-copy {
  display: grid;
  gap: 0.12rem;
  min-width: 0;
}

main[data-elite-shell] .elite-rail-brand-name {
  color: var(--elite-ink);
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.1;
}

main[data-elite-shell][data-surface="customer"] .elite-rail-brand-name {
  font-size: 1.05rem;
}

main[data-elite-shell] .elite-rail-brand-subtitle {
  color: var(--elite-muted);
  font-size: 0.84rem;
  line-height: 1.2;
}

main[data-elite-shell] .elite-rail-section-label {
  position: relative;
  color: var(--elite-muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-rail-title {
  margin: 0;
  font-size: 1.2rem;
  line-height: 1;
}

main[data-elite-shell][data-surface="customer"] .elite-rail-title {
  font-size: 1.28rem;
  letter-spacing: -0.04em;
}

main[data-elite-shell] .elite-rail-copy {
  margin: 0;
  color: var(--elite-muted);
  font-size: 0.9rem;
  line-height: 1.55;
}

main[data-elite-shell][data-surface="customer"] .elite-rail-copy {
  max-width: 30ch;
}

main[data-elite-shell] .elite-rail-workspace {
  position: relative;
  display: grid;
  gap: 0.3rem;
  padding: 0.72rem 0.8rem;
  border-radius: 18px;
  border: 1px solid rgba(11, 106, 84, 0.09);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 252, 249, 0.72) 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

main[data-elite-shell] .elite-rail-workspace-label {
  color: var(--elite-muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-rail-workspace-name {
  color: var(--elite-ink);
  font-size: 0.98rem;
  font-weight: 800;
}

main[data-elite-shell] .elite-rail-workspace-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.8rem;
  color: var(--elite-muted);
  font-size: 0.8rem;
}

main[data-elite-shell] .elite-rail-links {
  display: grid;
  gap: 5px;
}

main[data-elite-shell] .elite-rail-section {
  display: grid;
  gap: 7px;
}

main[data-elite-shell] .elite-rail-section + .elite-rail-section {
  padding-top: 12px;
  border-top: 1px solid var(--elite-line);
}

main[data-elite-shell] .elite-rail-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 2.9rem;
  padding: 0.68rem 0.62rem 0.68rem 0.78rem;
  border-radius: 13px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--elite-ink-soft);
  font-weight: 700;
  font-size: 0.94rem;
}

main[data-elite-shell] .elite-rail-link-main {
  display: flex;
  align-items: center;
  gap: 0.62rem;
  min-width: 0;
  flex: 1 1 auto;
}

main[data-elite-shell] .elite-rail-link-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  height: 1.35rem;
  flex: 0 0 auto;
  border-radius: 0;
  border: 0;
  background: transparent;
  color: var(--elite-muted);
}

main[data-elite-shell] .elite-rail-link-icon svg,
main[data-elite-shell] .elite-rail-link-chevron svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

main[data-elite-shell] .elite-rail-link-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

main[data-elite-shell] .elite-rail-link-trailing {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex: 0 0 auto;
}

main[data-elite-shell] .elite-rail-link-chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--elite-muted);
}

main[data-elite-shell] .elite-rail-link::before {
  content: "";
  position: absolute;
  left: 0.18rem;
  top: 50%;
  width: 0.22rem;
  height: 58%;
  border-radius: 999px;
  background: transparent;
  transform: translateY(-50%);
  transition: background 140ms ease, box-shadow 140ms ease;
}

html[dir="rtl"] main[data-elite-shell] .elite-rail-link::before {
  left: auto;
  right: 0.18rem;
}

main[data-elite-shell] .elite-rail-link[data-active="true"] {
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.1) 0%, rgba(15, 118, 110, 0.05) 100%);
  border-color: rgba(15, 118, 110, 0.16);
  color: var(--elite-accent-2);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 8px 16px rgba(11, 106, 84, 0.05);
}

main[data-elite-shell][data-surface="customer"] .elite-rail-link[data-active="true"] {
  background: linear-gradient(135deg, rgba(11, 106, 84, 0.12) 0%, rgba(11, 106, 84, 0.06) 100%);
  border-color: rgba(11, 106, 84, 0.14);
}

main[data-elite-shell][data-surface="admin"] .elite-rail-link[data-active="true"] {
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.12) 0%, rgba(29, 78, 216, 0.05) 100%);
  border-color: rgba(29, 78, 216, 0.14);
}

main[data-elite-shell] .elite-rail-link:hover {
  border-color: var(--elite-line-strong);
  background: rgba(15, 23, 42, 0.03);
}

main[data-elite-shell] .elite-rail-link:hover::before,
main[data-elite-shell] .elite-rail-link[data-active="true"]::before {
  background: linear-gradient(135deg, rgba(11, 106, 84, 0.82), rgba(184, 134, 11, 0.82));
  box-shadow: 0 0 0 5px rgba(11, 106, 84, 0.08);
}

main[data-elite-shell] .elite-rail-link[data-active="true"] .elite-rail-link-icon {
  color: var(--elite-accent-2);
}

main[data-elite-shell] .elite-rail-link[data-active="true"] .elite-rail-link-chevron {
  color: var(--elite-accent-2);
}

main[data-elite-shell] .elite-rail-link[data-key="dashboard"] .elite-rail-link-icon {
  color: #0b6a54;
}

main[data-elite-shell] .elite-rail-link[data-key="messages"] .elite-rail-link-icon {
  color: #2563eb;
}

main[data-elite-shell] .elite-rail-link[data-key="api-docs"] .elite-rail-link-icon {
  color: #b45309;
}

main[data-elite-shell] .elite-rail-link[data-key="settings"] .elite-rail-link-icon {
  color: #475569;
}

main[data-elite-shell] .elite-rail-link[data-key="subscription"] .elite-rail-link-icon {
  color: #7c3aed;
}

main[data-elite-shell] .elite-rail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding-top: 0.8rem;
  border-top: 1px solid var(--elite-line);
}

main[data-elite-shell] .elite-rail-footer {
  display: grid;
  gap: 0.4rem;
  color: var(--elite-muted);
  font-size: 0.88rem;
}

html[data-elite-theme="dark"] main[data-elite-shell] {
  --elite-ink: #e5edf7;
  --elite-ink-soft: #cbd7e7;
  --elite-muted: #9dafc5;
  --elite-line: rgba(148, 163, 184, 0.18);
  --elite-line-strong: rgba(148, 163, 184, 0.28);
  --elite-paper: #0b1220;
  --elite-paper-strong: rgba(14, 22, 36, 0.94);
  --elite-card: rgba(15, 23, 42, 0.78);
  --elite-card-strong: rgba(17, 27, 44, 0.94);
  --elite-deep: #08111f;
  --elite-shadow-sm: 0 18px 30px rgba(2, 6, 23, 0.28);
  --elite-shadow-md: 0 28px 56px rgba(2, 6, 23, 0.34);
  --elite-shadow-lg: 0 36px 82px rgba(2, 6, 23, 0.42);
  color-scheme: dark;
}

html[data-elite-theme="dark"] main[data-elite-shell][data-surface="customer"] {
  --elite-shell-bg:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.28), transparent 32%),
    radial-gradient(circle at bottom right, rgba(184, 134, 11, 0.16), transparent 30%),
    linear-gradient(180deg, #07120f 0%, #0b1814 100%);
  --elite-rail-bg:
    linear-gradient(180deg, rgba(7, 18, 15, 0.98) 0%, rgba(9, 26, 21, 0.92) 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell][data-surface="admin"] {
  --elite-shell-bg:
    radial-gradient(circle at top left, rgba(29, 78, 216, 0.24), transparent 30%),
    radial-gradient(circle at top right, rgba(194, 65, 12, 0.18), transparent 24%),
    linear-gradient(180deg, #08101d 0%, #0d1523 100%);
  --elite-rail-bg:
    linear-gradient(180deg, rgba(8, 16, 29, 0.98) 0%, rgba(12, 22, 38, 0.92) 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell][data-surface="neutral"] {
  --elite-shell-bg:
    radial-gradient(circle at top left, rgba(15, 118, 110, 0.22), transparent 28%),
    radial-gradient(circle at top right, rgba(15, 23, 42, 0.14), transparent 24%),
    linear-gradient(180deg, #080f1a 0%, #0d1623 100%);
  --elite-rail-bg:
    linear-gradient(180deg, rgba(9, 16, 28, 0.98) 0%, rgba(13, 22, 35, 0.92) 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell] a {
  border-bottom-color: rgba(148, 163, 184, 0.22);
}

html[data-elite-theme="dark"] main[data-elite-shell] button[data-elite-button][data-tone="secondary"] {
  background: rgba(15, 23, 42, 0.72);
  color: var(--elite-ink);
  border-color: var(--elite-line);
}

html[data-elite-theme="dark"] main[data-elite-shell] button[data-elite-button][data-tone="ghost"] {
  background: rgba(15, 118, 110, 0.16);
  color: #8ae2d7;
}

html[data-elite-theme="dark"] main[data-elite-shell] [data-elite-control] {
  background: rgba(8, 15, 27, 0.88);
  border-color: var(--elite-line);
}

html[data-elite-theme="dark"] main[data-elite-shell] [data-elite-control][aria-invalid="true"] {
  background: rgba(69, 10, 10, 0.44);
  border-color: rgba(248, 113, 113, 0.26);
}

html[data-elite-theme="dark"] main[data-elite-shell] [data-elite-control]:focus {
  background: rgba(10, 18, 31, 0.96);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-control-toggle {
  background: rgba(148, 163, 184, 0.12);
  color: var(--elite-muted);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-control-toggle:hover {
  background: rgba(148, 163, 184, 0.18);
  color: var(--elite-ink);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-checkbox-row,
html[data-elite-theme="dark"] main[data-elite-shell] [data-elite-card],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-metric-card,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-definition-item,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-notice,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-list-item,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-empty-state,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-anchor-nav a,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-page-secondary-nav,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-highlight,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-password-strength,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-disclosure,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-help-dialog-section,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-operator,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-action:not([data-tone="primary"]),
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-signal:not([data-tone="success"]):not([data-tone="warning"]):not([data-tone="info"]),
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-mini-card,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-activity-item,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-fleet-card,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-empty,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-rail-workspace,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-shell-mobile-nav details {
  background: rgba(15, 23, 42, 0.7);
  border-color: var(--elite-line);
  box-shadow: var(--elite-shadow-sm);
}

html[data-elite-theme="dark"] main[data-elite-shell] [data-elite-card]::before,
html[data-elite-theme="dark"] main[data-elite-shell][data-surface="admin"] [data-elite-card]::before {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 35%),
    radial-gradient(circle at top right, rgba(56, 189, 248, 0.1), transparent 32%);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-metric-card[data-emphasis="strong"],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-definition-item[data-emphasis="strong"],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-notice[data-emphasis="strong"] {
  background: rgba(17, 27, 44, 0.92);
  border-color: var(--elite-line-strong);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-shell-topbar {
  background: rgba(8, 14, 25, 0.9);
  border-color: var(--elite-line);
  box-shadow: none;
  backdrop-filter: blur(16px);
}

html[data-elite-theme="dark"] main[data-elite-shell][data-surface="customer"] .elite-shell-topbar::after {
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.14), rgba(148, 163, 184, 0.06), rgba(148, 163, 184, 0.14));
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-shell-topbar-brand {
  border-right-color: var(--elite-line);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-summary-chip {
  background: rgba(15, 118, 110, 0.18);
  color: #8ce0d5;
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-user,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-theme-menu-panel,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-panel,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-help-icon-button,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-help-dialog,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-page-header,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-panel,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-hero,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-login-brand-stage {
  background: rgba(9, 16, 28, 0.96);
  border-color: var(--elite-line);
}

html[data-elite-theme="dark"] .elite-help-dialog {
  background: rgba(9, 16, 28, 0.96);
  border-color: var(--elite-line);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu[open] .elite-customer-topbar-user {
  box-shadow: var(--elite-shadow-sm);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-panel::before {
  border-top-color: var(--elite-line);
  border-left-color: var(--elite-line);
  background: rgba(9, 16, 28, 0.96);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-theme-menu-trigger:hover {
  background: rgba(148, 163, 184, 0.1);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-theme-menu-item,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-item,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-logout {
  background: rgba(15, 23, 42, 0.7);
  border-color: var(--elite-line);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-theme-menu-item:hover,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-item:hover,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-logout:hover {
  background: rgba(20, 30, 48, 0.92);
  border-color: var(--elite-line-strong);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-theme-menu-item[data-active="true"],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-item[data-active="true"],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-workspace-list .elite-list-item[data-active="true"] {
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.22) 0%, rgba(15, 23, 42, 0.9) 100%);
  border-color: rgba(15, 118, 110, 0.28);
}

html[data-elite-theme="dark"] main[data-elite-shell][data-surface="admin"] .elite-theme-menu-item[data-active="true"] {
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.22) 0%, rgba(15, 23, 42, 0.9) 100%);
  border-color: rgba(96, 165, 250, 0.28);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-item-state {
  background: rgba(15, 23, 42, 0.56);
  border-color: rgba(15, 118, 110, 0.22);
  color: #9be7dc;
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-item[data-active="true"] .elite-customer-topbar-menu-item-state {
  background: rgba(8, 15, 27, 0.92);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-page-brand,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-mono-panel {
  background: rgba(2, 6, 23, 0.9);
}

html[data-elite-theme="dark"] main[data-elite-shell] code {
  background: rgba(148, 163, 184, 0.12);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] {
  background:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.22), transparent 24%),
    radial-gradient(circle at bottom right, rgba(29, 78, 216, 0.12), transparent 26%),
    linear-gradient(180deg, #06100c 0%, #08141f 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"] {
  background:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.22), transparent 26%),
    radial-gradient(circle at bottom right, rgba(184, 134, 11, 0.12), transparent 24%),
    linear-gradient(180deg, #06100c 0%, #0a1512 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"]::before {
  background:
    radial-gradient(circle at 12% 10%, rgba(255, 255, 255, 0.08), transparent 18%),
    radial-gradient(circle at 90% 84%, rgba(184, 134, 11, 0.08), transparent 18%),
    radial-gradient(circle at 10% 86%, rgba(11, 106, 84, 0.1), transparent 22%);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel {
  box-shadow: var(--elite-shadow-lg);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"] .elite-auth-hero[data-media-only="true"] {
  background: linear-gradient(180deg, rgba(8, 16, 28, 0.98) 0%, rgba(12, 22, 38, 0.94) 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-hero[data-media-only="true"],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-login-brand-stage {
  background:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.18), transparent 30%),
    radial-gradient(circle at bottom right, rgba(184, 134, 11, 0.12), transparent 24%),
    linear-gradient(180deg, rgba(6, 14, 24, 0.98) 0%, rgba(10, 19, 33, 0.94) 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-login-brand-stage::before {
  display: none;
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel {
  background:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.12), transparent 28%),
    linear-gradient(180deg, rgba(5, 11, 20, 0.98) 0%, rgba(8, 16, 28, 0.96) 100%);
  border: 1px solid rgba(125, 142, 173, 0.22);
  box-shadow: 0 28px 72px rgba(0, 0, 0, 0.34);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] button[data-elite-button][data-tone="secondary"],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] [data-elite-control],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-segmented {
  background: rgba(15, 23, 42, 0.76);
  border-color: var(--elite-line);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-kicker {
  background: rgba(15, 118, 110, 0.16);
  color: #a5f3e6;
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel .elite-auth-kicker {
  background: rgba(15, 118, 110, 0.14);
  color: #8ee3d7;
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-subtitle,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-login-brand-stage::before {
  color: var(--elite-muted);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-rail,
html[data-elite-theme="dark"] main[data-elite-shell][data-surface="customer"] .elite-rail {
  background: rgba(8, 14, 25, 0.94);
  border-color: var(--elite-line);
  box-shadow: inset -1px 0 0 rgba(148, 163, 184, 0.08);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-rail-link:hover {
  background: rgba(148, 163, 184, 0.08);
  border-color: var(--elite-line-strong);
}

html[data-elite-theme="dark"] main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link::after {
  background: rgba(2, 6, 23, 0.94);
}

@keyframes eliteFadeUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 1024px) {
  main[data-elite-shell] .elite-shell-frame[data-has-nav="true"] {
    grid-template-columns: minmax(248px, 292px) minmax(0, 1fr);
    align-items: start;
  }

  main[data-elite-shell] .elite-shell-frame[data-has-nav="true"][data-nav-collapsed="true"] {
    grid-template-columns: 86px minmax(0, 1fr);
  }

  main[data-elite-shell] .elite-auth-layout {
    grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: stretch;
  }

  main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login {
    grid-template-columns: minmax(0, 1.08fr) minmax(420px, 0.92fr);
  }

  main[data-elite-shell] .elite-shell-aside {
    display: flex;
    position: sticky;
    top: var(--elite-shell-topbar-height);
    height: calc(100dvh - var(--elite-shell-topbar-height));
    align-self: start;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-shell-aside {
    display: flex;
  }

  main[data-elite-shell] .elite-shell-aside > * {
    width: 100%;
    min-height: 100%;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail {
    justify-items: center;
    gap: 10px;
    padding: 12px 8px 14px;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-header,
  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-meta,
  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-section-label,
  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-workspace {
    display: none;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-section,
  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-links {
    width: 100%;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-section + .elite-rail-section {
    padding-top: 0;
    border-top: 0;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link {
    justify-content: center;
    width: 100%;
    min-height: 3.15rem;
    padding: 0.7rem 0;
    border-radius: 16px;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link-main {
    justify-content: center;
    width: 100%;
    gap: 0;
    flex: 0 0 auto;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link-label,
  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link-trailing {
    display: none;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link::before {
    left: 50%;
    top: auto;
    bottom: 0.3rem;
    width: 58%;
    height: 0.2rem;
    transform: translateX(-50%);
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link::after {
    content: attr(data-tooltip);
    position: absolute;
    left: calc(100% + 0.7rem);
    top: 50%;
    z-index: 18;
    padding: 0.5rem 0.7rem;
    border-radius: 12px;
    background: rgba(15, 23, 42, 0.96);
    color: #f8fbfc;
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    white-space: nowrap;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
    opacity: 0;
    pointer-events: none;
    transform: translateY(-50%) translateX(-4px);
    transition: opacity 120ms ease, transform 120ms ease;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link:hover::after,
  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link:focus-visible::after {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

  main[data-elite-shell] .elite-shell-mobile-nav {
    display: none;
  }
}

@media (max-width: 1080px) {
  main[data-elite-shell] .elite-customer-dashboard-hero-grid,
  main[data-elite-shell] .elite-customer-dashboard-main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  main[data-elite-shell] .elite-shell-topbar {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.65rem 0.75rem;
  }

  main[data-elite-shell] .elite-shell-topbar-center,
  main[data-elite-shell] .elite-shell-topbar-actions {
    justify-content: flex-start;
  }

  main[data-elite-shell] .elite-page-brand {
    font-size: 0.7rem;
  }

  main[data-elite-shell] .elite-page-header,
  main[data-elite-shell] .elite-shell-mobile-nav details {
    border-radius: 22px;
  }

  main[data-elite-shell][data-surface="customer"] .elite-page-header {
    top: 12px;
    padding: 16px;
  }

  main[data-elite-shell] .elite-page-title {
    max-width: none;
  }

  main[data-elite-shell][data-surface="customer"] .elite-page-title {
    font-size: clamp(1.9rem, 8vw, 2.7rem);
  }

  main[data-elite-shell][data-surface="customer"] .elite-toolbar {
    justify-content: stretch;
  }

  main[data-elite-shell] .elite-customer-topbar-controls {
    width: 100%;
    align-items: stretch;
  }

  main[data-elite-shell] .elite-customer-topbar-menu {
    width: 100%;
  }

  main[data-elite-shell] .elite-customer-topbar-user {
    width: 100%;
    justify-content: space-between;
  }

  main[data-elite-shell] .elite-customer-topbar-menu-panel {
    left: 0;
    right: 0;
    width: 100%;
  }

  main[data-elite-shell] .elite-customer-topbar-menu-logout {
    width: 100%;
  }

  main[data-elite-shell] .elite-page-header-row {
    flex-direction: column;
    align-items: flex-start;
  }

  main[data-elite-shell] .elite-page-breadcrumbs {
    justify-content: flex-start;
    white-space: normal;
  }

  main[data-elite-shell] .elite-auth-hero-title {
    max-width: none;
  }

  main[data-elite-shell] .elite-auth-segmented {
    width: 100%;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel {
    justify-self: stretch;
    width: 100%;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] {
    min-height: 100vh;
    padding: 1.15rem;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero {
    padding: 0.65rem 0.35rem 0.1rem;
    gap: 1rem;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero-title {
    font-size: clamp(2.4rem, 10vw, 3.3rem);
  }

  main[data-elite-shell] .elite-customer-dashboard-action-row,
  main[data-elite-shell] .elite-customer-dashboard-signal-grid {
    grid-template-columns: 1fr;
  }

  main[data-elite-shell] .elite-customer-dashboard-activity-top,
  main[data-elite-shell] .elite-customer-dashboard-fleet-top {
    flex-direction: column;
    align-items: flex-start;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel {
    padding: 1.15rem;
    border-radius: 22px;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero::after {
    top: 56px;
    left: 26px;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero-media {
    display: none;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero[data-media-only="true"] {
    display: none;
  }
}
`;function e({label:a,variant:c="topbar",markSrc:d,markAlt:f="",launcherControlsId:g,launcherButtonLabel:h,launcherExpandLabel:i,onLauncherClick:j}){let k="topbar"===c,l=(0,b.jsxs)("svg",{viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[(0,b.jsx)("rect",{x:"4",y:"4",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"9.75",y:"4",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"15.5",y:"4",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"4",y:"9.75",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"9.75",y:"9.75",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"15.5",y:"9.75",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"4",y:"15.5",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"9.75",y:"15.5",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"15.5",y:"15.5",width:"4.5",height:"4.5",rx:"1.1"})]}),m=k?j?(0,b.jsx)("button",{type:"button",className:"elite-shell-topbar-brand-launcher","data-unstyled-button":!0,"data-state":"expanded","data-collapse-label":h,"data-expand-label":i,"aria-label":h,"aria-controls":g,"aria-expanded":"true",onClick:j,children:l}):(0,b.jsx)("span",{className:"elite-shell-topbar-brand-launcher","aria-hidden":"true",children:l}):null;return(0,b.jsxs)("div",{className:k?"elite-shell-topbar-brand":"elite-rail-brand","data-variant":c,children:[(0,b.jsx)("span",{className:k?"elite-shell-topbar-brand-mark":"elite-rail-brand-mark","aria-hidden":"true","data-has-image":d?"true":"false",children:d?(0,b.jsx)("img",{className:"elite-shell-topbar-brand-mark-image",src:d,alt:f}):null}),(0,b.jsxs)("div",{className:k?"elite-shell-topbar-brand-copy":"elite-rail-brand-copy",children:[(0,b.jsx)("span",{className:k?"elite-shell-topbar-brand-name":"elite-rail-brand-name",children:"Elite Message"}),(0,b.jsx)("span",{className:k?"elite-shell-topbar-brand-subtitle":"elite-rail-brand-subtitle",children:a})]}),m]})}a.s(["AppShell",0,function({title:a,subtitle:f,breadcrumbLabel:g,children:h,footer:i,meta:j,nav:k,headerActions:l,secondaryNav:m,surface:n="neutral",density:o="comfortable",contentWidth:p="wide",headerMode:q="default",topbarBrandMarkAlt:r,labels:s}){let t=k?`elite-shell-nav-${n}`:void 0,u="full"===p?void 0:c[p],v=("customer"===n||"admin"===n)&&!!k&&"hidden"!==q,w=g??a,x=!!f.trim(),y=!!k&&("customer"===n||"admin"===n),z=s?.surfaceLabel??function(a){switch(a){case"customer":return"Customer Surface";case"admin":return"Admin Console";default:return"Elite Message"}}(n),A=s?.breadcrumbAriaLabel??"Breadcrumb",B=s?.breadcrumbHomeLabel??"Dashboard",C=s?.customerTopbarLabel??`${z} topbar`,D=s?.mobileNavigationLabel??"Navigation",E=s?.mobileNavigationOpenLabel??"Open",F=s?.collapseSidebarLabel??"Collapse sidebar menu",G=s?.expandSidebarLabel??"Expand sidebar menu",H=s?.brandMarkAlt??r??"Elite Message logo";return(0,b.jsxs)("main",{"data-elite-shell":!0,"data-surface":n,"data-density":o,"data-header-mode":q,style:{minHeight:"100vh",background:"var(--elite-shell-bg)",padding:"hidden"===q||v?0:"clamp(18px, 2vw, 26px)",color:"var(--elite-ink)"},children:[(0,b.jsx)("style",{children:d}),(0,b.jsxs)("div",{className:"elite-shell-frame","data-has-nav":k?"true":"false",children:[v?(0,b.jsxs)("div",{className:"elite-shell-topbar","aria-label":C,children:[(0,b.jsx)(e,{label:z,variant:"topbar",markSrc:"customer"===n?"/images/EliteMessage_Icon_Only.png":void 0,markAlt:H,launcherControlsId:t,launcherButtonLabel:F,launcherExpandLabel:G,onLauncherClick:y?a=>{let b=a.currentTarget.closest("[data-elite-shell]");if(!b)return;let c="true"===b.getAttribute("data-nav-collapsed");!function(a,b,c){b?a.setAttribute("data-nav-collapsed","true"):a.removeAttribute("data-nav-collapsed");let d=a.querySelector(".elite-shell-frame");d&&(b?d.setAttribute("data-nav-collapsed","true"):d.removeAttribute("data-nav-collapsed"));let e=c?a.querySelector(`#${c}`):a.querySelector(".elite-shell-aside");e&&(e.hidden=!1,e.removeAttribute("aria-hidden"));let f=a.querySelector(".elite-shell-mobile-nav");f&&(f.hidden=b);let g=a.querySelector(".elite-shell-topbar-brand-launcher");if(g){let a=g.dataset.collapseLabel??"Collapse sidebar menu",c=g.dataset.expandLabel??"Expand sidebar menu";g.dataset.state=b?"collapsed":"expanded",g.setAttribute("aria-expanded",b?"false":"true"),g.setAttribute("aria-label",b?c:a)}}(b,!c,t)}:void 0}),(0,b.jsx)("div",{className:"elite-shell-topbar-center",children:j}),(0,b.jsx)("div",{className:"elite-shell-topbar-actions",children:l})]}):null,k?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"elite-shell-mobile-nav",children:(0,b.jsxs)("details",{children:[(0,b.jsxs)("summary",{children:[(0,b.jsx)("span",{children:D}),(0,b.jsx)("span",{"aria-hidden":"true",children:E})]}),(0,b.jsx)("div",{className:"elite-shell-mobile-nav-body",children:k})]})}),(0,b.jsx)("aside",{id:t,className:"elite-shell-aside",children:k})]}):null,(0,b.jsx)("div",{className:"elite-shell-main",children:(0,b.jsxs)("div",{className:"elite-shell-content",style:{maxWidth:u,margin:k?void 0:"0 auto"},children:["hidden"===q?null:(0,b.jsxs)("header",{className:`elite-page-header${"customer"===n?" elite-page-header-customer":""}`,children:[v?null:(0,b.jsxs)("div",{className:"elite-page-header-top",children:[(0,b.jsxs)("span",{className:"elite-page-brand",children:[(0,b.jsx)("span",{className:"elite-page-brand-mark","aria-hidden":"true"}),z]}),(0,b.jsxs)("div",{className:"elite-toolbar",children:[j,l]})]}),"customer"===n?(0,b.jsxs)("div",{className:"elite-page-header-body elite-page-header-body-customer",children:[(0,b.jsxs)("div",{className:"elite-page-header-row",children:[(0,b.jsx)("h1",{className:"elite-page-title",children:a}),(0,b.jsxs)("nav",{className:"elite-page-breadcrumbs","aria-label":A,children:[(0,b.jsx)("a",{href:"/",children:B}),(0,b.jsx)("span",{"aria-hidden":"true",children:"/"}),(0,b.jsx)("span",{children:w})]})]}),x?(0,b.jsx)("p",{className:"elite-page-subtitle",children:f}):null]}):(0,b.jsxs)("div",{className:"elite-page-header-body",children:[(0,b.jsx)("h1",{className:"elite-page-title",children:a}),x?(0,b.jsx)("p",{className:"elite-page-subtitle",children:f}):null]})]}),m?(0,b.jsx)("div",{className:"elite-page-secondary-nav",children:m}):null,(0,b.jsx)("div",{className:"elite-page-stack",children:h}),i?(0,b.jsx)("footer",{className:"elite-page-footer",children:i}):null]})})]})]})}],76989),a.i(73127);a.s(["ActionButton",0,function({tone:a="primary",size:c="default",stretch:d=!1,children:e,...f}){return(0,b.jsx)("button",{...f,"data-elite-button":!0,"data-tone":a,"data-size":c,"data-stretch":d?"true":"false",children:e})},"AnchorNav",0,function({items:a}){return(0,b.jsx)("nav",{className:"elite-anchor-nav","aria-label":"Section navigation",children:a.map(a=>(0,b.jsx)("a",{href:a.href,children:a.label},a.href))})},"CheckboxField",0,function({label:a,hint:c,...d}){return(0,b.jsxs)("label",{className:"elite-checkbox-row",children:[(0,b.jsx)("input",{...d,type:"checkbox"}),(0,b.jsxs)("span",{children:[(0,b.jsx)("span",{className:"elite-checkbox-label",children:a}),c?(0,b.jsx)("span",{className:"elite-field-hint",children:c}):null]})]})},"DefinitionGrid",0,function({items:a,minItemWidth:c=170,emphasis:d="soft"}){return(0,b.jsx)("div",{className:"elite-definition-grid",style:{"--elite-grid-min":`${c}px`},children:a.map(a=>(0,b.jsxs)("div",{className:"elite-definition-item","data-tone":a.tone??"neutral","data-emphasis":d,children:[(0,b.jsx)("div",{className:"elite-definition-label",children:a.label}),(0,b.jsx)("div",{className:"elite-definition-value",children:a.value})]},`${a.label}-${String(a.value)}`))})},"Field",0,function({label:a,hint:c,tone:d="neutral",children:e}){return(0,b.jsxs)("label",{className:"elite-field","data-tone":d,children:[(0,b.jsx)("span",{className:"elite-field-label",children:a}),e,c?(0,b.jsx)("span",{className:"elite-field-hint",children:c}):null]})},"MetricCard",0,function({label:a,value:c,hint:d,tone:e="neutral",emphasis:f="soft"}){return(0,b.jsxs)("div",{className:"elite-metric-card","data-tone":e,"data-emphasis":f,children:[(0,b.jsx)("div",{className:"elite-metric-label",children:a}),(0,b.jsx)("div",{className:"elite-metric-value",children:c}),d?(0,b.jsx)("div",{className:"elite-metric-hint",children:d}):null]})},"MetricGrid",0,function({children:a,minItemWidth:c=170}){return(0,b.jsx)("div",{className:"elite-metric-grid",style:{"--elite-grid-min":`${c}px`},children:a})},"NoticeBanner",0,function({title:a,tone:c="info",emphasis:d="soft",surface:e,children:f}){return(0,b.jsxs)("div",{className:"elite-notice","data-tone":c,"data-emphasis":d,"data-surface":e,children:[(0,b.jsx)("div",{className:"elite-notice-title",children:a}),(0,b.jsx)("div",{children:f})]})},"SectionGrid",0,function({children:a,minItemWidth:c=280}){return(0,b.jsx)("div",{className:"elite-section-grid",style:{"--elite-grid-min":`${c}px`},children:a})},"SelectInput",0,function(a){return(0,b.jsx)("select",{...a,"data-elite-control":!0})},"StatusBadge",0,function({children:a,tone:c="neutral"}){return(0,b.jsx)("span",{className:"elite-status-badge","data-tone":c,children:a})},"TextAreaInput",0,function(a){return(0,b.jsx)("textarea",{...a,"data-elite-control":!0})},"TextInput",0,function(a){return(0,b.jsx)("input",{...a,"data-elite-control":!0})}],34910),a.s(["InfoCard",0,function({eyebrow:a,title:c,subtitle:d,action:e,children:f,className:g,tone:h="neutral",density:i="comfortable",surface:j,id:k,...l}){return(0,b.jsxs)("section",{...l,id:k,"data-elite-card":!0,"data-tone":h,"data-density":i,"data-surface":j,className:g,style:l.style,children:[(0,b.jsxs)("div",{className:"elite-card-header",children:[(0,b.jsxs)("div",{className:"elite-card-copy",children:[a?(0,b.jsx)("p",{className:"elite-card-eyebrow",children:a}):null,(0,b.jsx)("h2",{className:"elite-card-title",children:c}),d?(0,b.jsx)("p",{className:"elite-card-subtitle",children:d}):null]}),e?(0,b.jsx)("div",{className:"elite-card-action",children:e}):null]}),(0,b.jsx)("div",{className:"elite-card-body",children:f})]})}],10246),a.i(5221),a.i(10674),a.s([],56120);var f=a.i(26670);let g=process.env.NEXT_PUBLIC_API_BASE_URL??"http://localhost:3002";function h(a){}function i(a){window.location.assign(`${g}/api/v1/auth/google/authorize?mode=${encodeURIComponent(a)}`)}function j(a,b="en"){let c=a.trim();return c?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)?null:"ar"===b?"استخدم عنوان بريد إلكتروني صالحًا مثل name@company.com.":"Use a valid email address like name@company.com.":"ar"===b?"أدخل عنوان البريد الإلكتروني لهذا الحساب.":"Enter the email address for this account."}function k(a,b="en"){let c=a.trim();return c?c.length<2?"ar"===b?"يجب أن يتكون الاسم الظاهر من حرفين على الأقل.":"Display name must be at least 2 characters.":null:"ar"===b?"أدخل الاسم الذي يجب أن يظهر في مساحة العمل.":"Enter the name that should appear across the workspace."}function l(a,b="en"){let c=a.trim();return c&&c.length<2?"ar"===b?"يجب أن يتكون اسم مساحة العمل من حرفين على الأقل عند إدخاله.":"Workspace name must be at least 2 characters when provided.":null}function m(a,b="en"){return a?null:"ar"===b?"أدخل كلمة المرور.":"Enter your password."}function n(a,b="en"){return!a||a.length<8?"ar"===b?"يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.":"Password must be at least 8 characters.":null}function o(a){window.location.assign(a)}a.s(["apiBaseUrl",0,g,"clearStoredToken",0,function(){},"readStoredToken",0,function(){return null},"writeStoredToken",0,h],97263),a.s(["beginGoogleAuthorization",0,i,"parseGoogleAuthCallbackHash",0,function(a){let b=new URLSearchParams(a.startsWith("#")?a.slice(1):a),c="signup"===b.get("mode")?"signup":"login",d=b.get("access_token");return d?{kind:"success",mode:c,accessToken:d}:{kind:"error",mode:c,errorCode:b.get("error_code")??"google_callback_invalid",errorMessage:b.get("error_message")??"Google authentication could not be completed."}}],19827),a.s(["redirectToCustomerRoute",0,o,"useCustomerAuthForm",0,function({locale:a,initialMode:b="login",redirectTo:c="/dashboard"}){let d="ar"===a?{alreadyHaveAccess:"لديك حساب بالفعل؟",continueWithGoogle:"تابع باستخدام Google",createAccount:"إنشاء الحساب",creatingAccount:"جارٍ إنشاء الحساب...",displayName:"الاسم الظاهر",displayNameHint:"يظهر هذا الاسم في لوحة التحكم وشاشات الدعم.",emailAddress:"البريد الإلكتروني",existingAccount:"يوجد حساب بهذا البريد الإلكتروني بالفعل.",fixHighlightedFields:"أصلح الحقول المميزة ثم حاول مرة أخرى.",needNewWorkspace:"ليس لديك حساب؟",password:"كلمة المرور",passwordHint:"استخدم 8 أحرف على الأقل. كلما زاد الطول وتنوعت الأحرف كانت أقوى.",passwordHide:"إخفاء",passwordHideAria:"إخفاء كلمة المرور",passwordShow:"إظهار",passwordShowAria:"إظهار كلمة المرور",setCustomWorkspaceName:"تعيين اسم مخصص لمساحة العمل (اختياري)",signin:"تسجيل الدخول",signinFailed:"فشل تسجيل الدخول",signinGoogle:"تسجيل الدخول عبر Google",signinSubmitting:"جارٍ تسجيل الدخول...",signinSuccess:a=>`تم تسجيل الدخول باسم ${a}.`,signup:"إنشاء حساب",signupFailed:"فشل التسجيل",signupSuccess:a=>`تم إنشاء الحساب للمستخدم ${a}.`,signInAction:"تسجيل الدخول",signInInstead:"سجّل الدخول بدلًا من ذلك",workspaceHint:"اترك هذا الحقل فارغًا لإنشاء اسم مساحة العمل من الاسم الظاهر.",workspaceName:"اسم مساحة العمل"}:{alreadyHaveAccess:"Already have access?",continueWithGoogle:"Continue with Google",createAccount:"Create account",creatingAccount:"Creating account...",displayName:"Display name",displayNameHint:"This name appears in the dashboard and support views.",emailAddress:"Email address",existingAccount:"An account with this email already exists.",fixHighlightedFields:"Fix the highlighted fields and try again.",needNewWorkspace:"Need a new workspace?",password:"Password",passwordHint:"Use at least 8 characters. Longer passwords with mixed characters are stronger.",passwordHide:"Hide",passwordHideAria:"Hide password",passwordShow:"Show",passwordShowAria:"Show password",setCustomWorkspaceName:"Set a custom workspace name (optional)",signin:"Sign in",signinFailed:"Signin failed",signinGoogle:"Sign in with Google",signinSubmitting:"Signing in...",signinSuccess:a=>`Signed in as ${a}.`,signup:"Sign up",signupFailed:"Signup failed",signupSuccess:a=>`Created account for ${a}.`,signInAction:"Sign in",signInInstead:"Sign in instead",workspaceHint:"Leave this empty to generate the workspace name from your display name.",workspaceName:"Workspace name"},[e,p]=(0,f.useState)(b),[q,r]=(0,f.useState)(""),[s,t]=(0,f.useState)(""),[u,v]=(0,f.useState)(""),[w,x]=(0,f.useState)(""),[y,z]=(0,f.useState)(!1),[A,B]=(0,f.useState)(!1),[C,D]=(0,f.useState)(null),[E,F]=(0,f.useState)(null),[G,H]=(0,f.useState)({email:!1,password:!1,displayName:!1,workspaceName:!1}),I=G.email||q.length>0?j(q,a):null,J=G.password||s.length>0?m(s,a):null,K=G.email||q.length>0?j(q,a):null,L=G.password||s.length>0?n(s,a):null,M=G.displayName||u.length>0?k(u,a):null,N=G.workspaceName||w.length>0?l(w,a):null,O=function(a,b="en"){if(!a)return"ar"===b?{score:0,label:"قوة كلمة المرور",help:"استخدم 8 أحرف على الأقل. ويكون المزيج من الحروف والأرقام والرموز أقوى."}:{score:0,label:"Password strength",help:"Use at least 8 characters. A mix of letters, numbers, and symbols is stronger."};let c=[/[a-z]/.test(a),/[A-Z]/.test(a),/\d/.test(a),/[^A-Za-z0-9]/.test(a)].filter(Boolean).length;return a.length<8||c<=1?"ar"===b?{score:1,label:"ضعيفة",help:"أضف طولاً أكبر ومزيجًا من أنواع الأحرف قبل استخدام كلمة المرور هذه."}:{score:1,label:"Weak",help:"Add length and a mix of character types before using this password."}:a.length>=12&&c>=3?"ar"===b?{score:3,label:"قوية",help:"تغطية جيدة. هذه مناسبة لحساب مالك طويل الأمد."}:{score:3,label:"Strong",help:"Good coverage. This is appropriate for a long-lived owner account."}:"ar"===b?{score:2,label:"جيدة",help:"أضف طولًا أكبر أو نوعًا إضافيًا من الأحرف للحصول على كلمة مرور أقوى."}:{score:2,label:"Good",help:"Add either more length or one more character type for a stronger password."}}(s,a);function P(){H({email:!1,password:!1,displayName:!1,workspaceName:!1})}async function Q(b){if(b.preventDefault(),D(null),F(null),H(a=>({...a,email:!0,password:!0})),j(q,a)||m(s,a))return void D(d.fixHighlightedFields);B(!0);try{let a=await fetch(`${g}/api/v1/auth/login`,{method:"POST",headers:{"content-type":"application/json"},credentials:"include",body:JSON.stringify({email:q,password:s})});if(!a.ok){let b=await a.json().catch(()=>null);D(function(a){if(!a||"object"!=typeof a)return null;let b=a.message;return Array.isArray(b)?b[0]??null:"string"==typeof b?b:null}(b)??d.signinFailed);return}let b=await a.json();h(b.accessToken),F(d.signinSuccess(b.user.displayName)),o(c)}finally{B(!1)}}async function R(b){if(b.preventDefault(),D(null),F(null),H({email:!0,password:!0,displayName:!0,workspaceName:!0}),k(u,a)||l(w,a)||j(q,a)||n(s,a))return void D(d.fixHighlightedFields);B(!0);try{let a=await fetch(`${g}/api/v1/auth/signup`,{method:"POST",headers:{"content-type":"application/json"},credentials:"include",body:JSON.stringify({email:q,password:s,displayName:u,workspaceName:w.trim()||void 0})});if(!a.ok)return void D(409===a.status?d.existingAccount:d.signupFailed);let b=await a.json();h(b.accessToken),F(d.signupSuccess(b.user.displayName)),P(),o(c)}finally{B(!1)}}return{mode:e,setMode:function(a){p(a),D(null),F(null),z(!1)},copy:d,email:q,setEmail:r,password:s,setPassword:t,displayName:u,setDisplayName:v,workspaceName:w,setWorkspaceName:x,passwordVisible:y,setPasswordVisible:z,touched:G,markTouched:function(a){H(b=>b[a]?b:{...b,[a]:!0})},resetTouched:P,loginEmailError:I,loginPasswordError:J,signupEmailError:K,signupPasswordError:L,signupDisplayNameError:M,signupWorkspaceNameError:N,signupPasswordStrength:O,submitting:A,errorMessage:C,statusMessage:E,submitLogin:Q,submitSignup:R,continueWithGoogle:function(a){D(null),F(null),i(a)}}}],5790)}];

//# sourceMappingURL=_0y2f9tq._.js.map