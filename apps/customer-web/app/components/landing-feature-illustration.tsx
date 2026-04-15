import { useId } from 'react';
import type { ReactNode } from 'react';
import type { LandingFeatureIllustrationId } from '../lib/landing-content';
import styles from '../landing.module.css';

type LandingFeatureIllustrationProps = {
  illustration: LandingFeatureIllustrationId;
  alt: string;
  caption: string;
  badgeLabel: string;
  className?: string;
};

type FeatureFigureProps = {
  alt: string;
  caption: string;
  illustration: LandingFeatureIllustrationId;
  className?: string;
  children: ReactNode;
};

function FeatureFigure({
  alt,
  caption,
  illustration,
  className = '',
  children,
}: FeatureFigureProps) {
  return (
    <figure
      className={`${styles.featureIllustrationFrame} ${className}`.trim()}
      data-illustration={illustration}
    >
      <svg
        className={styles.featureIllustrationSvg}
        viewBox="0 0 560 360"
        role="img"
        aria-label={alt}
        focusable="false"
      >
        {children}
      </svg>
      <figcaption className={styles.featureIllustrationCaption}>
        {caption}
      </figcaption>
    </figure>
  );
}

function WorkspaceScene({
  alt,
  caption,
  badgeLabel,
  className,
}: Omit<LandingFeatureIllustrationProps, 'illustration'>) {
  const id = useId().replace(/:/g, '');
  const background = `${id}-workspace-background`;
  const card = `${id}-workspace-card`;
  const glow = `${id}-workspace-glow`;
  const accent = `${id}-workspace-accent`;

  return (
    <FeatureFigure
      alt={alt}
      caption={caption}
      className={className}
      illustration="workspace"
    >
      <defs>
        <linearGradient
          id={background}
          x1="56"
          y1="44"
          x2="504"
          y2="324"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fcfffe" />
          <stop offset="0.58" stopColor="#eef8f5" />
          <stop offset="1" stopColor="#f5efde" />
        </linearGradient>
        <linearGradient
          id={card}
          x1="100"
          y1="88"
          x2="470"
          y2="280"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.96" />
          <stop offset="1" stopColor="#eaf5f3" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#6de3cf" stopOpacity="0.45" />
          <stop offset="1" stopColor="#6de3cf" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={accent}
          x1="230"
          y1="170"
          x2="344"
          y2="264"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0f766e" />
          <stop offset="0.56" stopColor="#0a574f" />
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
        cy="88"
        r="88"
        fill={`url(#${glow})`}
      />
      <circle
        className={styles.featureIllustrationOrbB}
        cx="442"
        cy="82"
        r="96"
        fill="rgba(215,177,106,0.18)"
      />

      <g className={styles.featureIllustrationFloatSlow}>
        <rect
          x="72"
          y="74"
          width="416"
          height="224"
          rx="28"
          fill={`url(#${card})`}
          stroke="rgba(12,70,65,0.1)"
        />
        <rect
          x="100"
          y="220"
          width="358"
          height="40"
          rx="20"
          fill="rgba(11,71,66,0.08)"
        />
        <rect
          x="112"
          y="234"
          width="112"
          height="14"
          rx="7"
          fill="rgba(15,118,110,0.18)"
        />
        <rect
          x="238"
          y="234"
          width="88"
          height="14"
          rx="7"
          fill="rgba(182,146,77,0.2)"
        />
        <rect
          x="340"
          y="234"
          width="92"
          height="14"
          rx="7"
          fill="rgba(15,118,110,0.14)"
        />
      </g>

      <g className={styles.featureIllustrationBob}>
        <ellipse cx="284" cy="228" rx="92" ry="22" fill="rgba(12,70,65,0.08)" />
        <circle cx="280" cy="142" r="34" fill="#f6d5b4" />
        <path
          d="M246 142C252 114 272 102 298 110C314 114 322 126 322 142C304 136 286 138 246 142Z"
          fill="#0c564f"
        />
        <path
          d="M242 190C242 160 262 142 288 142C314 142 334 160 334 190V226H242Z"
          fill={`url(#${accent})`}
        />
        <rect
          x="258"
          y="200"
          width="58"
          height="12"
          rx="6"
          fill="rgba(255,255,255,0.18)"
        />
        <circle cx="232" cy="194" r="12" fill="#f6d5b4" />
        <circle cx="346" cy="194" r="12" fill="#f6d5b4" />
      </g>

      <g className={styles.featureIllustrationFloatFast}>
        <rect
          x="114"
          y="96"
          width="108"
          height="74"
          rx="18"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.08)"
        />
        <rect x="128" y="112" width="52" height="16" rx="8" fill="#0f766e" />
        <rect x="128" y="138" width="66" height="8" rx="4" fill="#d3e6e3" />
        <rect x="128" y="152" width="52" height="8" rx="4" fill="#d3e6e3" />
      </g>

      <g className={styles.featureIllustrationFloatFast}>
        <rect
          x="360"
          y="100"
          width="94"
          height="66"
          rx="18"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.08)"
        />
        <rect x="374" y="116" width="42" height="16" rx="8" fill="#b6924d" />
        <circle cx="388" cy="144" r="7" fill="#0f766e" />
        <circle cx="410" cy="144" r="7" fill="#d7b16a" />
        <circle cx="432" cy="144" r="7" fill="#0f766e" />
      </g>

      <g className={styles.featureIllustrationPulse}>
        <rect
          x="356"
          y="206"
          width="98"
          height="56"
          rx="20"
          fill="#fffdf8"
          stroke="rgba(182,146,77,0.18)"
        />
        <path
          d="M378 224H430"
          stroke="#0a5f53"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M378 242H414"
          stroke="#d7b16a"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="442" cy="230" r="12" fill="rgba(15,118,110,0.14)" />
        <path
          d="M436 230L441 235L449 225"
          stroke="#0f766e"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g className={styles.featureIllustrationSpark}>
        <path
          d="M124 54L130 68L144 74L130 80L124 94L118 80L104 74L118 68L124 54Z"
          fill="#d7b16a"
        />
        <path
          d="M458 252L464 266L478 272L464 278L458 292L452 278L438 272L452 266L458 252Z"
          fill="#0f766e"
        />
      </g>

      <g>
        <rect
          x="170"
          y="66"
          width="136"
          height="24"
          rx="12"
          fill="rgba(255,255,255,0.76)"
          stroke="rgba(12,70,65,0.08)"
        />
        <text
          x="238"
          y="82"
          textAnchor="middle"
          fontSize="12"
          fontWeight="800"
          fill="#0a5f53"
        >
          {badgeLabel}
        </text>
      </g>
    </FeatureFigure>
  );
}

