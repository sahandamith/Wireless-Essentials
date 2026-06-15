#!/usr/bin/env node
'use strict';
// ─────────────────────────────────────────────────────────────────────
// ranbits 6G — static render step.
//
//   node scripts/build.js
//
// Renders, from data/6g-tracker.json (the single source of truth):
//   • tracker/index.html        — the tracker dashboard (fully generated)
//   • 6g/*.html                 — per-domain "what's being standardized"
//                                 boxes, between the TRACKER:<id> markers
//   • feed.xml                  — Atom feed from the changelog
//   • sitemap.xml               — all pages
//
// The committed HTML is the rendered output (GitHub Pages serves it as-is).
// Exits non-zero on schema/guardrail errors so CI fails loudly.
// ─────────────────────────────────────────────────────────────────────
const fs = require('fs');
const path = require('path');
const T = require('./lib/tracker');

const SITE = 'https://ranbits.com';
const ROOT = T.ROOT;

function log(s) { process.stdout.write(s + '\n'); }

// ── Load + validate ──────────────────────────────────────────────────
const data = T.loadData();
const v = T.validateTracker(data);
if (!v.ok) {
  log('✗ tracker data failed validation:');
  v.errors.forEach((e) => log('   - ' + e));
  process.exit(1);
}
log(`✓ tracker data valid — ${data.items.length} items, ${data.domains.length} domains`);

