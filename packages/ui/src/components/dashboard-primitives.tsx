import type {
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type ButtonTone = 'primary' | 'secondary' | 'ghost' | 'danger';
type Emphasis = 'soft' | 'strong';
type Surface = 'neutral' | 'customer' | 'admin';
type ButtonSize = 'compact' | 'default' | 'large';

type StatusBadgeProps = {
  children: ReactNode;
  tone?: Tone;
};

type MetricGridProps = PropsWithChildren<{
  minItemWidth?: number;
}>;

type MetricCardProps = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: Tone;
  emphasis?: Emphasis;
};

type NoticeBannerProps = PropsWithChildren<{
  title: string;
  tone?: Tone;
  emphasis?: Emphasis;
  surface?: Surface;
}>;

type SectionGridProps = PropsWithChildren<{
  minItemWidth?: number;
}>;

type DefinitionGridProps = {
  items: Array<{
    label: string;
    value: ReactNode;
    tone?: Tone;
  }>;
  minItemWidth?: number;
  emphasis?: Emphasis;
};

type FieldProps = PropsWithChildren<{
  label: ReactNode;
  hint?: ReactNode;
  tone?: Tone;
}>;

type CheckboxFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  label: ReactNode;
  hint?: ReactNode;
};

type EmptyStateProps = {
  title: string;
  description: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
};

type AnchorNavProps = {
  items: Array<{
    label: string;
    href: string;
  }>;
};

type LoadingStateProps = {
  title: string;
  description?: ReactNode;
  rows?: number;
};

type ErrorStateProps = PropsWithChildren<{
  title: string;
  action?: ReactNode;
  tone?: Extract<Tone, 'warning' | 'danger'>;
}>;

type FilterBarProps = PropsWithChildren<{
  title?: ReactNode;
  actions?: ReactNode;
}>;

type RecordListProps = PropsWithChildren<{
  'aria-label'?: string;
}>;

type RecordItemProps = PropsWithChildren<{
  title: ReactNode;
  meta?: ReactNode;
  badges?: ReactNode;
  action?: ReactNode;
  tone?: Tone;
}>;

type ResponsiveColumnsProps = PropsWithChildren<{
  sidebar?: ReactNode;
  sidebarLabel?: string;
  contentLabel?: string;
}>;

function cssVarStyle(name: string, value: string): CSSProperties {
  return {
    [name]: value,
  } as CSSProperties;
}

export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span className="elite-status-badge" data-tone={tone}>
      {children}
    </span>
  );
}

export function MetricGrid({ children, minItemWidth = 170 }: MetricGridProps) {
  return (
    <div
      className="elite-metric-grid"
      style={cssVarStyle('--elite-grid-min', `${minItemWidth}px`)}
    >
      {children}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  tone = 'neutral',
  emphasis = 'soft',
}: MetricCardProps) {
  return (
    <div
      className="elite-metric-card"
      data-tone={tone}
      data-emphasis={emphasis}
    >
      <div className="elite-metric-label">{label}</div>
      <div className="elite-metric-value">{value}</div>
      {hint ? <div className="elite-metric-hint">{hint}</div> : null}
    </div>
  );
}

export function NoticeBanner({
  title,
  tone = 'info',
  emphasis = 'soft',
  surface,
  children,
}: NoticeBannerProps) {
  return (
    <div
      className="elite-notice"
      data-tone={tone}
      data-emphasis={emphasis}
      data-surface={surface}
    >
      <div className="elite-notice-title">{title}</div>
      <div>{children}</div>
    </div>
  );
}

export function SectionGrid({
  children,
  minItemWidth = 280,
}: SectionGridProps) {
  return (
    <div
      className="elite-section-grid"
      style={cssVarStyle('--elite-grid-min', `${minItemWidth}px`)}
    >
      {children}
    </div>
  );
}

