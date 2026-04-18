# LANGUAGES — Varginha: Terminal 1996

> Complete language reference. Translation rules, command word table, tone requirements.

---

## Supported Languages

| Language | Code | Key | Status |
|----------|------|-----|--------|
| English | `en` | Default | Complete |
| Portuguese (Brazil) | `pt-BR` | `pt` in index | Complete |
| Spanish (Latin America) | `es` | `es` in index | Complete |

---

## Translation Architecture

### Source Files

| File | Lines | Purpose |
|------|-------|---------|
| `app/i18n/locales/en.ts` | ~5500 | English locale (static UI, menus, overlays) |
| `app/i18n/locales/pt.ts` | ~5500 | Portuguese BR locale |
| `app/i18n/locales/es.ts` | ~5500 | Spanish locale |
| `app/i18n/runtime.ts` | ~3200 | Runtime translations for dynamic command output |
| `app/i18n/runtimeCommandSupplement.ts` | ~2300 | Additional runtime translations for command-specific output |

### Translation Pipeline

1. **Static strings** (UI labels, menus, overlays): Use `tSystem()` or `t()` wrapper → reads from locale files via i18n keys.
2. **Command output** (terminal responses): Use `createEntryI18n(type, key, fallback, values)` → reads from locale files at render time.
3. **Runtime-translated strings**: Use `createEntry(type, content)` → content passes through `translateRuntimeText()` in Terminal.tsx (line 381) → matched against runtime dictionary.
4. **Fallback chain:** Requested language → English → raw fallback text → key itself. Never render a raw translation key to the player.

### Language Selection

- Stored in `localStorage` key: `terminal1996_language`
- Changed via Settings modal
- Applied immediately without page reload
- Affects all terminal output, UI labels, and command parsing

---

## Command Word Translations

Commands that translate — the player types the translated word:

| English | Portuguese BR | Spanish |
|---------|--------------|---------|
| `help` | `ajuda` | `ayuda` |
| `save` | `salvar` | `guardar` |
| `unsave` | `remover` | `quitar` |
| `open` | `abrir` | `abrir` |
| `search` | `buscar` | `buscar` |
| `leak` | `vazar` | `filtrar` |
| `wait` | `esperar` | `esperar` |
| `progress` | `progresso` | `progreso` |
| `hint` | `dica` | `pista` |
| `note` | `nota` | `nota` |
| `notes` | `notas` | `notas` |
| `status` | `estado` | `estado` |
| `clear` | `limpar` | `limpiar` |
| `last` | `ultimo` | `ultimo` |

### Implementation

Aliases are registered in `COMMAND_ALIASES` map (`app/engine/commands/utils.ts:113-145`). The `resolveCommandAlias()` function maps translated commands back to English for the parser. `parseCommand()` calls `resolveCommandAlias()` before processing.

---

## Terms That Stay in English (All Languages)

### Unix Commands (Technical Acronyms)
- `ls`, `cd`, `tree`, `link`, `grep`, `cat`, `chmod`, `trace`

### Filenames and Extensions
- All file names: `autopsy_report.txt`, `neural_dump_alfa.psi`, etc.
- All extensions: `.txt`, `.log`, `.enc`, `.psi`, `.red`, `.sig`, `.meta`, `.dat`

### Codenames and Proper Nouns
- ALPHA, UFO74, HackerKid, COLHEITA, Protocol SOMBRA
- PRISONER_45, The Firewall, The Scout

### Technical Terms
- `override protocol` — command syntax stays English
- `link disarm` — stays English
- `god mode`, `god ending` — debug commands stay English
- `morse` — stays English
- Version tag in terminal header

### Directory Names (for input)
- Player always types English directory names: `containment`, `surveillance`, etc.
- Display names translate in terminal output only

---

## Status Tag Translations

| English | Portuguese BR | Spanish |
|---------|--------------|---------|
| `[UNREAD]` | `[NÃO LIDO]` | `[NO LEÍDO]` |
| `[READ]` | `[LIDO]` | `[LEÍDO]` |
| `[CORRUPTED]` | `[CORROMPIDO]` | `[CORROMPIDO]` |
| `[CLASSIFIED]` | `[CLASSIFICADO]` | `[CLASIFICADO]` |
| `[SAVED]` | `[SALVO]` | `[GUARDADO]` |
| `[LOCKED]` | `[BLOQUEADO]` | `[BLOQUEADO]` |
| `[OVERRIDE]` | `[OVERRIDE]` | `[OVERRIDE]` |
| `[BOOKMARKED]` | `[MARCADO]` | `[MARCADO]` |

---

## Directory Display Name Translations

Directory names translate for DISPLAY ONLY. The player always types the English directory name.

| English | Portuguese BR | Spanish |
|---------|--------------|---------|
| `containment` | `contenção` | `contención` |
| `surveillance` | `vigilância` | `vigilancia` |
| `communications` | `comunicações` | `comunicaciones` |
| `personnel` | `pessoal` | `personal` |
| `operations` | `operações` | `operaciones` |
| `research` | `pesquisa` | `investigación` |
| `classified` | `classificado` | `clasificado` |

---

## Tone Requirements

### Portuguese BR
- **Register:** Formal. Slightly bureaucratic. Authentic to 1990s Brazilian military and government language.
- **NOT:** Modern casual Portuguese. No internet slang. No colloquialisms post-2000.
- **Examples:**
  - "Acesso negado." (not "Acesso bloqueado, mano")
  - "Procedimento de verificação iniciado." (not "Checando...")
  - "Arquivo comprometido. Integridade não pode ser confirmada." (not "Arquivo zoado")
- **Military flavor:** Use terms like "efetivo," "contingente," "operacional," "destacamento," "protocolo"
- **Government flavor:** Use passive voice where appropriate. "Foi determinado que..." / "Não foi possível confirmar..."

### Spanish (Latin American)
- **Register:** Formal Latin American Spanish. Neutral accent. Same institutional weight as Portuguese.
- **NOT:** Spain Spanish. No vosotros. No Iberian idioms.
- **Examples:**
  - "Acceso denegado." (not "No puedes entrar, tío")
  - "Procedimiento de verificación iniciado." (not "Checando...")
  - "Archivo comprometido. No se puede confirmar la integridad." (not "Archivo roto")
- **Use:** ustedes (not vosotros), computadora (not ordenador), celular (not móvil)
- **Military formality:** Same bureaucratic DNA as the Portuguese. These are institutional documents, not casual conversation.

### English
- **Register:** Default. Clean, professional, slightly clinical.
- **Military documents:** Terse. Acronym-heavy. Procedure-focused.
- **UFO74:** Lowercase, minimal punctuation, casual but precise.
- **System messages:** Neutral. Informational. No personality.

---

## Validation

A `validate-translations` script checks:
1. Every key in EN locale exists in PT and ES
2. No string is hardcoded outside the translation index
3. No key is referenced in code but missing from locale files
4. No locale file has keys missing from EN (orphaned translations)
5. Output: clean report of missing, stale, and orphaned keys
6. Build fails if any Critical key is missing or untranslated

---

## Retranslation Rules

A string must be retranslated when:
- English source text changes
- Tone or register requirements change
- A bug report identifies incorrect translation
- A new context reveals the translation doesn't fit (e.g., military term used in casual context)

After any retranslation:
1. Update all three locale files
2. Update runtime.ts / runtimeCommandSupplement.ts if applicable
3. Run validate-translations
4. Confirm in-game rendering in all three languages
