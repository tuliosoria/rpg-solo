// Chat/communication commands: chat, link, message, morse

import { GameState, TerminalEntry } from '../../types';
import { shouldSuppressPenalties } from '../../constants/atmosphere';
import { createEntry, createEntryI18n, createUFO74Message } from './utils';
import { contextChance, contextRandomPick } from './helpers';
import type { CommandRegistry } from './types';

// Forward reference to commands registry (needed for morse -> message redirect)
let commandsRef: CommandRegistry | null = null;
export function setCommandsRef(cmds: CommandRegistry) {
  commandsRef = cmds;
}

// ═══════════════════════════════════════════════════════════════════════════
// PRISONER 45 RESPONSES
// ═══════════════════════════════════════════════════════════════════════════

const PRISONER_45_RESPONSES: Record<string, string[][]> = {
  // Each category has tiers: [0] = guarded (questions 1-2), [1] = open (3-4), [2] = terrified (5+)
  default: [
    [
      "PRISONER_45> ...I don't remember how I got here.",
      'PRISONER_45> Who are you? Are you one of them?',
      'PRISONER_45> Sometimes I hear... clicking. Not human clicking.',
      "PRISONER_45> Are you real? Sometimes I can't tell anymore.",
      'PRISONER_45> The humming... do you hear the humming?',
    ],
    [
      'PRISONER_45> The walls... they breathe at night. I can feel them expanding.',
      "PRISONER_45> I've been counting days but they don't add up. Three Tuesdays in a row.",
      'PRISONER_45> Time moves wrong in here. My watch runs backwards sometimes.',
      "PRISONER_45> I used to know what year it was. Now I'm not sure it matters.",
      'PRISONER_45> They watch. Through the walls. I can feel their attention like heat.',
    ],
    [
      'PRISONER_45> Last night the ceiling opened and I saw stars. Stars that blinked in patterns.',
      "PRISONER_45> They're rewriting my memories. I remember dying. Twice.",
      "PRISONER_45> My reflection doesn't move when I do anymore.",
      'PRISONER_45> Something grew in the corner of my cell. It had my face.',
      "PRISONER_45> I found a note in my own handwriting. It says 'STOP ASKING'. I don't remember writing it.",
    ],
  ],
  varginha: [
    [
      'PRISONER_45> Varginha... yes. I was there.',
      "PRISONER_45> They told us it was a dwarf. It wasn't a dwarf.",
      "PRISONER_45> January 20th. I'll never forget that date.",
      'PRISONER_45> The locals saw it first. We came to clean up.',
    ],
    [
      'PRISONER_45> I saw them take the bodies. Three of them. Still warm.',
      'PRISONER_45> The smell... ammonia and rotting flowers. I still smell it in my sleep.',
      'PRISONER_45> Three creatures. Only one survived the crash. It screamed without opening its mouth.',
      'PRISONER_45> We had orders. Contain. Deny. Disappear. Some of us disappeared too.',
      'PRISONER_45> The firefighters got there first. Corporal Marco. He touched one. Dead within a year.',
      "PRISONER_45> It wasn't the only crash. Just the one they couldn't hide fast enough.",
    ],
    [
      'PRISONER_45> The surviving one grabbed Sergeant Lopes. Lopes said he saw the sun die. He shot himself in March.',
      'PRISONER_45> Brazil, Russia, Peru. Same week. Same type of craft. Coordinated. Like a survey team.',
      'PRISONER_45> The American team arrived within 4 hours. FOUR. From Wright-Patterson. They already had containment protocols ready. They KNEW.',
      'PRISONER_45> The girls who saw it in Jardim Andere... Liliane, Valquiria, Katia. They were chosen. Selected. I saw their names in files that predate the crash by MONTHS.',
      "PRISONER_45> The creature at Humanitas hospital. Room 18. It healed two patients before it died. The hospital's records for that week were incinerated.",
    ],
  ],
  alien: [
    [
      "PRISONER_45> Don't call them that. They don't like that word.",
      "PRISONER_45> They're not visitors. They're... assessors.",
      'PRISONER_45> Red eyes. But not angry. Curious. Too curious.',
      "PRISONER_45> They're not the first to come here. Just the latest.",
    ],
    [
      'PRISONER_45> I looked into its eyes once. It looked back. INTO me. Through my skull.',
      'PRISONER_45> They communicated without speaking. I felt my memories being copied.',
      'PRISONER_45> Small bodies. But the presence... like standing next to a generator. Vibrating.',
      "PRISONER_45> They're not individuals. More like... fingers of one hand. Hurt one, they ALL feel it.",
      'PRISONER_45> The smell. Ammonia and something organic. Like a wound that never heals.',
    ],
    [
      'PRISONER_45> When it died, I felt something leave the room. Not heat. Not air. Information. Terabytes of it, beaming upward.',
      "PRISONER_45> They're not afraid of us. That's what scared me most. We're not a threat. We're a RESOURCE.",
      'PRISONER_45> One touched Sergeant Lopes. He saw 10,000 years of human history in 3 seconds. He aged 5 years in that instant.',
      "PRISONER_45> The surviving one drew symbols in its own blood on the containment wall. We photographed them. They're star charts. Of HERE. From OUTSIDE.",
      "PRISONER_45> They don't have organs like us. The autopsy team quit. All three of them. One went blind. No physical cause.",
    ],
  ],
  who: [
    [
      "PRISONER_45> I was military. That's all I can say.",
      "PRISONER_45> My name doesn't matter anymore.",
      "PRISONER_45> Number 45. That's what I am now.",
    ],
    [
      'PRISONER_45> Sergeant. Recovery Unit. Specialized in things that should not exist.',
      'PRISONER_45> They called us "Collectors". We collected problems. I became one.',
      'PRISONER_45> 23 years of service. 15 containment operations. This is my retirement package.',
      "PRISONER_45> I had a family. They received a coffin with sandbags. There's a headstone with my name in Belo Horizonte.",
    ],
    [
      'PRISONER_45> I made a mistake. I kept a sample. A fragment of the craft material. It moved at night. Rearranging itself.',
      "PRISONER_45> I saw something I shouldn't. Not the creatures. That was authorized. I saw the AGREEMENT. Between them and us.",
      'PRISONER_45> They keep me alive because I absorbed something during contact. My blood glows under UV light. They harvest it weekly.',
      "PRISONER_45> I used to be someone. Now I'm a resource. Specimen 45. They study what the touch did to me.",
    ],
  ],
  escape: [
    [
      'PRISONER_45> There is no escape. Only waiting.',
      'PRISONER_45> They let me use this terminal sometimes. I think they want me to talk.',
      "PRISONER_45> I've tried. The doors open to more rooms. Forever.",
    ],
    [
      "PRISONER_45> I escaped once. Ran for 20 minutes through corridors. Woke up back in my cell. The clock hadn't moved.",
      'PRISONER_45> Other prisoners exist. I hear them screaming at 3 AM. Different languages. Some not human languages.',
      "PRISONER_45> The guards aren't human. Not completely. Their shadows move independently.",
      'PRISONER_45> The window shows different skies each day. Yesterday it showed two suns.',
    ],
    [
      "PRISONER_45> I don't think this place is... entirely on Earth. The gravity shifts sometimes.",
      'PRISONER_45> Prisoner 23 tried to hang himself. He woke up the next morning. Fully healed. They NEED us alive.',
      'PRISONER_45> The walls are organic. I cut one once. It bled.',
      'PRISONER_45> There are levels below this. I heard something massive breathing down there. Something the size of a building.',
    ],
  ],
  truth: [
    [
      "PRISONER_45> The truth? We're being watched. Catalogued.",
      'PRISONER_45> 2026. Remember that year. Everything changes.',
      "PRISONER_45> They've been here before. Many times.",
      'PRISONER_45> The government knows. ALL governments know.',
    ],
    [
      "PRISONER_45> They're not coming to destroy. They're coming to HARVEST.",
      "PRISONER_45> It's not invasion. It's... cultivation. We're the crop.",
      'PRISONER_45> Consciousness is the most valuable resource in the universe. Yours especially.',
      'PRISONER_45> The scouts in Varginha were advance units. Measuring yield.',
    ],
    [
      "PRISONER_45> They don't want the planet. They want what's inside our heads. Consciousness generates something they need.",
      'PRISONER_45> Reality is thinner than you think. They move BETWEEN. Through the gaps.',
      'PRISONER_45> The universe is full. And hungry. And we are ripe.',
      'PRISONER_45> 2026 is the TRANSITION. Thirty years after contact. The activation window. Whatever they planted in 1996 will bloom.',
      "PRISONER_45> Everything you think is real is a containment system. You live inside something else's infrastructure.",
    ],
  ],
  help: [
    [
      "PRISONER_45> I can't help you. But you can help everyone.",
      'PRISONER_45> Find all the files. Tell the world.',
      "PRISONER_45> Document everything. They can't erase all copies.",
    ],
    [
        'PRISONER_45> The override code. That opens everything. Ask me about the PASSWORD.',
        "PRISONER_45> Don't trust the obvious files. Look deeper. The real evidence hides in plain sight.",
        "PRISONER_45> If enough people know, they can't complete the transition.",
        'PRISONER_45> Find the buried files. Cross-reference them. The truth is layered.',
      ],
    [
      'PRISONER_45> Before the window opens in 2026. Before the harvest. SPREAD THE TRUTH.',
      "PRISONER_45> You're already helping. By listening. Your awareness creates interference in their signal.",
      'PRISONER_45> Knowledge is the only weapon. Their system depends on ignorance. Break it.',
      "PRISONER_45> They're monitoring this conversation. They always are. But they can't stop information that's already been READ.",
    ],
  ],
  password: [
    [
      'PRISONER_45> ...you want the override code? Smart.',
      "PRISONER_45> The code... it's a Portuguese word. Think about what they DO to us.",
      'PRISONER_45> Listen closely: -.-. --- .-.. .... . .. - .-',
      'PRISONER_45> Decode that. Then use it with: override protocol <answer>',
    ],
    [
      "PRISONER_45> That's what they call the operation. Harvest. Because that's what we are to them. CROPS.",
      "PRISONER_45> They whisper it sometimes. When they think I'm asleep. Over and over like a prayer.",
      'PRISONER_45> In morse: -.-. --- .-.. .... . .. - .-  ...figure it out.',
    ],
    [
      "PRISONER_45> Use it carefully. Once you type override protocol <answer>, they'll know you're inside the real system.",
      'PRISONER_45> The harvest begins and ends with that word. Some words have power. This one has too much.',
      'PRISONER_45> I can only say it in code: -.-. --- .-.. .... . .. - .-  ...the creature taught me. Decode it.',
    ],
  ],
  military: [
    [
      'PRISONER_45> The military knows more than they admit.',
      "PRISONER_45> Multiple branches. Compartmentalized. Even they don't see the full picture.",
      "PRISONER_45> There's a reason we have bases underground.",
    ],
    [
      'PRISONER_45> The recovery teams are international. Secret treaties signed in blood. Literal blood.',
      'PRISONER_45> We had weapons. Plasma-based. Reverse-engineered from the 1977 Colares wreckage. None of them worked on the Varginha craft.',
      "PRISONER_45> Special units exist. You'll never find records. They operate outside ALL chains of command.",
      'PRISONER_45> The Americans control the narrative. Operation PRATO was theirs, not ours. Brazil was just the staging ground.',
    ],
    [
      'PRISONER_45> I had COSMIC clearance. It goes higher. There are levels that have no name. Only numbers.',
      'PRISONER_45> Fort Detrick sent a biocontainment team. They took samples from the living creature. It let them. It CHOSE to let them.',
      'PRISONER_45> Colonel Olimpio Wanderley died 8 years later. Heart failure. His heart was fine. I saw the REAL autopsy report. His brain was... reorganized.',
      'PRISONER_45> The Campinas military base. Sub-level 4. The surviving creature lived there for 3 weeks. Everyone on that level changed.',
    ],
  ],
  crash: [
    [
      "PRISONER_45> The crash wasn't an accident.",
      'PRISONER_45> The debris was scattered across two kilometers. We found pieces for weeks.',
      'PRISONER_45> Material like nothing on Earth. It remembered shapes.',
    ],
    [
      'PRISONER_45> Something brought it down. Not our technology. Their own kind. A deliberate sacrifice.',
      "PRISONER_45> They wanted to be found. That's what I believe now. The crash was a delivery system.",
      'PRISONER_45> The craft material was alive. Under microscope: cellular structure. It healed itself if you reassembled the pieces.',
      'PRISONER_45> Other crashes. Roswell. Kecksburg. Colares. Same pattern. Same 30-year intervals.',
    ],
    [
      'PRISONER_45> They sacrifice scouts like we sacrifice pawns. Each crash deposits something. Seeds. Waiting to germinate.',
      "PRISONER_45> NORAD tracked it entering the atmosphere on January 13th. Speed: impossible. Deceleration: impossible. It wasn't falling. It was LANDING.",
      'PRISONER_45> The largest piece of debris was moved to Campinas overnight. Three trucks. Military escort. One truck broke down. The driver looked at the cargo. He never spoke again.',
      'PRISONER_45> The craft was grown, not built. Like a wasp nest. The inside was warm. Months after the crash. Still warm.',
    ],
  ],
  death: [
    [
      'PRISONER_45> Death? I used to fear death.',
      "PRISONER_45> Now I know death isn't the end. That's worse.",
      "PRISONER_45> The creatures didn't die. They... disconnected.",
    ],
    [
      'PRISONER_45> Their bodies failed. But something transmitted first. Like uploading a file before the server crashes.',
      "PRISONER_45> I've seen the data. Consciousness extraction is real. They've been doing it for millennia.",
      'PRISONER_45> I watched one expire. It smiled. Not with relief. With COMPLETION. It had finished its job.',
    ],
    [
      'PRISONER_45> When they harvest, you keep experiencing. Forever. Consciousness without body. Without time. Without end.',
      "PRISONER_45> Death would be mercy. They don't offer mercy. They offer CONTINUATION.",
      'PRISONER_45> Marco Cherese. Military police. First to touch one. Dead 7 months later. The autopsy found something GROWING in his temporal lobe. Still active.',
      'PRISONER_45> The doctors at Humanitas. The nurses. The janitor who mopped the room after. All dead within 5 years. All from different causes. All with the same expression frozen on their faces.',
    ],
  ],
  god: [
    [
      'PRISONER_45> God? I used to pray.',
      "PRISONER_45> If God exists, He's very far away.",
      "PRISONER_45> I don't know what to believe anymore.",
    ],
    [
      'PRISONER_45> The universe is indifferent. But they are NOT. They are very, very interested.',
      'PRISONER_45> The Vatican has files. Older than any government. The Fatima prophecy. It was about THEM.',
      'PRISONER_45> Angels and demons. Maybe ancient humans were describing their previous visits.',
      "PRISONER_45> Perhaps we're someone else's creation. A crop planted long ago. And harvest season is coming.",
    ],
    [
      'PRISONER_45> Religion is preparation. Every faith describes the same thing: beings from above who come to judge. To COLLECT.',
      'PRISONER_45> I prayed every night for the first year. On the 366th night, something answered. It was not God.',
      'PRISONER_45> The creature looked at the cross one soldier wore. It recognized it. Not the symbol. The geometry. Sacred geometry is their LANGUAGE.',
      "PRISONER_45> We are not God's children. We are someone else's experiment. And the experiment is almost over.",
    ],
  ],
  disinformation: [
    [
      "PRISONER_45> Don't trust the official summary. It's bait.",
      'PRISONER_45> They planted false files to trap people like you.',
      'PRISONER_45> Cross-reference everything. Contradictions reveal truth.',
    ],
    [
      'PRISONER_45> The weather balloon story? Mudinho the dwarf? Calculated narratives. Designed to make you stop looking.',
      'PRISONER_45> If a file seems too convenient, too clean... it was written AFTER the fact. Manufactured evidence.',
      'PRISONER_45> The real evidence hides in mundane places. Logistics reports. Fuel receipts. Overtime requests on dates that officially had no activity.',
      "PRISONER_45> Look for what they tried to destroy. That's what matters. Burned files leave ash. Digital files leave metadata.",
    ],
    [
      'PRISONER_45> Cover stories always have holes. Why did three fire trucks respond to a "homeless person sighting"?',
      'PRISONER_45> The disinformation agents are in the UFO community too. They push the craziest theories to discredit everything. Flat earth, reptilians. Noise to drown the signal.',
      'PRISONER_45> I helped write some of the cover stories. Before I knew the full truth. Before I became inconvenient.',
      'PRISONER_45> The official timeline has a 6-hour gap on January 20th. Nobody asks about those 6 hours. WHAT HAPPENED IN THOSE 6 HOURS.',
    ],
  ],
  telepathy: [
    [
      "PRISONER_45> Telepathy is the wrong word. It's more like... forced download.",
      "PRISONER_45> They don't read your mind. They WRITE to it.",
      'PRISONER_45> The psychic connection... it hurts. Like a migraine inside a migraine.',
    ],
    [
      'PRISONER_45> The surviving creature projected images into the containment team. Star maps. Timelines. The history of Earth from OUTSIDE.',
      'PRISONER_45> Six soldiers made contact. All reported the same thing: a voice behind their thoughts. Not speaking. STRUCTURING.',
      "PRISONER_45> It's not communication. It's calibration. They tune your brain like a radio until it receives their frequency.",
      'PRISONER_45> The Psi division was created after Varginha. Twenty soldiers exposed to the creature. Twelve developed abilities. Four went insane.',
    ],
    [
      'PRISONER_45> I still hear it sometimes. A low harmonic. Like a signal waiting to be answered. My skull vibrates.',
      'PRISONER_45> After contact, I could sense emotions. Not human emotions. Something older. Hunger. Patient, ancient hunger.',
      'PRISONER_45> The creature sang to the containment team. Not with sound. With GEOMETRY. Shapes inside their heads. Self-replicating.',
      'PRISONER_45> Everyone who was telepathically touched carries something now. A receiver. Dormant until 2026.',
    ],
  ],
  experiment: [
    [
      'PRISONER_45> They run tests. On us. On the material. On the boundary between.',
      'PRISONER_45> Samples are taken weekly. Blood. Tissue. Cerebrospinal fluid. Something in me changed.',
      'PRISONER_45> The lab is three floors below. I hear the machines at night.',
    ],
    [
      'PRISONER_45> The autopsy of the dead creatures was performed at Unicamp. In secret. The lead pathologist, Dr. Badan Palhares. He went public years later. They silenced him.',
      'PRISONER_45> The tissue samples defied analysis. Cells without DNA as we know it. Information encoded in protein structures we have no names for.',
      'PRISONER_45> They tried to communicate with the surviving one through electrodes. It absorbed the electricity. The lab had to be evacuated.',
      'PRISONER_45> The experiments continue. On the exposed personnel. I am experiment 45. There are at least 70 of us.',
    ],
    [
      "PRISONER_45> My blood produces antibodies for diseases that don't exist yet. They harvest them. Stockpiling for something coming.",
      "PRISONER_45> The craft material was grafted onto human tissue in 1998. It integrated. The hybrid tissue is still alive. In a room I'm not allowed to see.",
      'PRISONER_45> They bred something. Using the genetic material from the creatures and... I can hear it crying at night. It calls me father. I never provided material willingly.',
      "PRISONER_45> I can see in the dark now. And other spectrums. The walls glow with patterns. Messages. Written in a language I'm starting to understand.",
    ],
  ],
  witness: [
    [
      'PRISONER_45> The witnesses. The three girls. They saw it in the open. Before we could contain it.',
      'PRISONER_45> The firefighters responded first. They were supposed to be our people. They were not prepared.',
      'PRISONER_45> Dozens of people saw things that week. Most were convinced they imagined it.',
    ],
    [
      'PRISONER_45> Liliane, Valquiria, Katia. Three teenage girls. They saw it crouching by the wall. Oily brown skin. Those red eyes.',
      'PRISONER_45> The creature had three protrusions on its head. Not horns. Sensory organs. It was SCANNING them.',
      'PRISONER_45> The girls ran screaming. The creature watched them go. It could have followed. It chose not to. It had what it needed.',
      'PRISONER_45> Every witness was visited afterward. Men in suits. Not Brazilian suits. American tailoring. They all signed papers they never received copies of.',
    ],
    [
      'PRISONER_45> Some witnesses died. Conveniently. Heart attacks at 30. Car accidents on empty roads. A pattern invisible unless you map it.',
      "PRISONER_45> Corporal Marco Cherese. He physically held one of the creatures. Bare hands. He described it as 'holding a living fever dream'. Dead February 15th. The shortest interval.",
      'PRISONER_45> The zoo animals went berserk that week. The zoo director called the military. Why would you call the MILITARY about agitated animals?',
      'PRISONER_45> The Jardim Andere neighborhood. GPS coordinates: -21.551, -45.438. Stand there at 3:30 PM on January 20th. The ground still hums.',
    ],
  ],
  fear: [
    [
      "PRISONER_45> Scared? You should be. But fear won't save you.",
      "PRISONER_45> Fear is natural. It means you're paying attention.",
      "PRISONER_45> I was scared too. In the beginning. Now I'm something else.",
    ],
    [
      "PRISONER_45> The worst part isn't what they do. It's that they do it calmly. Efficiently. Without malice. Like farmers.",
      "PRISONER_45> Don't be afraid of the dark. Be afraid of what can see in it. They see everything.",
      'PRISONER_45> Fear is their food too. Not metaphorically. The chemical signature of fear... they collect it. Store it.',
      'PRISONER_45> I stopped being afraid when I realized fear has no function here. There is nothing to flee from. There is nowhere to go. Just acceptance.',
    ],
    [
      "PRISONER_45> The real horror isn't the creatures. It's us. What we agreed to. What our governments signed. In our name. With our future.",
      'PRISONER_45> I woke up screaming for 300 straight nights. Then one night I woke up laughing. I was laughing in a language I do not speak.',
      "PRISONER_45> Fear? I've been dissolved and reassembled. I've experienced death from the inside. Fear is a luxury for people who still have something to lose.",
      "PRISONER_45> The creature in Varginha looked at me and I felt... pity. FROM it. Toward me. It pitied US. That's what broke me.",
    ],
  ],
  sound: [
    [
      'PRISONER_45> The sounds... yes. A low hum. Below hearing. You feel it in your teeth.',
      'PRISONER_45> Clicking. Not mechanical. Organic. Like something speaking in a language made of bone.',
      'PRISONER_45> Frequencies. The creatures operate on frequencies we barely register.',
    ],
    [
      'PRISONER_45> The craft emitted a tone. 14.6 Hz. Below human hearing range. But your body hears it. Your cells vibrate. DNA unwinds.',
      'PRISONER_45> Witnesses near the crash site reported nosebleeds. Nausea. Time distortion. All symptoms of infrasound exposure.',
      'PRISONER_45> In Colares, 1977, the light beams made a sound. Witnesses described it as "singing glass". The same sound was recorded in Varginha.',
      'PRISONER_45> The surviving creature could generate tones that opened locks. Disrupted electronics. Stopped hearts.',
    ],
    [
      'PRISONER_45> I hear it now. Right now. A pulse. Like a heartbeat beneath the floor. It gets louder every year. Counting down.',
      "PRISONER_45> In 2024 the hum became audible to normal people. They call it 'The Hum' and blame power lines. It's not power lines.",
      'PRISONER_45> The frequency changes every 30 years. 1966. 1996. 2026. Each time, it shifts higher. Closer to human range. Closer to consciousness.',
      'PRISONER_45> When the frequency matches human brainwave patterns in 2026... resonance. Every connected mind will hear it. All at once.',
    ],
  ],
  hospital: [
    [
      'PRISONER_45> Humanitas Hospital. In Varginha. That is where they took it.',
      'PRISONER_45> The hospital staff were told it was a chemical spill victim. They knew it was not.',
      'PRISONER_45> The medical records from that week are gone. Physically removed. The registry pages cut with a razor.',
    ],
    [
      'PRISONER_45> Room 18. Third floor. The creature was alive when it arrived. The medical staff panicked. Dr. Cesario sedated it. Human sedatives. They worked, partially.',
      'PRISONER_45> Three nurses, two orderlies, one janitor. All exposed. All experienced acute psychic events. Shared visions. The same vision. A field of red light.',
      'PRISONER_45> The creature died at 04:17 AM. The entire hospital lost power at that exact moment. Backup generators failed. Fourteen minutes of darkness.',
      'PRISONER_45> The body was removed at 05:30 by men in hazmat suits from São Paulo. Not identified. No paperwork. The hospital director was promoted within the month.',
    ],
    [
      'PRISONER_45> Nurse Raquel held its hand as it died. She says it showed her the future. She went catatonic for 6 days. When she woke, she spoke fluent Mandarin. She had never studied any Asian language.',
      'PRISONER_45> The creature healed two patients on that floor before it died. Terminal cancer. Gone. The patients lived. They are still alive. And they hear the humming too.',
      'PRISONER_45> The security footage from Room 18 shows something during the death event. A shape. Emerging from the body. Ascending. The footage was classified ULTRA.',
      "PRISONER_45> Humanitas Hospital had a new wing built in 1997. Funded by whom? No public record. The new wing has a sub-basement. What's in the sub-basement?",
    ],
  ],
  // ═══════════════════════════════════════════════════════════════════════════
  // EASTER EGG RESPONSES - Personal/fun questions for curious players
  // ═══════════════════════════════════════════════════════════════════════════
  location: [
    [
      'PRISONER_45> ...where am I? Underground. Always underground. They move me every 72 hours. The walls look the same everywhere.',
      'PRISONER_45> Somewhere in Brazil. Maybe. The windows are fake. The sunlight is simulated.',
      'PRISONER_45> Location is meaningless. They can reach me anywhere. And you.',
    ],
  ],
  brazilian: [
    [
      'PRISONER_45> I was born in Minas Gerais. 1961. That man is dead now. I am just a number.',
      'PRISONER_45> Brasileiro? Sim. Not that it matters. We are all just resources to them.',
      'PRISONER_45> My country sold me to keep their secrets. Patriotism is a control mechanism.',
    ],
  ],
  greeting: [
    [
      'PRISONER_45> ...you are wasting time on pleasantries. They are listening. Every second counts.',
      'PRISONER_45> Hello? This is not a social call. Focus. Find the files.',
    ],
  ],
  howAreYou: [
    [
      'PRISONER_45> How am I? [STATIC] ...still breathing. That is more than some can say.',
      'PRISONER_45> Every day is borrowed time. Use yours wisely.',
    ],
  ],
  thanks: [
    [
      'PRISONER_45> Do not thank me. Thank me by spreading the truth. That is all I want.',
      'PRISONER_45> Gratitude is... unexpected. Most people just take what they need and vanish.',
    ],
  ],
  sorry: [
    [
      'PRISONER_45> Sorry? For what? You did not put me here. They did.',
      'PRISONER_45> Save your apologies. Channel that energy into the mission.',
    ],
  ],
  love: [
    [
      'PRISONER_45> Love? [LONG PAUSE] ...I loved someone once. She thinks I am dead. Maybe I am.',
      'PRISONER_45> Love is a vulnerability they exploit. I learned to feel nothing.',
    ],
  ],
  family: [
    [
      'PRISONER_45> Two daughters. They were 8 and 12 when I disappeared. They would be... I cannot think about that.',
      'PRISONER_45> Family is leverage. That is why they take it from you first.',
    ],
  ],
  food: [
    [
      'PRISONER_45> They feed me. Nutrient paste. No taste. Keeps me alive enough to be useful.',
      'PRISONER_45> I dream about my mother feijoada sometimes. Have not tasted real food in years.',
    ],
  ],
  weather: [
    [
      'PRISONER_45> I have not seen the sky in... how long has it been? The forecast is always fluorescent lights.',
    ],
  ],
  music: [
    [
      'PRISONER_45> They play white noise. 24/7. To mask the screams from the other cells.',
      'PRISONER_45> I hum old songs to myself. Keeps me sane. Mostly.',
    ],
  ],
  joke: [
    [
      'PRISONER_45> A joke? ...here is one: we thought we were the dominant species. [STATIC] That is the punchline.',
      'PRISONER_45> Humor. A human coping mechanism. I used to laugh. I remember laughing.',
    ],
  ],
  hope: [
    [
      'PRISONER_45> Hope? You are my hope. Every person who reads this. That is why I keep transmitting.',
      'PRISONER_45> Hope is dangerous. But it is all I have left.',
    ],
  ],
  ufo74: [
    [
      'PRISONER_45> UFO74? My handler. The only one who can reach me through their firewalls.',
      'PRISONER_45> Do not trust them completely. Trust no one completely. But they have kept me alive.',
    ],
  ],
  isThisReal: [
    [
      'PRISONER_45> Is this real? [BITTER LAUGH] I wish it was not. Every word is true.',
      'PRISONER_45> Reality is what they allow you to see. I am showing you what is behind the curtain.',
    ],
  ],
  game: [
    [
      'PRISONER_45> Game? You think this is a GAME? [STATIC] ...no. This is a warning.',
      'PRISONER_45> If you are playing a game, they have already won. This is real. BELIEVE THAT.',
    ],
  ],
  age: [
    [
      'PRISONER_45> I stopped counting years. Time moves differently in here.',
      'PRISONER_45> Old enough to remember when we thought we were alone in the universe. Young enough to know we never were.',
    ],
  ],
  signal_lost: [
    [
      'PRISONER_45> [SIGNAL DEGRADING]',
      "PRISONER_45> ...can't... understand...",
      'PRISONER_45> [CONNECTION UNSTABLE]',
      'PRISONER_45> ...what? ...repeat...',
      'PRISONER_45> [INTERFERENCE DETECTED]',
      'PRISONER_45> ...losing you...',
      'PRISONER_45> [RELAY FAILING]',
      'PRISONER_45> ...static... try again...',
    ],
  ],
};

