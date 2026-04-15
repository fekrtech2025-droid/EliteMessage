import { execFileSync } from 'node:child_process';
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  existsSync,
} from 'node:fs';
import path from 'node:path';

const rootDir = '/Volumes/MACOS/EliteMessage';
const docsDir = path.join(rootDir, 'docs/current-status');
const buildDir = path.join(docsDir, '.build');
const outputDir = path.join(docsDir, 'output');
const cacheDir = path.join(docsDir, '.cache');
const assetsDir = path.join(docsDir, 'assets');
const diagramsDir = path.join(assetsDir, 'diagrams');
const brandingDir = path.join(assetsDir, 'branding');
const stylesDir = path.join(assetsDir, 'styles');

const buildEnv = {
  ...process.env,
  XDG_CACHE_HOME: cacheDir,
  HOME: process.env.HOME ?? '/Users/apple',
};

const englishBusinessDocs = [
  'business/project-overview.md',
  'business/software-proposal.md',
  'business/scope-document.md',
  'business/feasibility-study.md',
  'business/budget-and-timeline.md',
  'business/stakeholder-list.md',
  'business/risk-register.md',
];

const englishRequirementsDocs = [
  'requirements/business-requirements-document.md',
  'requirements/software-requirements-specification.md',
  'requirements/functional-requirements.md',
  'requirements/non-functional-requirements.md',
  'requirements/use-cases.md',
  'requirements/user-stories.md',
  'requirements/acceptance-criteria.md',
];

const englishProductDocs = [
  'product-design/system-architecture-document.md',
  'product-design/high-level-design.md',
  'product-design/low-level-design.md',
  'product-design/database-schema-documentation.md',
  'product-design/api-design-specification.md',
  'product-design/ui-ux-documentation.md',
  'product-design/wireframes-and-mockups.md',
  'product-design/flowcharts-and-sequence-diagrams.md',
];

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function read(relativePath) {
  return readFileSync(path.join(docsDir, relativePath), 'utf8');
}

function readBook(relativePath) {
  return readFileSync(path.join(docsDir, 'book', relativePath), 'utf8');
}

function stripStatusDate(markdown) {
  return markdown.replace(/^Status date: .*?\n+/m, '');
}

function demoteHeadings(markdown, amount = 1) {
  return markdown.replace(
    /^(#{1,5})\s+/gm,
    (_, hashes) => `${'#'.repeat(Math.min(6, hashes.length + amount))} `,
  );
}

function replaceDiagramBlocks(markdown, file, language) {
  const imageBase = `../assets/diagrams/${language}`;
  if (file === 'product-design/system-architecture-document.md') {
    return markdown.replace(
      /```mermaid[\s\S]*?```/m,
      `![${language === 'ar' ? 'مخطط المعمارية التشغيلية' : 'Runtime Architecture Diagram'}](${imageBase}/runtime-architecture.png){.diagram}`,
    );
  }

  if (file === 'product-design/flowcharts-and-sequence-diagrams.md') {
    const replacements = [
      `![${language === 'ar' ? 'تدفق مصادقة العميل' : 'Customer Authentication Flow'}](${imageBase}/customer-auth-flow.png){.diagram}`,
      `![${language === 'ar' ? 'من إنشاء الـ instance إلى استخدام الـ API' : 'Instance Creation to API Usage'}](${imageBase}/instance-to-api-flow.png){.diagram}`,
      `![${language === 'ar' ? 'تسلسل عمليات الـ worker' : 'Worker and Lifecycle Operation Sequence'}](${imageBase}/worker-lifecycle-sequence.png){.diagram}`,
      `![${language === 'ar' ? 'تدفق تسليم الـ webhook' : 'Webhook Delivery Flow'}](${imageBase}/webhook-delivery-sequence.png){.diagram}`,
    ];

    let currentIndex = 0;
    return markdown.replace(
      /```mermaid[\s\S]*?```/gm,
      () => replacements[currentIndex++] ?? '',
    );
  }

  return markdown;
}

function normalizeEnglishDoc(relativePath) {
  const raw = read(relativePath);
  const withoutStatus = stripStatusDate(raw);
  const withDiagrams = replaceDiagramBlocks(withoutStatus, relativePath, 'en');
  return demoteHeadings(withDiagrams, 1).trim();
}

function buildEnglishBook() {
  const parts = [
    readBook('en/executive-summary.md').trim(),
    '# Business and Planning Documentation',
    ...englishBusinessDocs.map(normalizeEnglishDoc),
    '# Requirements Documentation',
    ...englishRequirementsDocs.map(normalizeEnglishDoc),
    '# Product and Design Documentation',
    ...englishProductDocs.map(normalizeEnglishDoc),
    readBook('en/appendix.md').trim(),
  ];

  return `${parts.join('\n\n')}\n`;
}

function buildArabicBook() {
  return readBook('ar/body.md').replace(
    /\.svg\)\{\.diagram\}/g,
    '.png){.diagram}',
  );
}

