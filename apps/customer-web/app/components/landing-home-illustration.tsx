'use client';

import styles from '../landing.module.css';

type LandingHomeIllustrationProps = {
  alt: string;
  caption: string;
  className?: string;
};

export function LandingHomeIllustration({
  alt,
  caption,
  className = '',
}: LandingHomeIllustrationProps) {
  return (
    <figure className={`${styles.homeIllustrationFrame} ${className}`.trim()}>
      <svg
        className={styles.homeIllustrationSvg}
        viewBox="0 0 720 560"
        role="img"
        aria-label={alt}
        focusable="false"
      >
        <defs>
          <linearGradient
            id="homeSceneBg"
            x1="64"
            y1="40"
            x2="660"
            y2="520"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#fbfdfc" />
            <stop offset="0.5" stopColor="#edf7f5" />
            <stop offset="1" stopColor="#f6f1e1" />
          </linearGradient>
          <linearGradient
            id="homePanelBg"
            x1="96"
            y1="110"
            x2="620"
            y2="472"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.72" />
            <stop offset="1" stopColor="#eaf5f3" stopOpacity="0.86" />
          </linearGradient>
          <linearGradient
            id="homeBubbleBg"
            x1="248"
            y1="132"
            x2="506"
            y2="360"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#118078" />
            <stop offset="0.56" stopColor="#0a5f53" />
            <stop offset="1" stopColor="#083731" />
          </linearGradient>
          <linearGradient
            id="homeGoldBg"
            x1="302"
            y1="86"
            x2="414"
            y2="168"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#fff1aa" />
            <stop offset="0.4" stopColor="#d7a84d" />
            <stop offset="1" stopColor="#916009" />
          </linearGradient>
          <linearGradient id="homeCardBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#eef7f5" />
          </linearGradient>
          <radialGradient id="homeGlowTeal" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#79f1d7" stopOpacity="0.46" />
            <stop offset="1" stopColor="#79f1d7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="homeGlowGold" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#d7b16a" stopOpacity="0.28" />
            <stop offset="1" stopColor="#d7b16a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect
          x="34"
          y="28"
          width="652"
          height="504"
          rx="40"
          fill="url(#homeSceneBg)"
        />

        <circle
          className={styles.homeIllustrationGlowTeal}
          cx="128"
          cy="112"
          r="108"
          fill="url(#homeGlowTeal)"
        />
        <circle
          className={styles.homeIllustrationGlowGold}
          cx="592"
          cy="114"
          r="120"
          fill="url(#homeGlowGold)"
        />

        <g className={styles.homeIllustrationPanel}>
          <rect
            x="84"
            y="96"
            width="552"
            height="340"
            rx="34"
            fill="url(#homePanelBg)"
            stroke="rgba(12,70,65,0.12)"
          />

          <g className={styles.homeIllustrationCardLeft}>
            <rect
              x="114"
              y="142"
              width="178"
              height="120"
              rx="24"
              fill="url(#homeCardBg)"
              stroke="rgba(12,70,65,0.12)"
            />
            <rect
              x="132"
              y="162"
              width="56"
              height="18"
              rx="9"
              fill="#0f766e"
            />
            <text
              x="160"
              y="176"
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill="#f6fffd"
              letterSpacing="1"
            >
              API
            </text>
            <rect
              x="132"
              y="192"
              width="104"
              height="10"
              rx="5"
              fill="#d7e9e6"
            />
            <rect
              x="132"
              y="214"
              width="132"
              height="10"
              rx="5"
              fill="#d7e9e6"
            />
            <rect
              x="132"
              y="236"
              width="90"
              height="10"
              rx="5"
              fill="#d7e9e6"
            />
          </g>

          <g className={styles.homeIllustrationCardRight}>
            <rect
              x="426"
              y="132"
              width="180"
              height="120"
              rx="24"
              fill="url(#homeCardBg)"
              stroke="rgba(12,70,65,0.12)"
            />
            <rect
              x="444"
              y="152"
              width="78"
              height="18"
              rx="9"
              fill="#b6924d"
            />
            <text
              x="483"
              y="166"
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill="#fffaf1"
              letterSpacing="1"
            >
              QUEUE
            </text>
            <circle
              cx="454"
              cy="198"
              r="6"
              fill="#0f766e"
              className={styles.homeIllustrationSparkle}
            />
            <circle
              cx="478"
              cy="198"
              r="6"
              fill="#c79d55"
              className={styles.homeIllustrationSparkle}
            />
            <circle
              cx="502"
              cy="198"
              r="6"
              fill="#0f766e"
              className={styles.homeIllustrationSparkle}
            />
            <rect
              x="444"
              y="220"
              width="122"
              height="10"
              rx="5"
              fill="#d7e9e6"
            />
            <rect
              x="444"
              y="242"
              width="86"
              height="10"
              rx="5"
              fill="#d7e9e6"
            />
          </g>

          <g className={styles.homeIllustrationCardBottom}>
            <rect
              x="472"
              y="294"
              width="130"
              height="98"
              rx="22"
              fill="url(#homeCardBg)"
              stroke="rgba(12,70,65,0.12)"
            />
            <rect
              x="492"
              y="314"
              width="42"
              height="18"
              rx="9"
              fill="#0a5f53"
            />
            <text
              x="513"
              y="328"
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill="#f6fffd"
              letterSpacing="1"
            >
              AR
            </text>
            <rect
              x="540"
              y="314"
              width="40"
              height="18"
              rx="9"
              fill="#d7b16a"
            />
            <text
              x="560"
              y="328"
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill="#fffaf1"
              letterSpacing="1"
            >
              EN
            </text>
            <rect
              x="492"
              y="348"
              width="82"
              height="10"
              rx="5"
              fill="#d7e9e6"
            />
            <rect
              x="492"
              y="370"
              width="56"
              height="10"
              rx="5"
              fill="#d7e9e6"
            />
          </g>

          <path
            className={styles.homeIllustrationTrail}
            d="M145 300C214 314 281 318 345 296C410 274 474 250 553 258"
            fill="none"
            stroke="rgba(15,118,110,0.5)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="12 14"
          />

          <g className={styles.homeIllustrationCourier}>
            <path
              d="M250 156C250 132 269 114 293 114H425C449 114 468 132 468 156V292C468 316 449 334 425 334H371L327 384V334H293C269 334 250 316 250 292V156Z"
              fill="url(#homeBubbleBg)"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="2"
            />
            <path
              d="M311 112L326 86L340 112L353 88L368 112L361 132H318Z"
              fill="url(#homeGoldBg)"
              className={styles.homeIllustrationCrown}
            />
            <circle cx="326" cy="218" r="12" fill="#f4fbf8" />
            <circle cx="400" cy="218" r="12" fill="#f4fbf8" />
            <circle cx="326" cy="218" r="5" fill="#0a5f53" />
            <circle cx="400" cy="218" r="5" fill="#0a5f53" />
            <path
              d="M334 258C350 274 378 274 394 258"
              stroke="#f4fbf8"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            <rect
              x="312"
              y="172"
              width="48"
              height="10"
              rx="5"
              fill="rgba(255,255,255,0.24)"
            />
            <rect
              x="370"
              y="172"
              width="48"
              height="10"
              rx="5"
              fill="rgba(255,255,255,0.24)"
            />
            <path
              d="M426 178L440 192L426 206"
              stroke="#fff4cf"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle
              cx="442"
              cy="194"
              r="10"
              fill="rgba(255,244,207,0.14)"
              className={styles.homeIllustrationBadge}
            />
            <path
              d="M432 193L439 200L452 186"
              stroke="#fff4cf"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>

          <g className={styles.homeIllustrationSparkles}>
            <path
              d="M210 124L216 140L232 146L216 152L210 168L204 152L188 146L204 140L210 124Z"
              fill="#d7b16a"
            />
            <path
              d="M596 298L601 312L616 318L601 324L596 338L591 324L576 318L591 312L596 298Z"
              fill="#0f766e"
            />
            <circle
              cx="168"
              cy="376"
              r="10"
              fill="rgba(15,118,110,0.18)"
              className={styles.homeIllustrationBadge}
            />
            <circle cx="176" cy="384" r="4" fill="#0f766e" />
          </g>
        </g>
      </svg>

      <figcaption className={styles.homeIllustrationCaption}>
        {caption}
      </figcaption>
    </figure>
  );
}
