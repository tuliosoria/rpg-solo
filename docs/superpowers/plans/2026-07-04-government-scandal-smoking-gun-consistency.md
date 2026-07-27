# government_scandal Smoking-Gun Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `government_scandal` ending's copy stop denying alien contact when the player's leaked dossier actually contains smoking-gun contact files (`jardim_andere_incident.txt` / `incident_report_1996_01_VG.txt`).

**Architecture:** Add one small pure engine module that detects smoking-gun files and returns adaptive replacements for exactly two contradictory lines. The base `ENDINGS.government_scandal` content is left untouched (it remains the correct copy for pure-logistics leaks). The AOL render path (`Victory.tsx`) and the terminal-narrative helper (`getEndingNarrativeLines`) consult the module, swapping only the two lines when a smoking-gun file is present. `determineEnding`, `FILE_CATEGORIES`, and the legacy `conspiracyFilesLeaked` contract are NOT changed, so all ending-selection tests stay green.

**Tech Stack:** TypeScript, React (Next.js static export), Vitest + Testing Library, i18n via `app/i18n/runtimeCommandSupplement.ts`.

**Spec:** `docs/superpowers/specs/2026-07-04-government-scandal-smoking-gun-consistency-design.md`

---

## File Structure

- **Create** `app/engine/governmentScandalCopy.ts` — pure module: smoking-gun file set, `hasSmokingGunContact()`, the two smoking-gun replacement strings, and two selectors that swap the contradictory lines. Single responsibility, no React/DOM imports.
- **Create** `app/engine/__tests__/governmentScandalCopy.test.ts` — unit tests for the pure module.
- **Modify** `app/engine/endings.ts` — make `getEndingNarrativeLines` accept an optional `savedFiles` and swap `narrative[0]` for `government_scandal`.
- **Modify** `app/components/endings/Victory.tsx` — in the `aol` `useMemo`, swap `aol.body[1]` for `government_scandal` before the leak prologue is prepended.
- **Modify** `app/components/endings/__tests__/Victory.test.tsx` — render test proving the swap.
- **Modify** `app/i18n/runtimeCommandSupplement.ts` — PT-BR + ES translations for the two new strings.
- **Modify** `app/engine/__tests__/endings.test.ts` — one test for the narrative swap.

**Canonical strings (single source of truth — used verbatim across tasks):**

- `SMOKING_GUN_NARRATIVE_INTRO` (English) — replaces `government_scandal` `narrative[0]`:
  > `Transport logs. Response orders. And two files that a mobilization story cannot contain: an incident report logging biological specimens recovered from the Jardim Andere site, and a field report describing direct contact with a surviving occupant. This is no longer only proof that the Brazilian military hid something on January 20, 1996 — it is the first page of what it was hiding.`

- `SMOKING_GUN_AOL_PURPOSE` (English) — replaces `government_scandal` `aol.body[1]`:
  > `Unlike the transport and command records, two of the leaked files name the operation's purpose: an incident report references 'biological specimens recovered' from the Jardim Andere site, and a field report describes a surviving occupant. Forensic analysts working around the clock report the documents may be authentic; wire services are already calling it the most consequential leak of the decade.`

> The em dash (`—`) and the ASCII apostrophes in `operation's` / `'biological specimens recovered'` must be copied EXACTLY, because i18n lookup keys on the exact English string.

---

### Task 1: Pure engine module `governmentScandalCopy.ts`

**Files:**
- Create: `app/engine/governmentScandalCopy.ts`
- Test: `app/engine/__tests__/governmentScandalCopy.test.ts`

- [ ] **Step 1: Write the failing test**

