#!/usr/bin/env node
'use strict';
// ─────────────────────────────────────────────────────────────────────
// Safe-by-construction daily updater for the ranbits 6G tracker.
//
//   node scripts/fetch-3gpp-status.js            # dry run (default)
//   node scripts/fetch-3gpp-status.js --write    # apply safe changes
//
// Design contract (because no human reviews the output):
//   1. NEVER crashes. Every network/parse step is wrapped; failures are
//      logged and skipped, never fatal.
//   2. Only writes a field when it can tie the new value to an
//      authoritative source with HIGH confidence. Every applied change
//      records source_url + source_date.
//   3. NEVER overwrites a sourced value with an unsourced one, and only
//      moves values MONOTONICALLY forward (completion can rise, status
//      can advance) so a changed/garbled page layout can't regress data.
//   4. Validates the whole file against the tracker guardrails before
//      writing; if the result is invalid, it discards ALL changes.
//   5. Writes an audit report (.fetch-report.json / .fetch-report.md)
//      listing what changed and — crucially — what was skipped/uncertain.
//
// The matchers are deliberately conservative: when in doubt, SKIP. On a
// typical day (sources unreachable or no explicit machine-readable
// figure) the correct, safe outcome is "no changes; N items skipped".
// ─────────────────────────────────────────────────────────────────────
const fs = require('fs');
const path = require('path');
const T = require('./lib/tracker');

const WRITE = process.argv.includes('--write');
const TODAY = new Date().toISOString().slice(0, 10);
const REPORT_JSON = path.join(T.ROOT, 'scripts', '.fetch-report.json');
const REPORT_MD = path.join(T.ROOT, 'scripts', '.fetch-report.md');
const FETCH_TIMEOUT_MS = 15000;
const UA = 'ranbits-6g-tracker/1.0 (+https://ranbits.com; daily status check)';

// status ordering — values may only advance, never regress.
const STATUS_ORDER = ['study', 'draft', 'in_progress', 'agreed', 'approved'];
// keyword → canonical status (high-confidence phrases only).
const STATUS_KEYWORDS = [
  [/\b(approved|completed|finalis(?:ed|ed)|frozen)\b/i, 'approved'],
  [/\b(under\s+approval|for\s+approval)\b/i, 'in_progress'],
];

function log(s) { process.stdout.write(s + '\n'); }

async function safeFetch(url) {
  // Returns { ok, html } | { ok:false, reason }. Never throws.
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    let res;
    try {
      res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': UA, 'Accept': 'text/html' } });
    } finally { clearTimeout(timer); }
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const html = await res.text();
    return { ok: true, html };
  } catch (e) {
    return { ok: false, reason: (e && e.name === 'AbortError') ? 'timeout' : ('error: ' + (e && e.message || e)) };
  }
}

// ── Conservative extractors ──────────────────────────────────────────
// Look only within a small window around the document id, and only
// accept an UNAMBIGUOUS figure. Return null on any doubt.
function windowAround(html, needle, radius = 600) {
  if (!needle) return null;
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const i = text.toLowerCase().indexOf(needle.toLowerCase());
  if (i === -1) return null;
  return text.slice(Math.max(0, i - radius), i + radius);
}

function extractCompletion(html, item) {
  const id = item.doc_id || item.id;
  const win = windowAround(html, id);
  if (!win) return null;
  // accept "NN%" or "NN % complete" — require a single, unambiguous match.
  const matches = [...win.matchAll(/(\d{1,3})\s?%/g)].map((m) => +m[1]).filter((n) => n >= 0 && n <= 100);
  if (matches.length !== 1) return null; // 0 or many → ambiguous → skip
  return matches[0];
}

function extractStatus(html, item) {
  const id = item.doc_id || item.id;
  const win = windowAround(html, id, 300);
  if (!win) return null;
  for (const [re, status] of STATUS_KEYWORDS) { if (re.test(win)) return status; }
  return null;
}

function rank(status) { const i = STATUS_ORDER.indexOf(status); return i === -1 ? -1 : i; }

