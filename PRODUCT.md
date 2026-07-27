# Product

## Register

product

## Users

Solo narrative-horror players: fans of analog horror, ufology, and "found-machine"
investigation games in the vein of *Stories Untold*, *Hypnospace Outlaw*, and
*Her Story*. They play focused and alone, usually at night, on a desktop — in the
browser or as a Steam/Electron desktop build.

The audience is trilingual by design (English, Brazilian Portuguese, Spanish).
Brazilian players are a first-class audience, not a translation afterthought —
the story dramatizes a real local event.

**Job to be done:** be dropped into a believable 1996 Brazilian intelligence
terminal and reconstruct a suppressed truth — navigate a virtual filesystem,
read and cross-reference classified documents, assemble an evidence dossier, and
decide what to do with it, all while a detection meter climbs toward exposure.

## Product Purpose

A text-based narrative puzzle/horror game built around the real January 1996
Varginha UFO incident. The player has illicitly accessed a legacy intelligence
system; they explore its filesystem, collect ten pieces of evidence, and race to
leak the dossier before detection, corruption, or shutdown ends the session.

It exists to make the player *feel* the dread of a bureaucratic cover-up —
horror delivered through paperwork, redaction, and an authentic period machine
rather than monsters or spectacle.

**Success looks like:** the player is absorbed and paranoid, compelled to keep
digging; the 1996 illusion never breaks; and they reach an ending that feels
earned by their own investigation.

## Brand Personality

Three words: **clinical, paranoid, analog.**

The voice is cold bureaucratic detachment — "subject exhibited distress," not
"the creature was scared." Horror lives in euphemism, `[REDACTED]` blocks, and
form-feel documents. The terminal itself is a character whose composure degrades
with detection: bureaucratic (0–40%) → defensive (40–70%) → hostile (70–90%) →
pleading (90%+). UFO74, the ally NPC, adds a thread of fragile trust.

Emotional target the design must protect: **creeping dread and investigative
obsession** — the specific unease of reading something you were never meant to
see.

## Anti-references

- **Neon-cyberpunk / Hollywood "hacker" glamor** — *Swordfish*/CSI hacking
  montages, rainbow neon, glowing 3D interfaces. This is a real, drab, period
  machine, not a movie prop.
- **The Matrix green-rain cliché** and decorative "hacker" gibberish. The green
  here is phosphor, not spectacle.
- **Glossy modern flat-SaaS UI** — rounded cards, soft drop shadows, friendly
  product polish, anything that reads as "designed in 2026" and breaks the 1996
  illusion.
- **Jump-scare horror** — startle gags, gore for shock value. Dread is earned
  through content, pacing, and silence, never loud surprises.

## Design Principles

1. **Period authenticity is the contract.** Every element must belong on a 1996
   CRT intelligence terminal. If it couldn't exist on that machine, it doesn't
   ship.
2. **Horror through bureaucracy.** Dread comes from documents, euphemism, and
   redaction — show the cover-up, don't narrate the monster.
3. **Diegetic by default.** UI, feedback, and even error states speak in-world;
   the system has a voice. Avoid out-of-world chrome that breaks immersion.
4. **Pressure is constant, never cheap.** Detection rises inevitably; tension
   should feel systemic and fair, not random or punitive.
5. **Restraint over spectacle.** Green-on-black and silence do the work. Reach
   for effects — flicker, glow, embedded video — only when the moment earns them.

## Accessibility & Inclusion

- **Target WCAG 2.1 AA legibility within the aesthetic.** Terminal text must hold
  ≥4.5:1 against the near-black background; the phosphor green (`#88cc44` on
  `#080a06`) clears this comfortably. Dim/dark green ramps are for decoration and
  must never carry essential reading text below AA.
- **Motion & photosensitivity.** Honor `prefers-reduced-motion` and keep the
  existing player toggles to disable CRT effects and screen flicker. Flicker must
  stay dampened and switchable off — this is a safety requirement, not polish.
- **Keyboard-first.** It's a terminal: full keyboard operability with visible
  `:focus-visible` states and ARIA labels on non-text controls.
- **Localization parity.** English, Brazilian Portuguese, and Spanish are
  maintained at parity; new player-facing strings ship in all three.
