import { useId } from 'react';
import type { ReactNode } from 'react';
import type { LandingPricingIllustrationId } from '../lib/landing-content';
import styles from '../landing.module.css';

type LandingPricingIllustrationProps = {
  illustration: LandingPricingIllustrationId;
  alt: string;
  caption: string;
  badgeLabel: string;
  className?: string;
};

type PricingFigureProps = {
  alt: string;
  caption: string;
  badgeLabel: string;
  illustration: LandingPricingIllustrationId;
  className?: string;
  children: ReactNode;
};

function PricingFigure({
  alt,
  caption,
  badgeLabel,
  illustration,
  className = '',
  children,
}: PricingFigureProps) {
  return (
    <figure
      className={`${styles.pricingIllustrationFrame} ${className}`.trim()}
      data-illustration={illustration}
    >
      <svg
        className={styles.pricingIllustrationSvg}
        viewBox="0 0 560 360"
        role="img"
        aria-label={alt}
        focusable="false"
      >
        {children}
        <g>
          <rect
            x="194"
            y="50"
            width="172"
            height="24"
            rx="12"
            fill="rgba(255,255,255,0.82)"
            stroke="rgba(12,70,65,0.08)"
          />
          <text
            x="280"
            y="66"
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill="#0a5f53"
          >
            {badgeLabel}
          </text>
        </g>
      </svg>
      <figcaption className={styles.pricingIllustrationCaption}>
        {caption}
      </figcaption>
    </figure>
  );
}

function LaunchScene({
  alt,
  caption,
  badgeLabel,
  className,
}: Omit<LandingPricingIllustrationProps, 'illustration'>) {
  const id = useId().replace(/:/g, '');
  const background = `${id}-launch-background`;
  const desk = `${id}-launch-desk`;
  const courier = `${id}-launch-courier`;

  return (
    <PricingFigure
      alt={alt}
      caption={caption}
      badgeLabel={badgeLabel}
      illustration="launch"
      className={className}
    >
      <defs>
        <linearGradient
          id={background}
          x1="34"
          y1="24"
          x2="520"
          y2="332"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fcfffe" />
          <stop offset="0.56" stopColor="#eef8f5" />
          <stop offset="1" stopColor="#f8f0df" />
        </linearGradient>
        <linearGradient
          id={desk}
          x1="96"
          y1="106"
          x2="454"
          y2="274"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#edf8f5" />
        </linearGradient>
        <linearGradient
          id={courier}
          x1="224"
          y1="142"
          x2="330"
          y2="258"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0f766e" />
          <stop offset="0.56" stopColor="#0a5a52" />
          <stop offset="1" stopColor="#083934" />
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
        cx="98"
        cy="92"
        r="82"
        fill="rgba(115, 239, 214, 0.32)"
      />
      <circle
        className={styles.featureIllustrationOrbB}
        cx="452"
        cy="88"
        r="88"
        fill="rgba(215,177,106,0.18)"
      />

      <g className={styles.featureIllustrationFloatSlow}>
        <rect
          x="86"
          y="92"
          width="388"
          height="198"
          rx="28"
          fill={`url(#${desk})`}
          stroke="rgba(12,70,65,0.1)"
        />
        <rect
          x="110"
          y="118"
          width="146"
          height="74"
          rx="22"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.08)"
        />
        <rect x="126" y="134" width="54" height="16" rx="8" fill="#0f766e" />
        <path
          d="M126 162H224"
          stroke="#d3e6e3"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M126 182H204"
          stroke="#d3e6e3"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationBob}>
        <ellipse cx="278" cy="248" rx="94" ry="22" fill="rgba(12,70,65,0.08)" />
        <circle cx="278" cy="146" r="34" fill="#f6d5b4" />
        <path
          d="M244 144C250 118 270 106 298 112C314 116 322 128 322 144C300 138 282 140 244 144Z"
          fill="#0b564f"
        />
        <path
          d="M236 194C236 164 256 146 282 146C308 146 328 164 328 194V228H236Z"
          fill={`url(#${courier})`}
        />
        <rect
          x="258"
          y="204"
          width="44"
          height="12"
          rx="6"
          fill="rgba(255,255,255,0.18)"
        />
        <circle cx="226" cy="194" r="11" fill="#f6d5b4" />
        <circle cx="338" cy="194" r="11" fill="#f6d5b4" />
      </g>

      <g className={styles.featureIllustrationFloatFast}>
        <path
          d="M312 162L388 138L426 160L356 188Z"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.08)"
        />
        <path d="M386 140L446 110L438 170Z" fill="#d7b16a" />
        <path
          d="M352 174L364 180L352 186"
          stroke="#0f766e"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      <g className={styles.featureIllustrationPulse}>
        <rect x="348" y="212" width="104" height="44" rx="22" fill="#0f766e" />
        <circle cx="372" cy="234" r="7" fill="#fffdf8" />
        <path
          d="M388 234H430"
          stroke="#fffdf8"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationSpark}>
        <path
          d="M124 60L130 74L144 80L130 86L124 100L118 86L104 80L118 74L124 60Z"
          fill="#d7b16a"
        />
        <path
          d="M458 246L464 260L478 266L464 272L458 286L452 272L438 266L452 260L458 246Z"
          fill="#0f766e"
        />
      </g>
    </PricingFigure>
  );
}

