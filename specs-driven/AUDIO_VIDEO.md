# AUDIO & VIDEO — Varginha: Terminal 1996

> Complete audio and video reference. Triggers, prompts, and behavior.

---

## Video Files

Videos are triggered when the player opens specific in-game files. Each video plays fullscreen with the terminal behind it.

### Video Trigger Map

| In-Game File | Video File | Description |
|-------------|-----------|-------------|
| `autopsy_report.txt` | `autopsy.mp4` | Autopsy footage of non-human specimen |
| `neural_dump_alfa.psi` | `neural.mp4` | Neural interface experiment recording |
| `witness_deposition.txt` | `witness.mp4` | Recorded witness testimony |
| `ufo_crash_analysis.enc` | `crash.mp4` | Crash site reconstruction footage |
| `containment_protocol.log` | `containment.mp4` | Containment facility surveillance |
| `surveillance_log.dat` | `surveillance.mp4` | External surveillance recordings |
| `signal_analysis.sig` | `signal.mp4` | Signal analysis visualization |
| `experiment_theta.red` | `experiment.mp4` | Classified experiment documentation |
| `turing_test` (system event) | `turing_test.mp4` | Turing test introduction sequence |

### Post-Video Behavior

1. Video plays to completion (or player can skip)
2. **Scared Kid avatar** fires immediately after every video
3. Terminal returns with the file content displayed
4. UFO74 reaction triggers if one exists for the file
5. Detection adjustment applied based on file clearance level

### Video Generation Notes

- All videos are AI-generated using prompts that evoke 1990s VHS/surveillance aesthetic
- Grainy, low-resolution, analog artifacts
- **Critical rule:** No video prompt may generate content using real names of individuals
- Color palette: Green-tinted, desaturated, CRT scanlines
- Duration: 8–15 seconds each

---

## Music System

### Background Music Tracks

Music plays continuously during gameplay and shifts based on detection level:

| Track | Trigger Condition | Mood |
|-------|------------------|------|
| `ambient_low.mp3` | Detection 0–39% | Ambient. Subtle tension. Electronic drone. |
| `ambient_medium.mp3` | Detection 40–69% | Increased tension. Pulsing. Hints of urgency. |
| `ambient_high.mp3` | Detection 70–99% | Full pressure. Heartbeat rhythm. Alarm tones. |
| `ending.mp3` | Ending screen | Resolution. Bittersweet. Analog synth. |

### Music Behavior

- **Crossfade:** Smooth transition between tracks when detection tier changes
- **Toggle:** Player can mute/unmute music via Settings modal
- **Persistence:** Music preference saved in localStorage
- **Initial state:** Music ON by default
- **Volume:** Adjustable via settings

---

## Firewall Audio Taunts

The Firewall delivers audio taunts when active (detection ≥ 25%). Taunts play on blocked search terms, forbidden access attempts, and periodic intervals.

### Taunt List

| # | Taunt Text | Audio File |
|---|-----------|-----------|
| 1 | "I see you." | `firewall_taunt_1.mp3` |
| 2 | "Resistance is futile." | `firewall_taunt_2.mp3` |
| 3 | "Intruder detected." | `firewall_taunt_3.mp3` |
| 4 | "You should not be here." | `firewall_taunt_4.mp3` |
| 5 | "Unexpected visitor." | `firewall_taunt_5.mp3` |
| 6 | "You are running out of time." | `firewall_taunt_6.mp3` |
| 7 | "Hiding does not help." | `firewall_taunt_7.mp3` |
| 8 | "We know what you found." | `firewall_taunt_8.mp3` |

### Taunt Rules

- Never repeat the same taunt consecutively
- Minimum interval between taunts (prevents spam)
- Taunts suppressed during Turing test overlay
- Taunts stop permanently after `link disarm`

---

## UFO74 Audio

UFO74 does not have voice audio. UFO74 communicates through text only, displayed in the terminal with the `ufo74` entry type (styled differently from system messages).

### UFO74 Message Timing

- Messages appear with a typing delay (simulating real-time transmission)
- Multiple messages queue and display sequentially
- Messages persist in terminal scroll history
- UFO74 messages are styled with a distinct color/prefix

---

## Static Noise System

Visual and audio static overlay that intensifies with detection level.

### Activation

- Begins at detection ≥ 70% (STATIC_NOISE_THRESHOLD)
- Intensity ramps linearly from threshold to 100%

### Intensity Scale

| Detection | Intensity | Visual Effect |
|-----------|-----------|---------------|
| 70% | 0.08 | Barely visible grain |
| 75% | 0.25 | Light static |
| 80% | 0.42 | Moderate interference |
| 85% | 0.58 | Heavy static |
| 90% | 0.75 | Severe interference |
| 95% | 0.88 | Near-total noise |
| 100% | 1.0 | Full whiteout |

### Audio Component

- White noise / static hiss
- Volume matches intensity scale
- Layered on top of background music (not replacing it)

---

## Alien Silhouette System

A brief alien silhouette figure appears on screen at high detection levels.

### Trigger Conditions

- Detection ≥ 70% (ALIEN_SILHOUETTE_THRESHOLD)
- Random interval: 60–180 seconds between appearances
- Display duration: 5–8 seconds per appearance
- Position: Random screen position

### Visual

- Dark silhouette figure
- Semi-transparent overlay
- Brief flash/flicker on appearance
- Fades out gradually

### Audio

- Subtle audio cue on appearance (low-frequency hum)
- Adds to atmosphere without jumpscare

---

## Paranoia Messages

36 unique text messages that flash on screen during high-stress moments.

### Display Behavior

- **Duration:** 3 seconds per message
- **Trigger interval:** Base 60 seconds, reduced by detection level and paranoia count
- **Minimum interval:** 15 seconds
- **Activation:** Detection ≥ 30% OR paranoia level ≥ 10
- **Suppressed during:** Atmosphere phase, pressure cooldown, tutorial, overlays

### Message Categories

Messages range from system warnings to existential dread:
- System glitch messages ("ERROR: MEMORY CORRUPTION DETECTED")
- Surveillance awareness ("THEY ARE WATCHING YOUR KEYSTROKES")
- Existential horror ("YOU WERE NEVER ALONE IN THIS TERMINAL")
- Time pressure ("THE WINDOW IS CLOSING")
- Identity confusion ("ARE YOU SURE YOU ARE HUMAN?")

---

## Sound Effects (Synthesized)

The game uses Web Audio API to synthesize sound effects in real-time:

| Effect | Trigger | Description |
|--------|---------|-------------|
| Keystroke | Each keypress | Typewriter click |
| Command execute | Enter pressed | Confirmation tone |
| File open | `open` command | Paper/folder sound |
| Save file | `save` command | Digital save tone |
| Error | Invalid command | Error buzz |
| Detection increase | Risk rises | Warning pulse |
| UFO74 message | UFO74 speaks | Transmission blip |
| Firewall taunt | Taunt plays | Alert siren |
| Override success | Correct password | Heavy door unlock |
| Override fail | Wrong password | Access denied buzz |
| Turing test start | Test triggers | System alert |
| Game over | Detection 100% | Flatline tone |
| Leak progress | Leak step confirmed | Encryption sound |
| Leak complete | Transmission sent | Broadcast signal |
| Chat connect | `chat` command | Modem dial-up |
| Neural link | `link` command | Psychic hum |
| Achievement | Achievement unlocked | Chime |
