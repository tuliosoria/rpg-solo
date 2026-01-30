# Copilot Instructions — Varginha: Terminal 1996

> **Built with Next.js 15 and React 19** — A narrative puzzle game about the 1996 Varginha UFO incident in Brazil.

---

## The Real Varginha Incident (Historical Context)

The game is based on **real events from January 1996** in Varginha, Minas Gerais, Brazil:

- **January 13, 1996:** NORAD allegedly tracked an unknown object entering Brazilian airspace; Brazilian Air Force scrambled jets.
- **January 20, 1996:** Three young women (Liliane, Valquíria, and Kátia) claimed to encounter a "creature" with oily brown skin, large red eyes, and three protrusions on its head in the Jardim Andere neighborhood at approximately 3:30 PM.
- **January 22, 1996:** Military police and firefighters reportedly captured one or more creatures; witnesses describe unusual military activity at the local zoo and Humanitas Hospital.
- **Multiple witness deaths:** Several witnesses and military personnel involved died under unusual circumstances in the following years, fueling conspiracy theories.
- **Official denial:** Brazilian military officially denies any unusual activity, calling it a case of mass hysteria or misidentification of a homeless person ("the dwarf theory").

**Why this matters for the game:** The narrative assumes the cover-up was real. Players piece together what "actually happened" through classified documents. The five truths players must discover align with the most persistent conspiracy claims: debris recovery, creature containment, telepathic abilities, international involvement, and a future "activation window."

---

## Project Overview

**Varginha: Terminal 1996** is a text-based puzzle game where players access a simulated Brazilian intelligence terminal set in January 1996. They navigate a virtual filesystem to uncover **five hidden truths** before system detection or corruption ends the session.

**Genre Identity:** Procedural Horror / Ufology / Hard Sci-Fi Cosmology. The game walks a line between X-Files-style conspiracy thriller and Lovecraftian cosmic dread—the creatures aren't "aliens" in a friendly sci-fi sense but something fundamentally unsettling.

---

## Design Philosophy & Architecture Rationale

### Why a Terminal Interface?
The terminal aesthetic serves multiple purposes:
1. **Justifies information restriction** — Classified systems naturally have access controls
2. **Creates diegetic tension** — The "detection level" makes sense as intrusion monitoring
3. **Enables procedural horror** — Text corruption, system glitches, and hostile messages feel organic
4. **Low barrier to entry** — No complex UI; players learn commands naturally

### Why Detection Increases Are Inevitable
The game is designed so that **you cannot avoid detection entirely**—only manage it. This was an intentional design choice to create tension. Even "safe" actions like reading files increment detection by 1-3%. Players who try to be perfectly stealthy will eventually realize the game wants them to take risks.

### The Five Truths System
The five `TruthCategory` values aren't arbitrary—they map to the core conspiracy claims:
- `debris_relocation` — The crashed craft was real and its pieces were hidden
- `being_containment` — Living beings were captured (not just bodies)
- `telepathic_scouts` — The beings communicated mentally; they were reconnaissance units
- `international_actors` — The US and others were involved, not just Brazil
- `transition_2026` — A future event/activation is predicted (ties to "30-year cycle" theories)

### UFO74: The Ally System
UFO74 is the player's only friend in the system—a hacker who guides them. Design principles:
- **Trust degrades** if the player triggers too many warnings
- **Has a secret identity** — UFO74 was actually present during the 1996 incident (discoverable via password puzzle)
- At very low trust, hints emerge that "UFO74" might be multiple people (paranoia mechanic)
- Messages adapt to which truths the player has discovered

### The Evidence Revelation System
Players don't just "find" truths—they must **recognize patterns** across multiple files. The `reveals` array on FileNode tells the engine which truth categories a file contributes to. Reading a single file rarely completes a truth; players need 2-3 corroborating files.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, CSS Modules, Tailwind CSS 4
- **Language:** TypeScript 5 (strict mode)
- **Testing:** Vitest, React Testing Library, jsdom
- **Linting/Formatting:** ESLint 9 (flat config), Prettier
- **Desktop:** Electron 40 (optional)
- **Build Tools:** PostCSS

---

## Key Directories & Files

- `app/` — Main app logic (Next.js)
  - `components/` — Terminal UI, overlays, chat, endings
  - `constants/` — Game balance, detection, timing (CRITICAL for balance changes)
  - `data/` — Narrative content, virtual filesystem
  - `engine/` — Command parser, game logic, evidence system
  - `hooks/` — Custom React hooks
  - `storage/` — Save/load, statistics, localStorage
  - `types/` — TypeScript interfaces (GameState, FileNode, etc.)
- `electron/` — Desktop wrapper
- `public/` — Static assets (videos, images, sounds)
- `scripts/` — Story validation and analysis
- `.github/` — Copilot instructions, custom skills, CI workflows

---

## Build & Test Commands

