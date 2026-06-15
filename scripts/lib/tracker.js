'use strict';
// ─────────────────────────────────────────────────────────────────────
// Shared helpers for the ranbits 6G tracker.
// Used by scripts/build.js (render) and scripts/fetch-3gpp-status.js
// (safe daily update). Zero external dependencies — Node built-ins only.
// ─────────────────────────────────────────────────────────────────────
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA_PATH = path.join(ROOT, 'data', '6g-tracker.json');

function loadData(p = DATA_PATH) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function saveData(data, p = DATA_PATH) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}

// ── Validation ───────────────────────────────────────────────────────
// Targeted guardrail validation. Enforces the accuracy rules directly:
// every requirement/candidate carries a source; completion is null or a
// real 0–100 integer; references resolve; changelog entries are sourced.
const CLASSIFICATIONS = ['requirement', 'candidate', 'foundation'];
const ITEM_STATUS = ['approved', 'in_progress', 'planned', 'agreed', 'draft', 'study'];
const ITEM_TYPES = ['study_item', 'work_item', 'tr', 'ts', 'recommendation', 'agreement', 'spectrum'];

function validateTracker(data) {
  const errors = [];
  const E = (m) => errors.push(m);

  if (!data || typeof data !== 'object') { return { ok: false, errors: ['root is not an object'] }; }
  for (const k of ['meta', 'releases', 'items', 'domains', 'changelog']) {
    if (!(k in data)) E(`missing top-level key: ${k}`);
  }
  if (!data.meta || !data.meta.generated) E('meta.generated missing');

  const itemIds = new Set();
  (data.items || []).forEach((it, i) => {
    const at = `items[${i}] (${it && it.id || '?'})`;
    if (!it.id) E(`${at}: missing id`);
    else { if (itemIds.has(it.id)) E(`${at}: duplicate id`); itemIds.add(it.id); }
    if (!it.title) E(`${at}: missing title`);
    if (!CLASSIFICATIONS.includes(it.classification)) E(`${at}: bad classification "${it.classification}"`);
    if (!ITEM_TYPES.includes(it.type)) E(`${at}: bad type "${it.type}"`);
    if (!ITEM_STATUS.includes(it.status)) E(`${at}: bad status "${it.status}"`);
    if (!Array.isArray(it.domains) || it.domains.length === 0) E(`${at}: domains must be a non-empty array`);
    // Guardrail: completion is null OR an integer 0..100 — never a guess string.
    if (it.completion !== null && it.completion !== undefined) {
      if (!Number.isInteger(it.completion) || it.completion < 0 || it.completion > 100) {
        E(`${at}: completion must be null or an integer 0..100 (got ${JSON.stringify(it.completion)})`);
      }
    }
    // Guardrail: requirement & candidate facts MUST be sourced + dated.
    if (it.classification === 'requirement' || it.classification === 'candidate') {
      if (!it.source_url) E(`${at}: ${it.classification} fact has no source_url`);
      if (!it.source_date) E(`${at}: ${it.classification} fact has no source_date`);
    }
    if (it.source_tier && !['primary', 'secondary'].includes(it.source_tier)) E(`${at}: bad source_tier`);
  });

  // Domain references must resolve.
  (data.domains || []).forEach((d, i) => {
    const at = `domains[${i}] (${d && d.id || '?'})`;
    if (!d.id) E(`${at}: missing id`);
    if (!d.page) E(`${at}: missing page`);
    (d.items || []).forEach((ref) => { if (!itemIds.has(ref)) E(`${at}: unknown item ref "${ref}"`); });
  });

  // Changelog: non-manual entries must be sourced.
  (data.changelog || []).forEach((c, i) => {
    const at = `changelog[${i}]`;
    if (!c.date) E(`${at}: missing date`);
    if (!c.summary) E(`${at}: missing summary`);
    if (c.source_tier && c.source_tier !== 'manual' && !c.source_url) E(`${at}: sourced entry missing source_url`);
  });

  return { ok: errors.length === 0, errors };
}

// ── HTML helpers ─────────────────────────────────────────────────────
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const CLABEL = {
  requirement: '<span class="clabel clabel-req">requirement</span>',
  candidate:   '<span class="clabel clabel-cand">candidate</span>',
  foundation:  '<span class="clabel clabel-found">foundation</span>',
};
function clabel(c) { return CLABEL[c] || ''; }

const STATUS_PILL = {
  approved:    ['sp-approved', 'Approved'],
  in_progress: ['sp-progress', 'In progress'],
  study:       ['sp-study', 'Study'],
  agreed:      ['sp-agreed', 'Agreed'],
  draft:       ['sp-draft', 'Draft'],
  planned:     ['sp-planned', 'Planned'],
};
function statusPill(status, label) {
  const [cls, def] = STATUS_PILL[status] || ['sp-planned', status];
  return `<span class="status-pill ${cls}">${esc(label || def)}</span>`;
}

function srcLine(item) {
  if (!item.source_url) return '';
  const tier = item.source_tier === 'secondary'
    ? ' <span class="src-tier">secondary</span>' : '';
  return `<span class="src"><a href="${esc(item.source_url)}" target="_blank" rel="noopener">`
    + `${esc(hostOf(item.source_url))}</a> <span class="src-date">${esc(item.source_date || '')}</span>${tier}</span>`;
}

function hostOf(url) {
  try { return new URL(url).host.replace(/^www\./, ''); } catch { return url; }
}

function itemsForDomain(data, domainId) {
  const dom = data.domains.find((d) => d.id === domainId);
  if (!dom) return [];
  const byId = new Map(data.items.map((i) => [i.id, i]));
  return dom.items.map((ref) => byId.get(ref)).filter(Boolean);
}

function progressBar(completion) {
  if (completion === null || completion === undefined) return '<span class="progress-na">no % published</span>';
  return `<div class="progress-track" title="${completion}% complete"><div class="progress-fill" style="width:${completion}%"></div></div>`;
}

module.exports = {
  ROOT, DATA_PATH, loadData, saveData, validateTracker,
  esc, clabel, statusPill, srcLine, hostOf, itemsForDomain, progressBar,
  CLASSIFICATIONS,
};