// ── Shared <head> meta block ─────────────────────────────────────────
function head(opts) {
  const { title, desc, canonical, keywords, jsonld } = opts;
  const url = SITE + canonical;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${T.esc(title)}</title>
<meta name="description" content="${T.esc(desc)}">
${keywords ? `<meta name="keywords" content="${T.esc(keywords)}">\n` : ''}<meta name="author" content="ranbits.com">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="ranbits">
<meta property="og:title" content="${T.esc(title)}">
<meta property="og:description" content="${T.esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/assets/og-image.svg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${T.esc(title)}">
<meta name="twitter:description" content="${T.esc(desc)}">
<meta name="twitter:image" content="${SITE}/assets/og-image.svg">
<link rel="alternate" type="application/atom+xml" title="ranbits 6G tracker — changelog" href="/feed.xml">
<link rel="stylesheet" href="../css/main.css">
${jsonld ? `<script type="application/ld+json">\n${JSON.stringify(jsonld, null, 2)}\n</script>\n` : ''}</head>`;
}

// ════════════════════════════════════════════════════════════════════
// 1) TRACKER DASHBOARD  →  tracker/index.html
// ════════════════════════════════════════════════════════════════════
function renderStat(num, label, color) {
  return `<div class="tstat"><div class="ts-num" style="color:${color}">${num}</div><div class="ts-label">${T.esc(label)}</div></div>`;
}

function renderTimeline() {
  return data.releases.map((r) => {
    const ms = (r.milestones || []).map((m) => {
      const dot = `dot-${m.status}`;
      const src = m.source_url ? ` <a href="${T.esc(m.source_url)}" target="_blank" rel="noopener" style="color:var(--teal);font-size:11px;text-decoration:none;">↗</a>` : '';
      return `<div class="tl-ms"><span class="tl-dot ${dot}"></span><span class="tl-date">${T.esc(m.date)}</span><span class="tl-label">${T.esc(m.label)}${src}</span></div>`;
    }).join('\n        ');
    const tracks = (r.tracks || []).map((t) => `<span class="mr-topic" style="background:var(--bg4);border:1px solid var(--border);color:var(--text3,#8891b0);">${T.esc(t)}</span>`).join(' ');
    return `<div class="tl-release">
      <h3>${T.esc(r.name)} ${T.statusPill(r.status === 'complete' ? 'approved' : (r.status === 'in_progress' ? 'in_progress' : 'planned'), r.status)}</h3>
      <div class="tl-sum">${T.esc(r.summary || '')}</div>
      <div style="margin-bottom:12px;display:flex;gap:4px;flex-wrap:wrap;">${tracks}</div>
      ${ms}
      <div class="src" style="margin-top:12px;"><a href="${T.esc(r.source_url)}" target="_blank" rel="noopener">${T.esc(T.hostOf(r.source_url))}</a> <span class="src-date">${T.esc(r.source_date)}</span></div>
    </div>`;
  }).join('\n    ');
}

function renderWgRows() {
  const counts = {};
  data.items.forEach((it) => (it.working_groups || []).forEach((wg) => { counts[wg] = (counts[wg] || 0) + 1; }));
  const max = Math.max(1, ...Object.values(counts));
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([wg, n]) => {
    const pct = Math.round((n / max) * 100);
    return `<div class="wg-row"><span class="wg-name">${T.esc(wg)}</span><div class="wg-bar"><div class="progress-track" style="width:100%"><div class="progress-fill" style="width:${pct}%;background:var(--teal)"></div></div></div><span class="wg-count">${n} item${n > 1 ? 's' : ''}</span></div>`;
  }).join('\n      ');
}

function renderChangelog(limit) {
  const entries = [...data.changelog].reverse().slice(0, limit || 12);
  return entries.map((c) => {
    const src = c.source_url ? ` <a href="${T.esc(c.source_url)}" target="_blank" rel="noopener" style="color:var(--teal);text-decoration:none;font-size:11px;">source ↗</a>` : '';
    return `<div class="cl-entry"><span class="cl-date">${T.esc(c.date)}</span><div class="cl-body"><div class="cl-summary"><span class="cl-tag">${T.esc(c.type)}</span>${T.esc(c.summary)}${src}</div></div></div>`;
  }).join('\n      ');
}

function renderItemRow(it) {
  const domains = it.domains.map((dId) => {
    const dom = data.domains.find((d) => d.id === dId);
    return dom ? `<a href="../${dom.page}" class="mr-topic" style="background:var(--bg4);border:1px solid var(--border);color:var(--text3,#8891b0);text-decoration:none;">${T.esc(dom.short || dom.name)}</a>` : '';
  }).join(' ');
  const wg = (it.working_groups || []).join(', ');
  return `<div class="titem">
      <div>
        <span class="ti-id">${T.esc(it.doc_id || it.id)}</span> ${T.clabel(it.classification)}
        <div class="ti-title">${T.esc(it.title)}</div>
        <div class="ti-meta"><span>${T.esc(wg)}</span><span>${T.esc(it.release || '')}</span>${domains}</div>
        ${it.notes ? `<div class="ti-notes">${T.esc(it.notes)}</div>` : ''}
        ${T.srcLine(it)}
      </div>
      <div class="ti-right">
        ${T.statusPill(it.status, it.status_label)}
        ${T.progressBar(it.completion)}
      </div>
    </div>`;
}

function buildTrackerDashboard() {
  const approved = data.items.filter((i) => i.status === 'approved').length;
  const inStudy = data.items.filter((i) => i.status === 'study' || i.status === 'in_progress' || i.status === 'draft' || i.status === 'agreed').length;
  const reqs = data.items.filter((i) => i.classification === 'requirement').length;
  const cands = data.items.filter((i) => i.classification === 'candidate').length;

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: '3GPP 6G standardization tracker',
    description: 'A source-tracked dataset of 3GPP Release 20/21 6G study items, technical reports, ITU-R IMT-2030 requirements and candidate technologies.',
    url: `${SITE}/tracker/`,
    creator: { '@type': 'Organization', name: 'ranbits' },
    dateModified: data.meta.generated,
    distribution: { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${SITE}/data/6g-tracker.json` },
  };

  const html = `${head({
    title: '6G Tracker — live 3GPP Release 20 / 21 status | ranbits',
    desc: 'Live, source-tracked status of 3GPP 6G standardization: Release 20/21 milestones, TR 38.914 and TR 22.870 progress, working-group activity and what changed recently. Study-phase — no normative 6G specs exist yet.',
    canonical: '/tracker/',
    keywords: '3GPP 6G tracker, 6G Release 21, 6G Release 20, TR 38.914, TR 22.870, IMT-2030, 6G standardization status, 6GR',
    jsonld,
  })}
<body>
<div class="page-body">

<div class="hero">
  <div class="breadcrumb">ranbits <span>›</span> 6G Tracker</div>
  <div class="module-tag" style="background:var(--blue-l);border:1px solid var(--blue-m);color:var(--blue);">
    <span style="width:6px;height:6px;border-radius:50%;background:var(--blue);display:inline-block;"></span>
    Live status · generated ${T.esc(data.meta.generated)}
  </div>
  <h1>6G Standardization <em>Tracker</em></h1>
  <p class="hero-lead">Where 3GPP 6G actually stands today — every entry carries a source and a date. This view is generated from a single canonical data file and updated by an automated daily job that only ever publishes changes it can tie to an authoritative source.</p>
</div>

<div class="content">

  <div class="study-note">
    <strong>Reality check.</strong> ${T.esc(data.meta.disclaimer)}
  </div>

  <div class="tracker-stats">
    ${renderStat(data.items.length, 'items tracked', 'var(--text)')}
    ${renderStat(approved, 'approved / complete', 'var(--green)')}
    ${renderStat(inStudy, 'in study / draft', 'var(--amber)')}
    ${renderStat(data.domains.length, 'topic domains', 'var(--blue)')}
  </div>

  <div class="prose">
    <h2>Release timeline</h2>
    <p>Dates prefixed with <code>~</code> are expectations reported by 3GPP or reputable secondary sources, not committed freeze dates.</p>
  </div>
  <div class="timeline">
    ${renderTimeline()}
  </div>

  <div class="prose"><h2>Activity by working group</h2>
  <p>Count of tracked study items, reports and agreements touching each 3GPP / ITU-R group. A rough heat-map of where 6G work is concentrated, not a progress percentage.</p></div>
  <div class="wg-rows">
      ${renderWgRows()}
  </div>

  <div class="prose"><h2>What changed recently</h2></div>
  <div class="changelog-feed">
      ${renderChangelog(12)}
  </div>
  <p style="font-family:var(--mono);font-size:11px;color:var(--muted);">Full machine-readable history: <a href="../data/6g-tracker.json" style="color:var(--teal);">data/6g-tracker.json</a> · <a href="../feed.xml" style="color:var(--teal);">feed.xml</a></p>

  <div class="prose"><h2>All tracked items</h2>
  <p>Every study item, technical report and agreement on the radar, with its classification, owning groups, status and source.</p></div>
  <div class="titems">
    ${data.items.map(renderItemRow).join('\n    ')}
  </div>

</div><!-- content -->

<div class="page-nav">
  <a href="../index.html"><span class="pn-label">← Back</span><span class="pn-title">Home</span></a>
  <a href="../6g/vision-requirements.html" class="next"><span class="pn-label">Topics →</span><span class="pn-title">6G Vision &amp; Requirements</span></a>
</div>

</div><!-- page-body -->
<script src="../js/main.js"></script>
<script>buildSidebar('tracker/index.html');</script>
</body>
</html>
`;
  const out = path.join(ROOT, 'tracker', 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  log('✓ rendered tracker/index.html');
}

