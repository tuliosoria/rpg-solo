# Game Improvement Ideas

## Narrative & Immersion

- ✅ **Multiple endings**
  - Bad ending: get caught by the system (countdown expires)
  - Neutral ending: escape but files are lost (disconnect command)
  - Good ending: current victory flow
  - Secret ending: find hidden truth about UFO74's identity (password puzzle)

- ✅ **UFO74 has a secret** - Reveal they're actually an insider/witness, not just a hacker. They were there in January 1996.

- ✅ **Time pressure mechanic** - Real-time countdown after triggering active_trace.sys. 5 minutes to complete or get caught.

- ✅ **Unreliable narrator** - Some "evidence" is planted disinformation (official_summary_report); subtle flag when discovered.

---

## Gameplay Mechanics

- ✅ **Stealth meter visible** - Show detection level more prominently in the UI, with visual/audio warnings at thresholds.

- ✅ **File corruption spreads** - Reading core_dump_corrupted.bin corrupts nearby files in /tmp. Creates consequences for exploration.

- ✅ **Hidden commands** - `disconnect` and `scan` discoverable through reading maintenance_notes.txt. Reward thorough players.

- ✅ **Password puzzles** - Password "varginha1996" found in transfer_authorization.txt, unlocks ghost_in_machine.enc for secret ending.

- ✅ **Mini-games** - `decode` command for ROT13 cipher puzzles. Hints provided after failed attempts.

- ✅ **Stealth recovery system** - `wait` command reduces detection (3 uses per run, costs hostility). `hide` emergency escape at 90+ detection (one-time use, costs stability).

- ✅ **Detection state feedback** - Clear warnings at SUSPICIOUS (50+), ALERT (70+), CRITICAL (85+), IMMINENT (90+) with UFO74 guidance and screen effects.

- ✅ **Truth discovery breathers** - Major revelations briefly reduce detection as system "recalibrates", providing tension relief.

---

## Atmosphere

- ✅ **Sound design**
  - Keyboard clicks on typing
  - Static/interference sounds
  - Modem dial-up sounds
  - Eerie ambient background
  - Alert beeps on warnings

- ✅ **Random glitches** - Unprompted screen distortions as tension builds. The system "fighting back."

- ✅ **"They're watching" moments** - Occasional messages suggesting someone else is in the system. Paranoia fuel.

- ✅ **Easter eggs**
  - Real Varginha incident references (Jardim Andere, actual timeline)
  - X-Files nods ("trust no one", "the truth is out there", "want to believe")
  - Brazilian culture touches (Copa 94, feijoada menu, Portuguese phrases)
  - 90s internet culture (dial-up logs, IRC, Geocities, ASCII art signatures)

---

## Replayability

- ✅ **Achievements**
  - "Speed Run" - Complete in under X commands
  - "Pacifist" - Win with low detection level
  - "Completionist" - Read every file
  - "Ghost" - Never trigger any warnings
  - "Curious" - Find all easter eggs

---

## Meta/ARG Elements

- **External website** - Fake government site or "leaked documents" page that players can visit IRL.

- **QR codes in game** - Hidden in certain files, lead to real-world Varginha incident info or bonus content.

---

## Priority Ideas (Quick Wins) - ALL COMPLETE ✅

1. ✅ Sound design - huge atmosphere boost
2. ✅ Stealth meter visibility - better player feedback
3. ✅ Random glitches - easy to implement, high impact
4. ✅ "They're watching" moments - tension builder
5. ✅ Achievements - adds replayability without major changes

---

## UX Improvements - ALL COMPLETE ✅

### High Impact (Quick Wins)
- ✅ **Command history** - ↑/↓ arrows to navigate previous commands
- ✅ **"last" command** - Re-display last opened file without detection increase
- ✅ **"back" command** - Navigate to parent directory quickly
- ✅ **Bookmark/note system** - `note`, `notes`, `bookmark` commands for player organization
- ✅ **Progress indicator** - `progress` command shows evidence collected (X/5)

### Medium Impact
- ✅ **File preview on autocomplete** - Tab shows first line of files
- ✅ **"unread" command** - List all files not yet opened
- ✅ **Contextual hints** - UFO74 nudges after 30s idle with helpful tips
- ✅ **Reading time estimate** - `ls` shows [~Xmin] for long documents

### Immersion Boosters
- ✅ **Sound variations** - Different sounds for messages, reveals, typing
- ✅ **Screen flicker on revelations** - Already implemented for discoveries
- ✅ **Redacted text styling** - ████████ blocks styled with animation
- ✅ **Terminal personality helpers** - Typo/hesitation utilities available

- ✅ **Glitch intensity scaling** - More aggressive visual corruption at high detection levels (double glitches at 90%+)

- ✅ **Command-specific sounds** - Different audio feedback for dangerous vs safe commands

---

## Gameplay Depth (NEW)

- ✅ **Correlate command** - `correlate file1 file2` cross-references files to find connections, rewards with detection reduction

- ✅ **UFO74 trust degradation** - UFO74 becomes cryptic/paranoid when player triggers too many warnings

- ✅ **Conditional UFO74 dialogue** - UFO74 reacts differently based on which truths the player discovered first

- ✅ **Alternative truth paths** - Mundane files (vehicle logs, HVAC, duty roster) contain hidden reveals for thorough players

- ✅ **Red herring files** - 10+ mundane administrative files in /internal to obscure signal with noise

- ✅ **Expanded paranoia messages** - 40+ varied "they're watching" messages with escalating intensity

---

## Advanced Features (NEW - Round 2)

### Gameplay
- ✅ **File linking system** - `connect file1 file2` creates evidence connections, `map` displays the web. Linking related files reduces detection.

- ✅ **Timed decryption mini-game** - Some encrypted files require typing a sequence before timer expires (emergency_broadcast.enc). Fast completion rewarded.

- ✅ **Red herring traps** - Honeypot files with sensational names spike detection +20% when opened, teaching players to be cautious.

### Narrative
- ✅ **Multiple UFO74 personas** - At very degraded trust, hints emerge that "UFO74" might be multiple people

- ✅ **System personality evolution** - Terminal becomes more hostile/pleading as player approaches truth (bureaucratic → defensive → hostile/pleading)

- ✅ **Epilogue files** - After victory, /aftermath/ directory unlocks showing consequences of exposure (news clippings, government response, UFO74's fate, 2026 projection)

### Atmosphere
- ✅ **Typing speed affects detection** - Fast typing (>8 chars/sec) triggers "suspicious pattern detected" warning

- ✅ **Ambient audio pitch shift** - Background drone pitch adjusts based on detection level (stub added)

- ✅ **Screen burn-in effect** - Ghost traces of previously viewed text remain visible with subtle opacity

---

## Backlog (Future Consideration)

- Randomized file locations (different playthrough = different paths)
- New Game+ (start with UFO74 trusting you more, earlier access)
- External website / ARG elements
- QR codes in game
