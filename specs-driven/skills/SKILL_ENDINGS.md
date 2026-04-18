# SKILL: Endings

> Use when: working on any ending screen, ending evaluation logic, or dossier pattern matching.

---

## Before You Touch Endings

1. Read [ENDINGS.md](../ENDINGS.md) — understand all 12 endings, their triggers, and their priority order
2. Read [MECHANICS.md](../MECHANICS.md) — understand the leak system and evidence counter
3. Read [NARRATIVE.md](../NARRATIVE.md) — understand what each ending means in the story

## Ending Evaluation Flow

```
Player triggers leak → evidence.ts evaluates saved files
  → Each file classified into 1+ of 15 categories
  → Categories compared against ending trigger conditions
  → Endings checked in priority order (1–12)
  → First match wins
  → If no match → Ending 12 (Ridiculed) as fallback
```

## Checklist for Ending Changes

### Trigger Logic
- [ ] File categories correctly map to the ending
- [ ] Priority order is preserved (no ending shadows another incorrectly)
- [ ] Fallback to Ridiculed works when no other ending matches
- [ ] Edge cases: exactly 5 files, exactly 10 files, mixed categories

### AOL Breaking News Screen
- [ ] Headline is punchy, 1996 news style
- [ ] Body text is journalistic, period-appropriate
- [ ] All text translated to PT-BR and ES (check locale files)
- [ ] Correct ending image filename from `ending_images/` folder
- [ ] Correct music variant plays (ending track)
- [ ] AOL browser chrome renders correctly

### Post-Ending Flow
- [ ] Achievement unlocked notification fires
- [ ] Statistics summary displays correctly
- [ ] Return to menu works
- [ ] Game state resets cleanly for new game

## Testing All Endings

Use `god ending <number>` (1–12) to force each ending:

```
god ending 1   → HackerKid Caught
god ending 2   → Secret Ending
god ending 3   → UFO74 Exposed
god ending 4   → Real Ending
god ending 5   → Deep State
god ending 6   → Alien Autopsy
god ending 7   → Whistleblower
god ending 8   → Containment Breach
god ending 9   → Mass Hysteria
god ending 10  → Men in Black
god ending 11  → Cover Up
god ending 12  → Ridiculed
```

For each ending, verify:
1. Correct headline and body text display
2. Correct image loads
3. Music plays
4. Text is correct in all three languages
5. Achievement fires
6. Return to menu works cleanly

## After Every Ending Change

1. Test the specific ending via `god ending <N>`
2. Test in all three languages
3. Test the trigger condition with actual file combinations (not just god mode)
4. Confirm no other ending's trigger was affected
5. Update ENDINGS.md with any changes to trigger logic or AOL text
