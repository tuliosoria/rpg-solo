---
name: "Varginha: Terminal 1996"
description: A haunted 1996 Brazilian intelligence terminal where a UFO cover-up leaks through the bureaucracy.
colors:
  phosphor-green: "#88cc44"
  phosphor-bright: "#99dd55"
  phosphor-mid: "#5a8a28"
  phosphor-dark: "#445522"
  phosphor-rule: "#2a3a18"
  phosphor-rule-dim: "#1a2a10"
  void: "#0a0a0a"
  screen-black: "#080a06"
  screen-deep: "#060d04"
  risk-elevated: "#ffff00"
  risk-high: "#ff9900"
  risk-critical: "#ff0000"
  anomaly-violet: "#aa88ff"
  anomaly-violet-light: "#ddaaff"
typography:
  display:
    fontFamily: "VT323, 'Courier New', monospace"
    fontSize: "clamp(2.4rem, 6vw, 4.8rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.18em"
  headline:
    fontFamily: "VT323, 'Courier New', monospace"
    fontSize: "clamp(1.4rem, 3.2vw, 2.4rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.22em"
  title:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.04em"
  body:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.16em"
rounded:
  none: "0"
  screen: "30px"
  bezel: "44px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "60px"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.phosphor-green}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "rgba(136, 204, 68, 0.1)"
    textColor: "{colors.phosphor-green}"
  toggle-on:
    backgroundColor: "rgba(136, 204, 68, 0.15)"
    textColor: "{colors.phosphor-green}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  toggle-off:
    backgroundColor: "transparent"
    textColor: "#666666"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  modal:
    backgroundColor: "{colors.void}"
    textColor: "{colors.phosphor-green}"
    rounded: "{rounded.none}"
    padding: "30px"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.phosphor-green}"
    rounded: "{rounded.none}"
    padding: "6px 0"
---

# Design System: Varginha: Terminal 1996

## 1. Overview

**Creative North Star: "The Haunted Government Terminal"**

This is a drab 1996 Brazilian intelligence machine that has absorbed everything it
processed — and started to leak it back. The entire interface is a single piece of
amber-era hardware rendered in software: a phosphor-green CRT inside a molded plastic
bezel, its glass faintly curved, its scanlines never quite still. The horror is not on
the screen; it *is* the screen. Dread arrives through bureaucracy — redacted forms,
euphemism, a detection meter climbing in the corner — not through spectacle.

Restraint is the whole discipline. The palette is essentially one color (phosphor
green) on near-black, and that monochrome scarcity is what makes the rare intrusions —
a yellow warning, a red critical alarm, an impossible violet glow — land like a
gut-punch. Depth comes from the simulated tube (bezel shadows, screen warp, vignette),
never from floating Material cards. Type is monospace by default and a chunky retro
bitmap face (VT323) for anything that wants to feel stamped onto the glass.

This system explicitly rejects the neon-cyberpunk Hollywood "hacker" look, the Matrix
green-rain cliché, glossy flat-SaaS polish (rounded cards, soft drop shadows, friendly
gradients), and jump-scare horror. If an element couldn't exist on a real 1996 CRT
intelligence terminal, it does not ship.

**Key Characteristics:**
- One-color monochrome (phosphor green on near-black); intrusions are events, not décor.
- A fully simulated CRT: molded bezel, curved glass (perspective warp), scanlines, glow, flicker.
- Square corners everywhere on content; the only curves are the physical monitor housing.
- Diegetic to the bone — even errors and toggles speak in-world, in clinical caps.
- Period-correct typography: monospace body, VT323 bitmap display.

## 2. Colors

A near-monochrome phosphor system: one green family carries 90%+ of every screen, with a strict semantic ramp reserved for danger and a single forbidden accent for the impossible.

### Primary
- **Phosphor Green** (`#88cc44`): The voice of the machine — body text, prompts, primary borders, the default glow. The single dominant color of the entire game.
- **Phosphor Bright** (`#99dd55`): Emphasis and active/selected state — the green leaning toward white-hot. Used sparingly for hover highlights and current focus.
- **Phosphor Mid** (`#5a8a28`): Placeholder and dimmed text; the signal fading at the edge of legibility (decorative only — never essential reading copy).
- **Phosphor Dark** (`#445522`): Secondary labels and quiet metadata.

