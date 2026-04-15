(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,95379,(e,a,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useMergedRef",{enumerable:!0,get:function(){return i}});let l=e.r(11501);function i(e,a){let t=(0,l.useRef)(null),i=(0,l.useRef)(null);return(0,l.useCallback)(l=>{if(null===l){let e=t.current;e&&(t.current=null,e());let a=i.current;a&&(i.current=null,a())}else e&&(t.current=r(e,l)),a&&(i.current=r(a,l))},[e,a])}function r(e,a){if("function"!=typeof e)return e.current=a,()=>{e.current=null};{let t=e(a);return"function"==typeof t?t:()=>e(null)}}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),a.exports=t.default)},87428,(e,a,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l={formatUrl:function(){return o},formatWithValidation:function(){return s},urlObjectKeys:function(){return d}};for(var i in l)Object.defineProperty(t,i,{enumerable:!0,get:l[i]});let r=e.r(44066)._(e.r(12892)),n=/https?|ftp|gopher|file/;function o(e){let{auth:a,hostname:t}=e,l=e.protocol||"",i=e.pathname||"",o=e.hash||"",d=e.query||"",s=!1;a=a?encodeURIComponent(a).replace(/%3A/i,":")+"@":"",e.host?s=a+e.host:t&&(s=a+(~t.indexOf(":")?`[${t}]`:t),e.port&&(s+=":"+e.port)),d&&"object"==typeof d&&(d=String(r.urlQueryToSearchParams(d)));let m=e.search||d&&`?${d}`||"";return l&&!l.endsWith(":")&&(l+=":"),e.slashes||(!l||n.test(l))&&!1!==s?(s="//"+(s||""),i&&"/"!==i[0]&&(i="/"+i)):s||(s=""),o&&"#"!==o[0]&&(o="#"+o),m&&"?"!==m[0]&&(m="?"+m),i=i.replace(/[?#]/g,encodeURIComponent),m=m.replace("#","%23"),`${l}${s}${i}${m}${o}`}let d=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function s(e){return o(e)}},43135,(e,a,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"isLocalURL",{enumerable:!0,get:function(){return r}});let l=e.r(87683),i=e.r(13708);function r(e){if(!(0,l.isAbsoluteUrl)(e))return!0;try{let a=(0,l.getLocationOrigin)(),t=new URL(e,a);return t.origin===a&&(0,i.hasBasePath)(t.pathname)}catch(e){return!1}}},82094,(e,a,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"errorOnce",{enumerable:!0,get:function(){return l}});let l=e=>{}},87383,(e,a,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l={default:function(){return f},useLinkStatus:function(){return v}};for(var i in l)Object.defineProperty(t,i,{enumerable:!0,get:l[i]});let r=e.r(44066),n=e.r(52759),o=r._(e.r(11501)),d=e.r(87428),s=e.r(71855),m=e.r(95379),h=e.r(87683),c=e.r(52992);e.r(75780);let u=e.r(36194),p=e.r(60967),g=e.r(43135),b=e.r(80538);function f(a){var t,l;let i,r,f,[v,y]=(0,o.useOptimistic)(p.IDLE_LINK_STATUS),w=(0,o.useRef)(null),{href:k,as:j,children:z,prefetch:N=null,passHref:M,replace:S,shallow:A,scroll:C,onClick:P,onMouseEnter:T,onTouchStart:O,legacyBehavior:B=!1,onNavigate:L,transitionTypes:_,ref:E,unstable_dynamicOnHover:I,...$}=a;i=z,B&&("string"==typeof i||"number"==typeof i)&&(i=(0,n.jsx)("a",{children:i}));let R=o.default.useContext(s.AppRouterContext),U=!1!==N,F=!1!==N?null===(l=N)||"auto"===l?b.FetchStrategy.PPR:b.FetchStrategy.Full:b.FetchStrategy.PPR,H="string"==typeof(t=j||k)?t:(0,d.formatUrl)(t);if(B){if(i?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});r=o.default.Children.only(i)}let W=B?r&&"object"==typeof r&&r.ref:E,V=o.default.useCallback(e=>(null!==R&&(w.current=(0,p.mountLinkInstance)(e,H,R,F,U,y)),()=>{w.current&&((0,p.unmountLinkForCurrentNavigation)(w.current),w.current=null),(0,p.unmountPrefetchableInstance)(e)}),[U,H,R,F,y]),D={ref:(0,m.useMergedRef)(V,W),onClick(a){B||"function"!=typeof P||P(a),B&&r.props&&"function"==typeof r.props.onClick&&r.props.onClick(a),!R||a.defaultPrevented||function(a,t,l,i,r,n,d){if("u">typeof window){let s,{nodeName:m}=a.currentTarget;if("A"===m.toUpperCase()&&((s=a.currentTarget.getAttribute("target"))&&"_self"!==s||a.metaKey||a.ctrlKey||a.shiftKey||a.altKey||a.nativeEvent&&2===a.nativeEvent.which)||a.currentTarget.hasAttribute("download"))return;if(!(0,g.isLocalURL)(t)){i&&(a.preventDefault(),location.replace(t));return}if(a.preventDefault(),n){let e=!1;if(n({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:h}=e.r(59224);o.default.startTransition(()=>{h(t,i?"replace":"push",!1===r?u.ScrollBehavior.NoScroll:u.ScrollBehavior.Default,l.current,d)})}}(a,H,w,S,C,L,_)},onMouseEnter(e){B||"function"!=typeof T||T(e),B&&r.props&&"function"==typeof r.props.onMouseEnter&&r.props.onMouseEnter(e),R&&U&&(0,p.onNavigationIntent)(e.currentTarget,!0===I)},onTouchStart:function(e){B||"function"!=typeof O||O(e),B&&r.props&&"function"==typeof r.props.onTouchStart&&r.props.onTouchStart(e),R&&U&&(0,p.onNavigationIntent)(e.currentTarget,!0===I)}};return(0,h.isAbsoluteUrl)(H)?D.href=H:B&&!M&&("a"!==r.type||"href"in r.props)||(D.href=(0,c.addBasePath)(H)),f=B?o.default.cloneElement(r,D):(0,n.jsx)("a",{...$,...D,children:i}),(0,n.jsx)(x.Provider,{value:v,children:f})}e.r(82094);let x=(0,o.createContext)(p.IDLE_LINK_STATUS),v=()=>(0,o.useContext)(x);("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),a.exports=t.default)},98689,(e,a,t)=>{a.exports=e.r(36809)},16233,77219,37008,30516,84097,252,20875,47548,75864,e=>{"use strict";var a=e.i(52759);let t={narrow:760,normal:1160,wide:1360},l=`
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
`;function i({label:e,variant:t="topbar",markSrc:l,markAlt:r="",launcherControlsId:n,launcherButtonLabel:o,launcherExpandLabel:d,onLauncherClick:s}){let m="topbar"===t,h=(0,a.jsxs)("svg",{viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("rect",{x:"4",y:"4",width:"4.5",height:"4.5",rx:"1.1"}),(0,a.jsx)("rect",{x:"9.75",y:"4",width:"4.5",height:"4.5",rx:"1.1"}),(0,a.jsx)("rect",{x:"15.5",y:"4",width:"4.5",height:"4.5",rx:"1.1"}),(0,a.jsx)("rect",{x:"4",y:"9.75",width:"4.5",height:"4.5",rx:"1.1"}),(0,a.jsx)("rect",{x:"9.75",y:"9.75",width:"4.5",height:"4.5",rx:"1.1"}),(0,a.jsx)("rect",{x:"15.5",y:"9.75",width:"4.5",height:"4.5",rx:"1.1"}),(0,a.jsx)("rect",{x:"4",y:"15.5",width:"4.5",height:"4.5",rx:"1.1"}),(0,a.jsx)("rect",{x:"9.75",y:"15.5",width:"4.5",height:"4.5",rx:"1.1"}),(0,a.jsx)("rect",{x:"15.5",y:"15.5",width:"4.5",height:"4.5",rx:"1.1"})]}),c=m?s?(0,a.jsx)("button",{type:"button",className:"elite-shell-topbar-brand-launcher","data-unstyled-button":!0,"data-state":"expanded","data-collapse-label":o,"data-expand-label":d,"aria-label":o,"aria-controls":n,"aria-expanded":"true",onClick:s,children:h}):(0,a.jsx)("span",{className:"elite-shell-topbar-brand-launcher","aria-hidden":"true",children:h}):null;return(0,a.jsxs)("div",{className:m?"elite-shell-topbar-brand":"elite-rail-brand","data-variant":t,children:[(0,a.jsx)("span",{className:m?"elite-shell-topbar-brand-mark":"elite-rail-brand-mark","aria-hidden":"true","data-has-image":l?"true":"false",children:l?(0,a.jsx)("img",{className:"elite-shell-topbar-brand-mark-image",src:l,alt:r}):null}),(0,a.jsxs)("div",{className:m?"elite-shell-topbar-brand-copy":"elite-rail-brand-copy",children:[(0,a.jsx)("span",{className:m?"elite-shell-topbar-brand-name":"elite-rail-brand-name",children:"Elite Message"}),(0,a.jsx)("span",{className:m?"elite-shell-topbar-brand-subtitle":"elite-rail-brand-subtitle",children:e})]}),c]})}e.s(["AppShell",0,function({title:e,subtitle:r,breadcrumbLabel:n,children:o,footer:d,meta:s,nav:m,headerActions:h,secondaryNav:c,surface:u="neutral",density:p="comfortable",contentWidth:g="wide",headerMode:b="default",topbarBrandMarkAlt:f,labels:x}){let v=m?`elite-shell-nav-${u}`:void 0,y="full"===g?void 0:t[g],w=("customer"===u||"admin"===u)&&!!m&&"hidden"!==b,k=n??e,j=!!r.trim(),z=!!m&&("customer"===u||"admin"===u),N=x?.surfaceLabel??function(e){switch(e){case"customer":return"Customer Surface";case"admin":return"Admin Console";default:return"Elite Message"}}(u),M=x?.breadcrumbAriaLabel??"Breadcrumb",S=x?.breadcrumbHomeLabel??"Dashboard",A=x?.customerTopbarLabel??`${N} topbar`,C=x?.mobileNavigationLabel??"Navigation",P=x?.mobileNavigationOpenLabel??"Open",T=x?.collapseSidebarLabel??"Collapse sidebar menu",O=x?.expandSidebarLabel??"Expand sidebar menu",B=x?.brandMarkAlt??f??"Elite Message logo";return(0,a.jsxs)("main",{"data-elite-shell":!0,"data-surface":u,"data-density":p,"data-header-mode":b,style:{minHeight:"100vh",background:"var(--elite-shell-bg)",padding:"hidden"===b||w?0:"clamp(18px, 2vw, 26px)",color:"var(--elite-ink)"},children:[(0,a.jsx)("style",{children:l}),(0,a.jsxs)("div",{className:"elite-shell-frame","data-has-nav":m?"true":"false",children:[w?(0,a.jsxs)("div",{className:"elite-shell-topbar","aria-label":A,children:[(0,a.jsx)(i,{label:N,variant:"topbar",markSrc:"customer"===u?"/images/EliteMessage_Icon_Only.png":void 0,markAlt:B,launcherControlsId:v,launcherButtonLabel:T,launcherExpandLabel:O,onLauncherClick:z?e=>{let a=e.currentTarget.closest("[data-elite-shell]");if(!a)return;let t="true"===a.getAttribute("data-nav-collapsed");!function(e,a,t){a?e.setAttribute("data-nav-collapsed","true"):e.removeAttribute("data-nav-collapsed");let l=e.querySelector(".elite-shell-frame");l&&(a?l.setAttribute("data-nav-collapsed","true"):l.removeAttribute("data-nav-collapsed"));let i=t?e.querySelector(`#${t}`):e.querySelector(".elite-shell-aside");i&&(i.hidden=!1,i.removeAttribute("aria-hidden"));let r=e.querySelector(".elite-shell-mobile-nav");r&&(r.hidden=a);let n=e.querySelector(".elite-shell-topbar-brand-launcher");if(n){let e=n.dataset.collapseLabel??"Collapse sidebar menu",t=n.dataset.expandLabel??"Expand sidebar menu";n.dataset.state=a?"collapsed":"expanded",n.setAttribute("aria-expanded",a?"false":"true"),n.setAttribute("aria-label",a?t:e)}}(a,!t,v)}:void 0}),(0,a.jsx)("div",{className:"elite-shell-topbar-center",children:s}),(0,a.jsx)("div",{className:"elite-shell-topbar-actions",children:h})]}):null,m?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:"elite-shell-mobile-nav",children:(0,a.jsxs)("details",{children:[(0,a.jsxs)("summary",{children:[(0,a.jsx)("span",{children:C}),(0,a.jsx)("span",{"aria-hidden":"true",children:P})]}),(0,a.jsx)("div",{className:"elite-shell-mobile-nav-body",children:m})]})}),(0,a.jsx)("aside",{id:v,className:"elite-shell-aside",children:m})]}):null,(0,a.jsx)("div",{className:"elite-shell-main",children:(0,a.jsxs)("div",{className:"elite-shell-content",style:{maxWidth:y,margin:m?void 0:"0 auto"},children:["hidden"===b?null:(0,a.jsxs)("header",{className:`elite-page-header${"customer"===u?" elite-page-header-customer":""}`,children:[w?null:(0,a.jsxs)("div",{className:"elite-page-header-top",children:[(0,a.jsxs)("span",{className:"elite-page-brand",children:[(0,a.jsx)("span",{className:"elite-page-brand-mark","aria-hidden":"true"}),N]}),(0,a.jsxs)("div",{className:"elite-toolbar",children:[s,h]})]}),"customer"===u?(0,a.jsxs)("div",{className:"elite-page-header-body elite-page-header-body-customer",children:[(0,a.jsxs)("div",{className:"elite-page-header-row",children:[(0,a.jsx)("h1",{className:"elite-page-title",children:e}),(0,a.jsxs)("nav",{className:"elite-page-breadcrumbs","aria-label":M,children:[(0,a.jsx)("a",{href:"/",children:S}),(0,a.jsx)("span",{"aria-hidden":"true",children:"/"}),(0,a.jsx)("span",{children:k})]})]}),j?(0,a.jsx)("p",{className:"elite-page-subtitle",children:r}):null]}):(0,a.jsxs)("div",{className:"elite-page-header-body",children:[(0,a.jsx)("h1",{className:"elite-page-title",children:e}),j?(0,a.jsx)("p",{className:"elite-page-subtitle",children:r}):null]})]}),c?(0,a.jsx)("div",{className:"elite-page-secondary-nav",children:c}):null,(0,a.jsx)("div",{className:"elite-page-stack",children:o}),d?(0,a.jsx)("footer",{className:"elite-page-footer",children:d}):null]})})]})]})}],77219),e.i(25762);function r({children:e,tone:t="neutral"}){return(0,a.jsx)("span",{className:"elite-status-badge","data-tone":t,children:e})}e.s(["ActionButton",0,function({tone:e="primary",size:t="default",stretch:l=!1,children:i,...r}){return(0,a.jsx)("button",{...r,"data-elite-button":!0,"data-tone":e,"data-size":t,"data-stretch":l?"true":"false",children:i})},"AnchorNav",0,function({items:e}){return(0,a.jsx)("nav",{className:"elite-anchor-nav","aria-label":"Section navigation",children:e.map(e=>(0,a.jsx)("a",{href:e.href,children:e.label},e.href))})},"DefinitionGrid",0,function({items:e,minItemWidth:t=170,emphasis:l="soft"}){return(0,a.jsx)("div",{className:"elite-definition-grid",style:{"--elite-grid-min":`${t}px`},children:e.map(e=>(0,a.jsxs)("div",{className:"elite-definition-item","data-tone":e.tone??"neutral","data-emphasis":l,children:[(0,a.jsx)("div",{className:"elite-definition-label",children:e.label}),(0,a.jsx)("div",{className:"elite-definition-value",children:e.value})]},`${e.label}-${String(e.value)}`))})},"Field",0,function({label:e,hint:t,tone:l="neutral",children:i}){return(0,a.jsxs)("label",{className:"elite-field","data-tone":l,children:[(0,a.jsx)("span",{className:"elite-field-label",children:e}),i,t?(0,a.jsx)("span",{className:"elite-field-hint",children:t}):null]})},"MetricCard",0,function({label:e,value:t,hint:l,tone:i="neutral",emphasis:r="soft"}){return(0,a.jsxs)("div",{className:"elite-metric-card","data-tone":i,"data-emphasis":r,children:[(0,a.jsx)("div",{className:"elite-metric-label",children:e}),(0,a.jsx)("div",{className:"elite-metric-value",children:t}),l?(0,a.jsx)("div",{className:"elite-metric-hint",children:l}):null]})},"MetricGrid",0,function({children:e,minItemWidth:t=170}){return(0,a.jsx)("div",{className:"elite-metric-grid",style:{"--elite-grid-min":`${t}px`},children:e})},"NoticeBanner",0,function({title:e,tone:t="info",emphasis:l="soft",surface:i,children:r}){return(0,a.jsxs)("div",{className:"elite-notice","data-tone":t,"data-emphasis":l,"data-surface":i,children:[(0,a.jsx)("div",{className:"elite-notice-title",children:e}),(0,a.jsx)("div",{children:r})]})},"SectionGrid",0,function({children:e,minItemWidth:t=280}){return(0,a.jsx)("div",{className:"elite-section-grid",style:{"--elite-grid-min":`${t}px`},children:e})},"SelectInput",0,function(e){return(0,a.jsx)("select",{...e,"data-elite-control":!0})},"StatusBadge",0,r,"TextAreaInput",0,function(e){return(0,a.jsx)("textarea",{...e,"data-elite-control":!0})},"TextInput",0,function(e){return(0,a.jsx)("input",{...e,"data-elite-control":!0})}],37008),e.s(["InfoCard",0,function({eyebrow:e,title:t,subtitle:l,action:i,children:r,className:n,tone:o="neutral",density:d="comfortable",surface:s,id:m,...h}){return(0,a.jsxs)("section",{...h,id:m,"data-elite-card":!0,"data-tone":o,"data-density":d,"data-surface":s,className:n,style:h.style,children:[(0,a.jsxs)("div",{className:"elite-card-header",children:[(0,a.jsxs)("div",{className:"elite-card-copy",children:[e?(0,a.jsx)("p",{className:"elite-card-eyebrow",children:e}):null,(0,a.jsx)("h2",{className:"elite-card-title",children:t}),l?(0,a.jsx)("p",{className:"elite-card-subtitle",children:l}):null]}),i?(0,a.jsx)("div",{className:"elite-card-action",children:i}):null]}),(0,a.jsx)("div",{className:"elite-card-body",children:r})]})}],30516),e.i(9194);var n=e.i(49153);e.s([],16233);var o=e.i(87383);let d=[{key:"dashboard",href:"/",label:"Overview",icon:"dashboard",section:"pinned"},{key:"messages",href:"/messages",label:"Messages",icon:"messages",section:"operations"},{key:"workers",href:"/workers",label:"Workers",icon:"workers",section:"operations"},{key:"support",href:"/support",label:"Support",icon:"support",section:"operations"},{key:"audit",href:"/audit",label:"Audit",icon:"audit",section:"operations"},{key:"users",href:"/users",label:"Users",icon:"users",section:"directory"},{key:"workspaces",href:"/workspaces",label:"Workspaces",icon:"workspaces",section:"directory"}];function s(e){return e.startsWith("/users")?"users":e.startsWith("/workspaces")?"workspaces":e.startsWith("/messages")?"messages":e.startsWith("/workers/")?"worker-detail":e.startsWith("/workers")?"workers":e.startsWith("/support")?"support":e.startsWith("/audit")?"audit":e.startsWith("/instances/")?"instance":"dashboard"}function m(e,a){return e===a||"worker-detail"===a&&"workers"===e||"instance"===a&&"dashboard"===e}function h({kind:e}){switch(e){case"dashboard":return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("path",{d:"M3.6 9.35 10 4.15l6.4 5.2"}),(0,a.jsx)("path",{d:"M5.2 8.85V16h4.1v-4.4h1.4V16h4.1V8.85"})]});case"messages":return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("path",{d:"M4.2 5.6h11.6v7.1H9.7L6.2 15.5v-2.8H4.2z"}),(0,a.jsx)("path",{d:"M6.3 8.1h7.4"}),(0,a.jsx)("path",{d:"M6.3 10.2h4.8"})]});case"workers":return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("rect",{x:"3.9",y:"4.2",width:"4.2",height:"4.2",rx:"1"}),(0,a.jsx)("rect",{x:"11.9",y:"4.2",width:"4.2",height:"4.2",rx:"1"}),(0,a.jsx)("rect",{x:"3.9",y:"11.6",width:"4.2",height:"4.2",rx:"1"}),(0,a.jsx)("path",{d:"M10 6.3H11.9"}),(0,a.jsx)("path",{d:"M6 8.4v3.2"}),(0,a.jsx)("path",{d:"M8.1 13.7H11.9"}),(0,a.jsx)("path",{d:"M14 8.4v5.3"})]});case"support":return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("path",{d:"M10 15.9a5.9 5.9 0 1 0-5.9-5.9"}),(0,a.jsx)("path",{d:"M4.1 10.05v2.75"}),(0,a.jsx)("path",{d:"M15.9 10.05v2.75"}),(0,a.jsx)("path",{d:"M6.25 15.15c.85.65 2.05 1.05 3.75 1.05s2.9-.4 3.75-1.05"})]});case"audit":return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("path",{d:"M10 3.1 15.8 5.2V9c0 3.35-2 6.35-5.8 7.9C6.2 15.35 4.2 12.35 4.2 9V5.2z"}),(0,a.jsx)("path",{d:"M8 9.8 9.35 11.15 12.2 8.3"})]});case"users":return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("circle",{cx:"7.1",cy:"7.2",r:"2.2"}),(0,a.jsx)("circle",{cx:"13.25",cy:"8",r:"1.7"}),(0,a.jsx)("path",{d:"M3.9 15c.55-2.15 2.35-3.45 5.05-3.45 2.7 0 4.5 1.3 5.05 3.45"}),(0,a.jsx)("path",{d:"M12 14.95c.4-1.35 1.45-2.2 3.15-2.2.45 0 .85.05 1.2.15"})]});case"workspaces":return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("rect",{x:"3.8",y:"4.1",width:"5.6",height:"5.6",rx:"1.2"}),(0,a.jsx)("rect",{x:"10.6",y:"4.1",width:"5.6",height:"3.6",rx:"1.2"}),(0,a.jsx)("rect",{x:"10.6",y:"9.9",width:"5.6",height:"6",rx:"1.2"}),(0,a.jsx)("rect",{x:"3.8",y:"11.9",width:"5.6",height:"4",rx:"1.2"})]});default:return null}}function c(){return(0,a.jsx)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:(0,a.jsx)("path",{d:"m7.2 4.9 4.9 5.1-4.9 5.1"})})}function u(e,t){let l=d.filter(a=>a.section===e);return 0===l.length?null:(0,a.jsxs)("div",{className:"elite-rail-section",children:[(0,a.jsx)("div",{className:"elite-rail-section-label",children:"pinned"===e?"Pinned":"operations"===e?"Operations":"Directory"}),(0,a.jsx)("div",{className:"elite-rail-links",children:l.map(e=>{var l;return l=m(e.key,t),(0,a.jsxs)(o.default,{href:e.href,className:"elite-rail-link","data-key":e.key,"data-active":l?"true":"false","data-tooltip":e.label,"aria-current":l?"page":void 0,title:e.label,children:[(0,a.jsxs)("span",{className:"elite-rail-link-main",children:[(0,a.jsx)("span",{className:"elite-rail-link-icon","aria-hidden":"true",children:(0,a.jsx)(h,{kind:e.icon})}),(0,a.jsx)("span",{className:"elite-rail-link-label",children:e.label})]}),(0,a.jsx)("span",{className:"elite-rail-link-trailing",children:l?(0,a.jsx)(r,{tone:"warning",children:"Current"}):(0,a.jsx)("span",{className:"elite-rail-link-chevron","aria-hidden":"true",children:(0,a.jsx)(c,{})})})]},e.key)})})]})}e.s(["AdminNav",0,function({current:e,account:t}){let l=t?{label:"Active operator",name:t.user.displayName,metaPrimary:t.user.role.replaceAll("_"," "),metaSecondary:t.user.email}:{label:"Admin surface",name:"Operations Console",metaPrimary:"Platform admin",metaSecondary:"Global access"};return(0,a.jsxs)("nav",{className:"elite-rail","aria-label":"Admin navigation",children:[(0,a.jsx)("div",{className:"elite-rail-header",children:(0,a.jsxs)("div",{className:"elite-rail-workspace",children:[(0,a.jsx)("div",{className:"elite-rail-workspace-label",children:l.label}),(0,a.jsx)("div",{className:"elite-rail-workspace-name",children:l.name}),(0,a.jsxs)("div",{className:"elite-rail-workspace-meta",children:[(0,a.jsx)("span",{children:l.metaPrimary}),(0,a.jsx)("span",{children:l.metaSecondary})]})]})}),u("pinned",e),u("operations",e),u("directory",e),(0,a.jsx)("div",{className:"elite-rail-meta",children:t?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(r,{tone:"warning",children:t.user.displayName}),(0,a.jsxs)(r,{tone:"neutral",children:[t.workspaces.length," workspaces"]})]}):(0,a.jsx)(r,{tone:"neutral",children:"Admin surface"})})]})},"adminNavItems",0,d,"isAdminNavItemActive",0,m,"resolveAdminNavCurrent",0,s],84097);var p=e.i(98689),g=e.i(11501),b=e.i(86544);let f="elite-message.admin.access-token",x=b.default.env.NEXT_PUBLIC_API_BASE_URL??"http://localhost:3002";function v(){return window.sessionStorage.getItem(f)}function y(e){window.sessionStorage.setItem(f,e)}function w(){window.sessionStorage.removeItem(f)}async function k(e){try{return await e()}catch{return null}}async function j(e){let a=await k(()=>fetch(`${x}/api/v1/auth/refresh`,{method:"POST",credentials:"include"}));if(!a){let a=v();return e?.(a),a}if(!a.ok)return w(),e?.(null),null;let t=await a.json();return y(t.accessToken),e?.(t.accessToken),t.accessToken}async function z(e,a,t){let l=e??v();if(l||(l=await j(t)),!l)return null;let i=l,r=await k(()=>a(i));if(!r)return null;if(401===r.status){if(!(l=await j(t)))return null;let e=l;if(!(r=await k(()=>a(e))))return null}return r}async function N(e){let a=await k(()=>fetch(`${x}/api/v1/account/me`,{headers:{authorization:`Bearer ${e}`},credentials:"include"}));if(!a||401===a.status)return null;if(403===a.status)throw Error("This account cannot open the admin console.");if(!a.ok)throw Error("Could not load the admin account.");let t=await a.json();return(0,n.setGlobalThemePreference)(t.themePreference),t}function M({syncAccount:e=!1}){async function t(a){if(!e)return;let t=await z(null,e=>fetch(`${x}/api/v1/account/me/theme`,{method:"PATCH",headers:{authorization:`Bearer ${e}`,"content-type":"application/json"},credentials:"include",body:JSON.stringify({themePreference:a})}));if(!t||!t.ok)return}return(0,a.jsx)(n.ThemePreferenceMenuButton,{onPreferenceChange:e?t:void 0})}function S(e){if(!(e instanceof HTMLElement))return;let a=e.closest("details");a instanceof HTMLDetailsElement&&(a.open=!1)}function A({children:e}){return(0,a.jsx)("span",{"aria-hidden":"true",children:e})}function C(){return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("path",{d:"M10 2.9 16.2 5.2v4c0 3.6-2.15 6.55-6.2 8-4.05-1.45-6.2-4.4-6.2-8v-4z"}),(0,a.jsx)("path",{d:"M8.2 9.8 9.45 11.05 12.1 8.4"})]})}function P(){return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("path",{d:"M4.5 8V4.5H8"}),(0,a.jsx)("path",{d:"M12 4.5H15.5V8"}),(0,a.jsx)("path",{d:"M15.5 12V15.5H12"}),(0,a.jsx)("path",{d:"M8 15.5H4.5V12"})]})}function T(){return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("circle",{cx:"8.5",cy:"8.5",r:"4.25"}),(0,a.jsx)("path",{d:"M12 12L16.25 16.25"})]})}function O(){return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("circle",{cx:"7.1",cy:"7.2",r:"2.2"}),(0,a.jsx)("circle",{cx:"13.25",cy:"8",r:"1.7"}),(0,a.jsx)("path",{d:"M3.9 15c.55-2.15 2.35-3.45 5.05-3.45 2.7 0 4.5 1.3 5.05 3.45"}),(0,a.jsx)("path",{d:"M12 14.95c.4-1.35 1.45-2.2 3.15-2.2.45 0 .85.05 1.2.15"})]})}function B(){return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("rect",{x:"3.8",y:"4.1",width:"5.6",height:"5.6",rx:"1.2"}),(0,a.jsx)("rect",{x:"10.6",y:"4.1",width:"5.6",height:"3.6",rx:"1.2"}),(0,a.jsx)("rect",{x:"10.6",y:"9.9",width:"5.6",height:"6",rx:"1.2"}),(0,a.jsx)("rect",{x:"3.8",y:"11.9",width:"5.6",height:"4",rx:"1.2"})]})}function L(){return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("path",{d:"M10 15.9a5.9 5.9 0 1 0-5.9-5.9"}),(0,a.jsx)("path",{d:"M4.1 10.05v2.75"}),(0,a.jsx)("path",{d:"M15.9 10.05v2.75"}),(0,a.jsx)("path",{d:"M6.25 15.15c.85.65 2.05 1.05 3.75 1.05s2.9-.4 3.75-1.05"})]})}function _(){return(0,a.jsxs)("svg",{viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,a.jsx)("path",{d:"M10 3.1 15.8 5.2V9c0 3.35-2 6.35-5.8 7.9C6.2 15.35 4.2 12.35 4.2 9V5.2z"}),(0,a.jsx)("path",{d:"M8 9.8 9.35 11.15 12.2 8.3"})]})}e.s(["apiBaseUrl",0,x,"clearStoredToken",0,w,"readStoredToken",0,v,"writeStoredToken",0,y],252),e.s(["loadAdminAccount",0,N,"refreshAdminAccessToken",0,j,"requestWithAdminRefresh",0,z],20875),e.s(["AdminThemeControl",0,M],47548),e.s(["AdminTopbarControls",0,function({account:e}){let t=(0,p.useRouter)(),l=s((0,p.usePathname)()??"/"),i=e?.user.displayName??"Admin Operator",r=e?.user.role.replaceAll("_"," ")??"Admin console",n=(i||e?.user.email||"A").trim().charAt(0).toUpperCase(),[o,h]=(0,g.useState)(!1);function c(e){t.push(e)}async function u(){try{if(document.fullscreenElement)return void await document.exitFullscreen();await document.documentElement.requestFullscreen()}catch{}}async function b(){try{await fetch(`${x}/api/v1/auth/logout`,{method:"POST",credentials:"include"})}finally{w(),window.location.assign("/")}}return(0,g.useEffect)(()=>{h(!!document.fullscreenElement);let e=()=>{h(!!document.fullscreenElement)};return document.addEventListener("fullscreenchange",e),()=>{document.removeEventListener("fullscreenchange",e)}},[]),(0,a.jsxs)("div",{className:"elite-customer-topbar-controls",children:[(0,a.jsxs)("div",{className:"elite-customer-topbar-utilities","aria-label":"Admin topbar shortcuts",children:[(0,a.jsxs)("button",{type:"button","data-unstyled-button":!0,className:"elite-customer-topbar-language","aria-label":"Open admin overview","data-active":"dashboard"===l?"true":"false",onClick:()=>{c("/")},children:[(0,a.jsx)("span",{className:"elite-customer-topbar-language-flag","aria-hidden":"true",children:(0,a.jsx)(C,{})}),(0,a.jsx)("span",{className:"elite-customer-topbar-language-code",children:"OPS"})]}),(0,a.jsx)(M,{syncAccount:!0}),(0,a.jsx)("button",{type:"button","data-unstyled-button":!0,className:"elite-customer-topbar-utility","aria-label":o?"Exit fullscreen":"Enter fullscreen","aria-pressed":o,"data-active":o?"true":"false",onClick:()=>{u()},children:(0,a.jsx)(A,{children:(0,a.jsx)(P,{})})}),(0,a.jsx)("button",{type:"button","data-unstyled-button":!0,className:"elite-customer-topbar-utility","aria-label":"Open message explorer","data-active":"messages"===l?"true":"false",onClick:()=>{c("/messages")},children:(0,a.jsx)(A,{children:(0,a.jsx)(T,{})})}),(0,a.jsx)("button",{type:"button","data-unstyled-button":!0,className:"elite-customer-topbar-utility","aria-label":"Open users explorer","data-active":"users"===l?"true":"false",onClick:()=>{c("/users")},children:(0,a.jsx)(A,{children:(0,a.jsx)(O,{})})}),(0,a.jsx)("button",{type:"button","data-unstyled-button":!0,className:"elite-customer-topbar-utility","aria-label":"Open workspaces explorer","data-active":"workspaces"===l?"true":"false",onClick:()=>{c("/workspaces")},children:(0,a.jsx)(A,{children:(0,a.jsx)(B,{})})}),(0,a.jsx)("button",{type:"button","data-unstyled-button":!0,className:"elite-customer-topbar-utility","aria-label":"Open support cases","data-active":"support"===l?"true":"false",onClick:()=>{c("/support")},children:(0,a.jsx)(A,{children:(0,a.jsx)(L,{})})}),(0,a.jsx)("button",{type:"button","data-unstyled-button":!0,className:"elite-customer-topbar-utility","aria-label":"Open audit explorer","data-active":"audit"===l?"true":"false",onClick:()=>{c("/audit")},children:(0,a.jsx)(A,{children:(0,a.jsx)(_,{})})})]}),(0,a.jsxs)("details",{className:"elite-customer-topbar-menu",children:[(0,a.jsxs)("summary",{className:"elite-customer-topbar-user","aria-label":"Admin account menu",children:[(0,a.jsx)("span",{className:"elite-customer-topbar-user-avatar","aria-hidden":"true",children:n}),(0,a.jsxs)("span",{className:"elite-customer-topbar-user-copy",children:[(0,a.jsx)("strong",{children:i}),(0,a.jsx)("span",{children:r})]}),(0,a.jsx)("span",{className:"elite-customer-topbar-user-caret","aria-hidden":"true",children:"▾"})]}),(0,a.jsxs)("div",{className:"elite-customer-topbar-menu-panel",children:[(0,a.jsx)("div",{className:"elite-customer-topbar-menu-eyebrow",children:"Quick navigation"}),(0,a.jsx)("div",{className:"elite-customer-topbar-menu-list",children:d.map(e=>{let t=m(e.key,l);return(0,a.jsxs)("button",{type:"button","data-unstyled-button":!0,className:"elite-customer-topbar-menu-item","data-active":t?"true":"false",onClick:a=>{S(a.currentTarget),c(e.href)},children:[(0,a.jsxs)("span",{className:"elite-customer-topbar-menu-item-copy",children:[(0,a.jsx)("strong",{children:e.label}),(0,a.jsx)("span",{children:"/"===e.href?"Admin overview":`Open ${e.label.toLowerCase()}`})]}),(0,a.jsx)("span",{className:"elite-customer-topbar-menu-item-state","aria-hidden":"true",children:t?"Active":"Open"})]},e.key)})}),(0,a.jsx)("button",{type:"button","data-unstyled-button":!0,className:"elite-customer-topbar-menu-logout",onClick:e=>{S(e.currentTarget),b()},children:"Log out"})]})]})]})}],75864)}]);