# Streber ↔ UFO74 Breadcrumb Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing `streber` Easter eggs into an intentional breadcrumb that reveals UFO74's civilian handle, unlocks a secret achievement, and improves discoverability of the gated `ghost_in_machine.enc` — all additive and behavior-preserving for endings.

**Architecture:** Reuse the existing per-file UFO74 reaction map (`EVIDENCE_UFO74_REACTIONS`) for the two reactions, add a `streberSigFound` flag and a `ghost_handle` secret achievement in the file-read handler, add one post-admin-unlock hint in the hint system, and append a subtle 2-line breadcrumb to the `.signature.bak` content. No ending-rule or `FILE_CATEGORIES` changes.

**Tech Stack:** Next.js/TypeScript, Vitest. i18n via runtime exact-match tables (`runtimeCommandSupplement.ts`, `runtimeVfsTranslations.ts`) and locale JSON keys (`app/locales/*.json`).

**Spec:** `docs/superpowers/specs/2026-07-26-streber-ufo74-breadcrumb-design.md`

**Dropped from spec (verified redundant):** The `decrypt`→`open` nudge. `decrypt` is already retired and redirects to `open /internal/ghost_in_machine.enc` (`app/engine/__tests__/narrative-mechanics.test.ts:121-148`). Adding a "you cracked it" line would be factually wrong (nothing is decrypted anymore) and duplicate existing guidance.

**Test command:** `npm test -- <path>` runs a single file; `npm test` runs the full suite.

**Approved copy (EN):**
- `.signature.bak` reaction: `streber. that was me. a long time ago. before the call sign. before all of this.`
- `modem_log_jan96.txt` reaction: `that bbs. i practically lived there. cruzeiro lost that game. i remember.`
- `.signature.bak` breadcrumb lines (appended): `Someday I will need a new handle. Something they` / `will not think to look for. Something that flies.`
- Post-admin hint: `UFO74: you have the run of the place now. there is a file i sealed myself.` / `       /internal/ghost_in_machine.enc. open it. you earned it.`
- Achievement **Ghost Handle** 💾 (secret): `Trace UFO74 back to a BBS signature from 1996`

---

## File structure

| File | Responsibility | Change |
|---|---|---|
| `app/engine/achievements.ts` | Achievement registry | Add `ghost_handle` secret achievement |
| `app/locales/{en,pt-br,es}.json` | Static i18n keys | Add `engine.achievements.ghost_handle.*` + `engine.hints.ghostMachine.*` |
| `app/engine/commands/filesystem.ts` | File-read handler | Set `streberSigFound` flag; push `ghost_handle` when both streber files read |
| `app/engine/commands/helpers.ts` | UFO74 reaction map | Update `.signature.bak` + `modem_log_jan96.txt` reaction wording |
| `app/i18n/runtimeCommandSupplement.ts` | Runtime exact-match translations | Update pt-BR + es for the two reactions |
| `app/data/virtualFileSystem.ts` | `ascii_signature_bak` content | Append 2 breadcrumb lines |
| `app/i18n/runtimeVfsTranslations.ts` | Sig content line translations | Add 2 pt-BR + 2 es lines (keep `registerLines` count balanced) |
| `app/engine/hintSystem.ts` | Contextual UFO74 hints | Add post-admin-unlock hint pointing to the identity file |

---

### Task 1: Add the `ghost_handle` secret achievement

**Files:**
- Modify: `app/engine/achievements.ts` (add to `ACHIEVEMENTS` array, after the `revelator` block ~line 200)
- Modify: `app/locales/en.json`, `app/locales/pt-br.json`, `app/locales/es.json`
- Test: `app/engine/__tests__/achievements.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `app/engine/__tests__/achievements.test.ts` (inside the top-level `describe`):

```typescript
import { ACHIEVEMENTS, getAchievement } from '../achievements';

