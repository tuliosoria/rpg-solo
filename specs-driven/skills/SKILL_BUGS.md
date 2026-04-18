# SKILL: Bugs

> Use when: investigating or fixing any bug.

---

## Before You Fix

1. Read [MECHANICS.md](../MECHANICS.md) — understand the system the bug lives in
2. Read [GAME_CONTEXT.md](../GAME_CONTEXT.md) — understand the full game context
3. Reproduce the bug — confirm it exists and document the exact reproduction steps

## Bug Severity Classification

### Critical
- Game crashes or becomes unplayable
- Data loss (save corruption, state loss)
- Security issue (credential exposure, XSS)
- Ending logic produces wrong ending
- Command completely broken in any language
- Untranslated strings visible to player in non-English language

### Major
- Feature works incorrectly but game is playable
- Visual glitch that breaks immersion significantly
- Audio not playing when it should
- Detection calculation wrong
- Positioning/layout broken on common screen sizes

### Minor
- Cosmetic issues
- Typos in content
- Dead code
- Inconsistent formatting
- Edge cases that rarely occur

## Fix Process

1. **Document** the bug before fixing:
   - File and line number
   - Expected behavior (per MECHANICS.md)
   - Actual behavior
   - Reproduction steps
   - Severity classification

2. **Fix** in order of severity: Critical → Major → Minor

3. **Test** the fix against the full mechanic spec in MECHANICS.md:
   - Does the fix resolve the specific bug?
   - Does it break any adjacent system?
   - Does it work in all three languages?
   - Does it work at different detection levels?

4. **Verify** related systems:
   - If fixing a command: test the command in EN, PT-BR, ES
   - If fixing detection: test all detection thresholds
   - If fixing endings: run `god ending <N>` for all 12
   - If fixing UI: test at common resolutions

## Common Bug Patterns

- **Substring matching** — `.includes()` on search terms matching innocent words
- **Hardcoded English** — strings not going through translation pipeline
- **Dynamic templates** — `${var}` strings not using `createEntryI18n`
- **Position: fixed** — Elements positioning against browser instead of game bezel
- **Timer intervals** — Fixed values instead of random ranges per spec
- **State mutations** — Direct state changes instead of using Zustand actions

## After Every Fix

1. Test the specific fix
2. Test adjacent systems
3. Run the build — confirm no new errors
4. Run validate-translations if i18n was touched
5. Update plan.md with fix status
