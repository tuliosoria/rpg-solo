# SKILL: Translation

> Use when: any string is created or changed in any language.

---

## Before You Translate

1. Read [LANGUAGES.md](../LANGUAGES.md) — understand the three languages, tone requirements, exempt terms
2. Know the translation pipeline — is this a locale key, runtime dictionary entry, or dynamic template?
3. Check the current state — does this string already exist in all three languages?

## Translation Pipeline Decision Tree

```
Is it a UI label, menu item, overlay text, or button?
  → Use locale files (en.ts / pt.ts / es.ts) with i18n key
  → Access via tSystem() or t() wrapper

Is it command output that appears in the terminal?
  → Option A: Use createEntryI18n(type, key, fallback, { values })
    → Best for strings with dynamic interpolation
    → Requires locale key in all three files
  → Option B: Use createEntry(type, content) with matching runtime dictionary entry
    → Best for static strings that need runtime lookup
    → Requires entry in runtime.ts or runtimeCommandSupplement.ts

Is it a dynamic template string with ${variable}?
  → MUST use createEntryI18n with interpolation values
  → createEntry will NOT translate these (string won't match dictionary)
```

## Tone Enforcement

### Portuguese BR
- 1990s Brazilian military and government register
- Formal. Slightly bureaucratic. NOT modern casual.
- "Acesso negado." not "Acesso bloqueado, mano"
- Passive voice where institutional: "Foi determinado que..."
- Military terms: efetivo, contingente, operacional, destacamento, protocolo

### Spanish (Latin American)
- Formal. Neutral accent. Same institutional weight.
- NOT Spain Spanish. No vosotros. No Iberian idioms.
- ustedes, computadora, celular
- "Acceso denegado." not "No puedes entrar"

## Exempt Terms (Never Translate)

- Unix commands: ls, cd, tree, link, grep
- Filenames and extensions: .txt, .log, .enc, .psi
- Codenames: ALPHA, UFO74, HackerKid, COLHEITA, PRISONER_45
- Technical syntax: override protocol, link disarm, god mode

## After Every Translation Change

1. Update all three locale files (or runtime dictionary files)
2. Run `validate-translations`
3. Confirm zero missing keys
4. Test in-game rendering in all three languages
5. Confirm language switching mid-session does not corrupt state
6. Update FILES_REGISTRY.md translation status if file content changed
