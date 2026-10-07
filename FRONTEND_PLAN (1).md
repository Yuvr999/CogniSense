# CogniSense Frontend Plan
### Landing page + patient screening flow + clinician dashboard, for execution in Antigravity

> Companion to `IMPLEMENTATION_PLAN.md`. This file **supersedes Section 14 (Streamlit app)** of that plan for everything the user sees. The FastAPI contract in Section 15 stays, with the small additions listed in Section 9.4.

---

## 0. Inputs, assumptions, and how to use this file

**Inputs analysed**
- Reference site: squadeasy.com (page text fetched) and your 29-second screen recording (15 frames inspected, colours sampled and contrast-checked in code).
- Two reference dashboard screenshots: a task board with a right-hand profile/chat panel, and a fleet-operations dashboard (KPI strip, line chart with tooltip, invoice table, segmented bars).
- Your brief: you liked the **layout, pacing, colour palette and animation/motion**; primary target is the **main landing page**, with the **dashboard** as the second target; **copy nothing unrelated to our project**; keep the design **very related to our project**.

**Assumptions I made (correct me if wrong; each is cheap to change now and expensive later)**

| # | Assumption | Why |
|---|---|---|
| A1 | The patient screening flow also gets a design (calm variant of the same system), even though you only named landing + dashboard. | The product doesn't work without it, and it is where accessibility matters most. |
| A2 | Devices: landing = desktop + mobile; patient flow = **clinic tablet, landscape** (also works on laptop); clinician dashboard = **desktop**. | Matches the clinical workflow in the main plan. |
| A3 | Frontend build budget ≈ 14–18 focused hours of agent + human time, run in parallel with ML work. | Typical 36–48 h hackathon. Section 15 gives a cut order if you have less. |
| A4 | Accessibility: **WCAG 2.2 AA everywhere, AAA-leaning on the patient flow** (7:1 text contrast, large targets). | Older adults, possible low vision and motor tremor. |
| A5 | Visual direction = **the SquadEasy-inspired language adapted to our subject**, not any earlier deck style. | Your item 7. |
| A6 | The pasted checklist mentioned a "sign-off gate" and a "CAD-AI deck". I have no context for the deck, so I ignored it. I kept the sign-off idea as a **clinician review-and-sign-off step** (human-in-the-loop), which suits this product. | Clinical safety. |

**How to use**
1. Put this file at the repo root next to `IMPLEMENTATION_PLAN.md`; add Section 0.1 rules below to `AGENTS.md`.
2. Run Phase F0 with one agent, then fan out (Section 16). Every phase ends with a **screenshot verification** step.
3. Do not let an agent mark a screen done until its acceptance criteria pass and screenshots are attached to the walkthrough artifact.

### 0.1 Frontend rules for `AGENTS.md`
```
FRONTEND RULES (CogniSense)
1. Stack: Vite + React 18 + TypeScript (strict) + Tailwind (tokens as CSS variables) + Radix primitives + `motion`.
2. Design tokens live ONLY in web/src/styles/tokens.css. No hard-coded hex values in components.
3. Never store PHI in localStorage/sessionStorage/IndexedDB. In-memory state only; a non-PHI session id may live in sessionStorage.
4. Every number shown from the model comes from the API or /reports JSON. NEVER hard-code metrics, stats, or client logos. Missing data renders an honest "pending" state.
5. No fake testimonials, customer logos, stock photos of people, or social/leaderboard/points features.
6. Patient flow: no ambient animation, no score feedback, no gamification, plain language (grade 6 or lower).
7. Respect prefers-reduced-motion everywhere; every animated moment has a static final state.
8. Colour is never the only carrier of meaning (risk tiers = colour + icon + text + pattern).
9. Self-host fonts and assets. No third-party CDNs, analytics, or trackers (privacy requirement).
10. Every screen ships with loading, empty, error and low-quality-data states, plus an axe-core pass and Playwright screenshots at 1440x900, 1024x768, 390x844.
11. UI copy: screening aid, not a diagnosis. Sentence case. CTA names stay identical across the flow.
```

---

## 1. What I observed in your reference, and what we take from it

### 1.1 Pacing map of the video (frames sampled every 2 s)

| Time | What happens | The pattern behind it |
|---|---|---|
| 0 s | Warm sand hero. Heavy all-caps headline starts **blurred and sharpens**; a phone mockup rises from the bottom edge. | One bold statement, one object, lots of empty space. |
| 4–6 s | Phone exits; next headline; **tilted photo cut-outs** drift in with parallax. | Proof arrives as tilted objects, not as paragraphs. |
| 8 s | **Sticky-note stat chips** (lime, pink) overlap the cut-outs; numbers count up. Then an **inset sky-blue band** with a headline and a lime chip inside the sentence. | Stats are tactile objects; a colour change marks a new idea. |
| 10 s | White section, two-line centred statement ("Cohesion, yes, but not for nothing!"). | A deliberate **breather beat** with almost nothing on screen. |
| 12–14 s | Back to sand: more tilted cut-outs and chips. | Rhythm: statement → proof → statement. |
| 16–18 s | Two-column intro; handwritten underline; **full-bleed lavender band** with a giant counting number. | Big numerals as the visual. |
| 18–20 s | Tabs ("Engagez-les tous") with a **phone mockup that changes per tab**; then a **horizontal strip of tilted lavender cards**. | Product shown in context; social proof in a carousel. |
| 22–24 s | Awards row; **lime CTA band**; closing white statement. | One high-energy colour reserved for the ask. |
| 26–28 s | **Black footer on a tilted panel**. | Strong, calm landing. |

**Pacing grammar to reuse:** about one idea per screen. Each beat = full-bleed colour change + one short headline + one proof object. Roughly every third beat is a near-empty "breather". The page is organised by colour bands, not by boxes.

### 1.2 Measured palette (sampled from your recording; confirm with an eyedropper on the live site)

| Role in reference | Sampled | Contrast with ink `#111111` |
|---|---|---|
| Sand hero background | `#DBC09D` | 10.83:1 |
| Floating nav pill (cream) | `#EDDECF` | 14.34:1 |
| Sky-blue band | `#82B6E2` | 8.76:1 |
| Lavender band/cards | `#ABA4FA` | 8.47:1 |
| Lime chip / CTA / arrow | `#E4FF65` | 16.9:1 (and lime on ink 16.9:1) |
| Pink emphasis text | `#DE57A0` | **2.01:1 on sand: fails accessibility** |
| Footer | black | — |

**Important finding:** the reference's pink headline words fail contrast badly. We keep pink only as a non-text decorative accent and use a deeper **berry `#8E1457`** (5.04:1 on sand, 8.24:1 on paper) whenever pink is text.

### 1.3 Adopt, adapt, reject

