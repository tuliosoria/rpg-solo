# Design: Production Bot Autoplay as a Hidden, Single-Switch Hack

**Date:** 2026-07-26
**Status:** Approved (author working autonomously under explicit delegation)
**Related:** `docs/superpowers/specs/2026-07-26-bot-test-autoplay-harness-design.md`,
`docs/superpowers/plans/2026-07-26-bot-test-autoplay-harness.md`

## Problem & goal

The `bot-test` autoplay harness (shipped in PR #38) plays the game turn-by-turn at
three skill levels (`dummy`/`novice`/`pro`) so the developer can watch it and judge
difficulty. It is currently **dev-only**: the `bot-test`/`bot-stop` commands are
registered exclusively when `NODE_ENV === 'development'`, so they do not exist on the
deployed site (`game.terminalufo.com`).

The developer wants to run it **on production** — "almost like a hack" — to observe live
whether the risk/detection curve is too punishing, whether files are too hard to find,
etc., using the real deployed build. It must be **easy to disable later** ("depois
desabilitamos ela"). The bot must, as it already does, decide each turn on its own and
act in a loop until an ending, game-over, or halt.

This is a small, focused change: flip the gate that hides the commands, behind a single
kill-switch, and prove the exposure stays invisible to ordinary players.

## Key insight: the harness already runs everywhere

Only **command registration** is dev-gated. Everything else the bot needs already runs
unconditionally in production and is merely inert because `gameState.botTest` can never
be set there:

- `useBotRunner` (the turn loop) is called unconditionally in `Terminal.tsx`.
- The Turing auto-answer (`autoPilot` prop) and media auto-dismiss are unconditional.
- Keystroke-halt on the input is unconditional (guarded by `botTest?.active`).

So enabling production autoplay requires **only** registering `bot-test`/`bot-stop`.

## Key insight: discovery is allowlist-based, so exposure does not leak

Player-facing command discovery — `help`, Tab/ghost-text completion, and "did you mean"
typo suggestions — is driven by the explicit `PUBLIC_COMMANDS` allowlist
(`app/engine/commands/utils.ts:206`), **not** `Object.keys(commands)`. `bot-test` and
`bot-stop` are not in that allowlist and will not be added. Therefore registering them in
production surfaces them in **no** player-facing affordance. They remain invisible unless
the player already knows the exact command string.

## Decisions

1. **Single kill-switch constant.** Add `BOT_ENABLED = true` in a dedicated file
   `app/constants/bot.ts`, with a comment explaining it is a temporary production hack and
   that setting it to `false` and redeploying removes the commands. This is the one place
   to flip.
2. **Registration gate becomes** `if (BOT_ENABLED || process.env.NODE_ENV === 'development')`
   in `app/engine/commands/index.ts`. Development always has the bot (independent of the
   flag); production has it while `BOT_ENABLED` is `true`.
3. **Keep the `bot-test` / `bot-stop` names** (no rename, no password). A client-side
   static bundle cannot truly hide a string, so obscurity beyond the existing allowlist
   hiding adds complexity for no real secrecy. Consistency with dev usage avoids confusion.
4. **Keep all three levels** (`dummy`/`novice`/`pro`) in production — observing difficulty
   at different knowledge levels is the whole point.
5. **Do not add the commands to `PUBLIC_COMMANDS`.** They must stay out of help, Tab
   completion, and typo suggestions.

## Rejected alternatives

- **`NEXT_PUBLIC_ENABLE_BOT` env var.** Lets one disable via hosting config without a code
  change, but the project deploys by pushing to `main` (Amplify + Azure + desktop build).
  Setting an env var across three targets is more friction and less visible than editing
  one constant. Rejected as the primary mechanism.
- **Obscure command rename or password gate.** True secrecy is impossible client-side, and
  the allowlist already hides the command from every UI affordance. Extra machinery with no
  security benefit. Rejected.

## Scope

**In scope**
- New `app/constants/bot.ts` exporting `BOT_ENABLED`.
- One-line gate change in `app/engine/commands/index.ts`.
- Tests: the flag registers `bot-test`/`bot-stop`; and a guard test asserting neither
  command appears in `PUBLIC_COMMANDS` (and thus not in help/completion).

**Out of scope / non-goals**
- No change to bot strategy, levels, delay, Turing handling, or media handling.
- No new UI, no help entry, no autocomplete entry.
- No env-var plumbing.
- No change to the shipped `handleSubmit` seam or keystroke-halt (already live).

## Architecture & data flow

```
player types "bot-test pro"      (production, BOT_ENABLED === true)
        │
        ▼
commands registry  ── BOT_ENABLED || dev ──►  debugCommands registered
        │
        ▼
executeCommand → bot-test handler → stateChanges.botTest = { active:true, level, seed, ... }
        │
        ▼
useBotRunner effect (already unconditional) → decideNextCommand loop → submit() each turn
        │
        ▼
ending / game-over / halt → buildRunSummary → botTest cleared
```

Nothing in the loop changes. The gate is the only edit to runtime behavior.

## Error handling & edge cases

- **Flag off:** `bot-test` is unregistered; typing it falls through to the normal
  unknown-command path (typo suggestions from `PUBLIC_COMMANDS`, no bot hint). Dev is
  unaffected because the `NODE_ENV==='development'` clause still registers it.
- **Player stumbles on it:** worst case they auto-play and see an ending — a spoiler, not a
  fault. No server-side state exists to corrupt (client-only static export).
- **Halt:** any real keystroke or `bot-stop` halts (already shipped); self-halts at
  ending/game-over/`maxTurns`.

## Risks (accepted)

- **Spoiler exposure.** A player who reads the JS bundle can find `bot-test` and watch an
  automated run, including the `pro` route to the secret ending. Accepted because the
  feature is explicitly temporary and gated by a one-line kill-switch; the game has no
  competitive or server-side stakes.
- **Leaving it on.** Mitigated by the prominent single constant and comment; disabling is a
  one-line change plus redeploy.

## Testing strategy

1. **Gate unit test** (`app/engine/__tests__/*`): with `BOT_ENABLED` importable, assert the
   assembled command registry includes `bot-test` and `bot-stop` when enabled. (Existing
   `debug-commands.test.ts` already covers handler behavior.)
2. **Hidden-from-discovery guard test:** assert `PUBLIC_COMMANDS` does not include
   `bot-test`/`bot-stop`, and (if a help/completion helper is unit-testable) that they are
   absent from its output. This is the regression guard that keeps the hack invisible.
3. **Full suite + `npm run build`.** After enabling, the production bundle will now contain
   the bot strings by design; no test asserts their absence, so nothing breaks.

## Disable procedure (for later)

1. Set `BOT_ENABLED = false` in `app/constants/bot.ts`.
2. Commit and push to `main`; the deploy removes `bot-test`/`bot-stop` from production.
   (Dev keeps them via the `NODE_ENV` clause.)