### Secondary — The Detection Ramp
A semantic-only escalation that mirrors the terminal's degrading composure as `detectionLevel` climbs. Never decorative; each step *means* a threat tier.
- **Alert Green → Minimal/Low** (`#88cc44` / `#99dd55`): Calm. Bureaucratic composure.
- **Warning Yellow → Elevated** (`#ffff00` on `#aaaa00`): The system gets defensive.
- **Alarm Orange → High** (`#ff9900` on `#cc6600`): Hostile. They know you're here.
- **Critical Red** (`#ff0000` on `#cc0000`): Exposure imminent. Pulses. Pleading.

### Tertiary — The Anomaly
- **Anomaly Violet** (`#aa88ff`, light `#ddaaff`): The forbidden color. Reserved exclusively for the Secret Ending and genuinely anomalous (telepathic / non-human) signals. Its appearance anywhere green should be is *the* reveal — never spend it casually.

### Neutral
- **Void** (`#0a0a0a`): App background, modal fills.
- **Screen Black** (`#080a06`): The phosphor screen itself — a green-tinted black, not pure `#000`.
- **Screen Deep** (`#060d04`): Input gutter and recessed chrome; the darkest live surface.
- **Phosphor Rule** (`#2a3a18`) / **Rule Dim** (`#1a2a10`): Borders and dividers — green at very low light, never neutral gray.

### Named Rules
**The Monochrome Scarcity Rule.** The screen is green on black. Yellow, orange, red, and violet are *events*, not palette. If more than one non-green hue is visible at rest, the cover-up has already failed.

**The Green-Tinted Black Rule.** Backgrounds and borders carry a trace of the phosphor hue (`#080a06`, `#1a2a10`), never neutral gray. Neutral gray belongs to the Windows-95 Victory ending only — where escaping *into* clean OS chrome is the point.

## 3. Typography

**Display Font:** VT323 (with `'Courier New', monospace` fallback) — a self-hosted bitmap terminal face.
**Body / Mono Font:** `ui-monospace, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace`.

**Character:** Two registers of the same machine. VT323 is the chunky, stamped-onto-glass voice of titles and logos; the system monospace is the cool, even-width voice of the documents and the command line. They never compete — display shouts in wide tracking, body stays quiet and legible.

### Hierarchy
- **Display** (VT323 400, `clamp(2.4rem, 6vw, 4.8rem)`, line-height 1, tracking `0.18em`): Intro title, menu wordmark. Wide positive tracking — these are signage, not paragraphs.
- **Headline** (VT323 400, `clamp(1.4rem, 3.2vw, 2.4rem)`, tracking `0.22em`): Screen titles, the menu logo subtitle.
- **Title** (mono 700, `20px`, tracking `0.04em`): Modal headers, section labels — bold uppercase monospace.
- **Body** (mono 400, `14px`, line-height ~1.5): Terminal output, document text, command echo. The base reading size (`--terminal-font-size`). Keep document columns within a comfortable measure.
- **Label** (mono 400, `12px`, tracking `0.16em`, often uppercase): Toggles, footnotes, key hints, status chips.

### Named Rules
**The Stamped-Glass Rule.** VT323 earns positive letter-spacing (`0.18em`+) because bitmap caps read as engraved signage at distance; monospace body stays at normal tracking for reading. Never tighten display type below `0`.

**The In-World Document Rule.** Long classified documents use box-drawing rules (`═══`, `───`) and ALL-CAPS headers with two-space indented bodies — a typewriter/form feel, not web typography.

## 4. Elevation

No Material elevation. There are no floating content cards and no decorative drop shadows. **All depth is the simulated cathode-ray tube.** The molded bezel casts layered inner and outer shadows; the screen viewport is recessed with an inset vignette; the live surface is physically *curved* via `transform: perspective(1400px) scaleX(0.982) scaleY(0.968)`. "Lifting" off the glass is done with light, not shadow — the phosphor **glow** (a green `text-shadow`/`box-shadow` bloom) is how active elements read as energized.

### Shadow & Glow Vocabulary
- **Phosphor Glow — text** (`text-shadow: 0 0 4px rgba(136,204,68,0.5)` up to `0 0 20px rgba(136,204,68,0.5)`): The signature. Live green text emits light. Red and violet variants mark danger and anomaly.
- **Bezel Depth** (`box-shadow: 0 26px 70px rgba(0,0,0,0.7), inset 0 -28px 44px rgba(0,0,0,0.55), ...`): The monitor housing. Multi-layer inner+outer shadow that exists once, around the whole tube.
- **Modal Bloom** (`box-shadow: 0 0 40px rgba(136,204,68,0.2)`): A dialog reads as a brighter region of the same screen — a green halo, never a dark cast.