// ════════════════════════════════════════════════════════════════════
// 2) PER-DOMAIN TRACKER BOXES  →  injected into 6g/*.html
// ════════════════════════════════════════════════════════════════════
function domainBox(domainId) {
  const dom = data.domains.find((d) => d.id === domainId);
  if (!dom) return `<!-- no domain "${domainId}" in tracker -->`;
  const items = T.itemsForDomain(data, domainId);
  const rows = items.map((it) => `      <div class="titem">
        <div>
          <span class="ti-id">${T.esc(it.doc_id || it.id)}</span> ${T.clabel(it.classification)}
          <div class="ti-title">${T.esc(it.title)}</div>
          ${it.notes ? `<div class="ti-notes">${T.esc(it.notes)}</div>` : ''}
          ${T.srcLine(it)}
        </div>
        <div class="ti-right">${T.statusPill(it.status, it.status_label)}${T.progressBar(it.completion)}</div>
      </div>`).join('\n');
  return `<div class="diagram-section">
    <div class="ds-header">
      <span class="ds-title">Tracker — what 3GPP / ITU-R is doing here</span>
      <span class="ds-ref"><a href="../tracker/index.html" style="color:var(--teal);text-decoration:none;">full tracker ↗</a></span>
    </div>
    <div class="ds-body" style="padding:0;">
      <div class="titems" style="margin:0;border:none;border-radius:0;">
${rows}
      </div>
    </div>
  </div>`;
}