function buildFrontMatter(language) {
  const isArabic = language === 'ar';
  const logoPath = '../assets/branding/elite-message-logo-full.png';

  return `
<section class="cover-page">
  <img src="${logoPath}" alt="Elite Message" />
  <div class="cover-kicker">${isArabic ? 'توثيق حالة المشروع الحالية' : 'Current Status Documentation'}</div>
  <h1 class="cover-title">${isArabic ? 'مرجع مشروع Elite Message' : 'Elite Message Project Book'}</h1>
  <p class="cover-subtitle">${isArabic ? 'توثيق موحد للأعمال والمتطلبات والبنية التقنية والتصميم الحالي للمنصة.' : 'Unified business, requirements, architecture, API, database, and design documentation for the current repository state.'}</p>
  <p class="cover-meta">${isArabic ? 'الإصدار: 2026-04-12' : 'Version date: 2026-04-12'}</p>
</section>
<div class="page-break"></div>

<section class="control-page">
  <h1>${isArabic ? 'التحكم بالمستند' : 'Document Control'}</h1>
  <table>
    <thead>
      <tr>
        <th>${isArabic ? 'الحقل' : 'Field'}</th>
        <th>${isArabic ? 'القيمة' : 'Value'}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${isArabic ? 'اسم المستند' : 'Document name'}</td>
        <td>${isArabic ? 'مرجع حالة مشروع Elite Message الحالية' : 'Elite Message Current Status Project Book'}</td>
      </tr>
      <tr>
        <td>${isArabic ? 'نوع المستند' : 'Document type'}</td>
        <td>${isArabic ? 'توثيق مشروع موحد' : 'Unified project documentation'}</td>
      </tr>
      <tr>
        <td>${isArabic ? 'الجمهور' : 'Audience'}</td>
        <td>${isArabic ? 'فريق مختلط: منتج، إدارة، هندسة، وتشغيل' : 'Mixed team: product, management, engineering, and operations'}</td>
      </tr>
      <tr>
        <td>${isArabic ? 'نطاق الحالة' : 'Status scope'}</td>
        <td>${isArabic ? 'يعكس الوضع الحالي للمستودع حتى 2026-04-12' : 'Reflects the checked-in repository state as of 2026-04-12'}</td>
      </tr>
      <tr>
        <td>${isArabic ? 'التقنيات الرئيسية' : 'Core technologies'}</td>
        <td>Next.js 16, React 19, NestJS 11, Prisma 7, PostgreSQL, Redis, BullMQ, MinIO</td>
      </tr>
      <tr>
        <td>${isArabic ? 'مصدر الحقيقة' : 'Source of truth'}</td>
        <td>${isArabic ? 'الشيفرة الحالية، المخطط، الإعدادات، والوثائق في docs/current-status' : 'Current codebase, schema, configuration, and docs/current-status content'}</td>
      </tr>
    </tbody>
  </table>
</section>
<div class="page-break"></div>
`.trim();
}

function writeSvg(filePath, content) {
  writeFileSync(filePath, `${content.trim()}\n`, 'utf8');
}

function svgTextBlock({
  x,
  y,
  text,
  maxChars = 26,
  lineHeight = 24,
  fontSize = 20,
  fontWeight = 700,
  fill = '#10213c',
  anchor = 'middle',
  rtl = false,
}) {
  const words = String(text)
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || current.length === 0) {
      current = next;
      continue;
    }
    lines.push(current);
    current = word;
  }

  if (current) {
    lines.push(current);
  }

  const tspans = lines
    .map((line, index) => {
      const dy = index === 0 ? 0 : lineHeight;
      return `<tspan x="${x}" dy="${dy}">${line}</tspan>`;
    })
    .join('');

  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" ${rtl ? 'direction="rtl" unicode-bidi="plaintext"' : ''}>${tspans}</text>`;
}

