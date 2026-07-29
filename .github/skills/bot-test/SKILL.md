---
name: bot-test
description: Guidance for driving the bot-test autoplay harness to find bugs, and for changing its strategy, levels, or run report.
---

# Bot-Test Workflow

Use this skill when you want the game to play itself — to watch a path end to
end, to confirm an ending is still reachable, or to sweep the whole command
surface for regressions — and when changing the bot's strategy, levels, goals,
or reporting.

## Start Here

| File | Role |
|---|---|
| `app/engine/bot/strategy.ts` | `decideNextCommand` — the whole brain. Pure: `(state, memory, level, seed, goal) → command` |
| `app/engine/bot/endingTargets.ts` | `ENDING_RECIPES` + `buildEndingDossier` — how a run aims at one of the 12 endings |
| `app/engine/bot/scenarios.ts` | `BOT_SCENARIOS` — the named game-over and edge paths, each with its expected outcome |
| `app/engine/bot/sweep.ts` | `runBotSweep` — headless runner behind `bot-test sweep` and the integration tests |
| `app/engine/bot/targets.ts` | Secret-ending file sets, derived from `FILE_CATEGORIES` so they can't drift |
| `app/engine/bot/probes.ts` | `BOT_PROBE_COMMANDS` — the command surface `chaos` pokes at |
| `app/engine/bot/types.ts` | `BotLevel`, `BotGoal`, `BotMemory`, `DEFAULT_BOT_MAX_TURNS` (400), `DEFAULT_BOT_DELAY_MS` (3000) |
| `app/engine/bot/report.ts` | `buildRunSummary` — the block printed when a run ends, including the goal PASS/FAIL |
| `app/hooks/useBotRunner.ts` | Browser driver: pacing, overlay dismissal, terminal-idle gating |
| `app/engine/commands/debug.ts` | The `bot-test` / `bot-stop` handlers |
| `app/constants/bot.ts` | `BOT_ENABLED` kill switch |

## Watching a Run

```
bot-test [dummy|novice|pro|chaos] [seed]   # level defaults to novice, seed to state.seed
bot-test ending <endingId> [seed]          # aim at one of the 12 endings
bot-test scenario <scenarioId> [seed]      # drive one named game-over / edge path
bot-test <endingId|scenarioId> [seed]      # the keyword is optional; ids are unique
bot-test list                              # every level, ending and scenario
bot-test sweep [seed]                      # headless: run them all, print a matrix
bot-stop                                   # or press any key — both halt it
```

Both commands are deliberately absent from `PUBLIC_COMMANDS`, so they never
appear in `help`, Tab completion, or "did you mean" suggestions. Type them
exactly. `botTest` is stripped on both save and load, so a run that was
underway can never be restored into a session and resume playing on its own.

An unrecognised target is refused rather than silently downgraded to a default
run: a typo that started a normal `novice` playthrough would look like the
harness ignoring the request, and only the summary's `Goal: default` line —
the one nobody reads — would say otherwise.

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

## Levels and Goals

A **level** says how skilled the player pretending to type is; a **goal** says
what the run is trying to reach. They are orthogonal, and a run without a goal
behaves exactly as it always did.

### Levels — what each proves

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

### Ending goals — aiming instead of hoping

`bot-test ending <id>` builds the exact 10-file dossier `determineEnding` maps
to that ending, then leaks. Recipes live in `endingTargets.ts`, one per
`EndingId`, and have two halves:

- **`required`** — the anchor. It must resolve to the target *on its own*; that
  invariant is asserted in `endingTargets.test.ts` and is what makes the rest
  sound.
- **`padFrom`** — categories the remaining slots are filled from, in order. A
  win needs all ten slots, but the anchors are only 1–7 files.

Padding is chosen by trial: a candidate is kept only when
`determineEnding(dossier ∪ {candidate})` is still the target. So `padFrom` is a
preference, not a promise — a category that would tip the dossier into a
higher-priority branch is skipped rather than quietly changing the ending. That
is also what makes the recipes survive a retuned priority list or a category
gaining a file.

Unlike `novice`, an ending run must land on the same ending **on every seed** —
that is the whole point of aiming, and `goals.integration.test.ts` asserts it.

