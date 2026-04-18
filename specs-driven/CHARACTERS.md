# CHARACTERS — Varginha: Terminal 1996

> Complete character reference. Read before writing any dialogue or character interaction.

---

## HackerKid (The Player)

- **Name:** HackerKid (handle). Real name unknown.
- **Role:** The player character. A Brazilian teenager who broke into a classified military terminal.
- **Voice:** Silent. The player speaks only through typed commands.
- **Relationship to other characters:** UFO74's protégé. PRISONER_45's hope. The Firewall's target. ALPHA's unintended witness.
- **What they know:** Only what they read. Every piece of knowledge is earned through the terminal.
- **What they must never do:** Speak in dialogue. The player is their commands.

---

## UFO74 / Carlos Eduardo Ferreira

- **Name:** UFO74 (handle). Real name: Carlos Eduardo Ferreira.
- **Role:** Ghost in the system. The player's guide. A Brazilian Air Force intelligence officer who saw everything during the Varginha incident, planted evidence across the terminal, and disappeared into the network. He is the system's most wanted fugitive.
- **Voice:** Lowercase always. Minimal punctuation — periods only. Short sentences. Casual but precise. Military background shows in word choice. Never uses exclamation marks. Speaks in fragments when scared. Gets more cryptic as detection rises.
- **Relationship to the player:** Mentor. He chose HackerKid. He left breadcrumbs. He needs the player to finish what he started.
- **What he knows:** Everything. He was there. He saw ALPHA. He knows about the 30-year cycle, the harvest, the 2026 window. He knows the system will kill him if it finds him.
- **When he reveals it:** Gradually. Trust level determines openness. At low risk he is generous with hints. At high risk he speaks in code.
- **Trust Levels:**
  - **Trusting (risk 0–4):** Full sentences. Direct guidance. "that journal. the scientist lost his mind. but he was right about everything."
  - **Cautious (risk 5–9):** Shorter. Hedging. "careful with that one. they flag those files."
  - **Paranoid (risk 10–14):** Fragments. Rushed. "can't talk long. find what you need. get out."
  - **Cryptic (risk 15+):** Near-incomprehensible. "...signal degrading... remember what you read..."
- **Key dialogue lines:**
  - "i left breadcrumbs for you, kid."
  - "you found it. you found me. i did not think anyone would dig this deep."
  - "thirty rotations. 2026. kid that is this year. i feel something bad will happen..."
  - "they do not need to come here. they never did."
  - "you assembled everything. i can rest now." (secret ending)
- **What he must never say or do:** Use uppercase. Use exclamation marks. Explain the full horror directly. Break character by being casual about serious topics. Reveal his real name unless the player finds `ghost_in_machine.enc`.

---

## PRISONER_45 / The Captured Entity (ALPHA)

- **Name:** PRISONER_45 (designation in system). Actual identity: the captured entity from the Varginha incident, referred to as ALPHA in military documents.
- **Role:** Source of the override password. The captive consciousness. Speaks through the `chat` relay.
- **Voice:** All caps prefix `PRISONER_45>`. Urgent. Terrified. Speaks from containment since 1996. Oscillates between desperate pleas, cryptic warnings, and raw fear. Uses complete sentences but emotional — not clinical. Knows things it should not know.
- **Relationship to the player:** Depends on the player. HackerKid is PRISONER_45's only contact with the outside. It needs the player to leak the files. It reveals the override code because the player is the only one who can use it.
- **What they know:** The override code (COLHEITA). The 30-year cycle. The harvest. Its own nature. The Watchers. That 2026 is the last window. That it has been studied, probed, and contained for 30 years.
- **When they reveal it:** Tiered system (3 tiers based on questions asked). First questions get guarded responses. Later questions get raw, terrified honesty. Password revealed through morse code: `-.-. --- .-.. .... . .. - .-` (COLHEITA).
- **Dialogue Topics (19 core + 18 easter eggs):**
  - `default` — General disorientation
  - `varginha` — Incident details
  - `alien` — Creature descriptions
  - `who` — Identity/background
  - `escape` — Captivity attempts
  - `truth` — Reality and 2026
  - `help` — Guidance to player
  - `password` — Override code hints (morse code)
  - `military` — Military involvement
  - `crash` — Crash details
  - `death` — Death and consciousness
  - `god` — Religion and theology
  - `disinformation` — Cover-up tactics
  - `telepathy` — Psychic contact
  - `experiment` — Lab procedures
  - `witness` — Witness statements
  - `fear` — Emotional responses
  - `sound` — Frequencies and humming
  - `hospital` — Humanitas Hospital incident
