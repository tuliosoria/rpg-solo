# MECHANICS — Varginha: Terminal 1996

> Complete mechanics reference. Documents every command, system, and threshold.

---

## Commands — Full Reference

### System Commands

| Command | Aliases (PT/ES) | Description | Detection Cost | Notes |
|---------|-----------------|-------------|----------------|-------|
| `help [command]` | `ajuda` / `ayuda` | List available commands or show detailed help for a specific command | 0 | Shows late-game warning at 5+ saved files |
| `status` | `estado` / `estado` | Display current system status, logging level, tolerance, session stability | 0 | Output varies by risk level (low/medium/high) |
| `clear` | `limpar` / `limpiar` | Clear terminal display | 0 | Also: Ctrl+L |
| `hint` | `dica` / `pista` | Request contextual guidance | 0 | Limited: 8 hints per run |
| `tutorial` | — | Toggle tutorial tips or replay intro | 0 | Can toggle ON/OFF |
| `save <filename>` | `salvar` / `guardar` | Save file to dossier for leak | 0 | File must be read first. Max 10 files. |
| `unsave <filename>` | `remover` / `quitar` | Remove file from dossier | 0 | — |

### Filesystem Commands

| Command | Aliases | Description | Detection Cost | Notes |
|---------|---------|-------------|----------------|-------|
| `ls` | — | List directory contents | 0 | `-l` flag shows long format with previews |
| `cd <path>` | — | Change directory | 0 | Supports `..`, `/`, relative paths |
| `open <filename>` | `abrir` / `abrir` | Display file contents | 0–20+ varies | May trigger images, crypto challenges, video |
| `tree` | — | Display directory tree structure | 0 | DANGER: tree on elevated session at high detection = game over |

### Inventory / Management Commands

| Command | Aliases | Description | Detection Cost | Notes |
|---------|---------|-------------|----------------|-------|
| `note <text>` | `nota` / `nota` | Save personal note with timestamp | 0 | Persists across saves |
| `notes` | `notas` / `notas` | Display all saved notes | 0 | — |
| `bookmark [filename]` | — | Toggle bookmark on a file (★ marker) | 0 | — |
| `unread` | — | List all files not yet opened | 0 | — |
| `progress` | `progresso` / `progreso` | Review saved dossier files and count | 0 | Shows count toward 10-file goal |
| `search <keyword>` | `buscar` / `buscar` | Search filenames, paths, and text | +2 normal, +5 blocked | Blocked terms trigger UFO74 warning |
| `scan` | — | Scan directory for accessible files | 0 | Returns counts by access level |
| `decode` | — | Decode/decrypt special file content | varies | Context-dependent |
| `disconnect` | — | Disconnect from neural link | 0 | Only valid if connected |
| `last` | `ultimo` / `ultimo` | Re-display last opened file | 0 | — |
| `back` | — | Return to previous directory | 0 | Requires prior `cd` |
| `map` | — | Display dossier map (same as progress) | 0 | — |

### Evidence Commands

| Command | Aliases | Description | Detection Cost | Notes |
|---------|---------|-------------|----------------|-------|
| `leak [subcommand]` | `vazar` / `filtrar` | Initiate dossier leak | 0 (prep), varies (wrong step: +5) | 3-step sequence at 5+ files. Transmission at 10 files + complete sequence. |

### Combat / Confrontation Commands

| Command | Aliases | Description | Detection Cost | Notes |
|---------|---------|-------------|----------------|-------|
| `override protocol <code>` | — (stays English) | Execute admin override with access code | +10 fail, +15 success | Password: COLHEITA. 3 failed attempts = lockdown. |
| `trace` | — | Probe system structure | +3 to +8 | Reveals accessible directories by clearance |

### Chat / NPC Commands

| Command | Aliases | Description | Detection Cost | Notes |
|---------|---------|-------------|----------------|-------|
| `chat <topic>` | — | Open encrypted relay to PRISONER_45 | +2 per response | 5 questions per session |
| `link [query]` | — | Neural link to Scout consciousness | +5 per query | Requires `neural_dump_alfa.psi` read |
| `link disarm` | — | Disarm Firewall via neural link | +15 | Permanent Firewall disable |
| `morse <answer>` | — | Attempt morse code decryption | 0 | 3 attempts max. Requires morse file read. |

