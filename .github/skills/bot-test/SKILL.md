---
name: bot-test
description: Guidance for driving the bot-test autoplay harness to find bugs, and for changing its strategy, levels, or run report.
---

# Bot-Test Workflow

Use this skill when you want the game to play itself — to watch a path end to
end, to confirm an ending is still reachable, or to sweep the whole command
surface for regressions — and when changing the bot's strategy, levels, or
reporting.

## Start Here

| File | Role |
|---|---|
| `app/engine/bot/strategy.ts` | `decideNextCommand` — the whole brain. Pure: `(state, memory, level) → command` |
| `app/engine/bot/targets.ts` | Secret-ending file sets, derived from `FILE_CATEGORIES` so they can't drift |
| `app/engine/bot/types.ts` | `BotLevel`, `BotMemory`, `DEFAULT_BOT_MAX_TURNS` (400), `DEFAULT_BOT_DELAY_MS` (3000) |
| `app/engine/bot/report.ts` | `buildRunSummary` — the block printed when a run ends |
| `app/hooks/useBotRunner.ts` | Browser driver: pacing, overlay dismissal, terminal-idle gating |
| `app/engine/commands/debug.ts` | The `bot-test` / `bot-stop` handlers |
| `app/constants/bot.ts` | `BOT_ENABLED` kill switch |

## Watching a Run

```
bot-test [dummy|novice|pro] [seed]     # level defaults to novice, seed to state.seed
bot-stop                               # or press any key — both halt it
```

Both commands are deliberately absent from `PUBLIC_COMMANDS`, so they never
appear in `help`, Tab completion, or "did you mean" suggestions. Type them
exactly. `botTest` state is never persisted to a save.

One command per turn at 3s, and the bot submits through the same path a human
uses — streaming, UFO74 reactions, and overlays all play out — so a full winning
run takes a few minutes to watch.

## Levels and What Each Proves

| Level | Behavior | Proves |
|---|---|---|
| `dummy` | Never unlocks admin; only pre-admin evidence is reachable | The game stops gracefully when a player cannot win — no hang, no loop |
| `novice` | Unlocks admin, fills the dossier broadly, wins | The mainline path is completable |
| `pro` | Prioritizes `secretCriticalTargets()` before the 10-slot cap | The secret ending is still reachable |

`pro` is the canary for ending logic: it claims the four files
`determineEnding` actually requires *first*, so a change to `FILE_CATEGORIES`
or the dossier cap shows up as a wrong ending rather than a silent near-miss.

## Headless Sweep (the fast way to find bugs)

Watching shows whether a path *feels* right. To *find* things, drive the same
strategy from a Vitest file — a full playthrough runs in well under a second:

```ts
// state → decideNextCommand → executeCommand → merge stateChanges → repeat
const { decision, memory: next } = decideNextCommand(state, memory, level, seed);
const result = executeCommand(decision.text, state);
state = { ...state, ...result.stateChanges } as GameState;
```

Render each entry exactly as `Terminal.getEntryContent` does, once per locale,
and diff the three passes:

```ts
entry.i18nKey ? t(entry.i18nKey, entry.i18nValues, entry.content)
              : translateRuntimeText(entry.content)
```

Get `t` / `translateRuntimeText` from `useI18n()` inside an `I18nProvider`
(`renderHook`), one provider per language pass — reading `result.current` from
several live providers at once does not give you three languages. Comparing raw
`entry.content` instead is the trap: it still holds `{{placeholders}}` and the
English fallback, so real bugs hide and false ones appear.

This is how the `unread` doubled-slash bug, an untranslated error reason, a
misattributed speaker label, and a doubled indent were found. See
`app/engine/bot/__tests__/strategy.integration.test.ts` for the loop skeleton.

## Reading the Run Summary

`buildRunSummary` prints level, seed, turns, files read/saved, final detection,
and outcome (`WON — ending: <id>` / `GAME OVER — <reason>` / `stopped`).

> **The `ANOMALIES` count is always 0.** `BotRunLogEntry.anomaly` is declared
> and rendered but never assigned, and `detectionBefore`/`detectionAfter` are
> both written from the same pre-command state. Read the outcome line and the
> terminal itself; do not treat "ANOMALIES (0)" as a clean bill of health.

`decideNextCommand` stops on its own for: `ending reached`, `game over`,
`max turns reached` (400), `no progress (stuck)` (6 turns with an unchanged
`filesRead:savedFiles:leakProgress:admin:generated` signature), and
`no productive action`. A stop reason other than the first two on `novice` or
`pro` means something regressed.

## Common Pitfalls

- **It is live in production.** `BOT_ENABLED` is `true`, so the commands ship;
  only their absence from `PUBLIC_COMMANDS` keeps them out of reach. The
  comment at the `useBotRunner` call site calling it "dev-gated" understates
  this. To actually remove them, set `BOT_ENABLED = false` and redeploy.
- **The bot is not a player.** It beelines: it only opens files it intends to
  save, and never browses, uses `hint`, or mistypes. A clean run says the path
  works, not that the surface is clean — sweep commands separately.
- **Don't hardcode ending files in `strategy.ts`.** Go through
  `app/engine/bot/targets.ts`, which derives them from `endings.ts`.
- **New blocking overlay? Teach the runner.** `useBotRunner` only knows the
  overlays passed to it; an unhandled one stalls the run until the turn cap.
- Changing levels, targets, or the stop conditions means re-running
  `app/engine/bot/__tests__/strategy.integration.test.ts`, which asserts that
  `novice` wins and `pro` reaches `secret_ending`.