Ending runs also re-plan every turn rather than fixing a list up front. A file
that refuses to open is recorded in `BotMemory.unavailablePaths` and the next
plan routes around it, so one unreachable file re-routes the dossier instead of
wedging the run against a door that will not open.

### Scenario goals — the paths the win path avoids

Every level steers *away* from trouble, so no bot had ever reached a game-over
screen: not its copy, not its reason string, not its translations. Scenarios
reach them on purpose, and each declares what a correct run ends in so the
summary can print PASS/FAIL instead of leaving you to remember.

| Scenario | Ends in |
|---|---|
| `detection-trace` | `INTRUSION DETECTED - TRACED` |
| `invalid-threshold` | `INVALID ATTEMPT THRESHOLD` |
| `input-length-threshold` | `INVALID INPUT THRESHOLD` |
| `override-lockdown` | `SECURITY LOCKDOWN - AUTHENTICATION FAILURE` |
| `tree-firewall` | `FIREWALL — TREE SCAN ON ELEVATED SESSION` |
| `purge-protocol` | `PURGE PROTOCOL - FORBIDDEN KNOWLEDGE` |
| `neutral-disconnect` | `NEUTRAL ENDING - DISCONNECTED` |
| `honeypot-traps` | survives (warning path, all four traps) |
| `morse-exhaustion` | survives (all guesses spent, further input refused) |
| `dossier-full` | survives (11th save refused, then `unsave` and swap) |
| `leak-misfire` | survives (preparation sequence entered out of order) |

Five things bite when writing one:

**Some turns leave no trace in the state.** A refused save is byte-for-byte
identical to the turn before it, and a wrong leak step resets progress to where
it already was. A driver keying off `GameState` alone repeats those forever, so
`BotScenarioContext.flags` is a per-run scratch bag on `BotMemory` for exactly
that. Reach for it only when the state genuinely cannot tell you.

Return `{ text, expectNoOp: true }` for such a step, and
`{ text, expectRejected: true }` for one the parser is *supposed* to refuse.
Otherwise the summary prints "turn changed nothing" or "command rejected" beside
a PASS, and a scary anomaly on a passing run is how everyone learns to skim the
anomaly list — which is the only real output the harness has.

**A scenario that starts at the boot screen starts inside the grace period.**
`shouldSuppressPenalties` suppresses detection, strikes and the override
failed-attempt counter until the player finds their first evidence, so
`override-lockdown` guessing straight off the boot screen can never reach the
lockdown at all. Open one evidence file first — one turn, and what a player who
is guessing at a password has done anyway. Reading ordinary files instead costs
fifteen reads' worth of detection the scenario did not want to spend.

**Read-only is not free.** `purge-protocol` burns its doom countdown with
`progress`, not `status`, because the buffer dump leaves detection at 95 and
`status` quietly costs a point per use — eight of those trade the purge screen
for the trace screen, five turns before the countdown lands.

**A branch behind a dice roll needs `seedFits`.** Declare it and `bot-test`
picks a seed that satisfies it, honouring an explicit one that already works.
`purge-protocol` needs this: its branch is a 35% roll against `rngState`, which
nothing but `override` ever moves, so the seed alone decides reachability and an
unlucky one would make a FAIL mean nothing.

**Live input must preserve what headless input proves.** The terminal can
sanitize what it stores in history, but it must hand the original input to
`executeCommand`; otherwise an overlong command is truncated before the engine
can recognize it, and `input-length-threshold` only covers a headless-only path.

Goal runs also relax the stuck detector, because "progress" means something else
for them — `invalid-threshold` reads and saves nothing for eight turns straight.
`goalProgressSignature` watches detection, the strike counters and the doom
countdown instead.

## Sweeping Everything

```
bot-test sweep [seed]
```

Runs all four levels, all 12 endings and all 11 scenarios against the pure
command engine and prints one PASS/FAIL row each. It finishes in well under a
second, which is what makes "is every outcome still reachable" a question you
can answer in one command instead of an afternoon of 3s turns.

A sweep is a report, not a run: it never arms autoplay.

**A green sweep proves reachability, not rendering.** It drives
`executeCommand` and nothing else — no streaming, no overlays, no UFO74 timing,
no ending screen. Watch a level run for that.