function svgCard({
  x,
  y,
  width,
  height,
  title,
  subtitle,
  rtl = false,
  fill = 'url(#card)',
  stroke = '#cfd9e7',
  titleSize = 22,
  subtitleSize = 15,
  titleMaxChars = 22,
  subtitleMaxChars = 28,
}) {
  const centerX = x + width / 2;
  const titleY = y + 34;
  const subtitleY = subtitle ? y + 72 : 0;

  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="20" fill="${fill}" stroke="${stroke}" />
    ${svgTextBlock({
      x: centerX,
      y: titleY,
      text: title,
      maxChars: titleMaxChars,
      lineHeight: 24,
      fontSize: titleSize,
      fontWeight: 700,
      rtl,
    })}
    ${
      subtitle
        ? svgTextBlock({
            x: centerX,
            y: subtitleY,
            text: subtitle,
            maxChars: subtitleMaxChars,
            lineHeight: 20,
            fontSize: subtitleSize,
            fontWeight: 500,
            fill: '#5c6d84',
            rtl,
          })
        : ''
    }
  `;
}

function svgArrow({ fromX, fromY, toX, toY }) {
  return `<line x1="${fromX}" y1="${fromY}" x2="${toX}" y2="${toY}" stroke="#3a567a" stroke-width="3" marker-end="url(#arrow)" />`;
}

function svgPolyline(points) {
  return `<polyline points="${points}" fill="none" stroke="#3a567a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arrow)" />`;
}

function svgShell(body, rtl = false) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
  <defs>
    <linearGradient id="shell" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#f9fcfb" />
      <stop offset="100%" stop-color="#eef5fb" />
    </linearGradient>
    <linearGradient id="card" x1="0" x2="1">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f5f8fc" />
    </linearGradient>
    <linearGradient id="accent" x1="0" x2="1">
      <stop offset="0%" stop-color="#0e6a56" />
      <stop offset="100%" stop-color="#17886f" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#0c1730" flood-opacity="0.08" />
    </filter>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M0,0 L12,6 L0,12 z" fill="#3a567a" />
    </marker>
  </defs>
  <rect width="1200" height="700" fill="url(#shell)" />
  <rect x="18" y="18" width="1164" height="664" rx="28" fill="#ffffff" stroke="#d9e3ee" stroke-width="2" filter="url(#shadow)" />
  <rect x="18" y="18" width="1164" height="84" rx="28" fill="url(#accent)" />
  <g font-family="${rtl ? 'Geeza Pro, Arial Unicode MS, sans-serif' : 'IBM Plex Sans, Arial Unicode MS, sans-serif'}" fill="#10213c" ${rtl ? 'direction="rtl"' : ''}>
    ${body}
  </g>
</svg>`;
}

