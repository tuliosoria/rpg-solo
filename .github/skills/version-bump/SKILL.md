---
name: version-bump
description: Guidance for the repo's current git-derived build/version display.
---

## Current Versioning Scheme

This repo no longer uses a hard-coded `DEPLOY_VERSION` in `Terminal.tsx`.

- `next.config.ts` computes git metadata at build time.
- It injects `NEXT_PUBLIC_BUILD_NUMBER` and `NEXT_PUBLIC_COMMIT_SHA`.
- `app/components/terminalConstants.ts` derives:
  - `BUILD_NUMBER`
  - `COMMIT_SHA`
  - `DEPLOY_VERSION`
  - `VERSION_TOOLTIP`

## What To Do When Asked for a “Version Bump”

### Default answer
Do **not** edit `Terminal.tsx` looking for a constant that no longer exists.

### Usual cases
1. **User wants the displayed build/version to reflect newer code**
   - No source edit is normally required.
   - A new commit/build changes the git-derived metadata automatically.

2. **User wants to change the display format**
   - Edit `app/components/terminalConstants.ts`, not `Terminal.tsx`.
   - Keep the fallback behavior (`dev-local` / `local build`) intact unless explicitly changing local-dev semantics.

3. **User wants to debug missing version info**
   - Check `next.config.ts` first.
   - Then verify `terminalConstants.ts` uses the injected env vars correctly.
   - Expect local builds without git metadata to fall back gracefully.

## Safe Validation
- Use `npm run build` when you change version-formatting logic or build-time metadata handling.
- Keep changes localized to version derivation unless the user explicitly asks for a broader release workflow change.
