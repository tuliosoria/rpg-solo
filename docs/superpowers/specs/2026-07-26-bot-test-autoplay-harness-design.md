# bot-test: Autoplay Test Harness — Design Spec

**Date:** 2026-07-26
**Status:** Draft for review (authored autonomously — see "Autonomous decisions" below)

## Problem

Testing the game's many endings and paths by hand is slow and error-prone. We want a
bot that **plays the game turn-by-turn like a real player while the developer watches**,
so we can (a) confirm the game is completable and see endings play out, and (b) surface
anything that breaks (errors, dead-ends, runaway detection) along the way.

The bot is activated after the tutorial with a `bot-test` command and can play at
different **knowledge levels**, from `dummy` (naive player) to `pro` (optimal player who
reaches the secret ending).

## Goals

1. Watch the bot play in the **real terminal UI**, command-by-command, with human-like
   pacing (commands echo and stream exactly as a person's would).
2. Provide a **spectrum of skill levels** so we can watch weak, mainline, and optimal
   playthroughs.
3. Make it a genuine **test tool**: report a run summary + an anomalies list that flags
   errors, unexpected detection spikes, and non-terminating runs.
4. **Never ship to players** — dev-only, and reproducible via a seed.

## Non-goals

- Not an AI/LLM agent. The strategy is deterministic, seeded, code-driven logic.
- Not a general "solve any narrative" engine. It targets *this* game's loop.
- Not a production feature, cheat, or accessibility aid.
- No automated CI assertion harness in this iteration (the bot reports; a human watches).
  A headless CI mode is a possible future follow-up, explicitly out of scope here.

## User-facing behavior

- **Activation (post-tutorial only):** `bot-test [level] [seed]`
  - `level` ∈ `dummy | novice | pro`. Default: `novice`.
  - `seed` optional integer for reproducibility. Default: derived from the game seed.
  - Before tutorial completion, the command is unknown (same as today).
- **Stopping:** `bot-stop`, **or** any real user keystroke in the input, immediately
  halts the bot and prints the run summary.
- **While running:** one command per "turn" is issued through the same submit path a
  human uses. The command text appears in the input line and is submitted, so the user
  sees exactly what the bot did and the normal output/streaming/UFO74 reactions play out.
- **Pacing:** a fixed, watchable per-turn delay (default ~900 ms), and the next turn only
  begins once the previous command has fully finished streaming (terminal is idle).
- **Completion:** the bot stops when an ending is reached, the game is over, `leak`
  resolves, a safety turn-cap is hit, or a no-progress loop is detected — then prints the
  summary.

### Levels (knowledge = completeness + care policy)

| Level | Explores | Evidence | Unlock steps | Detection care | Typical outcome / test purpose |
|---|---|---|---|---|---|
| `dummy` | Shallow (root + a couple dirs, a few files); some seeded near-miss commands | Saves whatever it reads | None | Ignores detection | Weak ending (`incomplete_picture`/`nothing_changes`), `hackerkid_caught`, or game-over. Exercises naive play, early `leak`, and game-over paths. |
| `novice` | All non-gated directories, reads most files | Saves all flagged evidence | `chat` with Prisoner 45 | Loose (`wait` only near-critical) | Solid mainline ending (e.g., `government_scandal` / `ufo74_exposed`). Exercises the "good player" mainline. |
| `pro` | Everything, incl. gated `/admin` & `/internal` files | Complete dossier | Solves morse, gets password via `chat`, `override` to unlock admin, opens `ghost_in_machine.enc` + secret-ending file set | Proactive (`wait`/`hide`, keeps detection low) | Best / secret / real ending with low detection. Exercises full content + optimal path + secret ending. |

Levels form a strict superset ladder: `pro` ⊇ `novice` ⊇ `dummy` in capability.

## Architecture

Clean split between a **pure decision core** (unit-testable) and a thin **runner** that
drives the existing React input pipeline.

```
bot-test / bot-stop command  ──sets──▶  state.botTest = { active, level, seed }
                                             │
                                   useBotRunner (Terminal.tsx, dev-only)
                                     ├─ waits for idle (!isProcessingRef) + delay
                                     ├─ decideNextCommand(state, memory, level, rng)  ← PURE
                                     ├─ handleSubmit(overrideInput)  ← real player path
                                     ├─ appends to runLog
                                     └─ on end → buildRunSummary(runLog) → print   ← PURE
```

### Components / files

| File | Responsibility |
|---|---|
| `app/engine/bot/types.ts` | `BotLevel`, `BotMemory`, `BotDecision`, `BotRunConfig`, `BotRunLog` types |
| `app/engine/bot/strategy.ts` | **Pure** `decideNextCommand(state, memory, level, rng) → { command, memory, done?, reason? }`. Phase state machine + per-level policy. Enumerates dirs/files from the **live VFS** (via the same `listDirectory` the engine uses), not hardcoded paths. |
| `app/engine/bot/rng.ts` | Small seeded PRNG (mulberry32 or reuse existing seeded RNG util) for reproducible `dummy` choices. |
| `app/engine/bot/report.ts` | **Pure** `buildRunSummary(runLog) → TerminalEntry[]` — summary + anomalies list. |
| `app/engine/commands/debug.ts` (new) | Registers `bot-test` and `bot-stop` (dev-gated). They only set/clear `state.botTest` and print an intro/stop banner. |
| `app/hooks/useTerminalInput.ts` | `handleSubmit` gains an optional `overrideInput?: string` param so the bot can submit a command without depending on async `setInputValue`. Human path unchanged (param defaults to current `inputValue`). |
| `app/hooks/useBotRunner.ts` (new) | The dev-only effect/loop: idle+delay gating, calls `decideNextCommand` + `handleSubmit(override)`, records `runLog`, detects termination, prints report. Any user keystroke or `bot-stop` halts. |
| `app/components/Terminal.tsx` | Wire `useBotRunner` (dev-gated); pass override-capable `handleSubmit`. |
| `app/types/index.ts` | Add optional `botTest?: BotRunConfig` to `GameState` (dev-only, **excluded from persistence**). |

### Decision core (phase state machine)

`decideNextCommand` inspects the current `GameState` (`filesRead`, `savedFiles`, `flags`,
`detectionLevel`, `waitUsesRemaining`, current path, prisoner/morse/admin state) plus a
small private `BotMemory` (visit queue, current phase, RNG cursor, last-command guard),
and returns the next command string. Phases:

1. **SURVEY** — `tree`/`ls` to enumerate; seed the directory + file work queues from the
   live VFS.
2. **EXPLORE_READ** — `cd` into queued dirs, `open` unread files.
3. **SAVE_EVIDENCE** — `save <file>` for evidence the game flagged on read.
4. **UNLOCK** *(novice+ / pro)* — `chat` (Prisoner 45), `morse`/`decode` (pro), `override`
   to unlock admin (pro).
5. **COLLECT_GATED** *(pro)* — explore `/admin` & `/internal`, `open ghost_in_machine.enc`
   and the secret-ending file set.
6. **MANAGE_DETECTION** — interleaved: if `detectionLevel` high and `waitUsesRemaining>0`,
   issue `wait` (novice near-critical; pro proactively).
7. **LEAK** — when saved-file count ≥ level threshold, `leak`.
8. **DONE** — ending/game-over/leak-resolved → `done`.

Per-level policy gates which phases run and how thorough each is, plus detection care and
whether `dummy` injects seeded near-miss commands.

### Termination & safety

- Stops on: ending reached, `isGameOver`, `leak` resolved, **max-turns cap** (default 400),
  or **no-progress loop detection** (same command N times with no state delta).
- `bot-stop` and any real user input immediately halt and print the summary.

### Reporting (test value)

On stop, `buildRunSummary` emits a terminal block:
- level, seed, turns taken, files read / saved counts, final detection level,
  ending type / outcome (or game-over reason);
- **Anomalies:** turns where a command returned an error/invalid result, unexpected
  detection spikes, or "reached max-turns without an ending."
- In dev, also `console.table` the transcript for debugging.

## Determinism & reproducibility

- `bot-test <level> <seed>` fully determines a run given fixed game content: same seed +
  same VFS ⇒ same command sequence and outcome.
- `dummy`'s randomness comes only from the seeded PRNG in `BotMemory`.

## Safety / production gating

- `bot-test` / `bot-stop` are **registered only when `process.env.NODE_ENV === 'development'`**
  (established pattern in this codebase, e.g. `app/storage/saves.ts:469`,
  `app/components/ErrorBoundary.tsx:37`). `useBotRunner` is inert outside development.
- `state.botTest` is **never persisted** to saves (dev-only field).
- Result: production/Steam/web players cannot discover or trigger autoplay. The developer
  runs it via `npm run dev`.

## Testing strategy

- **Pure unit tests** for `strategy.ts`: given crafted `GameState` + `BotMemory`, assert the
  next command per phase and per level (e.g., `dummy` leaks early; `pro` issues `override`
  after obtaining the password; detection-high triggers `wait`).
- **Pure unit tests** for `report.ts`: summary + anomaly formatting.
- **Seeded RNG test**: same seed ⇒ same sequence.
- **Integration smoke** (optional, jsdom): activating `bot-test` sets `state.botTest`;
  `bot-stop` clears it; `handleSubmit(overrideInput)` runs the override through the real path.
- Full suite + typecheck + build must stay green; `bot-test` absent from production behavior.

## Autonomous decisions (please review)

The developer was away and delegated these calls; flagging them for review:

1. **Purpose = "watch endings + catch breakage" (the mix).** Drives the report + anomalies.
2. **Three levels** `dummy | novice | pro` (not a large numeric scale) — smallest set that
   covers weak / mainline / optimal. Easy to add more later.
3. **Command form** `bot-test [level] [seed]` + `bot-stop`, rather than separate
   `bot-test-dummy`/`bot-test-pro` commands. Aliases can be added if preferred.
4. **Autoplay with fixed watchable delay** (not manual step-through). `bot-stop`/keystroke halts.
5. **Strategy driven by live VFS + completeness policy** (not hardcoded ending scripts), so
   it doesn't rot as content changes. Where a step needs a specific secret the bot can't
   derive (exact morse answer / admin password), prefer obtaining it via the same in-game
   flow a player uses; if impractical, read it from the game's own source-of-truth module
   (never a hand-copied literal). To be finalized in the plan.
6. **Dev-only gating** via `NODE_ENV`; never shipped to players.
7. **No headless CI mode** this iteration (human-watched only).
