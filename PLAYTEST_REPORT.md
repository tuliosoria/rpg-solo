# Terminal 1996 - Playtest Report
## Project Normandy: Full Playtest and Refinement

**Date:** 2026-02-15
**Tester:** Mordin (Sub-agent)
**Tests Passed:** 1121/1121 ✅

---

## PLAYTEST METHODOLOGY RESULTS

### 1. Tutorial Flow Test ✅

**Status:** VERIFIED

- **Start fresh game:** Works correctly via interactive tutorial system
- **Follow tutorial prompts:** Tutorial steps guide through `ls`, `cd`, `open` commands
- **UFO74 introduction:** UFO74 appears as ally hacker, proper IRC-style communication
- **Firewall jumpscare:** Firewall eyes trigger at 25% detection threshold, increase detection by 5% on detonation
- **Skip tutorial option:** `skip` command available during tutorial

**Tests Validated:**
- `tutorial-system.test.ts` - 13 tests
- Interactive tutorial autocomplete working correctly (fixed filename-only return)

---

### 2. Core Gameplay Loop Test ✅

**Status:** VERIFIED

- **Navigate filesystem:** `ls`, `cd`, `open` commands work correctly
- **Find and decrypt encrypted files:** `decrypt` command with security questions
- **Security questions have findable answers:**
  - `340` (material weight) → found in `transport_log_96.txt`
  - `3` (subjects recovered) → found in `bio_container.log`
  - `7-ECHO` (protocol) → found in `foreign_liaison_note.txt`
  - `ALFA` (subject designation) → found in `autopsy_alpha.log`
  - `2026` (transition year) → found in multiple docs

- **Detection system:** Increases appropriately with actions
  - Invalid commands: +2 detection
  - Decrypt attempts: +12 detection
  - Scan command: +10 detection
  - Rewind command: +5 detection
  - Warmup phase (first 4 files): No detection increase

- **Hint command:** 
  - Maximum 4 hints
  - +5 detection penalty after tutorial
  - No penalty during tutorial
  - UFO74 delivers hints

- **Search command:** 
  - Tag matching works
  - 30% chance of corrupted entries
  - 30-second cooldown between searches

**Tests Validated:**
- `ux-commands.test.ts` - 60 tests
- `hint-system.test.ts` - tests
- `search-index.test.ts` - 14 tests
- `warmup-detection.test.ts` - tests

---

### 3. Evidence Collection Test ✅

**Status:** VERIFIED

All 5 truth categories discoverable:

1. **Debris Relocation** - Physical asset recovery/transport
2. **Being Containment** - Non-human biological subjects
3. **Telepathic Scouts** - PSI-comm capabilities
4. **International Actors** - Foreign involvement (CIA/Protocol 7-ECHO)
5. **Transition 2026** - Future timeline activation window

**UFO74 Message Timing:**
- Messages trigger at appropriate moments via `pendingUfo74Messages`
- Override protocol suggestion after 3 files read
- Congratulations when all 5 truths discovered

**Tests Validated:**
- `evidence-tiers.test.ts` - 15 tests
- `evidenceRevelation.test.ts` - 18 tests
- `story-consistency.test.ts` - 56 tests

---

### 4. Rewind Mechanic Test ✅

**Status:** VERIFIED

- **Unlock path:** Available after tutorial
- **Archive state entry:** `rewind` command enters archive mode
- **Archive state visual:** Shows `ARCHIVE STATE` and `READ-ONLY MODE` headers
- **Past-only files appear:** Archive-only files marked as `[DELETED]`
- **4-action limit:** `archiveActionsRemaining` starts at 4, decrements on each action
- **Auto-exit:** Returns to present when actions exhausted
- **Detection cost:** +5 detection on rewind
- **Exit command:** `present` command exits archive mode

**Tests Validated:**
- `rewind-command.test.ts` - 8+ tests

---

### 5. Neural Link Test ✅

**Status:** VERIFIED

- **Find .psi file:** `neural_dump_raw.psi` in `/storage/quarantine`
- **Decrypt security question:** Answer is `ALFA` (from `autopsy_alpha.log`)
- **Link command:** Requires `scoutLinkUnlocked` flag
- **Authentication phrase:** "harvest is not destruction" (or just "harvest")
  - Discoverable in decrypted PSI comm files
- **Link disarm:** `link disarm` neutralizes active firewall, reduces detection
- **Usage limit:** 4 link queries before exhausted
- **Image trigger:** ET brain image on first authenticated link

**Tests Validated:**
- `firewall-link.test.ts` - 20+ tests

---

### 6. Prisoner 46 Test ✅ (NEW)

**Status:** VERIFIED - Added comprehensive tests