describe('Ghost Handle achievement', () => {
  it('is registered as a secret achievement', () => {
    const a = getAchievement('ghost_handle');
    expect(a).toBeDefined();
    expect(a!.secret).toBe(true);
    expect(a!.name.length).toBeGreaterThan(0);
    expect(a!.description.length).toBeGreaterThan(0);
  });

  it('is included in the ACHIEVEMENTS registry exactly once', () => {
    expect(ACHIEVEMENTS.filter(a => a.id === 'ghost_handle')).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/engine/__tests__/achievements.test.ts`
Expected: FAIL — `getAchievement('ghost_handle')` returns `undefined`.

- [ ] **Step 3: Add the achievement**

In `app/engine/achievements.ts`, inside the `ACHIEVEMENTS` array, immediately after the `revelator` `createAchievement(...)` block (before the `...DOSSIER_ENDING_ACHIEVEMENTS.map(...)` spread at ~line 201):

```typescript
  createAchievement(
    'ghost_handle',
    'ghost_handle',
    'Ghost Handle',
    'Trace UFO74 back to a BBS signature from 1996',
    '💾',
    true
  ),
```

- [ ] **Step 4: Add locale keys**

In `app/locales/en.json`, after the `engine.achievements.doom_fan.description` line (~1323):

```json
  "engine.achievements.ghost_handle.name": "Ghost Handle",
  "engine.achievements.ghost_handle.description": "Trace UFO74 back to a BBS signature from 1996",
```

In `app/locales/pt-br.json`, same location:

```json
  "engine.achievements.ghost_handle.name": "Codinome Fantasma",
  "engine.achievements.ghost_handle.description": "Rastreie o UFO74 até uma assinatura de BBS de 1996",
```

In `app/locales/es.json`, same location:

```json
  "engine.achievements.ghost_handle.name": "Alias Fantasma",
  "engine.achievements.ghost_handle.description": "Rastrea a UFO74 hasta una firma de BBS de 1996",
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- app/engine/__tests__/achievements.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/engine/achievements.ts app/locales/en.json app/locales/pt-br.json app/locales/es.json app/engine/__tests__/achievements.test.ts
git commit -m "feat(achievements): add secret Ghost Handle achievement" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Set `streberSigFound` flag + unlock `ghost_handle` on reading both streber files

**Files:**
- Modify: `app/engine/commands/filesystem.ts` (special-file triggers ~713-719; achievements section ~838-862)
- Test: `app/engine/__tests__/narrative-mechanics.test.ts`

Notes: `state.flags` is `Record<string, boolean>` (`app/types/index.ts:138`), so `streberSigFound` needs no type change. `filesRead` already includes the current file (added at `filesystem.ts:571-572`). `checkAchievements` IDs are unlocked by the caller (`app/hooks/useTerminalInput.ts:846-849`). The two files live at `/tmp/.signature.bak` and `/tmp/modem_log_jan96.txt`.

- [ ] **Step 1: Write the failing tests**

Add to `app/engine/__tests__/narrative-mechanics.test.ts` (new `describe` inside the top-level block):

```typescript
describe('Streber breadcrumb', () => {
  it('sets streberSigFound when reading .signature.bak', () => {
    const state = createTestState({ currentPath: '/tmp' });
    const result = executeCommand('open .signature.bak', state);
    expect(result.stateChanges.flags?.streberSigFound).toBe(true);
  });

  it('unlocks ghost_handle only after both streber files are read', () => {
    const first = createTestState({ currentPath: '/tmp' });
    const afterSig = executeCommand('open .signature.bak', first);

    // Reading the sig alone must not grant the achievement.
    expect(afterSig.checkAchievements ?? []).not.toContain('ghost_handle');

    // Carry filesRead forward, then read the modem log.
    const second = createTestState({
      currentPath: '/tmp',
      filesRead: afterSig.stateChanges.filesRead,
      flags: { ...(afterSig.stateChanges.flags ?? {}) },
    });
    const afterModem = executeCommand('open modem_log_jan96.txt', second);
    expect(afterModem.checkAchievements ?? []).toContain('ghost_handle');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- app/engine/__tests__/narrative-mechanics.test.ts`
Expected: FAIL — `streberSigFound` undefined and `ghost_handle` not in `checkAchievements`.

- [ ] **Step 3: Set the `streberSigFound` flag**

In `app/engine/commands/filesystem.ts`, in the special-file triggers block, immediately after the `ghost_in_machine` trigger (the block at lines 713-715 that sets `ufo74SecretDiscovered`), add:

```typescript
    if (fileName === '.signature.bak' && !state.flags.streberSigFound) {
      stateChanges.flags = { ...state.flags, ...stateChanges.flags, streberSigFound: true };
    }
```

- [ ] **Step 4: Push the `ghost_handle` achievement when both files are read**

In `app/engine/commands/filesystem.ts`, in the achievements section, immediately after the `archivist` push block closes (after the `if (filesInParent.length >= 3) { ... }` block ends at ~line 862), add:

```typescript
    // Ghost Handle: reading both streber Easter-egg files reveals UFO74's civilian handle.
    if (
      (fileName === '.signature.bak' || fileName === 'modem_log_jan96.txt') &&
      filesRead.has('/tmp/.signature.bak') &&
      filesRead.has('/tmp/modem_log_jan96.txt')
    ) {
      achievementsToCheck.push('ghost_handle');
    }
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- app/engine/__tests__/narrative-mechanics.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/engine/commands/filesystem.ts app/engine/__tests__/narrative-mechanics.test.ts
git commit -m "feat(game): streberSigFound flag + Ghost Handle unlock on reading both streber files" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Update the two UFO74 reaction lines

**Files:**
- Modify: `app/engine/commands/helpers.ts:236-239` (`EVIDENCE_UFO74_REACTIONS`)
- Modify: `app/i18n/runtimeCommandSupplement.ts` (pt-BR ~717-720, es ~1886-1889)
- Test: `app/engine/__tests__/narrative-mechanics.test.ts`

- [ ] **Step 1: Write the failing test**

Add inside the `describe('Streber breadcrumb', ...)` block:

```typescript
  it('shows the refreshed UFO74 reactions on read', () => {
    const sig = executeCommand('open .signature.bak', createTestState({ currentPath: '/tmp' }));
    expect(sig.output.some(e => e.content.includes('streber. that was me.'))).toBe(true);

    const modem = executeCommand('open modem_log_jan96.txt', createTestState({ currentPath: '/tmp' }));
    expect(modem.output.some(e => e.content.includes('i practically lived there.'))).toBe(true);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/engine/__tests__/narrative-mechanics.test.ts`
Expected: FAIL — output still contains the old wording.

- [ ] **Step 3: Update the reaction map**

In `app/engine/commands/helpers.ts`, replace lines 236-239:

```typescript
  'modem_log_jan96.txt':
    'that bbs. i practically lived there. cruzeiro lost that game. i remember.',
  '.signature.bak':
    'streber. that was me. a long time ago. before the call sign. before all of this.',
```

- [ ] **Step 4: Update the pt-BR translations**

In `app/i18n/runtimeCommandSupplement.ts`, replace the pt-BR entries (~717-720):

```typescript
    '28.8 modem. geocities. someone was uploading before they got caught.':
      'modem 28.8. geocities. alguém tava subindo coisa antes de ser pego.',
    'that bbs. i practically lived there. cruzeiro lost that game. i remember.':
      'aquele bbs. eu praticamente morava lá. o cruzeiro perdeu aquele jogo. eu lembro.',
    'streber. that was me. a long time ago. before the call sign. before all of this.':
      'streber. era eu. muito tempo atrás. antes do codinome. antes de tudo isso.',
```

(Note: the old key `'28.8 modem. geocities...'` is unchanged; the two streber keys below it are replaced. Remove the stale `'that sig file. i know whose terminal that was.'` key.)

- [ ] **Step 5: Update the es translations**

In `app/i18n/runtimeCommandSupplement.ts`, replace the es entries (~1886-1889):

```typescript
    '28.8 modem. geocities. someone was uploading before they got caught.':
      'módem 28.8. geocities. alguien estaba subiendo cosas antes de que lo pillaran.',
    'that bbs. i practically lived there. cruzeiro lost that game. i remember.':
      'ese bbs. prácticamente vivía ahí. el cruzeiro perdió ese partido. me acuerdo.',
    'streber. that was me. a long time ago. before the call sign. before all of this.':
      'streber. ese era yo. hace mucho tiempo. antes del nombre en clave. antes de todo esto.',
```

(Remove the stale `'that sig file. i know whose terminal that was.'` es key.)

- [ ] **Step 6: Run test + i18n coverage suite**

Run: `npm test -- app/engine/__tests__/narrative-mechanics.test.ts`
Expected: PASS.

Then run the runtime-translation coverage test to confirm no orphaned/missing keys:

Run: `npm test -- app/i18n`
Expected: PASS (no missing-translation failures for the changed strings).

- [ ] **Step 7: Commit**

```bash
git add app/engine/commands/helpers.ts app/i18n/runtimeCommandSupplement.ts app/engine/__tests__/narrative-mechanics.test.ts
git commit -m "feat(game): refresh streber UFO74 reactions with civilian-handle reveal" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Append the subtle breadcrumb lines to `.signature.bak`

**Files:**
- Modify: `app/data/virtualFileSystem.ts:2950` (`ascii_signature_bak.content`)
- Modify: `app/i18n/runtimeVfsTranslations.ts:3363-3400` (`registerLines(vfs.ascii_signature_bak.content, ...)`)
- Test: `app/engine/__tests__/narrative-mechanics.test.ts`

Notes: `registerLines` throws if the count of translatable English lines ≠ pt block lines ≠ es block lines. Adding 2 translatable English lines requires adding exactly 2 lines to each translation block, positioned last (matching order).

- [ ] **Step 1: Write the failing test**

Add inside the `describe('Streber breadcrumb', ...)` block:

```typescript
  it('.signature.bak content carries the subtle UFO nod', () => {
    const sig = executeCommand('open .signature.bak', createTestState({ currentPath: '/tmp' }));
    const text = sig.output.map(e => e.content).join('\n');
    expect(text).toContain('Something that flies.');
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/engine/__tests__/narrative-mechanics.test.ts`
Expected: FAIL — content does not yet contain the new line.

- [ ] **Step 3: Append the breadcrumb lines to the content**

In `app/data/virtualFileSystem.ts`, in `ascii_signature_bak.content`, replace the final line (`'  The future arrived. It was not what we expected.',`) with:

```typescript
    '  The future arrived. It was not what we expected.',
    '',
    '  Someday I will need a new handle. Something they',
    '  will not think to look for. Something that flies.',
```

- [ ] **Step 4: Add matching pt-BR + es translation lines**

In `app/i18n/runtimeVfsTranslations.ts`, in the `registerLines(vfs.ascii_signature_bak.content, ...)` call, append to the pt-BR block (after `O futuro chegou. Não era o que esperávamos.`, line ~3381):

```
    Um dia vou precisar de um novo apelido. Algo que
    eles não vão pensar em procurar. Algo que voa.
```

Append to the es block (after `El futuro llegó. No era lo que esperábamos.`, line ~3399):

```
    Algún día necesitaré un nuevo apodo. Algo que
    no se les ocurrirá buscar. Algo que vuela.
```

- [ ] **Step 5: Run test + i18n suite to verify pass (and no line-count throw)**

Run: `npm test -- app/engine/__tests__/narrative-mechanics.test.ts`
Expected: PASS.

Run: `npm test -- app/i18n`
Expected: PASS — no `Translation line count mismatch` error thrown at import time.

- [ ] **Step 6: Commit**

```bash
git add app/data/virtualFileSystem.ts app/i18n/runtimeVfsTranslations.ts app/engine/__tests__/narrative-mechanics.test.ts
git commit -m "feat(game): add subtle UFO nod breadcrumb to streber .signature.bak" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Add the post-admin-unlock hint pointing to the identity file

**Files:**
- Modify: `app/engine/hintSystem.ts` (insert new priority after the morse block, ~line 110)
- Modify: `app/locales/{en,pt-br,es}.json`
- Test: `app/engine/__tests__/` — create `hintSystem.test.ts` if none exists; otherwise add to the existing hint test.

Notes: `analyzeProgressForHint` computes `adminUnlocked = state.flags?.adminUnlocked === true || state.accessLevel >= 3` (`hintSystem.ts:55`). Reading the identity file sets `ufo74SecretDiscovered = true`, so gate the hint on `!state.ufo74SecretDiscovered`. Place it AFTER Priority 1 (leak ready) and Priority 2 (critical detection) so survival/leak messaging still wins, but before generic exploration hints.

- [ ] **Step 1: Write the failing test**

Create `app/engine/__tests__/hintSystem.test.ts` (or append if it exists):

```typescript
import { describe, it, expect } from 'vitest';
import { analyzeProgressForHint } from '../hintSystem';
import { DEFAULT_GAME_STATE, GameState } from '../../types';

const base = (overrides: Partial<GameState> = {}): GameState => ({
  ...DEFAULT_GAME_STATE,
  tutorialComplete: true,
  ...overrides,
});

describe('post-admin ghost_in_machine hint', () => {
  it('points to the sealed identity file once admin is unlocked and it is unread', () => {
    const state = base({
      flags: { adminUnlocked: true },
      filesRead: new Set(['/internal/redaction_keycard.txt']),
      ufo74SecretDiscovered: false,
    });
    const hint = analyzeProgressForHint(state);
    expect(hint).not.toBeNull();
    const text = `${hint!.primary.fallback} ${hint!.followUp?.fallback ?? ''}`;
    expect(text).toContain('/internal/ghost_in_machine.enc');
  });

  it('does not fire once the identity file has been read', () => {
    const state = base({
      flags: { adminUnlocked: true },
      filesRead: new Set(['/internal/ghost_in_machine.enc']),
      ufo74SecretDiscovered: true,
    });
    const hint = analyzeProgressForHint(state);
    const text = hint ? `${hint.primary.fallback} ${hint.followUp?.fallback ?? ''}` : '';
    expect(text).not.toContain('/internal/ghost_in_machine.enc');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/engine/__tests__/hintSystem.test.ts`
Expected: FAIL — no hint references the identity file.

- [ ] **Step 3: Add the hint**

In `app/engine/hintSystem.ts`, immediately after the Priority 3 morse block closes (after line 110, before the `// ─── Priority 4` comment), insert:

```typescript
  // ─── Admin unlocked but the sealed identity file is still unread ───
  if (adminUnlocked && !state.ufo74SecretDiscovered) {
    return {
      primary: {
        key: 'engine.hints.ghostMachine.sealed',
        fallback: 'UFO74: you have the run of the place now. there is a file i sealed myself.',
      },
      followUp: {
        key: 'engine.hints.ghostMachine.open',
        fallback: '       /internal/ghost_in_machine.enc. open it. you earned it.',
      },
    };
  }
```

- [ ] **Step 4: Add locale keys**

In `app/locales/en.json`, near the other `engine.hints.*` keys (after `engine.hints.action.morse`, ~427):

```json
  "engine.hints.ghostMachine.sealed": "UFO74: you have the run of the place now. there is a file i sealed myself.",
  "engine.hints.ghostMachine.open": "       /internal/ghost_in_machine.enc. open it. you earned it.",
```

In `app/locales/pt-br.json`, same location:

```json
  "engine.hints.ghostMachine.sealed": "UFO74: agora a casa é sua. tem um arquivo que eu mesmo lacrei.",
  "engine.hints.ghostMachine.open": "       /internal/ghost_in_machine.enc. abre ele. você mereceu.",
```

In `app/locales/es.json`, same location:

```json
  "engine.hints.ghostMachine.sealed": "UFO74: ahora la casa es tuya. hay un archivo que yo mismo sellé.",
  "engine.hints.ghostMachine.open": "       /internal/ghost_in_machine.enc. ábrelo. te lo ganaste.",
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- app/engine/__tests__/hintSystem.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/engine/hintSystem.ts app/locales/en.json app/locales/pt-br.json app/locales/es.json app/engine/__tests__/hintSystem.test.ts
git commit -m "feat(hints): point players to ghost_in_machine.enc after admin unlock" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: Regression guard + full validation

**Files:**
- Test: `app/engine/__tests__/endings.test.ts` (confirm UFO74 endings unchanged — no new test code needed if existing coverage passes)

- [ ] **Step 1: Confirm endings are unchanged**

Run: `npm test -- app/engine/__tests__/endings.test.ts`
Expected: PASS — `ufo74_exposed` and `secret_ending` still determined by `ghost_in_machine.enc` (unchanged; this plan touches no ending logic).

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS (clean).

- [ ] **Step 3: Full test suite**

Run: `npm test`
Expected: PASS — all tests including i18n coverage, achievements, narrative-mechanics, hintSystem, endings.

- [ ] **Step 4: Story validation**

Run: `npm run validate-story`
Expected: PASS.

- [ ] **Step 5: endings.MD no-diff guard**

Run: `npx tsx scripts/gen-endings-doc.ts && git diff --stat game_story_files/endings.MD`
Expected: NO diff (this plan changes no ending copy). Then: `git checkout game_story_files/endings.MD`.

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 7: Final commit (if any doc/tracking updates)**

```bash
git add -A
git commit -m "test: validate streber<->UFO74 breadcrumb; endings unchanged" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>" || echo "nothing to commit"
```

---

## Self-review

**Spec coverage:**
- Breadcrumb copy on `.signature.bak` → Task 4 ✓
- UFO74 reactions on both files → Task 3 ✓
- Post-admin hint → Task 5 ✓
- `decrypt`→`open` nudge → intentionally dropped (redundant; documented above) ✓
- Secret achievement (lore + achievement) → Tasks 1 & 2 ✓
- Keep admin gate → no gate change made ✓
- i18n EN/pt-BR/es for all new strings → Tasks 1,3,4,5 ✓
- Endings unchanged guard → Task 6 ✓

**Placeholder scan:** none — every step has concrete code/commands.

**Type consistency:** `streberSigFound` uses `flags: Record<string, boolean>` (no type change). Achievement id `ghost_handle` is consistent across achievements.ts, filesystem.ts push, and locale keys. Hint keys `engine.hints.ghostMachine.{sealed,open}` consistent between hintSystem.ts and all three locale files.
