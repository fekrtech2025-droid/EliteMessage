import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type Density = 'comfortable' | 'compact';
type Surface = 'neutral' | 'customer' | 'admin';

type InfoCardProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  tone?: Tone;
  density?: Density;
  surface?: Surface;
  id?: string;
}> &
  Omit<HTMLAttributes<HTMLElement>, 'title'>;

export function InfoCard({
  eyebrow,
  title,
  subtitle,
  action,
  children,
  className,
  tone = 'neutral',
  density = 'comfortable',
  surface,
  id,
  ...props
}: InfoCardProps) {
  return (
    <section
      {...props}
      id={id}
      data-elite-card
      data-tone={tone}
      data-density={density}
      data-surface={surface}
      className={className}
      style={props.style}
    >
      <div className="elite-card-header">
        <div className="elite-card-copy">
          {eyebrow ? <p className="elite-card-eyebrow">{eyebrow}</p> : null}
          <h2 className="elite-card-title">{title}</h2>
          {subtitle ? <p className="elite-card-subtitle">{subtitle}</p> : null}
        </div>
        {action ? <div className="elite-card-action">{action}</div> : null}
      </div>
      <div className="elite-card-body">{children}</div>
    </section>
  );
}
