---
name: commands
description: Rules for adding, modifying, removing, or renaming any player command and the strings that display its name.
---

# Commands Workflow

Use this skill when adding, modifying, removing, aliasing, or renaming any
command; changing a command's detection cost, output, subcommands, or any
string that mentions a command name.

## Start Here

- Read `specs-driven/MECHANICS.md` — Commands — Full Reference section.
- Read `specs-driven/LANGUAGES.md` — Command Word Translations table and
  Terms That Stay in English list.
- Read `app/engine/commands/utils.ts` — understand `COMMAND_ALIASES`,
  `COMMAND_TRANSLATIONS`, `resolveCommandAlias`, `localizedCommandName`,
  `SUBCOMMAND_ALIASES`, `resolveSubcommandAlias`.
- Find an adjacent command with the pattern you're about to apply
  (adding a `hide` alias → look at `wait`; adding a subcommand → look at
  `help`) and copy its shape.

## The Command Pipeline

```
input string
  → parseCommand()              (app/engine/commands/utils.ts)
  → resolveCommandAlias()       (translated word → canonical English)
  → handler dispatch            (app/engine/commands/*.ts)
  → createEntry / createEntryI18n   (translation entry)
  → Terminal render             (active locale applied at render time)
```

Each arrow is a place the command can break in EN, PT-BR, or ES independently.

## The Display Rule

> **Every command name rendered in player-visible output MUST be wrapped in
> `localizedCommandName(cmd, lang)`.** Never embed a literal command word
> (`save`, `hide`, `help basics`, …) in a locale string or in a fallback
> string handed to `createEntry*`.

Applies to: help bodies, UFO74 dialogue, system warnings, error messages,
tutorial hints, low-stability messages, ending dialogue — anywhere a command
name appears as content.

Exceptions:
- The string echoes the player's literal typed input ("command not
  recognized: <input>"). Keep the input verbatim.
- The command is on the LANGUAGES.md "Terms That Stay in English" list
  (`ls`, `cd`, `tree`, `link`, `morse`, `trace`, `chat`, `script`, `run`,
  `override protocol`, `god mode`, `god ending`).

## Checklist for Every Command Change

- [ ] `COMMAND_ALIASES` updated for every supported translation
- [ ] `COMMAND_TRANSLATIONS[locale]` updated symmetrically (round-trips)
- [ ] `SUBCOMMAND_ALIASES` updated if the command has subcommands
- [ ] Handler registered/updated in the correct `app/engine/commands/` file
- [ ] Every rendered command name uses `localizedCommandName()` (Display Rule)
- [ ] `MECHANICS.md` Commands — Full Reference row added/updated, incl. Aliases
- [ ] `LANGUAGES.md` row added/updated (or justified on Terms list)
- [ ] Detection cost consistent with adjacent commands of the same class
- [ ] Locale strings exist in `en`, `pt-BR`, `es`
- [ ] Tests cover EN + PT-BR + ES — both parsing AND display
- [ ] Adjacent-command audit done (sibling patterns updated or filed)

## Common Pitfalls

- **English leak in non-English output** — Display Rule violated.
- **Asymmetric alias maps** — translated word resolves to English but English
  doesn't translate back; `localizedCommandName` returns the wrong name.
- **Subcommand not accent-insensitive** — diacritic-stripping skipped at
  lookup; `ajuda basica` fails to resolve to `help basics`.
- **Adjacent-command drift** — sibling command (`wait`/`hide`, `save`/`unsave`)
  treated differently from its pair.
- **MECHANICS/code drift** — Aliases column says `—` but code has aliases,
  or vice versa.
- **Test only covers EN** — i18n bugs slip through. See the `testing` skill's
  Three-Language Rule.

## After Every Command Change

1. `npm test`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run validate-story`
5. `npm run build`
6. Manual smoke: switch language mid-session (EN → PT-BR → ES → EN), invoke
   the command in each, confirm display is fully localized.
