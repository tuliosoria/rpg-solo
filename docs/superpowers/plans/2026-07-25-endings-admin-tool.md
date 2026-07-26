# Endings Admin Tool (localhost) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a localhost-only admin tool that explores/simulates all 12 endings using the real `determineEnding`, and lets the author edit ending copy in en/pt-BR/es and save it back into the repo so edits deploy through the normal pipeline.

**Architecture:** Three phases. **Phase 1** ships a read-only Explorer+Simulator (a small Node/`tsx` HTTP server under `tools/` importing the real engine; framework-free UI) with **zero game changes** — independently shippable. **Phase 2** extracts English ending copy into `app/data/endingsContent.json` consumed via a generated module (behavior-preserving refactor) and adds English editing + Save. **Phase 3** extends the JSON with pt-BR/es per field, routes the runtime supplement through a generated module, and adds trilingual editing. Trigger rules are read-only throughout. The tool lives under top-level `tools/` so `next build` (static export of `app/`) never bundles it.

**Tech Stack:** Node 22 built-in `http`, `tsx` (new devDependency) to run/import TypeScript, TypeScript 5.9, Vitest 4 (existing runner: `node scripts/run-vitest.mjs`), framework-free HTML/CSS/JS.

**Reference spec:** `docs/superpowers/specs/2026-07-25-endings-admin-tool-design.md`

**Key repo facts the engineer must know:**
- `app/engine/endings.ts`: exports `EndingId` (12 ids), `FILE_CATEGORIES` (Record<string,string[]>), `determineEnding(savedFiles: Set<string>): EndingId`, `analyzeDossier(savedFiles): DossierAnalysis`, and `ENDINGS: Record<EndingId, Omit<GameEnding,'id'>>` (English copy, currently inline at lines 375–653).
- `GameEnding` fields (see endings.ts:39): `title`, `subtitle`, `narrative: string[]`, `ufo74_final: string`, `aol: { headline, subheadline, body: string[], url, imageSrc?, imageAlt, visitorCount }`.
- Endings are localized at render time: `translateRuntimeText("<English>")` looks the English string up in dictionaries merged from `RUNTIME_COMMAND_SUPPLEMENT['pt-BR'|'es']` in `app/i18n/runtimeCommandSupplement.ts` (`type RuntimeDictionary = Record<string,string>`), keyed by the exact English string. The 12 ending regions are delimited by `// ENDING N: <id>` comments (pt-BR: lines ~818–1052, es: ~1986–2220).
- `scripts/gen-endings-doc.ts` regenerates `game_story_files/endings.MD` from the real engine; “no git diff after regeneration” is an existing behavior guard.
- Tests run via `node scripts/run-vitest.mjs run <path> --configLoader runner --reporter=dot`. Full: `npm test`. Also `npm run typecheck`, `npm run lint`, `npm run validate-story`.
- Ignore the nested `.worktrees/` tree (pre-existing, unrelated).
- Commit trailer required on every commit: `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`.

---

## PHASE 1 — Read-only Explorer + Simulator (no game changes)

### Task 1: Add `tsx` devDependency and the `admin` script

**Files:**
- Modify: `package.json` (devDependencies + scripts)

- [ ] **Step 1: Install tsx as a dev dependency**

Run:
```bash
npm install --save-dev tsx@^4.19.2
```
Expected: `package.json` gains `"tsx"` under `devDependencies`; exits 0.

- [ ] **Step 2: Add npm scripts**

In `package.json` `"scripts"`, add these three entries (keep existing ones):
```json
    "admin": "tsx tools/endings-admin/server.ts",
    "gen:endings-content": "tsx scripts/gen-endings-content.ts",
    "gen:endings-from-content": "tsx scripts/gen-endings-from-content.ts",
```

- [ ] **Step 3: Verify tsx runs TypeScript that imports the engine**

Run:
```bash
npx tsx -e "import('./app/engine/endings.ts').then(m => console.log('ids', Object.keys(m.ENDINGS).length))"
```
Expected: prints `ids 12`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add tsx devDependency and admin/codegen npm scripts

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Shared rules/examples module (derive human-readable rules + verified example save-sets)

**Files:**
- Create: `tools/endings-admin/rules.ts`
- Test: `tools/endings-admin/__tests__/rules.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tools/endings-admin/__tests__/rules.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { fileUniverse, exampleSaveSet, describeRuleFor } from '../rules';
import { determineEnding } from '../../../app/engine/endings';

describe('endings-admin rules', () => {
  it('fileUniverse is the sorted union of all FILE_CATEGORIES filenames', () => {
    const u = fileUniverse();
    expect(u).toContain('jardim_andere_incident.txt');
    expect(u).toContain('URGENT_classified_alpha.txt');
    // sorted + de-duplicated
    expect([...u]).toEqual([...new Set(u)].sort());
  });

  it('exampleSaveSet for each ending actually triggers that ending', () => {
    for (const id of [
      'ridiculed','ufo74_exposed','the_2026_warning','government_scandal',
      'prisoner_45_freed','harvest_understood','nothing_changes',
      'incomplete_picture','wrong_story','hackerkid_caught','secret_ending','real_ending',
    ] as const) {
      const set = exampleSaveSet(id);
      expect(set, `no example found for ${id}`).not.toBeNull();
      expect(determineEnding(new Set(set as string[]))).toBe(id);
    }
  });

  it('describeRuleFor returns a non-empty human-readable string', () => {
    expect(describeRuleFor('government_scandal')).toMatch(/military/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/run-vitest.mjs run tools/endings-admin/__tests__/rules.test.ts --configLoader runner --reporter=dot`
Expected: FAIL — cannot find module `../rules`.

- [ ] **Step 3: Implement `tools/endings-admin/rules.ts`**

