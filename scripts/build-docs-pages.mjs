import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const rootDir = '/Volumes/MACOS/EliteMessage';
const docsDir = path.join(rootDir, 'docs/current-status');
const pagesDir = path.join(docsDir, 'pages');

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

function replaceDiagramBlocks(markdown, file, language, imageBase) {
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

function adjustAssetPaths(markdown) {
  return markdown.replace(/\]\(\.\.\/assets\//g, '](../../assets/');
}

function normalizeEnglishDoc(relativePath) {
  const raw = read(relativePath);
  const withoutStatus = stripStatusDate(raw);
  const withDiagrams = replaceDiagramBlocks(
    withoutStatus,
    relativePath,
    'en',
    '../../assets/diagrams/en',
  );
  return adjustAssetPaths(demoteHeadings(withDiagrams, 1).trim());
}

function renderMarkdownFragment(markdown) {
  return execFileSync(
    'pandoc',
    ['--from=markdown+raw_html+pipe_tables+table_captions', '--to=html5'],
    {
      cwd: rootDir,
      encoding: 'utf8',
      input: `${markdown.trim()}\n`,
      stdio: ['pipe', 'pipe', 'inherit'],
    },
  );
}

function splitTopLevelSections(markdown) {
  const matches = [...markdown.matchAll(/^# (.+)$/gm)];
  const sections = new Map();

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const nextMatch = matches[index + 1];
    const start = match.index ?? 0;
    const end = nextMatch?.index ?? markdown.length;
    sections.set(match[1].trim(), markdown.slice(start, end).trim());
  }

  return sections;
}

function buildEnglishPages() {
  return [
    {
      slug: 'executive-summary',
      title: 'Executive Summary',
      kicker: 'Current State',
      description:
        'Current implementation posture, technical baseline, and documentation intent.',
      markdown: readBook('en/executive-summary.md').trim(),
    },
    {
      slug: 'business-planning',
      title: 'Business and Planning Documentation',
      kicker: 'Business',
      description:
        'Project overview, proposal, scope, feasibility, budget, stakeholders, and risks.',
      markdown: [
        '# Business and Planning Documentation',
        ...englishBusinessDocs.map(normalizeEnglishDoc),
      ].join('\n\n'),
    },
    {
      slug: 'requirements',
      title: 'Requirements Documentation',
      kicker: 'Requirements',
      description:
        'Business requirements, software requirements, functional and non-functional requirements, use cases, and acceptance criteria.',
      markdown: [
        '# Requirements Documentation',
        ...englishRequirementsDocs.map(normalizeEnglishDoc),
      ].join('\n\n'),
    },
    {
      slug: 'product-design',
      title: 'Product and Design Documentation',
      kicker: 'Product Design',
      description:
        'Architecture, design levels, schema, API design, UI/UX, wireframes, and flow documentation.',
      markdown: [
        '# Product and Design Documentation',
        ...englishProductDocs.map(normalizeEnglishDoc),
      ].join('\n\n'),
    },
    {
      slug: 'appendix',
      title: 'Appendix and References',
      kicker: 'Appendix',
      description:
        'Reference files, validation notes, and source-of-truth guidance.',
      markdown: readBook('en/appendix.md').trim(),
    },
  ];
}

function buildArabicPages() {
  const body = adjustAssetPaths(
    readBook('ar/body.md').replace(/\.svg\)\{\.diagram\}/g, '.png){.diagram}'),
  );
  const sections = splitTopLevelSections(body);

  return [
    {
      slug: 'executive-summary',
      title: 'الملخص التنفيذي',
      kicker: 'الحالة الحالية',
      description:
        'ملخص التنفيذ الحالي والخط التقني الأساسي والغرض من مجموعة التوثيق الحالية.',
      markdown: sections.get('الملخص التنفيذي'),
    },
    {
      slug: 'business-planning',
      title: 'توثيق الأعمال والتخطيط',
      kicker: 'الأعمال',
      description:
        'نظرة عامة على المشروع، المقترح، النطاق، الجدوى، الجدول الزمني، أصحاب المصلحة، والمخاطر.',
      markdown: sections.get('توثيق الأعمال والتخطيط'),
    },
    {
      slug: 'requirements',
      title: 'توثيق المتطلبات',
      kicker: 'المتطلبات',
      description:
        'متطلبات الأعمال والبرمجية، المتطلبات الوظيفية وغير الوظيفية، حالات الاستخدام، وقبول التنفيذ.',
      markdown: sections.get('توثيق المتطلبات'),
    },
    {
      slug: 'product-design',
      title: 'توثيق المنتج والتصميم',
      kicker: 'المنتج والتصميم',
      description:
        'المعمارية، مستويات التصميم، مخطط البيانات، تصميم الـ API، تجربة الاستخدام، والمخططات.',
      markdown: sections.get('توثيق المنتج والتصميم'),
    },
    {
      slug: 'appendix',
      title: 'الملاحق والمراجع',
      kicker: 'الملاحق',
      description: 'المراجع الداعمة والمصادر الحالية المساندة لهذا التوثيق.',
      markdown: sections.get('الملاحق والمراجع'),
    },
  ];
}

function languageMeta(language) {
  return language === 'ar'
    ? {
        lang: 'ar',
        dir: 'rtl',
        label: 'العربية',
        homeLabel: 'الرئيسية',
        hubTitle: 'مركز توثيق Elite Message',
        hubSubtitle:
          'نسخة قابلة للتصفح من توثيق حالة المشروع الحالية، موزعة على صفحات واضحة بدلاً من ملف PDF واحد.',
        pdfLabel: 'فتح نسخة PDF',
        pagesLabel: 'الصفحات',
      }
    : {
        lang: 'en',
        dir: 'ltr',
        label: 'English',
        homeLabel: 'Home',
        hubTitle: 'Elite Message Documentation Hub',
        hubSubtitle:
          'Browsable current-state documentation organized as navigable pages instead of a single PDF.',
        pdfLabel: 'Open PDF version',
        pagesLabel: 'Pages',
      };
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderPageHtml({
  language,
  currentPage,
  pages,
  bodyHtml,
  counterpartHref,
}) {
  const meta = languageMeta(language);
  const navItems = [
    {
      href: 'index.html',
      title: meta.homeLabel,
      description: meta.hubTitle,
      active: currentPage.slug === 'index',
    },
    ...pages.map((page) => ({
      href: `${page.slug}.html`,
      title: page.title,
      description: page.kicker,
      active: currentPage.slug === page.slug,
    })),
  ];

  return `<!doctype html>
<html lang="${meta.lang}" dir="${meta.dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(currentPage.title)} | Elite Message</title>
    <link rel="stylesheet" href="../../assets/styles/pages.css" />
  </head>
  <body>
    <div class="docs-shell">
      <aside class="docs-sidebar">
        <div class="docs-brand">
          <img src="../../assets/branding/elite-message-icon-only.png" alt="Elite Message" />
          <div>
            <div class="docs-brand-mark">${meta.pagesLabel}</div>
            <p class="docs-brand-title">Elite Message</p>
            <p class="docs-brand-subtitle">${meta.hubTitle}</p>
          </div>
        </div>

        <div class="docs-sidebar-group">
          <p class="docs-sidebar-label">${meta.pagesLabel}</p>
          <nav class="docs-nav">
            ${navItems
              .map(
                (
                  item,
                ) => `<a href="${item.href}" class="${item.active ? 'is-active' : ''}">
                  <span>${escapeHtml(item.title)}</span>
                  <small>${escapeHtml(item.description)}</small>
                </a>`,
              )
              .join('')}
          </nav>
        </div>
      </aside>

      <main class="docs-main">
        <header class="docs-topbar">
          <div>
            <p class="docs-kicker">${escapeHtml(currentPage.kicker)}</p>
            <h1 class="docs-page-title">${escapeHtml(currentPage.title)}</h1>
            <p class="docs-page-subtitle">${escapeHtml(currentPage.description)}</p>
          </div>
          <div class="docs-toolbar">
            <a class="docs-chip primary" href="${counterpartHref}">${language === 'ar' ? 'English version' : 'النسخة العربية'}</a>
            <a class="docs-chip" href="../index.html">${language === 'ar' ? 'اختيار اللغة' : 'Language index'}</a>
            <a class="docs-chip" href="../../output/Elite-Message-Current-Status-${language === 'ar' ? 'AR' : 'EN'}.pdf">${meta.pdfLabel}</a>
          </div>
        </header>

        <article class="docs-article">
          ${bodyHtml}
        </article>
        <p class="docs-footer">${language === 'ar' ? 'تم إنشاء هذه النسخة من مستندات المصدر الحالية داخل docs/current-status.' : 'This page set is generated from the current source documents under docs/current-status.'}</p>
      </main>
    </div>
  </body>
</html>
`;
}

function renderLandingHtml(language, pages) {
  const meta = languageMeta(language);
  const cardHtml = pages
    .map(
      (page) => `<div class="docs-card">
        <p class="docs-kicker">${escapeHtml(page.kicker)}</p>
        <h3>${escapeHtml(page.title)}</h3>
        <p>${escapeHtml(page.description)}</p>
        <a href="${page.slug}.html">${language === 'ar' ? 'فتح الصفحة' : 'Open page'}</a>
      </div>`,
    )
    .join('');

  return `<!doctype html>
<html lang="${meta.lang}" dir="${meta.dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${meta.hubTitle}</title>
    <link rel="stylesheet" href="../../assets/styles/pages.css" />
  </head>
  <body>
    <div class="docs-shell">
      <aside class="docs-sidebar">
        <div class="docs-brand">
          <img src="../../assets/branding/elite-message-icon-only.png" alt="Elite Message" />
          <div>
            <div class="docs-brand-mark">${meta.pagesLabel}</div>
            <p class="docs-brand-title">Elite Message</p>
            <p class="docs-brand-subtitle">${meta.hubTitle}</p>
          </div>
        </div>

        <div class="docs-sidebar-group">
          <p class="docs-sidebar-label">${language === 'ar' ? 'المخرجات' : 'Outputs'}</p>
          <nav class="docs-nav">
            <a href="../../output/Elite-Message-Current-Status-${language === 'ar' ? 'AR' : 'EN'}.pdf">
              <span>${meta.pdfLabel}</span>
              <small>PDF</small>
            </a>
            <a href="../index.html">
              <span>${language === 'ar' ? 'صفحة اختيار اللغة' : 'Language chooser'}</span>
              <small>${language === 'ar' ? 'العودة إلى البداية' : 'Back to the start page'}</small>
            </a>
          </nav>
        </div>
      </aside>

      <main class="docs-main">
        <header class="docs-topbar">
          <div>
            <p class="docs-kicker">${language === 'ar' ? 'صيغة صفحات' : 'Page Format'}</p>
            <h1 class="docs-page-title">${meta.hubTitle}</h1>
            <p class="docs-page-subtitle">${meta.hubSubtitle}</p>
          </div>
          <div class="docs-toolbar">
            <a class="docs-chip primary" href="../${language === 'ar' ? 'en' : 'ar'}/index.html">${language === 'ar' ? 'English version' : 'النسخة العربية'}</a>
          </div>
        </header>

        <section class="docs-article">
          <p>${language === 'ar' ? 'تحتوي هذه النسخة على نفس المحتوى الموثق في ملفات current-status، لكنها مرتبة كصفحات قابلة للتصفح والمراجعة السريعة.' : 'This site mirrors the current-state documentation set as browsable pages for faster reading and review.'}</p>
          <div class="docs-landing-grid">
            ${cardHtml}
          </div>
        </section>
      </main>
    </div>
  </body>
</html>
`;
}

function renderRootIndex() {
  return `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Elite Message Documentation Pages</title>
    <link rel="stylesheet" href="../assets/styles/pages.css" />
  </head>
  <body>
    <main class="docs-main" style="max-width: 1200px; margin: 0 auto; padding-top: 48px;">
      <header class="docs-topbar">
        <div>
          <p class="docs-kicker">Documentation Formats</p>
          <h1 class="docs-page-title">Elite Message Documentation Pages</h1>
          <p class="docs-page-subtitle">Choose the browsable page set you want to review. The PDF deliverables remain available from each language hub.</p>
        </div>
      </header>
      <section class="docs-landing-grid">
        <div class="docs-card">
          <p class="docs-kicker">English</p>
          <h3>Documentation hub</h3>
          <p>Business, requirements, and product-design documentation rendered as linked HTML pages.</p>
          <a href="./en/index.html">Open English pages</a>
        </div>
        <div class="docs-card">
          <p class="docs-kicker">العربية</p>
          <h3>مركز التوثيق</h3>
          <p>نسخة عربية قابلة للتصفح من توثيق حالة المشروع الحالية، موزعة على صفحات مترابطة.</p>
          <a href="./ar/index.html">فتح الصفحات العربية</a>
        </div>
      </section>
    </main>
  </body>
</html>
`;
}

function writeLanguagePages(language, pages) {
  const languageDir = path.join(pagesDir, language);
  ensureDir(languageDir);

  writeFileSync(
    path.join(languageDir, 'index.html'),
    renderLandingHtml(language, pages),
    'utf8',
  );

  for (const page of pages) {
    const bodyHtml = renderMarkdownFragment(page.markdown);
    const counterpartHref = `../${language === 'ar' ? 'en' : 'ar'}/${page.slug}.html`;
    writeFileSync(
      path.join(languageDir, `${page.slug}.html`),
      renderPageHtml({
        language,
        currentPage: page,
        pages,
        bodyHtml,
        counterpartHref,
      }),
      'utf8',
    );
  }
}

function main() {
  ensureDir(pagesDir);
  writeFileSync(path.join(pagesDir, 'index.html'), renderRootIndex(), 'utf8');
  writeLanguagePages('en', buildEnglishPages());
  writeLanguagePages('ar', buildArabicPages());
  process.stdout.write(`Generated page-format docs in ${pagesDir}\n`);
}

main();