function InstanceScene({
  alt,
  caption,
  badgeLabel,
  className,
}: Omit<LandingFeatureIllustrationProps, 'illustration'>) {
  const id = useId().replace(/:/g, '');
  const background = `${id}-instance-background`;
  const glow = `${id}-instance-glow`;
  const screen = `${id}-instance-screen`;

  return (
    <FeatureFigure
      alt={alt}
      caption={caption}
      className={className}
      illustration="instance"
    >
      <defs>
        <linearGradient
          id={background}
          x1="44"
          y1="38"
          x2="514"
          y2="330"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#f9fffe" />
          <stop offset="0.56" stopColor="#eff9f6" />
          <stop offset="1" stopColor="#f7f1e2" />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#79f1d7" stopOpacity="0.42" />
          <stop offset="1" stopColor="#79f1d7" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={screen}
          x1="190"
          y1="84"
          x2="360"
          y2="274"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0d766c" />
          <stop offset="0.6" stopColor="#0a554e" />
          <stop offset="1" stopColor="#083732" />
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
        cx="118"
        cy="92"
        r="86"
        fill={`url(#${glow})`}
      />
      <circle
        className={styles.featureIllustrationOrbB}
        cx="438"
        cy="88"
        r="88"
        fill="rgba(215,177,106,0.18)"
      />

      <g className={styles.featureIllustrationFloatSlow}>
        <rect
          x="92"
          y="70"
          width="212"
          height="228"
          rx="34"
          fill="#112926"
          opacity="0.12"
        />
        <rect
          x="102"
          y="58"
          width="212"
          height="228"
          rx="34"
          fill="#fffdfa"
          stroke="rgba(12,70,65,0.11)"
        />
        <rect
          x="118"
          y="84"
          width="180"
          height="172"
          rx="24"
          fill={`url(#${screen})`}
        />
        <rect x="152" y="102" width="112" height="112" rx="16" fill="#ffffff" />
        <path d="M176 126H240V190H176Z" fill="#eef5f4" />
        <path d="M176 126H194V144H176Z" fill="#0f766e" />
        <path d="M198 126H216V144H198Z" fill="#d7b16a" />
        <path d="M220 126H240V144H220Z" fill="#0f766e" />
        <path d="M176 148H194V166H176Z" fill="#d7b16a" />
        <path d="M198 148H216V166H198Z" fill="#0f766e" />
        <path d="M220 148H240V166H220Z" fill="#d7b16a" />
        <path d="M176 170H194V190H176Z" fill="#0f766e" />
        <path d="M198 170H216V190H198Z" fill="#d7b16a" />
        <path d="M220 170H240V190H220Z" fill="#0f766e" />
        <circle cx="208" cy="270" r="10" fill="rgba(15,118,110,0.22)" />
      </g>

      <g className={styles.featureIllustrationBob}>
        <circle
          cx="382"
          cy="122"
          r="34"
          fill="#d9fff7"
          stroke="rgba(15,118,110,0.18)"
        />
        <path
          d="M370 118L386 102C391 97 398 97 403 102L410 109C415 114 415 121 410 126L394 142C389 147 382 147 377 142L370 135C365 130 365 123 370 118Z"
          fill="#b6924d"
        />
        <circle cx="400" cy="112" r="7" fill="#fff6da" />
      </g>

      <g className={styles.featureIllustrationPulse}>
        <path
          d="M314 170C348 170 356 140 386 140"
          fill="none"
          stroke="rgba(15,118,110,0.36)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="314" cy="170" r="10" fill="#0f766e" />
        <circle cx="386" cy="140" r="10" fill="#d7b16a" />
      </g>

      <g className={styles.featureIllustrationFloatFast}>
        <rect
          x="344"
          y="178"
          width="122"
          height="88"
          rx="24"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.1)"
        />
        <circle cx="372" cy="204" r="9" fill="#0f766e" />
        <circle cx="398" cy="204" r="9" fill="#d7b16a" />
        <circle cx="424" cy="204" r="9" fill="#0f766e" />
        <path
          d="M368 236L382 250L444 188"
          stroke="#0f766e"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g className={styles.featureIllustrationSpark}>
        <path
          d="M396 66L402 80L416 86L402 92L396 106L390 92L376 86L390 80L396 66Z"
          fill="#0f766e"
        />
        <path
          d="M92 258L98 272L112 278L98 284L92 298L86 284L72 278L86 272L92 258Z"
          fill="#d7b16a"
        />
      </g>

      <g>
        <rect
          x="332"
          y="84"
          width="128"
          height="24"
          rx="12"
          fill="rgba(255,255,255,0.76)"
          stroke="rgba(12,70,65,0.08)"
        />
        <text
          x="396"
          y="100"
          textAnchor="middle"
          fontSize="12"
          fontWeight="800"
          fill="#0a5f53"
        >
          {badgeLabel}
        </text>
      </g>
    </FeatureFigure>
  );
}

