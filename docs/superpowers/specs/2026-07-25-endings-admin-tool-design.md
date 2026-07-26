# Endings Admin Tool (localhost) — Design

**Date:** 2026-07-25
**Game:** Varginha: Terminal 1996
**Author:** brainstorming session (autonomous; assumptions stated below — awaiting user review)

---

## 1. Problem

Testing the endings is hard. There are **12 endings** chosen by
`determineEnding(savedFiles)` — a priority-ordered set of *threshold rules* over
file-category counts (e.g. `militaryCount >= 4 → government_scandal`). To answer
"what must the player leak to see ending X?" today you must read the logic and
`FILE_CATEGORIES` by hand. There is a static audit doc
(`game_story_files/endings.MD` via `scripts/gen-endings-doc.ts`) but it is not
interactive and cannot edit anything.

The author wants a **localhost admin site** that (a) shows every ending and the
file combinations that trigger it, (b) lets you *edit the ending copy* and
**save back into the repo**, so edits flow through the normal
push-to-`main` → auto-deploy pipeline and reach the live game. The tool must
**not be part of the deployed game**.

## 2. Assumptions (made autonomously; correct me on review)

1. **Localhost / dev-only.** Runs on the author's machine via an npm script;
   never bundled into the static export, never deployed to game.terminalufo.com.
2. **Save = write repo files.** The tool writes source files; the author reviews
   the git diff, commits, and pushes as usual. The tool does **not** auto-commit,
   auto-push, or auto-deploy.
3. **v1 edits ending _copy_** (title, subtitle, narrative lines, `ufo74_final`,
   and the AOL page: headline, subheadline, body paragraphs, url, imageAlt,
   visitorCount). **Trigger rules/thresholds are read-only** in v1 — shown and
   simulated, but not editable, because they are tested game logic with a
   contract (`determineEnding`) that other systems depend on.
4. **Trilingual is in scope.** Copy is edited in **all three languages**
   (English, pt-BR, es), because English strings currently double as translation
   keys (see §4) — editing English without updating translations would silently
   regress the localized game on deploy.
5. **The simulator uses the real `determineEnding`** (imported, not
   reimplemented) so results are trustworthy.

## 3. Current state (relevant facts)

- `app/engine/endings.ts`: `EndingId` (12), `FILE_CATEGORIES` (category →
  real filenames), `determineEnding` (priority threshold rules), `ENDINGS`
  (English copy), `analyzeDossier` (category counts).
- `app/components/endings/Victory.tsx` renders the AOL page and calls
  `translateRuntimeText(paragraph)` on each line.
- `scripts/gen-endings-doc.ts` already imports the real engine via `tsx` and
  derives human-readable rules + verified example save-sets per ending — reusable
  logic for the tester.
- Static export: `next.config.ts` has `output: 'export'`; the build only bundles
  `app/`. Anything under a new top-level `tools/` dir is excluded automatically.

## 4. The i18n constraint (load-bearing)

Ending copy is localized by **English-string-keyed lookup at render time**:
`translateRuntimeText("<English>")` looks up `<English>` in a dictionary merged
from `RUNTIME_COMMAND_SUPPLEMENT['pt-BR' | 'es']`
(`app/i18n/runtimeCommandSupplement.ts`), keyed by the exact English string. If
Steam/UI locale has no match, it falls back to English.

Consequences for an editor:
- Changing an English string **changes the translation key** → the old pt-BR/es
  entry no longer matches → the game silently reverts that line to English.
- Some English strings are also byte-matched elsewhere
  (`app/engine/governmentScandalCopy.ts` adaptive copy) and must stay exact.

Therefore the tool must treat each editable string as a **{en, pt-BR, es}
triple** and keep both sides in sync on save.

## 5. Approaches considered

**A. JSON source-of-truth + runtime refactor.** Extract ending copy into a
per-locale JSON; change `Victory.tsx`/i18n to read localized fields by stable ID
instead of English-string lookup. Cleanest data model, but high blast radius in
*game runtime* (Victory, i18n, governmentScandalCopy, ~5 test files).

**B. Tool rewrites the two hand-authored TS files directly.** No new artifacts;
the tool edits `ENDINGS` in `endings.ts` and the ending entries in
`runtimeCommandSupplement.ts` in place. But English strings are volatile keys, so
every edit must rekey translations and any byte-matched references — fragile
string surgery over hand-formatted, comment-rich TS.

**C. JSON source-of-truth + codegen to the existing file formats (RECOMMENDED).**
Introduce `app/data/endingsContent.json` keyed by **stable IDs**
(`<endingId>.<field>[.<index>]`) holding `{en, pt-BR, es}` per string. A codegen
script regenerates the *existing* artifacts from it:
- the English `ENDINGS` content, and
- the pt-BR/es ending entries in `runtimeCommandSupplement.ts` (keyed, as today,
  by the generated English strings).

The **game runtime is unchanged** (still English-keyed `translateRuntimeText`),
so game risk is low; the editor works against stable IDs, so it is robust; and
because codegen emits both sides, English keys and translations can never drift.

**Recommendation: C.** It gives a clean, safe "edit → save → re-deploy" loop with
minimal changes to shipping game code, and turns the fragile part (keeping
English keys and translations in sync) into deterministic codegen instead of
hand-editing.

