# Deploying the game to game.terminalufo.com

The game is a static Next.js export (`output: 'export'` → `./out`). Served at
the domain root, so no `basePath` or asset changes are required — the export
deploys as-is. Electron/Steam builds consume the same `out/` from the filesystem
root and are unaffected by any web hosting choice below.

`terminalufo.com` DNS is hosted in **AWS Route 53** (name servers `awsdns-*`),
so any subdomain record for `game` is added in the existing `terminalufo.com`
hosted zone. Do **not** create a separate `game.terminalufo.com` hosted zone —
without an `NS` delegation from the parent it routes nothing and actively
*breaks* Amplify's ACM validation (see Troubleshooting). If one was created,
delete it.

## Architecture: two hosts, two responsibilities

The project intentionally keeps **both** hosting setups:

| Host | Serves | DNS |
| --- | --- | --- |
| **AWS Amplify** | the main site — `terminalufo.com` / `www.terminalufo.com` | CloudFront (`d1cuj0sblmfi6d.cloudfront.net`) |
| **Azure Static Web Apps** | the **game** — `game.terminalufo.com` | one CNAME → `<name>.azurestaticapps.net` |

A single subdomain can only point at one host, so `game.terminalufo.com` is
served by **Azure** (its CI/CD deploy is already green), while Amplify keeps the
main domain. Do not also attach `game.terminalufo.com` to Amplify — that creates
a two-hosts-one-name conflict and is what left the Amplify SSL stuck.

## Game host: Azure Static Web Apps (existing pipeline)

The repo already ships a working Azure Static Web Apps CI/CD pipeline
(`.github/workflows/azure-static-web-apps.yml`): every push to `main` runs
`npm run build` and deploys `out/` to the Static Web App via the
`AZURE_STATIC_WEB_APPS_API_TOKEN` secret. The README lists Azure Static Apps as
the project's web host. This is the path of least resistance for
`game.terminalufo.com` — a single CNAME, no reverse proxy, no `basePath`.

1. **Confirm the app is deploying**
   - GitHub → *Actions* → *Azure Static Web Apps CI/CD* → latest run on `main`
     is green. (Prereq: the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret is set and
     an Azure Static Web App resource exists. If not, create a Static Web App in
     the Azure Portal, choose "Other"/skip build details, and paste its
     deployment token into the repo secret — then re-run the workflow.)
   - Note the app's default hostname, e.g. `<name>.azurestaticapps.net`, and
     confirm the game loads there (audio/images play, no 404s).

2. **Add the custom subdomain in Azure**
   - Azure Portal → the Static Web App → *Custom domains* → *Add* →
     *Custom domain on other DNS*.
   - Enter `game.terminalufo.com`. Azure shows a **CNAME** target
     (`<name>.azurestaticapps.net`) and validates via that CNAME.

3. **Add the CNAME in Route 53**
   - Route 53 → `terminalufo.com` hosted zone → *Create record*.
   - Record name: `game`  ·  Type: `CNAME`  ·  Value:
     `<name>.azurestaticapps.net`  ·  TTL: 300.
   - Save. Back in Azure, complete/validate the custom domain; Azure
     auto-provisions the managed TLS certificate once the CNAME resolves.

4. **Verify the live subdomain**
   - Open `https://game.terminalufo.com/`.
   - Confirm: valid HTTPS, game loads, audio + images play, refresh works, and
     `https://terminalufo.com` (the existing site) is unaffected.

**Ongoing deploys:** automatic on every push to `main` via the GitHub Actions
workflow. No manual step.

## Main site: AWS Amplify (terminalufo.com / www)

Amplify serves the existing main site at the apex and `www`. Repo config for an
Amplify-hosted build is present (`amplify.yml`, `.nvmrc`) if you ever want to run
the game on Amplify too, but the **game subdomain is on Azure** (above) — do not
attach `game.terminalufo.com` to Amplify as well.

### Troubleshooting: Amplify domain activation stuck on "Creating records…"

Symptom: adding a custom domain in Amplify hangs at *Domain activation →
"Creating records associated with your domain… This step should only take a few
minutes"* (SSL creation/configuration never completes).

Diagnosed root cause for `game.terminalufo.com` (verified via DNS):

