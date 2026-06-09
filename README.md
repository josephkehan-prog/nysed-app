# NYSED Test Prep

An open-source, Learnosity-style assessment engine for **NYSED Grades 4 & 6 Math + ELA**
practice. It mirrors the **Nextera Test Delivery / Question Sampler** environment students use
to take the real test — per-grade/per-session tool gating, an expansive tool suite, and
**deterministic checking of student-drawn answers** — built on the **IMS QTI 3.0** scoring model.

> Released NYSED items are used only as a blueprint / anti-leakage reference. No state-test
> question is served verbatim.

## Status

- ✅ **152 [Vitest](https://vitest.dev) tests passing** — fully client-side; no backend, no Python
- ✅ Installable **PWA** — `npm run build` emits `dist/` with `sw.js` + `manifest.webmanifest`

## Architecture

| Area | Path | What it does |
|---|---|---|
| QTI scoring | `src/scoring` | `scoreItem(decl, response)` — `match_correct` + `map_response` partial credit |
| Tool gating | `src/nextera` | `availableTools(grade, session, subject)` + `Toolbar` (Nextera-style palette) |
| Deterministic answer checks | `src/interactions/checkers.ts` | points, number line, shaded region, fraction equivalence, bars |
| Calculator | `src/tools/calculator.ts` | four-function + √ reducer (Grade 6 Session 2 policy) |
| Accessibility | `src/a11y/accommodations.ts` | text-to-speech, answer masking, reverse contrast |
| Storage / sessions | `src/server` | `node:sqlite` store, mastery-by-standard, practice-session builder |
| UI components | `src/components` | KaTeX, Mafs, MathLive, Excalidraw, Tiptap (lazy-loaded) |
| Math equivalence | `src/modules/score.ts` | Compute Engine `isEqual` — browser-side, no backend (½ ≡ 0.5, 2x+3 ≡ 3+2x) |
| Learning modules | `src/modules`, `src/progress` | module contract + player/catalog; localStorage progress & mastery |
| Content pipeline | `scripts/ingest-im-tasks.ts` | Illustrative Math PDFs → module JSON (TypeScript, build-time) |

## Tech stack

React 19 · TypeScript · Vite 8 (PWA) · Vitest · `@cortex-js/compute-engine` · `node:sqlite`

## Getting started

**Prerequisites:** Node **≥ 24** (the storage layer uses the built-in `node:sqlite`, unflagged from
Node 23.4+).

### Web app

```bash
npm ci          # use `npm ci`, NOT `npm install` — see note below
npm test        # 152 Vitest tests
npm run dev     # local dev server
npm run build   # production PWA build (dist/)
```

> **Install with `npm ci`.** A `.npmrc` pins `legacy-peer-deps=true` (several UI libs lag React 19
> in their peer ranges). `npm install --legacy-peer-deps` once silently downgraded Excalidraw and
> broke the build; `npm ci` installs the exact lockfile.

## Content & licensing

- **Code:** [MIT](LICENSE).
- **Curriculum content:** EngageNY materials are CC BY-NC-SA 4.0 (NonCommercial + ShareAlike) and are
  **not** included in this repository. Any EngageNY-derived content added downstream must keep that
  license. CommonLit passages are not redistributable and are excluded.
- **NYSED released items:** public, used as blueprint / leakage-detection reference only — never
  served as practice questions.
