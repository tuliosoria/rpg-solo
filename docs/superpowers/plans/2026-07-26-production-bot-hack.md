# Production Bot Autoplay (Hidden Kill-Switch) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose the existing `bot-test`/`bot-stop` autoplay commands on production behind a single `BOT_ENABLED` kill-switch constant, without surfacing them to ordinary players.

**Architecture:** The autoplay harness already runs unconditionally in production (only command registration is dev-gated, and command discovery is allowlist-based via `PUBLIC_COMMANDS`). This plan adds one constant and changes one gate line so registration also happens when the flag is on, plus regression tests proving the commands register when enabled and stay out of the public allowlist.

**Tech Stack:** TypeScript, Next.js static export, Vitest.

Spec: `docs/superpowers/specs/2026-07-26-production-bot-hack-design.md`

---

### Task 1: Add the `BOT_ENABLED` kill-switch constant

**Files:**
- Create: `app/constants/bot.ts`
- Test: `app/constants/__tests__/bot.test.ts`

- [ ] **Step 1: Write the failing test**

Create `app/constants/__tests__/bot.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { BOT_ENABLED } from '../bot';

describe('BOT_ENABLED kill-switch', () => {
  it('is a boolean flag', () => {
    expect(typeof BOT_ENABLED).toBe('boolean');
  });

  it('is currently enabled (production hack active)', () => {
    expect(BOT_ENABLED).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/constants/__tests__/bot.test.ts`
Expected: FAIL — cannot resolve module `../bot`.

- [ ] **Step 3: Create the constant**

Create `app/constants/bot.ts`:

```typescript
/**
 * Kill-switch for the production autoplay hack.
 *
 * The `bot-test` / `bot-stop` commands let a developer watch the game play
 * itself turn-by-turn (see docs/superpowers/specs/2026-07-26-production-bot-hack-design.md).
 * They are intentionally NOT in `PUBLIC_COMMANDS`, so they never appear in
 * `help`, Tab completion, or typo suggestions — a player can only reach them by
 * typing the exact command string.
 *
 * TO DISABLE: set this to `false` and redeploy `main`. The commands vanish from
 * production; development keeps them via the NODE_ENV clause in
 * `app/engine/commands/index.ts`.
 */
export const BOT_ENABLED = true;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/constants/__tests__/bot.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add app/constants/bot.ts app/constants/__tests__/bot.test.ts
git commit -m "feat(bot): add BOT_ENABLED kill-switch constant for production autoplay

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Register the bot commands when the flag is on

**Files:**
- Modify: `app/engine/commands/index.ts:71-75`
- Test: `app/engine/__tests__/bot-registration.test.ts`

- [ ] **Step 1: Write the failing test**

Create `app/engine/__tests__/bot-registration.test.ts`. In the Vitest run `NODE_ENV` is `test` (not `development`), so a registered `bot-test` proves the `BOT_ENABLED` clause — not the dev clause — did the work:

```typescript
import { describe, it, expect } from 'vitest';
import { commands } from '../commands';
import { BOT_ENABLED } from '../../constants/bot';

