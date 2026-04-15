import { useId } from 'react';
import type { ReactNode } from 'react';
import type { LandingDeveloperIllustrationId } from '../lib/landing-content';
import styles from '../landing.module.css';

type LandingDeveloperIllustrationProps = {
  illustration: LandingDeveloperIllustrationId;
  alt: string;
  caption: string;
  badgeLabel: string;
  className?: string;
};

type DeveloperFigureProps = {
  alt: string;
  caption: string;
  badgeLabel: string;
  illustration: LandingDeveloperIllustrationId;
  className?: string;
  children: ReactNode;
};

function DeveloperFigure({
  alt,
  caption,
  badgeLabel,
  illustration,
  className = '',
  children,
}: DeveloperFigureProps) {
  return (
    <figure
      className={`${styles.developerIllustrationFrame} ${className}`.trim()}
      data-illustration={illustration}
    >
      <svg
        className={styles.developerIllustrationSvg}
        viewBox="0 0 560 360"
        role="img"
        aria-label={alt}
        focusable="false"
      >
        {children}
        <g>
          <rect
            x="206"
            y="54"
            width="148"
            height="24"
            rx="12"
            fill="rgba(255,255,255,0.8)"
            stroke="rgba(12,70,65,0.08)"
          />
          <text
            x="280"
            y="70"
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill="#0a5f53"
          >
            {badgeLabel}
          </text>
        </g>
      </svg>
      <figcaption className={styles.developerIllustrationCaption}>
        {caption}
      </figcaption>
    </figure>
  );
}

function CredentialsScene({
  alt,
  caption,
  badgeLabel,
  className,
}: Omit<LandingDeveloperIllustrationProps, 'illustration'>) {
  const id = useId().replace(/:/g, '');
  const background = `${id}-credentials-background`;
  const panel = `${id}-credentials-panel`;
  const card = `${id}-credentials-card`;

  return (
    <DeveloperFigure
      alt={alt}
      caption={caption}
      badgeLabel={badgeLabel}
      illustration="credentials"
      className={className}
    >
      <defs>
        <linearGradient
          id={background}
          x1="36"
          y1="28"
          x2="522"
          y2="330"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fbfffe" />
          <stop offset="0.54" stopColor="#eef8f5" />
          <stop offset="1" stopColor="#f8f0de" />
        </linearGradient>
        <linearGradient
          id={panel}
          x1="92"
          y1="76"
          x2="470"
          y2="276"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ecf7f4" />
        </linearGradient>
        <linearGradient
          id={card}
          x1="164"
          y1="100"
          x2="360"
          y2="288"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0f766e" />
          <stop offset="0.6" stopColor="#0a5b53" />
          <stop offset="1" stopColor="#083a35" />
        </linearGradient>
      </defs>

      <rect
        x="26"
        y="24"
        width="508"
        height="312"
        rx="34"
        fill={`url(#${background})`}
      />
      <circle
        className={styles.featureIllustrationOrbA}
        cx="106"
        cy="90"
        r="84"
        fill="rgba(115, 239, 214, 0.34)"
      />
      <circle
        className={styles.featureIllustrationOrbB}
        cx="450"
        cy="90"
        r="88"
        fill="rgba(215,177,106,0.18)"
      />

      <g className={styles.featureIllustrationFloatSlow}>
        <rect
          x="90"
          y="82"
          width="298"
          height="208"
          rx="28"
          fill={`url(#${panel})`}
          stroke="rgba(12,70,65,0.1)"
        />
        <rect
          x="116"
          y="108"
          width="194"
          height="154"
          rx="24"
          fill={`url(#${card})`}
        />
        <rect
          x="138"
          y="130"
          width="76"
          height="16"
          rx="8"
          fill="rgba(255,255,255,0.18)"
        />
        <rect
          x="138"
          y="158"
          width="118"
          height="10"
          rx="5"
          fill="rgba(255,255,255,0.2)"
        />
        <rect
          x="138"
          y="180"
          width="96"
          height="10"
          rx="5"
          fill="rgba(255,255,255,0.2)"
        />
        <rect x="138" y="214" width="94" height="22" rx="11" fill="#d7b16a" />
        <rect x="242" y="214" width="44" height="22" rx="11" fill="#f1faf8" />
      </g>

      <g className={styles.featureIllustrationBob}>
        <rect
          x="332"
          y="110"
          width="120"
          height="88"
          rx="22"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.1)"
        />
        <circle cx="362" cy="138" r="14" fill="#0f766e" />
        <path
          d="M382 138H424"
          stroke="#d3e6e3"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M350 170H428"
          stroke="#d3e6e3"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationPulse}>
        <circle
          cx="420"
          cy="240"
          r="34"
          fill="#fff8ea"
          stroke="rgba(182,146,77,0.2)"
        />
        <path
          d="M404 236L422 218C428 212 438 212 444 218L448 222C454 228 454 238 448 244L430 262C424 268 414 268 408 262L404 258C398 252 398 242 404 236Z"
          fill="#b6924d"
        />
        <circle cx="436" cy="226" r="7" fill="#fff8ea" />
      </g>

      <g className={styles.featureIllustrationFloatFast}>
        <rect x="332" y="212" width="96" height="38" rx="19" fill="#0f766e" />
        <circle cx="354" cy="231" r="7" fill="#fffdf8" />
        <path
          d="M370 231H404"
          stroke="#fffdf8"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationSpark}>
        <path
          d="M126 62L132 76L146 82L132 88L126 102L120 88L106 82L120 76L126 62Z"
          fill="#d7b16a"
        />
        <path
          d="M462 246L468 260L482 266L468 272L462 286L456 272L442 266L456 260L462 246Z"
          fill="#0f766e"
        />
      </g>
    </DeveloperFigure>
  );
}

