#!/usr/bin/env node
'use strict';
// ─────────────────────────────────────────────────────────────────────
// One-shot (idempotent) transform that reframes the existing 5G NR
// module pages as "Foundations" for the 6G repositioning:
//   • inserts a Foundations banner with a forward-link to the matching
//     6G topic (as the first child of .content)
//   • adds a <link rel="canonical"> for SEO
//   • rebrands the <title> suffix from "5G From Scratch" to
//     "ranbits — 5G Foundations"
// URLs and page content are otherwise untouched.
//
//   node scripts/reframe-foundations.js
// ─────────────────────────────────────────────────────────────────────
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://ranbits.com';

// Map each module (dir, or specific file) to the 6G topic it evolves into.
const DIR_MAP = {
  module0:  ['../6g/vision-requirements.html', '6G vision, scenarios & requirements'],
  module1:  ['../6g/radio-physical-layer.html', 'OFDM, numerology & the 6G frame'],
  module2:  ['../6g/radio-physical-layer.html', 'initial access & sync in 6G'],
  module3:  ['../6g/radio-physical-layer.html', 'broadcast & the 6G physical layer'],
  module4:  ['../6g/radio-physical-layer.html', 'control channels in 6G'],
  module5:  ['../6g/radio-physical-layer.html', 'system information in 6G'],
  module6:  ['../6g/radio-physical-layer.html', 'random access in 6G'],
  module7:  ['../6g/core-architecture.html',    'the 6G core & connection control'],
  module8:  ['../6g/radio-physical-layer.html', 'scheduling on the 6G air interface'],
  module9:  ['../6g/core-architecture.html',    'the 6G protocol stack & core'],
  module10: ['../6g/ai-native-air-interface.html', 'AI-driven beam management in 6G'],
  module11: ['../6g/core-architecture.html',    'the service-based 6G core'],
  module12: ['../6g/radio-physical-layer.html', 'frame structure, TDD & CA in 6G'],
};
const FILE_MAP = {
  '0-2-architecture.html': ['../6g/core-architecture.html', 'the 6G core & architecture'],
  '0-3-bands.html':    ['../6g/spectrum.html',  '6G spectrum — upper mid-band, cmWave, sub-THz'],
  '2-1-gscn.html':     ['../6g/spectrum.html',  '6G spectrum & frequency rasters'],
  '10-1-mimo.html':    ['../6g/ris.html',       'RIS — beamforming on a surface in 6G'],
  '10-3-tci.html':     ['../6g/ai-native-air-interface.html', 'AI-driven beam indication in 6G'],
  '11-2-registration.html': ['../6g/security.html', '6G security & the quantum era'],
  '12-1-handover.html': ['../6g/ntn.html',      'mobility & ubiquitous connectivity in 6G'],
};

function banner(href, label) {
  return `<div class="foundations-banner" style="margin-bottom:28px;">
  <span class="fb-tag">Foundations · 5G NR</span>
  <span class="fb-text">This is the established 5G NR basis that 6G builds on. 6G is this site's primary focus — here is how the idea evolves: <em>${label}</em>.</span>
  <a class="fb-link" href="${href}">How this evolves in 6G →</a>
</div>`;
}

let changed = 0, skipped = 0;
for (const dir of fs.readdirSync(ROOT)) {
  if (!/^module\d+$/.test(dir)) continue;
  for (const file of fs.readdirSync(path.join(ROOT, dir))) {
    if (!file.endsWith('.html')) continue;
    const fp = path.join(ROOT, dir, file);
    let html = fs.readFileSync(fp, 'utf8');
    let touched = false;

    // 1) Foundations banner (idempotent)
    if (!html.includes('foundations-banner')) {
      const [href, label] = FILE_MAP[file] || DIR_MAP[dir] || DIR_MAP.module2;
      const anchor = '<div class="content">';
      const idx = html.indexOf(anchor);
      if (idx !== -1) {
        const at = idx + anchor.length;
        html = html.slice(0, at) + '\n' + banner(href, label) + html.slice(at);
        touched = true;
      }
    }

    // 2) canonical link (idempotent)
    if (!html.includes('rel="canonical"')) {
      const canon = `<link rel="canonical" href="${SITE}/${dir}/${file}">`;
      html = html.replace('</head>', `${canon}\n</head>`);
      touched = true;
    }

    // 3) title rebrand (idempotent)
    if (html.includes('| 5G From Scratch')) {
      html = html.replace('| 5G From Scratch', '| ranbits — 5G Foundations');
      touched = true;
    }

    if (touched) { fs.writeFileSync(fp, html); changed++; }
    else skipped++;
  }
}
process.stdout.write(`✓ reframe complete — ${changed} file(s) updated, ${skipped} already current\n`);
