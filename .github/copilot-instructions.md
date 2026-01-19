# Copilot Instructions (rpg-solo)

## Project overview
- This is a Next.js game with a terminal-style UI and narrative-driven content in `app/data/filesystem.ts`.
- Core gameplay logic lives in `app/engine/commands.ts` and `app/engine/filesystem.ts`.

## Conventions
- Keep narrative text in the same dry, bureaucratic tone as existing files.
- Prefer minimal, surgical edits and reuse existing helpers.
- Avoid adding new commands to help/autocomplete unless explicitly required.

## Tests
- Run `npm test` after logic changes.
- Keep Vitest patterns consistent with existing tests.
