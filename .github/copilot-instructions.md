# Copilot Instructions — Varginha: Terminal 1996

## Project Overview

**Varginha: Terminal 1996** is a text-based puzzle game set in a Brazilian intelligence terminal (Jan 1996). Players navigate a virtual filesystem, uncovering five hidden truths before system detection or corruption ends the session.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, CSS Modules, Tailwind CSS 4
- **Language:** TypeScript 5 (strict mode)
- **Testing:** Vitest, React Testing Library, jsdom
- **Linting/Formatting:** ESLint 9 (flat config), Prettier
- **Desktop:** Electron 40 (optional)
- **Build Tools:** PostCSS

## Key Directories & Files

- `app/` — Main app logic (Next.js)
  - `components/` — Terminal UI, overlays, chat, endings
  - `constants/` — Game balance, detection, timing
  - `data/` — Narrative content, virtual filesystem
  - `engine/` — Command parser, game logic, evidence system
  - `hooks/` — Custom React hooks
  - `storage/` — Save/load, statistics, localStorage
  - `types/` — TypeScript interfaces (GameState, FileNode, etc.)
- `electron/` — Desktop wrapper
- `public/` — Static assets (videos, images, sounds)
- `scripts/` — Story validation and analysis
- `.github/` — Copilot instructions, custom skills, CI workflows

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

## Conventions

- **Narrative:** Bureaucratic, clinical tone; use `═══`/`───` dividers, uppercase headers, `[REDACTED]` for missing info.
- **TypeScript:** Explicit types, `as const` for literals, prefix unused vars with `_`.
- **React:** Use CSS Modules, lazy-load heavy components, reuse hooks.
- **Game Files:** Add new files in `app/data/filesystem.ts` as `FileNode` objects; use `reveals` for truth discovery.
- **Testing:** Tests in `__tests__/` next to source, use Vitest globals.

## Reference

- `app/types/index.ts` — All interfaces
- `app/engine/commands.ts` — Command execution
- `app/data/filesystem.ts` — Narrative content
- `app/components/Terminal.tsx` — Main UI
- `app/constants/detection.ts` — Detection system

**Keep edits minimal and consistent with the established style. Run tests after logic changes.**