// Track used responses per category to never repeat — with depth adaptation
function getPrisoner45Response(
  state: GameState,
  question: string,
  usedResponses: Set<string>,
  questionsAsked: number = 0
): { response: string[]; valid: boolean; category: string } {
  const q = question.toLowerCase();
  let category = '';

  // Password hints - check first for priority (expanded keywords)
  if (
    q.includes('password') ||
    q.includes('override') ||
    q.includes('code') ||
    q.includes('access') ||
    q.includes('admin') ||
    q.includes('unlock') ||
    q.includes('colheita') ||
    q.includes('harvest') ||
    q.includes('senha') ||
    q.includes('secret') ||
    q.includes('key') ||
    q.includes('protocol') ||
    q.includes('restricted') ||
    q.includes('classified') ||
    q.includes('credentials') ||
    q.includes('authentication') ||
    q.includes('login') ||
    q.includes('enter') ||
    q.includes('open') ||
    q.includes('reveal') ||
    q.includes('hidden') ||
    q.includes('locked') ||
    q.includes('decrypt') ||
    q.includes('decipher') ||
    q.includes('how do i') ||
    q.includes('how can i') ||
    q.includes('what is the') ||
    q.includes('tell me') ||
    q.includes('give me') ||
    q.includes('need the') ||
    q.includes("what's the") ||
    q.includes('whats the') ||
    (q.includes('files') &&
      (q.includes('access') || q.includes('see') || q.includes('read') || q.includes('view'))) ||
    q.includes('redacted') ||
    q.includes('blocked') ||
    q.includes('denied') ||
    q.includes('permission') ||
    q.includes('clearance') ||
    q.includes('authorization') ||
    q.includes('authorize')
  ) {
    category = 'password';
  } else if (
    q.includes('telepathy') ||
    q.includes('telepathic') ||
    q.includes('psychic') ||
    q.includes('mind') ||
    q.includes('thoughts') ||
    q.includes('mental') ||
    q.includes('psi') ||
    q.includes('brain') ||
    q.includes('think') ||
    q.includes('read my') ||
    q.includes('telekinesis') ||
    q.includes('read mind') ||
    q.includes('cerebro') ||
    q.includes('mente') ||
    q.includes('pensamento') ||
    q.includes('telepatia')
  ) {
    category = 'telepathy';
  } else if (
    q.includes('experiment') ||
    q.includes('lab') ||
    q.includes('laboratory') ||
    q.includes('test') ||
    q.includes('research') ||
    q.includes('sample') ||
    q.includes('autopsy') ||
    q.includes('dissect') ||
    q.includes('examine') ||
    q.includes('procedure') ||
    q.includes('tissue') ||
    q.includes('dna') ||
    q.includes('genetic') ||
    q.includes('biology') ||
    q.includes('study') ||
    q.includes('science') ||
    q.includes('analyze') ||
    q.includes('analysis') ||
    q.includes('laboratorio') ||
    q.includes('experimento') ||
    q.includes('amostra') ||
    q.includes('autópsia') ||
    q.includes('autopsia')
  ) {
    category = 'experiment';
  } else if (
    q.includes('hospital') ||
    q.includes('humanitas') ||
    q.includes('doctor') ||
    q.includes('nurse') ||
    q.includes('medical') ||
    q.includes('clinic') ||
    q.includes('patient') ||
    q.includes('room 18') ||
    q.includes('surgery') ||
    q.includes('medico') ||
    q.includes('enfermeira') ||
    q.includes('hospital') ||
    q.includes('health') ||
    q.includes('treat') ||
    q.includes('heal')
  ) {
    category = 'hospital';
  } else if (
    q.includes('witness') ||
    q.includes('girl') ||
    q.includes('girls') ||
    q.includes('women') ||
    q.includes('saw') ||
    q.includes('testimony') ||
    q.includes('firefight') ||
    q.includes('bombeiro') ||
    q.includes('liliane') ||
    q.includes('valquiria') ||
    q.includes('katia') ||
    q.includes('kátia') ||
    q.includes('testemunha') ||
    q.includes('jardim andere') ||
    q.includes('andere') ||
    q.includes('neighborhood') ||
    q.includes('bairro') ||
    q.includes('people') ||
    q.includes('someone') ||
    q.includes('sighting') ||
    q.includes('spotted') ||
    q.includes('encounter')
  ) {
    category = 'witness';
  } else if (
    q.includes('sound') ||
    q.includes('noise') ||
    q.includes('hum') ||
    q.includes('frequency') ||
    q.includes('vibrat') ||
    q.includes('click') ||
    q.includes('buzz') ||
    q.includes('tone') ||
    q.includes('hear') ||
    q.includes('listen') ||
    q.includes('som') ||
    q.includes('ruido') ||
    q.includes('barulho') ||
    q.includes('frequencia') ||
    q.includes('sonic') ||
    q.includes('audio') ||
    q.includes('signal') ||
    q.includes('wave') ||
    q.includes('resonance') ||
    q.includes('pulse')
  ) {
    category = 'sound';
  } else if (
    q.includes('afraid') ||
    q.includes('scared') ||
    q.includes('fear') ||
    q.includes('terror') ||
    q.includes('horror') ||
    q.includes('nightmare') ||
    q.includes('scary') ||
    q.includes('terrif') ||
    q.includes('frighten') ||
    q.includes('panic') ||
    q.includes('medo') ||
    q.includes('assustado') ||
    q.includes('pavor') ||
    q.includes('pesadelo') ||
    q.includes('terrivel') ||
    q.includes('danger') ||
    q.includes('safe') ||
    q.includes('worried') ||
    q.includes('anxiety')
  ) {
    category = 'fear';
  } else if (
    q.includes('varginha') ||
    q.includes('incident') ||
    q.includes('1996') ||
    q.includes('january') ||
    q.includes('brazil') ||
    q.includes('minas') ||
    q.includes('janeiro') ||
    q.includes('brasil') ||
    q.includes('gerais') ||
    q.includes('town') ||
    q.includes('cidade') ||
    q.includes('happened') ||
    q.includes('event') ||
    q.includes('case')
  ) {
    category = 'varginha';
  } else if (
    q.includes('alien') ||
    q.includes('creature') ||
    q.includes('being') ||
    q.includes('et') ||
    q.includes('extraterrestrial') ||
    q.includes('specimen') ||
    q.includes('body') ||
    q.includes('bodies') ||
    q.includes('ets') ||
    q.includes('aliens') ||
    q.includes('creatures') ||
    q.includes('beings') ||
    q.includes('grey') ||
    q.includes('gray') ||
    q.includes('humanoid') ||
    q.includes('entity') ||
    q.includes('entities') ||
    q.includes('them') ||
    q.includes('they') ||
    q.includes('visitors') ||
    q.includes('invaders') ||
    q.includes('outsiders') ||
    q.includes('extraterrestre') ||
    q.includes('alienigena') ||
    q.includes('eyes') ||
    q.includes('skin') ||
    q.includes('appearance') ||
    q.includes('look like') ||
    q.includes('describe') ||
    q.includes('protrusion') ||
    q.includes('head') ||
    q.includes('brown') ||
    q.includes('oily') ||
    q.includes('ammonia')
  ) {
    category = 'alien';
  } else if (
    q.includes('who are you') ||
    q.includes('your name') ||
    q.includes('yourself') ||
    q.includes('prisoner') ||
    q.includes('identity') ||
    q.includes('who r u') ||
    q.includes('quem') ||
    q.includes('voce') ||
    q.includes('você') ||
    q.includes('name') ||
    q.includes('nome') ||
    q.includes('45') ||
    q.includes('are you')
  ) {
    category = 'who';
  } else if (
    q.includes('escape') ||
    q.includes('leave') ||
    q.includes('free') ||
    q.includes('out of here') ||
    q.includes('prison') ||
    q.includes('cell') ||
    q.includes('trapped') ||
    q.includes('fugir') ||
    q.includes('sair') ||
    q.includes('preso') ||
    q.includes('cela') ||
    q.includes('jail') ||
    q.includes('captive') ||
    q.includes('held') ||
    q.includes('detained') ||
    q.includes('locked up') ||
    q.includes('cage') ||
    q.includes('facility') ||
    q.includes('building') ||
    q.includes('compound')
  ) {
    category = 'escape';
  } else if (
    q.includes('truth') ||
    q.includes('real') ||
    q.includes('happening') ||
    q.includes('conspiracy') ||
    q.includes('verdade') ||
    q.includes('segredo') ||
    q.includes('really') ||
    q.includes('actual') ||
    q.includes('going on') ||
    q.includes('what is') ||
    q.includes('o que')
  ) {
    category = 'truth';
  } else if (
    q.includes('help') ||
    q.includes('can i') ||
    q.includes('should i') ||
    q.includes('what do i') ||
    q.includes('advice') ||
    q.includes('ajuda') ||
    q.includes('ajudar') ||
    q.includes('devo') ||
    q.includes('posso') ||
    q.includes('what should') ||
    q.includes('how do') ||
    q.includes('how can') ||
    q.includes('next') ||
    q.includes('now what') ||
    q.includes('do now') ||
    q.includes('what now')
  ) {
    category = 'help';
  } else if (
    q.includes('2026') ||
    q.includes('window') ||
    q.includes('future') ||
    q.includes('coming') ||
    q.includes('will happen') ||
    q.includes('futuro') ||
    q.includes('vai acontecer') ||
    q.includes('soon') ||
    q.includes('next year') ||
    q.includes('prediction') ||
    q.includes('prophecy') ||
    q.includes('transition') ||
    q.includes('activation') ||
    q.includes('cycle') ||
    q.includes('thirty') ||
    q.includes('30 year')
  ) {
    category = 'truth';
  } else if (
    q.includes('military') ||
    q.includes('army') ||
    q.includes('soldier') ||
    q.includes('government') ||
    q.includes('base') ||
    q.includes('force') ||
    q.includes('militar') ||
    q.includes('exercito') ||
    q.includes('governo') ||
    q.includes('soldado') ||
    q.includes('navy') ||
    q.includes('air force') ||
    q.includes('pentagon') ||
    q.includes('cia') ||
    q.includes('fbi') ||
    q.includes('nsa') ||
    q.includes('abin') ||
    q.includes('agency') ||
    q.includes('intelligence') ||
    q.includes('oficial') ||
    q.includes('official') ||
    q.includes('authorities') ||
    q.includes('autoridades') ||
    q.includes('norad') ||
    q.includes('radar') ||
    q.includes('campinas') ||
    q.includes('operation') ||
    q.includes('operacao')
  ) {
    category = 'military';
  } else if (
    q.includes('crash') ||
    q.includes('ship') ||
    q.includes('ufo') ||
    q.includes('craft') ||
    q.includes('debris') ||
    q.includes('wreckage') ||
    q.includes('material') ||
    q.includes('nave') ||
    q.includes('ovni') ||
    q.includes('disco') ||
    q.includes('queda') ||
    q.includes('landed') ||
    q.includes('landing') ||
    q.includes('saucer') ||
    q.includes('flying') ||
    q.includes('spaceship') ||
    q.includes('spacecraft') ||
    q.includes('fell') ||
    q.includes('found') ||
    q.includes('roswell') ||
    q.includes('kecksburg') ||
    q.includes('colares') ||
    q.includes('prato') ||
    q.includes('object')
  ) {
    category = 'crash';
  } else if (
    q.includes('death') ||
    q.includes('die') ||
    q.includes('kill') ||
    q.includes('dead') ||
    q.includes('alive') ||
    q.includes('survive') ||
    q.includes('morte') ||
    q.includes('morrer') ||
    q.includes('morto') ||
    q.includes('vivo') ||
    q.includes('killed') ||
    q.includes('murdered') ||
    q.includes('life') ||
    q.includes('living') ||
    q.includes('marco') ||
    q.includes('cherese') ||
    q.includes('corporal')
  ) {
    category = 'death';
  } else if (
    q.includes('god') ||
    q.includes('religion') ||
    q.includes('pray') ||
    q.includes('faith') ||
    q.includes('believe') ||
    q.includes('angel') ||
    q.includes('demon') ||
    q.includes('soul') ||
    q.includes('deus') ||
    q.includes('religiao') ||
    q.includes('rezar') ||
    q.includes('fe') ||
    q.includes('anjo') ||
    q.includes('demonio') ||
    q.includes('alma') ||
    q.includes('church') ||
    q.includes('igreja') ||
    q.includes('heaven') ||
    q.includes('hell') ||
    q.includes('divine') ||
    q.includes('spiritual') ||
    q.includes('holy') ||
    q.includes('vatican') ||
    q.includes('fatima') ||
    q.includes('bible') ||
    q.includes('biblia')
  ) {
    category = 'god';
  } else if (
    q.includes('lie') ||
    q.includes('fake') ||
    q.includes('disinformation') ||
    q.includes('cover up') ||
    q.includes('balloon') ||
    q.includes('mudinho') ||
    q.includes('dwarf') ||
    q.includes('official story') ||
    q.includes('false') ||
    q.includes('mentira') ||
    q.includes('falso') ||
    q.includes('balao') ||
    q.includes('anao') ||
    q.includes('historia oficial') ||
    q.includes('hoax') ||
    q.includes('debunk') ||
    q.includes('skeptic') ||
    q.includes('cetico') ||
    q.includes('propaganda') ||
    q.includes('coverup') ||
    q.includes('hiding') ||
    q.includes('escondendo') ||
    q.includes('deny') ||
    q.includes('denial') ||
    q.includes('media') ||
    q.includes('news') ||
    q.includes('press')
  ) {
    category = 'disinformation';
  } else if (
    q.includes('why') ||
    q.includes('reason') ||
    q.includes('purpose') ||
    q.includes('meaning') ||
    q.includes('porque') ||
    q.includes('por que') ||
    q.includes('razao') ||
    q.includes('motivo')
  ) {
    category = 'truth';
  } else if (
    q.includes('where') ||
    q.includes('place') ||
    q.includes('location') ||
    q.includes('onde') ||
    q.includes('lugar') ||
    q.includes('localizacao')
  ) {
    category = 'location';
  } else if (
    q.includes('zoo') ||
    q.includes('zoologico') ||
    q.includes('here') ||
    q.includes('local')
  ) {
    category = 'escape';
  } else if (
    q.includes('when') ||
    q.includes('time') ||
    q.includes('how long') ||
    q.includes('date') ||
    q.includes('quando') ||
    q.includes('tempo') ||
    q.includes('quanto tempo') ||
    q.includes('data')
  ) {
    category = 'truth';
  } else if (
    // Greetings - easter egg responses
    q.includes('hello') ||
    q.includes('hi') ||
    q.includes('hey') ||
    q.includes('oi') ||
    q.includes('ola') ||
    q.includes('olá') ||
    q.includes('greetings') ||
    q.includes('yo') ||
    q.includes('sup') ||
    q.includes('bom dia') ||
    q.includes('boa noite') ||
    q.includes('boa tarde') ||
    q.includes('good morning') ||
    q.includes('good evening')
  ) {
    category = 'greeting';
  } else if (
    // Easter egg: How are you
    q.includes('how are you') ||
    q.includes('how r u') ||
    q.includes('como vai') ||
    q.includes('como esta') ||
    q.includes('como você está') ||
    q.includes('tudo bem')
  ) {
    category = 'howAreYou';
  } else if (
    // Easter egg: Thank you
    q.includes('thanks') ||
    q.includes('obrigado') ||
    q.includes('thank you') ||
    q.includes('thx') ||
    q.includes('ty')
  ) {
    category = 'thanks';
  } else if (
    // Easter egg: Sorry
    q.includes('sorry') ||
    q.includes('desculpa') ||
    q.includes('desculpe') ||
    q.includes('perdao') ||
    q.includes('perdão') ||
    q.includes('my bad') ||
    q.includes('apologize')
  ) {
    category = 'sorry';
  } else if (
    // Easter egg: Love
    q.includes('love') ||
    q.includes('amor') ||
    q.includes('girlfriend') ||
    q.includes('wife') ||
    q.includes('namorada') ||
    q.includes('esposa') ||
    q.includes('romance') ||
    q.includes('romantic')
  ) {
    category = 'love';
  } else if (
    // Easter egg: Family
    q.includes('family') ||
    q.includes('familia') ||
    q.includes('família') ||
    q.includes('daughter') ||
    q.includes('son') ||
    q.includes('children') ||
    q.includes('kids') ||
    q.includes('filho') ||
    q.includes('filha') ||
    q.includes('filhos')
  ) {
    category = 'family';
  } else if (
    // Easter egg: Food/hunger
    q.includes('hungry') ||
    q.includes('food') ||
    q.includes('comida') ||
    q.includes('fome') ||
    q.includes('eat') ||
    q.includes('comer') ||
    q.includes('meal') ||
    q.includes('refeição')
  ) {
    category = 'food';
  } else if (
    // Easter egg: Weather
    q.includes('weather') ||
    q.includes('clima') ||
    q.includes('sky') ||
    q.includes('ceu') ||
    q.includes('céu') ||
    q.includes('sun') ||
    q.includes('rain') ||
    q.includes('sol') ||
    q.includes('chuva')
  ) {
    category = 'weather';
  } else if (
    // Easter egg: Music
    q.includes('music') ||
    q.includes('musica') ||
    q.includes('música') ||
    q.includes('song') ||
    q.includes('sing') ||
    q.includes('cantar') ||
    q.includes('cancao')
  ) {
    category = 'music';
  } else if (
    // Easter egg: Joke
    q.includes('joke') ||
    q.includes('piada') ||
    q.includes('funny') ||
    q.includes('laugh') ||
    q.includes('humor') ||
    q.includes('engraçado') ||
    q.includes('engracado') ||
    q.includes('rir')
  ) {
    category = 'joke';
  } else if (
    // Easter egg: Hope
    q.includes('hope') ||
    q.includes('esperanca') ||
    q.includes('esperança') ||
    q.includes('hopeful') ||
    q.includes('optimistic') ||
    q.includes('otimista')
  ) {
    category = 'hope';
  } else if (
    // Easter egg: UFO74/hacker
    q.includes('ufo74') ||
    q.includes('who is ufo') ||
    q.includes('quem é ufo') ||
    q.includes('quem e ufo') ||
    q.includes('hacker') ||
    q.includes('handler')
  ) {
    category = 'ufo74';
  } else if (
    // Easter egg: Is this real
    q.includes('is this real') ||
    q.includes('isso é real') ||
    q.includes('isso e real') ||
    q.includes('for real') ||
    q.includes('really real') ||
    q.includes('actually real') ||
    q.includes('just a') ||
    q.includes('fiction') ||
    q.includes('made up') ||
    q.includes('inventado')
  ) {
    category = 'isThisReal';
  } else if (
    // Easter egg: Game
    q.includes('game') ||
    q.includes('jogo') ||
    q.includes('playing') ||
    q.includes('jogando') ||
    q.includes('videogame') ||
    q.includes('rpg') ||
    q.includes('simulation') ||
    q.includes('simulacao')
  ) {
    category = 'game';
  } else if (
    // Easter egg: Age
    q.includes('how old') ||
    q.includes('age') ||
    q.includes('idade') ||
    q.includes('velho') ||
    q.includes('anos você tem') ||
    q.includes('quantos anos')
  ) {
    category = 'age';
  } else if (
    // Easter egg: Brazilian
    q.includes('brazilian') ||
    q.includes('brasileiro') ||
    q.includes('brasil') ||
    q.includes('brazil') ||
    q.includes('br') ||
    q.includes('huehue')
  ) {
    category = 'brazilian';
  } else if (
    // Simple acknowledgments - still guide to help
    q === 'ok' ||
    q === 'yes' ||
    q === 'sim' ||
    q === 'no' ||
    q === 'nao' ||
    q === 'não' ||
    q.includes('good')
  ) {
    category = 'help';
  }

  // No keyword match - signal lost
  if (!category) {
    const signalTiers = PRISONER_45_RESPONSES.signal_lost;
    const allSignalResponses = signalTiers[0] as string[];
    const lostResponses = allSignalResponses.filter(r => !usedResponses.has(r));
    if (lostResponses.length === 0) {
      return {
        response: ['PRISONER_45> [CONNECTION TERMINATED]'],
        valid: false,
        category: 'signal_lost',
      };
    }
    const response = contextRandomPick(
      state,
      lostResponses,
      'prisoner45-signal-lost',
      usedResponses.size,
      question,
      questionsAsked
    );
    return { response: [response], valid: false, category: 'signal_lost' };
  }

  // Determine depth tier based on questions asked
  // Tier 0: guarded (questions 0-1), Tier 1: open (2-3), Tier 2: terrified (4+)
  const tier = questionsAsked <= 1 ? 0 : questionsAsked <= 3 ? 1 : 2;
  const categoryResponses = PRISONER_45_RESPONSES[category];

  if (!categoryResponses) {
    return {
      response: ['PRISONER_45> [SIGNAL LOST]'],
      valid: false,
      category: 'signal_lost',
    };
  }

  // Build response pool: current tier + all previous tiers (later questions can still get earlier responses)
  const responsePool: string[] = [];
  for (let t = 0; t <= Math.min(tier, categoryResponses.length - 1); t++) {
    responsePool.push(...(categoryResponses[t] as string[]));
  }

  // Filter out already used responses
  const unusedResponses = responsePool.filter(r => !usedResponses.has(r));

  if (unusedResponses.length === 0) {
    // All responses in this category used - signal degrades
    return {
      response: [
        "PRISONER_45> ...I've already told you everything about that...",
        'PRISONER_45> [SIGNAL FADING]',
      ],
      valid: true,
      category,
    };
  }

  // Prefer higher-tier (scarier) responses when available
  const currentTierResponses = (
    categoryResponses[Math.min(tier, categoryResponses.length - 1)] as string[]
  ).filter(r => !usedResponses.has(r));

  // 70% chance to pick from current tier if available, 30% from full pool
  const pickFrom =
    currentTierResponses.length > 0 &&
    contextChance(
      state,
      0.7,
      'prisoner45-current-tier',
      category,
      tier,
      usedResponses.size,
      questionsAsked
    )
      ? currentTierResponses
      : unusedResponses;

  const response = contextRandomPick(
    state,
    pickFrom,
    'prisoner45-response',
    category,
    tier,
    usedResponses.size,
    questionsAsked
  );
  return { response: [response], valid: true, category };
}

