# Copilot Instructions — Varginha: Terminal 1996

## Project Overview

**Varginha: Terminal 1996** is a text-based discovery puzzle game set in a Brazilian intelligence legacy terminal system, January 1996. Players have illegally accessed the terminal to reconstruct the truth behind a classified incident (the [Varginha UFO incident](https://en.wikipedia.org/wiki/Varginha_UFO_incident)) before shutdown, corruption, or detection occurs.

**Genre:** Procedural Horror / Ufology / Hard Sci-Fi Cosmology

### Core Gameplay Loop
- Navigate a virtual filesystem using terminal commands (`ls`, `cd`, `open`, `decrypt`)
- Discover 5 truth categories by reading and cross-referencing classified files
- Manage detection level — the system is watching, and too many risky actions trigger game over
- Reach the ICQ chat phase to exfiltrate evidence before the session ends

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + CSS Modules |
| Language | TypeScript 5 (strict mode) |
| Testing | Vitest + React Testing Library + jsdom |
| Linting | ESLint 9 (flat config) + Prettier |
| Desktop | Electron 40 (optional build target) |
| Styling | Tailwind CSS 4 (via PostCSS) |

---

## Directory Structure

```
rpg-solo/
├── app/                    # Next.js App Router root
│   ├── components/         # React UI components (Terminal, overlays, menus)
│   │   ├── Terminal.tsx    # Main game terminal - input handling, rendering
│   │   ├── ICQChat.tsx     # Endgame chat interface
│   │   ├── *Ending.tsx     # Various ending screens (Victory, BadEnding, etc.)
│   │   └── FloatingUI/     # Draggable UI elements
│   ├── constants/          # Game balance constants
│   │   ├── detection.ts    # Detection thresholds & increases
│   │   ├── gameplay.ts     # Core gameplay values
│   │   ├── timing.ts       # Animation & delay timings
│   │   └── turing.ts       # Turing test questions
│   ├── data/               # Game content (NARRATIVE LIVES HERE)
│   │   ├── filesystem.ts   # Virtual filesystem tree & file contents
│   │   └── narrativeContent.ts
│   ├── engine/             # Core game logic (BUSINESS LOGIC)
│   │   ├── commands.ts     # Command parser & execution (262KB!)
│   │   ├── commands/       # Modularized command helpers
│   │   │   ├── utils.ts    # Entry creation, parsing, delays
│   │   │   └── tutorial.ts # Tutorial messages & tips
│   │   ├── filesystem.ts   # Path resolution, node access, listing
│   │   ├── evidenceRevelation.ts  # Evidence discovery system
│   │   ├── achievements.ts # Achievement definitions & tracking
│   │   └── rng.ts          # Seeded random number generator
│   ├── hooks/              # Custom React hooks
│   │   ├── useSound.ts     # Sound effect playback
│   │   └── useAutocomplete.ts
│   ├── storage/            # Persistence layer
│   │   ├── saves.ts        # Save/load game state
│   │   ├── statistics.ts   # Playtime, command counts
│   │   └── safeStorage.ts  # localStorage wrapper
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # GameState, FileNode, CommandResult, etc.
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Entry point
├── electron/               # Electron desktop wrapper
├── public/                 # Static assets (videos, images, sounds)
├── scripts/                # Validation & analysis scripts
└── .github/
    ├── copilot-instructions.md  # THIS FILE
    ├── skills/             # Custom Copilot skills
    └── workflows/          # GitHub Actions CI
```

---

## Key Files to Understand

| File | Purpose |
|------|---------|
| `app/types/index.ts` | All TypeScript interfaces — `GameState`, `FileNode`, `CommandResult`, `TruthCategory` |
| `app/engine/commands.ts` | Command execution engine — parses input, modifies state, returns results |
| `app/engine/filesystem.ts` | Virtual filesystem — path resolution, access control, directory listing |
| `app/data/filesystem.ts` | **Narrative content** — all file contents, directory structure, reveals |
| `app/components/Terminal.tsx` | Main UI — input handling, history, streaming output, overlays |
| `app/constants/detection.ts` | Game balance — detection thresholds, increase/decrease values |

---

## Game Mechanics

### GameState (simplified)
```typescript
interface GameState {
  currentPath: string;           // Current directory
  detectionLevel: number;        // 0-100, game over at certain thresholds
  accessLevel: number;           // 0-5, unlocks restricted files
  truthsDiscovered: Set<string>; // 5 truths needed to win
  filesRead: Set<string>;        // Track opened files
  flags: Record<string, boolean>; // Progression flags
  // ... many more properties
}
```

### Truth Categories (Victory Conditions)
Players must discover evidence for 5 truths:
1. `debris_relocation` — Spacecraft debris were split and relocated
2. `being_containment` — Non-human beings were contained and transferred
3. `telepathic_scouts` — Beings communicated telepathically
4. `international_actors` — International actors were involved beyond Brazil
5. `transition_2026` — A future transition window converges on 2026

### Detection System
- Detection increases with risky actions (opening files, decrypting, overrides)
- Detection thresholds trigger visual effects and warnings
- At critical levels, game over approaches
- Players can use `wait` or `hide` commands to reduce detection

---

## Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm test             # Run Vitest tests
npm run test:watch   # Watch mode for tests
npm run test:coverage # Generate coverage report
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run format:check # Prettier check
npm run validate-story # Validate story consistency
```

---

## Coding Conventions

### Narrative Writing
- **Tone:** Dry, bureaucratic, clinical — like declassified government documents
- **Style:** Use `═══` and `───` dividers, uppercase section headers
- **Redactions:** Use `[REDACTED]`, `[DATA LOSS]`, `[CORRUPTED]` for missing info
- **Example:**
  ```
  ═══════════════════════════════════════════════════════════
  MEMORANDUM — INTERNAL DISTRIBUTION ONLY
  CLASSIFICATION: RESTRICTED
  ═══════════════════════════════════════════════════════════
  ```

### TypeScript
- Prefer explicit types for function parameters and return values
- Use `const` assertions for literal arrays: `as const`
- Unused variables: prefix with `_` (e.g., `_unusedParam`)

### React Components
- Use CSS Modules (`*.module.css`) for styling
- Lazy-load heavy components with `dynamic()` from `next/dynamic`
- Use hooks from `app/hooks/` for shared behavior

### Code Changes
- **Minimal, surgical edits** — change as few lines as possible
- Reuse existing helpers from `app/engine/commands/utils.ts`
- Avoid adding new commands to `help` or autocomplete unless explicitly required

### File Structure Patterns
- FileNode content is an array of strings (lines)
- Files can have `reveals: ['truth_category']` to contribute to discoveries
- Files can have `imageTrigger` or `videoTrigger` for media
- Files use `status: 'encrypted' | 'restricted' | 'intact' | 'unstable'`

---

## Testing

### Test Patterns
- Tests live in `__tests__/` directories next to source files
- Use Vitest globals (`describe`, `it`, `expect`)
- Mock localStorage with `vi.stubGlobal()`
- Test file naming: `*.test.ts` or `*.test.tsx`

### Running Tests
```bash
npm test                    # Single run
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage
```

### Key Test Files
- `app/engine/__tests__/commands-utils.test.ts` — Command parsing
- `app/engine/__tests__/filesystem.test.ts` — Path resolution
- `app/engine/__tests__/evidenceRevelation.test.ts` — Evidence system
- `app/engine/__tests__/story-consistency.test.ts` — Narrative validation

---

## Game Context (For Content Understanding)

### Historical Background
The game is set around the real **Varginha UFO incident** of January 1996, when alleged alien creatures were reportedly sighted and captured in Varginha, Brazil. The game presents a fictional classified intelligence archive about this event.

### Setting
- **Time:** January 1996
- **Location:** Brazilian intelligence terminal system
- **Player Role:** Unauthorized hacker accessing classified files
- **Antagonist:** The system itself — monitoring, corrupting, detecting

### Narrative Elements
- **UFO74:** A mysterious hacker ally who provides guidance via terminal messages
- **Prisoner 45:** A detained source who can be questioned (limited uses)
- **ICQ Phase:** Endgame where player must convince a teenager to exfiltrate files
- **Multiple Endings:** Bad, Neutral, Good, and Secret endings based on player choices

### Aesthetic
- CRT terminal effects (scanlines, flicker, glow)
- Green-on-black or amber text
- ASCII art and box-drawing characters
- Paranoia messages and system hostility

---

## Common Tasks

### Adding a New File to the Filesystem
1. Edit `app/data/filesystem.ts`
2. Create a `FileNode` object with content array
3. Add to appropriate directory's `children`
4. If file reveals a truth, add `reveals: ['truth_category']`

### Adding a New Command
1. Add handler in `app/engine/commands.ts`
2. Update `executeCommand()` switch statement
3. Return `CommandResult` with output and state changes
4. Add tests in `app/engine/__tests__/`

### Adjusting Game Balance
1. Edit constants in `app/constants/detection.ts` or `gameplay.ts`
2. Detection increases/decreases are in `DETECTION_INCREASES` and `DETECTION_DECREASES`
3. Thresholds for visual effects in `DETECTION_THRESHOLDS`

---

## Custom Skills Available

The project includes specialized Copilot skills in `.github/skills/`:
- **game-content:** Guidance for adding narrative content and files
- **game-design:** Best practices for mechanics and player experience
- **testing:** Guidance for running and updating tests

---

## Don't Forget

- ✅ Run `npm test` after logic changes
- ✅ Keep narrative tone consistent (bureaucratic, clinical)
- ✅ Prefer minimal edits over large refactors
- ✅ Reuse existing helpers from `commands/utils.ts`
- ✅ Check detection balance when adding risky actions