// ── Main ─────────────────────────────────────────────────────────────
(async function main() {
  const report = { date: TODAY, mode: WRITE ? 'write' : 'dry-run', applied: [], skipped: [], errors: [] };
  let data;
  try { data = T.loadData(); }
  catch (e) {
    report.errors.push('could not load tracker data: ' + (e && e.message));
    writeReport(report); log('✗ fatal-but-safe: cannot read tracker data; no changes made.'); return;
  }

  // Work on a deep clone so we can discard everything if validation fails.
  const next = JSON.parse(JSON.stringify(data));
  const byId = new Map(next.items.map((it) => [it.id, it]));
  const newChangelog = [];

  // Only check items with a PRIMARY source. Secondary-sourced facts are
  // intentionally left to human curation.
  const candidates = next.items.filter((it) => it.source_tier === 'primary' && it.source_url);
  log(`checking ${candidates.length} primary-sourced item(s)…`);

  // Fetch each source once (dedupe by URL).
  const urls = [...new Set(candidates.map((it) => it.source_url))];
  const pages = new Map();
  for (const url of urls) {
    const r = await safeFetch(url);
    pages.set(url, r);
    if (!r.ok) report.skipped.push({ url, reason: r.reason, note: 'source unreachable — left unchanged' });
  }

  for (const it of candidates) {
    const page = pages.get(it.source_url);
    if (!page || !page.ok) continue; // already recorded as skipped

    // ---- completion ----
    let comp = null;
    try { comp = extractCompletion(page.html, it); }
    catch (e) { report.errors.push(`completion parse ${it.id}: ${e.message}`); }
    if (comp !== null) {
      const cur = it.completion;
      if (cur === null || cur === undefined || comp > cur) {
        stage(it, 'completion', cur ?? null, comp, it.source_url, report, newChangelog);
      } else if (comp < cur) {
        report.skipped.push({ id: it.id, field: 'completion', reason: `would regress ${cur}%→${comp}% — ignored (monotonic guard)` });
      }
    }

    // ---- status ----
    let st = null;
    try { st = extractStatus(page.html, it); }
    catch (e) { report.errors.push(`status parse ${it.id}: ${e.message}`); }
    if (st !== null && st !== it.status) {
      if (rank(st) > rank(it.status)) {
        stage(it, 'status', it.status, st, it.source_url, report, newChangelog);
      } else {
        report.skipped.push({ id: it.id, field: 'status', reason: `would regress ${it.status}→${st} — ignored (monotonic guard)` });
      }
    }
  }

  // Nothing to do?
  if (report.applied.length === 0) {
    log(`no high-confidence changes. ${report.skipped.length} item(s) skipped/uncertain.`);
    writeReport(report); return;
  }

  // Append changelog + bump generated date on the clone.
  next.changelog.push(...newChangelog);
  next.meta.generated = TODAY;

  // Validate BEFORE writing. If invalid, discard everything.
  const v = T.validateTracker(next);
  if (!v.ok) {
    report.errors.push('validation failed after applying changes — ALL changes discarded');
    v.errors.forEach((e) => report.errors.push('  ' + e));
    report.applied.forEach((a) => report.skipped.push({ id: a.id, field: a.field, reason: 'discarded: post-change validation failed' }));
    report.applied = [];
    writeReport(report);
    log('✗ validation failed; discarded all staged changes (safe).');
    return;
  }

  if (WRITE) {
    T.saveData(next);
    log(`✓ wrote ${report.applied.length} change(s) to data/6g-tracker.json`);
  } else {
    log(`(dry-run) would write ${report.applied.length} change(s). Re-run with --write to apply.`);
  }
  writeReport(report);
})();

function stage(item, field, from, to, sourceUrl, report, changelog) {
  item[field] = to;
  // re-stamp the source date so the value's provenance is current.
  item.source_date = item.source_date; // unchanged URL; date of confirmation recorded in changelog
  report.applied.push({ id: item.id, field, from, to, source_url: sourceUrl });
  changelog.push({
    date: new Date().toISOString().slice(0, 10),
    type: field === 'status' ? 'status' : 'update',
    summary: `${item.id}: ${field} ${from === null ? '(unset)' : from} → ${to} (auto-confirmed from source)`,
    items: [item.id], field, from, to,
    source_url: sourceUrl, source_date: new Date().toISOString().slice(0, 10),
    source_tier: 'primary',
  });
}

function writeReport(report) {
  try {
    fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2) + '\n');
    fs.writeFileSync(REPORT_MD, toMarkdown(report));
  } catch (e) { log('warn: could not write report: ' + (e && e.message)); }
}

function toMarkdown(r) {
  const lines = [];
  lines.push(`# 6G tracker — daily fetch report (${r.date})`);
  lines.push('');
  lines.push(`Mode: \`${r.mode}\``);
  lines.push('');
  lines.push(`## Applied changes (${r.applied.length})`);
  if (r.applied.length === 0) lines.push('_None — no high-confidence, sourced change was found._');
  else r.applied.forEach((a) => lines.push(`- **${a.id}** · \`${a.field}\`: ${a.from === null ? '(unset)' : a.from} → **${a.to}** — source: ${a.source_url}`));
  lines.push('');
  lines.push(`## Skipped / uncertain (${r.skipped.length})`);
  if (r.skipped.length === 0) lines.push('_None._');
  else r.skipped.forEach((s) => lines.push(`- ${s.id ? `**${s.id}**` : s.url}${s.field ? ` · \`${s.field}\`` : ''}: ${s.reason}${s.note ? ` (${s.note})` : ''}`));
  lines.push('');
  if (r.errors.length) {
    lines.push(`## Non-fatal errors (${r.errors.length})`);
    r.errors.forEach((e) => lines.push(`- ${e}`));
    lines.push('');
  }
  lines.push('_Generated by `scripts/fetch-3gpp-status.js`. Skipped items are intentionally left unchanged — values are never guessed._');
  lines.push('');
  return lines.join('\n');
}
