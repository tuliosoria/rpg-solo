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