The one place the two halves are joined automatically is
`app/components/endings/__tests__/endingScreens.botDossier.test.tsx`: it walks
the bot to each of the twelve endings and renders the real `Victory` screen from
the dossier that run actually built, in all three languages. That matters
because `Victory.test.tsx` renders every ending from `defaultProps` — no dossier
and English only — so the parts of the screen assembled from what the player
saved (`buildLeakPrologue`, the revelation-resolved AOL body) were only ever
rendered from an empty set. `endingScreens.botScenarios.test.tsx` does the same
for bot-produced bad and neutral outcomes, plus the identity-reveal screen
reached by the pro path.

**The sweep takes the engine as an argument, and must keep doing so.**
`runBotSweep(execute, opts)` is handed `executeCommand` by the command layer —
see `CommandExecutor` in `app/engine/commands/types.ts`, which `commands.ts`
passes as a handler's third argument. Importing `executeCommand` into `sweep.ts`
looks tidier and closes a real cycle: `debug.ts -> sweep.ts -> commands.ts ->
commands/index.ts -> debug.ts`, and `index.ts` dereferences `debugCommands`
during its own evaluation, so entering the graph at `debug.ts` throws
`Cannot access 'debugCommands' before initialization`. It survived review only
because no shipped path enters there and Vite tolerates it.
`bot-registration.test.ts` drives a sweep through the real dispatcher to keep the
wiring honest.

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
and were one self-inflicted wound. `clear` is the same wound in miniature: its
whole job is `history: []`, so it erases the run a human is watching, and the
summary is printed into that same history. Bare `override` is out for a
different reason — with no arguments it falls through to
`createInvalidCommandResult`, so it is a strike rather than a usage hint.

Probe turns are marked `probe: true` so `settleBotTurn` exempts them from "turn
changed nothing"; a read-only command changing nothing is the expected result,
not a finding. They are **not** exempt from rejection: a real command being
refused is a finding wherever it happens. The two probes that exist to be
refused say so through `BOT_PROBES_EXPECTING_REJECTION`.

**Some inputs never reach the engine.** `useTerminalInput` intercepts bare
`save` (and its `salvar`/`guardar` aliases) plus `exit`/`quit` before
`executeCommand` ever runs, and drives the UI instead. Probing one of those is
worse than skipping it: headlessly it exercises an engine branch the player can
never reach and reports it as covered, and in a live run it opens an overlay
`useBotRunner` was never told about — the save-session modal is owned by
`HomeContent`, one level above the terminal, so the runner cannot see it to
dismiss it, and it sat on screen for the remaining twenty turns of a `chaos`
run. That is a bug the headless sweep is structurally incapable of finding, and
it is the reason to watch a live run occasionally.

Everything else in `PUBLIC_COMMANDS` should be in the list, and
`strategy.integration.test.ts` fails if a new advertised command is added
without one — otherwise it ships as a command no bot has ever typed.

## Driving the Bot from a Test

`bot-test sweep` answers "is everything still reachable". For anything else —
locale diffs, output inspection, one-off experiments — drive the same strategy
from a Vitest file. `runHeadless(level, seed, goal)` in `sweep.ts` is the loop
already written; reach for it first, and hand-roll only when you need the
per-turn output:

```ts
// state → decideNextCommand → executeCommand → merge stateChanges → repeat
// `goal` is optional and defaults to the level-driven behaviour.
const { decision, memory: next } = decideNextCommand(state, memory, level, seed, goal);
const result = executeCommand(decision.text, state);
state = { ...state, ...result.stateChanges } as GameState;
```

Goals make locale sweeps far cheaper to target: `{ kind: 'ending', ending }`
walks straight into one ending's screen, and a scenario walks straight into one
game-over screen, instead of hoping a seed takes you there.

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

`buildRunSummary` prints level, seed, goal, turns, files read/saved, final
detection, and outcome (`WON — ending: <id>` / `GAME OVER — <reason>` /
`stopped — <reason>`).

It also goes to the browser console as plain text, because the on-screen copy
does not always survive. `Terminal` returns the ending component *instead of*
the terminal once `gamePhase` becomes `victory` or `bad_ending`, so a winning
run finishes by unmounting the only surface the summary was printed on, and the
ending screen's one control restarts the game. That hid the summary for every
winning level run and all twelve ending runs. Read it in devtools when the run
ends on an ending screen.