## 6. Design (Approach C)

### 6.1 Components / file structure

```
tools/endings-admin/
  server.mjs        # local HTTP server; imports real engine via tsx; read/simulate/save
  public/index.html # single-page UI (Explorer + Simulator + Editor)
  public/app.js      # UI logic (framework-free)
  public/app.css
scripts/
  gen-endings-content.ts   # (new) one-time extraction: current ENDINGS + supplement → endingsContent.json
  gen-endings-from-content.ts  # (new) codegen: endingsContent.json → ENDINGS block + supplement ending regions
app/data/
  endingsContent.json      # (new) SOURCE OF TRUTH for ending copy, per stable ID, per locale
```

Nothing in `app/` imports from `tools/`. The game keeps importing `ENDINGS` from
`endings.ts` as today; that content is now generated from the JSON.

### 6.2 Backend endpoints (`server.mjs`, localhost only)

- `GET /api/model` → `{ endings: [...], categories: FILE_CATEGORIES, rules:
  [...human-readable...], examples: {endingId: [filenames]} }`. Rules + verified
  example save-sets are computed with the **real** engine (reuse
  `gen-endings-doc.ts` logic).
- `POST /api/simulate` `{ files: string[] }` → `{ endingId, matchedRule, counts }`
  by calling the **real** `determineEnding(new Set(files))`.
- `GET /api/content` → current `endingsContent.json`.
- `POST /api/save` `{ content }` → validate, write `endingsContent.json`, run the
  codegen (`gen-endings-from-content.ts`), and return a summary + `git diff
  --stat` of what changed. No commit/push.

### 6.3 UI (single page, three tabs)

- **Explorer:** list all 12 endings; per ending show the trigger rule in plain
  language, verified example file set(s), and the current copy (all locales).
- **Simulator:** files grouped by category with checkboxes (universe = union of
  `FILE_CATEGORIES`); as you toggle, show the resulting ending, the matched rule,
  and live category counts. Directly answers "what leaks produce this ending?".
- **Editor:** pick an ending; edit each field's `{en, pt-BR, es}`; Save. After
  save, show the returned diff summary so the author sees exactly what will be
  committed.

### 6.4 Data flow

Edit in browser → `POST /api/save` → write `endingsContent.json` → codegen
rewrites `ENDINGS` (English) + ending regions of `runtimeCommandSupplement.ts` →
author reviews `git diff`, commits, pushes → existing Amplify/Azure pipeline
deploys → live game shows the edits, correctly localized.

### 6.5 Guardrails (so it never ships in the game)

- Lives under top-level `tools/` (outside `app/`) → excluded from `next build`
  static export by construction.
- Add `npm run admin` (e.g. `tsx tools/endings-admin/server.mjs`). Not referenced
  by any deploy workflow.
- A unit test asserts no file under `app/` imports from `tools/`.
- Codegen only rewrites **marker-delimited regions** of
  `runtimeCommandSupplement.ts` (it already has `// ENDING N:` comments) so
  non-ending translations are never touched.

### 6.6 Testing

- **Round-trip safety:** `gen-endings-content.ts` then `gen-endings-from-content.ts`
  on the *current* data must reproduce the existing `ENDINGS` + supplement ending
  regions **byte-for-byte** (proves extraction changes nothing on first run).
- **Simulator correctness:** `/api/simulate` delegates to the real
  `determineEnding` — test a few known save-sets (e.g. 4 military files →
  `government_scandal`; 2 honeypot → `hackerkid_caught`).
- **Guardrail:** the no-`tools/`-import test above.
- **Full suite green:** `npm test`, `npm run typecheck`, `npm run lint`,
  `npm run validate-story`, and `npx tsx scripts/gen-endings-doc.ts` (no diff)
  must all pass after the extraction refactor.

## 7. Out of scope (v1)

- Editing trigger rules/thresholds or `FILE_CATEGORIES` (read-only; a future
  phase could add guarded rule editing with re-simulation).
- Adding/removing endings.
- Editing non-ending game text.
- Hosting the tool online / auth (localhost only).
- Auto-commit / auto-push / auto-deploy (author stays in control of git).
- Machine translation — the author supplies pt-BR/es text; the tool only stores
  and syncs it.

## 8. Risks & mitigations

- **Extraction drift** (generated files differ from current) → the byte-for-byte
  round-trip test gates the refactor; if it can't reproduce exactly, adjust the
  generator before wiring the tool.
- **Volatile English keys** (editing English breaks translation/`governmentScandalCopy`
  byte-matches) → codegen owns both sides, and a post-save check can flag any
  ending English string still referenced verbatim in `governmentScandalCopy.ts`.
- **Blast radius of touching `runtimeCommandSupplement.ts`** → codegen edits only
  marker-delimited ending regions; full suite must stay green.

## 9. Next step

On approval, invoke **writing-plans** to produce a TDD implementation plan:
1. Extraction generator + `endingsContent.json` + round-trip test (no behavior
   change; full suite green).
2. Codegen from content + wire `endings.ts`/supplement to generated output.
3. Localhost server (model/simulate/content/save) + guardrail test.
4. Single-page UI (Explorer / Simulator / Editor).
