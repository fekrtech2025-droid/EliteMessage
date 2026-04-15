'use client';

import Link from 'next/link';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { NoticeBanner } from '@elite-message/ui';
import { useCustomerLocale } from './components/customer-localization';
import { CustomerBrandMark } from './components/customer-brand-mark';
import { LandingDeveloperIllustration } from './components/landing-developer-illustration';
import { LandingFeatureIllustration } from './components/landing-feature-illustration';
import { LandingHomeIllustration } from './components/landing-home-illustration';
import { LandingPricingIllustration } from './components/landing-pricing-illustration';
import {
  loadCustomerAccount,
  refreshCustomerAccessToken,
} from './lib/customer-auth';
import { getLandingPageCopy } from './lib/landing-content';
import styles from './landing.module.css';

type MainTab = 'home' | 'features' | 'developer' | 'pricing' | 'faq';
type CodeTab = 'curl' | 'node' | 'python';
const landingTabOrder: MainTab[] = [
  'home',
  'features',
  'developer',
  'pricing',
  'faq',
];

function resolveLandingTab(hash: string): MainTab | null {
  const normalizedHash = hash.replace(/^#/, '').toLowerCase();
  return landingTabOrder.includes(normalizedHash as MainTab)
    ? (normalizedHash as MainTab)
    : null;
}

// 3D Tilt Card Component
function TiltCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className={`${styles.tiltCardWrapper} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={styles.tiltCard}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        <div className={styles.tiltCardInner}>{children}</div>
      </div>
    </div>
  );
}

function SmoothRevealCard({
  children,
  className = '',
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const style = { ['--card-delay' as const]: `${delayMs}ms` } as CSSProperties;

  return (
    <div
      className={`${styles.smoothRevealCard} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}

// Animated counter component
function AnimatedCounter({
  end,
  duration = 2000,
}: {
  end: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTime: number;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * end);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) {
        animationFrameId = requestAnimationFrame(animate);
      }
    });

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, duration]);

  return <span ref={counterRef}>{count}</span>;
}

