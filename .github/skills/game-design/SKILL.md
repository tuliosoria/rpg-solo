---
name: game-design
description: Best practices for game mechanics, player experience, stealth systems, and narrative pacing.
---

# Game Design Principles for Terminal 1996

## Core Philosophy
- **Asymmetric risk with recovery windows**: Detection escalates but players need occasional relief
- **Tension curves**: 1-3 high-tension beats should be followed by a release moment
- **Non-binary states**: Use gradations (safe → suspicious → alerted → caught) not on/off
- **Player forgiveness**: Grace periods, warnings, and escape routes before failure

## Stealth & Detection System

### Current Mechanics (commands.ts)
- Detection level: 0-100 (100 = caught)
- Per-action increases: +1-15 based on risk
- Per-run variance: seeded RNG makes certain commands "hotter" or "safer"
- System hostility: 0-5, affects terminal personality

### Best Practices for Detection Changes
1. **Always warn before threshold**: At 70+ show urgent warnings, at 85+ screen effects
2. **Recovery should cost something**: Time, stability, or limited uses
3. **Major discoveries should provide relief**: Truth reveals = brief detection reduction
4. **Feedback must be immediate and clear**: Visual + audio cues on detection changes

## Adding New Commands

### In `app/engine/commands.ts`:
1. Add to `COMMANDS` object with handler function
2. Set appropriate detection/stability costs
3. Use `addToHistory()` for terminal output
4. Check `gameState` for prerequisites
5. Add to help text only if discoverable from start

### Detection Cost Guidelines
| Risk Level | Detection | Examples |
|------------|-----------|----------|
| Safe | 0 | help, status, notes |
| Low | +1-3 | ls, cd, open (normal files) |
| Medium | +5-8 | open (sensitive), trace |
| High | +10-15 | decrypt, override, recover |
| Recovery | -3 to -10 | wait, truth discoveries |

## Pacing & Tension

### Singular Events (one-time per run)
- Defined in `singularEventsTriggered` Set
- Trigger based on gameState conditions
- Should feel dramatic but not block progress
- Examples: THE ECHO, THE SILENCE

### Tension Breathers
- After major discoveries, briefly reduce pressure
- Can be: detection reduction, stability boost, or narrative pause
- Prevents player fatigue from constant escalation

## State Management

### Key GameState Fields
```typescript
detectionLevel: number;      // 0-100
dataIntegrity: number;       // 100-0
accessLevel: number;         // 0-5
sessionStability: number;    // 100-0
systemHostility: number;     // 0-5
truthsDiscovered: Set<string>;
singularEventsTriggered: Set<string>;
```

### Flags & Gating
- `requiredFlags`: Array of flags that must be set to access content
- `accessThreshold`: Minimum access level required
- Flags set via `gameState.flags.add('flagName')`

## Testing Requirements
- Add tests in `app/engine/__tests__/` for new mechanics
- Test edge cases: max detection, zero stability, flag combinations
- Use existing test patterns from `narrative-mechanics.test.ts`
