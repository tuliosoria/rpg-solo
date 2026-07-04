# Deploying rpg-solo to terminalufo.com on AWS Amplify — Design

**Status:** Approved — target is the **subdomain** `game.terminalufo.com` (owner decision, 2026-07-04). Proceeding to implementation plan.
**Date:** 2026-07-04
**Author:** Copilot (brainstorming session, owner unavailable — worked autonomously from repo evidence + live DNS)

## Goal

Publish the `rpg-solo` game (working title "Varginha: Terminal 1996") on the
owner's existing `terminalufo.com` site, hosted on AWS Amplify. The requested
URL is `terminalufo.com/game`.

## What the repo actually is (verified findings)

- **Static site.** `next.config.ts` sets `output: 'export'` → `next build`
  emits a fully static site into `./out`. No SSR, no server runtime, no API
  routes. This is the ideal shape for Amplify static hosting (or any CDN).
- **Config today:** `trailingSlash: true`, `images.unoptimized: true`, no
  `basePath`, no `assetPrefix`. Build injects git build info via env vars.
- **The same `out/` export feeds three targets:** the web build, the **Electron**
  desktop app, and the **Steam** build. Electron (`electron/main.js`) serves the
  export from the filesystem **root** via a tiny localhost server
  (`requestPath === '/' → out/index.html`). This is the key constraint: any
  change that assumes a `/game` path prefix must NOT leak into the
  Electron/Steam builds, which serve from root.
- **64 absolute asset references.** App code references public assets with
  root-absolute string paths — e.g. `'/audio/music/menu.mp3'`
  (`app/audio/menuMusic.ts`), `'/images/et.webp'`
  (`app/components/terminalConstants.ts`), `'/images/avatar/neutral.jpg'`
  (`app/components/HackerAvatar.tsx`), `'/audio/music/ending-game.mp3'`
  (`Victory.tsx`, `SecretEnding.tsx`), plus more in `useSound.ts`,
  `StaticNoise.tsx`, etc. Next.js `basePath` does **not** rewrite raw string
  paths like these — it only prefixes `next/link`, `next/image`, and framework
  `/_next/*` assets. Under a `/game` subpath these 64 refs would resolve to
  `terminalufo.com/audio/...` (the site root) and **404**.
- **Live hosting confirmed.** `terminalufo.com` resolves to a CloudFront
  distribution (`d1cuj0sblmfi6d.cloudfront.net`), which is how Amplify fronts
  apps. (CloudFront rejects Host-spoofed requests, so the current site's
  content/structure could not be inspected from this environment.)

## The core tension: subpath vs. subdomain

The requested `terminalufo.com/game` is a **subpath**. On this specific codebase,
a subpath deployment is meaningfully more work and more fragile than a
**subdomain** (`game.terminalufo.com`), because of the 64 absolute asset paths
and the shared-export Electron/Steam constraint.

| Concern | `terminalufo.com/game` (subpath) | `game.terminalufo.com` (subdomain) |
| --- | --- | --- |
| Next.js `basePath` needed | Yes — `basePath: '/game'` (must be conditional so Electron/Steam stay at root) | No — served at domain root, current config works as-is |
| 64 absolute asset paths | Must all be prefixed with the base path (via a helper + audit), or they 404 | No change — they resolve correctly at root |
| Amplify wiring | Path-routing to `/game` (same-app subfolder, or cross-app reverse-proxy rewrite) | Native Amplify subdomain on the managed domain — one setting |
| Coupling to existing site | High (subfolder in same app) or fragile (proxy rewrite) | None — fully independent app |
| Matches owner's stated URL | ✅ exactly | ❌ different URL |
| Est. repo effort | Medium–High (config + ~64 asset call-sites + audit + regression-test all 3 targets) | Very low (deploy `out/` unchanged) |

## Recommended approach

**Primary recommendation: subdomain — `game.terminalufo.com`, as its own Amplify app.**
It's dramatically less code churn (zero asset-path edits, no conditional
`basePath`, no risk to the Electron/Steam builds), it deploys the existing `out/`
export unchanged, and Amplify supports attaching a subdomain to an already-managed
domain natively. It also gives the game independent CI/CD without touching the
existing terminalufo app.

**If a true `/game` subpath is a hard requirement**, the cleanest way on Amplify
is **single-app, game-in-subfolder (Approach A below)**, accepting the required
repo changes. Avoid the cross-app reverse-proxy rewrite (Approach B) — Amplify
proxy rewrites to an external host are brittle for an asset-heavy SPA.

