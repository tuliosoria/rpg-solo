# SKILL: Commands

> Use when: adding, modifying, removing, aliasing, or renaming any command;
> changing a command's detection cost, output, subcommands, or any string
> that mentions a command name.

---

## Before You Add or Change a Command

1. Read [MECHANICS.md](../MECHANICS.md) — Commands — Full Reference section.
2. Read [LANGUAGES.md](../LANGUAGES.md) — Command Word Translations table and
   Terms That Stay in English list.
3. Read `app/engine/commands/utils.ts` — understand `COMMAND_ALIASES`,
   `COMMAND_TRANSLATIONS`, `resolveCommandAlias`, `localizedCommandName`,
   `SUBCOMMAND_ALIASES`, `resolveSubcommandAlias`.
4. Search adjacent commands for the same pattern you're about to apply
   (adding a `hide` alias? Check what `wait` does. Adding a subcommand? Check
   how `help` does it.).

## The Command Pipeline

```
input string
  → parseCommand()              (app/engine/commands/utils.ts)
  → resolveCommandAlias()       (translated word → canonical English)
  → handler dispatch            (app/engine/commands/*.ts)
  → createEntry / createEntryI18n   (per SKILL_TRANSLATION.md decision tree)
  → Terminal render             (active locale applied at render time)
```

Each arrow is a place a command can break in EN, PT-BR, or ES independently.

## The Display Rule

> **Every command name rendered in player-visible output MUST be wrapped in
> `localizedCommandName(cmd, lang)`.** Never embed a literal command word
> (`save`, `hide`, `help basics`, etc.) in a locale string or in a fallback
> string handed to `createEntry*`.

Applies to: help bodies, UFO74 dialogue, system warnings, error messages,
tutorial hints, low-stability messages, ending dialogue, leaked-credentials
echoes — anywhere a command name appears as content.

Two exceptions:
- The string echoes the player's literal typed input (e.g., "command not
  recognized: <input>"). Keep the input verbatim.
- The command is on the LANGUAGES.md "Terms That Stay in English" list
  (`ls`, `cd`, `tree`, `link`, `morse`, `trace`, `chat`, `script`, `run`,
  `override protocol`, `god mode`, `god ending`).

## Checklist for Every Command Change

- [ ] `COMMAND_ALIASES` updated for every supported translation
- [ ] `COMMAND_TRANSLATIONS[locale]` updated symmetrically (round-trip works)
- [ ] `SUBCOMMAND_ALIASES` updated if the command has subcommands
- [ ] Handler registered/updated in the correct file under `app/engine/commands/`
- [ ] Every rendered command name uses `localizedCommandName()` per the
      Display Rule
- [ ] MECHANICS.md Commands — Full Reference row added/updated, including the
      Aliases column
- [ ] LANGUAGES.md Command Word Translations row added/updated (or the command
      is justified on the Terms That Stay in English list)
- [ ] Detection cost is consistent with adjacent commands of the same class
      (technical / investigation / recovery / risky) — see SKILL_BALANCE.md
      when it exists
- [ ] Locale strings exist in `app/locales/en.json`, `pt-br.json`, `es.json`
- [ ] Tests cover EN + PT-BR + ES (input parsing AND display) under
      `app/engine/commands/__tests__/` and `app/i18n/__tests__/`
- [ ] Adjacent-command audit: any sibling command with the same pattern that
      should get the same treatment? If yes, do it now or open a follow-up.

## Adding a New Command

1. Register canonical English form in handler dispatch.
2. Add row to MECHANICS.md and LANGUAGES.md (or justify on Terms list).
3. Add aliases in both `COMMAND_ALIASES` and `COMMAND_TRANSLATIONS`.
4. Author all user-visible strings via `createEntryI18n`, applying the Display
   Rule for any embedded command names.
5. Add tests: parsing (EN/PT/ES inputs route to the same handler) and display
   (output strings show localized names per active locale).

## Modifying an Existing Command

1. Reproduce current behavior in all three languages before editing.
2. Apply change end-to-end through every pipeline stage. Re-run the Checklist.
3. Update MECHANICS.md / LANGUAGES.md if behavior, cost, or aliases changed.

## Removing a Command

1. Delete handler + alias entries + subcommand entries.
2. Delete or replace every locale string that referenced the command name.
3. Remove from MECHANICS.md and LANGUAGES.md. Audit endings, files, and UFO74
   hints that pointed at it.

## Common Command Bugs

See also SKILL_BUGS.md — Common Bug Patterns.

- **English leak in non-English output** — Display Rule violated.
- **Asymmetric alias maps** — translated word resolves to English but English
  doesn't translate back; `localizedCommandName` returns the wrong name.
- **Subcommand not accent-insensitive** — diacritic-stripping skipped at
  lookup; `ajuda basica` fails to resolve to `help basics`.
- **Adjacent-command drift** — sibling command (`wait`/`hide`, `save`/`unsave`)
  treated differently from its pair.
- **MECHANICS/code drift** — Aliases column says `—` but code has aliases, or
  vice versa.
- **Test only covers EN** — i18n bugs slip through. Tests must include PT-BR
  and ES paths for both parsing and display.

## After Every Change

1. `npm test` — all command and i18n suites pass
2. `npm run typecheck` — clean
3. `npm run lint` — clean
4. `npm run validate-story` — story still parses
5. `npm run build` — production bundle builds
6. Manual smoke: switch language mid-session (EN → PT-BR → ES → EN), invoke
   the command in each, confirm display is fully localized.
7. Update plan.md / PR description with what changed.