### Recovery Commands

| Command | Aliases | Description | Detection Cost | Notes |
|---------|---------|-------------|----------------|-------|
| `wait` | `esperar` / `esperar` | Reduce detection level | −5 to −8 | 3 uses per run. 5s cooldown. High detection = −8. |
| `hide` | — | Emergency escape | 0 | Only available at 90%+ detection |

### Archive / Script Commands

| Command | Aliases | Description | Detection Cost | Notes |
|---------|---------|-------------|----------------|-------|
| `script <target>` | — | Execute reconstruction script | +2 to +10 | Targets defined in data_reconstruction.util |
| `run <script>` | — | Execute system script | +3 to +15 | Context-dependent |

---

## Risk System

### Detection Level (0–100%)

Every action in the terminal can increase detection. When detection reaches 100%, the game ends.

**Detection Costs by Action:**

| Action | Cost |
|--------|------|
| Normal `search` | +2 |
| Blocked term `search` | +5 |
| `chat` valid response | +2 |
| `chat` invalid response | +1 |
| `link` query | +5 |
| `link` prompt | +8 |
| `link disarm` | +15 |
| `override` failed attempt | +10 |
| `override` success | +15 |
| `trace` | +3 to +8 |
| `open` (high-clearance file) | varies |
| `leak` wrong step | +5 |
| No password in `override` | +5 |

**Detection Decreases:**

| Action | Reduction |
|--------|-----------|
| `wait` (normal) | −5 |
| `wait` (high detection, ≥70%) | −8 |
| Truth discovery | −3 |
| Timed decrypt success | −3 |

### Warmup Phase

During early gameplay (before reading 8 files), detection penalties are reduced:

- **Soft cap:** Detection won't easily exceed 15% during warmup
- **Minimum multiplier:** 0.25 (penalties reduced to 25%)
- **Ramp divisor:** 10 (gradual increase)

### Detection Thresholds

| Threshold | Level | Effect |
|-----------|-------|--------|
| Firewall activation | 25% | Audio taunts begin |
| Light glitch | 40% | Visual distortion starts |
| Turing warning | 45% | UFO74 warns about system test |
| Turing trigger | 50% | Turing test fires |
| Suspicious | 50% | Status bar changes |
| Medium glitch | 60% | Increased visual distortion |
| Alert | 70% | Escalated tension |
| Static noise | 70% | Terminal static overlay begins |
| Alien silhouette | 70% | Random silhouette appearances (60–180s intervals) |
| Heavy glitch | 80% | Severe visual distortion |
| Critical | 85% | Near-death state |
| Double glitch | 90% | Maximum distortion |
| Imminent | 90% | `hide` command becomes available |
| Game over | 100% | Session terminated |

### Wrong Attempts (0–8)

Tracks invalid commands and authentication failures. At 8, game over with "INVALID ATTEMPT THRESHOLD" reason.

### Session Stability (100–0)

Represents connection quality. Decreases with risky actions. Visual indicator in terminal. At 0, connection is extremely degraded.

---

## Save System

### Saving Files

- `save <filename>` — adds file to dossier
- File must have been opened/read first
- Maximum 10 files in dossier
- Only evidence-flagged files can be saved
- `unsave <filename>` removes from dossier
- `progress` / `map` shows current dossier contents

### Checkpoint System

- Auto-save every 30 seconds
- Manual checkpoints before high-risk actions (override, leak)
- Maximum 5 checkpoint saves
- Maximum 10 save slots total

---

## Override System

### Flow

1. Player discovers override command exists (hints, UFO74, file content)
2. Player uses `chat password` to contact PRISONER_45
3. PRISONER_45 reveals morse code: `-.-. --- .-.. .... . .. - .-` (COLHEITA)
4. Player can use `morse COLHEITA` to confirm decryption
5. Player types `override protocol COLHEITA`
6. Success: Admin access granted (clearance 5), new directories visible
7. Failure: Detection +10, attempt tracked. 3 failures = game over (lockdown).