### Amplify infra options (for reference)

- **A. Single Amplify app, game published under `/game`.** The app that owns the
  domain builds both the existing site and the game, placing the game's `out/`
  into a `/game/` subfolder of the published root. True path, one distribution,
  no proxy. Requires the game build to be reachable from that app's build (same
  repo, submodule, or an artifact step).
- **B. Separate game app + reverse-proxy rewrite.** On the terminalufo app add a
  `200` rewrite `/game/<*>` → the game app's URL. Independent deploys, but
  proxying an asset-heavy Next export is fragile; still needs conditional
  `basePath: '/game'`. Not recommended.
- **C. Subdomain (the primary recommendation).** Separate game app, attach
  `game.terminalufo.com`. Root-served, no basePath, no asset edits.

## Required repo changes

### Both targets (small)

1. **Add an Amplify build spec** (`amplify.yml`) for the game app:
   - `preBuild`: `npm ci`
   - `build`: `npm run build`
   - `artifacts.baseDirectory: out`, `files: ['**/*']`
   - cache `node_modules` and `.next/cache`.
2. **SPA/deep-link routing:** the export uses `trailingSlash: true`, so routes
   are directory-style (`/foo/index.html`). Confirm Amplify serves
   `.../index.html` for directory requests and add a `404`→ fallback rewrite
   only if deep links break (single-page entry means this is likely a non-issue,
   but verify).

### Subpath target ONLY (`/game`) — additional, larger

3. **Conditional `basePath`/`assetPrefix`** in `next.config.ts`, driven by an env
   var so Electron/Steam are unaffected:
   ```ts
   const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
   // ...
   ...(basePath ? { basePath, assetPrefix: basePath } : {}),
   ```
   Amplify web build sets `NEXT_PUBLIC_BASE_PATH=/game`; Electron/Steam/dev leave
   it unset (current behavior preserved).
4. **Prefix the 64 absolute asset paths.** Introduce one helper,
   e.g. `app/lib/assetPath.ts`:
   ```ts
   export const assetPath = (p: string) =>
     `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${p}`;
   ```
   Route asset references through it. Most references already sit in a few
   chokepoint modules (`terminalConstants.ts`, `menuMusic.ts`, `useSound.ts`,
   `HackerAvatar.tsx`, ending components), which limits the true edit count below
   64, but a full audit is required — including any `/videos/*` references and
   any dynamically-constructed asset paths.
5. **Regression-test all three targets** after the asset/config change: web
   (under `/game`), Electron (`electron:dev`/build), and the static
   `npm run build` + `serve-static` path. Update tests that assert exact
   absolute asset strings (several `__tests__` files reference
   `/images/...`, `/audio/...`).

## Validation

- `npm run build` succeeds; `out/` present.
- Local: `npm start` (serve-static) serves the game; for the subpath variant,
  verify assets load when the app is served under a `/game/` prefix.
- Electron still launches and loads assets from root (no `/game` leakage).
- Existing suite green: `npm test`, `npm run typecheck`, `npm run lint`.
- Post-deploy: `terminalufo.com/game` (or `game.terminalufo.com`) loads, audio +
  images play, deep links resolve, and the existing terminalufo site is
  unaffected.

## Open Decisions (resolved)

1. **URL shape — RESOLVED:** the target is **`game.terminalufo.com`** (subdomain).
   The subpath (`/game`) `basePath` + 64-asset-path work is therefore **out of
   scope**; the existing `out/` export deploys unchanged.
2. **Existing terminalufo app — reduced to an ops detail:** the game gets its own
   Amplify app regardless. The only remaining unknown is where DNS for
   `terminalufo.com` is managed:
   - If the domain is **managed in this AWS account's Amplify/Route 53**, attach
     `game.terminalufo.com` to the new app via Amplify domain management (Amplify
     provisions the ACM cert automatically).
   - If DNS is managed **at an external registrar/provider**, add the CNAME
     record Amplify supplies for the subdomain (plus the ACM validation CNAME).
   This is a console/DNS step for the owner; it does not change repo work.

## Out of scope

- Game content, mechanics, or narrative changes.
- Electron/Steam packaging changes beyond keeping them working (no regressions).
- CI provider changes beyond adding the Amplify build spec.