Create `app/engine/__tests__/governmentScandalCopy.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import {
  hasSmokingGunContact,
  resolveGovernmentScandalNarrative,
  resolveGovernmentScandalAolBody,
  SMOKING_GUN_NARRATIVE_INTRO,
  SMOKING_GUN_AOL_PURPOSE,
} from '../governmentScandalCopy';

const MUNDANE_INTRO = 'MUNDANE_INTRO';
const MUNDANE_PURPOSE = 'MUNDANE_PURPOSE';
const baseNarrative = [MUNDANE_INTRO, 'line-1', 'line-2'];
const baseBody = ['body-0', MUNDANE_PURPOSE, 'body-2'];

describe('hasSmokingGunContact', () => {
  it('is true when jardim_andere is present (any path)', () => {
    expect(hasSmokingGunContact(new Set(['/internal/jardim_andere_incident.txt']))).toBe(true);
  });

  it('is true when the specimen-recovery report is present', () => {
    expect(hasSmokingGunContact(new Set(['/admin/incident_report_1996_01_VG.txt']))).toBe(true);
  });

  it('is false for pure-logistics military files', () => {
    expect(
      hasSmokingGunContact(
        new Set(['/storage/assets/transport_log_96.txt', '/ops/assessments/initial_response_orders.txt'])
      )
    ).toBe(false);
  });

  it('is false for empty or nullish input', () => {
    expect(hasSmokingGunContact(new Set())).toBe(false);
    expect(hasSmokingGunContact(undefined)).toBe(false);
    expect(hasSmokingGunContact(null)).toBe(false);
  });
});

describe('resolveGovernmentScandalNarrative', () => {
  it('swaps narrative[0] when a smoking gun is present', () => {
    const out = resolveGovernmentScandalNarrative(baseNarrative, new Set(['/internal/jardim_andere_incident.txt']));
    expect(out[0]).toBe(SMOKING_GUN_NARRATIVE_INTRO);
    expect(out.slice(1)).toEqual(baseNarrative.slice(1));
  });

  it('returns the base narrative unchanged for mundane dossiers', () => {
    const out = resolveGovernmentScandalNarrative(baseNarrative, new Set(['/storage/assets/transport_log_96.txt']));
    expect(out).toEqual(baseNarrative);
  });
});

describe('resolveGovernmentScandalAolBody', () => {
  it('swaps body[1] when a smoking gun is present', () => {
    const out = resolveGovernmentScandalAolBody(baseBody, new Set(['/admin/incident_report_1996_01_VG.txt']));
    expect(out[1]).toBe(SMOKING_GUN_AOL_PURPOSE);
    expect(out[0]).toBe('body-0');
    expect(out[2]).toBe('body-2');
  });

  it('returns the base body unchanged for mundane dossiers', () => {
    const out = resolveGovernmentScandalAolBody(baseBody, undefined);
    expect(out).toEqual(baseBody);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/run-vitest.mjs run app/engine/__tests__/governmentScandalCopy.test.ts --configLoader runner --reporter=dot`
Expected: FAIL — cannot resolve module `../governmentScandalCopy`.

- [ ] **Step 3: Write the module**

Create `app/engine/governmentScandalCopy.ts`:

```typescript
// Adaptive copy for the `government_scandal` ending.
//
// The ending is intentionally under-dramatic for a *mundane* military-logistics
// leak ("purpose still classified"). But the player can reach it while having
// leaked genuine smoking-gun contact files, in which case two of its lines become
// false. When such a file is present we swap ONLY those two lines; everything else
// (trigger, categories, other endings) is unchanged.

// Basenames of files that contain direct creature-contact / specimen evidence.
export const SMOKING_GUN_CONTACT_FILES: ReadonlySet<string> = new Set<string>([
  'jardim_andere_incident.txt',      // direct-contact field report
  'incident_report_1996_01_VG.txt',  // "biological specimens recovered"
]);

// Replaces government_scandal narrative[0] when a smoking gun is present.
export const SMOKING_GUN_NARRATIVE_INTRO =
  'Transport logs. Response orders. And two files that a mobilization story cannot contain: an incident report logging biological specimens recovered from the Jardim Andere site, and a field report describing direct contact with a surviving occupant. This is no longer only proof that the Brazilian military hid something on January 20, 1996 — it is the first page of what it was hiding.';

// Replaces government_scandal aol.body[1] when a smoking gun is present.
export const SMOKING_GUN_AOL_PURPOSE =
  "Unlike the transport and command records, two of the leaked files name the operation's purpose: an incident report references 'biological specimens recovered' from the Jardim Andere site, and a field report describes a surviving occupant. Forensic analysts working around the clock report the documents may be authentic; wire services are already calling it the most consequential leak of the decade.";

export function hasSmokingGunContact(
  savedFiles: ReadonlySet<string> | undefined | null,
): boolean {
  if (!savedFiles) return false;
  for (const fullPath of savedFiles) {
    const basename = fullPath.split('/').pop() ?? fullPath;
    if (SMOKING_GUN_CONTACT_FILES.has(basename)) return true;
  }
  return false;
}

export function resolveGovernmentScandalNarrative(
  baseNarrative: readonly string[],
  savedFiles: ReadonlySet<string> | undefined | null,
): string[] {
  if (baseNarrative.length === 0 || !hasSmokingGunContact(savedFiles)) {
    return [...baseNarrative];
  }
  return [SMOKING_GUN_NARRATIVE_INTRO, ...baseNarrative.slice(1)];
}

export function resolveGovernmentScandalAolBody(
  baseBody: readonly string[],
  savedFiles: ReadonlySet<string> | undefined | null,
): string[] {
  if (baseBody.length < 2 || !hasSmokingGunContact(savedFiles)) {
    return [...baseBody];
  }
  return baseBody.map((line, i) => (i === 1 ? SMOKING_GUN_AOL_PURPOSE : line));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/run-vitest.mjs run app/engine/__tests__/governmentScandalCopy.test.ts --configLoader runner --reporter=dot`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add app/engine/governmentScandalCopy.ts app/engine/__tests__/governmentScandalCopy.test.ts