### Password

- **Code:** COLHEITA (Portuguese for "harvest")
- **Case:** Insensitive (matched as uppercase internally)
- **Meaning:** References the harvest cycle — what the entities do to humanity

### Terrible Mistake Condition

On correct password entry, if ALL of these are true:
- Detection ≥ 70% (ALERT threshold)
- Evidence count ≥ 2
- Terrible mistake not already triggered
- Random roll < 0.35 (35% chance)

Then the terrible mistake fires: forbidden knowledge fragment revealed, doom countdown starts (8 operations), detection maxes out, system hostility level 5.

---

## Firewall System

### Activation

- Activates when `detectionLevel >= 25%`
- Sets `firewallActive: true`

### Behavior

- Triggers audio taunts on blocked search terms and forbidden file access
- 8 pre-recorded voice taunts, randomized, never same twice in a row
- Visual glow/distortion effect on terminal

### Disarming

- `link disarm` command through neural link
- Requires neural link authentication (reading `neural_dump_alfa.psi`)
- Costs +15 detection
- Permanently deactivates: `firewallDisarmed: true`, `firewallActive: false`

---

## Turing Test

### Trigger

- Detection reaches 50% (TURING_TRIGGER threshold)
- Warning message at 45% (TURING_WARNING)

### Flow

1. System presents 3 questions sequentially
2. Each question shows two responses — one human, one machine
3. Player must identify the MACHINE response
4. All 3 correct = pass (access continues, avatar expression: neutral)
5. Any wrong = fail (game over, reason: Turing test failure)

### Questions (i18n keys — actual text in locale files)

- Question 1: Option B is the machine response
- Question 2: Option A is the machine response
- Question 3: Option B is the machine response

---

## Leak System

### Preparation Phase (5+ saved files)

1. `leak` generates a 3-command preparation sequence (randomized from pool)
2. Player must execute commands in exact order: `leak <step1>`, `leak <step2>`, `leak <step3>`
3. Wrong order = sequence reset, +5 detection
4. Correct completion = "PREPARATION SEQUENCE COMPLETE"

### Transmission Phase (10 saved files + complete sequence)

1. `leak` with no arguments initiates transmission
2. Dossier compiled, encrypted, transmitted
3. Game enters victory state
4. Ending determined by `determineEnding(savedFiles)` — see [ENDINGS.md](./ENDINGS.md)

---

## Paranoia System

- **36 unique paranoia messages** flash on screen
- **Display duration:** 3 seconds
- **Trigger interval:** Base 60s, reduced by detection and paranoia level, minimum 15s
- **Triggers at:** Detection ≥ 30% OR paranoia level ≥ 10
- **Suppressed during:** Atmosphere phase, pressure cooldown, tutorial

---

## System Personality

The system's tone evolves based on `systemHostilityLevel` (0–5):

| Level | Personality | Behavior |
|-------|-------------|----------|
| 0 | Bureaucratic | Standard responses |
| 1 | Bureaucratic | Slightly formal warnings |
| 2 | Defensive | Passive resistance |
| 3 | Defensive | Active pushback |
| 4 | Hostile | Threatening messages |
| 5 | Hostile/Pleading | System breaks character |

---

## Cheat Commands

Available for testing/development:

- `god mode` — Unlock all, max clearance
- `god ending <number>` — Force specific ending (1–12)
- Additional debug commands available in development builds

---

## Evidence Counter

- Displayed in terminal header
- Format: `Evidence: X/10` (translated per language)
- Maps to `savedFiles.size` in game state
- Reaching 10 enables full leak transmission
- File combination determines which of 12 endings fires

---

## Typing Speed Detection

- **Threshold:** 8 characters/second
- **Tracking:** Last 10 keypresses monitored
- **Effect:** Warning messages ("They know you're typing too fast")
- **Timeout:** 3 seconds between warnings
