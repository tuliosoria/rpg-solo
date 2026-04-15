# Copilot Instructions — Varginha: Terminal 1996

> Canonical repo guidance lives in **AGENTS.md** at repo root. This file mirrors that content with Copilot-specific additions. Keep them in sync.

## What This Repo Is

A **text-based narrative puzzle game** about the 1996 Varginha UFO incident in Brazil. Players access a simulated intelligence terminal, navigate a virtual filesystem, and collect **ten pieces of evidence** to build a leak dossier before detection ends their session.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS 4 · Vitest · Electron 40 (optional desktop wrapper)

**Genre:** Procedural horror / ufology — bureaucratic cover-up dread, not jump scares.

---

## Validate Your Work

Run these after any logic, content, or config change:

```bash
npm test              # Vitest unit tests (fast, run first)
npm run typecheck     # tsc --noEmit (catches type regressions)
npm run lint          # ESLint 9 flat config
npm run build         # Next.js production build (static export)
npm run validate-story # Story consistency checks
```

Other useful commands: `npm run test:coverage`, `npm run lint:fix`, `npm run format`, `npm run validate-enhanced`, `npm run validate-fundamentals`.

---

## Task Routing — Where to Look

| Task domain | Start here | Key files |
|---|---|---|
| **UI / terminal rendering** | `app/components/` | `Terminal.tsx`, `terminalConstants.ts` |
| **Game commands** | `app/engine/` | `commands.ts`, `commands/` subdirectory |
| **Narrative content / filesystem** | `app/data/` | `virtualFileSystem.ts`, plus companion content modules such as `narrativeContent.ts` |
| **Detection / difficulty balance** | `app/constants/` | `detection.ts` (`DETECTION_THRESHOLDS`), `gameplay.ts` |
| **Game state & types** | `app/types/` | `index.ts` (GameState, DEFAULT_GAME_STATE) |
| **Save / load / localStorage** | `app/storage/` | Serialization of `Set<string>` fields lives here |
| **Evidence system** | `app/engine/` | `evidenceRevelation.ts`, plus helpers in `commands/helpers.ts` |
| **Hooks** | `app/hooks/` | Custom React hooks |
| **Versioning / build metadata** | `next.config.ts`, `app/components/terminalConstants.ts` | See "Versioning" below |
| **Story validation scripts** | `scripts/` | `validate-story.js`, `validate-enhanced-story.js`, `story_validator.js` |
| **Desktop packaging** | `electron/` | Electron is for distribution; dev happens in browser |

---

## Core Mechanics (Agent-Critical)

### Detection
- `detectionLevel` (0–100%) is the stealth meter. Thresholds are centralized in `DETECTION_THRESHOLDS` — never hardcode magic numbers.
- Detection increases are **inevitable by design**; even safe actions add 1–3%.
- `wrongAttempts` is separate: invalid commands/passwords; 8 = game over.

### Evidence
- `evidenceCount` is a `0–10` counter (`MAX_EVIDENCE_COUNT` in `evidenceRevelation.ts`). No categories or types.
- Files with `isEvidence: true` log one piece of evidence when first opened.
- Players build a dossier via the `save` command → `savedFiles: Set<string>`.
- The `leak` command is the win path: 5+ saved files unlocks a preparation sequence; all 10 saved + completed sequence triggers transmission and victory.
- Disturbing content drives avatar reactions (scared/shocked) independently from evidence counting.

### Flags & Conditional Content
- `state.flags: Record<string, boolean>` — stringly-typed; typos cause silent failures.
- `requiredFlags` on FileNodes gates visibility. Always check existing flag names in `virtualFileSystem.ts` and related data modules.

### UFO74 (Ally NPC)
- Trust degrades on repeated warnings. Messages adapt to `evidenceCount`.
- Has a discoverable secret identity (password puzzle). At very low trust, paranoia hints surface.

### Player Commands
Live command set: `ls`, `cd`, `open`, `search`, `progress`, `unread`, `bookmark`, `hint`, `wait`, `leak`, `chat`, `help`. Older builds mentioned `decrypt`/`rewind`, but the current experience centers on direct investigation.

---

## Versioning

Build version is **environment-driven**, not a hardcoded constant.

