# bot-test Autoplay Test Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A dev-only `bot-test [level] [seed]` command that plays the game turn-by-turn through the real terminal pipeline (levels `dummy`/`novice`/`pro`) while the developer watches, then prints a run summary + anomalies.

**Architecture:** A **pure decision core** (`decideNextCommand`) drives command strings from the live virtual filesystem (via the engine's own `getAllAccessibleFiles`/`listDirectory`/evidence helpers) and level policy. A thin dev-only React hook (`useBotRunner`) feeds those commands into the existing `handleSubmit` on an idle-gated timer, records a run log, and prints a summary. The pure core is fully unit-tested; the hook is a thin adapter.

**Tech Stack:** Next.js/TypeScript static export, Vitest 4, React 18. Reuses `createSeededRng` (`app/engine/rng.ts`), `getAllAccessibleFiles`/`listDirectory` (`app/engine/filesystem.ts`), `isEvidencePath`/`getAllEvidencePaths` (`app/engine/evidenceRevelation.ts`), `FILE_CATEGORIES`/`determineEnding` (`app/engine/endings.ts`).

**Spec:** `docs/superpowers/specs/2026-07-26-bot-test-autoplay-harness-design.md`

**Test command:** `npm test -- <path>` runs a single file; `npm test` runs the full suite. `npm run typecheck` and `npm run build` for full validation.

**Branch:** `feature/bot-test-harness` (already created off `main`; spec committed).

**Verified mechanics (ground truth for the strategy):**
- `executeCommand(input, state)` is pure (`app/engine/commands.ts:90`) → `{ output, stateChanges, ... }`.
- `getAllAccessibleFiles(state)` (`app/engine/filesystem.ts:262`) returns a flat list of every currently-reachable file path, respecting `requiredFlags`/`accessThreshold`. Gated files (e.g. under `/admin`, `/internal`) only appear after unlock.
- `open <path>` accepts absolute paths; `save <filename>` matches a basename against `state.filesRead` and adds the full path to `state.savedFiles` (`app/engine/commands/system.ts:786`). Must read before save.
- Admin unlock: `override protocol COLHEITA` (`app/engine/commands/combat.ts:134,190`). Correct password unlocks; **3 wrong attempts = game over** — so the bot must only ever submit the correct password.
- **Override "terrible mistake" trap (`combat.ts:274-280`):** a *correct* password triggers a doom-countdown/max-detection climax instead of a clean unlock when `detectionLevel >= DETECTION_THRESHOLDS.ALERT && evidenceCount >= 2 && !terribleMistakeTriggered` (35% roll). The clean unlock branch (`combat.ts:375+`) sets `flags.adminUnlocked=true` and `accessLevel=5`. **Therefore `pro` must issue `override` early, while detection is still 0 and no evidence is counted** — this deterministically takes the clean unlock path. The strategy does exactly this (override is the first action for pro, before any reads). Do not reorder pro's override to after evidence gathering.
- `ghost_in_machine.enc` (`app/data/narrativeContent.ts:9`) has `accessThreshold: 3` + `requiredFlags: ['adminUnlocked']`, so it only appears in `getAllAccessibleFiles` after a clean `override` (which sets `accessLevel=5`, `adminUnlocked=true`).
- Leak flow (`app/engine/commands/evidence.ts:156`): with ≥5 saved, first `leak` generates a 3-command prep sequence into `state.leakSequence` (string[]) with `state.leakSequenceProgress` 0→3. Player runs `leak <sequence[i]>` in order; then `leak` with `progress>=3 && savedCount>=10` (`MAX_EVIDENCE_COUNT`) sets `gameWon:true`. The bot reads `state.leakSequence`/`state.leakSequenceProgress` from state to drive this.
- `determineEnding(savedFiles)` (`app/engine/endings.ts:308`) picks the ending from saved filenames; secret ending needs saved files matching `FILE_CATEGORIES.ghost_machine` (`ghost_in_machine.enc`), `alpha_neural`, and `temporal_convergence`. `ghost_in_machine.enc` is **not** flagged `isEvidence`, so pro must save it explicitly.
- Dev gating pattern: `process.env.NODE_ENV === 'development'` (`app/storage/saves.ts:469`, `app/components/ErrorBoundary.tsx:37`).
- `handleSubmit` (`app/hooks/useTerminalInput.ts:262`) reads `inputValue` from closure, guards `if (isProcessingRef.current || isProcessing || showTuringTest || !trimmedInput) return;` (line 549), and (bug) calls `executeCommand(inputValue, newState)` at line 605 instead of the parsed `command`.

---

## File structure

| File | Responsibility |
|---|---|
| `app/engine/bot/types.ts` | `BotLevel`, `BotPhase`, `BotDecision`, `BotMemory`, `BotRunConfig`, `BotRunLogEntry`; `createBotMemory()` |
| `app/engine/overrideSecret.ts` (new) | Single source-of-truth `OVERRIDE_PASSWORD = 'COLHEITA'` |
| `app/engine/bot/targets.ts` | `secretEndingTargets()`, `saveTargetsForLevel(level)` — ordered save priorities |
| `app/engine/bot/strategy.ts` | Pure `decideNextCommand(state, memory, level, seed) → { decision, memory }` |
| `app/engine/bot/report.ts` | Pure `buildRunSummary(log, config, finalState) → TerminalEntry[]` |
| `app/engine/commands/debug.ts` (new) | `bot-test` / `bot-stop` command handlers (dev-gated) |
| `app/hooks/useBotRunner.ts` (new) | Dev-only React loop feeding decisions into `handleSubmit` |
| `app/hooks/useTerminalInput.ts` | `handleSubmit(e?, overrideInput?)` seam |
| `app/components/Terminal.tsx` | Thread override param; wire `useBotRunner` (dev-gated) |
| `app/types/index.ts` | Add optional `botTest?: BotRunConfig` to `GameState` |

---

### Task 1: Bot types + GameState field

**Files:**
- Create: `app/engine/bot/types.ts`
- Modify: `app/types/index.ts` (add optional field near `leakSequence`, ~line 353; import type)
- Test: `app/engine/bot/__tests__/types.test.ts`

- [ ] **Step 1: Write the failing test**

Create `app/engine/bot/__tests__/types.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { createBotMemory } from '../types';

describe('createBotMemory', () => {
  it('starts a fresh run with zeroed counters', () => {
    const m = createBotMemory();
    expect(m.turnsTaken).toBe(0);
    expect(m.lastDecision).toBeNull();
    expect(m.noProgressStreak).toBe(0);
    expect(m.overrideAttempted).toBe(false);
    expect(m.lastProgressSignature).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/engine/bot/__tests__/types.test.ts`
Expected: FAIL — cannot find module `../types`.

- [ ] **Step 3: Create the types module**

Create `app/engine/bot/types.ts`:

```typescript
export type BotLevel = 'dummy' | 'novice' | 'pro';

export type BotDecision =
  | { kind: 'command'; text: string }
  | { kind: 'enter' }
  | { kind: 'done'; reason: string };

export interface BotRunConfig {
  active: boolean;
  level: BotLevel;
  seed: number;
  maxTurns: number;
  delayMs: number;
}

export interface BotMemory {
  turnsTaken: number;
  lastDecision: string | null;
  noProgressStreak: number;
  overrideAttempted: boolean;
  lastProgressSignature: string;
}

export interface BotRunLogEntry {
  turn: number;
  command: string;
  detectionBefore: number;
  detectionAfter: number;
  filesReadAfter: number;
  savedAfter: number;
  anomaly?: string;
}

export function createBotMemory(): BotMemory {
  return {
    turnsTaken: 0,
    lastDecision: null,
    noProgressStreak: 0,
    overrideAttempted: false,
    lastProgressSignature: '',
  };
}

export const DEFAULT_BOT_MAX_TURNS = 400;
export const DEFAULT_BOT_DELAY_MS = 900;
```

- [ ] **Step 4: Add the optional GameState field**

In `app/types/index.ts`, add an import at the top of the file (with the other imports) and the field. First add near the top:

```typescript
import type { BotRunConfig } from '../engine/bot/types';
```

Then, immediately after the `leakSequenceGenerated: boolean;` field (~line 355), add:

```typescript
  botTest?: BotRunConfig; // Dev-only autoplay harness config; never persisted.
```

(No change to `DEFAULT_GAME_STATE` — the field is optional and defaults to `undefined`.)

- [ ] **Step 5: Run test + typecheck to verify pass**

Run: `npm test -- app/engine/bot/__tests__/types.test.ts && npm run typecheck`
Expected: PASS and clean typecheck.

- [ ] **Step 6: Commit**

```bash
git add app/engine/bot/types.ts app/types/index.ts app/engine/bot/__tests__/types.test.ts
git commit -m "feat(bot): add bot-test types and optional GameState.botTest field" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Extract the override password to a single source of truth

**Files:**
- Create: `app/engine/overrideSecret.ts`
- Modify: `app/engine/commands/combat.ts:191` (`const correctPassword = 'COLHEITA';`)
- Modify: `app/engine/commands/chat.ts:2404` (`const correct = 'COLHEITA';`)
- Test: `app/engine/__tests__/overrideSecret.test.ts`

- [ ] **Step 1: Write the failing test**

Create `app/engine/__tests__/overrideSecret.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { OVERRIDE_PASSWORD } from '../overrideSecret';

describe('OVERRIDE_PASSWORD', () => {
  it('is the canonical admin override password', () => {
    expect(OVERRIDE_PASSWORD).toBe('COLHEITA');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/engine/__tests__/overrideSecret.test.ts`
Expected: FAIL — cannot find module `../overrideSecret`.

- [ ] **Step 3: Create the module**

Create `app/engine/overrideSecret.ts`:

```typescript
/**
 * Single source of truth for the admin override password.
 * Imported by the override command, the chat/morse reveal, and the dev-only
 * bot-test harness so no copy drifts from another.
 */
export const OVERRIDE_PASSWORD = 'COLHEITA';
```

- [ ] **Step 4: Point the two command modules at it**

In `app/engine/commands/combat.ts`, add to the existing import block at the top of the file:

```typescript
import { OVERRIDE_PASSWORD } from '../overrideSecret';
```

Then replace line 191 (`const correctPassword = 'COLHEITA';`) with:

```typescript
    const correctPassword = OVERRIDE_PASSWORD;
```

In `app/engine/commands/chat.ts`, add to the existing import block at the top:

```typescript
import { OVERRIDE_PASSWORD } from '../overrideSecret';
```

Then replace line 2404 (`const correct = 'COLHEITA';`) with:

```typescript
    const correct = OVERRIDE_PASSWORD;
```

(Leave all user-facing literal `'COLHEITA'` strings inside output/i18n messages unchanged — those are display copy, not logic.)

- [ ] **Step 5: Run tests to verify pass (no regressions in override/chat)**

Run: `npm test -- app/engine/__tests__/overrideSecret.test.ts app/engine/commands/__tests__ app/engine/__tests__/narrative-mechanics.test.ts`
Expected: PASS (override still accepts `COLHEITA`; morse reveal unchanged).

- [ ] **Step 6: Commit**

```bash
git add app/engine/overrideSecret.ts app/engine/commands/combat.ts app/engine/commands/chat.ts app/engine/__tests__/overrideSecret.test.ts
git commit -m "refactor(engine): extract OVERRIDE_PASSWORD to a single source of truth" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Save-target priorities (`targets.ts`)

The dossier caps at 10 saved files. `pro` must reserve slots for the secret-ending file categories before filling with other evidence.

**Files:**
- Create: `app/engine/bot/targets.ts`
- Test: `app/engine/bot/__tests__/targets.test.ts`

- [ ] **Step 1: Write the failing test**

Create `app/engine/bot/__tests__/targets.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { secretEndingTargets, isSecretTarget } from '../targets';

describe('secretEndingTargets', () => {
  it('includes the secret-ending category files', () => {
    const t = secretEndingTargets();
    expect(t.some(f => f.includes('ghost_in_machine'))).toBe(true);
    expect(t.some(f => f.includes('alpha_neural'))).toBe(true);
    expect(t.some(f => f.includes('convergence'))).toBe(true);
  });

  it('isSecretTarget matches by basename regardless of directory', () => {
    expect(isSecretTarget('/internal/ghost_in_machine.enc')).toBe(true);
    expect(isSecretTarget('/storage/random_manifest.txt')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/engine/bot/__tests__/targets.test.ts`
Expected: FAIL — cannot find module `../targets`.

- [ ] **Step 3: Implement**

Create `app/engine/bot/targets.ts`:

```typescript
import { FILE_CATEGORIES } from '../endings';

/**
 * Filenames whose presence in the dossier steers determineEnding() toward the
 * secret ending. Derived from the endings source of truth so it never drifts.
 */
export function secretEndingTargets(): string[] {
  return [
    ...FILE_CATEGORIES.ghost_machine,
    ...FILE_CATEGORIES.alpha_neural,
    ...FILE_CATEGORIES.temporal_convergence,
  ];
}

/** True if the given path's basename is one of the secret-ending target files. */
export function isSecretTarget(path: string): boolean {
  const name = path.split('/').pop() || '';
  return secretEndingTargets().some(t => name === t || name.includes(t.replace(/\.[^.]+$/, '')));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/engine/bot/__tests__/targets.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/engine/bot/targets.ts app/engine/bot/__tests__/targets.test.ts
git commit -m "feat(bot): secret-ending save targets derived from FILE_CATEGORIES" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Strategy — explore, read, and save (dummy & novice baseline)

The core loop. `decideNextCommand` inspects live state and returns the next `BotDecision`.

**Files:**
- Create: `app/engine/bot/strategy.ts`
- Test: `app/engine/bot/__tests__/strategy.test.ts`

Helper contracts used below (already exist): `getAllAccessibleFiles(state)`, `isEvidencePath(path)`.

- [ ] **Step 1: Write the failing tests**

Create `app/engine/bot/__tests__/strategy.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { decideNextCommand } from '../strategy';
import { createBotMemory } from '../types';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';

const base = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  tutorialComplete: true,
  seed: 42,
  filesRead: new Set<string>(),
  savedFiles: new Set<string>(),
  ...overrides,
});

describe('decideNextCommand — explore/read/save', () => {
  it('opens an unread accessible file', () => {
    const { decision } = decideNextCommand(base(), createBotMemory(), 'novice', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text.startsWith('open ')).toBe(true);
    }
  });

  it('saves a read evidence file it has not saved yet', () => {
    // Pre-read every accessible file so the only remaining work is saving.
    const { getAllAccessibleFiles } = require('../../filesystem');
    const s = base();
    const all: string[] = getAllAccessibleFiles(s);
    const read = new Set(all);
    const state = base({ filesRead: read });
    const { decision } = decideNextCommand(state, createBotMemory(), 'novice', 42);
    expect(decision.kind).toBe('command');
    if (decision.kind === 'command') {
      expect(decision.text.startsWith('save ') || decision.text === 'leak').toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- app/engine/bot/__tests__/strategy.test.ts`
Expected: FAIL — cannot find module `../strategy`.

- [ ] **Step 3: Implement the baseline strategy**

Create `app/engine/bot/strategy.ts`:

```typescript
import { GameState } from '../../types';
import { getAllAccessibleFiles } from '../filesystem';
import { isEvidencePath } from '../evidenceRevelation';
import { determineEnding } from '../endings';
import { OVERRIDE_PASSWORD } from '../overrideSecret';
import { isSecretTarget } from './targets';
import { BotDecision, BotLevel, BotMemory, DEFAULT_BOT_MAX_TURNS } from './types';

const MAX_SAVED = 10;
const DETECTION_HIGH = 60;

// How much of the game each level engages with.
const LEVEL_POLICY: Record<BotLevel, {
  readLimit: number;      // max distinct files to read before moving on
  saveTarget: number;     // saved-file count that triggers the leak
  managesDetection: boolean;
  unlocksAdmin: boolean;
}> = {
  dummy: { readLimit: 4, saveTarget: 5, managesDetection: false, unlocksAdmin: false },
  novice: { readLimit: 999, saveTarget: 10, managesDetection: true, unlocksAdmin: false },
  pro: { readLimit: 999, saveTarget: 10, managesDetection: true, unlocksAdmin: true },
};

function basename(path: string): string {
  return path.split('/').pop() || path;
}

function progressSignature(state: GameState): string {
  const admin = state.flags?.adminUnlocked ? 1 : 0;
  return `${state.filesRead.size}:${state.savedFiles.size}:${state.leakSequenceProgress}:${admin}`;
}

/** Whether this level wants to save this file (and it fits the dossier priority). */
function shouldSave(path: string, level: BotLevel): boolean {
  if (level === 'pro') return isSecretTarget(path) || isEvidencePath(path);
  return isEvidencePath(path);
}

export function decideNextCommand(
  state: GameState,
  memory: BotMemory,
  level: BotLevel,
  seed: number
): { decision: BotDecision; memory: BotMemory } {
  const policy = LEVEL_POLICY[level];
  const m: BotMemory = { ...memory, turnsTaken: memory.turnsTaken + 1 };

  // Terminal conditions.
  if (state.gameWon || state.isGameOver) {
    return { decision: { kind: 'done', reason: state.gameWon ? 'ending reached' : 'game over' }, memory: m };
  }
  if (m.turnsTaken > DEFAULT_BOT_MAX_TURNS) {
    return { decision: { kind: 'done', reason: 'max turns reached' }, memory: m };
  }

  // No-progress loop detection.
  const sig = progressSignature(state);
  if (sig === m.lastProgressSignature) {
    m.noProgressStreak += 1;
  } else {
    m.noProgressStreak = 0;
    m.lastProgressSignature = sig;
  }
  if (m.noProgressStreak >= 6) {
    return { decision: { kind: 'done', reason: 'no progress (stuck)' }, memory: m };
  }

  const decide = (text: string): { decision: BotDecision; memory: BotMemory } => {
    m.lastDecision = text;
    return { decision: { kind: 'command', text }, memory: m };
  };

  // Detection management (novice/pro).
  if (policy.managesDetection && state.detectionLevel >= DETECTION_HIGH && state.waitUsesRemaining > 0) {
    return decide('wait');
  }

  const accessible = getAllAccessibleFiles(state);
  const savedCount = state.savedFiles.size;

  // pro: unlock admin once, before exhausting reads, to reveal gated files.
  if (policy.unlocksAdmin && !state.flags?.adminUnlocked && !m.overrideAttempted) {
    m.overrideAttempted = true;
    return decide(`override protocol ${OVERRIDE_PASSWORD}`);
  }

  // Save priority: for pro, save secret-target files first so they fit in the dossier.
  const readNotSaved = accessible.filter(
    p => state.filesRead.has(p) && !state.savedFiles.has(p) && shouldSave(p, level)
  );
  if (savedCount < MAX_SAVED && readNotSaved.length > 0) {
    readNotSaved.sort((a, b) => Number(isSecretTarget(b)) - Number(isSecretTarget(a)));
    return decide(`save ${basename(readNotSaved[0])}`);
  }

  // Read unread accessible files (respecting the level's read limit).
  const unread = accessible.filter(p => !state.filesRead.has(p));
  if (unread.length > 0 && state.filesRead.size < policy.readLimit) {
    return decide(`open ${unread[0]}`);
  }

  // Ready to finish: drive the leak sequence.
  if (savedCount >= Math.min(policy.saveTarget, MAX_SAVED)) {
    return driveLeak(state, decide);
  }

  // Nothing productive left but not enough saved — leak with what we have (weak ending) or stop.
  if (savedCount >= 5) {
    return driveLeak(state, decide);
  }
  return { decision: { kind: 'done', reason: 'no productive action' }, memory: m };
}

/** Drives the multi-step leak preparation sequence using state-readable fields. */
function driveLeak(
  state: GameState,
  decide: (text: string) => { decision: BotDecision; memory: BotMemory }
): { decision: BotDecision; memory: BotMemory } {
  if (!state.leakSequenceGenerated || !state.leakSequence) {
    return decide('leak'); // generates the sequence
  }
  const progress = state.leakSequenceProgress;
  if (progress < state.leakSequence.length) {
    return decide(`leak ${state.leakSequence[progress]}`);
  }
  return decide('leak'); // sequence complete → transmit
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- app/engine/bot/__tests__/strategy.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/engine/bot/strategy.ts app/engine/bot/__tests__/strategy.test.ts
git commit -m "feat(bot): explore/read/save/leak decision core with per-level policy" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Strategy — full-run integration (drive a real game to an ending)

Prove the pure core can pilot `executeCommand` from a fresh post-tutorial state to a terminal outcome for each level.

**Files:**
- Test: `app/engine/bot/__tests__/strategy.integration.test.ts`
- Modify (only if a test reveals a bug): `app/engine/bot/strategy.ts`

- [ ] **Step 1: Write the failing test**

Create `app/engine/bot/__tests__/strategy.integration.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { executeCommand } from '../../commands';
import { decideNextCommand } from '../strategy';
import { createBotMemory } from '../types';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';
import { BotLevel } from '../types';

function runBot(level: BotLevel): { state: GameState; turns: number; reason: string } {
  let state: GameState = {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed: 12345,
    filesRead: new Set<string>(),
    savedFiles: new Set<string>(),
  };
  let memory = createBotMemory();
  let reason = 'unterminated';
  for (let i = 0; i < 600; i++) {
    const { decision, memory: nextMemory } = decideNextCommand(state, memory, level, 12345);
    memory = nextMemory;
    if (decision.kind === 'done') { reason = decision.reason; break; }
    const input = decision.kind === 'enter' ? '' : decision.text;
    const result = executeCommand(input, state);
    state = { ...state, ...result.stateChanges } as GameState;
  }
  return { state, turns: memory.turnsTaken, reason };
}

describe('strategy full-run integration', () => {
  it('novice saves the dossier and wins', () => {
    const { state, reason } = runBot('novice');
    expect(state.gameWon || reason === 'ending reached').toBe(true);
    expect(state.savedFiles.size).toBeGreaterThanOrEqual(10);
  });

  it('pro unlocks admin, saves secret-target files, and wins', () => {
    const { state } = runBot('pro');
    expect(state.flags?.adminUnlocked).toBe(true);
    expect([...state.savedFiles].some(f => f.includes('ghost_in_machine'))).toBe(true);
    expect(state.gameWon).toBe(true);
  });

  it('dummy terminates without hanging', () => {
    const { reason, turns } = runBot('dummy');
    expect(turns).toBeLessThan(600);
    expect(reason).not.toBe('unterminated');
  });
});
```

- [ ] **Step 2: Run test to verify it fails / reveals gaps**

Run: `npm test -- app/engine/bot/__tests__/strategy.integration.test.ts`
Expected: Initially may FAIL if the leak/override/save interplay needs tuning (e.g., secret targets not saved before the dossier fills, or admin files not read before saving).

- [ ] **Step 3: Fix strategy to pass (make secret targets win the dossier race)**

If `pro` fails to save `ghost_in_machine.enc` because the 10 slots filled with other evidence first, tighten `shouldSave`/ordering in `app/engine/bot/strategy.ts` so pro **only** saves secret-target files until all are in the dossier, then fills remaining slots:

```typescript
function shouldSave(path: string, level: BotLevel, state: GameState): boolean {
  if (level !== 'pro') return isEvidencePath(path);
  const secretsSaved = [...state.savedFiles].filter(isSecretTarget).length;
  const secretsTotal = secretEndingTargets().length;
  if (secretsSaved < secretsTotal) return isSecretTarget(path); // reserve slots first
  return isSecretTarget(path) || isEvidencePath(path);
}
```

Update the call site to pass `state`, and add `import { secretEndingTargets } from './targets';`. Re-run until all three tests pass. Also confirm `pro` reads gated files (they appear in `getAllAccessibleFiles` only **after** the `override` turn — the loop naturally re-surveys each turn).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/engine/bot/__tests__/strategy.integration.test.ts`
Expected: PASS (all three).

- [ ] **Step 5: Commit**

```bash
git add app/engine/bot/strategy.ts app/engine/bot/__tests__/strategy.integration.test.ts
git commit -m "test(bot): full-run integration; pro reaches secret ending, novice wins, dummy terminates" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: Run summary + anomalies (`report.ts`)

**Files:**
- Create: `app/engine/bot/report.ts`
- Test: `app/engine/bot/__tests__/report.test.ts`

Uses `createEntry` from `app/engine/commands/utils` and `determineEnding` from `app/engine/endings`.

- [ ] **Step 1: Write the failing test**

Create `app/engine/bot/__tests__/report.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { buildRunSummary } from '../report';
import { BotRunLogEntry } from '../types';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';

const cfg = { active: false, level: 'pro' as const, seed: 7, maxTurns: 400, delayMs: 900 };

describe('buildRunSummary', () => {
  it('summarizes turns, saves, outcome, and lists anomalies', () => {
    const log: BotRunLogEntry[] = [
      { turn: 1, command: 'open /a.txt', detectionBefore: 0, detectionAfter: 1, filesReadAfter: 1, savedAfter: 0 },
      { turn: 2, command: 'save a.txt', detectionBefore: 1, detectionAfter: 1, filesReadAfter: 1, savedAfter: 1, anomaly: 'command returned error' },
    ];
    const finalState: GameState = { ...DEFAULT_GAME_STATE, savedFiles: new Set(['/a.txt']), gameWon: true };
    const entries = buildRunSummary(log, cfg, finalState);
    const text = entries.map(e => e.content).join('\n');
    expect(text).toContain('BOT-TEST RUN SUMMARY');
    expect(text).toContain('pro');
    expect(text).toContain('Turns: 2');
    expect(text).toContain('ANOMALIES (1)');
    expect(text).toContain('command returned error');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/engine/bot/__tests__/report.test.ts`
Expected: FAIL — cannot find module `../report`.

- [ ] **Step 3: Implement**

Create `app/engine/bot/report.ts`:

```typescript
import { GameState, TerminalEntry } from '../../types';
import { createEntry } from '../commands/utils';
import { determineEnding } from '../endings';
import { BotRunConfig, BotRunLogEntry } from './types';

export function buildRunSummary(
  log: BotRunLogEntry[],
  config: BotRunConfig,
  finalState: GameState
): TerminalEntry[] {
  const anomalies = log.filter(e => e.anomaly);
  const outcome = finalState.gameWon
    ? `WON — ending: ${determineEnding(finalState.savedFiles)}`
    : finalState.isGameOver
      ? `GAME OVER — ${finalState.gameOverReason || 'unknown'}`
      : 'stopped';

  const lines: TerminalEntry[] = [
    createEntry('system', ''),
    createEntry('system', '═══════════════════════════════════════'),
    createEntry('system', '  BOT-TEST RUN SUMMARY'),
    createEntry('system', '═══════════════════════════════════════'),
    createEntry('system', `  Level: ${config.level}   Seed: ${config.seed}`),
    createEntry('system', `  Turns: ${log.length}`),
    createEntry('system', `  Files read: ${finalState.filesRead.size}   Saved: ${finalState.savedFiles.size}`),
    createEntry('system', `  Final detection: ${finalState.detectionLevel}`),
    createEntry('system', `  Outcome: ${outcome}`),
    createEntry('system', ''),
    createEntry(anomalies.length ? 'warning' : 'system', `  ANOMALIES (${anomalies.length})`),
  ];
  for (const a of anomalies) {
    lines.push(createEntry('warning', `    turn ${a.turn} [${a.command}]: ${a.anomaly}`));
  }
  lines.push(createEntry('system', ''));
  return lines;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/engine/bot/__tests__/report.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/engine/bot/report.ts app/engine/bot/__tests__/report.test.ts
git commit -m "feat(bot): run summary + anomalies report" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 7: `bot-test` / `bot-stop` commands (dev-gated)

**Files:**
- Create: `app/engine/commands/debug.ts`
- Modify: `app/engine/commands/index.ts` (spread `debugCommands` into the registry)
- Test: `app/engine/commands/__tests__/debug.test.ts`

- [ ] **Step 1: Write the failing test**

Create `app/engine/commands/__tests__/debug.test.ts`:

```typescript
import { describe, it, expect, vi, afterEach } from 'vitest';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';

const base = (o: Partial<GameState> = {}): GameState => ({ ...DEFAULT_GAME_STATE, tutorialComplete: true, ...o });

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

describe('bot-test / bot-stop (dev only)', () => {
  it('activates the bot with a level and seed in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { debugCommands } = await import('../debug');
    const res = debugCommands['bot-test'](['pro', '999'], base());
    expect(res.stateChanges.botTest?.active).toBe(true);
    expect(res.stateChanges.botTest?.level).toBe('pro');
    expect(res.stateChanges.botTest?.seed).toBe(999);
  });

  it('bot-stop clears the active run', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { debugCommands } = await import('../debug');
    const res = debugCommands['bot-stop']([], base({ botTest: { active: true, level: 'pro', seed: 1, maxTurns: 400, delayMs: 900 } }));
    expect(res.stateChanges.botTest?.active).toBe(false);
  });

  it('defaults level to novice and derives seed from game seed', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { debugCommands } = await import('../debug');
    const res = debugCommands['bot-test']([], base({ seed: 77 }));
    expect(res.stateChanges.botTest?.level).toBe('novice');
    expect(res.stateChanges.botTest?.seed).toBe(77);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/engine/commands/__tests__/debug.test.ts`
Expected: FAIL — cannot find module `../debug`.

- [ ] **Step 3: Implement the commands**

Create `app/engine/commands/debug.ts`:

```typescript
import { CommandRegistry } from './types';
import { createEntry } from './utils';
import { BotLevel, DEFAULT_BOT_DELAY_MS, DEFAULT_BOT_MAX_TURNS } from '../bot/types';

const LEVELS: BotLevel[] = ['dummy', 'novice', 'pro'];

export const debugCommands: CommandRegistry = {
  'bot-test': (args, state) => {
    const level = (LEVELS.includes(args[0] as BotLevel) ? args[0] : 'novice') as BotLevel;
    const seedArg = args.find(a => /^\d+$/.test(a));
    const seed = seedArg ? parseInt(seedArg, 10) : (typeof state.seed === 'number' ? state.seed : 1);
    return {
      output: [
        createEntry('system', ''),
        createEntry('warning', `  BOT-TEST ENGAGED — level=${level}, seed=${seed}`),
        createEntry('system', '  autoplay starting. type "bot-stop" or press a key to halt.'),
        createEntry('system', ''),
      ],
      stateChanges: {
        botTest: { active: true, level, seed, maxTurns: DEFAULT_BOT_MAX_TURNS, delayMs: DEFAULT_BOT_DELAY_MS },
      },
    };
  },
  'bot-stop': (_args, state) => ({
    output: [createEntry('system', '  BOT-TEST halted.')],
    stateChanges: {
      botTest: state.botTest ? { ...state.botTest, active: false } : undefined,
    },
  }),
};
```

- [ ] **Step 4: Register the commands (dev-gated)**

In `app/engine/commands/index.ts`, add near the other imports:

```typescript
import { debugCommands } from './debug';
```

Then, where the unified `commands` registry is built (the `export const commands: CommandRegistry = { ... }` object), spread the debug commands **only in development** by adding this after the object is defined:

```typescript
if (process.env.NODE_ENV === 'development') {
  Object.assign(commands, debugCommands);
}
```

(Production static-export builds set `NODE_ENV=production`, so `bot-test`/`bot-stop` are never registered and resolve as unknown commands for players.)

- [ ] **Step 5: Run tests to verify pass**

Run: `npm test -- app/engine/commands/__tests__/debug.test.ts && npm run typecheck`
Expected: PASS, clean typecheck.

- [ ] **Step 6: Commit**

```bash
git add app/engine/commands/debug.ts app/engine/commands/index.ts app/engine/commands/__tests__/debug.test.ts
git commit -m "feat(bot): dev-gated bot-test/bot-stop commands" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 8: `handleSubmit` override seam

Allow a programmatic caller to submit an explicit input string (including `''` for Enter-only modes) instead of the closure `inputValue`.

**Files:**
- Modify: `app/hooks/useTerminalInput.ts` (handleSubmit signature ~262; sanitize ~266; `executeCommand` call ~605)
- Modify: `app/components/Terminal.tsx` (wrapping `handleSubmit` ~655)
- Test: `app/hooks/__tests__/handleSubmit-override.test.ts` (pure-ish test via a thin extraction) — see Step 1.

Because `handleSubmit` is deeply tied to React state, the test targets the input-resolution rule directly.

- [ ] **Step 1: Write the failing test**

Create `app/hooks/__tests__/handleSubmit-override.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { resolveSubmitInput } from '../resolveSubmitInput';

describe('resolveSubmitInput', () => {
  it('uses the override when provided, including empty string', () => {
    expect(resolveSubmitInput('typed value', 'open x')).toBe('open x');
    expect(resolveSubmitInput('typed value', '')).toBe(''); // Enter-only mode
  });
  it('falls back to the live input value when override is undefined', () => {
    expect(resolveSubmitInput('typed value', undefined)).toBe('typed value');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/hooks/__tests__/handleSubmit-override.test.ts`
Expected: FAIL — cannot find module `../resolveSubmitInput`.

- [ ] **Step 3: Add the resolver helper and use it in handleSubmit**

Create `app/hooks/resolveSubmitInput.ts`:

```typescript
/** Chooses the submit source: an explicit override (even '') wins over the live input. */
export function resolveSubmitInput(inputValue: string, overrideInput?: string): string {
  return overrideInput ?? inputValue;
}
```

In `app/hooks/useTerminalInput.ts`:
1. Add the import near the top: `import { resolveSubmitInput } from './resolveSubmitInput';`
2. Change the `handleSubmit` signature (line 262) to accept an override:

```typescript
  const handleSubmit = useCallback(
    async (e?: React.SyntheticEvent, overrideInput?: string) => {
```

3. Change the initial sanitize (line ~266) from `sanitizeCommandInput(inputValue, ...)` to:

```typescript
      const sourceInput = resolveSubmitInput(inputValue, overrideInput);
      const sanitizedInput = sanitizeCommandInput(sourceInput, MAX_COMMAND_INPUT_LENGTH);
```

4. Fix the execute call (line 605) to use the parsed command, not the closure `inputValue`:

```typescript
      const result = executeCommand(command, newState);
```

5. Add `overrideInput` to the `useCallback` dependency array is **not** needed (it's a parameter, not a closure value). Leave deps as-is.

- [ ] **Step 4: Thread the param through Terminal's wrapper**

In `app/components/Terminal.tsx`, the wrapping `handleSubmit` (line ~655) must accept and forward the override. Change its signature to:

```typescript
  const handleSubmit = useCallback(
    async (e?: React.SyntheticEvent, overrideInput?: string) => {
```

Inside it, wherever it currently reads `inputValue` for its own pre-checks (video prompt / chat detection), compute once at the top:

```typescript
      const submittedInput = overrideInput ?? inputValue;
```

and use `submittedInput` in those branches. Finally, forward to the base handler:

```typescript
      return baseHandleSubmit(e, overrideInput);
```

- [ ] **Step 5: Run test + typecheck + existing terminal tests**

Run: `npm test -- app/hooks/__tests__/handleSubmit-override.test.ts && npm run typecheck && npm test -- app/hooks app/components/__tests__`
Expected: PASS (human submit path unchanged; override resolves correctly).

- [ ] **Step 6: Commit**

```bash
git add app/hooks/resolveSubmitInput.ts app/hooks/useTerminalInput.ts app/components/Terminal.tsx app/hooks/__tests__/handleSubmit-override.test.ts
git commit -m "feat(bot): overrideInput seam for programmatic command submission" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 9: `useBotRunner` hook + wire into Terminal (dev-gated)

The React adapter: when `state.botTest?.active`, feed decisions into `handleSubmit` on an idle-gated timer, log turns, and print the summary on stop.

**Files:**
- Create: `app/hooks/useBotRunner.ts`
- Modify: `app/components/Terminal.tsx` (call the hook, dev-gated; add a keystroke halt)
- Test: `app/hooks/__tests__/useBotRunner.logic.test.ts` (pure helpers extracted from the hook)

To keep logic testable, extract the pure "should we act, and what anomaly did this turn produce" helpers into the hook module and test those.

- [ ] **Step 1: Write the failing test**

Create `app/hooks/__tests__/useBotRunner.logic.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { isTerminalIdle, detectAnomaly } from '../useBotRunner';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

const s = (o: Partial<GameState> = {}): GameState => ({ ...DEFAULT_GAME_STATE, ...o });

describe('useBotRunner logic', () => {
  it('is not idle while processing or while media/turing gates are open', () => {
    expect(isTerminalIdle({ isProcessing: true, showTuringTest: false, hasPendingMedia: false })).toBe(false);
    expect(isTerminalIdle({ isProcessing: false, showTuringTest: true, hasPendingMedia: false })).toBe(false);
    expect(isTerminalIdle({ isProcessing: false, showTuringTest: false, hasPendingMedia: true })).toBe(false);
    expect(isTerminalIdle({ isProcessing: false, showTuringTest: false, hasPendingMedia: false })).toBe(true);
  });

  it('flags a turing-test trigger as a stopping anomaly', () => {
    expect(detectAnomaly('override protocol COLHEITA', s({ showTuringTest: true } as Partial<GameState>), true)).toContain('turing');
  });

  it('flags an error-typed command result as an anomaly', () => {
    expect(detectAnomaly('open nope', s(), false, true)).toContain('error');
  });

  it('returns null when nothing went wrong', () => {
    expect(detectAnomaly('open a.txt', s(), false, false)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/hooks/__tests__/useBotRunner.logic.test.ts`
Expected: FAIL — cannot find module `../useBotRunner`.

- [ ] **Step 3: Implement the hook + exported pure helpers**

Create `app/hooks/useBotRunner.ts`:

```typescript
import { useEffect, useRef } from 'react';
import { GameState } from '../types';
import { decideNextCommand } from '../engine/bot/strategy';
import { buildRunSummary } from '../engine/bot/report';
import { createBotMemory, BotMemory, BotRunLogEntry } from '../engine/bot/types';

export function isTerminalIdle(g: {
  isProcessing: boolean;
  showTuringTest: boolean;
  hasPendingMedia: boolean;
}): boolean {
  return !g.isProcessing && !g.showTuringTest && !g.hasPendingMedia;
}

/** Returns an anomaly string for this turn, or null. */
export function detectAnomaly(
  command: string,
  stateAfter: GameState,
  turingActive: boolean,
  resultWasError = false
): string | null {
  if (turingActive || stateAfter.showTuringTest) return 'turing test triggered — detection too high';
  if (resultWasError) return `command returned error: ${command}`;
  return null;
}

interface BotRunnerArgs {
  gameState: GameState;
  isProcessing: boolean;
  showTuringTest: boolean;
  hasPendingMedia: boolean;
  submit: (overrideInput: string) => void;
  appendOutput: (entries: ReturnType<typeof buildRunSummary>) => void;
  clearBot: () => void;
}

export function useBotRunner(args: BotRunnerArgs): void {
  const { gameState, isProcessing, showTuringTest, hasPendingMedia, submit, appendOutput, clearBot } = args;
  const memoryRef = useRef<BotMemory>(createBotMemory());
  const logRef = useRef<BotRunLogEntry[]>([]);
  const inFlightRef = useRef(false);
  const activeRef = useRef(false);

  useEffect(() => {
    const cfg = gameState.botTest;
    if (!cfg?.active) {
      // Reset memory when a run ends.
      if (activeRef.current) { activeRef.current = false; memoryRef.current = createBotMemory(); logRef.current = []; }
      return;
    }
    // New run: reset memory once.
    if (!activeRef.current) { activeRef.current = true; memoryRef.current = createBotMemory(); logRef.current = []; }

    if (!isTerminalIdle({ isProcessing, showTuringTest, hasPendingMedia })) return;
    if (inFlightRef.current) return;

    // Turing overlay = stop with anomaly.
    if (showTuringTest) {
      logRef.current.push({ turn: memoryRef.current.turnsTaken, command: '(turing)', detectionBefore: gameState.detectionLevel, detectionAfter: gameState.detectionLevel, filesReadAfter: gameState.filesRead.size, savedAfter: gameState.savedFiles.size, anomaly: 'turing test triggered — detection too high' });
      appendOutput(buildRunSummary(logRef.current, cfg, gameState));
      clearBot();
      return;
    }

    inFlightRef.current = true;
    const timer = setTimeout(() => {
      const detBefore = gameState.detectionLevel;
      const { decision, memory } = decideNextCommand(gameState, memoryRef.current, cfg.level, cfg.seed);
      memoryRef.current = memory;

      if (decision.kind === 'done') {
        appendOutput(buildRunSummary(logRef.current, cfg, gameState));
        clearBot();
        inFlightRef.current = false;
        return;
      }
      const input = decision.kind === 'enter' ? '' : decision.text;
      logRef.current.push({
        turn: memory.turnsTaken,
        command: input || '(enter)',
        detectionBefore: detBefore,
        detectionAfter: gameState.detectionLevel,
        filesReadAfter: gameState.filesRead.size,
        savedAfter: gameState.savedFiles.size,
      });
      submit(input);
      inFlightRef.current = false;
    }, cfg.delayMs);

    return () => { clearTimeout(timer); inFlightRef.current = false; };
    // Re-run when the command count or gating flags change.
  }, [gameState, isProcessing, showTuringTest, hasPendingMedia, submit, appendOutput, clearBot]);
}
```

- [ ] **Step 4: Wire it into Terminal (dev-gated)**

In `app/components/Terminal.tsx`, near the other hook calls (after `handleSubmit` is defined), add:

```typescript
  useBotRunner({
    gameState,
    isProcessing,
    showTuringTest,
    hasPendingMedia: Boolean(pendingImage) || pendingUfo74StartMessages.length > 0 || Boolean(activeEvidenceVideo) || Boolean(pendingEvidenceVideoPrompt),
    submit: (input: string) => { void handleSubmit(undefined, input); },
    appendOutput: (entries) => setGameState(prev => ({ ...prev, history: [...prev.history, ...entries] })),
    clearBot: () => setGameState(prev => ({ ...prev, botTest: prev.botTest ? { ...prev.botTest, active: false } : undefined })),
  });
```

Add the import: `import { useBotRunner } from '../hooks/useBotRunner';`. Guard the whole call so it is inert in production — wrap with a module-level constant:

```typescript
const BOT_ENABLED = process.env.NODE_ENV === 'development';
```

and call `useBotRunner({...})` only when `BOT_ENABLED` (a hook must run unconditionally, so instead pass an always-inactive config in production: gate inside the hook by making `submit` a no-op — simplest: keep the call unconditional but rely on `gameState.botTest` being `undefined` in production because the `bot-test` command isn't registered there). **Chosen approach:** call the hook unconditionally; since `bot-test` cannot set `botTest` in production, the hook stays idle. No conditional hook call.

Also add a keystroke halt: in the existing `handleKeyDown`/input `onChange` path, if `gameState.botTest?.active` and the user types, call `clearBot()`. Add to the input's `onKeyDown` handler in `Terminal.tsx`:

```typescript
    if (gameState.botTest?.active) {
      setGameState(prev => ({ ...prev, botTest: prev.botTest ? { ...prev.botTest, active: false } : undefined }));
    }
```

- [ ] **Step 5: Run tests + typecheck + build**

Run: `npm test -- app/hooks/__tests__/useBotRunner.logic.test.ts && npm run typecheck`
Expected: PASS, clean typecheck.

- [ ] **Step 6: Commit**

```bash
git add app/hooks/useBotRunner.ts app/components/Terminal.tsx app/hooks/__tests__/useBotRunner.logic.test.ts
git commit -m "feat(bot): useBotRunner autoplay loop wired into Terminal (dev-gated)" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 10: Full validation + manual watch

**Files:** none (validation only)

- [ ] **Step 1: Typecheck**

Run: `npm run typecheck`
Expected: clean.

- [ ] **Step 2: Full test suite**

Run: `npm test`
Expected: PASS — all prior tests plus the new bot tests. No regressions.

- [ ] **Step 3: Story validation + endings doc guard**

Run: `npm run validate-story`
Expected: PASS.

Run: `npx tsx scripts/gen-endings-doc.ts && git diff --stat game_story_files/endings.MD`
Expected: NO diff (this feature changes no story content). Then `git checkout game_story_files/endings.MD`.

- [ ] **Step 4: Production build excludes the bot**

Run: `npm run build`
Expected: build succeeds. Confirm the harness is dev-only by grepping the export bundle for the intro banner string:

Run: `grep -r "BOT-TEST ENGAGED" out/ || echo "ABSENT FROM PRODUCTION BUILD (expected)"`
Expected: prints `ABSENT FROM PRODUCTION BUILD (expected)`.

- [ ] **Step 5: Manual watch (developer)**

Run: `npm run dev`, complete/skip the tutorial, then type `bot-test pro 12345`. Watch it autoplay to the secret ending; confirm the run summary prints. Try `bot-test dummy` and `bot-test novice`. Confirm typing any key halts the bot.

- [ ] **Step 6: Final commit (if any fixups)**

```bash
git add -A
git commit -m "test(bot): full validation for bot-test harness" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>" || echo "nothing to commit"
```

---

## Self-review notes

- **Spec coverage:** activation post-tutorial (Task 7 command; `bot-test` unknown pre-registration and only meaningful once `tutorialComplete`), three levels (Task 4 policy + Task 5 integration), real-pipeline play (Task 8 seam + Task 9 hook), pure VFS-driven strategy (Task 4/5), secret-ending targeting incl. non-evidence file (Task 3/5), password source-of-truth (Task 2), idle gating + enter-mode + turing stop (Task 9), reporting + anomalies (Task 6), dev-gating (Task 7/9/10), reproducible seed (Task 4/7). All covered.
- **Type consistency:** `decideNextCommand(state, memory, level, seed)` returns `{ decision, memory }` everywhere; `BotDecision` kinds `command`/`enter`/`done` used consistently; `BotRunConfig` fields (`active/level/seed/maxTurns/delayMs`) match across command, hook, report.
- **Known follow-ups (out of scope):** teaching the runner to answer the Turing overlay instead of stopping; a headless CI assertion mode.
