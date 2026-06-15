# BUILD REPORT — ranbits.com 5G → 6G repositioning

**Date:** 2026-06-15 · **Run mode:** autonomous · **Reviewer:** none (this report
is the credibility audit trail in place of live review).

This document records: (1) the 6G topic taxonomy chosen and why; (2) every
new / changed / repurposed file; (3) every **published fact** with its source
and its `requirement` / `candidate` / `foundation` label; and (4) — clearly
separated — **everything that could not be sourced** and was therefore left
unverified or omitted.

The governing constraint throughout: **there are no normative 6G specifications
yet.** 3GPP 6G is in the study phase; the first 6G specs are expected in
Release 21 (~2029). No value on the site is presented as a 6G "spec value".

---

## ⚑ Addendum — deployed to `master` (light theme)

The body of this report was first written against the repo's `main` branch.
That turned out to be a **stale, partial, dark-themed snapshot**. The live site
(custom domain, GitHub Pages) is the **`master`** branch — an unrelated history
that is richer and **light-themed**: it has the full **module0–12** course
(OFDM, NAS, registration, handover, CA, …), plus `ads.txt`, a refined SEO setup,
and `CNAME`. The 6G work was therefore **re-applied onto `master`** with these
adjustments (per the user's choice: light theme, commit straight to master):

- **Light re-skin.** All 9 topic pages adopt master's `.page-body` skeleton and
  light palette; the 6G CSS block was rewritten with master's `-l`/`-m` colour
  variables. Interactive **canvases stay dark** — matching master's existing
  module diagrams (a dark "screen" on the light page).
- **Full Foundations preserved.** All **42** module pages (module0–12) get the
  Foundations banner with a forward-link to the matching 6G topic. Master's SEO
  titles and existing `rel="canonical"` tags are left untouched; `ads.txt`,
  `CNAME`, and module content are **not modified**.
- **Nav.** `js/main.js` keeps master's `MODULES`/`buildSidebar`/`roundRect`/
  `initReveal` and gains a primary **6G** section above the Foundations modules.
- **Counts on master:** sitemap = **53 URLs**; link check = **367/367** resolve;
  **23/23** requirement/candidate claims sourced; JSON/JSON-LD/XML all valid.
- Items in the file manifest below that say "rewritten"/"30 module pages"/
  "added CNAME"/"added responsive CSS" describe the original `main` build; on
  `master`, CNAME and responsive CSS already existed and the module count is 42.

Everything in the source ledger (§3) and the could-not-source list (§4) is
unchanged — the facts, labels and sources are identical regardless of theme.

---

## 0. Baseline verification (done on this run)

The starting baseline was verified against live sources on 2026-06-15
(WebSearch + WebFetch). Findings, all consistent with the brief's starting
baseline:

- **Release 20** runs a dual track — 5G-Advanced (Rel-20_5GA) + early-6G study
  (Rel-20_6G). _(3gpp.org/release-20)_
- **TR 22.870** (Stage-1 6G use cases/requirements, SA1) — **approved at TSG
  SA#111, Fukuoka, 9–13 Mar 2026**, ~590 pages. _(3gpp.org/fukuoka-tsg111)_
- **TR 38.914** (6G scenarios & requirements, RAN) — **~60% complete (Mar 2026)**,
  approval targeted **~Jun 2026**. _(3gpp.org/ran-6g-study1)_
- **6G Radio (6GR)** study underway in RAN; RAN1 working assumption = CP-OFDM +
  DFT-s-OFDM baseline waveform. _(secondary: the-mobile-network, keysight)_
- **Release 21** = first 6G specs; timeline expected finalised ~mid-2026;
  ASN.1/OpenAPI freeze projected ~2029; commercial ~2030. _(3gpp.org/release-21,
  qualcomm)_
- **ITU-R IMT-2030**: Recommendation **M.2160-0 (2023)** framework, six usage
  scenarios, ~9 capabilities with **example** targets. **Minimum** TPRs still in
  draft (WP 5D Feb 2026; SG5 approval scheduled ~Dec 2026; values restricted to
  members). _(itu.int)_

> ⚠️ **Sourcing caveat that shaped everything below:** `3gpp.org` returns
> **HTTP 403** to automated fetching. Primary 3GPP pages are cited as the
> canonical source (correct attribution), but their content was cross-checked
> via search-result summaries and reputable secondary sources. The live daily
> updater will therefore most often **skip** these pages — which is the
> intended safe behaviour, never a guess.

---

## 1. 6G topic taxonomy — and why

The taxonomy is organised around the **real 3GPP/ITU-R study landscape**, not
the old 5G module list. Nine domains:

| # | Domain | Why it exists | Dominant labels |
|---|--------|---------------|-----------------|
| 1 | **6G Vision & Requirements** | Requirements precede radios. Anchors the whole site in IMT-2030 + TR 22.870 + TR 38.914. | requirement |
| 2 | **6G Radio (6GR) Physical Layer** | The core engineering track; where continuity-with-5G is the real story. | candidate + foundation |
| 3 | **6G Spectrum** | Spectrum is the one ingredient that can't be invented; FR3/cmWave is 6G's centre of gravity. | candidate + requirement |
| 4 | **AI/ML-Native Air Interface** | A named IMT-2030 scenario and the most novel standardisation problem (two-sided models). | candidate |
| 5 | **Integrated Sensing & Communication (ISAC)** | New IMT-2030 scenario; "network as radar". | candidate + requirement |
| 6 | **Reconfigurable Intelligent Surfaces (RIS)** | High-profile candidate enabler for high-band coverage. | candidate |
| 7 | **Non-Terrestrial Networks (NTN)** | Realises the "Ubiquitous Connectivity" scenario. | requirement + foundation |
| 8 | **6G Core & Architecture** | Service-based core evolving to intent-driven / AI-native. | candidate + foundation |
| 9 | **Security & Quantum-Era** | 6G deploys into the quantum decade; PQC is a design-time concern. | candidate + requirement |

Each domain maps 1:1 to a domain entry in `data/6g-tracker.json` and a
`6g/<slug>.html` page. Merges considered and applied: ubiquitous connectivity is
folded into NTN; "AI & Communication" appears both as a requirement (Vision) and
its realization (AI air interface). Sensing/RIS/NTN are kept distinct because
each has a separate study trajectory.

---

## 2. File manifest

### New files

| File | Purpose |
|------|---------|
| `index.html` *(rewritten)* | 6G-first homepage, hero, nav, full SEO meta + JSON-LD (Organization + WebSite). |
| `6g/vision-requirements.html` | Topic 01 — IMT-2030 scenarios + capability targets + TR 22.870/38.914. Interactive: scenario wheel, KPI headroom chart. |
| `6g/radio-physical-layer.html` | Topic 02 — OFDM foundation, waveform decision, numerology. Interactive: numerology explorer. |
| `6g/spectrum.html` | Topic 03 — coverage/bandwidth trade-off, FR3/cmWave/sub-THz, WRC-27. Interactive: spectrum band map. |
| `6g/ai-native-air-interface.html` | Topic 04 — CSI/beam ML, two-sided models. Interactive: CSI two-sided model demo. |
| `6g/isac.html` | Topic 05 — radar basics, sensing modes. Interactive: monostatic range demo. |
| `6g/ris.html` | Topic 06 — programmable reflection. Interactive: beam-steering demo. |
| `6g/ntn.html` | Topic 07 — orbit trade-offs, convergence. Interactive: altitude/delay explorer. |
| `6g/core-architecture.html` | Topic 08 — service-based → intent-driven/AI-native core. Conceptual SBA diagram. |
| `6g/security.html` | Topic 09 — 5G security, PQC, AI-era threats. |
| `tracker/index.html` *(generated)* | Tracker dashboard: stats, release timeline, per-WG activity, changelog, all items. Dataset JSON-LD. |
| `data/6g-tracker.json` | **Single source of truth** for every tracker view. |
| `data/6g-tracker.schema.json` | JSON Schema (draft-07) for the tracker. |
| `scripts/lib/tracker.js` | Shared load/validate/render helpers (zero deps). |
| `scripts/build.js` | Renders dashboard, per-domain boxes, `feed.xml`, `sitemap.xml`. |
| `scripts/fetch-3gpp-status.js` | Safe-by-construction daily updater. |
| `scripts/reframe-foundations.js` | One-shot reframing of 5G pages as Foundations. |
| `.github/workflows/6g-daily-update.yml` | Daily cron: fetch → build → commit safe changes → open audit issue. |
| `feed.xml` *(generated)* | Atom feed from the tracker changelog. |
| `sitemap.xml` *(generated)* | All 41 URLs (home, tracker, 9 topics, 30 module pages). |
| `robots.txt` | Allow-all + sitemap pointer. |
| `CNAME` | `ranbits.com` (custom-domain mapping; see Decisions). |
| `assets/og-image.svg` | Social-share card. |
| `package.json` | `build` / `fetch` / `update` scripts; **zero dependencies**, Node ≥ 18. |
| `.gitignore` | Ignores run artifacts + local config. |
| `README.md` *(rewritten)* | Project overview + commands. |
| `BUILD-REPORT.md` | This file. |

### Changed (shared assets)

- `css/main.css` — appended a 6G block: classification label chips, claim
  blocks, source lines, legend, study-note, Foundations banner, topic grid,
  full tracker-dashboard styles, **and responsive media queries** (the original
  site had none — added as an enhancement, not a redesign).
- `js/main.js` — rewrote `NAV`/`buildSidebar` so **6G is the primary nav** and
  the 5G course is a secondary "Foundations" section; suffix-matching avoids the
  `tracker/index.html` ↔ `index.html` collision. Kept `roundRect`/`initReveal`.

### Repurposed (5G NR → Foundations, **URLs unchanged**)

All 30 `moduleN/*.html` pages, via `scripts/reframe-foundations.js`:
a Foundations banner with a forward-link to the matching 6G topic, a
`rel="canonical"`, and a title rebrand (`| ranbits — 5G Foundations`). Page
bodies and URLs are otherwise untouched. They also inherit the new 6G-first
sidebar automatically (shared `js/main.js`).

---

## 3. Published facts — full source ledger

Legend: **R** = requirement, **C** = candidate, **F** = foundation. `[2nd]`
marks a reputable **secondary** source (clearly labelled as such on-site).

### Requirements (agreed scenarios / targets — sourced + dated)

| Fact | Label | Source | Date |
|------|-------|--------|------|
| Six IMT-2030 usage scenarios (Immersive, HRLLC, Massive, Ubiquitous, AI&Comm, ISAC) | R | itu.int — IMT-2030 (M.2160) | 2023-11 |
| IMT-2030 capability **example** targets: peak 50/100/200 Gbit/s; user-exp 300/500 Mbit/s; spectral eff 1.5–3×; area cap 30/50 Mbit/s/m²; conn density 1e6–1e8/km²; mobility 500–1000 km/h; latency 0.1–1 ms; reliability 1-1e-5…1-1e-7; positioning 1–10 cm — all labelled **"framework example target"** | R | itu.int / IEEE ComSoc backgrounder on M.2160 | 2023-11 |
| IMT-2030 **minimum** TPRs are draft only (WP 5D Feb 2026; SG5 approval ~Dec 2026; values member-restricted) | R | itu.int hub article | 2026-03 |
| TR 22.870 (Stage-1 6G use cases) **approved** at TSG SA#111, Fukuoka; ~590 pages; Stage-1 anchor for Rel-21 | R | 3gpp.org — fukuoka-tsg111 | 2026-03-13 |
| TR 38.914 (RAN 6G scenarios & requirements) **~60% complete**; approval targeted ~Jun 2026; input to ITU-R | R | 3gpp.org — ran-6g-study1 | 2026-03-01 |
| WRC-27 (Res. 256 / AI 1.2) studying IMT bands ~4.4–4.8, 7.125–8.4, 14.8–15.35 GHz (+ regional 6.425–7.125, 10–10.5 GHz) | R | ericsson.com `[2nd]` | 2026-01 |
| Security & resilience is a (qualitative) IMT-2030 capability | R | itu.int — IMT-2030 | 2023-11 |
| Release 20 = dual track (5G-Adv + early-6G study) | R/F | 3gpp.org — release-20 | 2026-06-15 |

### Candidates (under study — sourced, shown neutrally)

| Fact | Label | Source | Date |
|------|-------|--------|------|
| RAN1 baseline waveform = CP-OFDM + DFT-s-OFDM (working assumption, enhancements open) | C | the-mobile-network.com `[2nd]` | 2025-08 |
| Alternative waveforms (OTFS, AFDM, OTSM…) studied, **not** selected | C | keysight.com `[2nd]` | 2025-07 |
| 6G Radio (6GR) study underway (RP-251881, RAN1) | C | wirelessbrew.com `[2nd]` | 2026-03 |
| Unified 5G/6G frame structure + wider-bandwidth numerology = study directions | C | 3gpp.org — ran-6g-study1 | 2026-03-01 |
| Upper mid-band / cmWave 7–15 GHz (within FR3 7.125–24.25 GHz) = leading initial-6G band | C | nokia.com `[2nd]` | 2026-01 |
| Sub-THz 100–300 GHz = later-phase target (~2035+) | C | arxiv.org `[2nd]` | 2024-06 |
| AI/ML for air interface (CSI, beam mgmt, positioning) builds on Rel-18 (TR 38.843)/Rel-19 | C | wirelessbrew.com `[2nd]` | 2026-03 |
| ISAC radio realization (monostatic/bistatic, waveform reuse) under study | C | arxiv.org `[2nd]` | 2025-08 |
| RIS studied in Rel-19; 6G role undecided | C | ericsson.com `[2nd]` | 2026-01 |
| 6G system architecture study in SA2 (TR 23.801; service-based, intent-driven, AI-native, NTN convergence) | C | wirelessbrew.com `[2nd]` | 2026-03 |
| Intent-driven / AI-native core = directions, not specs | C | qualcomm.com `[2nd]` | 2025-06 |
| Native terrestrial/NTN convergence under study | C | wirelessbrew.com `[2nd]` | 2026-03 |
| Post-quantum crypto migration = 6G research direction | C | itu.int — IMT-2030 | 2023-11 |
| Securing AI/ML in the network = open problem | C | itu.int — IMT-2030 | 2023-11 |
| Rel-21 first normative 6G specs ~2029; ASN.1 freeze ~Mar 2029; commercial ~2030 | C | qualcomm.com `[2nd]` / 3gpp release-21 | 2025-06 / 2026-06-15 |

### Foundations (established 5G/earlier — taught concretely)

OFDM + cyclic prefix multicarrier basis · CP-OFDM (DL) / DFT-s-OFDM (UL, low
PAPR) · numerology `SCS = 15·2^μ kHz`, symbol time `1/Δf`, 14 symbols/slot ·
LDPC(data)/Polar(control) coding **roles** and initial-access **role** ·
coverage falls / bandwidth rises with frequency (FR1/FR2) · radar `R = c·τ/2`
and Doppler velocity · OFDM as a radar waveform · RIS = phased-array
beamforming on a reflector · orbit altitude → delay (LEO/MEO/GEO), 5G NTN from
Rel-17 · 5G Service-Based Architecture (AMF/SMF/AUSF/PCF/UDM) · 5G mutual auth +
SUPI/SUCI concealment. Attributed to 3gpp.org/release-20 and the on-site
Foundations course; these are well-established and taught with concrete 5G
numbers.

### Worked numbers and their explicit labels

| Where | Number | Label |
|-------|--------|-------|
| Vision — peak-rate example | 5G 20 Gbit/s | **5G baseline** (ITU-R M.2410) |
| Vision — peak-rate example | 6G 50/100/200 Gbit/s → 2.5×/5×/10× | **framework example target** (M.2160) |
| Vision — KPI headroom chart | all 6G bars | **framework example target**; 5G bars **baseline** (M.2410) |
| Radio — numerology explorer | 15–240 kHz | real **5G NR** numerologies |
| Radio — numerology explorer | 480/960 kHz | **illustrative** 6G direction (not specified) |
| AI — CSI demo | 512→latent | **illustrative only** (not a 6G config) |
| ISAC — range demo | c = 3×10⁸ m/s | **real physics, illustrative** geometry |
| NTN — delay explorer | LEO ~550 / MEO ~8000 / GEO ~35786 km | standard **orbital figures**; delays **illustrative** |
| RIS — steering demo | angles/positions | **illustrative geometry** |

---

## 4. ⚠️ Could NOT source — left unverified or omitted

This is the honest gap list. None of these is published as fact.

1. **IMT-2030 minimum technical performance requirement numbers** — restricted
   to ITU-R members until ~Dec 2026. **Omitted entirely.** Only the public
   M.2160 *framework example* targets are shown, explicitly labelled as such.
2. **Exact 3GPP plenary/document IDs** `RP-251881` (6GR), `RP-243327`
   (scenarios), and `TR 23.801` (6G architecture) — obtained from a **secondary
   catalog** (WirelessBrew), not confirmed on the 3GPP portal (which blocks
   automated fetch). Marked `[2nd]` and described on-site as "indicative until
   confirmed on the 3GPP portal." Not asserted as verified primary IDs.
3. **The 6G baseline-waveform "agreement"** — only **secondary** reporting
   (the-mobile-network, keysight). No primary 3GPP meeting report could be
   fetched. Presented as a study-phase RAN1 *working assumption*, `[2nd]`.
4. **Exact Release 21 freeze dates** — only **expectations**; every such date is
   prefixed `~` and labelled "expected"/"projected", never a committed date.
5. **Whether 6G keeps LDPC/Polar coding** — **unknown.** Taught only as
   generation-independent *roles*; no 6G coding claim made.
6. **Sub-THz deployment timeline (~2035+)** — secondary/qualitative framing,
   labelled candidate `[2nd]`.
7. **`TR 38.843`** named as the Rel-18 AI/ML-for-air-interface TR — accurate and
   well-known, but cross-referenced via secondary, not fetched this run.
8. **IMT-2020 (5G) baselines** (peak 20 Gbit/s, latency 1 ms, etc.) — attributed
   to **ITU-R M.2410** from established knowledge + cross-check; the M.2410 page
   was not directly fetched this run. Labelled "5G baseline".
9. **`og:image` is an SVG.** No binary-image tooling was available, so the social
   card is `assets/og-image.svg`. Renders in-browser and on SVG-friendly
   scrapers; some platforms (e.g. Twitter) prefer PNG/JPG. **Recommended
   follow-up:** export a 1200×630 PNG.
10. **Live daily scraping of 3gpp.org will usually be blocked (403).** The
    updater treats this as "source unreachable → skip → log", never a failure or
    a guess. Real auto-updates will mostly come only when a page is both
    reachable *and* exposes an unambiguous figure.

---

## 5. Accuracy-guardrail self-check (automated, this run)

- ✅ Tracker data passes `validateTracker` — **15 items, 9 domains**; every
  `requirement`/`candidate` item has `source_url` + `source_date`; `completion`
  is `null` or an integer 0–100 (never guessed); all domain→item refs resolve.
- ✅ **23/23** requirement/candidate **claim blocks** across the 9 topic pages
  carry an on-page source (scripted check).
- ✅ **279/279** local links resolve (no broken internal links; scripted check).
- ✅ `fetch-3gpp-status.js` dry-run exits 0, applies **0** unsourced changes
  (safe default), writes an audit report.
- ✅ Build is idempotent and re-runs clean (`tracker/`, `feed.xml`, `sitemap.xml`
  regenerate; 9 domain boxes inject between markers).
- ✅ No 6G figure is presented as a "spec value"; all carry one of the approved
  labels.

---

## 6. Decisions recorded

- **`CNAME = ranbits.com`** added because the brief names ranbits.com as the
  production domain, so canonical/OG/sitemap/feed URLs use `https://ranbits.com`.
  If Pages is configured to the domain via the GitHub UI instead, the CNAME file
  is harmless and consistent. *(Reversible: delete `CNAME`.)*
- **Build approach:** data-driven parts (dashboard, per-domain boxes, feed,
  sitemap) are **rendered** by a zero-dependency Node script; the teaching prose
  is hand-authored, with the tracker box injected between
  `<!-- TRACKER:<id> -->` markers so committed pages stay valid between builds.
- **Language = Node** (not Python): the repo already ships client-side JS, Node
  is preinstalled on GitHub Actions runners, and the scripts use **only built-in
  modules** — zero new dependencies.
- **Responsive CSS added** site-wide (the original had none). Treated as an
  enhancement within the existing visual language, not a redesign.
- **5G URLs preserved exactly.** Modules 3–10 (still "in progress" stubs) are
  collapsed into representative homepage/nav entries but remain individually
  reachable and are all listed in `sitemap.xml`.

---

## 7. Operating the site

```bash
npm run build     # re-render tracker/feed/sitemap + domain boxes after editing data/6g-tracker.json
npm run fetch     # dry-run the daily updater (no writes) — inspect scripts/.fetch-report.md
npm run update    # fetch --write + build (what the daily GitHub Action runs)
```

The GitHub Action `.github/workflows/6g-daily-update.yml` runs daily (06:17 UTC)
and on manual dispatch; it commits only high-confidence sourced changes and opens
an audit issue for anything skipped/uncertain.

_End of report._