### Named Rules
**The Light-Not-Shadow Rule.** Elements gain presence by glowing (phosphor bloom), not by casting drop shadows onto a surface. The only true shadows in the system belong to the physical monitor.

## 5. Components

Every control is square-cornered (`border-radius: 0`), 1px-bordered in a green ramp, transparent or near-black filled, and reacts with a green wash + glow. Nothing is rounded, filled-solid, or gradient.

### Buttons
- **Shape:** Square (`border-radius: 0`). Labels wrapped in brackets: `[ NEW GAME ]`.
- **Primary:** Transparent fill, `1px solid #2a3a18` border, `#88cc44` text, `16px 32px` padding, `letter-spacing: 2px`.
- **Hover / Focus:** Background `rgba(136,204,68,0.1)`, border brightens to `#88cc44`, glow `0 0 20px rgba(136,204,68,0.2)`, `translateY(-2px)`. Active returns to `translateY(0)`.

### Toggles
- **On:** `rgba(136,204,68,0.15)` fill, `1px solid #88cc44`, green text.
- **Off:** Transparent fill, `1px solid #444`, muted `#666` text. The off state is the only place neutral gray is allowed inside the terminal — it reads as "inert/disabled," which is the intent.

### Modals / Dialogs
- **Corner Style:** Square. **Background:** `#0a0a0a`. **Border:** `1px solid #88cc44`. **Glow:** `0 0 40px rgba(136,204,68,0.2)`. **Padding:** `30px`.
- Section dividers are `1px solid #1a2a10`; sub-headers use `#445522`. A modal is a brighter window onto the same screen, not a card hovering above it.

### Inputs / Fields
- **Style:** Transparent, borderless, `caret-color: #88cc44`, monospace, preceded by a bold green prompt glyph. Sits in a recessed gutter (`#060d04`) with a `2px solid #6b9930` top rule.
- **Placeholder:** `#5a8a28`, gently pulsing (`placeholderPulse`). **Sliders:** square `#88cc44` thumb with glow on a `#1a2a10` track. **Disabled:** `opacity: 0.5`.

### Risk Indicator (signature)
The detection HUD chip. Color steps through the Detection Ramp (green → yellow → orange → red-pulsing) **and** carries a colorblind-safe shape prefix (outlined square → half-filled → filled, etc.) so threat tier never relies on hue alone. Critical state animates (`criticalPulse`).

### The CRT Shell (signature)
The whole app lives inside `.crtShell → .crtBezel → .screenViewport → .screenWarp`: radial-vignette room lighting, a molded plastic bezel with beveled highlights, a recessed glass screen, and a perspective-warped phosphor surface overlaid with scanlines, flicker, and static. This is the product's defining component.

## 6. Do's and Don'ts

### Do:
- **Do** keep the screen monochrome at rest — phosphor green (`#88cc44`) on green-tinted black (`#080a06`). Treat every non-green hue as a narrative event.
- **Do** reserve the Detection Ramp (`#ffff00` → `#ff9900` → `#ff0000`) strictly for threat/heat, and always pair color with a shape/icon cue for colorblind safety.
- **Do** convey depth with the CRT (bezel shadow, screen warp, vignette) and convey "active" with phosphor **glow**, not drop shadows.
- **Do** keep all content square (`border-radius: 0`); the only curves are the physical monitor housing.
- **Do** keep effects switchable — honor `prefers-reduced-motion` and the in-game CRT/flicker toggles; flicker is a photosensitivity safety control, not décor.
- **Do** write controls and errors diegetically, in clinical uppercase, as if the 1996 system is speaking.

### Don't:
- **Don't** do the neon-cyberpunk Hollywood "hacker" look — no rainbow neon, no glowing 3D UI, no glamor.
- **Don't** use the Matrix green-rain cliché or decorative "hacker" gibberish; the green is phosphor, not spectacle.
- **Don't** introduce glossy flat-SaaS polish — no rounded cards, no soft drop shadows, no friendly gradients, nothing that reads as "designed in 2026."
- **Don't** chase jump-scares; dread is earned through documents, pacing, and silence.
- **Don't** spend **Anomaly Violet** (`#aa88ff`) anywhere green belongs — it is the Secret-Ending reveal, and its rarity is the payload.
- **Don't** use neutral gray for live text or borders (use the green ramp); gray belongs only to disabled toggles and the Windows-95 Victory ending.
- **Don't** use `background-clip: text` gradient text, or `border-left`/`border-right` colored side-stripes as accents.