export function DefinitionGrid({
  items,
  minItemWidth = 170,
  emphasis = 'soft',
}: DefinitionGridProps) {
  return (
    <div
      className="elite-definition-grid"
      style={cssVarStyle('--elite-grid-min', `${minItemWidth}px`)}
    >
      {items.map((item) => (
        <div
          key={`${item.label}-${String(item.value)}`}
          className="elite-definition-item"
          data-tone={item.tone ?? 'neutral'}
          data-emphasis={emphasis}
        >
          <div className="elite-definition-label">{item.label}</div>
          <div className="elite-definition-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function ActionButton({
  tone = 'primary',
  size = 'default',
  stretch = false,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: ButtonTone;
  size?: ButtonSize;
  stretch?: boolean;
}) {
  return (
    <button
      {...props}
      data-elite-button
      data-tone={tone}
      data-size={size}
      data-stretch={stretch ? 'true' : 'false'}
    >
      {children}
    </button>
  );
}

export function Field({ label, hint, tone = 'neutral', children }: FieldProps) {
  return (
    <label className="elite-field" data-tone={tone}>
      <span className="elite-field-label">{label}</span>
      {children}
      {hint ? <span className="elite-field-hint">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} data-elite-control />;
}

export function TextAreaInput(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return <textarea {...props} data-elite-control />;
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} data-elite-control />;
}

export function CheckboxField({ label, hint, ...props }: CheckboxFieldProps) {
  return (
    <label className="elite-checkbox-row">
      <input {...props} type="checkbox" />
      <span>
        <span className="elite-checkbox-label">{label}</span>
        {hint ? <span className="elite-field-hint">{hint}</span> : null}
      </span>
    </label>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  tone = 'neutral',
}: EmptyStateProps) {
  return (
    <div className="elite-empty-state" data-tone={tone}>
      {icon ? (
        <div className="elite-empty-state-icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <div className="elite-empty-state-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {action ? <div className="elite-toolbar">{action}</div> : null}
    </div>
  );
}

export function AnchorNav({ items }: AnchorNavProps) {
  return (
    <nav className="elite-anchor-nav" aria-label="Section navigation">
      {items.map((item) => (
        <a key={item.href} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function LoadingState({
  title,
  description,
  rows = 3,
}: LoadingStateProps) {
  const dotCount = Math.max(3, rows);

  return (
    <div className="elite-loading-state" role="status" aria-live="polite">
      <span className="elite-sr-only">
        {title}
        {description ? ` ${description}` : ''}
      </span>
      <div className="elite-loading-animation" aria-hidden="true">
        <span className="elite-loading-core" />
        <span className="elite-loading-ring" />
        <span className="elite-loading-ring elite-loading-ring-offset" />
        <span className="elite-loading-dots">
          {Array.from({ length: dotCount }).map((_, index) => (
            <span
              key={index}
              style={
                {
                  '--elite-dot-angle': `${(360 / dotCount) * index}deg`,
                  '--elite-dot-delay': `${index * 90}ms`,
                } as CSSProperties
              }
            />
          ))}
        </span>
      </div>
    </div>
  );
}

export function ErrorState({
  title,
  action,
  tone = 'danger',
  children,
}: ErrorStateProps) {
  return (
    <div className="elite-error-state" data-tone={tone} role="alert">
      <div className="elite-error-state-copy">
        <h3>{title}</h3>
        <div>{children}</div>
      </div>
      {action ? <div className="elite-toolbar">{action}</div> : null}
    </div>
  );
}

export function FilterBar({ title, actions, children }: FilterBarProps) {
  return (
    <div className="elite-filter-bar">
      {title || actions ? (
        <div className="elite-filter-bar-header">
          {title ? <strong>{title}</strong> : <span />}
          {actions ? <div className="elite-toolbar">{actions}</div> : null}
        </div>
      ) : null}
      <div className="elite-filter-bar-grid">{children}</div>
    </div>
  );
}

export function RecordList({
  children,
  'aria-label': ariaLabel,
}: RecordListProps) {
  return (
    <div className="elite-record-list" aria-label={ariaLabel}>
      {children}
    </div>
  );
}

export function RecordItem({
  title,
  meta,
  badges,
  action,
  tone = 'neutral',
  children,
}: RecordItemProps) {
  return (
    <article className="elite-record-item" data-tone={tone}>
      <div className="elite-record-item-main">
        <div className="elite-record-item-title">
          <strong>{title}</strong>
          {badges ? (
            <span className="elite-record-item-badges">{badges}</span>
          ) : null}
        </div>
        {meta ? <div className="elite-record-item-meta">{meta}</div> : null}
        {children ? (
          <div className="elite-record-item-body">{children}</div>
        ) : null}
      </div>
      {action ? <div className="elite-record-item-action">{action}</div> : null}
    </article>
  );
}

export function ResponsiveColumns({
  sidebar,
  sidebarLabel,
  contentLabel,
  children,
}: ResponsiveColumnsProps) {
  return (
    <section className="elite-responsive-columns">
      {sidebar ? (
        <aside
          className="elite-responsive-columns-sidebar"
          aria-label={sidebarLabel}
        >
          {sidebar}
        </aside>
      ) : null}
      <div className="elite-responsive-columns-main" aria-label={contentLabel}>
        {children}
      </div>
    </section>
  );
}
