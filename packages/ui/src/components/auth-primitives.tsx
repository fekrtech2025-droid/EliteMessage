'use client';

import { createPortal } from 'react-dom';
import type { InputHTMLAttributes, ReactNode } from 'react';

type Surface = 'neutral' | 'customer' | 'admin';
type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type AuthLayoutVariant = 'default' | 'spotlight';

type AuthSplitLayoutProps = {
  className?: string;
  surface?: Surface;
  variant?: AuthLayoutVariant;
  heroEyebrow?: ReactNode;
  heroTitle?: ReactNode;
  heroDescription?: ReactNode;
  heroMediaOnly?: boolean;
  heroMedia?: ReactNode;
  heroHighlights?: Array<{
    label: string;
    value: ReactNode;
    detail?: ReactNode;
    tone?: Tone;
  }>;
  heroChecklist?: ReactNode;
  heroFootnote?: ReactNode;
  panelEyebrow: string;
  panelTitle: string;
  panelSubtitle?: ReactNode;
  panelAction?: ReactNode;
  children: ReactNode;
};

type AuthSegmentedControlProps = {
  options: Array<{
    id: string;
    label: string;
    active: boolean;
    onSelect: () => void;
  }>;
  ariaLabel?: string;
};

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  showLabel?: string;
  hideLabel?: string;
  showAriaLabel?: string;
  hideAriaLabel?: string;
  revealed?: boolean;
  onToggleVisibility?: () => void;
};

type PasswordStrengthMeterProps = {
  score: 0 | 1 | 2 | 3;
  label: string;
  help?: ReactNode;
};

export type AuthHelpSection = {
  title: string;
  description?: ReactNode;
  items?: string[];
};

type HelpIconButtonProps = {
  label: string;
  onClick: () => void;
};

type AuthHelpDialogProps = {
  open: boolean;
  title: string;
  intro: ReactNode;
  sections: AuthHelpSection[];
  footer?: ReactNode;
  kickerLabel?: string;
  closeLabel?: string;
  onClose: () => void;
};

export function AuthSplitLayout({
  className,
  surface = 'neutral',
  variant = 'default',
  heroEyebrow,
  heroTitle,
  heroDescription,
  heroMediaOnly = false,
  heroMedia,
  heroHighlights,
  heroChecklist,
  heroFootnote,
  panelEyebrow,
  panelTitle,
  panelSubtitle,
  panelAction,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div
      className={
        className ? `elite-auth-layout ${className}` : 'elite-auth-layout'
      }
      data-surface={surface}
      data-variant={variant}
    >
      <section
        className="elite-auth-hero"
        data-media-only={heroMediaOnly ? 'true' : 'false'}
      >
        {heroEyebrow ? (
          <div className="elite-auth-kicker">{heroEyebrow}</div>
        ) : null}
        {heroTitle ? (
          <h2 className="elite-auth-hero-title">{heroTitle}</h2>
        ) : null}
        {heroDescription ? (
          <div className="elite-auth-hero-copy">{heroDescription}</div>
        ) : null}
        {heroHighlights?.length ? (
          <div className="elite-auth-highlight-grid">
            {heroHighlights.map((highlight) => (
              <article
                key={highlight.label}
                className="elite-auth-highlight"
                data-tone={highlight.tone ?? 'neutral'}
              >
                <div className="elite-auth-highlight-label">
                  {highlight.label}
                </div>
                <div className="elite-auth-highlight-value">
                  {highlight.value}
                </div>
                {highlight.detail ? (
                  <div className="elite-auth-highlight-detail">
                    {highlight.detail}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
        {heroChecklist ? (
          <div className="elite-auth-checklist">{heroChecklist}</div>
        ) : null}
        {heroMedia ? (
          <div className="elite-auth-hero-media">{heroMedia}</div>
        ) : null}
        {heroFootnote ? (
          <div className="elite-auth-footnote">{heroFootnote}</div>
        ) : null}
      </section>

      <section className="elite-auth-panel">
        <div className="elite-auth-panel-top">
          <div className="elite-auth-panel-copy">
            <div className="elite-auth-kicker">{panelEyebrow}</div>
            <h2 className="elite-auth-panel-title">{panelTitle}</h2>
            {panelSubtitle ? (
              <div className="elite-auth-panel-subtitle">{panelSubtitle}</div>
            ) : null}
          </div>
          {panelAction ? (
            <div className="elite-auth-panel-action">{panelAction}</div>
          ) : null}
        </div>
        <div className="elite-auth-panel-body">{children}</div>
      </section>
    </div>
  );
}

export function AuthSegmentedControl({
  options,
  ariaLabel = 'Authentication mode',
}: AuthSegmentedControlProps) {
  return (
    <div className="elite-auth-segmented" role="tablist" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          data-unstyled-button
          className="elite-auth-segment"
          data-active={option.active ? 'true' : 'false'}
          aria-selected={option.active}
          onClick={option.onSelect}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function PasswordInput({
  showLabel = 'Show',
  hideLabel = 'Hide',
  showAriaLabel = 'Show password',
  hideAriaLabel = 'Hide password',
  revealed = false,
  onToggleVisibility,
  ...props
}: PasswordInputProps) {
  return (
    <div className="elite-control-shell elite-control-shell-password">
      <input
        {...props}
        type={revealed ? 'text' : 'password'}
        data-elite-control
      />
      <button
        type="button"
        data-unstyled-button
        className="elite-control-toggle"
        aria-label={revealed ? hideAriaLabel : showAriaLabel}
        onClick={onToggleVisibility}
      >
        {revealed ? hideLabel : showLabel}
      </button>
    </div>
  );
}

export function PasswordStrengthMeter({
  score,
  label,
  help,
}: PasswordStrengthMeterProps) {
  return (
    <div className="elite-password-strength" data-score={score}>
      <div className="elite-password-strength-bars" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="elite-password-strength-bar"
            data-active={score > index ? 'true' : 'false'}
          />
        ))}
      </div>
      <div className="elite-password-strength-copy">
        <strong>{label}</strong>
        {help ? <span>{help}</span> : null}
      </div>
    </div>
  );
}

export function HelpIconButton({ label, onClick }: HelpIconButtonProps) {
  return (
    <button
      type="button"
      data-unstyled-button
      className="elite-help-icon-button"
      aria-label={label}
      onClick={onClick}
    >
      <span aria-hidden="true">?</span>
    </button>
  );
}

export function AuthHelpDialog({
  open,
  title,
  intro,
  sections,
  footer,
  kickerLabel = 'Help',
  closeLabel = 'Close help',
  onClose,
}: AuthHelpDialogProps) {
  if (!open) {
    return null;
  }

  const dialog = (
    <div className="elite-help-dialog-backdrop" onClick={onClose}>
      <div
        className="elite-help-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="elite-help-dialog-header">
          <div className="elite-help-dialog-copy">
            <div className="elite-auth-kicker">{kickerLabel}</div>
            <h2 className="elite-help-dialog-title">{title}</h2>
            <div className="elite-help-dialog-intro">{intro}</div>
          </div>
          <button
            type="button"
            data-unstyled-button
            className="elite-help-dialog-close"
            aria-label={closeLabel}
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="elite-help-dialog-body">
          {sections.map((section) => (
            <section key={section.title} className="elite-help-dialog-section">
              <h3>{section.title}</h3>
              {section.description ? <p>{section.description}</p> : null}
              {section.items?.length ? (
                <ul className="elite-help-dialog-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          {footer ? (
            <div className="elite-help-dialog-footer">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return dialog;
  }

  return createPortal(dialog, document.body);
}
