# Varginha: Terminal 1996

> *January 20, 1996. Varginha, Brazil. Something fell from the sky.*

A terminal-based discovery puzzle game. You've illegally accessed a Brazilian intelligence legacy system. Reconstruct the truth before shutdown, corruption, or detection.

**[▶ PLAY NOW](https://thankful-grass-0f49be40f.2.azurestaticapps.net)**

---

## The Incident

Three days ago, Brazilian Air Defense tracked an unidentified object descending over Minas Gerais. Official reports claim nothing happened. The files tell a different story.

**Genre:** Procedural Horror / Ufology / Hard Sci-Fi

## Features

- 🖥️ **Retro CRT aesthetic** — Authentic terminal experience with scanlines and phosphor glow
- 👁️ **Detection system** — Every action risks exposure. Get caught and it's over.
- 🔀 **Multiple endings** — Your choices determine what truth you uncover
- 🎵 **Atmospheric soundtrack** — 4 ambient tracks that respond to tension
- 💾 **Save system** — Checkpoint your progress, load when needed
- 🎮 **Steam integration** — Achievements, cloud saves, rich presence

## Commands

Common terminal commands in the current build:

| Command | Description |
|---------|-------------|
| `ls` | List directory contents |
| `cd <dir>` | Change directory |
| `open <file>` | Read a file |
| `search <keyword>` | Search accessible file names, paths, and document text |
| `progress` | Review your evidence total and session recap |
| `unread` | List accessible files you have not opened yet |
| `bookmark <file>` | Save a file path for quick reference |
| `hint` | Ask UFO74 for a nudge at a cost |
| `wait` | Lower heat and let the system settle |
| `leak` | Transmit your evidence dossier to external channels |
| `chat <message>` | Ask the system or PRISONER_45 questions (limited exchange) |
| `help` | Display command reference |

Legacy builds mentioned `decrypt` and `rewind` as core mechanics; the live experience now centers on direct investigation and cross-referencing files instead.

## Getting Started

```bash
npm install
npm run dev
```

**Node.js:** `^20.19.0 || >=22.12.0`

Open [http://localhost:3000](http://localhost:3000) to play locally.

## Desktop App

Available for Windows, macOS, and Linux via Electron:

```bash
npm run electron:build
```

Features system tray integration and native notifications.

## Project Structure

```
app/
├── components/     # React UI components
├── engine/         # Game logic & command processing
├── storage/        # Save/load system
├── data/           # Filesystem & narrative content
└── types/          # TypeScript definitions
```

## Tech Stack

- **Next.js 15** + TypeScript 5
- **React 19** with CSS Modules and Tailwind CSS 4
- **Electron** for desktop builds
- **Steam SDK** integration
- **Vitest** + React Testing Library

## CI/CD

GitHub Actions validates every commit:
- ✅ Unit & integration tests
- ✅ Build validation (web, desktop, Steam)
- ✅ Security audits

## Builds

| Platform | Status |
|----------|--------|
| Web | Azure Static Apps |
| Desktop | Windows, macOS, Linux |
| Steam | Windows, macOS, Linux |

---

*The truth is in the terminal. Access granted.*