export function CustomerLandingPage() {
  const { locale, toggleLocale } = useCustomerLocale();
  const copy = getLandingPageCopy(locale);
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('home');
  const [checkingSession, setCheckingSession] = useState(true);
  const [showDashboardAction, setShowDashboardAction] = useState(false);
  const [sessionNotice, setSessionNotice] = useState<'stale-session' | null>(
    null,
  );
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>('curl');
  const [reducedMotion, setReducedMotion] = useState(false);
  const tabContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    syncPreference();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncPreference);
      return () => {
        mediaQuery.removeEventListener('change', syncPreference);
      };
    }

    mediaQuery.addListener?.(syncPreference);
    return () => {
      mediaQuery.removeListener?.(syncPreference);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const token = await refreshCustomerAccessToken();
      if (!alive) return;
      if (!token) {
        setCheckingSession(false);
        return;
      }
      const account = await loadCustomerAccount(token);
      if (!alive) return;
      if (account) {
        setShowDashboardAction(true);
        redirectToDashboard();
        return;
      }
      setSessionNotice('stale-session');
      setCheckingSession(false);
    })();
    return () => {
      alive = false;
    };
  }, [locale]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const applyHashTab = () => {
      const hashTab = resolveLandingTab(window.location.hash);
      if (hashTab) {
        setActiveMainTab(hashTab);
      }
    };

    applyHashTab();
    window.addEventListener('hashchange', applyHashTab);

    return () => {
      window.removeEventListener('hashchange', applyHashTab);
    };
  }, []);

  const codeSamples = useMemo(
    () => ({
      curl: `curl -X POST "$API_BASE/api/v1/public/instances/$INSTANCE_ID/messages" \\\n  -H "authorization: Bearer $INSTANCE_TOKEN" \\\n  -H "content-type: application/json" \\\n  -d '{"to":"+14155550123","type":"text","text":{"body":"Runtime healthy."}}'`,
      node: `await fetch(\`${'${apiBase}'}/api/v1/public/instances/\${instanceId}/messages\`, {\n  method: 'POST',\n  headers: {\n    authorization: \`Bearer \${instanceToken}\`,\n    'content-type': 'application/json'\n  },\n  body: JSON.stringify({\n    to: '+14155550123',\n    type: 'text',\n    text: { body: 'Queue accepted.' }\n  })\n});`,
      python: `requests.post(\n  f"{api_base}/api/v1/public/instances/{instance_id}/messages",\n  headers={"authorization": f"Bearer {instance_token}"},\n  json={"to": "+14155550123", "type": "text", "text": {"body": "Webhook path live."}},\n)`,
    }),
    [],
  );

  if (checkingSession) {
    return (
      <main className={styles.page}>
        <section className={styles.section}>
          <NoticeBanner title={copy.loading.title} tone="info">
            <p style={{ margin: 0 }}>{copy.loading.body}</p>
          </NoticeBanner>
        </section>
      </main>
    );
  }

  const tabs: { id: MainTab; label: string }[] = [
    { id: 'home', label: copy.tabs.home },
    { id: 'features', label: copy.tabs.features },
    { id: 'developer', label: copy.tabs.developer },
    { id: 'pricing', label: copy.tabs.pricing },
    { id: 'faq', label: copy.tabs.faq },
  ];

  function syncLandingHash(nextTab: MainTab) {
    if (typeof window === 'undefined') {
      return;
    }

    const nextUrl =
      nextTab === 'home'
        ? `${window.location.pathname}${window.location.search}`
        : `${window.location.pathname}${window.location.search}#${nextTab}`;

    window.history.replaceState(window.history.state, '', nextUrl);
  }

  function focusTabButton(nextTab: MainTab) {
    if (typeof document === 'undefined') {
      return;
    }

    document.getElementById(`landing-tab-${nextTab}`)?.focus();
  }

  function scrollToTabContent() {
    tabContentRef.current?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  function handleTabSelect(nextTab: MainTab) {
    setActiveMainTab(nextTab);
    syncLandingHash(nextTab);
    scrollToTabContent();
  }

  function handleTabKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    currentTab: MainTab,
  ) {
    const currentIndex = landingTabOrder.indexOf(currentTab);
    if (currentIndex === -1) {
      return;
    }

    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % landingTabOrder.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex =
        (currentIndex - 1 + landingTabOrder.length) % landingTabOrder.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = landingTabOrder.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = landingTabOrder[nextIndex];
    if (!nextTab) {
      return;
    }
    handleTabSelect(nextTab);
    focusTabButton(nextTab);
  }

  return (
    <main
      className={`${styles.page} ${locale === 'ar' ? styles.pageArabic : ''}`}
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
    >
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.brandCluster}>
            <Link href="/" className={styles.brandLockup}>
              <span className={styles.logoStage}>
                <span className={styles.logoGlow} aria-hidden="true" />
                <CustomerBrandMark
                  alt={copy.topbar.brandAlt}
                  width={80}
                  height={80}
                  className={styles.logoImg}
                />
              </span>
              <span className={styles.brandCopy}>
                <span className={styles.brandTitle}>Elite Message</span>
              </span>
            </Link>
          </div>
          <nav className={styles.tabNavShell} aria-label={copy.topbar.navLabel}>
            <div
              className={styles.tabNav}
              role="tablist"
              aria-orientation="horizontal"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`landing-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeMainTab === tab.id}
                  aria-controls={`landing-panel-${tab.id}`}
                  tabIndex={activeMainTab === tab.id ? 0 : -1}
                  className={`${styles.mainTab} ${activeMainTab === tab.id ? styles.mainTabActive : ''}`}
                  onClick={() => handleTabSelect(tab.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
          <div className={styles.actions}>
            {showDashboardAction && (
              <Link
                href="/dashboard"
                className={`${styles.actionLink} ${styles.dashboardLink}`}
              >
                {copy.topbar.dashboard}
              </Link>
            )}
            <button
              type="button"
              className={`${styles.actionLink} ${styles.localeLink}`}
              aria-label={copy.topbar.localeToggleAria}
              onClick={toggleLocale}
            >
              {locale === 'ar' ? 'EN' : 'AR'}
            </button>
            <Link
              href="/signin"
              className={`${styles.actionLink} ${styles.signinLink}`}
            >
              {copy.topbar.signIn}
            </Link>
            <Link
              href="/signup"
              className={`${styles.actionLink} ${styles.signupLink}`}
            >
              {copy.topbar.createAccount}
            </Link>
          </div>
        </div>
      </header>

      {sessionNotice ? (
        <div className={styles.noticeWrap}>
          <NoticeBanner title={copy.session.title} tone="warning">
            <p style={{ margin: 0 }}>{copy.session.staleMessage}</p>
          </NoticeBanner>
        </div>
      ) : null}

      <div ref={tabContentRef} className={styles.tabContentArea}>
        {/* HOME TAB */}
        <div
          id="landing-panel-home"
          role="tabpanel"
          aria-labelledby="landing-tab-home"
          hidden={activeMainTab !== 'home'}
          className={`${styles.tabPane} ${activeMainTab === 'home' ? styles.tabPaneActive : ''}`}
        >
          <div className={styles.section}>
            <div className={styles.heroGrid}>
              <span className={styles.eyebrow}>{copy.hero.eyebrow}</span>
              <h1
                className={`${styles.heroTitle} ${locale === 'ar' ? styles.heroTitleArabic : ''}`}
              >
                {copy.hero.titlePrefix} <span>{copy.hero.titleAccent}</span>
              </h1>
              <p className={styles.heroLead}>{copy.hero.lead}</p>
              <div className={styles.heroActions}>
                <Link
                  href="/signup"
                  className={`${styles.heroAction} ${styles.heroActionPrimary}`}
                >
                  {copy.hero.getStarted}
                </Link>
                <Link
                  href="/signin"
                  className={`${styles.heroAction} ${styles.heroActionSecondary}`}
                >
                  {copy.hero.signIn}
                </Link>
              </div>
            </div>

            <div className={styles.homeStage}>
              <div className={styles.homeStory}>
                <div className={styles.homeStoryHeading}>
                  <span className={styles.eyebrow}>{copy.home.eyebrow}</span>
                  <h2 className={styles.homeIntroTitle}>
                    {copy.home.titlePrefix} <span>{copy.home.titleAccent}</span>
                  </h2>
                  <p className={styles.homeIntroLead}>{copy.home.lead}</p>
                </div>

                <div className={styles.homeLanguageGrid}>
                  <article className={styles.homeLanguageCard}>
                    <span className={styles.homeLanguageLabel}>
                      {copy.home.englishLabel}
                    </span>
                    <p>{copy.home.englishBody}</p>
                  </article>
                  <article
                    className={`${styles.homeLanguageCard} ${styles.homeLanguageCardArabic}`}
                  >
                    <span className={styles.homeLanguageLabel}>
                      {copy.home.arabicLabel}
                    </span>
                    <p>{copy.home.arabicBody}</p>
                  </article>
                </div>

                <p className={styles.homePlayfulNote}>
                  {copy.home.playfulNote}
                </p>

                <div className={styles.homeChipRow}>
                  {copy.home.chips.map((chip) => (
                    <span key={chip} className={styles.homeChip}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.homeVisualWrap}>
                <div className={styles.homeVisualGlow} aria-hidden="true" />
                <TiltCard>
                  <LandingHomeIllustration
                    alt={copy.home.illustrationAlt}
                    caption={copy.home.illustrationCaption}
                  />
                </TiltCard>
              </div>
            </div>

            <div className={styles.homeStoryGrid}>
              {copy.home.cards.map((card) => (
                <TiltCard key={card.title}>
                  <article className={`${styles.card} ${styles.homeStoryCard}`}>
                    <span className={styles.homeStoryCardEyebrow}>
                      {card.eyebrow}
                    </span>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </article>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURES TAB */}
        <div
          id="landing-panel-features"
          role="tabpanel"
          aria-labelledby="landing-tab-features"
          hidden={activeMainTab !== 'features'}
          className={`${styles.tabPane} ${activeMainTab === 'features' ? styles.tabPaneActive : ''}`}
        >
          <div className={styles.section}>
            <div className={styles.featuresIntro}>
              <span className={styles.eyebrow}>{copy.features.eyebrow}</span>
              <h2 className={styles.featuresTitle}>{copy.features.title}</h2>
              <p className={styles.featuresLead}>{copy.features.lead}</p>
            </div>

            <div className={styles.featureGrid}>
              {copy.features.cards.map((card, index) => (
                <SmoothRevealCard key={card.title} delayMs={index * 90}>
                  <article
                    className={`${styles.card} ${styles.featureCard} ${styles.cardSoftMotion}`}
                  >
                    <LandingFeatureIllustration
                      illustration={card.illustration}
                      alt={card.illustrationAlt}
                      caption={card.caption}
                      badgeLabel={card.badgeLabel}
                    />
                    <div className={styles.featureCardBody}>
                      <span className={styles.featureCardEyebrow}>
                        {card.eyebrow}
                      </span>
                      <h3>{card.title}</h3>
                      <p>{card.body}</p>
                      <ul className={styles.featurePointList}>
                        {card.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </SmoothRevealCard>
              ))}
            </div>
          </div>
        </div>

        {/* DEVELOPER TAB */}
        <div
          id="landing-panel-developer"
          role="tabpanel"
          aria-labelledby="landing-tab-developer"
          hidden={activeMainTab !== 'developer'}
          className={`${styles.tabPane} ${activeMainTab === 'developer' ? styles.tabPaneActive : ''}`}
        >
          <div className={styles.section}>
            <div className={styles.developerIntro}>
              <span className={styles.eyebrow}>{copy.developer.eyebrow}</span>
              <h2 className={styles.developerTitle}>{copy.developer.title}</h2>
              <p className={styles.developerLead}>{copy.developer.body}</p>
            </div>

            <div className={styles.developerGrid}>
              {copy.developer.cards.map((card, index) => (
                <SmoothRevealCard key={card.title} delayMs={index * 90}>
                  <article
                    className={`${styles.card} ${styles.developerCard} ${styles.cardSoftMotion}`}
                  >
                    <LandingDeveloperIllustration
                      illustration={card.illustration}
                      alt={card.illustrationAlt}
                      caption={card.caption}
                      badgeLabel={card.badgeLabel}
                    />
                    <div className={styles.developerCardBody}>
                      <span className={styles.developerCardEyebrow}>
                        {card.eyebrow}
                      </span>
                      <h3>{card.title}</h3>
                      <p>{card.body}</p>
                      <ul className={styles.developerPointList}>
                        {card.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </SmoothRevealCard>
              ))}
            </div>

            <div className={styles.developerWorkbench}>
              <SmoothRevealCard delayMs={270}>
                <article
                  className={`${styles.card} ${styles.developerCodeCard} ${styles.cardSoftMotion}`}
                >
                  <span className={styles.eyebrow}>
                    {copy.developer.codeEyebrow}
                  </span>
                  <h3>{copy.developer.codeTitle}</h3>
                  <p>{copy.developer.codeBody}</p>

                  <div className={styles.developerHighlightRow}>
                    {copy.developer.codeHighlights.map((highlight) => (
                      <span
                        key={highlight}
                        className={styles.developerHighlightChip}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className={styles.developerCodeTabs}>
                    {(
                      [
                        ['curl', copy.developer.tabs.curl],
                        ['node', copy.developer.tabs.node],
                        ['python', copy.developer.tabs.python],
                      ] as const
                    ).map(([tab, label]) => (
                      <button
                        key={tab}
                        type="button"
                        className={`${styles.mainTab} ${activeCodeTab === tab ? styles.mainTabActive : ''} ${styles.developerCodeTab}`}
                        onClick={() => setActiveCodeTab(tab)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <pre className={styles.developerCodeBlock}>
                    <code>{codeSamples[activeCodeTab]}</code>
                  </pre>
                </article>
              </SmoothRevealCard>

              <SmoothRevealCard delayMs={360}>
                <article
                  className={`${styles.card} ${styles.developerGuideCard} ${styles.cardSoftMotion}`}
                >
                  <span className={styles.eyebrow}>
                    {copy.developer.checklistEyebrow}
                  </span>
                  <h3>{copy.developer.checklistTitle}</h3>
                  <p>{copy.developer.checklistBody}</p>
                  <ul className={styles.developerChecklist}>
                    {copy.developer.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </SmoothRevealCard>
            </div>
          </div>
        </div>

        {/* PRICING TAB */}
        <div
          id="landing-panel-pricing"
          role="tabpanel"
          aria-labelledby="landing-tab-pricing"
          hidden={activeMainTab !== 'pricing'}
          className={`${styles.tabPane} ${activeMainTab === 'pricing' ? styles.tabPaneActive : ''}`}
        >
          <div className={styles.pricingIntro}>
            <span className={styles.eyebrow}>{copy.pricing.eyebrow}</span>
            <h2 className={styles.pricingTitle}>{copy.pricing.title}</h2>
            <p className={styles.pricingLead}>{copy.pricing.lead}</p>
          </div>

          <div className={styles.pricingGrid}>
            {copy.pricing.plans.map((plan, index) => (
              <SmoothRevealCard key={plan.title} delayMs={120 + index * 110}>
                <article
                  className={[
                    styles.card,
                    styles.pricingPlanCard,
                    styles.cardSoftMotion,
                    plan.featuredLabel ? styles.pricingPlanFeatured : '',
                  ].join(' ')}
                >
                  <div className={styles.pricingPlanHeader}>
                    <span className={styles.pricingPlanEyebrow}>
                      {plan.eyebrow}
                    </span>
                    {plan.featuredLabel ? (
                      <span className={styles.pricingFeaturedBadge}>
                        {plan.featuredLabel}
                      </span>
                    ) : null}
                  </div>

                  <div className={styles.pricingPlanCopy}>
                    <h3>{plan.title}</h3>
                    <p>{plan.body}</p>
                  </div>

                  <div className={styles.pricingPriceBlock}>
                    <div className={styles.pricingPriceLine}>
                      {typeof plan.priceAmount === 'number' ? (
                        <>
                          {plan.pricePrefix ? (
                            <span className={styles.pricingCurrency}>
                              {plan.pricePrefix}
                            </span>
                          ) : null}
                          <span className={styles.pricingAmount}>
                            <AnimatedCounter
                              end={plan.priceAmount}
                              duration={1800}
                            />
                          </span>
                        </>
                      ) : (
                        <span className={styles.pricingCustomValue}>
                          {plan.priceText}
                        </span>
                      )}
                    </div>
                    <span className={styles.pricingPeriod}>
                      {plan.priceSuffix}
                    </span>
                    <p className={styles.pricingPriceNote}>{plan.priceNote}</p>
                  </div>

                  <LandingPricingIllustration
                    illustration={plan.illustration}
                    alt={plan.illustrationAlt}
                    caption={plan.caption}
                    badgeLabel={plan.badgeLabel}
                  />

                  <ul className={styles.pricingFeatureList}>
                    {plan.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              </SmoothRevealCard>
            ))}
          </div>

          <SmoothRevealCard delayMs={460}>
            <article
              className={`${styles.card} ${styles.pricingAssurance} ${styles.cardSoftMotion}`}
            >
              <div className={styles.pricingAssuranceCopy}>
                <span className={styles.eyebrow}>
                  {copy.pricing.assuranceEyebrow}
                </span>
                <h3>{copy.pricing.assuranceTitle}</h3>
                <p>{copy.pricing.assuranceBody}</p>
              </div>

              <div className={styles.pricingAssuranceRail}>
                <ul className={styles.pricingAssuranceList}>
                  {copy.pricing.assurancePoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className={styles.pricingFootnote}>
                  {copy.pricing.footnote}
                </p>
              </div>
            </article>
          </SmoothRevealCard>
        </div>

        {/* FAQ TAB */}
        <div
          id="landing-panel-faq"
          role="tabpanel"
          aria-labelledby="landing-tab-faq"
          hidden={activeMainTab !== 'faq'}
          className={`${styles.tabPane} ${activeMainTab === 'faq' ? styles.tabPaneActive : ''}`}
        >
          <div className={styles.grid2}>
            {copy.faq.map((item, i) => (
              <TiltCard key={i}>
                <article className={styles.card}>
                  <h4
                    style={{
                      color: 'var(--brand-teal)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {item.question}
                  </h4>
                  <p>{item.answer}</p>
                </article>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>

      <footer className={styles.footer}>{copy.footer}</footer>
    </main>
  );
}

export function redirectToDashboard() {
  if (
    typeof window !== 'undefined' &&
    typeof (window as Window & { __eliteRedirectHook?: () => void })
      .__eliteRedirectHook === 'function'
  ) {
    (
      window as Window & { __eliteRedirectHook?: () => void }
    ).__eliteRedirectHook?.();
    return;
  }
  window.location.replace('/dashboard');
}