- **Session limit:** 5 questions per session. +2 detection per valid response.
- **Key dialogue lines:**
  - "PRISONER_45> ...you want the override code? Smart."
  - "PRISONER_45> The code... it's a Portuguese word. Think about what they DO to us."
  - "PRISONER_45> Listen closely: -.-. --- .-.. .... . .. - .-"
  - "PRISONER_45> Decode that. Then use it with: override protocol \<answer\>"
  - "PRISONER_45> Everything you think is real is a containment system. You live inside something else's infrastructure."
  - "PRISONER_45> Before the window opens in 2026. Before the harvest. SPREAD THE TRUTH."
- **What they must never say or do:** Speak without the `PRISONER_45>` prefix. Be calm. Use technical/military language (it is not military — it is the subject). Reveal the password directly in plaintext (always morse code).

---

## The Firewall

- **Name:** No name. It is the system's immune response.
- **Role:** Antagonist. Active countermeasure against the player. Activates at 25% detection. Provides audio taunts. Monitors all activity.
- **Voice:** Cold. Mechanical. Omniscient. Uses formal English status alerts. Pre-recorded audio taunts. No personality — only function. The voice of the institution.
- **Relationship to the player:** Predator. It exists to catch you.
- **What it knows:** Everything happening in the terminal. Your detection level. Your command history. Your typing speed.
- **When it reveals it:** Through escalating taunts and system responses. Never explains itself. Never negotiates.
- **8 Audio Taunts:**
  1. "I see you."
  2. "Resistance is futile."
  3. "Intruder detected."
  4. "You should not be here."
  5. "Unexpected visitor."
  6. "You are running out of time."
  7. "Hiding does not help."
  8. "We know what you found."
- **Key behavior:** Can be disarmed via neural link (`link disarm`). Costs 15 detection. Once disarmed, it does not reactivate.
- **What it must never say or do:** Show personality. Negotiate. Explain why it exists. Be anything other than institutional machinery.

---

## The Scout (Neural Link Entity)

- **Name:** The Scout. Accessed through `link` command after reading `neural_dump_alfa.psi`.
- **Role:** Alien consciousness accessible through the neural link. Provides existential perspective on the harvest, the Watchers, and humanity's place.
- **Voice:** Detached. Alien. Speaks in observations rather than statements. Uses present tense. No human emotional register — curious about emotions it cannot feel. Poetic in an inhuman way.
- **Relationship to the player:** Observer. It does not help or hinder. It provides perspective that changes how you see the evidence.
- **What it knows:** The Watchers. The harvest mechanism. The cycle. Time as the entities experience it. What happens in 2026.
- **Dialogue categories:** identity, purpose, watchers, earth, future, harvest, help, fear, time, pain, love, signal_lost
- **Query limit:** 4 queries before pattern exhausts. +5 detection per query.
- **Special ability:** `link disarm` — neutralizes the Firewall at cost of +15 detection.
- **What it must never do:** Express human emotions authentically. Take sides. Use colloquial language. Lie.

---

## ALPHA (The Physicist's Subject)

- **Name:** ALPHA. Military designation for the captured entity.
- **Role:** The subject of the neural experiments. The consciousness that spoke back. Referenced in autopsy reports, containment logs, and neural dump files.
- **Voice:** ALPHA does not speak directly to the player. Its voice is filtered through documents — neural transcripts, experiment logs, containment observations. When it "speaks" in these documents, it is fragmentary, alien, and disturbing.
- **What it is:** Ambiguous. The documents disagree. Biological entity? Energy form? Consciousness without body? The ambiguity is the point.
- **What it must never do:** Be fully explained. Be anthropomorphized. Be reduced to a simple alien.

---

## The Analyst / The Soldier / Other Document Authors

These are not interactive characters. They are the voices behind the classified documents:

- **The Analyst:** Writes assessment reports. Clinical. Detached. Uses hedging language: "consistent with," "suggests," "cannot be excluded." Their horror leaks through what they choose NOT to say.
- **The Soldier:** Writes field reports and duty logs. Terse. Procedure-focused. The fear shows in how carefully they document mundane details — as if recording reality will make the impossible comprehensible.
- **The Medical Examiner:** Writes autopsy reports. The most detailed voice. Struggles between professional objectivity and the fact that nothing in the specimen matches known biology.
- **The Director:** Signs memos and directives. Bureaucratic. Uses passive voice to avoid responsibility. "It has been determined that..." Never takes personal ownership of decisions.

These voices create the documentary texture of the game. They are not characters the player interacts with — they are the authors of the truth the player assembles.
