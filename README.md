# Varginha: Terminal 1996

A text-based discovery puzzle game set in a Brazilian intelligence legacy terminal system, January 1996.

## The Game

You have illegally accessed a Brazilian intelligence legacy terminal to reconstruct the truth behind a classified incident before shutdown, corruption, or detection occurs.

**Genre:** Procedural Horror / Ufology / Hard Sci-Fi Cosmology

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

## Commands

- `help` - Display available commands
- `status` - Check system status
- `ls` - List directory contents
- `cd <dir>` - Change directory
- `open <file>` - Open and read a file (supports images and videos)
- `decrypt <file>` - Decrypt encrypted files
- `recover <file>` - Attempt file recovery (risky)
- `trace` - Trace system connections (risky)
- `override protocol` - Attempt security override (critical risk)
- `save` - Save current session

## Mechanics

- **Detection increases** with each action - the system is monitoring you
- **File integrity degrades** - corruption and data loss can occur
- **Truth emerges through inference** - cross-reference files to understand what happened
- **Five truths** must be discovered before the session ends

## Project Structure

```
app/
├── components/     # React UI components
│   ├── Menu.tsx
│   ├── Terminal.tsx
│   └── SaveModal.tsx
├── engine/         # Game logic
│   ├── commands.ts
│   ├── filesystem.ts
│   └── rng.ts
├── storage/        # Save/load utilities
├── data/           # Filesystem content
└── types/          # TypeScript definitions
```

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- CSS Modules
- Jest & React Testing Library (for testing)

## Features

### Video Playback
The game now supports video file playback! When you open certain files in the game, video content may be triggered:

- **Automatic playback**: Videos start playing automatically when triggered
- **CRT effect**: Videos are displayed with retro terminal aesthetics including scanlines and color grading
- **Interactive controls**: Use the video player controls or press ESC to close
- **Corruption effects**: Some videos may display with corruption overlays for dramatic effect

#### Adding Video Files
To add video content to your game files:

1. Place video files in the `public/videos/` directory
2. Add a `videoTrigger` property to your file definition in `app/data/filesystem.ts`:

```typescript
{
  type: 'file',
  name: 'surveillance_footage.dat',
  status: 'intact',
  content: ['Surveillance footage from...'],
  videoTrigger: {
    src: '/videos/surveillance.mp4',
    alt: 'Surveillance footage',
    corrupted: false // Set to true for corruption effects
  }
}
```

### Testing
The project includes comprehensive unit and integration tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### CI/CD
GitHub Actions workflow automatically validates:
- ✅ Unit and integration tests
- ✅ Build validation
- ✅ File structure validation
- ✅ Security audits