function generateDiagrams() {
  ensureDir(path.join(diagramsDir, 'en'));
  ensureDir(path.join(diagramsDir, 'ar'));

  writeSvg(
    path.join(diagramsDir, 'en/runtime-architecture.svg'),
    svgShell(`
      ${svgTextBlock({ x: 600, y: 68, text: 'Runtime Architecture', fontSize: 30, fontWeight: 700, fill: '#ffffff' })}
      <text x="600" y="130" text-anchor="middle" font-size="16" font-weight="600" fill="#607089">Current platform layout across web, API, worker, data, and operations</text>
      ${svgCard({ x: 92, y: 176, width: 260, height: 96, title: 'Customer Web', subtitle: 'Next.js + React' })}
      ${svgCard({ x: 848, y: 176, width: 260, height: 96, title: 'Admin Web', subtitle: 'Next.js + React' })}
      ${svgCard({ x: 410, y: 166, width: 380, height: 122, title: 'API', subtitle: 'NestJS + Express + Socket.IO', fill: '#edf7f3', stroke: '#badccd', titleSize: 30, subtitleSize: 17, titleMaxChars: 24, subtitleMaxChars: 28 })}
      ${svgCard({ x: 90, y: 402, width: 248, height: 104, title: 'PostgreSQL', subtitle: 'Prisma data model', titleSize: 25 })}
      ${svgCard({ x: 368, y: 402, width: 208, height: 104, title: 'Redis', subtitle: 'Queue + cache', titleSize: 25, subtitleMaxChars: 18 })}
      ${svgCard({ x: 612, y: 402, width: 208, height: 104, title: 'MinIO', subtitle: 'S3-compatible storage', titleSize: 25, subtitleMaxChars: 20 })}
      ${svgCard({ x: 856, y: 386, width: 254, height: 136, title: 'Worker', subtitle: 'BullMQ + whatsapp-web.js', fill: '#f8fafc', titleSize: 28, subtitleSize: 16, subtitleMaxChars: 24 })}
      <rect x="392" y="560" width="416" height="72" rx="20" fill="#fff7e8" stroke="#ead1a2" />
      ${svgTextBlock({ x: 600, y: 590, text: 'Prometheus + Grafana + Alertmanager', fontSize: 21, fontWeight: 700, maxChars: 36 })}
      ${svgTextBlock({ x: 600, y: 617, text: 'Health, metrics, dashboards, and alert evaluation', fontSize: 14, fontWeight: 500, fill: '#6e654a', maxChars: 42 })}
      ${svgArrow({ fromX: 352, fromY: 225, toX: 410, toY: 225 })}
      ${svgArrow({ fromX: 848, fromY: 225, toX: 790, toY: 225 })}
      ${svgArrow({ fromX: 500, fromY: 288, toX: 250, toY: 402 })}
      ${svgArrow({ fromX: 560, fromY: 288, toX: 472, toY: 402 })}
      ${svgArrow({ fromX: 650, fromY: 288, toX: 716, toY: 402 })}
      ${svgArrow({ fromX: 716, fromY: 288, toX: 982, toY: 386 })}
      ${svgArrow({ fromX: 982, fromY: 522, toX: 760, toY: 596 })}
      ${svgArrow({ fromX: 600, fromY: 506, toX: 600, toY: 560 })}
    `),
  );

  writeSvg(
    path.join(diagramsDir, 'ar/runtime-architecture.svg'),
    svgShell(
      `
      ${svgTextBlock({ x: 600, y: 68, text: 'المعمارية التشغيلية', fontSize: 30, fontWeight: 700, fill: '#ffffff', rtl: true })}
      <text x="600" y="130" text-anchor="middle" font-size="16" font-weight="600" fill="#607089">توزيع المنصة الحالية بين الواجهات والـ API والعامل وطبقات البيانات والتشغيل</text>
      ${svgCard({ x: 848, y: 176, width: 260, height: 96, title: 'واجهة العميل', subtitle: 'Next.js + React', rtl: true, titleMaxChars: 18, subtitleMaxChars: 22 })}
      ${svgCard({ x: 92, y: 176, width: 260, height: 96, title: 'واجهة الإدارة', subtitle: 'Next.js + React', rtl: true, titleMaxChars: 18, subtitleMaxChars: 22 })}
      ${svgCard({ x: 410, y: 166, width: 380, height: 122, title: 'API', subtitle: 'NestJS + Express + Socket.IO', rtl: true, fill: '#edf7f3', stroke: '#badccd', titleSize: 30, subtitleSize: 17, titleMaxChars: 24, subtitleMaxChars: 28 })}
      ${svgCard({ x: 90, y: 402, width: 248, height: 104, title: 'PostgreSQL', subtitle: 'Prisma', rtl: true, titleSize: 25, subtitleMaxChars: 18 })}
      ${svgCard({ x: 368, y: 402, width: 208, height: 104, title: 'Redis', subtitle: 'Queue + Cache', rtl: true, titleSize: 25, subtitleMaxChars: 18 })}
      ${svgCard({ x: 612, y: 402, width: 208, height: 104, title: 'MinIO', subtitle: 'S3-compatible', rtl: true, titleSize: 25, subtitleMaxChars: 18 })}
      ${svgCard({ x: 856, y: 386, width: 254, height: 136, title: 'العامل', subtitle: 'BullMQ + whatsapp-web.js', rtl: true, fill: '#f8fafc', titleSize: 28, subtitleSize: 16, subtitleMaxChars: 24 })}
      <rect x="392" y="560" width="416" height="72" rx="20" fill="#fff7e8" stroke="#ead1a2" />
      ${svgTextBlock({ x: 600, y: 590, text: 'Prometheus + Grafana + Alertmanager', fontSize: 21, fontWeight: 700, maxChars: 36, rtl: true })}
      ${svgTextBlock({ x: 600, y: 617, text: 'المراقبة والقياسات ولوحات المتابعة والتنبيهات', fontSize: 14, fontWeight: 500, fill: '#6e654a', maxChars: 34, rtl: true })}
      ${svgArrow({ fromX: 848, fromY: 225, toX: 790, toY: 225 })}
      ${svgArrow({ fromX: 352, fromY: 225, toX: 410, toY: 225 })}
      ${svgArrow({ fromX: 500, fromY: 288, toX: 250, toY: 402 })}
      ${svgArrow({ fromX: 560, fromY: 288, toX: 472, toY: 402 })}
      ${svgArrow({ fromX: 650, fromY: 288, toX: 716, toY: 402 })}
      ${svgArrow({ fromX: 716, fromY: 288, toX: 982, toY: 386 })}
      ${svgArrow({ fromX: 982, fromY: 522, toX: 760, toY: 596 })}
      ${svgArrow({ fromX: 600, fromY: 506, toX: 600, toY: 560 })}
    `,
      true,
    ),
  );

  const genericFlow = (title, boxes, language) => {
    const rtl = language === 'ar';
    const positions = [
      { x: 120, y: 176 },
      { x: 520, y: 176 },
      { x: 920, y: 176 },
      { x: 320, y: 420 },
      { x: 720, y: 420 },
    ];
    const cardWidth = 160;
    const cardHeight = 112;
    const cards = boxes
      .map((label, index) => {
        const { x, y } = positions[index];
        const fill = index === 0 ? '#edf7f3' : 'url(#card)';
        const stroke = index === 0 ? '#badccd' : '#cfd9e7';
        return `
          <circle cx="${x}" cy="${y - 24}" r="20" fill="#0e6a56" />
          ${svgTextBlock({ x, y: y - 17, text: String(index + 1), maxChars: 3, fontSize: 17, fontWeight: 700, fill: '#ffffff' })}
          ${svgCard({
            x: x - cardWidth / 2,
            y,
            width: cardWidth,
            height: cardHeight,
            title: label,
            rtl,
            fill,
            stroke,
            titleSize: 18,
            titleMaxChars: 18,
          })}
        `;
      })
      .join('');
    return svgShell(
      `
      ${svgTextBlock({ x: 600, y: 68, text: title, fontSize: 30, fontWeight: 700, fill: '#ffffff', rtl })}
      <text x="600" y="132" text-anchor="middle" font-size="16" font-weight="600" fill="#607089">${rtl ? 'رحلة تشغيلية من خطوة إلى خطوة حتى الجاهزية أو الاستخدام' : 'Operational journey from setup to ready state or API usage'}</text>
      ${cards}
      ${svgArrow({ fromX: 200, fromY: 232, toX: 440, toY: 232 })}
      ${svgArrow({ fromX: 600, fromY: 232, toX: 840, toY: 232 })}
      ${svgPolyline('1000,288 1000,344 820,344 820,420')}
      ${svgArrow({ fromX: 400, fromY: 476, toX: 640, toY: 476 })}
    `,
      rtl,
    );
  };

  writeSvg(
    path.join(diagramsDir, 'en/customer-auth-flow.svg'),
    genericFlow(
      'Customer Authentication Flow',
      [
        'Open signin or signup',
        'Submit credentials or Google auth',
        'API validates or creates session',
        'Customer workspace becomes available',
      ],
      'en',
    ),
  );
  writeSvg(
    path.join(diagramsDir, 'ar/customer-auth-flow.svg'),
    genericFlow(
      'تدفق مصادقة العميل',
      [
        'فتح شاشة الدخول أو التسجيل',
        'إرسال البيانات أو Google OAuth',
        'الـ API تتحقق أو تنشئ الجلسة',
        'تتاح مساحة عمل العميل',
      ],
      'ar',
    ),
  );
  writeSvg(
    path.join(diagramsDir, 'en/instance-to-api-flow.svg'),
    genericFlow(
      'Instance Creation to API Usage',
      [
        'Sign in',
        'Create instance',
        'Authenticate WhatsApp runtime',
        'Get instance ID and token',
        'Call public API',
      ],
      'en',
    ),
  );
  writeSvg(
    path.join(diagramsDir, 'ar/instance-to-api-flow.svg'),
    genericFlow(
      'من إنشاء الـ instance إلى استخدام الـ API',
      [
        'تسجيل الدخول',
        'إنشاء instance',
        'ربط WhatsApp وتفعيل runtime',
        'الحصول على instance ID والـ token',
        'استخدام الـ API العامة',
      ],
      'ar',
    ),
  );

  const genericSequence = (title, actors, steps, language) => {
    const rtl = language === 'ar';
    const activeActors = actors.filter(Boolean);
    const left = 120;
    const right = 1080;
    const actorXs =
      activeActors.length === 1
        ? [600]
        : activeActors.map(
            (_, index) =>
              left + ((right - left) / (activeActors.length - 1)) * index,
          );
    const actorBlock = actors
      .filter(Boolean)
      .map(
        (actor, index) => `
        <rect x="${actorXs[index] - 88}" y="116" width="176" height="64" rx="18" fill="url(#card)" stroke="#cfd9e7" />
        ${svgTextBlock({ x: actorXs[index], y: 148, text: actor, maxChars: 18, fontSize: 19, fontWeight: 700, rtl })}
        <line x1="${actorXs[index]}" y1="180" x2="${actorXs[index]}" y2="624" stroke="#d5deea" stroke-width="2" stroke-dasharray="8 8" />
      `,
      )
      .join('');

    const arrows = steps
      .map(([from, to, label], index) => {
        const y = 242 + index * 62;
        const labelX = (actorXs[from] + actorXs[to]) / 2;
        return `
          <line x1="${actorXs[from]}" y1="${y}" x2="${actorXs[to]}" y2="${y}" stroke="#3a567a" stroke-width="3" marker-end="url(#arrow)" />
          <rect x="${Math.min(actorXs[from], actorXs[to]) + 18}" y="${y - 28}" width="${Math.abs(actorXs[to] - actorXs[from]) - 36}" height="26" rx="13" fill="#f3f7fb" />
          ${svgTextBlock({ x: labelX, y: y - 12, text: label, maxChars: 30, fontSize: 13, fontWeight: 600, fill: '#445875', rtl })}
        `;
      })
      .join('');

    return svgShell(
      `
      ${svgTextBlock({ x: 600, y: 68, text: title, fontSize: 30, fontWeight: 700, fill: '#ffffff', rtl })}
      <text x="600" y="222" text-anchor="middle" font-size="16" font-weight="600" fill="#607089">${rtl ? 'تدفق الرسائل والأوامر بين المكونات الرئيسية' : 'Request and event flow across the involved services'}</text>
      ${actorBlock}
      ${arrows}
    `,
      rtl,
    );
  };

  writeSvg(
    path.join(diagramsDir, 'en/worker-lifecycle-sequence.svg'),
    genericSequence(
      'Worker and Lifecycle Operation Sequence',
      ['Customer/Admin UI', 'API', 'Redis', 'Worker', 'PostgreSQL'],
      [
        [0, 1, 'Request instance operation'],
        [1, 4, 'Persist pending operation'],
        [1, 2, 'Enqueue job'],
        [2, 3, 'Deliver work'],
        [3, 4, 'Update runtime and operation state'],
        [3, 1, 'Report internal updates'],
        [1, 4, 'Persist lifecycle event'],
      ],
      'en',
    ),
  );
  writeSvg(
    path.join(diagramsDir, 'ar/worker-lifecycle-sequence.svg'),
    genericSequence(
      'تسلسل عمليات العامل ودورة الحياة',
      ['واجهة المستخدم', 'API', 'Redis', 'العامل', 'PostgreSQL'],
      [
        [0, 1, 'طلب تنفيذ عملية على الـ instance'],
        [1, 4, 'حفظ العملية كـ pending'],
        [1, 2, 'إدخال المهمة إلى الـ queue'],
        [2, 3, 'تسليم المهمة للعامل'],
        [3, 4, 'تحديث الحالة التشغيلية والعملية'],
        [3, 1, 'إرسال تحديثات داخلية'],
        [1, 4, 'حفظ حدث دورة الحياة'],
      ],
      'ar',
    ),
  );
  writeSvg(
    path.join(diagramsDir, 'en/webhook-delivery-sequence.svg'),
    genericSequence(
      'Webhook Delivery Flow',
      ['API', 'PostgreSQL', 'Customer Webhook', 'Admin UI'],
      [
        [0, 1, 'Create webhook delivery record'],
        [0, 2, 'Send signed webhook request'],
        [2, 0, 'HTTP response'],
        [0, 1, 'Persist delivery result'],
        [3, 0, 'Inspect delivery history or replay'],
      ],
      'en',
    ),
  );
  writeSvg(
    path.join(diagramsDir, 'ar/webhook-delivery-sequence.svg'),
    genericSequence(
      'تدفق تسليم الـ webhook',
      ['API', 'PostgreSQL', 'Webhook العميل', 'واجهة الإدارة'],
      [
        [0, 1, 'إنشاء سجل تسليم الـ webhook'],
        [0, 2, 'إرسال طلب موقع'],
        [2, 0, 'استجابة HTTP'],
        [0, 1, 'تحديث حالة التسليم'],
        [3, 0, 'استعراض التاريخ أو إعادة الإرسال'],
      ],
      'ar',
    ),
  );
}

