# Terminal 1996

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

Navigate the classified archive:

| Command | Description |
|---------|-------------|
| `ls` | List directory contents |
| `cd <dir>` | Change directory |
| `open <file>` | Read a file |
| `decrypt <file>` | Decrypt classified documents |
| `search <keyword>` | Search the file index (32 tag categories) |
| `rewind` | Enter archive state — view deleted files (4 actions) |
| `leak` | Interrogate the Elusive Man (5 questions only) |
| `checkpoint` | Save current session |
| `load` | Restore a saved session |
| `help` | Display command reference |

## Getting Started

```bash
npm install
npm run dev
```

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

- **Next.js 14** + TypeScript
- **React 18** with CSS Modules
- **Electron** for desktop builds
- **Steam SDK** integration
- **1034+ tests** — Jest & React Testing Library

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