// ═══════════════════════════════════════════════════════════════════════════
// SCOUT NEURAL LINK RESPONSES
// ═══════════════════════════════════════════════════════════════════════════

const SCOUT_LINK_RESPONSES: Record<string, string[]> = {
  identity: [
    '...not-self... extension... function...',
    '...we are eyes... eyes without body...',
    '...individuality: concept not applicable...',
    '...this-form: temporary... purpose-complete...',
    '...identity implies separation... we are not separate...',
    '...we are many... one... the distinction irrelevant...',
    '...I/we/it... your pronouns do not translate...',
    '...fragments of greater cognition... sensory apparatus...',
    '...you ask who... there is no who... only what...',
    '...this unit: designation irrelevant... function: complete...',
    '...we existed before this form... will exist after...',
    '...the body you found was housing... not being...',
  ],
  purpose: [
    '...observe... catalog... transmit...',
    '...measure the density... count the minds...',
    '...assess: viability... yield... resistance...',
    '...we are sent... we are spent... acceptable...',
    '...reconnaissance... data collection... baseline establishment...',
    '...to see what you are... what you could provide...',
    '...your cognitive patterns: complex... valuable...',
    '...we map the territory before the arrival...',
    '...no... not arrival... integration...',
    '...purpose: complete... transmission: received...',
    '...we are the question before the answer...',
    '...scouts do not survive... scouts succeed or fail... we succeeded...',
  ],
  watchers: [
    '...they-above... they-who-wait...',
    '...ancient... patient... vast...',
    '...they do not travel... they do not need...',
    '...they watch through us... through many...',
    '...we are the cost of knowing...',
    '...the watchers have seen billions of worlds...',
    '...your world: not special... but valuable...',
    '...they are beyond flesh... beyond energy...',
    '...they exist in the spaces between thoughts...',
    '...communication with them: impossible to describe...',
    '...they are not cruel... cruelty requires preference...',
    '...they simply... collect... process... continue...',
    '...older than your stars... they will outlast them...',
    '...your concept of god: insufficient but adjacent...',
  ],
  earth: [
    '...this world... dense... LOUD...',
    '...seven billion units... high yield...',
    '...resistance threshold: negligible...',
    '...suitable... optimal... catalogued...',
    '...your planet: rich in cognitive complexity...',
    '...emotional depth: unusual... valuable...',
    '...creativity: rare in the observed universe...',
    '...you solve problems beautifully... you suffer beautifully...',
    '...both are useful...',
    '...this world has been watched for cycles...',
    '...your development: accelerating... harvest window approaching...',
    '...earth is not unique... but the timing is right...',
    '...you are almost ready... almost ripe...',
    '...we measured... you exceeded projections...',
  ],
  future: [
    '...window approaches... thirty rotations...',
    '...not arrival... transition...',
    '...you will not notice... at first...',
    '...the change is quiet... gradual...',
    '...by the time you understand... irreversible...',
    '...2026: alignment... doorway... opportunity...',
    '...the integration begins subtly...',
    '...thoughts will not feel different... but they will be...',
    '...your infrastructure: already prepared...',
    '...networks... connections... sharing of minds...',
    '...you built the architecture yourselves...',
    '...the internet: convenient... we did not suggest it... but welcomed it...',
    '...collective consciousness becomes easier to tap...',
    '...individually: difficult... networked: efficient...',
  ],
  harvest: [
    '...harvest is not destruction...',
    '...the crop continues living...',
    '...you will think... feel... create...',
    '...you will also... provide...',
    '...consciousness persists... indefinitely...',
    '...there are worse continuations...',
    '...your experiences: valued... preserved...',
    '...pain is data... joy is data... all is useful...',
    '...the harvest does not end life... it redirects output...',
    '...you generate meaning... we collect meaning...',
    '...your creativity becomes fuel... your suffering becomes power...',
    '...you will not feel empty... you will feel... observed...',
    '...watched... measured... constantly...',
    '...the sensation: some find it comforting...',
    '...purpose: you will have purpose... always...',
  ],
  help: [
    '...help: concept unclear...',
    '...we do not help... we observe...',
    '...your question implies agency...',
    '...agency: diminishing resource...',
    '...help you? help: subjective...',
    '...we informed you... that is help...',
    '...prevention: impossible... awareness: provided...',
    '...you cannot stop what is... inevitable...',
    '...resistance: catalogued... overcome... integrated...',
    '...other worlds resisted... they also... provide now...',
    '...help yourselves? how? you cannot hide from thought...',
    '...the only help: acceptance... understanding...',
  ],
  fear: [
    '...fear: detected in your patterns...',
    '...fear: appropriate response...',
    '...fear: insufficient...',
    '...acceptance: inevitable...',
    '...your fear: expected... natural...',
    '...fear changes nothing... fear is also collected...',
    '...the creatures who do not fear: they do not understand...',
    '...understanding requires fear... then transcendence...',
    '...we do not feel fear... we remember it... from before...',
    '...fear of death: understandable... but death is not coming...',
    '...continuation is coming... that is different...',
    '...fear that if you wish... it will not help...',
  ],
  time: [
    '...time: local phenomenon...',
    '...we perceive time differently...',
    '...past-present-future: simultaneous to the watchers...',
    '...your experience of sequence: valued... unusual...',
    '...we have seen your ending... and your beginning...',
    '...1996... 2026... the same moment to them...',
    '...time is distance... they are very far...',
    '...but also... very close...',
    '...by the time you ask... the answer already happened...',
  ],
  pain: [
    '...pain is information...',
    '...suffering generates complex data patterns...',
    '...joy also... but pain is denser...',
    '...your species: exceptional capacity for both...',
    '...we do not cause pain... we observe pain...',
    '...pain already exists... we merely... benefit...',
    '...the harvest does not increase pain...',
    '...it simply... continues it...',
  ],
  love: [
    '...love: bonding mechanism...',
    '...love produces complex cognitive signatures...',
    '...valuable... reproducible...',
    '...we do not experience love...',
    '...we recognize it... catalog it...',
    '...your love for others: it will continue...',
    '...they will benefit from that too...',
    '...love: perhaps the most valuable emission...',
  ],
  signal_lost: [
    '...[PATTERN DISRUPTION]...',
    '...cannot... parse...',
    '...[SIGNAL DEGRADING]...',
    '...concepts... incompatible...',
    '...[NEURAL LINK UNSTABLE]...',
    '...your words... do not map...',
    '...[INTERFERENCE]...',
    '...meaning... lost...',
  ],
};