- **Files discoverable:**
  - `prisoner46_manifest.enc` - Containment manifest
  - `p46_neural_activity.log` - Neural activity records
  - `p46_containment_specs.txt` - Containment specifications
  - `p46_interview_transcript.txt` - Interview records

- **Release command path:**
  1. Discover P46 files via exploration
  2. Use `release p46` (or variants: `prisoner46`, `prisoner 46`, `p-46`)
  3. Requires having read at least one P46 file

- **Release functionality:**
  - Shows release sequence with UFO74 reaction
  - Sets `prisoner46Released` flag
  - +15 detection
  - Triggers flicker effect
  - Shows ET standing image
  - Already-released check prevents double release

**Tests Added:**
- 7 new tests in `narrative-mechanics.test.ts`

---

### 7. Chat/UFO74 Test ✅

**Status:** VERIFIED

- **Prisoner 45 questions:** 
  - Responds to Varginha-related questions
  - Responds to disinformation keywords
  - Disconnects after 5 questions

- **UFO74 decrypt hints:**
  - Provides hints based on security question keywords
  - Gives different responses based on whether source file was read
  - Comprehensive hint system for all encrypted files

- **Trust degradation:** Handled via `prisoner45Exhausted` flag after 5 questions

**Tests Validated:**
- `ufo74-decrypt-hints.test.ts` - tests
- `narrative-mechanics.test.ts` - chat tests

---

### 8. Leak/Ending Test ✅

**Status:** VERIFIED

- **5-question interrogation:**
  - DEBRIS: Campinas/ESA/military base/hangar/relocated
  - CONTAINMENT: Three specimens/bio-constructs/non-human
  - PSI-COMM: Telepathic scouts/neural transmission
  - FOREIGN: CIA/Langley/US military/Americans
  - CONVERGENCE: 2026/transition/thirty rotations

- **Semantic answer evaluation:** Accepts synonyms and partial matches
- **Wrong answer penalty:** +5 detection per wrong answer
- **3-strikes rule:** Game over on 3 wrong answers
- **Conspiracy file leak choice:** Available when conspiracy files discovered

**All 8 Ending Paths:**
1. `controlled_disclosure` - Base ending (no modifiers)
2. `global_panic` - Conspiracy files leaked
3. `undeniable_confirmation` - Prisoner 46 released
4. `total_collapse` - Conspiracy + Prisoner 46
5. `personal_contamination` - Neural link used
6. `paranoid_awakening` - Conspiracy + Neural link
7. `witnessed_truth` - Prisoner 46 + Neural link
8. `complete_revelation` - All three modifiers

**Tests Validated:**
- `elusive-man.test.ts` - 20+ tests
- `endings.test.ts` - 31 tests

---

### 9. Consistency Checks ✅

**Status:** VERIFIED

- **All file references valid:** Cross-references checked
- **UFO74 tone consistent:** Hacker/informal style throughout
- **No orphaned commands:** All commands have proper handlers
- **Error messages helpful:** User-friendly error messages
- **No anachronisms:** 1996-appropriate terminology
- **Date consistency:** January 20, 1996 incident date

**Tests Validated:**
- `story-consistency.test.ts` - 56 tests
- `conspiracy-files.test.ts` - 18 tests

---

## ISSUES FOUND AND FIXED

### Issue 1: Missing Prisoner 46 Release Command Tests

**Problem:** The `release` command for Prisoner 46 was not covered by unit tests.

**Fix:** Added 7 comprehensive tests in `narrative-mechanics.test.ts`:
1. Shows error when no target provided
2. Shows file not found when P46 files not discovered
3. Successfully releases P46 when files discovered
4. Accepts various P46 target formats
5. Shows already released message when P46 already released
6. Caps detection at 100 when releasing P46
7. Shows UFO74 reaction in release sequence

**Verification:** All tests pass ✅

---

## FINAL TEST SUMMARY

| Test Suite | Tests | Status |
|------------|-------|--------|
| Total | 1121 | ✅ PASS |
| Components | ~400 | ✅ |
| Engine | ~500 | ✅ |
| Hooks | ~50 | ✅ |
| Storage | ~70 | ✅ |
| Electron | ~30 | ✅ |

---

## RECOMMENDATIONS

1. **All core mechanics verified** - Game is playtest-ready
2. **All 8 endings accessible** - Multiple playthrough paths work
3. **Evidence discovery balanced** - All 5 truths findable with exploration
4. **Detection system fair** - Warmup phase protects early game
5. **Hint system functional** - 4 hints sufficient for stuck players

---

## CONCLUSION

Terminal 1996 passes all playtest criteria. The game is consistent, balanced, and all paths are functional. The Prisoner 46 mechanic (new) is now fully tested and integrated into the 8-ending system.

**Status:** ✅ READY FOR RELEASE
