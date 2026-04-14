// ═══════════════════════════════════════════
// CANVAS COLORS — light theme
// ═══════════════════════════════════════════
const C = {
  blue:'#2563eb', blueL:'#eff6ff', blueM:'#bfdbfe',
  teal:'#0d9488', tealL:'#f0fdfa', tealM:'#99f6e4',
  amber:'#d97706', amberL:'#fffbeb', amberM:'#fde68a',
  coral:'#dc2626', coralL:'#fef2f2', coralM:'#fecaca',
  purple:'#7c3aed', purpleL:'#f5f3ff', purpleM:'#ddd6fe',
  green:'#059669', greenL:'#ecfdf5', greenM:'#a7f3d0',
  text:'#111827', text2:'#374151', text3:'#6b7280',
  muted:'#9ca3af', faint:'#d1d5db',
  border:'rgba(0,0,0,0.08)', border2:'rgba(0,0,0,0.14)',
  bg:'#ffffff', bg2:'#f7f8fa', bg3:'#f0f2f5', bg4:'#e8ebf0',
  codeBg:'#f8fafc',
};

// ═══════════════════════════════════════════
// NAVIGATION DATA
// ═══════════════════════════════════════════
const MODULES = [
  { num:'0', label:'Introduction', items:[
    { title:'What is 5G NR?', href:'../module0/0-1-intro.html' },
    { title:'5G Architecture', href:'../module0/0-2-architecture.html' },
    { title:'FR1 vs FR2 Bands', href:'../module0/0-3-bands.html' },
  ]},
  { num:'1', label:'Fundamentals', items:[
    { title:'OFDM & Multicarrier', href:'../module1/1-1-ofdm.html' },
    { title:'Numerology & Frame Structure', href:'../module1/1-2-numerology.html' },
    { title:'Resource Grid', href:'../module1/1-3-resource-grid.html' },
  ]},
  { num:'2', label:'Cell Search', items:[
    { title:'GSCN & Frequency Raster', href:'../module2/2-1-gscn.html' },
    { title:'SSB Structure', href:'../module2/2-2-ssb.html' },
    { title:'PSS Detection', href:'../module2/2-3-pss.html' },
    { title:'SSS Detection', href:'../module2/2-4-sss.html' },
    { title:'PCI Derivation', href:'../module2/2-5-pci.html' },
  ]},
  { num:'3', label:'PBCH & MIB', items:[
    { title:'PBCH Decoding', href:'../module3/3-1-pbch.html' },
    { title:'MIB — Every Field', href:'../module3/3-2-mib.html' },
  ]},
  { num:'4', label:'Control Channels', items:[
    { title:'CORESET#0 Derivation', href:'../module4/4-1-coreset.html' },
    { title:'Search Space#0', href:'../module4/4-2-search-space.html' },
    { title:'Blind Decoding', href:'../module4/4-3-blind-decoding.html' },
  ]},
  { num:'5', label:'SIB1 & Camp', items:[
    { title:'SIB1 Contents', href:'../module5/5-1-sib1.html' },
    { title:'S-Criterion', href:'../module5/5-2-s-criterion.html' },
    { title:'PLMN & Access Control', href:'../module5/5-3-plmn.html' },
  ]},
  { num:'6', label:'RACH', items:[
    { title:'RACH Overview', href:'../module6/6-1-rach-overview.html' },
    { title:'Msg1 — Preamble', href:'../module6/6-2-msg1.html' },
    { title:'Msg2 — RAR', href:'../module6/6-3-msg2.html' },
    { title:'Msg3/4 — RRC Setup', href:'../module6/6-4-msg3.html' },
  ]},
  { num:'7', label:'RRC', items:[
    { title:'RRC States', href:'../module7/7-1-rrc-states.html' },
    { title:'RRC Setup Details', href:'../module7/7-2-rrc-setup.html' },
  ]},
  { num:'8', label:'Scheduling', items:[
    { title:'DCI Formats', href:'../module8/8-1-dci.html' },
    { title:'Downlink Scheduling', href:'../module8/8-2-dl-scheduling.html' },
    { title:'Uplink Scheduling', href:'../module8/8-3-ul-scheduling.html' },
    { title:'HARQ', href:'../module8/8-4-harq.html' },
  ]},
  { num:'9', label:'Protocol Stack', items:[
    { title:'MAC Layer', href:'../module9/9-1-mac.html' },
    { title:'RLC Layer', href:'../module9/9-2-rlc.html' },
    { title:'PDCP Layer', href:'../module9/9-3-pdcp.html' },
    { title:'SDAP Layer', href:'../module9/9-4-sdap.html' },
  ]},
  { num:'10', label:'Beamforming', items:[
    { title:'Massive MIMO Basics', href:'../module10/10-1-mimo.html' },
    { title:'SSB Beam Sweep', href:'../module10/10-2-beam-sweep.html' },
    { title:'TCI States', href:'../module10/10-3-tci.html' },
  ]},
  { num:'11', label:'NAS & Core', items:[
    { title:'NAS Layer Overview', href:'../module11/11-1-nas.html' },
    { title:'Registration & Authentication', href:'../module11/11-2-registration.html' },
    { title:'PDU Session Establishment', href:'../module11/11-3-pdu-session.html' },
  ]},
  { num:'12', label:'Mobility', items:[
    { title:'Handover Procedure', href:'../module12/12-1-handover.html' },
    { title:'TDD Slot Formats', href:'../module12/12-2-tdd.html' },
    { title:'Carrier Aggregation', href:'../module12/12-3-ca.html' },
  ]},
];