git commit -m "feat: add adaptive government_scandal smoking-gun copy module

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Wire the AOL body swap into `Victory.tsx` (render-critical)

**Files:**
- Modify: `app/components/endings/Victory.tsx` (imports near top; `aol` useMemo at lines ~130-141)
- Test: `app/components/endings/__tests__/Victory.test.tsx`

- [ ] **Step 1: Write the failing render test**

Append these two tests inside the `describe('Victory Component', ...)` block in `app/components/endings/__tests__/Victory.test.tsx` (after the existing `government_scandal` test near line 213):

```typescript
  it('shows the smoking-gun purpose line when a contact file is leaked', () => {
    render(
      <Victory
        {...defaultProps}
        endingId="government_scandal"
        textSpeed="instant"
        savedFiles={new Set(['/internal/jardim_andere_incident.txt'])}
      />
    );
    advanceToComplete('instant');
    expect(
      screen.getByText(/two of the leaked files name the operation's purpose/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/purpose of the operation is not specified/i)
    ).not.toBeInTheDocument();
  });

  it('keeps the mundane purpose line for a pure-logistics leak', () => {
    render(
      <Victory
        {...defaultProps}
        endingId="government_scandal"
        textSpeed="instant"
        savedFiles={new Set(['/storage/assets/transport_log_96.txt'])}
      />
    );
    advanceToComplete('instant');
    expect(
      screen.getByText(/purpose of the operation is not specified/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/two of the leaked files name the operation's purpose/i)
    ).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/run-vitest.mjs run app/components/endings/__tests__/Victory.test.tsx --configLoader runner --reporter=dot`
Expected: FAIL — the smoking-gun test can't find the new text (body[1] still shows "purpose ... not specified").

- [ ] **Step 3: Wire the swap into the `aol` useMemo**

In `app/components/endings/Victory.tsx`, add the import (place with the other engine imports near the top, e.g. next to the `buildLeakPrologue` import on line 15):

```typescript
import { resolveGovernmentScandalAolBody } from '../../engine/governmentScandalCopy';
```

Then change the `aol` useMemo (currently lines ~130-141) from:

```typescript
  const aol = useMemo(() => {
    const baseAol = ending?.aol ?? {
      headline: t('ending.aol.fallback.headline'),
      subheadline: t('ending.aol.fallback.subheadline'),
      body: [t('ending.aol.fallback.body')],
      url: 'http://www.aol.com/news/',
      imageAlt: t('ending.aol.fallback.imageAlt'),
      visitorCount: 0,
    };
    if (leakPrologue.length === 0) return baseAol;
    return { ...baseAol, body: [...leakPrologue, ...baseAol.body] };
  }, [ending, leakPrologue, t]);
```

to:

```typescript
  const aol = useMemo(() => {
    const baseAol = ending?.aol ?? {
      headline: t('ending.aol.fallback.headline'),
      subheadline: t('ending.aol.fallback.subheadline'),
      body: [t('ending.aol.fallback.body')],
      url: 'http://www.aol.com/news/',
      imageAlt: t('ending.aol.fallback.imageAlt'),
      visitorCount: 0,
    };
    const resolvedBody =
      resolvedEndingId === 'government_scandal'
        ? resolveGovernmentScandalAolBody(baseAol.body, savedFiles)
        : baseAol.body;
    if (leakPrologue.length === 0) return { ...baseAol, body: resolvedBody };
    return { ...baseAol, body: [...leakPrologue, ...resolvedBody] };
  }, [ending, leakPrologue, t, resolvedEndingId, savedFiles]);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/run-vitest.mjs run app/components/endings/__tests__/Victory.test.tsx --configLoader runner --reporter=dot`
