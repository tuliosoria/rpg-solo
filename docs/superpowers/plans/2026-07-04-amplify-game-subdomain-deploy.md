# game.terminalufo.com Amplify Deployment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the existing static-export build of `rpg-solo` to a new AWS Amplify app served at `game.terminalufo.com`, with a repo-committed build spec and a deployment runbook.

**Architecture:** `rpg-solo` already builds to a fully static site (`output: 'export'` → `./out`). We add an Amplify build spec (`amplify.yml`) and a Node version pin so Amplify reproduces that build, publish `out/` as a standalone Amplify app, and attach the `game.terminalufo.com` subdomain. Because the app is served at the domain **root**, no `basePath` or asset-path changes are needed — the existing export deploys unchanged. Electron/Steam builds are untouched.

**Tech Stack:** Next.js 15 static export, AWS Amplify Hosting (Gen 1 static), Node 20, ACM/CloudFront (managed by Amplify).

**Spec:** `docs/superpowers/specs/2026-07-04-amplify-game-deployment-design.md`

---

## File Structure

- **Create `.nvmrc`** — pins the build Node version to 20 (repo `engines` requires `^20.19.0 || >=22.12.0`; Amplify's default image is older). Amplify's `nvm use` reads this.
- **Create `amplify.yml`** — Amplify Gen 1 frontend build spec: install deps, run `npm run build`, publish `out/`, cache deps. Root location so Amplify auto-detects it.
- **Create `DEPLOYMENT.md`** — human runbook for the AWS-console steps that cannot be scripted from the repo (create app, connect repo, attach subdomain, DNS/ACM) plus a post-deploy verification checklist.

No application code changes. `out/` stays gitignored (we deploy the build artifact, not commit it).

---

## Notes for the implementer (read once)

- **This is a config + docs + ops-runbook plan, not an app-logic feature**, so verification is "the build produces a correct `out/` and serves correctly at root," not unit tests. Steps below give exact commands and expected output.
- **The AWS-console/DNS steps require AWS account access and cannot be run from this repo.** Tasks 1–4 are fully doable in-repo and produce the deployable artifacts. Task 5 is an owner-executed runbook (documented, checklisted) — do not fabricate AWS CLI calls or credentials.
- **Do not** add a `basePath`, touch `next.config.ts`, or modify any `/audio`/`/images` asset paths — those are only needed for a `/game` subpath, which is out of scope (owner chose the subdomain).
- **Known non-blocking caveat:** `next.config.ts` derives `NEXT_PUBLIC_BUILD_NUMBER` from `git rev-list --count HEAD`. On Amplify's shallow clone this count may differ from local; the code has a try/catch fallback, so the build never fails. No action needed.

---

### Task 1: Pin the build Node version

**Files:**
- Create: `/Users/jessicarosa/rpg-solo/.nvmrc`

- [ ] **Step 1: Create `.nvmrc`**

File `.nvmrc` (exact contents, single line):

```
20
```

- [ ] **Step 2: Verify it satisfies `engines`**

Visually confirm `package.json` `engines.node` is `^20.19.0 || >=22.12.0`; Node 20 (specifically ≥20.19.0, which `nvm use 20` installs as the latest 20.x) satisfies it.
Run: `node -e "console.log(require('./package.json').engines.node)"`
Expected: prints `^20.19.0 || >=22.12.0`.

- [ ] **Step 3: Commit**

```bash
git add .nvmrc
git commit -m "build: pin Node 20 for Amplify build

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Add the Amplify build spec

**Files:**
- Create: `/Users/jessicarosa/rpg-solo/amplify.yml`

- [ ] **Step 1: Create `amplify.yml`**

File `amplify.yml` (exact contents):

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm use 20 || nvm install 20
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    # Next.js static export output (next.config.ts: output: 'export')
    baseDirectory: out
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

- [ ] **Step 2: Validate the YAML parses**

Run: `python3 -c "import yaml; yaml.safe_load(open('amplify.yml')); print('amplify.yml OK')"`
Expected: `amplify.yml OK`

- [ ] **Step 3: Commit**

```bash
git add amplify.yml
git commit -m "build: add AWS Amplify build spec publishing static export

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Verify the build artifact locally (grounds the deploy)

This reproduces what Amplify will do and proves the export serves correctly at **root** (exactly how the subdomain serves it).

**Files:** none (verification only)

- [ ] **Step 1: Clean build**

Run: `npm ci && npm run build`
Expected: build completes; no errors. `out/` is produced.

- [ ] **Step 2: Assert the entry and assets exist in `out/`**

Run:
```bash
test -f out/index.html && echo "index OK"
test -f out/audio/music/menu.mp3 && echo "audio OK"
ls out/images/*.webp >/dev/null 2>&1 && echo "images OK"
```
Expected: `index OK`, `audio OK`, `images OK` all print. (These are the absolute-path assets the app requests at root — confirming they ship in the export.)

- [ ] **Step 3: Smoke-test root serving**

Run (in one line so the server is cleaned up):
```bash
node scripts/serve-static.mjs --port 4599 & SRV=$!; sleep 2; \
curl -s -o /dev/null -w "root %{http_code}\n" http://127.0.0.1:4599/; \
curl -s -o /dev/null -w "asset %{http_code}\n" http://127.0.0.1:4599/audio/music/menu.mp3; \
kill $SRV
```
Expected: `root 200` and `asset 200`. This confirms the game and its root-absolute assets load without any basePath — i.e. it will work at `https://game.terminalufo.com/`.

- [ ] **Step 4: (No commit)** — verification only; `out/` is gitignored.

---

### Task 4: Write the deployment runbook

**Files:**
- Create: `/Users/jessicarosa/rpg-solo/DEPLOYMENT.md`

- [ ] **Step 1: Create `DEPLOYMENT.md`**

File `DEPLOYMENT.md` (exact contents):

```markdown
# Deploying the game to game.terminalufo.com (AWS Amplify)

The game is a static Next.js export (`output: 'export'` → `./out`). It is
deployed as its own AWS Amplify app served at the subdomain
`game.terminalufo.com`. Served at the domain root, so no `basePath` or asset
changes are required — the export deploys as-is.

Build is driven by the repo-committed `amplify.yml` and Node is pinned by
`.nvmrc` (Node 20).

## One-time setup (AWS Console)

1. **Create the Amplify app**
   - Amplify Console → *Create new app* → *Host web app*.
   - Connect the Git provider and select this repository and the `main` branch.
   - Amplify auto-detects `amplify.yml`. Confirm the build settings show
     `baseDirectory: out`. Do **not** enable server-side rendering / "Web
     Compute" — this is a static site.
   - Confirm the build image uses Node 20 (it will via `.nvmrc` + the
     `nvm use 20` preBuild step). If the default image is older, no action is
     needed — `nvm use 20 || nvm install 20` handles it.
   - Save and deploy. Wait for the build to go green.

2. **Verify the default Amplify URL**
   - Open the `https://main.<app-id>.amplifyapp.com` URL Amplify assigns.
   - Confirm the game loads, audio/images play, and there are no 404s in the
     browser network tab.

3. **Attach the subdomain `game.terminalufo.com`**
   - Amplify Console → the app → *Hosting* → *Custom domains* → *Add domain*.
   - Enter `terminalufo.com` and add a **subdomain** mapping:
     `game` → this app's `main` branch. (Do not remap the apex/root — the
     existing terminalufo site keeps `terminalufo.com`.)
   - **If `terminalufo.com` is managed in this AWS account (Route 53 / Amplify
     domain):** Amplify provisions the ACM certificate and DNS records
     automatically. Approve and wait for the domain status to reach
     *Available*.
   - **If DNS is managed at an external registrar/provider:** Amplify shows one
     or more CNAME records (the `game` subdomain CNAME + an ACM validation
     CNAME). Add them at the DNS provider exactly as shown, then wait for
     validation.