| Reference element | Decision | What it becomes in CogniSense |
|---|---|---|
| Floating cream pill nav + black pill CTA with lime arrow | **Adopt** | Same shape and behaviour; our own links ("How it works", "For clinicians", "Evidence", "Privacy"). |
| Sand hero, heavy grotesk headline, centred, tight leading | **Adopt** (landing only) | "Eight minutes to an earlier answer." |
| Blur-to-sharp headline reveal | **Adopt** as the *one* orchestrated hero moment | Load-triggered, 900 ms, static under reduced motion. |
| Device mockup rising from bottom | **Adapt** | A **tablet** (not a phone) built in HTML/CSS showing our real patient task screen. |
| Tilted photo cut-outs | **Adapt** | Tilted **evidence cards**: pause-marked waveform, transcript with hesitation highlights, trail-tap path, word-recall grid. No stock photos of smiling people. |
| Sticky-note stat chips | **Adapt** | Chips carrying **real** stats from the problem brief ("15–20 years", "60–80%", "under 10 min"). |
| Count-up numbers | **Adapt** | Used for model metrics, **fed from the API**, with CI, dataset name and a "not a clinical validation" caption. |
| Inset full-bleed colour bands | **Adopt** | Semantic colours (Section 3.2): sky = speech, lavender = cognitive, lime = attention/CTA. |
| Breather statement beats | **Adopt** | "Screening, yes. Diagnosing, no." |
| Tabs with a changing device mockup | **Adopt** | Speak, Remember, Trace, Review, Share (a real sequence, so numbering is justified). |
| Horizontal tilted-card carousel | **Adapt** | Evidence cards: Explainability, Fairness, Privacy, Workflow. |
| Logo marquee | **Adapt** | Text-only "Built on open benchmarks and standards" row. No customer logos. |
| Tilted black footer panel | **Adopt** | Footer with disclaimers and document links. |
| Customer testimonials, awards, ratings, "228 loyal customers" | **Reject** | We have none; fabricating them would be dishonest and a regulatory risk. |
| Employee photos, social wall, chat, leaderboards, points, challenges | **Reject** | Gamified scoring and social comparison would distort cognitive results and cause patient anxiety. |
| Sport/mobility/CSR content, Strava, app-store badges, French copy | **Reject** | Unrelated to the project. |
| Kanban board, task cards, chat thread (screenshot 1) | **Reject the features; adopt the shell** | Keep: left/top navigation, tab bar with view toggles, coloured tag chips, and the **right-hand context panel** (becomes the patient/notes/sign-off panel). |
| Fleet KPIs, invoices, costs (screenshot 2) | **Reject the content; adopt the layout** | KPI strip → risk and modality strip; line chart with hover tooltip → contribution chart; invoice table → screening queue; segmented bar with coloured dots → cognitive-domain breakdown; All/Unpaid/Paid tabs → All/Needs review/Reviewed. |

---

## 2. Design concept and principles

**One-line concept:** *a calm, warm clinical tool that is confident about structure and honest about uncertainty.* Warm sand and ink give approachability; colour bands carry meaning (each modality has its own colour everywhere); the dashboard keeps the same palette but tightens density.

**Principles**
1. **Spend boldness in one place.** The memorable thing is the hero: blur-to-sharp headline plus the rising tablet. Everything else is quiet and disciplined.
2. **Colour means something.** Sky = speech, lavender = cognitive tasks, lime = "look here" and primary action, berry = emphasis text. Risk tiers use a separate semantic set.
3. **Three modes, one system.** Landing = expressive. Patient flow = calm and large. Clinician dashboard = dense and scannable. Same tokens, different density settings (Section 3.5).
4. **Show uncertainty and provenance.** Every number has an interval or a source; every explanation shows the patient's value against a reference.
5. **No decoration without information.** No gradient washes, no identical-card grids, no random emoji.

**Landing wireframe (hero)**
```
┌──────────────────────────────────────────────────────────┐  sand #DBC09D
│  ( CogniSense   How it works  For clinicians  Evidence    │
│    Privacy              [ Open clinician demo  → ] )      │  floating cream pill
│                                                            │
│                  EIGHT MINUTES                             │  headline lines sharpen in
│                  TO AN EARLIER                             │  sequence (blur 10px → 0)
│                  ANSWER.                                   │
│     Short picture description, memory and attention        │
│     tasks. An explained risk estimate for your clinician.  │
│     A screening aid, not a diagnosis.                      │
│        [ Open clinician demo → ]   Try the patient flow    │
│                ┌───────────────────┐                       │
│                │  tablet mockup    │  rises on scroll      │
└────────────────┴───────────────────┴───────────────────────┘
```

---

## 3. Design tokens

### 3.1 Core palette (source of truth: `web/src/styles/tokens.css`)

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#111111` | Text, primary buttons, footer |
| `--paper` | `#FBF7F0` | Patient flow and dashboard background |
| `--paper-dim` | `#F1EADF` | Panels on paper |
| `--sand` | `#DBC09D` | Landing hero and breather bands |
| `--cream` | `#EDDECF` | Floating nav, tilted cards on sand |
| `--sky` | `#82B6E2` | Speech band/tint (text on it: ink only) |
| `--lavender` | `#ABA4FA` | Cognitive band/tint (text on it: ink only) |
| `--lime` | `#E4FF65` | Chips, CTA band, arrow glyphs on ink, highlight |
| `--berry` | `#8E1457` | Pink-family **text** emphasis (5.04:1 on sand) |
| `--pink-deco` | `#DE57A0` | Non-text decoration only |
| `--muted` | `#4A4540` | Secondary text (8.87:1 on paper, 5.43:1 on sand) |

### 3.2 Semantic colours

| Meaning | Fill (graphics) | Tint background | Text on tint | Contrast (text/tint) |
|---|---|---|---|---|
| Speech modality | `#2F6FB5` (4.84:1 on paper) | `--sky` | ink | 8.76:1 |
| Cognitive modality | `#5B4BD6` (5.75:1 on paper) | `--lavender` | ink | 8.47:1 |
| Risk: low | `#1F7A4D` | `#DCF3E4` | `#14532D` | 7.8:1 |
| Risk: elevated | `#B26A00` | `#FCE9C5` | `#6B3B00` | 7.82:1 |
| Risk: high | `#B3261E` | `#FADBD8` | `#7F1D1D` | 7.72:1 |
| Risk: indeterminate | `#475569` | `#E5E7EB` | `#1F2937` | 11.86:1 |

Risk badge = tint background + dark text + **icon** (check, alert, double-alert, question) + **pattern** on the fill (solid / light diagonal / dense diagonal / dotted), so it survives greyscale and colour-blindness. Agents must re-run a contrast check (script in Appendix A) after any palette change.

### 3.3 Typography