function ScaleScene({
  alt,
  caption,
  badgeLabel,
  className,
}: Omit<LandingPricingIllustrationProps, 'illustration'>) {
  const id = useId().replace(/:/g, '');
  const background = `${id}-scale-background`;
  const panel = `${id}-scale-panel`;
  const screen = `${id}-scale-screen`;

  return (
    <PricingFigure
      alt={alt}
      caption={caption}
      badgeLabel={badgeLabel}
      illustration="scale"
      className={className}
    >
      <defs>
        <linearGradient
          id={background}
          x1="34"
          y1="26"
          x2="522"
          y2="334"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fcfffe" />
          <stop offset="0.56" stopColor="#eef9f6" />
          <stop offset="1" stopColor="#f7efde" />
        </linearGradient>
        <linearGradient
          id={panel}
          x1="88"
          y1="90"
          x2="470"
          y2="278"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ecf7f4" />
        </linearGradient>
        <linearGradient
          id={screen}
          x1="192"
          y1="126"
          x2="378"
          y2="272"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0f766e" />
          <stop offset="0.56" stopColor="#0a5a52" />
          <stop offset="1" stopColor="#083934" />
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
        cy="92"
        r="84"
        fill="rgba(115, 239, 214, 0.34)"
      />
      <circle
        className={styles.featureIllustrationOrbB}
        cx="448"
        cy="88"
        r="88"
        fill="rgba(215,177,106,0.18)"
      />

      <g className={styles.featureIllustrationFloatSlow}>
        <rect
          x="82"
          y="96"
          width="396"
          height="186"
          rx="30"
          fill={`url(#${panel})`}
          stroke="rgba(12,70,65,0.1)"
        />
        <rect
          x="108"
          y="120"
          width="120"
          height="68"
          rx="22"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.08)"
        />
        <rect
          x="330"
          y="118"
          width="118"
          height="68"
          rx="22"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.08)"
        />
        <rect x="126" y="138" width="48" height="14" rx="7" fill="#d7b16a" />
        <path
          d="M126 162H206"
          stroke="#d3e6e3"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <rect x="348" y="136" width="46" height="14" rx="7" fill="#0f766e" />
        <path
          d="M348 162H426"
          stroke="#d3e6e3"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationPulse}>
        <path
          d="M130 228H430"
          stroke="rgba(12,70,65,0.18)"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <rect x="142" y="206" width="64" height="44" rx="18" fill="#0f766e" />
        <rect x="246" y="206" width="64" height="44" rx="18" fill="#d7b16a" />
        <rect x="350" y="206" width="64" height="44" rx="18" fill="#0f766e" />
      </g>

      <g className={styles.featureIllustrationBob}>
        <rect
          x="214"
          y="110"
          width="132"
          height="96"
          rx="28"
          fill={`url(#${screen})`}
        />
        <circle cx="248" cy="140" r="9" fill="#d7b16a" />
        <path
          d="M268 140H316"
          stroke="rgba(255,255,255,0.24)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M238 170H314"
          stroke="#20c6b0"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M238 192H290"
          stroke="#d7b16a"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationFloatFast}>
        <circle
          cx="278"
          cy="262"
          r="26"
          fill="#fff8ea"
          stroke="rgba(182,146,77,0.22)"
        />
        <path
          d="M262 260H294"
          stroke="#0f766e"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M278 244V276"
          stroke="#0f766e"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationSpark}>
        <path
          d="M116 66L122 80L136 86L122 92L116 106L110 92L96 86L110 80L116 66Z"
          fill="#d7b16a"
        />
        <path
          d="M454 242L460 256L474 262L460 268L454 282L448 268L434 262L448 256L454 242Z"
          fill="#0f766e"
        />
      </g>
    </PricingFigure>
  );
}