function RequestScene({
  alt,
  caption,
  badgeLabel,
  className,
}: Omit<LandingDeveloperIllustrationProps, 'illustration'>) {
  const id = useId().replace(/:/g, '');
  const background = `${id}-request-background`;
  const terminal = `${id}-request-terminal`;

  return (
    <DeveloperFigure
      alt={alt}
      caption={caption}
      badgeLabel={badgeLabel}
      illustration="request"
      className={className}
    >
      <defs>
        <linearGradient
          id={background}
          x1="36"
          y1="24"
          x2="520"
          y2="332"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fbfffe" />
          <stop offset="0.54" stopColor="#eef9f6" />
          <stop offset="1" stopColor="#f8f1de" />
        </linearGradient>
        <linearGradient
          id={terminal}
          x1="310"
          y1="92"
          x2="486"
          y2="250"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#102826" />
          <stop offset="1" stopColor="#0a403b" />
        </linearGradient>
      </defs>

      <rect
        x="26"
        y="24"
        width="508"
        height="312"
        rx="34"
        fill={`url(#${background})`}
      />
      <circle
        className={styles.featureIllustrationOrbA}
        cx="104"
        cy="94"
        r="84"
        fill="rgba(115, 239, 214, 0.34)"
      />
      <circle
        className={styles.featureIllustrationOrbB}
        cx="458"
        cy="88"
        r="88"
        fill="rgba(215,177,106,0.18)"
      />

      <g className={styles.featureIllustrationFloatSlow}>
        <rect
          x="76"
          y="110"
          width="164"
          height="92"
          rx="24"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.1)"
        />
        <rect x="96" y="134" width="108" height="16" rx="8" fill="#0f766e" />
        <path
          d="M96 164H212"
          stroke="#d3e6e3"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M96 186H182"
          stroke="#d3e6e3"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationFloatFast}>
        <rect
          x="308"
          y="96"
          width="176"
          height="132"
          rx="28"
          fill={`url(#${terminal})`}
        />
        <circle cx="334" cy="118" r="6" fill="#d7b16a" />
        <circle cx="352" cy="118" r="6" fill="#0f766e" />
        <circle cx="370" cy="118" r="6" fill="#9cd8cf" />
        <path
          d="M336 146H444"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M336 172H420"
          stroke="#20c6b0"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M336 198H392"
          stroke="#d7b16a"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationBob}>
        <path
          d="M236 190L292 168L330 184L294 202L250 202Z"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.08)"
        />
        <path d="M292 168L352 178L300 194Z" fill="#d7b16a" />
        <path d="M250 202L232 220L278 214Z" fill="#0f766e" />
        <path
          d="M274 180L286 186L274 192"
          stroke="#0f766e"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      <g className={styles.featureIllustrationPulse}>
        <path
          d="M216 186C240 168 266 160 298 164"
          fill="none"
          stroke="rgba(15,118,110,0.36)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M302 164C332 168 350 176 366 186"
          fill="none"
          stroke="rgba(182,146,77,0.42)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationSpark}>
        <path
          d="M124 70L130 84L144 90L130 96L124 110L118 96L104 90L118 84L124 70Z"
          fill="#d7b16a"
        />
        <path
          d="M456 242L462 256L476 262L462 268L456 282L450 268L436 262L450 256L456 242Z"
          fill="#0f766e"
        />
      </g>
    </DeveloperFigure>
  );
}