const COMPLETE_FILES = [
  '0-1-intro.html','0-2-architecture.html','0-3-bands.html',
  '1-1-ofdm.html','1-2-numerology.html','1-3-resource-grid.html',
  '2-1-gscn.html','2-2-ssb.html','2-3-pss.html','2-4-sss.html','2-5-pci.html',
  '3-1-pbch.html','3-2-mib.html',
  '4-1-coreset.html','4-2-search-space.html','4-3-blind-decoding.html',
  '5-1-sib1.html','5-2-s-criterion.html','5-3-plmn.html',
  '6-1-rach-overview.html','6-2-msg1.html','6-3-msg2.html','6-4-msg3.html',
  '7-1-rrc-states.html','7-2-rrc-setup.html',
  '8-1-dci.html','8-2-dl-scheduling.html','8-3-ul-scheduling.html','8-4-harq.html',
  '9-1-mac.html','9-2-rlc.html','9-3-pdcp.html','9-4-sdap.html',
  '10-1-mimo.html','10-2-beam-sweep.html','10-3-tci.html',
  '11-1-nas.html','11-2-registration.html','11-3-pdu-session.html',
  '12-1-handover.html','12-2-tdd.html','12-3-ca.html',
];

// ═══════════════════════════════════════════
// BUILD VERTICAL SIDE NAV
// ═══════════════════════════════════════════
function buildSidebar(currentFile) {
  // Create hamburger toggle
  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', 'Open navigation');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  document.body.insertBefore(toggle, document.body.firstChild);

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  // Create sidebar
  const nav = document.createElement('nav');
  nav.className = 'side-nav';
  nav.setAttribute('aria-label', 'Site navigation');

  let html = `<a href="../index.html" class="side-nav-logo">
    <span class="wordmark">5G From Scratch</span>
    <span class="sub">Complete NR Guide</span>
  </a>`;

  MODULES.forEach(mod => {
    html += `<div class="nav-group">
      <span class="nav-group-label">Module ${mod.num} — ${mod.label}</span>`;
    mod.items.forEach(item => {
      const file = item.href.split('/').pop();
      const isCurrent = file === currentFile;
      const isDone = COMPLETE_FILES.includes(file);
      let cls = 'nav-item';
      if (isCurrent) cls += ' active';
      else if (isDone) cls += ' done';
      else cls += ' locked';
      const href = (isDone || isCurrent) ? item.href : '#';
      const aria = isCurrent ? ' aria-current="page"' : '';
      html += `<a href="${href}" class="${cls}"${aria}>${item.title}</a>`;
    });
    html += `</div>`;
  });

  nav.innerHTML = html;
  document.body.insertBefore(nav, document.body.firstChild);

  // Mobile toggle logic
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    overlay.classList.toggle('open');
  });
  overlay.addEventListener('click', () => {
    nav.classList.remove('open');
    overlay.classList.remove('open');
  });

  // Close nav on link click (mobile)
  nav.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      overlay.classList.remove('open');
    });
  });

  // Scroll active item into view
  const activeItem = nav.querySelector('.nav-item.active');
  if (activeItem) {
    setTimeout(() => {
      activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 100);
  }
}

// ═══════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ═══════════════════════════════════════════
// CANVAS HELPER
// ═══════════════════════════════════════════
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

document.addEventListener('DOMContentLoaded', initReveal);