A goal run adds a verdict line. It is the point of aiming: "WON — ending:
incomplete_picture" reads like a success right up until you remember the run was
asked for `ridiculed`, so the summary says so out loud
(`Goal: FAIL — expected ending ridiculed, got incomplete_picture`).

`ANOMALIES` lists turns worth a second look. A turn is flagged when the command
was rejected (the strategy and the parser disagree), when detection moved more
than `BOT_EXPECTED_MAX_DETECTION_JUMP` in one turn, when nothing changed at all,
or when the game ended. A clean `novice` or `pro` run reports zero; anything
listed is a real finding, so read it. Scenario runs are the exception: they aim
at a game over, so the turn that ends them is flagged by design, and
`purge-protocol` also flags the buffer dump's jump to detection 95 — the branch
it exists to reach.

Rejection is read from **both** counters, because they are charged by different
code paths and only one is the engine's verdict on "I did not understand that":
`createInvalidCommandResult` increments `legacyAlertCounter`, which is what the
8-strike lockout reads, while `wrongAttempts` is bumped by the handful of
handlers that understood the command and rejected its argument. Watching
`wrongAttempts` alone meant the check billed as the most useful signal here had
never once fired on a genuinely unparsed command: `xyzzy` and `hlep` move
`legacyAlertCounter` and leave `wrongAttempts` untouched, so every `chaos` run
reported a clean sheet on the one thing it was built to notice.

Turns exempt from "changed nothing" are `chaos` probes and scenario steps marked
`expectNoOp`. Everything else is fair game — including turns that only arm a
confirmation gate or burn an operation off the purge countdown, which is why
`settleBotTurn` watches `pendingTreeConfirm` and `sessionDoomCountdown`: without
the first, `tree`'s warning turn was reported as doing nothing, on the one
command most likely to be under investigation; without the second,
`purge-protocol` printed eight false alarms while doing exactly what its name
says.

Turns exempt from **rejection** are the ones that say so with `expectRejected` —
the two suggestion-path probes, which cannot reach the "did you mean" branch
without being refused, and `invalid-threshold`'s eight deliberate gibberish
commands. `probe` alone does not suppress it: a real command being refused is a
finding even on a probe turn.

`decideNextCommand` stops on its own for: `ending reached`, `game over`,
`max turns reached` (400), `no progress (stuck)` (6 turns with an unchanged
progress signature), `no productive action`, `scenario <id> script complete`,
and `ending <id> unreachable — …`. The reason is printed on the outcome line.
Anything but the first two on `novice` or `pro` means something regressed.

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
  `strategy.integration.test.ts` now fails when an advertised command has no
  probe, but the excuse list in that test is a list of holes, not of exemptions.
- **The grace period is not cosmetic, and a scenario has to respect it.**
  `shouldSuppressPenalties` covers detection, strikes *and* the override
  failed-attempt counter until the player finds their first evidence. A scenario
  aiming at a penalty-driven game over has to leave the phase first, or it will
  bounce off a mechanic that is switched off.
- **Don't hardcode ending files in `strategy.ts`.** Go through
  `app/engine/bot/targets.ts` (secret ending) or `endingTargets.ts` (all twelve),
  both of which derive from `endings.ts`.
- **A recipe anchor must resolve to its own ending alone.** Padding is validated
  against the target, so an anchor that resolves elsewhere makes every padding
  decision compare against the wrong ending from the first turn. Asserted in
  `endingTargets.test.ts`.
- **The goal is part of a run's identity.** `useBotRunner` keys its memory on
  `level:seed:goal`; dropping the goal would let a new `bot-test ending X` reuse
  the previous run's plan.
- **New blocking overlay? Teach the runner.** `useBotRunner` only knows the
  overlays passed to it; an unhandled one stalls the run until the turn cap.
- Changing levels, targets, probes, recipes, scenarios, or the stop conditions
  means re-running `app/engine/bot/__tests__/strategy.integration.test.ts` (every
  level terminates, `novice` and `chaos` win, `pro` reaches `secret_ending` on
  every seed, seeds produce more than one ending, each probe is issued exactly
  once) **and** `goals.integration.test.ts` (all twelve endings reached on four
  seeds, every scenario meets its declared outcome, the sweep is all-green).