4. **Verify the live subdomain**
   - Open `https://game.terminalufo.com/`.
   - Confirm: HTTPS valid, game loads, audio + images play, deep refresh on the
     root works, and `https://terminalufo.com` (the existing site) is
     unaffected.

## Ongoing deploys

- Amplify auto-builds on every push to `main` using `amplify.yml`. No manual
  step. Roll back from the Amplify Console if a build regresses.

## Notes

- The apex `terminalufo.com` and this game app are independent Amplify apps;
  attaching only the `game` subdomain does not touch the existing site.
- Electron and Steam builds are unaffected by this deployment — they consume the
  same `out/` export from the filesystem root and require no config changes.
```

- [ ] **Step 2: Commit**

```bash
git add DEPLOYMENT.md
git commit -m "docs: add game.terminalufo.com Amplify deployment runbook

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Execute the deployment (owner, AWS Console)

**Files:** none (operational — performed in the AWS Console per `DEPLOYMENT.md`)

This task requires AWS account access and cannot be run from the repo. Follow
`DEPLOYMENT.md`:

- [ ] Create the Amplify app, connect this repo + `main`, confirm `amplify.yml`
  detected with `baseDirectory: out`, deploy, and confirm a green build.
- [ ] Verify the game on the default `*.amplifyapp.com` URL (loads, no 404s).
- [ ] Add the custom domain `terminalufo.com` with subdomain mapping
  `game → main`; complete ACM/DNS validation (Route 53 auto, or external CNAMEs).
- [ ] Verify `https://game.terminalufo.com/` (HTTPS, game loads, assets play)
  and that `https://terminalufo.com` is unchanged.

---

## Self-Review

**Spec coverage:**
- Static-export deploy on Amplify → Tasks 2, 3, 5. ✓
- Subdomain `game.terminalufo.com`, root-served, no basePath/asset work → enforced by "Notes for the implementer" + Task 4 runbook. ✓
- `amplify.yml` build spec (npm ci, npm run build, baseDirectory out, cache) → Task 2. ✓
- Node version constraint (`engines`) → Task 1 (`.nvmrc`) + preBuild `nvm use`. ✓
- SPA/deep-link + `trailingSlash` behavior → single-route app; root-serve verified in Task 3 Step 3; runbook Step 4 checks refresh. No custom rewrite needed (documented). ✓
- DNS/ACM ops (Route 53 vs external) → Task 4 runbook + Task 5. ✓
- Existing site unaffected / Electron-Steam untouched → "Notes" + runbook Notes. ✓

**Placeholder scan:** No TBD/TODO; all files have exact contents; all commands have expected output. ✓

**Type/name consistency:** `amplify.yml` `baseDirectory: out` matches `next.config.ts` `output: 'export'` (emits `./out`) and `.nvmrc` `20` matches the `nvm use 20` preBuild command. ✓
