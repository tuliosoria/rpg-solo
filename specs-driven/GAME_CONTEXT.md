# GAME CONTEXT — Varginha: Terminal 1996

> Every agent reads this document first.

## Identity

- **Title:** Varginha: Terminal 1996
- **Genre:** Procedural Horror / Ufology / Hard Sci-Fi
- **Mood:** Cold bureaucratic dread. 1990s government terminal. Something is watching.
- **Platform:** Web (Next.js static export), Desktop (Electron — Windows, macOS, Linux), Steam
- **Tech Stack:** Next.js 15, React 19, TypeScript 5.9, Tailwind 4, CSS Modules, Electron 40, Vitest, Playwright, Steam SDK (steamworks.js)

## Premise

January 20, 1996. Varginha, Minas Gerais, Brazil. You are **HackerKid**, a teenager who has broken into a classified Brazilian military terminal. A ghost in the system — **UFO74** — guides you through restricted directories containing files about the Varginha UFO incident. You must read files, save evidence to a dossier, and leak it to the world before the system detects you and shuts you out. Every command you type increases your risk. The terminal is watching.

## Win Condition

Save 10 evidence files to the dossier, complete the 3-step leak preparation sequence, and transmit. The specific combination of files you save determines which of 12 endings fires.

## Lose Conditions

1. **Detection reaches 100%** — system locks you out
2. **8 wrong attempts** — invalid command threshold exceeded
3. **Override lockdown** — 3 failed override password attempts
4. **Turing test failure** — system identifies you as human (3 wrong answers)
5. **Firewall tree scan** — running `tree` on elevated session at high detection
6. **Trace window expiry** — time runs out during active trace
7. **Session doom countdown** — triggered by forbidden knowledge, 8 operations until purge

## Core Mechanics Summary

| System | Description |
|--------|-------------|
| **Terminal Commands** | Player types Unix-like commands: `ls`, `cd`, `open`, `save`, `search`, `leak`, `chat`, etc. |
| **Risk System** | Detection level 0–100%. Actions cost risk. Thresholds trigger events (Turing test at 50%, static at 70%, alien silhouette at 70%+). |
| **Save System** | `save <filename>` adds a read file to the dossier. Max 10 files. File combination determines ending. |
| **Leak System** | At 5+ saved files, `leak` starts a 3-command encrypted preparation sequence. At 10 files + complete sequence, `leak` transmits (victory). |
| **Override System** | `override protocol COLHEITA` unlocks admin-level access. Password obtained through `chat` with PRISONER_45. 3 failed attempts = lockdown. |
| **Turing Test** | Triggers at 50% detection. Player must identify the machine response in 3 questions. Failure = game over. |
| **Firewall** | Activates at 25% detection. Provides audio taunts. Can be disarmed via neural link. |
| **Wait** | 3 uses per run. Reduces detection by 5–8 points. 5-second cooldown. |

## Languages

Three supported languages: **English** (default), **Portuguese BR**, **Spanish**.

- Command words translate: `help` → `ajuda` (PT) / `ayuda` (ES)
- Technical acronyms stay English: `ls`, `cd`, `tree`, `link`, `grep`
- Filenames and extensions stay English
- Codenames stay English: ALPHA, UFO74, HackerKid, COLHEITA, Protocol SOMBRA
- Tone: PT-BR uses formal 1990s Brazilian military register. ES uses formal Latin American Spanish.

See [LANGUAGES.md](./LANGUAGES.md) for full translation reference.

## Related Documents

| Document | Purpose |
|----------|---------|
| [NARRATIVE.md](./NARRATIVE.md) | Full story arc, tone guide, character voices |
| [FILES_REGISTRY.md](./FILES_REGISTRY.md) | Every in-game file with content and metadata |
| [CHARACTERS.md](./CHARACTERS.md) | Character reference with dialogue examples |
| [MECHANICS.md](./MECHANICS.md) | Every command and system in detail |
| [ENDINGS.md](./ENDINGS.md) | All 12 endings with trigger conditions |
| [LANGUAGES.md](./LANGUAGES.md) | Translation rules and language architecture |
| [AUDIO_VIDEO.md](./AUDIO_VIDEO.md) | Audio, video, and visual effect references |

## Skills

| Skill | Use When |
|-------|----------|
| [SKILL_NARRATIVE.md](./skills/SKILL_NARRATIVE.md) | Writing or editing any in-game text |
| [SKILL_FILES.md](./skills/SKILL_FILES.md) | Creating, editing, or deleting in-game files |
| [SKILL_TRANSLATION.md](./skills/SKILL_TRANSLATION.md) | Any string is created or changed |
| [SKILL_BUGS.md](./skills/SKILL_BUGS.md) | Investigating or fixing any bug |
| [SKILL_ENDINGS.md](./skills/SKILL_ENDINGS.md) | Working on endings or dossier logic |
| [SKILL_AUDIO_VIDEO.md](./skills/SKILL_AUDIO_VIDEO.md) | Adding or editing audio/video triggers |

## Version History

| Change | Description |
|--------|-------------|
| Initial build | Terminal engine, VFS, 12 endings, risk system, Turing test |
| Override system | Override protocol with COLHEITA password, 3-attempt lockdown |
| Neural link | Scout communication via `.psi` files, link disarm for Firewall |
| Interactive tutorial | Gated command learning with UFO74 guidance |
| Full i18n | Three-language support with runtime translation engine (25K+ lines) |
| Steam integration | Achievements, cloud saves, rich presence |
| Video system | 9 evidence-triggered videos + 2 story videos |
| Music system | 3-tier risk-based soundtrack + ending music |
| Firewall audio | 8 synthesized voice taunts |