- `next.config.ts` computes `NEXT_PUBLIC_BUILD_NUMBER` (git commit count) and `NEXT_PUBLIC_COMMIT_SHA` at build time.
- `app/components/terminalConstants.ts` derives `DEPLOY_VERSION` from those env vars (`v0.<BUILD_NUMBER>.0` or `dev-local`).
- **Do not** manually edit version strings. If you need repo-specific version guidance, read `.github/skills/version-bump/SKILL.md`; it documents the current git-derived flow.

---

## Stale-Guidance Traps

| Stale claim | Current reality |
|---|---|
| `DEPLOY_VERSION` is a hardcoded `v008`-style constant in `Terminal.tsx` | It's env-derived in `terminalConstants.ts` via `next.config.ts` git metadata |
| Manually editing a version constant in `Terminal.tsx` is the release workflow | Build metadata comes from git; use the current `version-bump` skill only for repo-specific guidance |
| Players use `decrypt` / `rewind` commands | These are from older builds; current flow uses `open`, `search`, `leak` |
| `evidenceCount` is 0–5 and winning requires 5 truths | `MAX_EVIDENCE_COUNT` is 10; evidence uses `isEvidence` files + `save`/`leak` dossier flow |
| FileNodes have a `reveals` array for truth discovery | The real field is `isEvidence?: boolean` on `FileNode` |

---

## Pitfalls

- **GameState is large** (~80 fields). Always read `app/types/index.ts` before adding state.
- **`Set<string>` fields** need array conversion for localStorage. Patterns are in `app/storage/`.
- **`isEvidence` flag on FileNodes** is what makes a file count toward evidence discovery. No `isEvidence` = flavor only.
- **Don't duplicate evidence files** across directories — it lets players fill the dossier too easily.
- **Vitest uses jsdom.** localStorage needs mocking. RNG is seeded (`app/engine/rng.ts`).

---

## Narrative Tone (for content tasks)

**Voice:** Clinical detachment. Documents sound like bureaucratic forms. "Subject exhibited distress" not "the creature was scared."

**Atmosphere tools:** `[REDACTED]`, `[DATA EXPUNGED]`, `████████`. Euphemism as horror: "biological material" not "body parts"; "transition event" not "death."

**In-game document format:**
```
═══════════════════════════════════════════════════════════
DOCUMENT HEADER — ALL CAPS
CLASSIFICATION: LEVEL/TYPE
═══════════════════════════════════════════════════════════

Section titles use ─── underlines.

  Body text is indented two spaces.
  Typewriter/form feel.

───────────────────────────────────────────────────────────
```

**Terminal personality** degrades with detection: bureaucratic (0–40%) → defensive (40–70%) → hostile (70–90%) → pleading (90%+).

---

## Historical Context (for narrative accuracy)

The game is set during the **real Varginha UFO incident** (January 1996, Minas Gerais, Brazil). Key dates: NORAD tracking (Jan 13), creature sighting by three women (Jan 20), military capture operations (Jan 22). The narrative assumes the cover-up was real. The five truths align with persistent conspiracy claims: debris recovery, creature containment, telepathic abilities, international involvement, and a future "activation window."

---

## Quick Decisions

| Task | Action |
|---|---|
| Add a game file | Add FileNode/content in `app/data/virtualFileSystem.ts` or the relevant `app/data/*.ts` module |
| Adjust difficulty | Edit `app/constants/detection.ts` |
| Add a command | Add handler in `app/engine/commands.ts` |
| Change starting state | Edit `DEFAULT_GAME_STATE` in `app/types/index.ts` |
| Add UFO74 dialogue | See `app/engine/commands/` subdirectory |
| Understand version string | Read `app/components/terminalConstants.ts` (lines 144–149) |

---

## Copilot Skills (Domain-Specific Guidance)

This project uses skills in `.github/skills/`. When a task matches a skill domain, **invoke the skill** before starting work.

| Skill | Invoke when | Notes |
|---|---|---|
| `game-design` | Modifying mechanics, detection, player psychology | Read `.github/skills/game-design/SKILL.md` |
| `game-content` | Writing in-world files, UFO74 dialogue, terminal messages | Read `.github/skills/game-content/SKILL.md` |
| `testing` | Writing or fixing tests | Read `.github/skills/testing/SKILL.md` |
| `version-bump` | Understanding or adjusting git-derived version/build display behavior | Read `.github/skills/version-bump/SKILL.md` |

---

**Keep edits minimal, match existing style, and run `npm test && npm run typecheck` after logic changes.**
