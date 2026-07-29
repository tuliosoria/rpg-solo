/**
 * The command surface the `chaos` level pokes at between useful turns.
 *
 * The bot beelines by design: `novice` and `pro` only ever type `open`, `save`,
 * `override` and `leak`, so a clean run proves the win path works and says
 * nothing at all about the other two dozen commands. That gap is not
 * theoretical — a locale sweep found the `hint` line shown at the exact moment
 * the dossier fills, and the whole of PRISONER_45's dialogue, shipping in
 * English to every language. Neither is on the win path, so no bot run had ever
 * executed them.
 *
 * Each entry is issued exactly once per run, in order, so a `chaos` run stays
 * bounded and still terminates on its own.
 *
 * Deliberately included:
 *  - every command in `PUBLIC_COMMANDS`, in its bare form;
 *  - malformed and missing arguments, which is where error copy lives;
 *  - a typo and an unknown word, which drive the suggestion path;
 *  - `chat` topics, which reach a large branching dialogue table.
 *
 * Deliberately excluded: anything that ends the run early or spends a resource
 * the win path needs — no `leak` (it is the win condition), and nothing that
 * can push `wrongAttempts` to the 8-strike game over on its own. Bare
 * `override` is excluded for that reason: with no arguments it falls through to
 * `createInvalidCommandResult`, so it is a strike rather than a usage hint.
 *
 * Also excluded: `tutorial` with no argument. It is a documented, deliberate
 * player action, but it restarts the introduction — `tutorialComplete: false`
 * and `history: []` — which puts the session back under the interactive
 * tutorial's control. A probe that does that stops probing and starts
 * rewriting the run: in the first `chaos` sweep every turn after it reported
 * empty output and "changed nothing", which read like twenty separate engine
 * bugs and was one self-inflicted wound. `tutorial off` is safe and covers the
 * argument path.
 *
 * And `clear`, for the same reason in miniature: its entire job is to set
 * `history: []`. Probing it proves only that it does not crash, at the cost of
 * erasing the run a human is sitting there watching — and the run summary is
 * printed into that same history.
 *
 * And bare `save`, which is not an engine command at all. `useTerminalInput`
 * intercepts it before `executeCommand` and opens the save-session modal, which
 * `useBotRunner` has never been told about — it is owned by `HomeContent`, one
 * level above the terminal, so the runner cannot even see it to dismiss it. A
 * live `chaos` run left that modal on screen for its remaining twenty turns.
 * Headlessly the same probe was worse than useless: it exercised an engine
 * branch the player can never reach, and reported it as covered. `save` with an
 * argument is a real command and stays.
 */
export const BOT_PROBE_COMMANDS: readonly string[] = [
  // Bare public commands.
  'help',
  'status',
  'progress',
  'ls',
  'tree',
  'map',
  'unread',
  'last',
  'notes',
  'trace',
  'hide',
  'morse',
  'hint',
  'wait',
  'back',
  'message',
  'tutorial off',

  // Arguments, good and bad. Error copy is only reachable from the bad ones.
  'ls /internal',
  'cd /internal',
  'cd ..',
  'help open',
  'help save',
  'search alpha',
  'search zzzqqq',
  'note the coffee harvest memo is not about coffee',
  'open',
  'save nosuchfile.txt',
  'unsave',
  'run',

  // Dialogue. Each topic lands in a different branch of the response table.
  'chat',
  'chat varginha',
  'chat alien',
  'chat password',
  'chat escape',
  'chat god',
  'chat family',
  'chat hope',

  // The suggestion path: one near-miss, one word that is not a command at all.
  'hlep',
  'xyzzy',
] as const;

/**
 * The probes the parser is *supposed* to refuse.
 *
 * Every other probe is a real command and a rejection would be a finding, so
 * the run summary flags rejection even on probe turns. These two exist to drive
 * the "did you mean" path, which cannot be reached without being refused first —
 * without saying so, they would report an anomaly on every single `chaos` run.
 */
export const BOT_PROBES_EXPECTING_REJECTION: ReadonlySet<string> = new Set([
  'hlep',
  'xyzzy',
]);