function rasterizeDiagrams() {
  const targets = [
    'runtime-architecture',
    'customer-auth-flow',
    'instance-to-api-flow',
    'worker-lifecycle-sequence',
    'webhook-delivery-sequence',
  ];

  for (const language of ['en', 'ar']) {
    for (const target of targets) {
      const svgPath = path.join(diagramsDir, language, `${target}.svg`);
      const pngPath = path.join(diagramsDir, language, `${target}.png`);
      run('rsvg-convert', ['-w', '2000', '-h', '1167', svgPath, '-o', pngPath]);
    }
  }
}

function run(command, args) {
  execFileSync(command, args, {
    cwd: rootDir,
    env: buildEnv,
    stdio: 'pipe',
  });
}

function renderBook(language, markdown, title, tocTitle, pdfName) {
  const markdownPath = path.join(buildDir, `${language}-book.md`);
  const frontPath = path.join(buildDir, `${language}-front.html`);
  const htmlPath = path.join(buildDir, `${language}-book.html`);
  const pdfPath = path.join(outputDir, pdfName);

  writeFileSync(markdownPath, markdown, 'utf8');
  writeFileSync(frontPath, buildFrontMatter(language), 'utf8');

  const cssPaths = [
    path.join(stylesDir, 'print-base.css'),
    path.join(stylesDir, language === 'ar' ? 'print-ar.css' : 'print-en.css'),
  ];

  const args = [
    markdownPath,
    '--from=markdown+raw_html+pipe_tables+table_captions',
    '--standalone',
    '--number-sections',
    '--toc',
    '--toc-depth=3',
    '--template',
    path.join(stylesDir, 'pandoc-template.html'),
    '-B',
    frontPath,
    '--metadata',
    `title=${title}`,
    '--metadata',
    `lang=${language === 'ar' ? 'ar' : 'en'}`,
    '--variable',
    `direction=${language === 'ar' ? 'rtl' : 'ltr'}`,
    '--variable',
    `toc-title=${tocTitle}`,
  ];

  for (const cssPath of cssPaths) {
    args.push('--css', cssPath);
  }

  args.push('--output', htmlPath);

  run('pandoc', args);
  run('weasyprint', [htmlPath, pdfPath]);
}