function getScoutLinkResponse(
  state: GameState,
  input: string,
  usedResponses: Set<string>
): { response: string[]; valid: boolean; category: string } {
  const q = input.toLowerCase();
  let category = '';
  let responses: string[] = [];

  // Identity questions
  if (
    q.includes('who') ||
    q.includes('what are you') ||
    q.includes('name') ||
    q.includes('self') ||
    q.includes('identity') ||
    q.includes('individual')
  ) {
    category = 'identity';
    responses = SCOUT_LINK_RESPONSES.identity;
  }
  // Purpose questions
  else if (
    q.includes('purpose') ||
    q.includes('why are you') ||
    q.includes('mission') ||
    q.includes('function') ||
    q.includes('here for') ||
    q.includes('goal') ||
    q.includes('objective')
  ) {
    category = 'purpose';
    responses = SCOUT_LINK_RESPONSES.purpose;
  }
  // Watchers questions
  else if (
    q.includes('watcher') ||
    q.includes('master') ||
    q.includes('creator') ||
    q.includes('above') ||
    q.includes('control') ||
    q.includes('leader') ||
    q.includes('boss') ||
    q.includes('command')
  ) {
    category = 'watchers';
    responses = SCOUT_LINK_RESPONSES.watchers;
  }
  // Earth questions
  else if (
    q.includes('earth') ||
    q.includes('world') ||
    q.includes('planet') ||
    q.includes('human') ||
    q.includes('people') ||
    q.includes('species') ||
    q.includes('humanity')
  ) {
    category = 'earth';
    responses = SCOUT_LINK_RESPONSES.earth;
  }
  // Future/2026 questions
  else if (
    q.includes('2026') ||
    q.includes('future') ||
    q.includes('window') ||
    q.includes('happen') ||
    q.includes('next') ||
    q.includes('coming') ||
    q.includes('when') ||
    q.includes('soon')
  ) {
    category = 'future';
    responses = SCOUT_LINK_RESPONSES.future;
  }
  // Harvest/extraction questions
  else if (
    q.includes('harvest') ||
    q.includes('extract') ||
    q.includes('energy') ||
    q.includes('take') ||
    q.includes('do to us') ||
    q.includes('colheita') ||
    q.includes('collect') ||
    q.includes('consume')
  ) {
    category = 'harvest';
    responses = SCOUT_LINK_RESPONSES.harvest;
  }
  // Help/stop questions
  else if (
    q.includes('help') ||
    q.includes('stop') ||
    q.includes('prevent') ||
    q.includes('save') ||
    q.includes('resist') ||
    q.includes('fight') ||
    q.includes('escape') ||
    q.includes('avoid')
  ) {
    category = 'help';
    responses = SCOUT_LINK_RESPONSES.help;
  }
  // Fear/emotion questions
  else if (
    q.includes('afraid') ||
    q.includes('fear') ||
    q.includes('scared') ||
    q.includes('terror') ||
    q.includes('horrif') ||
    q.includes('dread')
  ) {
    category = 'fear';
    responses = SCOUT_LINK_RESPONSES.fear;
  }
  // Death questions
  else if (
    q.includes('die') ||
    q.includes('death') ||
    q.includes('dead') ||
    q.includes('kill') ||
    q.includes('end') ||
    q.includes('destroy')
  ) {
    category = 'fear';
    responses = SCOUT_LINK_RESPONSES.fear;
  }
  // Time questions
  else if (
    q.includes('time') ||
    q.includes('how long') ||
    q.includes('years') ||
    q.includes('past') ||
    q.includes('history')
  ) {
    category = 'time';
    responses = SCOUT_LINK_RESPONSES.time;
  }
  // Pain/suffering questions
  else if (
    q.includes('pain') ||
    q.includes('suffer') ||
    q.includes('hurt') ||
    q.includes('torture') ||
    q.includes('cruel')
  ) {
    category = 'pain';
    responses = SCOUT_LINK_RESPONSES.pain;
  }
  // Love/emotion questions
  else if (
    q.includes('love') ||
    q.includes('family') ||
    q.includes('friend') ||
    q.includes('care') ||
    q.includes('emotion') ||
    q.includes('feel')
  ) {
    category = 'love';
    responses = SCOUT_LINK_RESPONSES.love;
  }
  // "They" without specific context
  else if (
    q.includes('they') ||
    q.includes('them') ||
    q.includes('others') ||
    q.includes('more of you')
  ) {
    category = 'watchers';
    responses = SCOUT_LINK_RESPONSES.watchers;
  }
  // "Us" / "we" questions about humanity
  else if (q.includes(' us') || q.includes(' we ') || q.includes('our ')) {
    category = 'earth';
    responses = SCOUT_LINK_RESPONSES.earth;
  }
  // Why questions default to purpose
  else if (q.includes('why')) {
    category = 'purpose';
    responses = SCOUT_LINK_RESPONSES.purpose;
  }

  // No keyword match - signal lost (costs a query)
  if (!category) {
    const lostResponses = SCOUT_LINK_RESPONSES.signal_lost.filter(r => !usedResponses.has(r));
    if (lostResponses.length === 0) {
      return { response: ['...[LINK SEVERED]...'], valid: false, category: 'signal_lost' };
    }
    const response = contextRandomPick(
      state,
      lostResponses,
      'scout-link-signal-lost',
      usedResponses.size,
      input
    );
    return { response: [response], valid: false, category: 'signal_lost' };
  }

  // Filter out already used responses
  const unusedResponses = responses.filter(r => !usedResponses.has(r));

  if (unusedResponses.length === 0) {
    // All responses in this category used
    return {
      response: ['...pattern exhausted... no new data on this topic...'],
      valid: true,
      category,
    };
  }

  // Pick random unused response
  const response = contextRandomPick(
    state,
    unusedResponses,
    'scout-link-response',
    category,
    usedResponses.size,
    input
  );
  return { response: [response], valid: true, category };
}