function CommandScene({
  alt,
  caption,
  badgeLabel,
  className,
}: Omit<LandingPricingIllustrationProps, 'illustration'>) {
  const id = useId().replace(/:/g, '');
  const background = `${id}-command-background`;
  const screen = `${id}-command-screen`;

  return (
    <PricingFigure
      alt={alt}
      caption={caption}
      badgeLabel={badgeLabel}
      illustration="command"
      className={className}
    >
      <defs>
        <linearGradient
          id={background}
          x1="32"
          y1="22"
          x2="524"
          y2="336"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fbfffe" />
          <stop offset="0.56" stopColor="#eef9f6" />
          <stop offset="1" stopColor="#f8f0df" />
        </linearGradient>
        <linearGradient
          id={screen}
          x1="126"
          y1="110"
          x2="432"
          y2="270"
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
        cx="104"
        cy="92"
        r="84"
        fill="rgba(115, 239, 214, 0.34)"
      />
      <circle
        className={styles.featureIllustrationOrbB}
        cx="452"
        cy="88"
        r="88"
        fill="rgba(215,177,106,0.18)"
      />

      <g className={styles.featureIllustrationFloatSlow}>
        <rect
          x="96"
          y="108"
          width="368"
          height="156"
          rx="30"
          fill={`url(#${screen})`}
          stroke="rgba(12,70,65,0.1)"
        />
        <rect
          x="120"
          y="132"
          width="126"
          height="108"
          rx="24"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.08)"
        />
        <rect
          x="316"
          y="132"
          width="122"
          height="108"
          rx="24"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.08)"
        />
      </g>

      <g className={styles.featureIllustrationPulse}>
        <circle cx="280" cy="188" r="50" fill="rgba(15,118,110,0.08)" />
        <circle
          cx="280"
          cy="188"
          r="34"
          fill="none"
          stroke="rgba(15,118,110,0.26)"
          strokeWidth="8"
        />
        <circle
          cx="280"
          cy="188"
          r="18"
          fill="none"
          stroke="rgba(182,146,77,0.48)"
          strokeWidth="8"
        />
        <circle cx="280" cy="188" r="6" fill="#0f766e" />
      </g>

      <g className={styles.featureIllustrationDash}>
        <path
          d="M244 176C218 164 196 160 172 164"
          fill="none"
          stroke="rgba(15,118,110,0.3)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="14 10"
        />
        <path
          d="M314 176C340 162 362 158 394 166"
          fill="none"
          stroke="rgba(182,146,77,0.36)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="14 10"
        />
        <path
          d="M280 138V102"
          stroke="rgba(12,70,65,0.16)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="14 10"
        />
      </g>

      <g className={styles.featureIllustrationBob}>
        <path
          d="M154 158L170 142C176 136 186 136 192 142L202 152C208 158 208 168 202 174L186 190C180 196 170 196 164 190L154 180C148 174 148 164 154 158Z"
          fill="#0f766e"
        />
        <path
          d="M171 167L178 174L190 160"
          stroke="#fffdf8"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="174" cy="210" r="10" fill="#d7b16a" />
        <path
          d="M334 160H404"
          stroke="#d3e6e3"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M334 188H392"
          stroke="#d3e6e3"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M334 216H418"
          stroke="#20c6b0"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationFloatFast}>
        <rect x="226" y="244" width="108" height="34" rx="17" fill="#0f766e" />
        <circle cx="248" cy="261" r="6" fill="#fffdf8" />
        <path
          d="M264 261H304"
          stroke="#fffdf8"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationSpark}>
        <path
          d="M122 64L128 78L142 84L128 90L122 104L116 90L102 84L116 78L122 64Z"
          fill="#d7b16a"
        />
        <path
          d="M458 244L464 258L478 264L464 270L458 284L452 270L438 264L452 258L458 244Z"
          fill="#0f766e"
        />
      </g>
    </PricingFigure>
  );
}

export function LandingPricingIllustration({
  illustration,
  alt,
  caption,
  badgeLabel,
  className = '',
}: LandingPricingIllustrationProps) {
  if (illustration === 'launch') {
    return (
      <LaunchScene
        alt={alt}
        caption={caption}
        badgeLabel={badgeLabel}
        className={className}
      />
    );
  }

  if (illustration === 'scale') {
    return (
      <ScaleScene
        alt={alt}
        caption={caption}
        badgeLabel={badgeLabel}
        className={className}
      />
    );
  }

  return (
    <CommandScene
      alt={alt}
      caption={caption}
      badgeLabel={badgeLabel}
      className={className}
    />
  );
}