| Role | Family (OFL, self-hosted) | Notes |
|---|---|---|
| Display (landing headlines, big numerals) | **Archivo** variable (width + weight axes) | Weight 800–900, width 100–112, tracking −0.02em, line-height 0.95. All caps allowed **only** on landing headlines of ≤ 6 words. |
| Body, UI, patient flow, dashboard | **Atkinson Hyperlegible Next** (fallback: Atkinson Hyperlegible) | Designed by the Braille Institute for low-vision legibility; fits an older-adult audience. |
| Tabular figures | Atkinson `font-variant-numeric: tabular-nums` | Dashboard numbers align. |
| Optional sticky-chip numerals | Handwritten face such as Caveat, **landing only, P2** | Only if time allows; otherwise Archivo italic. |

Fonts are **self-hosted** (e.g. `@fontsource` packages; confirm the variable-axis files exist for the chosen packages). Loading from Google's CDN would send visitor IPs to a third party, which conflicts with our GDPR posture.

**Type scale (fluid):**

| Token | Landing | Dashboard | Patient flow |
|---|---|---|---|
| `display-xl` | `clamp(56px, 9vw, 144px)` | n/a | n/a |
| `h1` | `clamp(36px, 5vw, 72px)` | 28px | 40px |
| `h2` | `clamp(28px, 3.5vw, 48px)` | 22px | 32px |
| `body` | 18px / 1.55 | 15px / 1.5 | **24px / 1.6** |
| `small` | 14px | 13px (never below) | 20px |

Line length ≤ 70 characters on all body copy.

