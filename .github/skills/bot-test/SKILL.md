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
| `app/engine/bot/strategy.ts` | `decideNextCommand` — the whole brain. Pure: `(state, memory, level, seed) → command` |
| `app/engine/bot/targets.ts` | Secret-ending file sets, derived from `FILE_CATEGORIES` so they can't drift |
| `app/engine/bot/probes.ts` | `BOT_PROBE_COMMANDS` — the command surface `chaos` pokes at |
| `app/engine/bot/types.ts` | `BotLevel`, `BotMemory`, `DEFAULT_BOT_MAX_TURNS` (400), `DEFAULT_BOT_DELAY_MS` (3000) |
| `app/engine/bot/report.ts` | `buildRunSummary` — the block printed when a run ends |
| `app/hooks/useBotRunner.ts` | Browser driver: pacing, overlay dismissal, terminal-idle gating |
| `app/engine/commands/debug.ts` | The `bot-test` / `bot-stop` handlers |
| `app/constants/bot.ts` | `BOT_ENABLED` kill switch |

## Watching a Run

```
bot-test [dummy|novice|pro|chaos] [seed]   # level defaults to novice, seed to state.seed
bot-stop                                   # or press any key — both halt it
```

Both commands are deliberately absent from `PUBLIC_COMMANDS`, so they never
appear in `help`, Tab completion, or "did you mean" suggestions. Type them
exactly. `botTest` is stripped on both save and load, so a run that was
underway can never be restored into a session and resume playing on its own.

Passing a seed **reseeds the game** (`state.seed` and `state.rngState`), it does
not merely label the run: `state.seed` is what drives the leak sequence, file
content variation and honeypot rolls, so the seed printed in the summary is the
one another machine can replay. Omit it and the session's own seed is used and
reported unchanged. Note this means `bot-test <level> <seed>` changes the RNG of
a session already in progress — which is the point, but makes it a poor thing to
type mid-playthrough.

One command per turn at 3s, and the bot submits through the same path a human
uses — streaming, UFO74 reactions, and overlays all play out — so a full winning
run takes a few minutes to watch.

## Levels and What Each Proves

| Level | Behavior | Proves |
|---|---|---|
| `dummy` | Never unlocks admin; only pre-admin evidence is reachable | The game stops gracefully when a player cannot win — no hang, no loop |
| `novice` | Unlocks admin, fills the dossier broadly, wins | The mainline path is completable |
| `pro` | Prioritizes `secretCriticalTargets()` before the 10-slot cap | The secret ending is still reachable |
| `chaos` | Wins like `novice`, but spends spare turns on `BOT_PROBE_COMMANDS` | The rest of the command surface survives contact with a player |

`pro` is the canary for ending logic: it claims the four files
`determineEnding` actually requires *first*, so a change to `FILE_CATEGORIES`
or the dossier cap shows up as a wrong ending rather than a silent near-miss.

`chaos` is the canary for everything the win path never touches. `novice` and
`pro` only ever type `open`, `save`, `override` and `leak`, so a clean run says
nothing at all about the other two dozen commands. That is not theoretical:
`chaos` is what found `tree` ending an admin session on the first unwarned
keystroke, while the *survivable* pre-admin version sat behind a confirmation
gate — on a command `help` advertises and the hint system used to recommend.

**Seeds vary the dossier, not just the leak sequence.** `strategy.ts` orders
equal-priority files by `seededOrder(seed, path)`, so different seeds
investigate different files and reach different endings. Before that the file
order came from the filesystem walk and was identical on every seed, which
meant a 24-seed `novice` sweep produced `the_2026_warning` 24 times and eleven
of the twelve endings were never exercised by any run. `pro` keeps its priority
tiers on top of the shuffle, so the secret ending stays guaranteed; only the
interchangeable remainder moves.

### Changing the probe list

`BOT_PROBE_COMMANDS` runs once per entry, in order, and must contain nothing
that ends the run or rewrites the session. `tutorial` with no argument is the
cautionary tale: it sets `tutorialComplete: false` and clears `history`, handing
the session back to the interactive tutorial, and every turn after it reported
empty output and "changed nothing" — twenty lines that looked like engine bugs
and were one self-inflicted wound. Probe turns are also marked `probe: true` so
`settleBotTurn` exempts them from "turn changed nothing"; a read-only command
changing nothing is the expected result, not a finding.

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