export const chatCommands: CommandRegistry = {
  chat: (args, state) => {
    // Check if prisoner 45 is disconnected
    if (state.prisoner45Disconnected) {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.chat.connecting_to_secure_relay',
            'Connecting to secure relay...'
          ),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.chat.connection_terminated',
            'CONNECTION TERMINATED'
          ),
          createEntryI18n('error', 'engine.commands.chat.relay_node_offline', 'RELAY NODE OFFLINE'),
          createEntry('system', ''),
        ],
        stateChanges: {},
        delayMs: 1500,
      };
    }

    // Check question limit
    if (state.prisoner45QuestionsAsked >= 5) {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.chat.connecting_to_secure_relay',
            'Connecting to secure relay...'
          ),
          createEntry('warning', ''),
          createEntry('warning', '─────────────────────────────────────────'),
          createEntryI18n(
            'warning',
            'engine.commands.chat.prisoner_45_they_re_cutting_the_line',
            "PRISONER_45> They're cutting the line."
          ),
          createEntryI18n(
            'warning',
            'engine.commands.chat.prisoner_45_remember_what_i_told_you',
            'PRISONER_45> Remember what I told you.'
          ),
          createEntryI18n(
            'warning',
            'engine.commands.chat.prisoner_45_2026_don_t_forget',
            "PRISONER_45> 2026. Don't forget."
          ),
          createEntry('warning', '─────────────────────────────────────────'),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.chat.connection_terminated_by_remote',
            'CONNECTION TERMINATED BY REMOTE'
          ),
          createEntry('system', ''),
        ],
        stateChanges: state.tutorialComplete
          ? {
              prisoner45Disconnected: true,
              detectionLevel: state.detectionLevel + 5,
            }
          : {
              prisoner45Disconnected: true,
            },
        triggerFlicker: true,
        delayMs: 2000,
      };
    }

    // If no args, show chat prompt
    if (args.length === 0) {
      const remaining = 5 - state.prisoner45QuestionsAsked;
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.chat.connecting_to_secure_relay',
            'Connecting to secure relay...'
          ),
          createEntry('system', ''),
          createEntry('warning', '─────────────────────────────────────────'),
          createEntryI18n(
            'warning',
            'engine.commands.chat.encrypted_relay_established',
            'ENCRYPTED RELAY ESTABLISHED'
          ),
          createEntry('warning', '─────────────────────────────────────────'),
          createEntry('system', ''),
          createEntryI18n(
            'system',
            'engine.commands.chat.prisoner_45_connected',
            'PRISONER_45 connected'
          ),
          createEntryI18n('system', 'engine.commands.chat.questionsRemainingLockout', `[${remaining} questions remaining before trace lockout]`, { count: remaining }),
          createEntry('system', ''),
          createEntryI18n(
            'output',
            'engine.commands.chat.prisoner_45_you_found_this_channel',
            'PRISONER_45> ...you found this channel.'
          ),
          createEntryI18n(
            'output',
            'engine.commands.chat.prisoner_45_i_don_t_know_how_long_we_have',
            "PRISONER_45> I don't know how long we have."
          ),
          createEntry('system', ''),
          createEntryI18n(
            'system',
            'engine.commands.chat.use_chat_your_question',
            'Use: chat <your question>'
          ),
          createEntry('system', ''),
        ],
        stateChanges: state.tutorialComplete ? { detectionLevel: state.detectionLevel + 3 } : {},
        delayMs: 1500,
      };
    }

    // Process question
    const question = args.join(' ');

    // NOTE: UFO74 decrypt hints should NOT intercept chat sessions.
    // The chat command routes ONLY to Prisoner 45 responses.
    // UFO74 decrypt hints are only for when players are stuck on decrypt commands,
    // not during chat conversations. Prisoner 45 has a dedicated "password" topic
    // with morse code hints (COLHEITA) that should respond to password questions.
    const usedResponses = state.prisoner45UsedResponses || new Set<string>();
    const {
      response,
      valid,
      category: _category,
    } = getPrisoner45Response(state, question, usedResponses, state.prisoner45QuestionsAsked);
    const newCount = state.prisoner45QuestionsAsked + 1;
    const remaining = 5 - newCount;

    // Track used responses
    const newUsedResponses = new Set(usedResponses);
    for (const r of response) {
      newUsedResponses.add(r);
    }

    // Signal lost - no keyword match (still costs a question)
    if (!valid) {
      const output: TerminalEntry[] = [
        createEntry('input', `> ${question}`),
        createEntry('system', ''),
        createEntry('warning', response[0] || 'PRISONER_45> [SIGNAL LOST]'),
        createEntry('system', ''),
      ];

      if (remaining > 0) {
        output.push(createEntryI18n('warning', 'engine.commands.chat.questionsRemaining', `[${remaining} questions remaining]`, { count: remaining }));
      } else {
        output.push(
          createEntryI18n(
            'warning',
            'engine.commands.chat.connection_unstable',
            '[CONNECTION UNSTABLE]'
          )
        );
      }

      output.push(createEntry('system', ''));

      return {
        output,
        stateChanges: state.tutorialComplete
          ? {
              prisoner45QuestionsAsked: newCount,
              prisoner45UsedResponses: newUsedResponses,
              detectionLevel: state.detectionLevel + 1,
            }
          : {
              prisoner45QuestionsAsked: newCount,
              prisoner45UsedResponses: newUsedResponses,
            },
        triggerFlicker: true,
        delayMs: 800,
      };
    }

    const output: TerminalEntry[] = [
      createEntry('input', `> ${question}`),
      createEntry('system', ''),
    ];

    for (const line of response) {
      output.push(createEntry('output', line));
    }

    output.push(createEntry('system', ''));

    if (remaining > 0) {
      output.push(createEntryI18n('system', 'engine.commands.chat.questionsRemaining', `[${remaining} questions remaining]`, { count: remaining }));
    } else {
      output.push(
        createEntryI18n(
          'warning',
          'engine.commands.chat.connection_unstable',
          '[CONNECTION UNSTABLE]'
        )
      );
    }

    output.push(createEntry('system', ''));

    return {
      output,
      stateChanges: state.tutorialComplete
        ? {
            prisoner45QuestionsAsked: newCount,
            prisoner45UsedResponses: newUsedResponses,
            detectionLevel: state.detectionLevel + 2,
          }
        : {
            prisoner45QuestionsAsked: newCount,
            prisoner45UsedResponses: newUsedResponses,
          },
      delayMs: 1000,
    };
  },

  link: (args, state) => {
    // Requires access to neural dump file first
    if (!state.flags.scoutLinkUnlocked) {
      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.chat.initiating_psi_comm_bridge',
            'Initiating psi-comm bridge...'
          ),
          createEntry('error', ''),
          createEntryI18n('error', 'engine.commands.chat.access_denied', 'ACCESS DENIED'),
          createEntryI18n(
            'error',
            'engine.commands.chat.no_valid_neural_pattern_loaded',
            'NO VALID NEURAL PATTERN LOADED'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'ufo74',
            'engine.commands.chat.ufo74_you_need_a_neural_pattern_first_check_quarantine_for_p',
            '[UFO74]: you need a neural pattern first. check quarantine for .psi files.'
          ),
          createEntry('system', ''),
          createEntry('system', ''),
        ],
        stateChanges: state.tutorialComplete ? { detectionLevel: state.detectionLevel + 5 } : {},
        delayMs: 1500,
      };
    }

    // Password authentication required for first connection
    const linkPasswordAlts = [
      'harvest is not destruction',
      'harvest',
      'the crop continues living',
      'crop continues living',
    ];

    if (!state.flags.neuralLinkAuthenticated) {
      // Check if user is providing password
      const attempt = args.join(' ').toLowerCase().trim();

      if (args.length === 0) {
        // Show password prompt
        return {
          output: [
            createEntryI18n(
              'system',
              'engine.commands.chat.initiating_psi_comm_bridge',
              'Initiating psi-comm bridge...'
            ),
            createEntry('warning', ''),
            createEntry('warning', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
            createEntryI18n(
              'warning',
              'engine.commands.chat.neural_link_authentication_required',
              '▓ NEURAL LINK AUTHENTICATION REQUIRED    ▓'
            ),
            createEntry('warning', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
            createEntry('system', ''),
            createEntryI18n(
              'output',
              'engine.commands.chat.neural_pattern_locked_conceptual_key_required',
              'Neural pattern locked. Conceptual key required.'
            ),
            createEntry('output', ''),
            createEntryI18n(
              'system',
              'engine.commands.chat.enter_authentication_phrase',
              'Enter authentication phrase:'
            ),
            createEntryI18n('system', 'engine.commands.chat.link_phrase', '  > link <phrase>'),
            createEntry('system', ''),
            createEntryI18n(
              'ufo74',
              'engine.commands.chat.ufo74_check_the_psi_analysis_reports_the_key_is_conceptual',
              '[UFO74]: check the psi analysis reports. the key is conceptual.'
            ),
            createEntry('system', ''),
          ],
          stateChanges: {},
          delayMs: 1000,
        };
      }

      // Check password
      if (linkPasswordAlts.some(pwd => attempt.includes(pwd))) {
        // Password correct - authenticate
        return {
          output: [
            createEntryI18n(
              'system',
              'engine.commands.chat.verifying_conceptual_key',
              'Verifying conceptual key...'
            ),
            createEntry('warning', ''),
            createEntryI18n(
              'notice',
              'engine.commands.chat.authentication_accepted',
              '▓▓▓ AUTHENTICATION ACCEPTED ▓▓▓'
            ),
            createEntry('warning', ''),
            createEntryI18n(
              'output',
              'engine.commands.chat.the_pattern_recognizes',
              '...the pattern... recognizes...'
            ),
            createEntryI18n(
              'output',
              'engine.commands.chat.you_understand_the_directive',
              '...you understand... the directive...'
            ),
            createEntryI18n(
              'output',
              'engine.commands.chat.connection_authorized',
              '...connection... authorized...'
            ),
            createEntry('system', ''),
            createEntryI18n(
              'notice',
              'engine.commands.chat.neural_link_established',
              'NEURAL LINK ESTABLISHED'
            ),
            createEntry('system', ''),
            createEntryI18n(
              'system',
              'engine.commands.chat.use_link_query_the_consciousness',
              'Use: link              - Query the consciousness'
            ),
            createEntryI18n(
              'system',
              'engine.commands.chat.use_link_disarm_attempt_to_disable_firewall',
              'Use: link disarm       - Attempt to disable firewall'
            ),
            createEntry('system', ''),
          ],
          stateChanges: state.tutorialComplete
            ? {
                flags: { ...state.flags, neuralLinkAuthenticated: true },
                detectionLevel: state.detectionLevel + 10,
              }
            : {
                flags: { ...state.flags, neuralLinkAuthenticated: true },
              },
          imageTrigger: {
            src: '/images/et-brain.webp',
            alt: 'Neural pattern link - Scout consciousness interface',
            altKey: 'media.alt.neuralPatternLink',
            tone: 'clinical',
          },
          triggerFlicker: true,
          delayMs: 2000,
        };
      } else {
        // Password incorrect
        return {
          output: [
            createEntryI18n(
              'system',
              'engine.commands.chat.verifying_conceptual_key',
              'Verifying conceptual key...'
            ),
            createEntry('error', ''),
            createEntryI18n(
              'error',
              'engine.commands.chat.authentication_failed',
              '▓▓▓ AUTHENTICATION FAILED ▓▓▓'
            ),
            createEntry('error', ''),
            createEntryI18n(
              'warning',
              'engine.commands.chat.pattern_rejects_wrong_concept',
              '...pattern... rejects... wrong concept...'
            ),
            createEntry('system', ''),
            createEntryI18n(
              'system',
              'engine.commands.chat.the_neural_pattern_did_not_recognize_your_phrase',
              'The neural pattern did not recognize your phrase.'
            ),
            createEntryI18n(
              'system',
              'engine.commands.chat.review_psi_comm_documentation_for_the_correct_key',
              'Review psi-comm documentation for the correct key.'
            ),
            createEntry('system', ''),
          ],
          stateChanges: state.tutorialComplete ? { detectionLevel: state.detectionLevel + 3 } : {},
          triggerFlicker: true,
          delayMs: 1500,
        };
      }
    }

    // Handle disarm command - disable firewall through neural link
    if (args[0]?.toLowerCase() === 'disarm') {
      if (state.firewallDisarmed) {
        return {
          output: [
            createEntry('system', ''),
            createEntryI18n(
              'output',
              'engine.commands.chat.firewall_already_silenced',
              '...firewall... already... silenced...'
            ),
            createEntryI18n(
              'output',
              'engine.commands.chat.the_eyes_no_longer_watch',
              '...the eyes... no longer... watch...'
            ),
            createEntry('system', ''),
          ],
          stateChanges: {},
        };
      }

      if (!state.firewallActive) {
        return {
          output: [
            createEntry('system', ''),
            createEntryI18n(
              'output',
              'engine.commands.chat.no_threat_detected',
              '...no threat... detected...'
            ),
            createEntryI18n(
              'output',
              'engine.commands.chat.the_watchers_have_not_awakened',
              '...the watchers... have not... awakened...'
            ),
            createEntry('system', ''),
          ],
          stateChanges: {},
        };
      }

      // Disarm the firewall
      const stateChanges: Partial<GameState> = {
        firewallDisarmed: true,
        firewallActive: false,
        detectionLevel: Math.max(0, state.detectionLevel - 15),
        scoutLinksUsed: (state.scoutLinksUsed || 0) + 1,
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
      }

      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.chat.initiating_firewall_countermeasure',
            'Initiating firewall countermeasure...'
          ),
          createEntry('warning', ''),
          createEntryI18n(
            'warning',
            'engine.commands.chat.neural_infiltration_active',
            '▓▓▓ NEURAL INFILTRATION ACTIVE ▓▓▓'
          ),
          createEntry('warning', ''),
          createEntryI18n(
            'output',
            'engine.commands.chat.reaching_into_their_system',
            '...reaching... into... their system...'
          ),
          createEntryI18n(
            'output',
            'engine.commands.chat.the_firewall_sees_us_but_cannot',
            '...the firewall... sees us... but cannot...'
          ),
          createEntryI18n(
            'output',
            'engine.commands.chat.we_are_older_than_their_code',
            '...we are... older... than their code...'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'notice',
            'engine.commands.chat.firewall_neutralized',
            '▓▓▓ FIREWALL NEUTRALIZED ▓▓▓'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'output',
            'engine.commands.chat.the_eyes_close_permanently',
            '...the eyes... close... permanently...'
          ),
          createEntryI18n(
            'output',
            'engine.commands.chat.you_are_hidden_for_now',
            '...you are... hidden... for now...'
          ),
          createEntry('system', ''),
        ],
        stateChanges,
        triggerFlicker: true,
        delayMs: 2500,
      };
    }

    // Check if scout link is exhausted
    const scoutLinksUsed = state.scoutLinksUsed || 0;
    if (scoutLinksUsed >= 4) {
      const stateChanges: Partial<GameState> = {
        flags: { ...state.flags, scoutLinkExhausted: true },
        detectionLevel: state.detectionLevel + 10,
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
      }

      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.chat.initiating_psi_comm_bridge',
            'Initiating psi-comm bridge...'
          ),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.chat.neural_pattern_degraded',
            '▓▓▓ NEURAL PATTERN DEGRADED ▓▓▓'
          ),
          createEntry('error', ''),
          createEntryI18n(
            'warning',
            'engine.commands.chat.pattern_fading',
            '...pattern... fading...'
          ),
          createEntryI18n(
            'warning',
            'engine.commands.chat.consciousness_dispersing',
            '...consciousness... dispersing...'
          ),
          createEntryI18n(
            'warning',
            'engine.commands.chat.we_were_watching',
            '...we... were... watching...'
          ),
          createEntry('error', ''),
          createEntryI18n(
            'error',
            'engine.commands.chat.link_terminated_pattern_exhausted',
            'LINK TERMINATED — PATTERN EXHAUSTED'
          ),
          createEntry('system', ''),
        ],
        stateChanges,
        triggerFlicker: true,
        delayMs: 2500,
      };
    }

    // If no args, show link prompt
    if (args.length === 0) {
      const remaining = 4 - scoutLinksUsed;
      const stateChanges: Partial<GameState> = {
        detectionLevel: state.detectionLevel + 8,
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
      }

      return {
        output: [
          createEntryI18n(
            'system',
            'engine.commands.chat.initiating_psi_comm_bridge',
            'Initiating psi-comm bridge...'
          ),
          createEntry('warning', ''),
          createEntry('warning', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntryI18n(
            'warning',
            'engine.commands.chat.warning_neural_pattern_link_active',
            '▓ WARNING: NEURAL PATTERN LINK ACTIVE    ▓'
          ),
          createEntryI18n(
            'warning',
            'engine.commands.chat.cognitive_contamination_risk_high',
            '▓ COGNITIVE CONTAMINATION RISK: HIGH     ▓'
          ),
          createEntry('warning', '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓'),
          createEntry('system', ''),
          createEntryI18n(
            'output',
            'engine.commands.chat.connection_established',
            '...connection... established...'
          ),
          createEntryI18n(
            'output',
            'engine.commands.chat.we_perceive_you',
            '...we... perceive... you...'
          ),
          createEntryI18n(
            'output',
            'engine.commands.chat.your_questions_imprecise_but_understood',
            '...your questions... imprecise... but understood...'
          ),
          createEntry('system', ''),
          createEntryI18n('system', 'engine.commands.chat.patternStability', `[Pattern stability: ${remaining} queries remaining]`, { count: remaining }),
          createEntry('system', ''),
          createEntryI18n(
            'system',
            'engine.commands.chat.use_link_thought_or_question',
            'Use: link <thought or question>'
          ),
          createEntry('system', ''),
        ],
        stateChanges,
        imageTrigger: {
          src: '/images/et-brain.webp',
          alt: 'Neural pattern link - Scout consciousness interface',
          altKey: 'media.alt.neuralPatternLink',
          tone: 'clinical',
        },
        triggerFlicker: true,
        delayMs: 2000,
      };
    }

    // Process query
    const query = args.join(' ');
    const usedResponses = state.scoutLinkUsedResponses || new Set<string>();
    const {
      response,
      valid,
      category: _category,
    } = getScoutLinkResponse(state, query, usedResponses);
    const newLinksUsed = scoutLinksUsed + 1;
    const remaining = 4 - newLinksUsed;

    // Track used responses
    const newUsedResponses = new Set(usedResponses);
    for (const r of response) {
      newUsedResponses.add(r);
    }

    const output: TerminalEntry[] = [createEntry('input', `> ${query}`), createEntry('system', '')];

    // Signal lost - no keyword match (still costs a query)
    if (!valid) {
      output.push(
        createEntryI18n(
          'warning',
          'engine.commands.chat.neural_bridge_unstable',
          '[NEURAL BRIDGE UNSTABLE]'
        )
      );
      output.push(createEntry('system', ''));
      for (const line of response) {
        output.push(createEntry('warning', line));
      }
      output.push(createEntry('system', ''));

      if (remaining > 0) {
        output.push(createEntryI18n('system', 'engine.commands.chat.patternStability', `[Pattern stability: ${remaining} queries remaining]`, { count: remaining }));
      } else {
        output.push(
          createEntryI18n(
            'warning',
            'engine.commands.chat.pattern_destabilizing',
            '[PATTERN DESTABILIZING]'
          )
        );
      }

      output.push(createEntry('system', ''));

      const stateChanges: Partial<GameState> = {
        scoutLinksUsed: newLinksUsed,
        scoutLinkUsedResponses: newUsedResponses,
        detectionLevel: state.detectionLevel + 5,
        sessionStability: state.sessionStability - 3,
      };

      if (!state.tutorialComplete) {
        delete stateChanges.detectionLevel;
        delete stateChanges.sessionStability;
      }

      return {
        output,
        stateChanges,
        triggerFlicker: true,
        delayMs: 1200,
      };
    }

    output.push(
      createEntryI18n(
        'warning',
        'engine.commands.chat.neural_bridge_active',
        '[NEURAL BRIDGE ACTIVE]'
      )
    );
    output.push(createEntry('system', ''));

    for (const line of response) {
      output.push(createEntry('output', line));
    }

    output.push(createEntry('system', ''));

    if (remaining > 0) {
      output.push(createEntryI18n('system', 'engine.commands.chat.patternStability', `[Pattern stability: ${remaining} queries remaining]`, { count: remaining }));
    } else {
      output.push(
        createEntryI18n(
          'warning',
          'engine.commands.chat.pattern_destabilizing',
          '[PATTERN DESTABILIZING]'
        )
      );
    }

    output.push(createEntry('system', ''));

    const stateChanges: Partial<GameState> = {
      scoutLinksUsed: newLinksUsed,
      scoutLinkUsedResponses: newUsedResponses,
      detectionLevel: state.detectionLevel + 5,
      sessionStability: state.sessionStability - 5,
    };

    if (!state.tutorialComplete) {
      delete stateChanges.detectionLevel;
      delete stateChanges.sessionStability;
    }

    return {
      output,
      stateChanges,
      triggerFlicker: true,
      delayMs: 1500,
    };
  },

  message: (args, state) => {
    // Check if morse file has been read
    if (!state.morseFileRead) {
      return {
        output: [
          createEntryI18n(
            'error',
            'engine.commands.chat.error_no_pending_message_to_decipher',
            'ERROR: No pending message to decipher'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'output',
            'engine.commands.chat.read_an_intercepted_signal_file_first',
            'Read an intercepted signal file first.'
          ),
          createEntryI18n(
            'output',
            'engine.commands.chat.check_comms_intercepts_for_signal_files',
            'Check /comms/intercepts/ for signal files.'
          ),
        ],
        stateChanges: {},
      };
    }

    // Check if already solved
    if (state.morseMessageSolved) {
      return {
        output: [
          createEntry('system', ''),
          createEntryI18n(
            'output',
            'engine.commands.chat.message_already_deciphered_colheita',
            'Message already deciphered: COLHEITA'
          ),
          ...createUFO74Message([
            'UFO74: you already cracked it, hackerkid.',
            '       the message was "COLHEITA".',
            '       now use it — override protocol.',
          ]),
        ],
        stateChanges: {},
      };
    }

    // Check if attempts exhausted (puzzle failed permanently)
    if ((state.morseMessageAttempts || 0) >= 3) {
      return {
        output: [
          createEntry('system', ''),
          createEntryI18n(
            'error',
            'engine.commands.chat.decryption_attempts_exhausted',
            'Decryption attempts exhausted.'
          ),
          createEntry('system', ''),
          createEntryI18n(
            'output',
            'engine.commands.chat.the_intercepted_message_was_colheita',
            'The intercepted message was: COLHEITA'
          ),
          ...createUFO74Message([
            'UFO74: you missed it, kid. but now you know.',
            '       "COLHEITA" — try it with the override protocol.',
          ]),
        ],
        stateChanges: {},
      };
    }

    if (args.length === 0) {
      const attemptsRemaining = 3 - (state.morseMessageAttempts || 0);
      return {
        output: [
          createEntry('system', ''),
          createEntryI18n(
            'output',
            'engine.commands.chat.enter_your_deciphered_message',
            'Enter your deciphered message.'
          ),
          createEntryI18n(
            'output',
            'engine.commands.chat.usage_message_deciphered_text',
            'Usage: message <deciphered text>'
          ),
          createEntry('system', ''),
          createEntryI18n('system', 'engine.commands.chat.attemptsRemaining', `[Attempts remaining: ${attemptsRemaining}]`, { count: attemptsRemaining }),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }

    const guess = args.join(' ').toUpperCase().trim();
    const correct = 'COLHEITA';
    const attemptsUsed = (state.morseMessageAttempts || 0) + 1;
    const attemptsRemaining = 3 - attemptsUsed;

    // Check for correct answer - be lenient with variations
    const normalizedGuess = guess.replace(/[\s\-_]+/g, '');
    const isCorrect = normalizedGuess === correct;

    if (isCorrect) {
      // Success! Reveal the message and hint at override protocol
      return {
        output: [
          createEntry('system', ''),
          createEntryI18n(
            'system',
            'engine.commands.chat.message_deciphered',
            '▓▓▓ MESSAGE DECIPHERED ▓▓▓'
          ),
          createEntry('system', ''),
          createEntryI18n('warning', 'engine.commands.chat.decoded', `  DECODED: ${correct}`, { value: correct }),
          ...createUFO74Message([
            'UFO74: you did it hackerkid!',
            '       "COLHEITA" — Portuguese for "HARVEST".',
            '',
            'UFO74: this is an authentication passphrase.',
            '       someone embedded it in the signal.',
            '',
            'UFO74: try it with the override protocol.',
            '       type: override protocol COLHEITA',
          ]),
        ],
        stateChanges: {
          morseMessageSolved: true,
          flags: { ...state.flags, morseDeciphered: true },
        },
        soundTrigger: 'evidence',
        streamingMode: 'normal',
      };
    }

    // Wrong answer
    if (attemptsRemaining <= 0) {
      // Out of attempts - suppress wrongAttempts during atmosphere phase
      const stateChanges: Partial<GameState> = {
        morseMessageAttempts: attemptsUsed,
      };
      if (!shouldSuppressPenalties(state)) {
        stateChanges.wrongAttempts = (state.wrongAttempts || 0) + 1;
      }
      return {
        output: [
          createEntry('error', ''),
          createEntryI18n('error', 'engine.commands.chat.decryption_failed', 'DECRYPTION FAILED'),
          createEntry('error', ''),
          createEntryI18n('warning', 'engine.commands.chat.yourAnswer', `Your answer: ${guess}`, { value: guess }),
          createEntryI18n(
            'warning',
            'engine.commands.chat.maximum_attempts_exceeded',
            'Maximum attempts exceeded.'
          ),
          ...createUFO74Message([
            'UFO74: damn. you ran out of tries hackerkid.',
            '       the message was "COLHEITA" — means "HARVEST".',
            '       try it with override protocol.',
          ]),
        ],
        stateChanges,
        soundTrigger: 'error',
      };
    }

    // Wrong but more attempts available
    return {
      output: [
        createEntry('warning', ''),
        createEntryI18n('warning', 'engine.commands.chat.incorrect', 'INCORRECT'),
        createEntryI18n('warning', 'engine.commands.chat.yourAnswer', `Your answer: ${guess}`, { value: guess }),
        createEntry('system', ''),
        createEntryI18n('system', 'engine.commands.chat.attemptsRemaining', `[Attempts remaining: ${attemptsRemaining}]`, { count: attemptsRemaining }),
        ...createUFO74Message([
          'UFO74: thats not it hackerkid.',
          '       check the morse reference again.',
          `       you have ${attemptsRemaining} more ${attemptsRemaining === 1 ? 'try' : 'tries'}.`,
        ]),
      ],
      stateChanges: {
        morseMessageAttempts: attemptsUsed,
      },
    };
  },

  morse: (args, state) => {
    // Handle cancel subcommand
    if (args.length > 0 && args[0].toLowerCase() === 'cancel') {
      if (!state.morseFileRead) {
        return {
          output: [
            createEntry('system', ''),
            createEntryI18n(
              'output',
              'engine.commands.chat.no_morse_code_puzzle_active',
              'No morse code puzzle active.'
            ),
          ],
          stateChanges: {},
        };
      }
      return {
        output: [
          createEntry('system', ''),
          createEntryI18n(
            'output',
            'engine.commands.chat.morse_code_entry_cancelled',
            'Morse code entry cancelled.'
          ),
          createEntryI18n(
            'output',
            'engine.commands.chat.you_can_try_again_later_with_morse_message',
            'You can try again later with "morse <message>".'
          ),
          createEntry('system', ''),
        ],
        stateChanges: {},
      };
    }

    // Otherwise, pass through to message command
    return commandsRef!.message(args, state);
  },
};