### 3.4 Spacing, radii, elevation
- Spacing: 4 px base; scale 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Radii: **pill (999)** for nav and buttons; **24** for floating cards and device; **12** for dashboard panels; **0** for full-bleed colour bands (matches the reference's hard-edged bands).
- Elevation: only two levels. `--shadow-float` (nav, tilted cards): `0 12px 32px rgba(17,17,17,.14)`; dashboard panels use a 1 px border `rgba(17,17,17,.12)` instead of shadows.

### 3.5 Density modes
`data-mode="landing | patient | clinic"` on `<html>` swaps scale: patient mode raises body to 24 px, min target size to 56 px, spacing ×1.25; clinic mode uses 15 px body, 40 px targets, tighter gaps.

### 3.6 Motion tokens
Durations 120 / 200 / 320 / 600 / 900 ms. Easing `cubic-bezier(.2,.8,.2,1)` (out) for entrances, `cubic-bezier(.4,0,.2,1)` for state changes. See Section 10 for the budget.

---

## 4. Sitemap and routes

| Route | Screen | Audience | Mode |
|---|---|---|---|
| `/` | Landing | Everyone (judges, clinics) | landing |
| `/screen` | Patient screening flow (consent → tasks → done) | Patient + MA on tablet | patient |
| `/clinic` | Screening queue | Clinician | clinic |
| `/clinic/session/:id` | Session result dashboard | Clinician | clinic |
| `/evidence` | Model performance (ROC, calibration, ablations) | Judges, clinicians | clinic |
| `/evidence/fairness` | Subgroup audit | Judges, clinicians | clinic |
| `/privacy` | Data-flow, retention, consent log, delete-my-data | Everyone | clinic |
| `/styleguide` | Live token + component sheet (dev and demo backup) | Team | all |

---

## 5. Landing page specification

Global: floating cream pill nav (compacts on scroll, never hides focus), skip-to-content link, a persistent slim footer-disclaimer line only on the dashboard (not the landing).

| # | Section (band) | Headline and content | Visual / motion | Data source |
|---|---|---|---|---|
| S1 | **Hero** (sand) | "EIGHT MINUTES TO AN EARLIER ANSWER." Sub: "CogniSense listens to a short picture description, checks memory and attention, and gives your clinician an explained risk estimate. A screening aid, not a diagnosis." Primary CTA "Open clinician demo". Link "Try the patient screening". | Headline lines sharpen in sequence on load (900 ms). Tablet mockup rises on scroll (translateY + slight scale). **The one orchestrated moment.** | Static |
| S2 | **The gap** (sand, continued) | "Memory changes start years before the first symptoms." Three tilted sticky chips: **"15–20 years"** (brain changes can begin this long before symptoms), **"60–80%"** (share of dementia cases that are Alzheimer's), **"under 10 min"** (our screening time). | Chips are tilted ±3–6°, overlapping tilted evidence cards. Static; slight parallax only if motion allowed. | Facts from the problem brief. **TODO for agent: add real source citations (WHO / Alzheimer's Association) in a footnote before launch.** |
| S3 | **Tasks** (inset sky band) | "Three short tasks. One explained result." Lime chip inside the sentence reads "8 min". | Static band; text sharpens on enter (same effect as hero, shorter). | Static |
| S4 | **Breather** (white) | "Screening, yes. Diagnosing, no." | Large centred, two lines, lots of space. No chip, no image. | Static |
| S5 | **The whole visit** (white) | Tabs: **Speak, Remember, Trace, Review, Share**. One-sentence description per tab. | Tablet mockup swaps its screen per tab (cross-fade 320 ms). Auto-advances only if motion allowed and pauses on hover/focus. Tab underline fills as progress. | Screens are real components rendered in "preview" mode. |
| S6 | **Numbers you can check** (lavender band) | Metric tiles: AUROC, sensitivity, specificity, each with 95% CI, dataset name and n. Caption: "Cross-validated on public research data. Not a clinical validation." Below: horizontal strip of tilted **evidence cards** (Why this flag; Fair across groups?; Where your data goes; Where it fits). | Count-up on first view (400–900 ms). Cards snap-scroll horizontally; draggable on pointer, arrow buttons for keyboard. | `GET /v1/model/card`. **Pending state** if absent. **Synthetic tag** if `data.mode=synthetic`. |
| S7 | **Where it fits** (paper) | Horizontal pathway: Visit → 8-minute screen → Explained result → Next step → EHR. Next-step labels from the clinical workflow (full cognitive battery, blood-based biomarkers, specialist referral). | Inline SVG; each node highlights on hover/focus with its description. | Static |
| S8 | **Ask** (lime band) | "See a screening from both sides." Buttons: "Open clinician demo", "Try the patient screening". | Static. Lime reserved for this band, chips and arrows. | Static |
| S9 | **Footer** (black, tilted panel, ≤ 2° skew) | Disclaimer ("Research prototype, not a medical device"), links: Model card, Data sheet, Fairness report, Privacy design, Source code. | Static | Docs in repo |
| M | **Marquee** (between S3 and S4, text only) | "Built on" ADReSS, ADNI / TADPOLE, HL7 FHIR R4, WCAG 2.2 AA, faster-whisper, openSMILE (rendered as separate items, not dot-joined). | Slow loop; **pauses on hover/focus; static under reduced motion**. | Static |

**Landing acceptance criteria**
- First section loads and is readable with JS disabled (headline sharp, CTA visible).
- No claims of accuracy, diagnosis or clinical validation anywhere; every metric traceable to the API.
- Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS < 0.1, LCP < 2.5 s on a throttled profile; landing JS ≤ 250 KB gzipped.
- Works at 390, 768, 1024, 1440, 1920 px with no horizontal page scroll.

---

## 6. Patient screening flow (calm variant)

**Principles:** one task per screen; one primary button, always in the same position; no scores, no timers that pressure (the 60 s fluency task is the only visible countdown, shown as a quiet ring); no gamification; no ambient animation; plain language.

**Layout (tablet landscape 1024×768+)**
```
┌─────────────────────────────────────────────────────────────┐ paper
│  Step 3 of 7  ━━━━━━━━●────────────────      [Need help?]    │
│                                                               │
│  Describe everything you see in this picture.                 │  h1 40px
│  Talk for about a minute. There are no wrong answers.         │
│                                                               │
│  ┌──────────────────────────┐    ┌───────────────────────┐   │
│  │                          │    │  ●  Start talking      │   │  64px high
│  │        scene image       │    │  live level meter      │   │
│  │                          │    │  00:00                 │   │
│  └──────────────────────────┘    │  [ I'm finished → ]    │   │
│  [ I can't see the picture ]     └───────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

| # | Screen | Key content and behaviour | Captured → API |
|---|---|---|---|
| P0 | Welcome and consent | Plain-language what/why/how long/what happens to your voice ("Your recording is deleted once it has been analysed"). Two separate consents: screening (required), research use (optional). Large checkboxes. | Consent record → `POST /v1/sessions` |
| P1 | About you | Age (number stepper), sex, **years of education** (stepper with helper text), main language, **"Is someone helping you?"** (assisted-mode flag, recorded as metadata). | Demographics → session |
| P2 | Microphone check | Level meter; says "Say your name"; client-side advisory checks (too quiet, clipping, background noise). | Local only |
| P3 | Picture description | As wireframe. Soft minimum ≈ 45 s ("Keep going if you can"); hard stop at ≈ 2:30. Skip option logs a missing modality. | Audio → `/speech` |
| P4 | Remember these words | 10 words, one at a time, large, fixed 2 s each; no audio narration (visual task by design). | Timings only |
| P5 | Name animals | 60 s quiet ring timer; speak or type; "I can't think of more" ends early. | Audio or text → `/cognitive` |
| P6 | Trace the path | Tap numbers and letters in order (1 → A → 2 → B …). Targets ≥ 64 px, **tap-only (no drag)**; errors give a gentle shake and no scolding. | Taps with timestamps → `/cognitive` |
| P7 | Recall the words | "Which words do you remember?" speak or type; "I don't remember more" ends. | Responses → `/cognitive` |
| P8 | Done | "Thank you. Your clinician will talk through next steps." **No score is shown.** Button "Start next patient" clears all in-memory state. | — |

**Patient-flow acceptance criteria**
- Full run completes in ≤ 10 min with a scripted tester; all controls reachable by keyboard and by touch with ≥ 56 px targets.
- Disconnect mid-flow: state kept in memory, banner "Connection lost. Your answers are saved on this screen. Reconnecting…", auto-retry with backoff; never lose a recorded task.
- Mic denied, too quiet, too short and too noisy each show a specific fix (Section 12).
- "Start next patient" leaves no PHI in memory, storage, or URL.

---

## 7. Clinician dashboard specification

### 7.1 Session view layout (desktop 1440×900)

```
┌ top bar: CogniSense | Queue  Session  Evidence  Fairness  Privacy |  Dr. ▾ ┐
├ Session 7F3A · 70–74 · 14 yrs education · English · Tablet · [Draft: not reviewed] ┤
│ ┌ KPI strip ───────────────────────────────────────────┐ ┌ Context panel (sticky) ┐
│ │ [Risk tier ⚠ Elevated 0.62 (0.41–0.78)] [Speech 0.66 ▮▮▮▮▮▯▯] │ │ Patient (pseudonymised) │
│ │ [Cognitive 0.55 ▮▮▮▮▯▯▯] [Data quality: 1 flag]       │ │ Narrative (3 sentences) │
│ └──────────────────────────────────────────────────────┘ │ Recommended next step   │
│ ┌ What drove this result ──────────┐ ┌ Cognitive domains ──┐ │ Clinician notes         │
│ │ contribution chart + hover tooltip│ │ z-score bars vs norms│ │ ☐ I reviewed the        │
│ │ [All | Speech | Cognitive]        │ │ ● Memory ● Fluency   │ │   explanation and flags │
│ └───────────────────────────────────┘ └─────────────────────┘ │ [Sign off] [Export ▾]   │
│ ┌ Speech evidence ──────────────────────────────────────────┐ └─────────────────────────┘
│ │ Pause timeline (per-word gaps)  |  Scene content: 11 of 25 │
│ └────────────────────────────────────────────────────────────┘
│ ┌ If you screen 100 people like this ───────────────────────┐
│ │ icon array (flagged / true / false)  Threshold ▭▭●▭  Prevalence ▭●▭▭ │
│ └────────────────────────────────────────────────────────────┘
```

| Panel | Pattern borrowed | Content and behaviour |
|---|---|---|
| **KPI strip** | KPI cards with mini segmented bars (fleet dashboard) | 4 cells: Risk tier badge + calibrated probability + interval bar; Speech score; Cognitive score; Data quality. Each modality cell uses its modality colour and an "Based on 1 of 2 modalities" note when one is missing. |
| **What drove this result** | Line chart with hover tooltip and series legend toggles | Horizontal contribution (waterfall) chart of top ±5 features. Tooltip: feature, **patient value vs reference value**, direction, plain-language meaning. Toggle All / Speech / Cognitive. Feature rows carry modality-coloured dots. Table alternative below the fold for screen readers. |
| **Cognitive domains** | "Costs by category" segmented list with dots and values | Domains (Memory, Fluency, Processing speed, Speech fluency): z-score bar against an age-and-education-adjusted normal band; dot colour = modality. |
| **Speech evidence** | n/a (our own) | **Pause timeline** built from word timestamps (audio is deleted, so no playback), words-per-minute over time, and a **scene content checklist** (found vs missed content units). De-identified transcript appears only if the clinic enables transcript retention. |
| **Screen-100 panel** | n/a (our own) | Icon array of 100 people at the chosen prevalence (default 12%, configurable) showing how many are flagged and how many of those are true positives, driven by the threshold slider. Shows sensitivity, specificity, PPV, NPV live. |
| **Context panel (sticky right)** | Right-hand profile/chat panel | Pseudonymised patient facts, narrative, recommended next step, notes textarea, **review-and-sign-off gate**, exports. |

**Sign-off gate behaviour:** until the clinician ticks "I reviewed the explanation and data-quality flags" and presses **Sign off**, the session is labelled *Draft: not reviewed* and the Export buttons are disabled. Sign-off posts to the API and is written to the audit log. Exports include reviewer and timestamp.

### 7.2 Queue (`/clinic`)
Table with columns: Session, Date, Age band, Tier badge, Probability, Modalities, Data quality, Review status. Tabs **All / Needs review / Reviewed** (pattern from the invoice table), search, sort, pagination, row click opens the session view. Empty state: "No screenings yet. Start one from the patient screen."

### 7.3 Evidence and fairness pages
Read `reports/*.json` via the API. Evidence: ROC, PR, calibration plot, metrics table with CIs, ablation table, ASR-vs-manual gap. Fairness: grouped bars of sensitivity and false-positive rate per subgroup, gap table, indeterminate-rate by group, limitations text. Each chart has a "View as table" toggle. Synthetic data is always tagged **"SYNTHETIC: pipeline test only"** with a visible badge on every chart.

### 7.4 Dashboard acceptance criteria
- A new teammate can find the tier, the top 3 drivers and the recommended next step within 10 seconds (run a quick hallway test, record the result).
- No number appears without its interval or source; no probability shown with more than 2 decimals.
- Hover tooltips also appear on keyboard focus.
- Page remains usable at 200% zoom and at 1024 px width (context panel collapses beneath).

---

## 8. Component inventory

| Component | Used in | Key props / states |
|---|---|---|
| `NavPill` | Landing, app | scrolled, active, mobile sheet |
| `Button` | All | `primary` (ink + lime arrow), `secondary`, `link-arrow` (underline), sizes patient/clinic, loading, disabled |
| `StickyChip` | Landing | text, tilt, tone (lime/pink-deco/sky), static |
| `TiltCard` | Landing | rotation, tone, children |
| `BandSection` | Landing | tone (sand/sky/lavender/lime/white/ink), inset |
| `CountUp` | Landing, evidence | value, formatter, `reducedMotion`, pending/loading |
| `DeviceFrame`, `TabbedDemo` | Landing | tabs, autoplay, pause on focus |
| `Marquee` | Landing | items, paused |
| `Stepper` | Patient | step, total |
| `RecordButton`, `LevelMeter`, `LiveWaveform` | Patient | idle/recording/processing/error/denied |
| `TimerRing` | Patient | seconds, calm style |
| `WordCard`, `WordList` | Patient | duration, announcements |
| `TraceBoard` | Patient | targets, order, error shake |
| `ConsentPanel` | Patient | two consents, versioned text |
| `RiskTierBadge` | Dashboard | tier, size; colour + icon + pattern + text |
| `IntervalBar` | Dashboard | p, low, high, thresholds |
| `ModalityKpi` | Dashboard | score, segments, available, flags |
| `ContributionChart` | Dashboard | contributions, filter, tooltip |
| `DomainZBars` | Dashboard | domains, normative band |
| `PauseTimeline`, `ContentChecklist` | Dashboard | pause intervals, unit coverage |
| `IconArray` | Dashboard | prevalence, sens, spec |
| `ThresholdControls` | Dashboard | slider (Radix), keyboard steps |
| `ContextPanel`, `NarrativeCard`, `NotesField` | Dashboard | collapsed on narrow screens |
| `SignOffGate` | Dashboard | unchecked, checked, signing, signed, error |
| `DataQualityBanner` | Both | warn, error |
| `QueueTable` | Queue | tabs, search, sort, pagination |
| `DisclaimerBar` | App | persistent "Screening aid, not a diagnosis." |
| `EmptyState`, `ErrorState`, `Skeleton`, `Toast` | All | per Section 12 |

A `/styleguide` route renders every component in every state; it doubles as the Storybook-lite checklist and a demo backup.

---

## 9. State, data flow and API wiring

### 9.1 Libraries and patterns
- **Server state:** TanStack Query (retries, polling `GET /result` while processing).
- **Client state:** a small store (Zustand) holding the in-memory patient flow; **no persistence of PHI**.
- **Flow control:** a typed state machine for the patient flow (`idle → consent → profile → micCheck → speech → encode → fluency → trace → recall → uploading → done`, plus `error` and `paused`). Each transition has guards (consent given, QC passed).
- **API client:** types generated from the FastAPI OpenAPI schema (`openapi-typescript`) so UI and backend cannot drift. **MSW** mocks every endpoint so frontend work does not wait for ML.

### 9.2 Screen to endpoint map

| Screen / action | Endpoint |
|---|---|
| P0 consent and P1 profile | `POST /v1/sessions` |
| P3 audio finished | `POST /v1/sessions/{id}/speech` (multipart) |
| P4–P7 results | `POST /v1/sessions/{id}/cognitive` |
| Dashboard load | `GET /v1/sessions/{id}/result` (poll until ready) |
| Export FHIR / report | `GET /v1/sessions/{id}/fhir`, `/report` |
| Delete my data | `DELETE /v1/sessions/{id}` |
| Landing metrics, Evidence | `GET /v1/model/card` |

### 9.3 Audio capture notes
Use `MediaRecorder`; prefer `audio/webm;codecs=opus`, fall back to `audio/mp4` on Safari. The server converts to 16 kHz mono WAV with ffmpeg. The live level meter uses an `AnalyserNode`; client checks are advisory only, **server QC is authoritative**. Never write audio to disk or storage client-side; hold in memory and upload.

### 9.4 Backend additions this UI needs (hand to the API agent)
- `GET /v1/sessions` (queue list with tier, date, age band, review status).
- `POST /v1/sessions/{id}/signoff` (reviewer, timestamp; written to the audit log).
- Extend `RiskResult` with: `pause_timeline` (intervals only), `content_units` (found/missed), `domain_z` (value, normal band), `reference_values` per contribution, `qc` details, `assisted_mode`, `demographic_bands`, `review_status`, `data_mode` (`real | synthetic`).
- `GET /v1/reports/fairness` and `/v1/reports/metrics` (read-only JSON from `/reports`).
- CORS config for the web origin; role stub (`patient-kiosk`, `clinician`) for the demo.

---

## 10. Motion specification

**Budget (landing):** exactly three non-user-triggered moments: (1) hero headline sharpen + tablet rise, (2) count-up in the evidence band, (3) tab-driven screen swap. Everything else on the landing is static, apart from the marquee, which pauses on hover/focus and stops under reduced motion.

| Moment | Implementation | Reduced-motion fallback |
|---|---|---|
| Hero sharpen | CSS `filter: blur(10px)` → `0` plus opacity .55 → 1, staggered by line (120 ms), 900 ms, out easing; class added by JS so no-JS users see sharp text. | Sharp immediately. |
| Tablet rise | `motion`'s `useScroll` + `useTransform` mapped to translateY (96px → 0) and scale (.94 → 1). `will-change: transform`. | Placed at final position. |
| Count-up | Runs once on enter; number formatted with tabular figures; ends exactly on API value. | Final value shown. |
| Tab swap | 320 ms cross-fade; auto-advance every 6 s while visible; pauses on hover/focus; stops after one user interaction. | No auto-advance, instant swap. |
| Tilted cards | Static tilt via CSS transform; on pointer hover a 4 px lift (user-triggered, 200 ms). | No hover lift. |

**Not allowed:** scroll-jacking or smooth-scroll libraries, parallax on text, autoplaying video, anything animating in the patient flow except button press feedback (120 ms) and the recording indicator. Dashboard motion is response-only: chart transitions on filter change (200 ms), panel expand (200 ms), toast in/out.

**Performance:** animate only `transform` and `opacity` (plus the single hero blur); no layout-affecting animation; pause offscreen animations with `IntersectionObserver`.

---

## 11. Accessibility

Targets: **WCAG 2.2 AA minimum; patient flow AAA-leaning (7:1 text, 44 px minimum target, we use 56–64 px).**

| Area | Requirement |
|---|---|
| Contrast | All text ≥ 4.5:1 (patient text ≥ 7:1). Chart fills ≥ 3:1 against background. Never use `--pink-deco` for text. Lime is a fill for ink text, or text on ink only. |
| Focus | Visible on every control: 3 px ink ring with 2 px paper gap (lime ring on ink backgrounds). Logical order; no keyboard traps; focus moved to the new step heading on each flow transition. |
| Colour independence | Risk tiers, modality series and form errors carry text, icon or pattern in addition to colour. |
| Keyboard and pointer | Every action works by keyboard and by single tap. **No drag-only interactions** (trail task is tap-only; carousel has arrow buttons). Target size ≥ 24 px (AA) and 56 px on the patient flow. |
| Screen readers | Landmarks, headings in order, `aria-live` for recorder state and countdown milestones (not every second), chart summaries via `aria-describedby`, **"View as table" for every chart**. |
| Time limits | The 60 s fluency and word display timings are clinically essential (documented as WCAG 2.2.1 "essential exception"); everything else untimed. Add "I need more time" on non-essential screens. |
| Vision / motor / hearing | Text-size toggle (up to 200%), high-contrast toggle, honour `forced-colors`, optional "Read instructions aloud" (instructions only, never the memory words). If the patient can't see the picture or hear/see a task, "Skip this task" records the missing modality instead of failing the session. |
| Cognitive load | One instruction per screen, consistent button position, a Back button on every non-timed step, no countdown shown except where essential. |
| Language | `lang` attribute set; strings in `react-i18next` resource files (English only for now, structured for future languages). |
| Reflow | Dashboard usable at 400% zoom via stacked layout; no horizontal scroll except data tables inside their own scroll container. |

**Testing:** `@axe-core/playwright` on every route in CI, Playwright keyboard-only flows, forced-colors screenshot, and a manual pass with NVDA or VoiceOver on the patient flow and dashboard. Automated tools catch only part of the issues, so the manual pass is a gate.

---

## 12. Loading, empty, error and low-quality-data states

| Where | State | Message (plain, says what to do) | Behaviour |
|---|---|---|---|
| Patient P2/P3 | Mic permission denied | "We can't hear you yet. Allow the microphone in your browser, then press Try again." | Shows how-to image; Retry; "Skip this task" |
| Patient P3 | Too quiet | "We couldn't hear you clearly. Move closer to the microphone and speak up." | Re-record |
| Patient P3 | Too short | "That was a little short. Keep describing what you see." | Resume recording |
| Patient P3 | Too noisy | "There is a lot of background noise. Try a quieter spot if you can." | Re-record |
| Patient | Connection lost | "Connection lost. Your answers are saved on this screen. Reconnecting…" | Backoff retry, manual retry |
| Patient | Upload failed after retries | "We couldn't send your answers. Ask the clinic staff for help." | Staff-assist screen, keep data in memory |
| Dashboard | Processing | Skeleton panels with "Analysing speech (about 20 seconds)". | Poll result |
| Dashboard | One modality missing | Banner: "Result based on speech only. Cognitive tasks were skipped." | Interval widens, KPI cell greyed |
| Dashboard | QC flag | "Audio quality was low (background noise). Treat the speech score with caution." | Flag in KPI strip and report |
| Dashboard | Indeterminate | Badge "Indeterminate" + "The model is not confident enough. Repeat the screen or use clinical judgement." | No probability emphasis |
| Dashboard | Synthetic data | Persistent badge "SYNTHETIC: pipeline test only" | On every chart and tile |
| Queue | Empty | "No screenings yet. Start one from the patient screen." | CTA |
| Any | API 5xx | "Something went wrong on our side. Try again, or contact support with code {id}." | Retry; log id |
| Evidence/landing | Metrics pending | "Evaluation hasn't been run yet." | No placeholder numbers |
| Session | Idle timeout (clinic) | "Session locked after 10 minutes. Sign in again to continue." | Clears in-memory PHI |

Errors never apologise; they state what happened and what to do.

---

## 13. Content and microcopy guidelines

- Sentence case; active voice; plain verbs; one job per sentence. Patient copy at grade 6 or below.
- Patient-facing: never say "test", "score", "fail", "dementia" or "Alzheimer's". Say "activities", "tasks", "your clinician will talk with you".
- Clinician-facing wording: "Elevated", "High", "Low", "Indeterminate". Never "positive/negative" or "diagnosis".
- Same action, same name through the flow: **Start screening → Screening started**, **Sign off → Signed off**, **Export FHIR → FHIR exported**.
- Persistent disclaimer: "Screening aid, not a diagnosis."
- Landing: no superlatives, no accuracy claims outside the evidence tiles.

---

## 14. Frontend tech stack and structure

| Concern | Choice |
|---|---|
| Build / framework | Vite + React 18 + TypeScript (strict) + React Router |
| Styling | Tailwind (design tokens as CSS variables) + CSS modules for one-off effects (blur, tilt) |
| Primitives | Radix UI (Tabs, Slider, Dialog, Tooltip, Checkbox, Toggle) styled with our tokens |
| Motion | `motion` (`useScroll`, `useTransform`); no scroll-jacking libraries |
| Charts | Recharts for ROC/calibration/grouped bars; hand-built SVG for contribution chart, pause timeline, icon array |
| Data | TanStack Query, Zustand, `openapi-typescript`, MSW |
| i18n | `react-i18next` (English only, scaffolded) |
| Quality | Vitest + Testing Library, Playwright + axe-core, ESLint (jsx-a11y), Prettier, Lighthouse CI |
| Fonts | Self-hosted Archivo + Atkinson Hyperlegible Next (WOFF2, subset to Latin, `font-display: swap`, preload display font) |

```
web/
├── index.html
├── vite.config.ts
├── src/
│   ├── styles/tokens.css  base.css  motion.css
│   ├── app/ routes.tsx  App.tsx
│   ├── api/ client.ts  types.gen.ts  mocks/ (MSW handlers + demo personas)
│   ├── state/ screeningMachine.ts  sessionStore.ts
│   ├── components/ ui/  landing/  patient/  clinic/  charts/
│   ├── pages/ Landing.tsx  Screen.tsx  Queue.tsx  Session.tsx  Evidence.tsx  Fairness.tsx  Privacy.tsx  Styleguide.tsx
│   ├── i18n/ en.json
│   └── utils/ a11y.ts  format.ts  reducedMotion.ts
├── e2e/ landing.spec.ts  patient-flow.spec.ts  dashboard.spec.ts  a11y.spec.ts
└── public/ fonts/  scene-placeholder.svg
```

**Docker:** add a `web` service to `docker-compose.yml` (static build served by nginx or `vite preview`), proxying `/v1` to the API container. Streamlit remains an optional internal ML-lab view only.

---

## 15. Phased task plan with acceptance criteria

> Estimates assume parallel agents. **Cut order if short on time:** (1) landing motion beyond hero, (2) queue page, (3) evidence/fairness pages (fall back to the Streamlit pages from the main plan), (4) tab auto-advance. **Never cut:** patient flow, session dashboard, sign-off gate, accessibility basics.

### F0. Setup and tokens (≈ 1.5 h)
- [ ] Scaffold `web/`; install deps; self-host fonts; write `tokens.css` from Section 3; density modes.
- [ ] MSW mocks for all endpoints plus **four demo personas** (low, elevated, high, indeterminate/poor audio) shaped like the extended `RiskResult`.
- [ ] Contrast-check script (Appendix A) in CI.
**Acceptance:** `npm run dev` shows `/styleguide` with palette, type scale and tokens; contrast script passes; fonts load with no external requests (verify in the network panel).

### F1. Design system components (≈ 2.5 h)
- [ ] Build Section 8 core components: Button, NavPill, BandSection, StickyChip, TiltCard, RiskTierBadge, IntervalBar, DataQualityBanner, Skeleton, EmptyState, ErrorState, DisclaimerBar.
- [ ] Add each in every state to `/styleguide`.
**Acceptance:** keyboard tab-through of the styleguide works; axe reports no violations; screenshots at 1440 and 390 attached.

### F2. Landing page (≈ 4 h)
- [ ] Sections S1–S9 per Section 5; tablet mockup with real patient component previews; tabbed demo; marquee; evidence tiles bound to `GET /v1/model/card` with pending/synthetic states.
- [ ] Hero sharpen + tablet rise; count-up; reduced-motion fallbacks.
**Acceptance:** Section 5 criteria (Lighthouse ≥ 90 / ≥ 95, no-JS hero, no horizontal scroll); reduced-motion screenshot shows all final states; side-by-side screenshot review against Section 2 wireframe.

### F3. Patient flow (≈ 4 h)
- [ ] State machine (Section 9.1), P0–P8, recorder + level meter + QC states, trace board, timers, assisted-mode flag, skip-task handling.
- [ ] Connect to MSW first, then the real API.
**Acceptance:** Section 6 criteria; Playwright keyboard-only run through P0–P8 with a fake audio device; no PHI in storage (test inspects `localStorage`, `sessionStorage`, IndexedDB after the run).

### F4. Clinician dashboard (≈ 4 h)
- [ ] Session view panels (Section 7.1) with persona data; contribution chart with tooltip + table view; domain bars; pause timeline; icon array and threshold controls; context panel and sign-off gate; queue page.
**Acceptance:** Section 7.4 criteria; sign-off disables/enables exports correctly; all four personas render with correct tier styling in greyscale screenshot; keyboard tooltip test passes.

### F5. Evidence, fairness, privacy pages (≈ 1.5 h)
- [ ] Wire to `/v1/reports/*`; table toggles; synthetic badges; privacy data-flow diagram and "Delete my data".
**Acceptance:** every chart has a table view and summary text; pending state works when reports are missing.

### F6. Hardening and polish (≈ 2 h)
- [ ] axe on all routes, forced-colors and 200%/400% zoom checks, Lighthouse CI, bundle audit, final copy pass against Section 13.
- [ ] Record a 60-second demo video of the landing → patient flow → dashboard path.
**Acceptance:** all Section 17 checks green; `docker compose up` serves the full app.

---

## 16. Ready-to-paste Antigravity prompts

**Agent F0 (setup)**
> Read `FRONTEND_PLAN.md` fully. Execute Phase F0: scaffold `web/` per Section 14, create `src/styles/tokens.css` from Section 3 (core palette, semantic colours, type scale, density modes), self-host Archivo and Atkinson Hyperlegible Next, add MSW mocks with four demo personas, and the contrast-check script from Appendix A. Build a `/styleguide` page. Verify there are no external network requests, take screenshots at 1440x900 and 390x844, and attach them to your walkthrough.

**Agent F1 (design system)**
> Implement Phase F1 from `FRONTEND_PLAN.md`: the core components in Section 8 using the tokens only (no hard-coded hex). RiskTierBadge must encode tier with colour, icon, pattern and text. Show every component in every state on `/styleguide`. Run axe and fix violations. Attach screenshots, including a greyscale one.

**Agent F2 (landing)**
> Implement Phase F2: the landing page per Section 5, using the hero wireframe in Section 2. Follow the motion budget in Section 10 exactly (three moments only) with reduced-motion fallbacks. Do not add testimonials, customer logos, stock photos, or hard-coded metrics; bind metric tiles to `GET /v1/model/card` with pending and synthetic states. Verify: no-JS hero, Lighthouse mobile scores, no horizontal scroll at 390/768/1024/1440/1920. Attach screenshots for each breakpoint and a reduced-motion run.

**Agent F3 (patient flow)**
> Implement Phase F3: the patient flow per Section 6 using patient density mode, the state machine in Section 9.1, and the error states in Section 12. No score feedback, no gamification, no ambient animation. Targets ≥ 56 px, tap-only trail task. Add a Playwright test with a fake media stream that completes the flow with the keyboard, and a test asserting no PHI in any browser storage. Attach a screen recording or screenshots of every step including three error states.

**Agent F4 (dashboard)**
> Implement Phase F4: the clinician session dashboard and queue per Section 7. Build the contribution chart as custom SVG with tooltips that also open on keyboard focus, plus a "View as table" toggle. Implement the sign-off gate exactly as specified and wire exports to its state. Render all four personas and attach greyscale screenshots to prove tiers are distinguishable without colour. Hand a list of any extra API fields you need to the API agent (Section 9.4).

**QA agent (browser)**
> Using the browser tool, run through landing → patient flow → dashboard at 1440x900, 1024x768 and 390x844. For each screen capture a screenshot, compare it to the wireframes in `FRONTEND_PLAN.md`, run axe, and list deviations. Re-run with `prefers-reduced-motion: reduce` and forced-colors. Produce a walkthrough artifact with a pass/fail table against Sections 5, 6, 7 and 11.

---

## 17. Definition of done (frontend)

**Design fidelity**
- [ ] Landing reads as the same family as the reference (floating pill nav, sand hero, blur-to-sharp headline, rising device, tilted chips/cards, colour-band rhythm, breather beat, tilted black footer) while containing **no unrelated content**.
- [ ] Colours come only from tokens; modality colours are consistent across landing, patient flow and dashboard.

**Product honesty**
- [ ] Zero hard-coded metrics, testimonials, logos or stock people; metrics tiles show pending/synthetic states correctly.
- [ ] "Screening aid, not a diagnosis" visible on dashboard and landing footer; no clinical-validity claims.
- [ ] Sign-off gate works; exports carry reviewer and timestamp.

**Accessibility and performance**
- [ ] axe clean on every route; keyboard-only completion of the patient flow and session review; forced-colors and 200%/400% zoom checked; manual screen-reader pass done.
- [ ] Reduced-motion mode shows every final state.
- [ ] Landing: Lighthouse mobile Performance ≥ 90, Accessibility ≥ 95; JS ≤ 250 KB gzipped.

**Privacy**
- [ ] No third-party requests (fonts, analytics, CDNs); no PHI in browser storage; "Start next patient" and idle timeout clear memory.

**Engineering**
- [ ] CI green (lint, types, unit, e2e, axe, contrast script); `docker compose up` serves web + API; 60-second demo video recorded.

---

## 18. Risks

| Risk | Mitigation |
|---|---|
| Moving from Streamlit to React costs time | MSW mocks let UI and ML proceed in parallel; Streamlit pages stay as an internal fallback for Evidence/Fairness. |
| Blur-to-sharp heading janks on low-end tablets | Limit to the hero headline; transform/opacity everywhere else; reduced-motion fallback; test on a throttled CPU. |
| Browser audio quirks (Safari codecs, permission flows) | Codec fallback, file-upload fallback for the demo, pre-recorded sample files, test Chrome/Edge/Safari early. |
| Heavy caps display type hurts readability | Caps restricted to short landing headlines; sentence case in patient flow and dashboard. |
| Reference brand resemblance | We reuse structure, pacing and motion patterns, but not logos, copy, photography or branded assets; palette is adapted (berry text, semantic tints), type is different. |
| Scope creep into gamification | Rule 5 in `AGENTS.md`; reject any points/streak/leaderboard request. |
| Unsupported marketing statements | Facts need citations before launch; metrics only from the API; reviewer checks Section 13. |

---

## Appendix A. Contrast-check script (run in CI)

```python
# web/scripts/contrast.py  (fails the build if any required pair drops below its minimum)
def lum(h):
    h = h.lstrip('#'); r, g, b = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c/12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b)
def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)

REQUIRED = [  # (foreground, background, minimum)
  ("#111111", "#DBC09D", 4.5), ("#111111", "#82B6E2", 4.5), ("#111111", "#ABA4FA", 4.5),
  ("#111111", "#E4FF65", 4.5), ("#E4FF65", "#111111", 4.5), ("#111111", "#FBF7F0", 7.0),
  ("#4A4540", "#FBF7F0", 7.0), ("#8E1457", "#DBC09D", 4.5),
  ("#14532D", "#DCF3E4", 7.0), ("#6B3B00", "#FCE9C5", 7.0),
  ("#7F1D1D", "#FADBD8", 7.0), ("#1F2937", "#E5E7EB", 7.0),
  ("#2F6FB5", "#FBF7F0", 3.0), ("#5B4BD6", "#FBF7F0", 3.0),
]
bad = [(f, b, round(ratio(f, b), 2), m) for f, b, m in REQUIRED if ratio(f, b) < m]
assert not bad, f"Contrast failures: {bad}"
```

## Appendix B. Token and snippet starters

```css
/* tokens.css (excerpt) */
:root {
  --ink:#111111; --paper:#FBF7F0; --paper-dim:#F1EADF; --sand:#DBC09D; --cream:#EDDECF;
  --sky:#82B6E2; --lavender:#ABA4FA; --lime:#E4FF65; --berry:#8E1457; --muted:#4A4540;
  --speech:#2F6FB5; --cognitive:#5B4BD6;
  --risk-low:#1F7A4D; --risk-low-bg:#DCF3E4; --risk-low-fg:#14532D;
  --risk-elev:#B26A00; --risk-elev-bg:#FCE9C5; --risk-elev-fg:#6B3B00;
  --risk-high:#B3261E; --risk-high-bg:#FADBD8; --risk-high-fg:#7F1D1D;
  --risk-ind:#475569; --risk-ind-bg:#E5E7EB; --risk-ind-fg:#1F2937;
  --font-display:"Archivo Variable","Archivo",system-ui,sans-serif;
  --font-body:"Atkinson Hyperlegible Next","Atkinson Hyperlegible",system-ui,sans-serif;
  --ease-out:cubic-bezier(.2,.8,.2,1); --ease-state:cubic-bezier(.4,0,.2,1);
  --shadow-float:0 12px 32px rgba(17,17,17,.14);
}
:focus-visible { outline:3px solid var(--ink); outline-offset:2px; box-shadow:0 0 0 5px var(--paper); }
.on-ink :focus-visible { outline-color:var(--lime); box-shadow:0 0 0 5px var(--ink); }

/* hero sharpen: JS adds .is-ready so no-JS users never see blurred text */
.hero-line { transition:filter 900ms var(--ease-out), opacity 900ms var(--ease-out); }
.js .hero-line:not(.is-ready) { filter:blur(10px); opacity:.55; }
@media (prefers-reduced-motion: reduce) {
  .js .hero-line:not(.is-ready) { filter:none; opacity:1; }
  .hero-line, .tilt-card, .tab-panel { transition:none !important; animation:none !important; }
}

/* tilted sticky chip / card */
.chip { transform:rotate(var(--tilt,-4deg)); background:var(--lime); color:var(--ink); }
.tilt-card { transform:rotate(var(--tilt,3deg)); box-shadow:var(--shadow-float); border-radius:24px; }
```

## Appendix C. Persona data for MSW (shape guide)

| Persona | Tier | Fused p (CI) | Notes shown |
|---|---|---|---|
| "Low risk" | low | 0.12 (0.06–0.21) | Both modalities available, no flags |
| "Elevated: memory" | elevated | 0.62 (0.41–0.78) | Delayed recall z = −1.6; mild pause increase |
| "High: speech and memory" | high | 0.86 (0.74–0.94) | Pauses, low scene coverage, low recall |
| "Indeterminate: poor audio" | indeterminate | 0.48 (0.20–0.77) | Speech QC flag; cognitive only; wide interval |

All personas carry `data_mode: "synthetic"` and render the synthetic badge until real evaluation outputs replace them.
