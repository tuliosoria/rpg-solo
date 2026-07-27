/**
 * Kill-switch for the production autoplay hack.
 *
 * The `bot-test` / `bot-stop` commands let a developer watch the game play
 * itself turn-by-turn (see
 * docs/superpowers/specs/2026-07-26-production-bot-hack-design.md). They are
 * intentionally NOT in `PUBLIC_COMMANDS`, so they never appear in `help`, Tab
 * completion, or typo suggestions — a player can only reach them by typing the
 * exact command string.
 *
 * TO DISABLE: set this to `false` and redeploy `main`. The commands vanish from
 * production; development keeps them via the NODE_ENV clause in
 * `app/engine/commands/index.ts`.
 */
export const BOT_ENABLED = true;