function injectDomainBoxes() {
  let injected = 0;
  data.domains.forEach((dom) => {
    const file = path.join(ROOT, dom.page);
    if (!fs.existsSync(file)) { log(`  · skip ${dom.page} (not written yet)`); return; }
    let html = fs.readFileSync(file, 'utf8');
    const start = `<!-- TRACKER:${dom.id} -->`;
    const end = `<!-- /TRACKER:${dom.id} -->`;
    const re = new RegExp(esc(start) + '[\\s\\S]*?' + esc(end));
    if (!re.test(html)) { log(`  · ${dom.page} has no TRACKER:${dom.id} marker — skipped`); return; }
    const block = `${start}\n${domainBox(dom.id)}\n${end}`;
    const next = html.replace(re, block);
    if (next !== html) { fs.writeFileSync(file, next); injected++; }
  });
  log(`✓ injected ${injected} domain tracker box(es)`);
}
function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// ════════════════════════════════════════════════════════════════════
// 3) FEED  →  feed.xml  (Atom, from the changelog)
// ════════════════════════════════════════════════════════════════════
function buildFeed() {
  const updated = new Date(data.meta.generated + 'T00:00:00Z').toISOString();
  const entries = [...data.changelog].reverse().slice(0, 30).map((c, i) => {
    const id = `${SITE}/tracker/#${c.date}-${i}`;
    const when = new Date(c.date + 'T00:00:00Z').toISOString();
    const link = c.source_url || `${SITE}/tracker/`;
    const items = (c.items || []).length ? ` (items: ${c.items.join(', ')})` : '';
    return `  <entry>
    <title>${T.esc(c.summary)}</title>
    <id>${T.esc(id)}</id>
    <updated>${when}</updated>
    <link href="${T.esc(link)}"/>
    <category term="${T.esc(c.type)}"/>
    <content type="text">${T.esc(c.summary + items + (c.source_date ? ` [source ${c.source_date}]` : ''))}</content>
  </entry>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>ranbits — 6G standardization tracker</title>
  <subtitle>Source-tracked changes to 3GPP 6G / ITU-R IMT-2030 status.</subtitle>
  <id>${SITE}/feed.xml</id>
  <link href="${SITE}/feed.xml" rel="self"/>
  <link href="${SITE}/tracker/"/>
  <updated>${updated}</updated>
  <author><name>ranbits</name></author>
${entries}
</feed>
`;
  fs.writeFileSync(path.join(ROOT, 'feed.xml'), xml);
  log('✓ rendered feed.xml');
}

// ════════════════════════════════════════════════════════════════════
// 4) SITEMAP  →  sitemap.xml
// ════════════════════════════════════════════════════════════════════
function listModulePages() {
  const out = [];
  for (const dir of fs.readdirSync(ROOT)) {
    if (/^module\d+$/.test(dir)) {
      for (const f of fs.readdirSync(path.join(ROOT, dir))) {
        if (f.endsWith('.html')) out.push(`${dir}/${f}`);
      }
    }
  }
  return out.sort();
}

function buildSitemap() {
  const today = data.meta.generated;
  const urls = [];
  const add = (loc, prio) => urls.push({ loc, prio });
  add('/', '1.0');
  add('/tracker/', '0.9');
  data.domains.forEach((d) => add('/' + d.page, '0.8'));
  listModulePages().forEach((p) => add('/' + p, '0.5'));

  const body = urls.map((u) => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.prio}</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
  log(`✓ rendered sitemap.xml (${urls.length} urls)`);
}

// ── Run ──────────────────────────────────────────────────────────────
buildTrackerDashboard();
injectDomainBoxes();
buildFeed();
buildSitemap();
log('✓ build complete');
