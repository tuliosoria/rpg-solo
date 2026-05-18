---
name: i18n
description: Guidance for changing player-facing strings, locale JSON, runtime translation supplements, and command aliases.
---

# Internationalization Workflow

Use this skill any time you touch player-facing English text, a locale file, a runtime translation supplement, or a command name/alias.

## Translation Layers

This repo has three translation layers — each has a different purpose and a different update path.

1. **Locale JSON (`app/locales/{en,es,pt-br}.json`)**
   - Keyed strings used through the `t()` / i18n hook.
   - `en.json` is the source of truth. `es.json` and `pt-br.json` must have **identical keys**.
   - Update all three together. Never add a key only to `en.json`.

2. **Runtime translation supplements (`app/i18n/runtime.ts`, `app/i18n/runtimeCommandSupplement.ts`)**
   - Map raw English engine output (free strings, command help bodies, in-document text) to per-language translations for pt-BR and ES.
   - If you add or rename an English engine string that flows through `translateRuntimeText` / `tSystem` fallbacks, add or update the matching pt-BR and ES entries here.
   - Keep placeholder formatting consistent across languages (`{{count}}`, `<arquivo>` for pt-BR, `<archivo>` for ES).

3. **Command aliases (`app/engine/commands/utils.ts`)**
   - `COMMAND_ALIASES`: translated command names → canonical English command name (e.g. `'salvar' → 'save'`, `'guardar' → 'save'`).
   - `COMMAND_TRANSLATIONS`: canonical English command → per-language translated name. Used in localized help/tutorial output.
   - When you add or rename a player-facing command, update both maps and the localized help/tutorial strings so the alias the player sees in help is the one they can actually type.

## When to Use This Skill

- Adding, renaming, or removing a player-facing command.
- Changing any English string that ships in engine output, help, tutorial, or document content.
- Adding or editing locale JSON values.
- Updating `COMMAND_ALIASES` or `COMMAND_TRANSLATIONS`.
- Fixing reports of missing translations, mixed-language help output, or untyped placeholders.

## Practical Workflow

1. **Find every layer the change touches.** Most player-facing string changes need updates in (a) the locale JSON, (b) the runtime supplement(s), and (c) any localized command alias/help text.
2. **Keep localized commands self-consistent.** If pt-BR aliases `save` as `salvar`, the localized help/tutorial text must show `salvar <arquivo>`, not `save <filename>`. Same pattern for ES (`guardar <archivo>`).
3. **Verify locale key parity** before committing. From the repo root:

   ```bash
   node -e "const fs=require('fs'); const files=['app/locales/en.json','app/locales/es.json','app/locales/pt-br.json']; const data=Object.fromEntries(files.map(f=>[f,JSON.parse(fs.readFileSync(f,'utf8'))])); const keys=Object.fromEntries(Object.entries(data).map(([f,o])=>[f,Object.keys(o).sort()])); for (const f of files) console.log(f+': '+keys[f].length); for (const pair of [['app/locales/en.json','app/locales/es.json'],['app/locales/en.json','app/locales/pt-br.json']]) { const a=pair[0], b=pair[1]; const A=new Set(keys[a]), B=new Set(keys[b]); const missing=[...A].filter(k=>!B.has(k)); const extra=[...B].filter(k=>!A.has(k)); console.log(b+' missing vs en: '+missing.length); if(missing.length) console.log(missing.join('\n')); console.log(b+' extra vs en: '+extra.length); if(extra.length) console.log(extra.join('\n')); }"
   ```

4. **Spot accidentally-untranslated values** (values identical to English) before review:

   ```bash
   node -e "const fs=require('fs'); const en=JSON.parse(fs.readFileSync('app/locales/en.json','utf8')); for (const loc of ['es','pt-br']) { const data=JSON.parse(fs.readFileSync('app/locales/'+loc+'.json','utf8')); const same=[]; for (const [k,v] of Object.entries(en)) { if (typeof v==='string' && data[k]===v) same.push(k); } console.log('same-as-en '+loc+': '+same.length); console.log(same.slice(0,50).join('\n')); }"
   ```

   Some keys are legitimately the same (proper nouns, ASCII art, command names). Use the list as a review hint, not an automatic failure signal.

## What to Test

- **Targeted i18n suite:** `npm test -- app/i18n/__tests__/i18n.test.tsx app/engine/__tests__/system-commands.test.ts`
- **Full suite:** `npm test` — required when locale changes touch any string asserted by other tests (engine output, snapshots, terminal/menu tests).
- **Story validators:** `npm run validate-story` if a translation change rides along with narrative/data content.
- **E2E:** `npm run e2e` only if the change affects strings asserted by Playwright (`e2e-tests/*.spec.ts`).

See the `testing` skill for the broader validation decision tree.

## Pitfalls

- **Key drift.** Adding a key to only one locale silently degrades the missing-language experience. Always run the parity check above.
- **Mixed-language help.** Localized help/tutorial output must use the localized command alias, not the English command. E.g. pt-BR help should say `salvar <arquivo>`, not `save <filename>`.
- **Placeholder regressions.** Keep `{{token}}` placeholders byte-identical to the English source so the i18n interpolator binds correctly. Likewise keep `<arquivo>`/`<archivo>` markers consistent.
- **Shell quoting on Windows.** Prefer plain `node -e "..."` strings with double quotes around the entire script and single quotes inside. Avoid nested backticks or template literals — they get mangled by PowerShell.
- **Runtime supplement misses.** If `t('key')` falls back to English when the locale is pt-BR or ES, the supplement entry is missing or its source key string has drifted. Re-check the English source string spelling exactly.
- **Alias gaps.** Adding a new command without updating `COMMAND_ALIASES` and `COMMAND_TRANSLATIONS` leaves localized players unable to type the command they see in help.