Expected: PASS (both new tests, plus the existing 13+ Victory tests unaffected).

- [ ] **Step 5: Commit**

```bash
git add app/components/endings/Victory.tsx app/components/endings/__tests__/Victory.test.tsx
git commit -m "feat: swap government_scandal AOL purpose line when smoking gun leaked

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Make `getEndingNarrativeLines` savedFiles-aware

**Files:**
- Modify: `app/engine/endings.ts` (`getEndingNarrativeLines`, lines ~716-726; add import at top of file)
- Test: `app/engine/__tests__/endings.test.ts`

- [ ] **Step 1: Write the failing test**

Add this `describe` block to `app/engine/__tests__/endings.test.ts` (place it after the existing `describe('determineEnding', ...)` block; reuse the file's existing `dossier()` helper and the imported `getEndingNarrativeLines`). First ensure the import line at the top of the file includes `getEndingNarrativeLines`:

```typescript
import {
  ENDINGS,
  type EndingFlags,
  type EndingId,
  analyzeDossier,
  determineEnding,
  determineEndingVariant,
  getEndingFlags,
  getEndingNarrativeLines,
  getEndingTitle,
} from '../endings';
```

Then add:

```typescript
describe('getEndingNarrativeLines (government_scandal smoking-gun)', () => {
  it('uses the smoking-gun intro when a contact file is in the dossier', () => {
    const lines = getEndingNarrativeLines(
      'government_scandal',
      dossier('jardim_andere_incident.txt', 'transport_log_96.txt')
    );
    expect(lines.some(l => l.includes('the first page of what it was hiding'))).toBe(true);
    expect(lines.some(l => l.includes('The leak does not prove alien contact'))).toBe(false);
  });

  it('keeps the mundane intro for a pure-logistics dossier', () => {
    const lines = getEndingNarrativeLines(
      'government_scandal',
      dossier('transport_log_96.txt', 'duty_roster_jan96.txt')
    );
    expect(lines.some(l => l.includes('The leak does not prove alien contact'))).toBe(true);
  });

  it('is backward compatible when savedFiles is omitted', () => {
    const lines = getEndingNarrativeLines('government_scandal');
    expect(lines.some(l => l.includes('The leak does not prove alien contact'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/run-vitest.mjs run app/engine/__tests__/endings.test.ts --configLoader runner --reporter=dot`
Expected: FAIL — the smoking-gun case still contains "The leak does not prove alien contact" (and/or `getEndingNarrativeLines` arity).

- [ ] **Step 3: Update `getEndingNarrativeLines`**

In `app/engine/endings.ts`, add the import near the top of the file (with the other imports):

```typescript
import { resolveGovernmentScandalNarrative } from './governmentScandalCopy';
```

Then change `getEndingNarrativeLines` (lines ~716-726) from:

```typescript
export function getEndingNarrativeLines(variant: EndingVariant): string[] {
  const ending = (ENDINGS as Record<string, Omit<GameEnding, 'id'>>)[variant];
  if (!ending) return ['ENDING NOT FOUND'];
  return [
    ENDING_DIVIDER,
    '',
    ending.title,
    '',
    ENDING_DIVIDER,
    '',
    ...ending.narrative,
```

to:

```typescript
export function getEndingNarrativeLines(
  variant: EndingVariant,
  savedFiles?: ReadonlySet<string> | null,
): string[] {
  const ending = (ENDINGS as Record<string, Omit<GameEnding, 'id'>>)[variant];
  if (!ending) return ['ENDING NOT FOUND'];
  const narrative =
    variant === 'government_scandal'
      ? resolveGovernmentScandalNarrative(ending.narrative, savedFiles)
      : ending.narrative;
  return [
    ENDING_DIVIDER,
    '',
    ending.title,
    '',
    ENDING_DIVIDER,
    '',
    ...narrative,
```

(Leave the remainder of the returned array — the `ufo74_final`, subtitle, dividers — exactly as-is.)

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/run-vitest.mjs run app/engine/__tests__/endings.test.ts --configLoader runner --reporter=dot`
Expected: PASS (new block passes; all existing `determineEnding` / `determineEndingVariant` / `analyzeDossier` tests remain green).

- [ ] **Step 5: Commit**

```bash
git add app/engine/endings.ts app/engine/__tests__/endings.test.ts
git commit -m "feat: adapt government_scandal terminal narrative for smoking-gun leaks

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Add PT-BR + ES translations for the two new strings

**Files:**
- Modify: `app/i18n/runtimeCommandSupplement.ts` (PT-BR government_scandal block ends at line ~900; ES block ends at line ~2064)

- [ ] **Step 1: Add the PT-BR entries**

In `app/i18n/runtimeCommandSupplement.ts`, in the **PT-BR** block, immediately AFTER the existing entry that ends at line 900 (the `'Three colonels have been subpoenaed ... did not deny their authenticity.'` mapping) and before the blank line preceding `// ENDING 5: prisoner_45_freed`, insert:

```typescript
    'Transport logs. Response orders. And two files that a mobilization story cannot contain: an incident report logging biological specimens recovered from the Jardim Andere site, and a field report describing direct contact with a surviving occupant. This is no longer only proof that the Brazilian military hid something on January 20, 1996 — it is the first page of what it was hiding.':
      'Registros de transporte. Ordens de resposta. E dois arquivos que uma história de mobilização não consegue conter: um relatório de incidente registrando espécimes biológicos recuperados do local do Jardim Andere, e um relatório de campo descrevendo contato direto com um ocupante sobrevivente. Isto não é mais apenas prova de que os militares brasileiros esconderam algo em 20 de janeiro de 1996 — é a primeira página do que estavam escondendo.',
    "Unlike the transport and command records, two of the leaked files name the operation's purpose: an incident report references 'biological specimens recovered' from the Jardim Andere site, and a field report describes a surviving occupant. Forensic analysts working around the clock report the documents may be authentic; wire services are already calling it the most consequential leak of the decade.":
      'Ao contrário dos registros de transporte e comando, dois dos arquivos vazados nomeiam o propósito da operação: um relatório de incidente menciona \'espécimes biológicos recuperados\' do local do Jardim Andere, e um relatório de campo descreve um ocupante sobrevivente. Analistas forenses trabalhando sem parar relatam que os documentos podem ser autênticos; agências de notícias já o consideram o vazamento mais importante da década.',
```

- [ ] **Step 2: Add the ES entries**

In the **ES** block, immediately AFTER the existing entry that ends at line 2064 (the `'Three colonels have been subpoenaed ...'` mapping) and before the blank line preceding `// ENDING 5: prisoner_45_freed`, insert:

```typescript
    'Transport logs. Response orders. And two files that a mobilization story cannot contain: an incident report logging biological specimens recovered from the Jardim Andere site, and a field report describing direct contact with a surviving occupant. This is no longer only proof that the Brazilian military hid something on January 20, 1996 — it is the first page of what it was hiding.':
      'Registros de transporte. Órdenes de respuesta. Y dos archivos que una historia de movilización no puede contener: un informe de incidente que registra especímenes biológicos recuperados del sitio del Jardim Andere, y un informe de campo que describe contacto directo con un ocupante sobreviviente. Esto ya no es solo prueba de que los militares brasileños ocultaron algo el 20 de enero de 1996 — es la primera página de lo que estaban ocultando.',
    "Unlike the transport and command records, two of the leaked files name the operation's purpose: an incident report references 'biological specimens recovered' from the Jardim Andere site, and a field report describes a surviving occupant. Forensic analysts working around the clock report the documents may be authentic; wire services are already calling it the most consequential leak of the decade.":
      'A diferencia de los registros de transporte y mando, dos de los archivos filtrados nombran el propósito de la operación: un informe de incidente menciona \'especímenes biológicos recuperados\' del sitio del Jardim Andere, y un informe de campo describe a un ocupante sobreviviente. Analistas forenses que trabajan sin descanso informan que los documentos podrían ser auténticos; las agencias de noticias ya lo llaman la filtración más trascendental de la década.',
```

- [ ] **Step 3: Write a focused i18n test**

Create `app/i18n/__tests__/runtimeCommandSupplement.smokingGun.test.ts` (the supplement is exported as `RUNTIME_COMMAND_SUPPLEMENT: Record<'pt-BR' | 'es', RuntimeDictionary>` from `app/i18n/runtimeCommandSupplement.ts`, keyed `'pt-BR'` and `es`):

```typescript
import { describe, it, expect } from 'vitest';
import { RUNTIME_COMMAND_SUPPLEMENT } from '../runtimeCommandSupplement';

const AOL_PURPOSE_KEY =
  "Unlike the transport and command records, two of the leaked files name the operation's purpose: an incident report references 'biological specimens recovered' from the Jardim Andere site, and a field report describes a surviving occupant. Forensic analysts working around the clock report the documents may be authentic; wire services are already calling it the most consequential leak of the decade.";

const NARRATIVE_INTRO_KEY =
  'Transport logs. Response orders. And two files that a mobilization story cannot contain: an incident report logging biological specimens recovered from the Jardim Andere site, and a field report describing direct contact with a surviving occupant. This is no longer only proof that the Brazilian military hid something on January 20, 1996 — it is the first page of what it was hiding.';

describe('runtimeCommandSupplement smoking-gun keys', () => {
  it('has Portuguese translations for both new strings', () => {
    expect(RUNTIME_COMMAND_SUPPLEMENT['pt-BR'][AOL_PURPOSE_KEY]).toContain('propósito da operação');
    expect(RUNTIME_COMMAND_SUPPLEMENT['pt-BR'][NARRATIVE_INTRO_KEY]).toContain('primeira página');
  });

  it('has Spanish translations for both new strings', () => {
    expect(RUNTIME_COMMAND_SUPPLEMENT['es'][AOL_PURPOSE_KEY]).toContain('propósito de la operación');
    expect(RUNTIME_COMMAND_SUPPLEMENT['es'][NARRATIVE_INTRO_KEY]).toContain('primera página');
  });
});
```

- [ ] **Step 4: Run the i18n test**

Run: `node scripts/run-vitest.mjs run app/i18n/__tests__/runtimeCommandSupplement.smokingGun.test.ts --configLoader runner --reporter=dot`
Expected: PASS (both language assertions).

- [ ] **Step 5: Commit**

```bash
git add app/i18n/runtimeCommandSupplement.ts app/i18n/__tests__/runtimeCommandSupplement.smokingGun.test.ts
git commit -m "i18n: translate government_scandal smoking-gun copy (pt-BR, es)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Full validation

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS. Pay special attention that `app/engine/__tests__/endings.test.ts`, `ending-reachability.test.ts`, `story-consistency.test.ts`, `narrative-mechanics.test.ts`, `evidence-tiers.test.ts`, and `app/components/endings/__tests__/Victory.test.tsx` are all green. The `government_scandal` representative dossier still resolves to `government_scandal` (trigger unchanged).

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no new errors.

- [ ] **Step 4: Story validation + audit doc**

Run: `npm run validate-story`
Expected: passes.

Run: `npx tsx scripts/gen-endings-doc.ts`
Expected: `game_story_files/endings.MD` is regenerated with NO diff (base `ENDINGS.government_scandal` content was not modified). Confirm with `git status --porcelain game_story_files/endings.MD` → empty. If it somehow changed, review the diff and discard if unintended.

- [ ] **Step 5: Manual localized spot-check (optional but recommended)**

Run `npm run dev`, reach `government_scandal` two ways and confirm copy in `en`, `pt-BR`, `es`:
- Dossier including `jardim_andere_incident.txt` (+3 more military) → AOL body shows "two of the leaked files name the operation's purpose … biological specimens recovered"; NOT "purpose … not specified".
- Dossier of 4 mundane logistics files only (e.g. `transport_log_96.txt`, `duty_roster_jan96.txt`, `cargo_transfer_memo.txt`, `initial_response_orders.txt`) → AOL body still shows "purpose … not specified".

- [ ] **Step 6: Final no-op commit guard**

If any formatter touched files, run `npm run format` then commit; otherwise nothing to do. The feature is complete when Steps 1-4 pass.

---

## Notes / Out of Scope

- **Do NOT** modify `determineEnding`, `FILE_CATEGORIES`, or the legacy `conspiracyFilesLeaked` mapping — the ending-selection tests depend on current behavior and `real_ending`/`nothing_changes` rely on `incident_report_1996_01_VG.txt` counting as `military`.
- **Deferred (per spec):** conditional AOL `subheadline` escalation; `wrong_story` adjacency (can also fire with a single smoking gun present); `buildLeakPrologue` treating all `military_coverup` files as alien-related for pure-logistics leaks. These are separate follow-ups, not part of this plan.