function ensureBrandingAssets() {
  ensureDir(brandingDir);
  const fullLogoSource = path.join(
    rootDir,
    'apps/customer-web/public/images/EliteMessage_Logo_Full_Gold_Text.png',
  );
  const iconSource = path.join(
    rootDir,
    'apps/customer-web/public/images/EliteMessage_Icon_Only.png',
  );
  const fullLogoTarget = path.join(brandingDir, 'elite-message-logo-full.png');
  const iconTarget = path.join(brandingDir, 'elite-message-icon-only.png');

  if (!existsSync(fullLogoTarget)) {
    copyFileSync(fullLogoSource, fullLogoTarget);
  }
  if (!existsSync(iconTarget)) {
    copyFileSync(iconSource, iconTarget);
  }
}

function main() {
  ensureDir(buildDir);
  ensureDir(outputDir);
  ensureDir(cacheDir);
  ensureBrandingAssets();
  generateDiagrams();
  rasterizeDiagrams();

  renderBook(
    'en',
    buildEnglishBook(),
    'Elite Message Current Status Project Book',
    'Table of Contents',
    'Elite-Message-Current-Status-EN.pdf',
  );
  renderBook(
    'ar',
    buildArabicBook(),
    'مرجع حالة مشروع Elite Message الحالية',
    'جدول المحتويات',
    'Elite-Message-Current-Status-AR.pdf',
  );

  process.stdout.write(`Generated PDFs in ${outputDir}\n`);
}

main();
