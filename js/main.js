// Shared navigation data
const NAV = [
  {
    label: 'Module 0 — Introduction',
    items: [
      { title: 'What is 5G NR?', href: '../module0/0-1-intro.html' },
      { title: 'Architecture Overview', href: '../module0/0-2-architecture.html' },
    ]
  },
  {
    label: 'Module 1 — Fundamentals',
    items: [
      { title: 'OFDM & Multicarrier', href: '../module1/1-1-ofdm.html' },
      { title: 'Numerology & Frame Structure', href: '../module1/1-2-numerology.html' },
      { title: 'Resource Grid', href: '../module1/1-3-resource-grid.html' },
    ]
  },
  {
    label: 'Module 2 — Cell Search',
    items: [
      { title: 'GSCN & Frequency Raster', href: '../module2/2-1-gscn.html' },
      { title: 'SSB Structure', href: '../module2/2-2-ssb.html' },
      { title: 'PSS Detection', href: '../module2/2-3-pss.html' },
      { title: 'SSS Detection', href: '../module2/2-4-sss.html' },
      { title: 'PCI Derivation', href: '../module2/2-5-pci.html' },
    ]
  },
  {
    label: 'Module 3 — PBCH & MIB',
    items: [
      { title: 'PBCH Decoding', href: '../module3/3-1-pbch.html' },
      { title: 'MIB — Every Field', href: '../module3/3-2-mib.html' },
    ]
  },
  {
    label: 'Module 4 — Control Channels',
    items: [
      { title: 'CORESET#0 Derivation', href: '../module4/4-1-coreset.html' },
      { title: 'Search Space#0', href: '../module4/4-2-search-space.html' },
      { title: 'Blind Decoding', href: '../module4/4-3-blind-decoding.html' },
    ]
  },
  {
    label: 'Module 5 — SIB1 & Camp',
    items: [
      { title: 'SIB1 Contents', href: '../module5/5-1-sib1.html' },
      { title: 'S-Criterion', href: '../module5/5-2-s-criterion.html' },
      { title: 'PLMN & Access Control', href: '../module5/5-3-plmn.html' },
    ]
  },
  {
    label: 'Module 6 — RACH',
    items: [
      { title: 'RACH Overview', href: '../module6/6-1-rach-overview.html' },
      { title: 'Msg1 — Preamble', href: '../module6/6-2-msg1.html' },
      { title: 'Msg2 — RAR', href: '../module6/6-3-msg2.html' },
      { title: 'Msg3/4 — RRC Setup', href: '../module6/6-4-msg3.html' },
    ]
  },
  {
    label: 'Module 7 — RRC',
    items: [
      { title: 'RRC States', href: '../module7/7-1-rrc-states.html' },
      { title: 'RRC Setup', href: '../module7/7-2-rrc-setup.html' },
    ]
  },
  {
    label: 'Module 8 — Scheduling',
    items: [
      { title: 'DCI Formats', href: '../module8/8-1-dci.html' },
      { title: 'Downlink Scheduling', href: '../module8/8-2-dl-scheduling.html' },
      { title: 'Uplink Scheduling', href: '../module8/8-3-ul-scheduling.html' },
      { title: 'HARQ', href: '../module8/8-4-harq.html' },
    ]
  },
  {
    label: 'Module 9 — Protocol Stack',
    items: [
      { title: 'MAC Layer', href: '../module9/9-1-mac.html' },
      { title: 'RLC Layer', href: '../module9/9-2-rlc.html' },
      { title: 'PDCP Layer', href: '../module9/9-3-pdcp.html' },
      { title: 'SDAP Layer', href: '../module9/9-4-sdap.html' },
    ]
  },
  {
    label: 'Module 10 — Beamforming',
    items: [
      { title: 'Massive MIMO Basics', href: '../module10/10-1-mimo.html' },
      { title: 'SSB Beam Sweep', href: '../module10/10-2-beam-sweep.html' },
      { title: 'TCI States', href: '../module10/10-3-tci.html' },
    ]
  },
];

// Module 2 pages that are complete
const COMPLETE = [
  '2-1-gscn.html', '2-2-ssb.html', '2-3-pss.html',
  '2-4-sss.html', '2-5-pci.html'
];

function buildSidebar(currentFile) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  let html = `<a href="../index.html" class="sidebar-logo">
    <div class="wordmark">5G From Scratch</div>
    <div class="sub">3GPP NR — Complete Guide</div>
  </a>`;

  NAV.forEach(section => {
    html += `<div class="nav-section">
      <div class="nav-section-label">${section.label}</div>`;
    section.items.forEach(item => {
      const file = item.href.split('/').pop();
      const isCurrent = file === currentFile;
      const isDone = COMPLETE.includes(file);
      let cls = 'nav-item';
      if (isCurrent) cls += ' active';
      else if (isDone) cls += ' done';
      else cls += ' locked';
      const href = isDone || isCurrent ? item.href : '#';
      html += `<a href="${href}" class="${cls}">${item.title}</a>`;
    });
    html += `</div>`;
  });

  sidebar.innerHTML = html;
}

// Scroll reveal
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// Canvas helper
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

document.addEventListener('DOMContentLoaded', initReveal);