- The authoritative `terminalufo.com` zone returns **NXDOMAIN** for
  `game.terminalufo.com` — the ACM validation record
  (`_<hash>.game.terminalufo.com → …acm-validations.aws`) is **not** in the real
  zone, so ACM can never validate and the flow spins until it times out.
- **No CAA records** exist on the zone, so CAA is *not* the blocker (ruled out).
- A **stray standalone `game.terminalufo.com` hosted zone** was created. It has
  **no `NS` delegation** from the parent (`dig NS game.terminalufo.com` →
  empty), so nothing in it resolves publicly.
- **The "most-specific zone" trap:** with both `terminalufo.com` (delegated) and
  `game.terminalufo.com` (not delegated) present, Amplify writes the validation
  record into the *more specific* `game.terminalufo.com` zone — a dead end.

Fix (only needed if you deliberately move the game to Amplify):

1. Route 53 → delete the stray `game.terminalufo.com` hosted zone.
2. Amplify → the app → *Custom domains* → remove the stuck `game` subdomain, then
   re-add it. With only the parent zone present (same AWS account), Amplify
   writes the ACM validation `CNAME` **and** the app `CNAME` into the
   authoritative `terminalufo.com` zone; validation then finishes in minutes.
3. Manual/cross-account alternative: copy the two records shown on Amplify's
   domain screen — the `_<hash>.game` validation `CNAME` and the
   `game → <id>.cloudfront.net` `CNAME` — into the parent `terminalufo.com` zone
   by hand.

The same stray-zone deletion is worth doing regardless, since it currently
serves no purpose.

## Reference: full Amplify custom-domain setup

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
   - **`terminalufo.com` is managed in AWS Route 53** (confirmed: its name
     servers are `awsdns-*`). If the Route 53 hosted zone is in the **same AWS
     account** as this Amplify app, Amplify auto-creates the ACM certificate and
     the DNS records **directly in the existing `terminalufo.com` hosted zone** —
     no manual record entry. Approve and wait for the domain status to reach
     *Available*.
   - **You do NOT need a separate `game.terminalufo.com` hosted zone.** Because
     the parent `terminalufo.com` zone already lives in Route 53, the subdomain
     records belong in that existing zone. A standalone `game.terminalufo.com`
     hosted zone only works if you also add an `NS` delegation record for `game`
     in the parent zone pointing to the sub-zone's four name servers — extra
     complexity with no benefit here. If one was created by mistake, delete it
     (an empty, undelegated hosted zone routes nothing) to avoid confusion.
   - **Important:** the actual DNS record *values* (the Amplify/CloudFront target
     and the ACM validation `CNAME`) are produced by the Amplify *Add custom
     domain* step above — creating a Route 53 hosted zone by itself does not
     generate them. Always run the Amplify domain step first, then let Amplify
     populate Route 53 (same account) or copy the shown records into DNS.
   - **Cross-account edge case:** if the `terminalufo.com` Route 53 zone is in a
     *different* AWS account than the Amplify app, Amplify cannot auto-write to
     it. In that case, complete the Amplify *Add domain* step to reveal the
     target + ACM validation records, then add them manually as `CNAME`s in the
     `terminalufo.com` zone in the account that owns it.

4. **Verify the live subdomain**
   - Open `https://game.terminalufo.com/`.
   - Confirm: HTTPS valid, game loads, audio + images play, deep refresh on the
     root works, and `https://terminalufo.com` (the existing site) is
     unaffected.

## Ongoing deploys (Amplify)

- Amplify auto-builds on every push to `main` using `amplify.yml`. No manual
  step. Roll back from the Amplify Console if a build regresses.

## Notes

- The apex `terminalufo.com` and the game are independent; attaching only the
  `game` subdomain does not touch the existing site.
- **Apex check (2026-07-04):** `terminalufo.com` currently has **no A/alias
  record** in Route 53 and does not resolve — only `www.terminalufo.com`
  (→ CloudFront) works. If the bare apex should serve the main site, add an
  A-record **Alias** to the CloudFront/Amplify target in the `terminalufo.com`
  zone (Amplify Console → the main app → *Custom domains* can create it).
- Electron and Steam builds are unaffected by any web deployment — they consume
  the same `out/` export from the filesystem root and require no config changes.