function RecoveryScene({
  alt,
  caption,
  badgeLabel,
  className,
}: Omit<LandingFeatureIllustrationProps, 'illustration'>) {
  const id = useId().replace(/:/g, '');
  const background = `${id}-recovery-background`;
  const panel = `${id}-recovery-panel`;
  const glow = `${id}-recovery-glow`;

  return (
    <FeatureFigure
      alt={alt}
      caption={caption}
      className={className}
      illustration="recovery"
    >
      <defs>
        <linearGradient
          id={background}
          x1="34"
          y1="34"
          x2="530"
          y2="326"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#f9fffd" />
          <stop offset="0.54" stopColor="#edf7f4" />
          <stop offset="1" stopColor="#f8f2e2" />
        </linearGradient>
        <linearGradient
          id={panel}
          x1="84"
          y1="74"
          x2="468"
          y2="276"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ecf7f4" />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#77ead2" stopOpacity="0.4" />
          <stop offset="1" stopColor="#77ead2" stopOpacity="0" />
        </radialGradient>
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
        cx="96"
        cy="96"
        r="84"
        fill={`url(#${glow})`}
      />
      <circle
        className={styles.featureIllustrationOrbB}
        cx="456"
        cy="84"
        r="88"
        fill="rgba(215,177,106,0.18)"
      />

      <g className={styles.featureIllustrationFloatSlow}>
        <rect
          x="80"
          y="72"
          width="400"
          height="212"
          rx="30"
          fill={`url(#${panel})`}
          stroke="rgba(12,70,65,0.1)"
        />
        <rect
          x="104"
          y="100"
          width="164"
          height="54"
          rx="18"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.08)"
        />
        <rect x="120" y="116" width="52" height="14" rx="7" fill="#0f766e" />
        <rect x="120" y="138" width="112" height="8" rx="4" fill="#d3e6e3" />
      </g>

      <g className={styles.featureIllustrationDash}>
        <path
          d="M126 216H436"
          stroke="rgba(12,70,65,0.2)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeDasharray="18 14"
        />
      </g>

      <g className={styles.featureIllustrationFloatFast}>
        <rect x="146" y="188" width="52" height="34" rx="14" fill="#0f766e" />
        <rect x="228" y="188" width="52" height="34" rx="14" fill="#d7b16a" />
        <rect x="310" y="188" width="52" height="34" rx="14" fill="#0f766e" />
        <rect x="392" y="188" width="52" height="34" rx="14" fill="#d7b16a" />
      </g>

      <g className={styles.featureIllustrationBob}>
        <circle cx="124" cy="236" r="30" fill="#f7d7b6" />
        <rect x="96" y="266" width="56" height="16" rx="8" fill="#0a5f53" />
        <path
          d="M114 254L140 228"
          stroke="#0a5f53"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M138 214C160 192 204 194 222 216"
          fill="none"
          stroke="#d7b16a"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M212 202L224 216L206 220"
          fill="none"
          stroke="#d7b16a"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g className={styles.featureIllustrationPulse}>
        <rect
          x="316"
          y="98"
          width="128"
          height="62"
          rx="20"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.08)"
        />
        <circle cx="342" cy="122" r="8" fill="#0f766e" />
        <circle cx="342" cy="144" r="8" fill="#d7b16a" />
        <circle cx="342" cy="166" r="8" fill="#0f766e" opacity="0.001" />
        <path
          d="M364 122H412"
          stroke="#d3e6e3"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M364 144H402"
          stroke="#d3e6e3"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationSpark}>
        <path
          d="M466 212L472 226L486 232L472 238L466 252L460 238L446 232L460 226L466 212Z"
          fill="#0f766e"
        />
        <path
          d="M206 70L212 84L226 90L212 96L206 110L200 96L186 90L200 84L206 70Z"
          fill="#d7b16a"
        />
      </g>

      <g>
        <rect
          x="220"
          y="54"
          width="144"
          height="24"
          rx="12"
          fill="rgba(255,255,255,0.76)"
          stroke="rgba(12,70,65,0.08)"
        />
        <text
          x="292"
          y="70"
          textAnchor="middle"
          fontSize="12"
          fontWeight="800"
          fill="#0a5f53"
        >
          {badgeLabel}
        </text>
      </g>
    </FeatureFigure>
  );
}