```ts
import {
  FILE_CATEGORIES,
  determineEnding,
  type EndingId,
} from '../../app/engine/endings';

/** Sorted, de-duplicated union of every filename referenced by FILE_CATEGORIES. */
export function fileUniverse(): string[] {
  const all = Object.values(FILE_CATEGORIES).flat();
  return [...new Set(all)].sort();
}

/** Files grouped by their category key, for the simulator UI. */
export function filesByCategory(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [cat, files] of Object.entries(FILE_CATEGORIES)) {
    out[cat] = [...new Set(files)].sort();
  }
  return out;
}

/**
 * Plain-language description of each ending's trigger, mirroring the priority
 * order in determineEnding (endings.ts). Read-only documentation.
 */
const RULE_TEXT: Record<EndingId, string> = {
  hackerkid_caught: 'Saved 2+ obvious honeypot/trap files.',
  secret_ending: 'ghost_in_machine.enc + alpha-neural evidence + physicist convergence files + a convergence file.',
  ufo74_exposed: 'Saved ghost_in_machine.enc (without the full secret-ending set).',
  real_ending: '2+ ufo_core AND 2+ medical/autopsy AND 1+ witness AND 2+ military/coverup files.',
  wrong_story: '5+ corruption+unrelated files with at most 1 ufo_core file.',
  government_scandal: '4+ military/coverup files (without meeting real_ending).',
  prisoner_45_freed: '2+ containment files AND 1+ witness file.',
  the_2026_warning: '2+ temporal/convergence files.',
  harvest_understood: '2+ extraction/harvest files.',
  nothing_changes: '2+ ufo_core AND 1+ medical AND 1+ military file (short of real_ending).',
  incomplete_picture: 'Scattered dossier (largest category <= 2) OR hard biological/containment evidence (2+ autopsy or 2+ containment) that never cohered.',
  ridiculed: 'Default: weak or incoherent dossier that matched no stronger rule.',
};

export function describeRuleFor(id: EndingId): string {
  return RULE_TEXT[id];
}

/**
 * A concrete, verified set of filenames that triggers `id`. Built by greedily
 * taking the first N filenames from the relevant categories, then CONFIRMED
 * against the real determineEnding so it can never drift from the logic.
 */
export function exampleSaveSet(id: EndingId): string[] | null {
  const c = FILE_CATEGORIES;
  const take = (arr: string[], n: number) => arr.slice(0, n);

  const candidates: Record<EndingId, string[]> = {
    hackerkid_caught: take(c.honeypot_trap, 2),
    secret_ending: [
      ...c.ghost_machine,
      ...take(c.alpha_neural, 1),
      'thirty_year_cycle.txt',
      'convergence_model_draft.txt',
    ],
    ufo74_exposed: [...c.ghost_machine],
    real_ending: [
      ...take(c.ufo_core, 2), ...take(c.medical_autopsy, 2),
      ...take(c.witness, 1), ...take(c.military_coverup, 2),
    ],
    wrong_story: [...take(c.corruption_financial, 3), ...take(c.conspiracy_unrelated, 2)],
    government_scandal: take(c.military_coverup, 4),
    prisoner_45_freed: [...take(c.containment, 2), ...take(c.witness, 1)],
    the_2026_warning: take(c.temporal_convergence, 2),
    harvest_understood: take(c.extraction_harvest, 2),
    nothing_changes: [
      ...take(c.ufo_core, 2), ...take(c.medical_autopsy, 1), ...take(c.military_coverup, 1),
    ],
    incomplete_picture: take(c.medical_autopsy, 2),
    ridiculed: take(c.conspiracy_unrelated, 1),
  };

  const set = candidates[id];
  if (determineEnding(new Set(set)) === id) return set;
  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/run-vitest.mjs run tools/endings-admin/__tests__/rules.test.ts --configLoader runner --reporter=dot`
Expected: PASS (3 tests). If `exampleSaveSet` for some id returns null, adjust that id's candidate list until `determineEnding` returns the id (the test enforces this).

- [ ] **Step 5: Commit**

```bash
git add tools/endings-admin/rules.ts tools/endings-admin/__tests__/rules.test.ts
git commit -m "feat(admin): shared endings rule/example derivation from real engine

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: HTTP server — `/api/model` and `/api/simulate`

**Files:**
- Create: `tools/endings-admin/server.ts`
- Test: `tools/endings-admin/__tests__/server.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tools/endings-admin/__tests__/server.test.ts`:
```ts
import { describe, it, expect, afterAll } from 'vitest';
import type { Server } from 'node:http';
import { createServer } from '../server';

const server: Server = createServer();
await new Promise<void>(r => server.listen(0, r));
const port = (server.address() as import('node:net').AddressInfo).port;
const base = `http://127.0.0.1:${port}`;

afterAll(() => new Promise<void>(r => server.close(() => r())));