```bash
npm install           # Install dependencies
npm run dev           # Start dev server (http://localhost:3000)
npm run build         # Production build
npm start             # Start production server
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run lint          # Lint check
npm run lint:fix      # Auto-fix lint
npm run format        # Prettier format
npm run validate-story # Validate story consistency
```

---

## Common Pitfalls & Gotchas

### Gameplay Balance
- **Don't make detection increases too punishing.** The Jan 2026 rebalance reduced most values by 30-40%. See `app/constants/detection.ts` for current values.
- **Detection thresholds are centralized** in `DETECTION_THRESHOLDS`. Don't hardcode magic numbers like `50` or `90` elsewhere.
- **wrongAttempts vs detectionLevel:** These are separate! `wrongAttempts` is for invalid commands/passwords (8 = game over). `detectionLevel` is the stealth meter (0-100%).

### State Management
- **GameState is complex** (~80 fields). Always check `app/types/index.ts` before adding new state.
- **Sets require special handling** in save/load. GameState uses `Set<string>` for many fields, but localStorage needs arrays. Check `storage/` for serialization patterns.
- **Flags are stringly-typed.** The `flags: Record<string, boolean>` pattern means typos in flag names cause silent failures.

### Narrative Content
- **`reveals` array is critical.** A file without `reveals` contributes nothing to truth discovery—it's just flavor.
- **Don't duplicate truth revelations.** If two files both reveal the same truth too easily, players can skip half the game.
- **Conditional files use `requiredFlags`.** Check what flags must be set before the file appears.

### Testing
- **Vitest uses jsdom.** Tests that rely on `window` or `document` should work, but localStorage needs mocking.
- **RNG is seeded.** The game uses deterministic random via `app/engine/rng.ts`. Tests should set a known seed.

### Electron
- **Optional and separate build.** Most development happens in browser. Electron is for distribution only.

---

## Narrative Tone Guidelines

The game's tone is **bureaucratic horror**—the terror of institutional cover-ups, not jump scares.

### Voice Principles
- **Clinical detachment:** Documents read like they were written by someone following a form. "Subject exhibited distress" not "the creature was scared."
- **Redaction as atmosphere:** `[REDACTED]`, `[DATA EXPUNGED]`, and `████████` imply more than explicit content could.
- **Euphemism as horror:** "Biological material" instead of "body parts." "Transition event" instead of "death."

### Document Formatting
```
═══════════════════════════════════════════════════════════
DOCUMENT HEADER — ALL CAPS
CLASSIFICATION: LEVEL/TYPE
═══════════════════════════════════════════════════════════

Section titles use ─── underlines.

  Body text is indented two spaces.
  This creates a typewriter/form feel.

───────────────────────────────────────────────────────────
```

### The System's Personality
The terminal itself has a personality that degrades as detection rises:
- **bureaucratic** (0-40%): Neutral, helpful error messages
- **defensive** (40-70%): Warnings, access denied messages become terse
- **hostile** (70-90%): The system actively threatens the player
- **pleading** (90%+): Desperate messages suggesting the system "fears" what the player will find

---

## Reference Files

- `app/types/index.ts` — All interfaces (start here for state structure)
- `app/engine/commands.ts` — Command execution logic
- `app/data/filesystem.ts` — Narrative content and file definitions
- `app/components/Terminal.tsx` — Main UI component
- `app/constants/detection.ts` — Detection system balance
- `app/constants/gameplay.ts` — Other gameplay constants

---

## Quick Decisions Guide

| If you need to... | Do this |
|---|---|
| Add a new file to the game | Edit `app/data/filesystem.ts`, add FileNode with `reveals` |
| Adjust difficulty | Edit values in `app/constants/detection.ts` |
| Add a new command | Edit `app/engine/commands.ts`, add handler |
| Add a new truth category | Update `TRUTH_CATEGORIES` in `app/types/index.ts` (requires extensive content work) |
| Debug state issues | Check `DEFAULT_GAME_STATE` in `app/types/index.ts` |
| Add UFO74 dialogue | See dialogue arrays in `app/engine/commands/` subdirectory |

---

**Keep edits minimal and consistent with the established style. Run tests after logic changes.**

---

## Skills (Domain-Specific Instructions)

This project has specialized skills in `.github/skills/`:

| Skill | Purpose | When to use |
|-------|---------|-------------|
| `game-design` | Narrative mechanics, detection system, player psychology | Adding/modifying game mechanics |
| `game-content` | Writing in-world files, UFO74 dialogue, terminal messages | Creating new content |
| `testing` | Test patterns, coverage requirements, mocking strategies | Writing/fixing tests |

**Read the relevant SKILL.md before working in that domain.** For example:
- Working on detection balance? Read `.github/skills/game-design/SKILL.md`
- Adding new terminal files? Read `.github/skills/game-content/SKILL.md`