function DeveloperScene({
  alt,
  caption,
  badgeLabel,
  className,
}: Omit<LandingFeatureIllustrationProps, 'illustration'>) {
  const id = useId().replace(/:/g, '');
  const background = `${id}-developer-background`;
  const bridge = `${id}-developer-bridge`;
  const glow = `${id}-developer-glow`;

  return (
    <FeatureFigure
      alt={alt}
      caption={caption}
      className={className}
      illustration="developer"
    >
      <defs>
        <linearGradient
          id={background}
          x1="40"
          y1="34"
          x2="516"
          y2="322"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fbfffe" />
          <stop offset="0.56" stopColor="#eef8f5" />
          <stop offset="1" stopColor="#f7f0df" />
        </linearGradient>
        <linearGradient
          id={bridge}
          x1="126"
          y1="232"
          x2="424"
          y2="232"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0f766e" />
          <stop offset="1" stopColor="#b6924d" />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7cebd7" stopOpacity="0.42" />
          <stop offset="1" stopColor="#7cebd7" stopOpacity="0" />
        </radialGradient>
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
        cx="112"
        cy="84"
        r="82"
        fill={`url(#${glow})`}
      />
      <circle
        className={styles.featureIllustrationOrbB}
        cx="450"
        cy="86"
        r="86"
        fill="rgba(215,177,106,0.18)"
      />

      <g className={styles.featureIllustrationFloatSlow}>
        <rect
          x="74"
          y="86"
          width="162"
          height="122"
          rx="28"
          fill="#ffffff"
          stroke="rgba(12,70,65,0.1)"
        />
        <rect x="96" y="112" width="54" height="18" rx="9" fill="#0f766e" />
        <rect x="96" y="144" width="104" height="10" rx="5" fill="#d3e6e3" />
        <rect x="96" y="164" width="90" height="10" rx="5" fill="#d3e6e3" />
        <rect x="96" y="184" width="62" height="10" rx="5" fill="#d3e6e3" />
      </g>

      <g className={styles.featureIllustrationFloatFast}>
        <rect x="322" y="86" width="166" height="132" rx="28" fill="#0b2e2b" />
        <rect
          x="340"
          y="110"
          width="86"
          height="10"
          rx="5"
          fill="#1ec0ad"
          opacity="0.9"
        />
        <rect
          x="340"
          y="132"
          width="118"
          height="10"
          rx="5"
          fill="#d7b16a"
          opacity="0.88"
        />
        <rect
          x="340"
          y="154"
          width="96"
          height="10"
          rx="5"
          fill="#1ec0ad"
          opacity="0.82"
        />
        <path
          d="M338 186H472"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="354" cy="98" r="6" fill="#d7b16a" />
        <circle cx="374" cy="98" r="6" fill="#0f766e" />
      </g>

      <g className={styles.featureIllustrationPulse}>
        <path
          d="M138 232C190 206 238 206 280 232C322 258 368 258 422 232"
          fill="none"
          stroke={`url(#${bridge})`}
          strokeWidth="18"
          strokeLinecap="round"
        />
        <circle cx="178" cy="232" r="10" fill="#0f766e" />
        <circle cx="382" cy="232" r="10" fill="#d7b16a" />
      </g>

      <g className={styles.featureIllustrationSpin}>
        <circle
          cx="276"
          cy="158"
          r="24"
          fill="#ffffff"
          stroke="rgba(182,146,77,0.18)"
        />
        <path d="M268 150L286 158L268 166Z" fill="#0f766e" />
      </g>

      <g className={styles.featureIllustrationBob}>
        <path d="M252 244L292 230L320 240L294 254L262 252Z" fill="#0f766e" />
        <path d="M320 240L338 242L322 250Z" fill="#d7b16a" />
        <path
          d="M258 248C270 260 292 262 320 248"
          fill="none"
          stroke="#d7b16a"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      <g className={styles.featureIllustrationSpark}>
        <path
          d="M112 58L118 72L132 78L118 84L112 98L106 84L92 78L106 72L112 58Z"
          fill="#d7b16a"
        />
        <path
          d="M464 244L470 258L484 264L470 270L464 284L458 270L444 264L458 258L464 244Z"
          fill="#0f766e"
        />
      </g>

      <g>
        <rect
          x="206"
          y="56"
          width="152"
          height="24"
          rx="12"
          fill="rgba(255,255,255,0.76)"
          stroke="rgba(12,70,65,0.08)"
        />
        <text
          x="282"
          y="72"
          textAnchor="middle"
          fontSize="12"
          fontWeight="800"
          fill="#0a5f53"
        >
          {badgeLabel}
        </text>
      </g>
    </FeatureFigure>
  );
}

export function LandingFeatureIllustration({
  illustration,
  alt,
  caption,
  badgeLabel,
  className = '',
}: LandingFeatureIllustrationProps) {
  if (illustration === 'workspace') {
    return (
      <WorkspaceScene
        alt={alt}
        caption={caption}
        badgeLabel={badgeLabel}
        className={className}
      />
    );
  }

  if (illustration === 'instance') {
    return (
      <InstanceScene
        alt={alt}
        caption={caption}
        badgeLabel={badgeLabel}
        className={className}
      />
    );
  }

  if (illustration === 'recovery') {
    return (
      <RecoveryScene
        alt={alt}
        caption={caption}
        badgeLabel={badgeLabel}
        className={className}
      />
    );
  }

  return (
    <DeveloperScene
      alt={alt}
      caption={caption}
      badgeLabel={badgeLabel}
      className={className}
    />
  );
}