function EventsScene({
  alt,
  caption,
  badgeLabel,
  className,
}: Omit<LandingDeveloperIllustrationProps, 'illustration'>) {
  const id = useId().replace(/:/g, '');
  const background = `${id}-events-background`;
  const panel = `${id}-events-panel`;

  return (
    <DeveloperFigure
      alt={alt}
      caption={caption}
      badgeLabel={badgeLabel}
      illustration="events"
      className={className}
    >
      <defs>
        <linearGradient
          id={background}
          x1="34"
          y1="24"
          x2="522"
          y2="332"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fbfffe" />
          <stop offset="0.54" stopColor="#eef9f6" />
          <stop offset="1" stopColor="#f8f0df" />
        </linearGradient>
        <linearGradient
          id={panel}
          x1="320"
          y1="108"
          x2="468"
          y2="250"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ecf7f4" />
        </linearGradient>
      </defs>

      <rect
        x="26"
        y="24"
        width="508"
        height="312"
        rx="34"
        fill={`url(#${background})`}
      />
      <circle
        className={styles.featureIllustrationOrbA}
        cx="106"
        cy="90"
        r="84"
        fill="rgba(115, 239, 214, 0.34)"
      />
      <circle
        className={styles.featureIllustrationOrbB}
        cx="454"
        cy="88"
        r="88"
        fill="rgba(215,177,106,0.18)"
      />

      <g className={styles.featureIllustrationPulse}>
        <circle cx="202" cy="198" r="54" fill="rgba(15,118,110,0.08)" />
        <circle
          cx="202"
          cy="198"
          r="38"
          fill="none"
          stroke="rgba(15,118,110,0.28)"
          strokeWidth="8"
        />
        <circle
          cx="202"
          cy="198"
          r="22"
          fill="none"
          stroke="rgba(182,146,77,0.46)"
          strokeWidth="8"
        />
        <circle cx="202" cy="198" r="7" fill="#0f766e" />
      </g>

      <g className={styles.featureIllustrationDash}>
        <path
          d="M256 180C298 160 330 154 372 162"
          fill="none"
          stroke="rgba(15,118,110,0.3)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="16 12"
        />
        <path
          d="M256 214C300 228 332 232 382 220"
          fill="none"
          stroke="rgba(182,146,77,0.34)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="16 12"
        />
      </g>

      <g className={styles.featureIllustrationFloatSlow}>
        <rect
          x="320"
          y="112"
          width="146"
          height="114"
          rx="26"
          fill={`url(#${panel})`}
          stroke="rgba(12,70,65,0.1)"
        />
        <circle cx="348" cy="142" r="9" fill="#0f766e" />
        <path
          d="M368 142H432"
          stroke="#d3e6e3"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <circle cx="348" cy="172" r="9" fill="#d7b16a" />
        <path
          d="M368 172H420"
          stroke="#d3e6e3"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <circle cx="348" cy="202" r="9" fill="#0f766e" />
        <path
          d="M368 202H438"
          stroke="#d3e6e3"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationBob}>
        <path
          d="M112 132C112 114 126 100 144 100H166C184 100 198 114 198 132V150H112Z"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.08)"
        />
        <path
          d="M148 164C168 164 184 180 184 200V212H112V200C112 180 128 164 148 164Z"
          fill="#0f766e"
        />
        <path
          d="M146 212V232"
          stroke="#0f766e"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="146" cy="248" r="10" fill="#d7b16a" />
      </g>

      <g className={styles.featureIllustrationSpark}>
        <path
          d="M126 60L132 74L146 80L132 86L126 100L120 86L106 80L120 74L126 60Z"
          fill="#d7b16a"
        />
        <path
          d="M462 248L468 262L482 268L468 274L462 288L456 274L442 268L456 262L462 248Z"
          fill="#0f766e"
        />
      </g>
    </DeveloperFigure>
  );
}

export function LandingDeveloperIllustration({
  illustration,
  alt,
  caption,
  badgeLabel,
  className = '',
}: LandingDeveloperIllustrationProps) {
  if (illustration === 'credentials') {
    return (
      <CredentialsScene
        alt={alt}
        caption={caption}
        badgeLabel={badgeLabel}
        className={className}
      />
    );
  }

  if (illustration === 'request') {
    return (
      <RequestScene
        alt={alt}
        caption={caption}
        badgeLabel={badgeLabel}
        className={className}
      />
    );
  }

  return (
    <EventsScene
      alt={alt}
      caption={caption}
      badgeLabel={badgeLabel}
      className={className}
    />
  );
}