**Set the language before running the command, not just before rendering it.**
Translation happens at two different times: entries carrying an `i18nKey` are
resolved at render, but handlers that call `translateStatic` directly (`status`,
`save`, `unsave`, …) bake the string in *when the command executes*, and with no
explicit language argument `translateStatic` falls back to reading the language
straight out of `localStorage`. So a sweep that executes each command once and
then renders it three times measures one language wearing three hats — and
because the provider persists on `setLanguage`, the language it reports is
whichever pass ran last. Write the key
(`localStorage.setItem('terminal1996_language', lang)`) *before* `executeCommand`
and run the whole command once per locale. Getting this backwards manufactures
convincing findings: it reported the entire `help` table and every `status` line
as untranslated, all of which were fine.

**Sweep documents from a fresh low-detection state, one per file.** Opening
every file in a single session drives detection into the hostile tiers, where
the terminal deliberately truncates and mangles its own output. A truncated
English fragment matches nothing in the runtime tables, so it renders identically
in all three languages and reads exactly like an untranslated string — that
artifact once produced a 54-line "translation gap" in files that were fully
translated all along. Re-measure anything suspicious at detection 0 before
believing it.

**Expect legitimate matches.** Many lines are identical in all three languages on
purpose: proper names, morse tables, hashes, modem logs, command names quoted in
prose, and the in-fiction Portuguese that is already Portuguese in the English
build. Filter those out before counting, or the signal drowns.

This is how the `unread` doubled-slash bug, an untranslated error reason, a
misattributed speaker label, a doubled indent, and the runtime-merge precedence
bug (`app/i18n/__tests__/runtimeMergePrecedence.test.ts`) were found. See
`app/engine/bot/__tests__/strategy.integration.test.ts` for the loop skeleton.

## Reading the Run Summary

`buildRunSummary` prints level, seed, turns, files read/saved, final detection,
and outcome (`WON — ending: <id>` / `GAME OVER — <reason>` /
`stopped — <reason>`).

`ANOMALIES` lists turns worth a second look. A turn is flagged when the command
was rejected (invalid attempts went up — the strategy and the parser disagree),
when detection moved more than `BOT_EXPECTED_MAX_DETECTION_JUMP` in one turn,
when nothing changed at all, or when the game ended. A clean `novice` or `pro`
run reports zero; anything listed is a real finding, so read it.

`decideNextCommand` stops on its own for: `ending reached`, `game over`,
`max turns reached` (400), `no progress (stuck)` (6 turns with an unchanged
`filesRead:savedFiles:leakProgress:admin:generated` signature), and
`no productive action`. The reason is printed on the outcome line. Anything but
the first two on `novice` or `pro` means something regressed.

## Common Pitfalls

- **It is live in production.** `BOT_ENABLED` is `true`, so the commands ship;
  only their absence from `PUBLIC_COMMANDS` keeps them out of reach. Treat
  anything it can reach — saves included — as player-facing. To actually remove
  the commands, set `BOT_ENABLED = false` and redeploy.
- **Session-only means enforced, not just intended.** `botTest` is stripped in
  `serializeState` *and* in `deserializeState`; the type comment saying it is
  never persisted was true of the intent and false of the code, and the autosave
  fires on state change, so a run in progress was written straight to disk and
  resumed on load. Guarded by
  `app/storage/__tests__/botTestNotPersisted.test.ts`.
- **`dummy`, `novice` and `pro` are not players.** They beeline: they only open
  files they intend to save, and never browse, use `hint`, or mistype. A clean
  run on those levels says the win path works, not that the surface is clean —
  that is what `chaos` is for, and it is still only a probe list, so a command
  absent from `BOT_PROBE_COMMANDS` is a command no bot has ever typed.
- **Don't hardcode ending files in `strategy.ts`.** Go through
  `app/engine/bot/targets.ts`, which derives them from `endings.ts`.
- **New blocking overlay? Teach the runner.** `useBotRunner` only knows the
  overlays passed to it; an unhandled one stalls the run until the turn cap.
- Changing levels, targets, probes, or the stop conditions means re-running
  `app/engine/bot/__tests__/strategy.integration.test.ts`, which asserts that
  every level terminates, `novice` and `chaos` win, `pro` reaches
  `secret_ending` on every seed, seeds produce more than one ending, and each
  probe is issued exactly once.