describe('bot command registration', () => {
  it('registers bot-test and bot-stop when BOT_ENABLED is on', () => {
    // Guard: this test asserts the enabled-path behavior.
    expect(BOT_ENABLED).toBe(true);
    expect(typeof commands['bot-test']).toBe('function');
    expect(typeof commands['bot-stop']).toBe('function');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/engine/__tests__/bot-registration.test.ts`
Expected: FAIL — `commands['bot-test']` is `undefined` (current gate only registers under `NODE_ENV==='development'`, and the test env is `test`).

- [ ] **Step 3: Change the gate**

In `app/engine/commands/index.ts`, add the import near the other imports (after line 12):

```typescript
import { BOT_ENABLED } from '../../constants/bot';
```

Replace the gate block (currently lines 71-75):

```typescript
// Dev-only autoplay harness commands. Production static-export builds run with
// NODE_ENV=production, so bot-test/bot-stop are never registered for players.
if (process.env.NODE_ENV === 'development') {
  Object.assign(commands, debugCommands);
}
```

with:

```typescript
// Autoplay harness commands (bot-test / bot-stop). Registered in development
// always, and in production while the BOT_ENABLED kill-switch is on. They are
// deliberately absent from PUBLIC_COMMANDS, so they never surface in help, Tab
// completion, or typo suggestions. Set BOT_ENABLED to false to remove them.
if (BOT_ENABLED || process.env.NODE_ENV === 'development') {
  Object.assign(commands, debugCommands);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/engine/__tests__/bot-registration.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/engine/commands/index.ts app/engine/__tests__/bot-registration.test.ts
git commit -m "feat(bot): register bot-test/bot-stop in production behind BOT_ENABLED

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Regression guard — bot commands stay hidden from players

**Files:**
- Test: `app/engine/commands/__tests__/bot-hidden.test.ts`

- [ ] **Step 1: Write the failing test**

Create `app/engine/commands/__tests__/bot-hidden.test.ts`. This locks in the invariant that makes the production exposure safe: the bot commands must never enter the public allowlist that drives `help`, Tab completion, and "did you mean" suggestions.

```typescript
import { describe, it, expect } from 'vitest';
import { PUBLIC_COMMANDS } from '../utils';

describe('bot commands stay hidden from discovery', () => {
  it('bot-test and bot-stop are not in PUBLIC_COMMANDS', () => {
    expect(PUBLIC_COMMANDS).not.toContain('bot-test');
    expect(PUBLIC_COMMANDS).not.toContain('bot-stop');
  });
});
```

- [ ] **Step 2: Run test to verify it passes immediately (invariant already holds)**

Run: `npm test -- app/engine/commands/__tests__/bot-hidden.test.ts`
Expected: PASS. (This is a guard test — it protects an existing invariant, so it passes on first run. If it ever fails, someone added the bot to the public allowlist and re-exposed the hack.)

- [ ] **Step 3: Commit**

```bash
git add app/engine/commands/__tests__/bot-hidden.test.ts
git commit -m "test(bot): guard that bot-test/bot-stop stay out of PUBLIC_COMMANDS

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 2: Lint the changed files**

Run: `npx eslint app/constants/bot.ts app/constants/__tests__/bot.test.ts app/engine/commands/index.ts app/engine/__tests__/bot-registration.test.ts app/engine/commands/__tests__/bot-hidden.test.ts`
Expected: clean.

- [ ] **Step 3: Full test suite**

Run: `npm test`
Expected: all pass (existing `debug-commands.test.ts` still green; new tests green).

- [ ] **Step 4: Production build + confirm the hack is now present by design**

Run: `npm run build && (grep -rl "BOT-TEST ENGAGED" out/ >/dev/null && echo "PRESENT (expected)" || echo "ABSENT (unexpected)")`
Expected: build succeeds; prints `PRESENT (expected)` — the bot banner string is now in the production bundle, confirming the command will work on the deployed site.

- [ ] **Step 5: Commit any incidental fixups (only if steps 1-3 required changes)**

```bash
git add -A
git commit -m "chore(bot): verification fixups for production autoplay

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Self-Review

**Spec coverage:**
- Kill-switch constant (`BOT_ENABLED`) → Task 1. ✅
- Gate change `BOT_ENABLED || NODE_ENV==='development'` → Task 2. ✅
- Keep names / all levels / no `PUBLIC_COMMANDS` entry → Task 2 (no rename), Task 3 (guard). ✅
- Testing: flag registers commands (Task 2), hidden-from-discovery guard (Task 3), full suite + build (Task 4). ✅
- Disable procedure documented in the constant's doc comment (Task 1) and spec. ✅

**Placeholder scan:** none — every step has concrete code/commands.

**Type consistency:** `BOT_ENABLED` (boolean) defined in Task 1, imported identically in Task 2; registry export `commands` and `PUBLIC_COMMANDS` names match the codebase.

**Deploy note:** Tasks 1-4 land on `main`; the Task 2 gate change is a runtime change that WILL deploy to production (Amplify/Azure/desktop) on push — which is the intended outcome. The spec docs are paths-ignored for deploy.