describe('endings-admin server', () => {
  it('GET /api/model returns endings, categories and examples', async () => {
    const res = await fetch(`${base}/api/model`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Object.keys(body.endings)).toHaveLength(12);
    expect(body.categories.military_coverup).toContain('jardim_andere_incident.txt');
    expect(body.examples.government_scandal.length).toBeGreaterThanOrEqual(4);
  });

  it('POST /api/simulate delegates to the real determineEnding', async () => {
    const res = await fetch(`${base}/api/simulate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ files: [
        'incident_report_1996_01_VG.txt','initial_response_orders.txt',
        'regional_summary_jan96.txt','transport_log_96.txt',
      ] }),
    });
    const body = await res.json();
    expect(body.endingId).toBe('government_scandal');
    expect(body.counts.militaryCoverup).toBe(4);
    expect(body.matchedRule).toMatch(/military/i);
  });

  it('POST /api/simulate with 2 honeypot files returns hackerkid_caught', async () => {
    const res = await fetch(`${base}/api/simulate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ files: ['URGENT_classified_alpha.txt','LEAKED_classified_records.dat'] }),
    });
    const body = await res.json();
    expect(body.endingId).toBe('hackerkid_caught');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/run-vitest.mjs run tools/endings-admin/__tests__/server.test.ts --configLoader runner --reporter=dot`
Expected: FAIL — cannot find module `../server`.

- [ ] **Step 3: Implement `tools/endings-admin/server.ts`**

```ts
import { createServer as createHttpServer, type Server, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

import {
  ENDINGS,
  determineEnding,
  analyzeDossier,
  type EndingId,
} from '../../app/engine/endings';
import { filesByCategory, exampleSaveSet, describeRuleFor } from './rules';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, 'public');

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function sendJson(res: ServerResponse, status: number, data: unknown): void {
  const payload = JSON.stringify(data);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(payload);
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf-8'));
}

function buildModel() {
  const ids = Object.keys(ENDINGS) as EndingId[];
  const endings: Record<string, unknown> = {};
  const examples: Record<string, string[]> = {};
  for (const id of ids) {
    endings[id] = { id, rule: describeRuleFor(id), ...ENDINGS[id] };
    examples[id] = exampleSaveSet(id) ?? [];
  }
  return { endings, categories: filesByCategory(), examples };
}

async function serveStatic(res: ServerResponse, urlPath: string): Promise<void> {
  const rel = urlPath === '/' ? '/index.html' : urlPath;
  try {
    const filePath = join(PUBLIC_DIR, rel);
    const buf = await readFile(filePath);
    res.writeHead(200, { 'content-type': MIME[extname(filePath)] ?? 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
  }
}

export function createServer(): Server {
  return createHttpServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    try {
      if (req.method === 'GET' && url.pathname === '/api/model') {
        return sendJson(res, 200, buildModel());
      }
      if (req.method === 'POST' && url.pathname === '/api/simulate') {
        const body = (await readBody(req)) as { files?: string[] };
        const files = new Set(body.files ?? []);
        const endingId = determineEnding(files);
        const { counts } = analyzeDossier(files);
        return sendJson(res, 200, { endingId, counts, matchedRule: describeRuleFor(endingId) });
      }
      if (req.method === 'GET' && !url.pathname.startsWith('/api/')) {
        return void (await serveStatic(res, url.pathname));
      }
      sendJson(res, 404, { error: 'not found' });
    } catch (err) {
      sendJson(res, 500, { error: String(err) });
    }
  });
}

// Entry point when run directly: `npm run admin`.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const port = Number(process.env.PORT ?? 4599);
  createServer().listen(port, () => {
    console.log(`Endings admin tool → http://localhost:${port}`);
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/run-vitest.mjs run tools/endings-admin/__tests__/server.test.ts --configLoader runner --reporter=dot`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tools/endings-admin/server.ts tools/endings-admin/__tests__/server.test.ts
git commit -m "feat(admin): localhost server with /api/model and /api/simulate

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Explorer + Simulator UI (framework-free)

**Files:**
- Create: `tools/endings-admin/public/index.html`
- Create: `tools/endings-admin/public/app.css`
- Create: `tools/endings-admin/public/app.js`

- [ ] **Step 1: Create `tools/endings-admin/public/index.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Endings Admin — Varginha: Terminal 1996</title>
  <link rel="stylesheet" href="/app.css" />
</head>
<body>
  <header>
    <h1>Endings Admin</h1>
    <nav>
      <button data-tab="explorer" class="active">Explorer</button>
      <button data-tab="simulator">Simulator</button>
      <button data-tab="editor">Editor</button>
    </nav>
  </header>
  <main>
    <section id="explorer" class="tab active"></section>
    <section id="simulator" class="tab">
      <div id="sim-result">Select files to simulate…</div>
      <div id="sim-categories"></div>
    </section>
    <section id="editor" class="tab"><p>Editing is added in Phase 2–3.</p></section>
  </main>
  <script src="/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `tools/endings-admin/public/app.css`**

```css
* { box-sizing: border-box; }
body { margin: 0; font-family: ui-monospace, Menlo, Consolas, monospace; background: #0b0f0b; color: #cfe8cf; }
header { padding: 12px 16px; border-bottom: 1px solid #1e3a1e; }
h1 { font-size: 16px; margin: 0 0 8px; }
nav button { background: #10210f; color: #cfe8cf; border: 1px solid #1e3a1e; padding: 6px 12px; cursor: pointer; }
nav button.active { background: #1e3a1e; }
main { padding: 16px; }
.tab { display: none; }
.tab.active { display: block; }
.ending-card { border: 1px solid #1e3a1e; padding: 12px; margin-bottom: 12px; }
.ending-card h3 { margin: 0 0 4px; color: #7CFC7C; }
.rule { color: #9fd39f; font-style: italic; }
.files { color: #8fbf8f; font-size: 12px; }
.cat { border: 1px solid #1e3a1e; padding: 8px; margin-bottom: 8px; }
.cat h4 { margin: 0 0 6px; color: #7CFC7C; font-size: 13px; }
label { display: inline-block; margin: 2px 8px 2px 0; font-size: 12px; }
#sim-result { position: sticky; top: 0; background: #10210f; border: 1px solid #1e3a1e; padding: 10px; margin-bottom: 12px; font-size: 14px; }
.big { color: #7CFC7C; font-size: 18px; }
```

- [ ] **Step 3: Create `tools/endings-admin/public/app.js`**

```js
const $ = (sel) => document.querySelector(sel);

document.querySelectorAll('nav button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('nav button').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');
    $('#' + btn.dataset.tab).classList.add('active');
  });
});

let model = null;

async function load() {
  model = await (await fetch('/api/model')).json();
  renderExplorer();
  renderSimulator();
}

function renderExplorer() {
  const root = $('#explorer');
  root.innerHTML = '';
  for (const [id, e] of Object.entries(model.endings)) {
    const card = document.createElement('div');
    card.className = 'ending-card';
    card.innerHTML =
      `<h3>${e.title} <small>(${id})</small></h3>` +
      `<div class="rule">Trigger: ${e.rule}</div>` +
      `<div class="files">Example leak set: ${(model.examples[id] || []).join(', ') || '(none)'}</div>` +
      `<p>${e.subtitle}</p>`;
    root.appendChild(card);
  }
}

let selected = new Set();

function renderSimulator() {
  const root = $('#sim-categories');
  root.innerHTML = '';
  for (const [cat, files] of Object.entries(model.categories)) {
    const box = document.createElement('div');
    box.className = 'cat';
    const h = document.createElement('h4');
    h.textContent = cat;
    box.appendChild(h);
    for (const f of files) {
      const label = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = f;
      cb.addEventListener('change', () => {
        if (cb.checked) selected.add(f); else selected.delete(f);
        simulate();
      });
      label.appendChild(cb);
      label.appendChild(document.createTextNode(' ' + f));
      box.appendChild(label);
    }
    root.appendChild(box);
  }
}

async function simulate() {
  const res = await fetch('/api/simulate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ files: [...selected] }),
  });
  const r = await res.json();
  const title = model.endings[r.endingId]?.title ?? r.endingId;
  $('#sim-result').innerHTML =
    `<div class="big">${title}</div>` +
    `<div class="rule">${r.matchedRule}</div>` +
    `<div class="files">${selected.size} files selected</div>`;
}

load();
```

- [ ] **Step 4: Manual smoke test**

Run: `npm run admin` (leave it running), then in another shell:
```bash
curl -s localhost:4599/api/model | head -c 120
curl -s -X POST localhost:4599/api/simulate -H 'content-type: application/json' \
  -d '{"files":["incident_report_1996_01_VG.txt","initial_response_orders.txt","regional_summary_jan96.txt","transport_log_96.txt"]}'
```
Expected: model JSON prints; simulate returns `{"endingId":"government_scandal",...}`. Open `http://localhost:4599`, toggle the 4 military files in the Simulator tab, confirm it shows GOVERNMENT SCANDAL. Stop the server (Ctrl-C).

- [ ] **Step 5: Commit**

```bash
git add tools/endings-admin/public/
git commit -m "feat(admin): Explorer + Simulator UI (framework-free)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Guardrail — no `app/` file may import from `tools/`

**Files:**
- Test: `app/__tests__/no-tools-import.test.ts`

- [ ] **Step 1: Write the failing test (only fails if a violation exists)**

Create `app/__tests__/no-tools-import.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

describe('game bundle isolation', () => {
  it('no file under app/ imports from tools/', () => {
    const files = execSync('git ls-files "app/**/*.ts" "app/**/*.tsx"', { encoding: 'utf-8' })
      .trim().split('\n').filter(Boolean);
    const offenders = files.filter((f) => {
      const src = readFileSync(f, 'utf-8');
      return /from\s+['"][^'"]*tools\//.test(src) || /import\(['"][^'"]*tools\//.test(src);
    });
    expect(offenders, `app/ files importing tools/: ${offenders.join(', ')}`).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it passes (no violations yet)**

Run: `node scripts/run-vitest.mjs run app/__tests__/no-tools-import.test.ts --configLoader runner --reporter=dot`
Expected: PASS. (This is a regression guard: it protects the isolation invariant going forward.)

- [ ] **Step 3: Commit**

```bash
git add app/__tests__/no-tools-import.test.ts
git commit -m "test: guard that app/ never imports from tools/

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: Phase 1 validation gate

**Files:** none (verification only)

- [ ] **Step 1: Typecheck, lint, and confirm the tool is excluded from the game build**

Run:
```bash
npm run typecheck
npm run lint
grep -n "tools" tsconfig.json || echo "tools not referenced by tsconfig (ok)"
```
Expected: typecheck clean; lint clean on new files; `tools/` is not part of the app build. If `eslint .` reports on `tools/`, that is fine as long as there are no errors; fix any errors it reports in the new files.

- [ ] **Step 2: Run the new tests together**

Run:
```bash
node scripts/run-vitest.mjs run tools/endings-admin/__tests__/ app/__tests__/no-tools-import.test.ts --configLoader runner --reporter=dot
```
Expected: all pass.

- [ ] **Step 3: Confirm no game files changed in Phase 1**

Run:
```bash
git diff --name-only 1a77099..HEAD | grep -vE '^(tools/|docs/|package(-lock)?\.json|app/__tests__/no-tools-import\.test\.ts)$' || echo "PHASE 1 IS ADDITIVE ONLY (ok)"
```
Expected: prints `PHASE 1 IS ADDITIVE ONLY (ok)` (Phase 1 adds the tool, the isolation test, and deps — it does not modify game logic).

---

## PHASE 2 — Extract English ending copy to JSON (behavior-preserving) + English editing

### Task 7: Extraction script → `app/data/endingsContent.json`

**Files:**
- Create: `scripts/gen-endings-content.ts`
- Create (generated): `app/data/endingsContent.json`

- [ ] **Step 1: Implement the extraction script**

Create `scripts/gen-endings-content.ts`:
```ts
/**
 * One-off + repeatable extraction: reads the live ENDINGS (English) and the
 * ending-region translations from RUNTIME_COMMAND_SUPPLEMENT, and writes them
 * to app/data/endingsContent.json as the source of truth.
 *
 * JSON shape:
 *   { <endingId>: {
 *       fields: { title, subtitle, ufo74_final,
 *                 narrative: string[], aol: { headline, subheadline, url,
 *                 imageSrc?, imageAlt, visitorCount, body: string[] } },   // English
 *       translations: { 'pt-BR': Record<englishString,string>,
 *                       'es': Record<englishString,string> }   // every ending-region entry, verbatim
 *   } }
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ENDINGS, type EndingId } from '../app/engine/endings';
import { RUNTIME_COMMAND_SUPPLEMENT } from '../app/i18n/runtimeCommandSupplement';

// The English strings each ending contributes (for filtering the supplement).
function englishStringsOf(id: EndingId): string[] {
  const e = ENDINGS[id];
  return [
    e.title, e.subtitle, e.ufo74_final,
    ...e.narrative,
    e.aol.headline, e.aol.subheadline, e.aol.imageAlt,
    ...e.aol.body,
  ];
}

const ids = Object.keys(ENDINGS) as EndingId[];
// Build a global map englishString -> owning endingId (first owner wins).
const owner = new Map<string, EndingId>();
for (const id of ids) for (const s of englishStringsOf(id)) if (!owner.has(s)) owner.set(s, id);

const out: Record<string, unknown> = {};
for (const id of ids) {
  const perLocale: Record<'pt-BR' | 'es', Record<string, string>> = { 'pt-BR': {}, es: {} };
  for (const locale of ['pt-BR', 'es'] as const) {
    const dict = RUNTIME_COMMAND_SUPPLEMENT[locale];
    for (const [en, translated] of Object.entries(dict)) {
      if (owner.get(en) === id) perLocale[locale][en] = translated;
    }
  }
  out[id] = { fields: ENDINGS[id], translations: perLocale };
}

const target = resolve(import.meta.dirname, '../app/data/endingsContent.json');
writeFileSync(target, JSON.stringify(out, null, 2) + '\n', 'utf-8');
console.log(`wrote ${target} (${ids.length} endings)`);
```

- [ ] **Step 2: Run the extraction**

Run: `npm run gen:endings-content`
Expected: prints `wrote …/app/data/endingsContent.json (12 endings)`.

- [ ] **Step 3: Sanity-check the JSON**

Run:
```bash
npx tsx -e "const j=require('./app/data/endingsContent.json'); console.log(Object.keys(j).length, j.government_scandal.fields.title, Object.keys(j.government_scandal.translations['pt-BR']).length)"
```
Expected: prints `12 GOVERNMENT SCANDAL` and a translation count ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add scripts/gen-endings-content.ts app/data/endingsContent.json
git commit -m "feat: extract ending copy + translations to endingsContent.json

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 8: Codegen → generated English content module, and wire `endings.ts` to it

**Files:**
- Create: `scripts/gen-endings-from-content.ts`
- Create (generated): `app/engine/generated/endingsContent.generated.ts`
- Modify: `app/engine/endings.ts` (replace inline `ENDINGS` object literal at 375–653 with an import)
- Test: `app/engine/__tests__/endingsContent.equivalence.test.ts`

- [ ] **Step 1: Write the failing equivalence test**

Create `app/engine/__tests__/endingsContent.equivalence.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { ENDINGS } from '../endings';
import content from '../../data/endingsContent.json';

describe('endings content equivalence', () => {
  it('every ENDINGS entry deep-equals the JSON source of truth', () => {
    for (const [id, e] of Object.entries(ENDINGS)) {
      expect(e).toEqual((content as Record<string, { fields: unknown }>)[id].fields);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node scripts/run-vitest.mjs run app/engine/__tests__/endingsContent.equivalence.test.ts --configLoader runner --reporter=dot`
Expected: at this point it likely PASSES only if the generated module already feeds ENDINGS — it does not yet, but the values are identical because the JSON was extracted from ENDINGS. To make this a true red→green, first change the generator + wiring (Steps 3–5) and rely on Step 6 to confirm it still passes. Treat Step 2 as a baseline snapshot: record that it passes now (values match) and MUST keep passing after wiring.

- [ ] **Step 3: Implement the codegen script**

Create `scripts/gen-endings-from-content.ts`:
```ts
/**
 * Codegen: reads app/data/endingsContent.json (source of truth) and writes:
 *   1. app/engine/generated/endingsContent.generated.ts  (English ENDINGS content)
 *   2. app/i18n/generated/endingsSupplement.generated.ts  (pt-BR/es ending translations)
 * Both files are generated — do not edit by hand.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

type Locale = 'pt-BR' | 'es';
type EndingRecord = {
  fields: unknown;
  translations: Record<Locale, Record<string, string>>;
};

const content = require('../app/data/endingsContent.json') as Record<string, EndingRecord>;

const HEADER = '// AUTO-GENERATED by scripts/gen-endings-from-content.ts — DO NOT EDIT.\n// Edit app/data/endingsContent.json and run `npm run gen:endings-from-content`.\n\n';

// 1. English content module.
const fields: Record<string, unknown> = {};
for (const [id, rec] of Object.entries(content)) fields[id] = rec.fields;
const contentTs =
  HEADER +
  "import type { EndingId, GameEnding } from '../endings';\n\n" +
  'export const ENDINGS_CONTENT: Record<EndingId, Omit<GameEnding, \'id\'>> =\n' +
  JSON.stringify(fields, null, 2) +
  ' as const;\n';

const contentDir = resolve(import.meta.dirname, '../app/engine/generated');
mkdirSync(contentDir, { recursive: true });
writeFileSync(resolve(contentDir, 'endingsContent.generated.ts'), contentTs, 'utf-8');

// 2. Translations module.
const merged: Record<Locale, Record<string, string>> = { 'pt-BR': {}, es: {} };
for (const rec of Object.values(content)) {
  for (const locale of ['pt-BR', 'es'] as const) {
    Object.assign(merged[locale], rec.translations[locale]);
  }
}
const suppTs =
  HEADER +
  "type RuntimeDictionary = Record<string, string>;\n\n" +
  "export const ENDINGS_SUPPLEMENT: Record<'pt-BR' | 'es', RuntimeDictionary> =\n" +
  JSON.stringify(merged, null, 2) +
  ';\n';

const suppDir = resolve(import.meta.dirname, '../app/i18n/generated');
mkdirSync(suppDir, { recursive: true });
writeFileSync(resolve(suppDir, 'endingsSupplement.generated.ts'), suppTs, 'utf-8');

console.log('generated endingsContent.generated.ts + endingsSupplement.generated.ts');
```

- [ ] **Step 4: Run the codegen**

Run: `npm run gen:endings-from-content`
Expected: prints `generated endingsContent.generated.ts + endingsSupplement.generated.ts`; both files exist under `app/engine/generated/` and `app/i18n/generated/`.

- [ ] **Step 5: Wire `endings.ts` to the generated English content**

In `app/engine/endings.ts`, add near the top (after the existing imports):
```ts
import { ENDINGS_CONTENT } from './generated/endingsContent.generated';
```
Then replace the entire inline object literal assigned to `ENDINGS` (the `export const ENDINGS: Record<EndingId, Omit<GameEnding, 'id'>> = { … };` block spanning lines 375–653) with:
```ts
export const ENDINGS: Record<EndingId, Omit<GameEnding, 'id'>> = ENDINGS_CONTENT;
```
Leave `getEndingNarrativeLines`, `determineEnding`, `analyzeDossier`, `FILE_CATEGORIES`, and all other exports unchanged.

- [ ] **Step 6: Run the equivalence test + the endings doc guard**

Run:
```bash
node scripts/run-vitest.mjs run app/engine/__tests__/endingsContent.equivalence.test.ts --configLoader runner --reporter=dot
npx tsx scripts/gen-endings-doc.ts && git diff --stat game_story_files/endings.MD
```
Expected: equivalence test PASSES; `endings.MD` shows **no diff** (proves player-visible ending content is byte-identical after the refactor).

- [ ] **Step 7: Commit**

```bash
git add scripts/gen-endings-from-content.ts app/engine/generated/ app/engine/endings.ts app/engine/__tests__/endingsContent.equivalence.test.ts
git commit -m "refactor: source ENDINGS content from generated module (behavior-preserving)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 9: Route the runtime supplement through the generated translations module

**Files:**
- Modify: `app/i18n/runtimeCommandSupplement.ts` (replace the 12 `// ENDING N:` regions in BOTH the `pt-BR` and `es` objects with a spread of the generated module)
- Create: `app/i18n/__tests__/endingsSupplement.baseline.json` (committed baseline captured pre-change)
- Test: `app/i18n/__tests__/endingsSupplement.equivalence.test.ts`

- [ ] **Step 1: Capture the pre-change baseline of the merged dictionaries**

Run:
```bash
npx tsx -e "import('./app/i18n/runtimeCommandSupplement.ts').then(m => { const fs=require('node:fs'); fs.writeFileSync('app/i18n/__tests__/endingsSupplement.baseline.json', JSON.stringify(m.RUNTIME_COMMAND_SUPPLEMENT, null, 2)+'\n'); console.log('baseline written'); })"
```
Expected: prints `baseline written`; the file contains the FULL current pt-BR/es dictionaries (all keys, ending and non-ending).

- [ ] **Step 2: Write the equivalence test**

Create `app/i18n/__tests__/endingsSupplement.equivalence.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { RUNTIME_COMMAND_SUPPLEMENT } from '../runtimeCommandSupplement';
import baseline from './endingsSupplement.baseline.json';

describe('runtime supplement equivalence after generated-module refactor', () => {
  it('pt-BR dictionary is unchanged (same keys and values)', () => {
    expect(RUNTIME_COMMAND_SUPPLEMENT['pt-BR']).toEqual((baseline as typeof RUNTIME_COMMAND_SUPPLEMENT)['pt-BR']);
  });
  it('es dictionary is unchanged (same keys and values)', () => {
    expect(RUNTIME_COMMAND_SUPPLEMENT.es).toEqual((baseline as typeof RUNTIME_COMMAND_SUPPLEMENT).es);
  });
});
```

- [ ] **Step 3: Run the test to confirm it passes BEFORE the edit (baseline sanity)**

Run: `node scripts/run-vitest.mjs run app/i18n/__tests__/endingsSupplement.equivalence.test.ts --configLoader runner --reporter=dot`
Expected: PASS (baseline equals current). This test now guards the next edit.

- [ ] **Step 4: Replace the ending regions with the generated spread**

In `app/i18n/runtimeCommandSupplement.ts`:
1. Add at the top (after the `type RuntimeDictionary` line):
```ts
import { ENDINGS_SUPPLEMENT } from './generated/endingsSupplement.generated';
```
2. In the `'pt-BR': { … }` object, delete every entry between `// ENDING 1: ridiculed` and the end of `// ENDING 12: real_ending`'s entries (the ending-region block), and in its place put:
```ts
    ...ENDINGS_SUPPLEMENT['pt-BR'],
```
3. Do the same in the `es: { … }` object, replacing its `// ENDING 1..12` region with:
```ts
    ...ENDINGS_SUPPLEMENT.es,
```
Leave all NON-ending entries in both objects exactly as they are.

- [ ] **Step 5: Run the equivalence test + full i18n tests**

Run:
```bash
node scripts/run-vitest.mjs run app/i18n/__tests__/ --configLoader runner --reporter=dot
```
Expected: the equivalence test PASSES (merged dictionaries identical to baseline), and the existing i18n tests (including `runtimeCommandSupplement.smokingGun.test.ts`) PASS. If a key is missing, it means an ending-region entry was not captured by extraction (Task 7) — re-run `npm run gen:endings-content && npm run gen:endings-from-content` and re-check.

- [ ] **Step 6: Commit**

```bash
git add app/i18n/runtimeCommandSupplement.ts app/i18n/generated/ app/i18n/__tests__/endingsSupplement.equivalence.test.ts app/i18n/__tests__/endingsSupplement.baseline.json
git commit -m "refactor: source ending translations from generated supplement module

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 10: Save endpoint (writes JSON + regenerates) and Editor UI

**Files:**
- Modify: `tools/endings-admin/server.ts` (add `GET /api/content` and `POST /api/save`)
- Modify: `tools/endings-admin/public/app.js` (Editor tab)
- Test: `tools/endings-admin/__tests__/save.test.ts`

- [ ] **Step 1: Write the failing test for save round-trip**

Create `tools/endings-admin/__tests__/save.test.ts`:
```ts
import { describe, it, expect, afterAll } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Server } from 'node:http';
import { createServer } from '../server';

const CONTENT = resolve(__dirname, '../../../app/data/endingsContent.json');
const original = readFileSync(CONTENT, 'utf-8');

const server: Server = createServer();
await new Promise<void>(r => server.listen(0, r));
const port = (server.address() as import('node:net').AddressInfo).port;
const base = `http://127.0.0.1:${port}`;

afterAll(() => {
  writeFileSync(CONTENT, original, 'utf-8'); // restore
  return new Promise<void>(r => server.close(() => r()));
});

describe('save endpoint', () => {
  it('GET /api/content returns the source-of-truth JSON', async () => {
    const body = await (await fetch(`${base}/api/content`)).json();
    expect(body.government_scandal.fields.title).toBe('GOVERNMENT SCANDAL');
  });

  it('POST /api/save persists an edited title back to JSON', async () => {
    const content = await (await fetch(`${base}/api/content`)).json();
    content.ridiculed.fields.title = 'RIDICULED (edited)';
    const res = await fetch(`${base}/api/save`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    expect(res.status).toBe(200);
    const onDisk = JSON.parse(readFileSync(CONTENT, 'utf-8'));
    expect(onDisk.ridiculed.fields.title).toBe('RIDICULED (edited)');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node scripts/run-vitest.mjs run tools/endings-admin/__tests__/save.test.ts --configLoader runner --reporter=dot`
Expected: FAIL — `/api/content` returns 404.

- [ ] **Step 3: Add the endpoints to `server.ts`**

In `tools/endings-admin/server.ts`, add these imports at the top:
```ts
import { readFile as readFileAsync, writeFile as writeFileAsync } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
```
Add a constant near `PUBLIC_DIR`:
```ts
const CONTENT_PATH = join(__dirname, '../../app/data/endingsContent.json');
const REPO_ROOT = join(__dirname, '../../');
```
Inside `createServer`'s handler, before the final `sendJson(res, 404, …)`, add:
```ts
      if (req.method === 'GET' && url.pathname === '/api/content') {
        const raw = await readFileAsync(CONTENT_PATH, 'utf-8');
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
        return void res.end(raw);
      }
      if (req.method === 'POST' && url.pathname === '/api/save') {
        const body = (await readBody(req)) as { content?: unknown };
        if (!body.content || typeof body.content !== 'object') {
          return sendJson(res, 400, { error: 'missing content' });
        }
        await writeFileAsync(CONTENT_PATH, JSON.stringify(body.content, null, 2) + '\n', 'utf-8');
        // Regenerate the modules the game consumes.
        execFileSync('npx', ['tsx', 'scripts/gen-endings-from-content.ts'], { cwd: REPO_ROOT });
        let diff = '';
        try { diff = execFileSync('git', ['diff', '--stat'], { cwd: REPO_ROOT, encoding: 'utf-8' }); } catch { /* ignore */ }
        return sendJson(res, 200, { ok: true, diff });
      }
```

- [ ] **Step 4: Run the save test to verify it passes**

Run: `node scripts/run-vitest.mjs run tools/endings-admin/__tests__/save.test.ts --configLoader runner --reporter=dot`
Expected: PASS (2 tests). The `afterAll` restores the JSON; verify `git status app/data/endingsContent.json` is clean afterward (restore also regenerated modules on save — regenerate once more to restore them: `npm run gen:endings-from-content`, then confirm `git status` clean).

- [ ] **Step 5: Add the Editor UI to `app.js`**

Replace the `Editor is added in Phase 2–3.` placeholder by rendering an editor. Append to `tools/endings-admin/public/app.js`:
```js
async function renderEditor() {
  const content = await (await fetch('/api/content')).json();
  const root = document.querySelector('#editor');
  root.innerHTML = '<p>Edit English + translations, then Save. Review the git diff before committing.</p>';
  const select = document.createElement('select');
  Object.keys(content).forEach((id) => {
    const opt = document.createElement('option'); opt.value = id; opt.textContent = id; select.appendChild(opt);
  });
  const form = document.createElement('div');
  const saveBtn = document.createElement('button'); saveBtn.textContent = 'Save';
  const status = document.createElement('pre');

  function drawFields(id) {
    form.innerHTML = '';
    const f = content[id].fields;
    const addField = (label, getVal, setVal) => {
      const wrap = document.createElement('div'); wrap.className = 'cat';
      const h = document.createElement('h4'); h.textContent = label; wrap.appendChild(h);
      const ta = document.createElement('textarea'); ta.value = getVal(); ta.style.width = '100%'; ta.rows = 2;
      ta.addEventListener('input', () => setVal(ta.value));
      wrap.appendChild(ta); form.appendChild(wrap);
    };
    addField('title', () => f.title, (v) => (f.title = v));
    addField('subtitle', () => f.subtitle, (v) => (f.subtitle = v));
    addField('ufo74_final', () => f.ufo74_final, (v) => (f.ufo74_final = v));
    f.narrative.forEach((line, i) => addField(`narrative[${i}]`, () => f.narrative[i], (v) => (f.narrative[i] = v)));
    addField('aol.headline', () => f.aol.headline, (v) => (f.aol.headline = v));
    addField('aol.subheadline', () => f.aol.subheadline, (v) => (f.aol.subheadline = v));
    f.aol.body.forEach((line, i) => addField(`aol.body[${i}]`, () => f.aol.body[i], (v) => (f.aol.body[i] = v)));
  }

  select.addEventListener('change', () => drawFields(select.value));
  saveBtn.addEventListener('click', async () => {
    status.textContent = 'Saving…';
    const res = await fetch('/api/save', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const r = await res.json();
    status.textContent = r.ok ? 'Saved. git diff:\n' + (r.diff || '(no diff)') : 'Error: ' + r.error;
  });

  root.appendChild(select); root.appendChild(form); root.appendChild(saveBtn); root.appendChild(status);
  drawFields(select.value);
}
```
And update the tab handler so switching to the Editor tab calls `renderEditor()` once — change the nav click handler in `app.js` to add, after `$('#' + btn.dataset.tab).classList.add('active');`:
```js
    if (btn.dataset.tab === 'editor' && !$('#editor select')) renderEditor();
```

> **Note (v1 limitation, per spec §7):** this Editor edits English `fields`. The
> per-field pt-BR/es translations remain in `content.<id>.translations` and are
> preserved on save (round-tripped untouched). Adding per-field translation
> inputs is the remaining Phase-3 UI work; see Task 12.

- [ ] **Step 6: Manual smoke test**

Run `npm run admin`, open `http://localhost:4599`, go to Editor, change a `narrative[0]`, click Save. Expected: status shows `Saved. git diff:` listing `app/data/endingsContent.json` and the generated module. Then `git checkout app/data/endingsContent.json app/engine/generated/ app/i18n/generated/` to discard the smoke-test edit. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add tools/endings-admin/server.ts tools/endings-admin/public/app.js tools/endings-admin/__tests__/save.test.ts
git commit -m "feat(admin): content GET + save endpoint and English editor UI

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## PHASE 3 — Trilingual editing

### Task 11: Save regenerates translations from per-field locale edits

**Files:**
- Modify: `scripts/gen-endings-from-content.ts` (build translations from per-field `{ 'pt-BR', es }` when present, falling back to existing `translations` map)
- Test: `tools/endings-admin/__tests__/translations.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tools/endings-admin/__tests__/translations.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { buildSupplement } from '../../../scripts/gen-endings-from-content';

describe('supplement build from per-field locale edits', () => {
  it('maps an edited English string to its pt-BR translation', () => {
    const content = {
      demo: {
        fields: { title: 'HELLO', subtitle: '', ufo74_final: '', narrative: [],
          aol: { headline: '', subheadline: '', url: '', imageAlt: '', visitorCount: 0, body: [] } },
        translations: { 'pt-BR': {}, es: {} },
        fieldLocales: { title: { 'pt-BR': 'OLÁ', es: 'HOLA' } },
      },
    };
    const merged = buildSupplement(content as never);
    expect(merged['pt-BR']['HELLO']).toBe('OLÁ');
    expect(merged.es['HELLO']).toBe('HOLA');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node scripts/run-vitest.mjs run tools/endings-admin/__tests__/translations.test.ts --configLoader runner --reporter=dot`
Expected: FAIL — `buildSupplement` is not exported.

- [ ] **Step 3: Refactor `gen-endings-from-content.ts` to export `buildSupplement`**

In `scripts/gen-endings-from-content.ts`, extract the translations-merge logic into an exported pure function and use it in the file-writing code:
```ts
type FieldLocales = Record<string, Partial<Record<Locale, string>>>;
type EndingRecordV2 = EndingRecord & { fieldLocales?: FieldLocales };

/**
 * Merge every ending's translations into two dictionaries keyed by English
 * string. Priority: explicit per-field locale edits (fieldLocales) override the
 * passthrough `translations` map. `fields` supplies the English key for each
 * per-field edit.
 */
export function buildSupplement(
  content: Record<string, EndingRecordV2>,
): Record<Locale, Record<string, string>> {
  const merged: Record<Locale, Record<string, string>> = { 'pt-BR': {}, es: {} };
  for (const rec of Object.values(content)) {
    for (const locale of ['pt-BR', 'es'] as const) {
      Object.assign(merged[locale], rec.translations[locale]);
    }
    if (rec.fieldLocales) {
      const f = rec.fields as {
        title: string; subtitle: string; ufo74_final: string; narrative: string[];
        aol: { headline: string; subheadline: string; imageAlt: string; body: string[] };
      };
      const englishFor = (key: string): string | undefined => {
        if (key === 'title') return f.title;
        if (key === 'subtitle') return f.subtitle;
        if (key === 'ufo74_final') return f.ufo74_final;
        if (key === 'aol.headline') return f.aol.headline;
        if (key === 'aol.subheadline') return f.aol.subheadline;
        if (key === 'aol.imageAlt') return f.aol.imageAlt;
        const nm = key.match(/^narrative\[(\d+)\]$/); if (nm) return f.narrative[Number(nm[1])];
        const bm = key.match(/^aol\.body\[(\d+)\]$/); if (bm) return f.aol.body[Number(bm[1])];
        return undefined;
      };
      for (const [fieldKey, locales] of Object.entries(rec.fieldLocales)) {
        const en = englishFor(fieldKey);
        if (!en) continue;
        for (const locale of ['pt-BR', 'es'] as const) {
          const val = locales[locale];
          if (val) merged[locale][en] = val;
        }
      }
    }
  }
  return merged;
}
```
Then change the file-writing section that currently builds `merged` inline to call `buildSupplement(content as Record<string, EndingRecordV2>)` instead of the manual loop.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node scripts/run-vitest.mjs run tools/endings-admin/__tests__/translations.test.ts --configLoader runner --reporter=dot`
Expected: PASS.

- [ ] **Step 5: Confirm regeneration is still equivalence-safe**

Run:
```bash
npm run gen:endings-from-content
node scripts/run-vitest.mjs run app/i18n/__tests__/endingsSupplement.equivalence.test.ts app/engine/__tests__/endingsContent.equivalence.test.ts --configLoader runner --reporter=dot
```
Expected: both equivalence tests still PASS (no `fieldLocales` present yet → identical output).

- [ ] **Step 6: Commit**

```bash
git add scripts/gen-endings-from-content.ts tools/endings-admin/__tests__/translations.test.ts app/i18n/generated/ app/engine/generated/
git commit -m "feat: build ending translations from per-field locale edits

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 12: Trilingual editor inputs

**Files:**
- Modify: `tools/endings-admin/public/app.js` (add pt-BR/es inputs per field; write to `fieldLocales`)

- [ ] **Step 1: Extend `drawFields` to render translation inputs**

In `renderEditor`'s `drawFields`, replace the `addField` helper so each field also renders pt-BR and es inputs pre-filled from the existing translation (looked up by the current English value) and writing to `content[id].fieldLocales`:
```js
    const rec = content[id];
    rec.fieldLocales = rec.fieldLocales || {};
    const tr = (loc, en) => (rec.translations[loc] && rec.translations[loc][en]) || '';
    const addField = (label, getVal, setVal) => {
      const wrap = document.createElement('div'); wrap.className = 'cat';
      const h = document.createElement('h4'); h.textContent = label; wrap.appendChild(h);
      const en = document.createElement('textarea'); en.value = getVal(); en.style.width = '100%'; en.rows = 2;
      en.addEventListener('input', () => setVal(en.value));
      wrap.appendChild(document.createTextNode('EN')); wrap.appendChild(en);
      ['pt-BR', 'es'].forEach((loc) => {
        const ta = document.createElement('textarea'); ta.value = tr(loc, getVal()); ta.style.width = '100%'; ta.rows = 2;
        ta.addEventListener('input', () => {
          rec.fieldLocales[label] = rec.fieldLocales[label] || {};
          rec.fieldLocales[label][loc] = ta.value;
        });
        wrap.appendChild(document.createTextNode(loc)); wrap.appendChild(ta);
      });
      form.appendChild(wrap);
    };
```
Everything else in `drawFields` (the `addField(...)` calls) stays the same. On Save, `content` now carries `fieldLocales`, which `POST /api/save` writes to JSON and `buildSupplement` (Task 11) turns into translations on regeneration.

- [ ] **Step 2: Manual smoke test**

Run `npm run admin`; in Editor, edit a field's EN and its pt-BR box; Save. Then:
```bash
grep -n "fieldLocales" app/data/endingsContent.json | head
node scripts/run-vitest.mjs run app/i18n/__tests__/ --configLoader runner --reporter=dot
```
Expected: `fieldLocales` present in the JSON; i18n tests still pass (the edited English key now maps to the new pt-BR value). Discard the smoke-test edit: `git checkout app/data/endingsContent.json app/engine/generated/ app/i18n/generated/`, then `npm run gen:endings-from-content`.

- [ ] **Step 3: Commit**

```bash
git add tools/endings-admin/public/app.js
git commit -m "feat(admin): trilingual (EN/pt-BR/es) editor inputs

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 13: Final full validation + docs

**Files:**
- Modify: `README.md` (add a short "Endings admin tool" section)

- [ ] **Step 1: Add a README section**

Under an appropriate place in `README.md`, add:
```markdown
## Endings admin tool (localhost)

A local, dev-only tool to explore/simulate all endings and edit ending copy.
It is never part of the deployed game.

```bash
npm run admin   # http://localhost:4599
```

- **Explorer/Simulator:** see each ending's trigger rule and toggle leaked files
  to see which ending fires (uses the real `determineEnding`).
- **Editor:** edit ending copy in EN/pt-BR/es and Save. Saving writes
  `app/data/endingsContent.json` and regenerates the modules the game consumes.
  Review `git diff`, then commit and push to deploy.
```

- [ ] **Step 2: Run the full validation suite**

Run:
```bash
npm run typecheck
npm run lint
npm test
npm run validate-story
npx tsx scripts/gen-endings-doc.ts && git diff --stat game_story_files/endings.MD
```
Expected: typecheck clean; lint clean; **full test suite passes** (including the two equivalence tests, the smokingGun i18n test, all ending tests, and the new admin tests); validate-story passes; `endings.MD` shows **no diff**.

- [ ] **Step 3: Confirm the game build still excludes the tool**

Run:
```bash
npm run build
grep -rl "endings-admin" out/ && echo "LEAK: tool in build" || echo "tool absent from build (ok)"
```
Expected: prints `tool absent from build (ok)`.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: document the localhost endings admin tool

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Self-Review

**1. Spec coverage:**
- Spec §1/§2 localhost, dev-only, save-to-repo, no auto-deploy → Tasks 3/10 (server, save writes files + shows diff, never commits). ✅
- Spec §6.2 endpoints (`/api/model`, `/api/simulate`, `/api/content`, `/api/save`) → Tasks 3 & 10. ✅
- Spec §6.3 Explorer/Simulator/Editor → Tasks 4, 10, 12. ✅
- Spec §6.1/§5(C) JSON source-of-truth + codegen, runtime unchanged → Tasks 7–9, 11. ✅
- Spec §4 i18n (English-keyed translations kept in sync) → Tasks 7, 9, 11 (generated supplement; equivalence baseline). ✅
- Spec §6.5 guardrails (under `tools/`, not bundled, no `app/`→`tools/` import) → Tasks 5, 13 step 3. ✅
- Spec §6.6 testing (round-trip safety via `endings.MD` no-diff + supplement baseline; simulate correctness; guardrail; full suite) → Tasks 8 step 6, 9, 3, 13. ✅
- Spec §7 out-of-scope (rules read-only; no add/remove endings; no auto-deploy) → respected; rules shown read-only (Task 2), Editor edits copy only. ✅

**2. Placeholder scan:** No `TBD`/`TODO`/"handle edge cases". Every code step has full code. The one `<p>Editing is added in Phase 2–3.</p>` string in Task 4's HTML is real placeholder *UI copy* that Task 10 replaces — not a plan placeholder. ✅

**3. Type consistency:** `EndingId`, `GameEnding`, `RuntimeDictionary`, `Locale` used consistently. `ENDINGS_CONTENT` (Task 8) and `ENDINGS_SUPPLEMENT` (Task 8/codegen) match their importers (endings.ts Task 8 step 5; runtimeCommandSupplement.ts Task 9 step 4). `buildSupplement` signature (Task 11) matches its test and its use in the codegen writer. `describeRuleFor`, `exampleSaveSet`, `filesByCategory`, `fileUniverse` (Task 2) match server usage (Task 3). Save endpoint field/paths in `buildSupplement.englishFor` (`narrative[i]`, `aol.body[i]`, `aol.headline`, etc.) match the labels emitted by the Editor's `addField` calls (Task 10 step 5 / Task 12). ✅

**Note on Task 8 Step 2 (red/green):** because the JSON is extracted from the current `ENDINGS`, the equivalence test passes both before and after wiring; it functions as a *pinning* test (must stay green through the refactor) rather than a classic red→green. The true behavioral guard is the `endings.MD` no-diff check (Task 8 step 6). This is called out explicitly in the task so the engineer doesn't expect a red.
