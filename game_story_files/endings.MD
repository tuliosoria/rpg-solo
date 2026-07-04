# Varginha: Terminal 1996 — Endings Audit Reference

> **Purpose.** This document is a consistency-audit reference. It maps every ending to the exact combination of leaked (saved) files that triggers it, and includes the full copy of every game file so an auditor can verify that each ending's description matches the evidence the player actually leaked.

> **Ending count.** The engine defines **12** endings (`EndingId` in `app/engine/endings.ts`). The original request referenced "10 endings"; all 12 are documented below for completeness — the two extra are the boolean-driven legacy variants that survive in the dossier system (`secret_ending` "The Ferreira Protocol" and `hackerkid_caught`).

**Generated from source** by `scripts/gen-endings-doc.ts` (do not hand-edit — regenerate). Sources of truth:
- Ending copy & metadata: `app/engine/endings.ts` → `ENDINGS`
- Trigger logic: `app/engine/endings.ts` → `determineEnding()` + `FILE_CATEGORIES`
- File copy: `app/data/virtualFileSystem.ts` (`FILESYSTEM_ROOT`) + `app/data/archiveFiles.ts`

---

## How endings are triggered

When the player finalizes their leak, `determineEnding(savedFiles)` inspects the **basenames** of the saved file paths and counts how many fall into each category in `FILE_CATEGORIES`. Rules are evaluated in **priority order — the first matching rule wins.** A file may belong to more than one category (e.g. `bio_container.log` counts for both `medical_autopsy` and `containment`; `alpha_journal.log` counts for both `ufo_core` and `alpha_neural`).

| Priority | Ending | Trigger condition |
|:-------:|:-------|:------------------|
| 1 | `hackerkid_caught` | ≥ 2 files from **honeypot_trap** saved (obvious decoy files). |
| 2 | `secret_ending` | Has **ghost_machine** (`ghost_in_machine.enc`) AND ≥ 1 **alpha_neural** file AND a physicist file (`thirty_year_cycle*` or `projection_update_2026*`) AND a file whose name contains `convergence`. |
| 3 | `ufo74_exposed` | Has **ghost_machine** (`ghost_in_machine.enc`) — but not the full secret-ending set above. |
| 4 | `real_ending` | **ufo_core** ≥ 2 AND **medical_autopsy** ≥ 2 AND **witness** ≥ 1 AND **military_coverup** ≥ 2. |
| 5 | `wrong_story` | (**corruption_financial** + **conspiracy_unrelated**) ≥ 5 AND **ufo_core** ≤ 1. |
| 6 | `government_scandal` | **military_coverup** ≥ 4. |
| 7 | `prisoner_45_freed` | **containment** ≥ 2 AND **witness** ≥ 1. |
| 8 | `the_2026_warning` | **temporal_convergence** ≥ 2. |
| 9 | `harvest_understood` | **extraction_harvest** ≥ 2. |
| 10 | `nothing_changes` | **ufo_core** ≥ 2 AND **medical_autopsy** ≥ 1 AND **military_coverup** ≥ 1. |
| 11 | `incomplete_picture` | No single category among {military, medical, witness, core, temporal, harvest} exceeds 2 saved files (scattered dossier), OR the dossier carries hard biological/containment evidence (**medical_autopsy** ≥ 2 OR **containment** ≥ 2) that never cohered into a case. |
| 12 | `ridiculed` | Default fallback — weak or incoherent dossier that matches none of the above and carries no multi-file biological/containment evidence. |

---

## Endings — copy, metadata & trigger sets

### 1. HACKERKID CAUGHT  `(hackerkid_caught)`

*The honeypots worked exactly as designed.*

**Trigger:** ≥ 2 files from **honeypot_trap** saved (obvious decoy files).

**Minimal example save-set** (resolves to `hackerkid_caught`):
- `URGENT_classified_alpha.txt`
- `LEAKED_classified_records.dat`

**Narrative:**

> Files named URGENT_classified_alpha. SMOKING_GUN_proof. FOR_PRESIDENTS_EYES_ONLY. Real classified material never advertises itself. Every file you saved was planted. Every download was logged.
>
> Military cybersecurity traces the intrusion to your terminal within ninety minutes. The dossier is quarantined before it reaches a single journalist. Your access credentials are revoked, archived, and forwarded to federal prosecutors.
>
> The decoy system was built for people exactly like you. Eager. Careless. Loud.
>
> **[UFO74]:** *i tried to warn you. real secrets whisper.*

**AOL news-article presentation (metadata):**

| Field | Value |
|:------|:------|
| headline | COMPUTER HACKER ARRESTED AFTER DOWNLOADING MILITARY DECOY FILES |
| subheadline | Cybersecurity trap worked 'exactly as designed' — suspect traced in 90 minutes — federal charges pending |
| url | `http://www.aol.com/news/tech/hacker_military_decoy.htm` |
| imageSrc | `/images/endings/hackerkid_caught.jpg` |
| imageAlt | suspect_terminal_photo.jpg (CLASSIFIED) |
| visitorCount | 12 |

Article body:

> BRASÍLIA, Brazil (AP) — Brazilian military cybersecurity personnel have arrested an individual suspected of unauthorized intrusion into a classified computer network after the suspect downloaded files that had been deliberately planted as tracking devices, officials confirmed Saturday.
>
> The files, with titles such as 'URGENT_classified_alpha' and 'FOR_PRESIDENTS_EYES_ONLY,' were designed to appeal to inexperienced intruders and contained embedded tracking mechanisms that allowed military technicians to identify the suspect's terminal within ninety minutes of the initial download.
>
> A military spokesperson confirmed that the decoy system, which has been in place since 1994, was built specifically to identify and apprehend 'unsophisticated intrusion attempts.' The suspect's collected files were quarantined before reaching any external recipient. Federal prosecutors have been notified.
>

---

### 2. THE FERREIRA PROTOCOL  `(secret_ending)`

*Ghost. Signal. Bridge. Ambassador.*

**Trigger:** Has **ghost_machine** (`ghost_in_machine.enc`) AND ≥ 1 **alpha_neural** file AND a physicist file (`thirty_year_cycle*` or `projection_update_2026*`) AND a file whose name contains `convergence`.

**Minimal example save-set** (resolves to `secret_ending`):
- `ghost_in_machine.enc`
- `alpha_neural_connection.psi`
- `thirty_year_cycle.txt`
- `convergence_model_draft.txt`

**Narrative:**

> Carlos Eduardo Ferreira. UFO74. The ghost in the machine. His archive decrypted. His identity confirmed. But the dossier contains more than a confession — it contains the convergence model, the neural connection data, and the thirty-year projection.
>
> The combination is deliberate. Ferreira designed it this way. The identity file authenticates the source. The neural data proves contact. The convergence model provides the timeline. Together they form a single argument no committee can dismiss.
>
> The Brazilian Air Force confirms the service record. Three allied governments request the neural data. The 2026 window enters official threat assessment documents. Ferreira's archive becomes the foundation of the first multinational contact protocol.
>
> He built this for thirty years. He built it for you.
>
> **[UFO74]:** *you assembled everything. i can rest now.*

**AOL news-article presentation (metadata):**

| Field | Value |
|:------|:------|
| headline | MULTINATIONAL GOVERNMENTS ESTABLISH FIRST 'CONTACT PROTOCOL' BASED ON LEAKED ARCHIVE |
| subheadline | Three allied nations request neural data — 2026 threat window enters official assessment — Ferreira archive authenticated |
| url | `http://www.aol.com/news/world/contact_protocol_established.htm` |
| imageSrc | `/images/endings/secret_ending.jpg` |
| imageAlt | ferreira_protocol_document.jpg (RESTRICTED) |
| visitorCount | 1 |

Article body:

> UNITED NATIONS, New York (AP) — Representatives of three allied governments have formally requested access to neural interface data contained in a leaked Brazilian military archive, marking what diplomats describe as the first official acknowledgment that the documents may describe genuine non-human contact.
>
> The archive, compiled over thirty years by Brazilian Air Force intelligence officer Carlos Eduardo Ferreira, contains identity verification documents, neural connection data, and a convergence model that projects a significant event window in September 2026. Intelligence analysts say the combination was deliberately designed to form 'a single argument no committee can dismiss.'
>
> The Brazilian Air Force has confirmed Ferreira's service record. The 2026 projection has entered official threat assessment documents in at least two NATO member states. Sources describe the emerging multinational response as 'the first contact protocol' — a framework for coordinated government action in response to verified non-human intelligence.
>

---

### 3. UFO74 EXPOSED  `(ufo74_exposed)`

*The ghost had a name all along.*

**Trigger:** Has **ghost_machine** (`ghost_in_machine.enc`) — but not the full secret-ending set above.

**Minimal example save-set** (resolves to `ufo74_exposed`):
- `ghost_in_machine.enc`

**Narrative:**

> The decrypted file spreads before anyone can suppress it. Carlos Eduardo Ferreira — intelligence officer, Brazilian Air Force, stationed at Guarulhos in 1996. Thirty years building the archive in secret.
>
> Military intelligence confirms the service record within hours. The denial is immediate, automatic, and too late — the file is already mirrored on four continents. Ferreira's face is on every screen in the country by the evening news. He never wanted fame. He wanted one person to finish reading before they decided he was lying.
>
> The Air Force opens an internal inquiry. Three generals request early retirement inside a week. The archive survives because it was everywhere before anyone thought to bury it. UFO74 is no longer a call sign, a rumor, or a signature at the bottom of a leaked file. It is a name with a service number, and the service number checks out.
>
> **[UFO74]:** *you found me. now finish what i started.*

**AOL news-article presentation (metadata):**

| Field | Value |
|:------|:------|
| headline | MILITARY OFFICER IDENTIFIED AS SOURCE OF CLASSIFIED BRAZILIAN DATA LEAK |
| subheadline | Carlos E. Ferreira, Brazilian Air Force intelligence — service record confirmed — three generals request early retirement |
| url | `http://www.aol.com/news/world/brazil_leak_officer_id.htm` |
| imageSrc | `/images/endings/ufo74_exposed.jpg` |
| imageAlt | ferreira_service_photo_CLASSIFIED.jpg (unable to load) |
| visitorCount | 176,508 |

Article body:

> BRASÍLIA, Brazil (Reuters) — A decrypted computer file circulating on the Internet has identified a Brazilian Air Force intelligence officer as the source of a massive unauthorized disclosure of classified military documents, according to officials familiar with the matter.
>
> The officer, identified as Carlos Eduardo Ferreira, was reportedly stationed at Guarulhos Air Base during the period described in the leaked files. Military intelligence confirmed the service record within hours of the file's release, though a spokesperson declined to comment on the substance of the allegations.
>
> Three senior Air Force generals have submitted requests for early retirement in what analysts describe as an attempt to distance themselves from the growing scandal. The leaked archive, which Ferreira allegedly maintained for decades, contains documents related to military operations in southern Minas Gerais state.
>

---

### 4. UNDENIABLE  `(real_ending)`

*The dossier that could not be ignored.*

**Trigger:** **ufo_core** ≥ 2 AND **medical_autopsy** ≥ 2 AND **witness** ≥ 1 AND **military_coverup** ≥ 2.

**Minimal example save-set** (resolves to `real_ending`):
- `alpha_journal.log`
- `audio_transcript_brief.txt`
- `autopsy_alpha.log`
- `autopsy_addendum_psi.txt`
- `witness_statement_raw.txt`
- `incident_report_1996_01_VG.txt`
- `initial_response_orders.txt`

**Narrative:**

> Core evidence. Autopsy records. Witness testimony. Military logistics. Each category reinforces the others. The field journal establishes contact. The autopsy proves non-human biology. The witnesses confirm the timeline. The transport logs confirm the coverup.
>
> The dossier does not ask questions. It presents facts in a sequence that permits only one conclusion. International press picks it up within hours. The Brazilian government requests seventy-two hours before responding. They use all of them.
>
> The response, when it comes, is seven words: "The matter is under renewed investigation." Those seven words change everything. Denial is no longer the official position. Thirty years of silence end with a single sentence.
>
> **[UFO74]:** *they cannot unsay those seven words.*

**AOL news-article presentation (metadata):**

| Field | Value |
|:------|:------|
| headline | BRAZIL BREAKS SILENCE: 'THE MATTER IS UNDER RENEWED INVESTIGATION' |
| subheadline | Seven words end thirty years of official denial — international press demands full disclosure — dossier called 'undeniable' |
| url | `http://www.aol.com/news/world/brazil_renewed_investigation.htm` |
| imageSrc | `/images/endings/real_ending.jpg` |
| imageAlt | official_statement_brasilia.jpg (loading...) |
| visitorCount | 847,291 |

Article body:

> BRASÍLIA, Brazil (AP) — The Brazilian government has issued its first official acknowledgment of the 1996 Varginha incident, stating in a seven-word response that 'the matter is under renewed investigation.' The statement, released seventy-two hours after the most comprehensive dossier of evidence ever assembled reached international press outlets, effectively ends three decades of official denial.
>
> The dossier combines field journals establishing direct contact, autopsy records confirming non-human biology, independent witness testimony verifying the timeline, and military transport logs documenting the coverup. International press agencies describe the evidence as 'presenting facts in a sequence that permits only one conclusion.'
>
> Analysts note that the carefully worded response stops short of confirming extraterrestrial contact but represents a fundamental shift in the government's position. 'They cannot unsay those seven words,' noted one diplomatic observer. 'Denial is no longer the official position. Everything changes from here.'
>

---

### 5. THE WRONG STORY  `(wrong_story)`

*You investigated the cafeteria.*

**Trigger:** (**corruption_financial** + **conspiracy_unrelated**) ≥ 5 AND **ufo_core** ≤ 1.

**Minimal example save-set** (resolves to `wrong_story`):
- `budget_request_q1_96.txt`
- `budget_memo.txt`
- `journalist_payments.enc`
- `cafeteria_menu_week03.txt`
- `cafeteria_menu.txt`

**Narrative:**

> The dossier arrives on journalists' desks and produces genuine confusion. Budget memos. Parking allocations. A coffee harvest report. Media payment records that prove corruption but not contact.
>
> The financial angle gains traction. Three military officials face embezzlement charges. A journalist wins an award for exposing the media suppression network. The actual event — the beings, the autopsies, the containment — is never mentioned.
>
> You exposed a scandal. It was real, it was ugly, and it was the smallest secret in the archive. Two folders away from the budget memos sat an autopsy of a body with no human analog and a containment log counting eleven days. No journalist opened them — the corruption was easier to explain and easier to print. The bodies stayed in the ground, buried a second time under a story about parking allocations.
>
> **[UFO74]:** *you indicted the accountants. the bodies are still in the ground.*

**AOL news-article presentation (metadata):**

| Field | Value |
|:------|:------|
| headline | MILITARY BUDGET SCANDAL UNCOVERED IN LEAKED BRAZILIAN DOCUMENTS |
| subheadline | Three officials face embezzlement charges — journalist wins award for exposé — actual UFO claims ignored |
| url | `http://www.aol.com/news/world/brazil_budget_scandal.htm` |
| imageSrc | `/images/endings/wrong_story.jpg` |
| imageAlt | budget_memo_redacted.gif (file corrupted) |
| visitorCount | 178,234 |

Article body:

> BRASÍLIA, Brazil (Reuters) — Classified documents leaked from a Brazilian military installation have led not to the confirmation of extraterrestrial contact, as the anonymous source apparently intended, but to the exposure of a significant financial corruption network within the armed forces.
>
> The leaked files contain detailed budget memoranda, media payment records, and what prosecutors describe as 'a systematic program to suppress unfavorable news coverage through direct payments to journalists.' Three senior military officials now face embezzlement and fraud charges. A reporter for Folha de São Paulo has been awarded the Maria Moors Cabot Prize for her coverage of the scandal.
>
> The dossier also contained medical and bio-containment records, which prosecutors set aside as 'unrelated to the financial matter under investigation.' No outlet has reported their contents. Analysts describe the collection as 'accidentally important for entirely the wrong reasons' — a leak that indicted a bookkeeping fraud while an autopsy of a non-human body sat, unexamined, in the same folder.
>

---

### 6. BRAZILIAN GOVERNMENT SCANDAL  `(government_scandal)`

*The coverup was bigger than the event.*

**Trigger:** **military_coverup** ≥ 4.

**Minimal example save-set** (resolves to `government_scandal`):
- `incident_report_1996_01_VG.txt`
- `initial_response_orders.txt`
- `regional_summary_jan96.txt`
- `transport_log_96.txt`

**Narrative:**

> Transport logs. Response orders. Incident reports signed by officers who officially never existed. The leak does not prove alien contact — it proves the Brazilian military mobilized an entire region to hide something on January 20, 1996.
>
> Congressional inquiries open in Brasília. Three colonels are subpoenaed. One refuses to testify. The Jardim Andere site is cordoned off for "environmental assessment" that never produces a report.
>
> The question shifts. It is no longer about what landed. It is about who authorized the silence, who paid for it, and where the bodies went. A defense minister resigns rather than answer the third question. Denial of the operation is no longer tenable in Brasília; only its purpose remains classified — and every day that it stays classified, the purpose looks less like an accident and more like a body.
>
> **[UFO74]:** *they will sacrifice officers to protect the secret.*

**AOL news-article presentation (metadata):**

| Field | Value |
|:------|:------|
| headline | LEAKED DOCUMENTS REVEAL MASSIVE BRAZILIAN MILITARY OPERATION IN VARGINHA |
| subheadline | Transport logs and response orders prove classified mobilization — three colonels subpoenaed — Congressional inquiry opens in Brasília |
| url | `http://www.aol.com/news/world/brazil_military_coverup.htm` |
| imageSrc | `/images/endings/government_scandal.jpg` |
| imageAlt | transport_log_scan_96.jpg (connection timed out) |
| visitorCount | 351,902 |

Article body:

> BRASÍLIA, Brazil (AP) — Classified military documents leaked to the Internet this week reveal what appears to be a large-scale Brazilian Army operation in the southern city of Varginha in January 1996, involving troop movements, vehicle requisitions, and command orders that were never disclosed to the public or to civilian authorities.
>
> The documents include transport logs, incident reports signed by officers whose service records contain no reference to the operation, and response orders authorizing the cordoning of a residential area described only as 'the Jardim Andere site.' The purpose of the operation is not specified in any of the recovered files.
>
> Three colonels have been subpoenaed to testify before a Congressional committee in Brasília. One has reportedly refused. The Ministry of Defense issued a brief statement calling the documents 'unverified' but did not deny their authenticity.
>

---

### 7. PRISONER 45 FREED  `(prisoner_45_freed)`

*The containment logs were never supposed to leave.*

**Trigger:** **containment** ≥ 2 AND **witness** ≥ 1.

**Minimal example save-set** (resolves to `prisoner_45_freed`):
- `bio_container.log`
- `bio_containment_log_deleted.txt`
- `witness_statement_raw.txt`

**Narrative:**

> Bio-containment records. Neural dump data. Ethics exceptions signed by committee. The dossier does not show a captured animal — it shows a detained intelligence, held in a Faraday cage for eleven days while handlers reported headaches and cognitive intrusion.
>
> The witness statements give it weight. The sisters. The patrol officers. The veterinarian they silenced. Each testimony corroborates the containment timeline independently.
>
> A São Paulo judge orders the military to produce "all biological materials recovered January 1996." The military responds that no such materials exist. The containment logs say otherwise — in the military's own file numbers. Within a week the phrase "detained biological intelligence" is read aloud in the Chamber of Deputies. The question is no longer whether something was held. It is who signed the ethics exception, and what they believed they were authorizing.
>
> **[UFO74]:** *it was never a specimen. it was a prisoner.*

**AOL news-article presentation (metadata):**

| Field | Value |
|:------|:------|
| headline | CLASSIFIED LOGS DESCRIBE 'NON-HUMAN ENTITY' DETAINED IN MILITARY FACILITY |
| subheadline | Bio-containment records leaked — handlers reported 'cognitive intrusion' — São Paulo judge demands military disclosure |
| url | `http://www.aol.com/news/world/brazil_containment_logs.htm` |
| imageSrc | `/images/endings/prisoner_45_freed.jpg` |
| imageAlt | bio_container_photo_EXPUNGED.jpg (file not found) |
| visitorCount | 418,766 |

Article body:

> SÃO PAULO, Brazil (UPI) — Leaked bio-containment records from a Brazilian military facility describe what personnel referred to as a 'detained biological intelligence' held for eleven days in a Faraday-shielded chamber, according to documents released on the World Wide Web late Thursday.
>
> The logs, which include ethics exception forms signed by a medical committee, describe handlers experiencing 'persistent headaches and reported cognitive intrusion events' during the detention period. The entity, designated as 'Specimen Alpha' in some documents and 'Prisoner 45' in others, is described as exhibiting 'responsive behavior inconsistent with any known terrestrial species.'
>
> A judge in São Paulo has ordered the military to produce 'all biological materials recovered in January 1996.' The military responded within forty-eight hours that no such materials exist — a denial that analysts note is contradicted directly by the file numbers cited in the leaked containment logs. A parliamentary commission has since requested the roster of the medical ethics committee that signed the detention exception forms.
>

---

### 8. THE 2026 WARNING  `(the_2026_warning)`

*Thirty rotations. The clock does not stop.*

**Trigger:** **temporal_convergence** ≥ 2.

**Minimal example save-set** (resolves to `the_2026_warning`):
- `convergence_model_draft.txt`
- `thirty_year_cycle.txt`

**Narrative:**

> The convergence data reaches academic servers on a Tuesday. By Thursday, physicists in three countries have confirmed the cycle independently and stopped calling it atmospheric. 1947. 1977. 1996. The intervals do not drift. The projection is specific and it is not weather: September 2026, plus or minus two months. An arrival window.
>
> The word "arrival" is what breaks containment. Once one preprint uses it, the rest follow within days. Private aerospace firms begin relocating satellite arrays without explanation. The Brazilian Air Force reclassifies seven archived directives in a single afternoon. Two national space agencies convene emergency sessions and decline to say why.
>
> No government issues a denial, because a denial would require naming the thing being denied. A NATO threat-assessment cell adds a line item for the 2026 window. The public is told the models describe "a recurring geophysical phenomenon." The scientists who built the models have stopped giving interviews. They are not calm. They are counting.
>
> **[UFO74]:** *the window is real. now they have to watch it open.*

**AOL news-article presentation (metadata):**

| Field | Value |
|:------|:------|
| headline | PHYSICISTS CONFIRM 30-YEAR CONTACT CYCLE; NEXT WINDOW PROJECTED FOR SEPTEMBER 2026 |
| subheadline | Three national research bodies validate the model independently — aerospace firms relocate orbital arrays — Brazilian Air Force reclassifies seven directives without comment |
| url | `http://www.aol.com/news/science/30year_cycle_atmospheric.htm` |
| imageSrc | `/images/endings/the_2026_warning.jpg` |
| imageAlt | convergence_projection_2026.gif (image withheld pending review) |
| visitorCount | 638,914 |

Article body:

> GENEVA, Switzerland (AP) — Physicists at three independent research institutions have confirmed a thirty-year cyclical pattern underlying a series of contact events long filed as unexplained, according to a joint report released Wednesday. The model, drawn from documents leaked from a Brazilian military archive, projects the next occurrence for September 2026 and describes it, in the words of one contributing researcher, as 'a recurrence window, not a weather event.'
>
> The analysis aligns three dates the leaked files treat as instances of the same phenomenon — 1947, 1977, and 1996 — and confirms the underlying mathematics as 'internally consistent and statistically significant.' Two of the three institutions declined to characterize the nature of the recurrence on the record. The third did not decline. 'We have stopped describing atmospheric anomalies,' its lead author said. 'We are describing a schedule.'
>
> Within seventy-two hours of the report, several private aerospace companies began what industry sources called 'precautionary repositioning' of orbital monitoring arrays. The Brazilian Air Force reclassified seven archived directives in a single afternoon and declined comment. A NATO threat-assessment cell has, according to two officials, added the 2026 window to its standing agenda. No government has issued a denial — a fact one analyst called 'the loudest response available to them.'
>

---

### 9. THE HARVEST UNDERSTOOD  `(harvest_understood)`

*Colonization does not require arrival.*

**Trigger:** **extraction_harvest** ≥ 2.

**Minimal example save-set** (resolves to `harvest_understood`):
- `extraction_mechanism.red`
- `colonization_model.red`

**Narrative:**

> The extraction documents land in the wrong hands — or exactly the right ones. The colonization model. The harvest timeline. The mechanism that needs no ships, no landing, no contact at all. It describes Earth not as a target but as a crop: already planted, already seeded, thirty years into a cycle nobody agreed to.
>
> Three universities publish independent analyses within a month. The consensus is clinical and total: the model is internally consistent, the energy mathematics are sound, and the thirty-year seeding cycle aligns — file by file — with the neurological data in the military's own classified medical archive. The word the reviewers keep circling, then deleting from their drafts, is "livestock."
>
> A UN scientific advisory panel is convened and, within two days, closed to the press. Two governments quietly stand up research programs under agricultural headings with budgets that make no sense for agriculture. Nobody says "colonization" on television. They say "resource assessment." Everyone who has read the model understands which side of the assessment we are on.
>
> **[UFO74]:** *they do not need to arrive. we were already the harvest.*

**AOL news-article presentation (metadata):**

| Field | Value |
|:------|:------|
| headline | LEAKED MODEL DESCRIBES EARTH AS TARGET OF 'COLONIZATION WITHOUT ARRIVAL' |
| subheadline | Three universities confirm the mathematics — thirty-year seeding cycle matches classified medical data — UN advisory panel convened, then closed to press |
| url | `http://www.aol.com/news/science/colonization_theory_leaked.htm` |
| imageSrc | `/images/endings/harvest_understood.jpg` |
| imageAlt | extraction_diagram_classified.gif (access denied) |
| visitorCount | 511,240 |

Article body:

> CAMBRIDGE, Mass. (AP) — Documents leaked from a classified Brazilian military archive describe a working model for what the files term 'non-arrival colonization' — a process by which an unknown intelligence could extract resources from a planetary system without physical presence, landing, or direct contact. An analysis published Thursday by researchers at MIT concludes the model is 'not speculative.'
>
> Three universities have now independently reviewed the extraction model and confirmed its energy mathematics as, in one physicist's words, 'disturbingly sound.' The model describes a thirty-year seeding cycle that reviewers say aligns, entry by entry, with neurological data drawn from the Brazilian military's own classified medical files. Several researchers declined to be quoted characterizing what the aligned data implies.
>
> A scientific advisory panel convened at the United Nations was closed to the press within two days of its first session. At least two governments have quietly established research programs under agricultural and environmental headings, with budgets analysts describe as 'inexplicable for their stated purpose.' No official has used the word 'colonization.' Those who have read the model say the euphemism does not change the arithmetic.
>

---

### 10. NOTHING CHANGES  `(nothing_changes)`

*The truth arrived. Nobody moved.*

**Trigger:** **ufo_core** ≥ 2 AND **medical_autopsy** ≥ 1 AND **military_coverup** ≥ 1.

**Minimal example save-set** (resolves to `nothing_changes`):
- `alpha_journal.log`
- `audio_transcript_brief.txt`
- `autopsy_alpha.log`
- `incident_report_1996_01_VG.txt`

**Narrative:**

> The dossier is strong. Autopsy reports confirming non-human biology. Field observations. Military intercepts ordering the cordon. It is enough to establish, beyond reasonable dispute, that something not of this world was recovered in Varginha in January 1996. It is enough to demand answers from three governments at once.
>
> Panels convene. Experts testify under oath that the biology is authentic and has no terrestrial precedent. The footage runs on every network for two weeks. Then an election cycle begins, a currency collapses, a pop star dies in a car, and the feed moves on — completely, and without malice, the way a tide goes out.
>
> The files remain available. Downloaded fourteen million times. Cited in zero hearings, zero policy changes, zero resignations. Humanity was handed proof that it is not alone and filed it, unread, under yesterday. The truth turned out to be free — and free things are the easiest to set down.
>
> **[UFO74]:** *you proved we are not alone. the feed scrolled past it.*

**AOL news-article presentation (metadata):**

| Field | Value |
|:------|:------|
| headline | VARGINHA FILES DOWNLOADED 14 MILLION TIMES; GOVERNMENTS WORLDWIDE SILENT |
| subheadline | Experts confirm non-human biology under oath — zero hearings, zero policy changes — election coverage resumes |
| url | `http://www.aol.com/news/world/varginha_files_14million.htm` |
| imageSrc | `/images/endings/nothing_changes.jpg` |
| imageAlt | download_counter_screenshot.gif (server busy) |
| visitorCount | 14,023,847 |

Article body:

> NEW YORK (AP) — The collection of classified military documents known as the 'Varginha Files' — which includes autopsy records that four independent panels have called consistent with non-human biology — has been downloaded more than fourteen million times since its release on the Internet two weeks ago, making it one of the most widely distributed leaks in the brief history of the World Wide Web. No government has issued a formal response.
>
> Panels of experts convened at universities in four countries have testified that the medical evidence is 'authentic and without terrestrial precedent.' Footage from the original incident ran on cable news networks for approximately twelve days before being displaced by coverage of ongoing elections and a regional currency crisis.
>
> The files remain freely available on dozens of mirror sites. Analysts note the unprecedented volume of downloads has produced no measurable political or policy impact whatsoever. 'The evidence is no longer in question,' one commentator observed. 'What is in question is whether a species that can prove it is not alone is capable of caring for longer than a news cycle. So far the answer appears to be no.'
>

---

### 11. INCOMPLETE PICTURE  `(incomplete_picture)`

*Fragments do not make a case.*

**Trigger:** No single category among {military, medical, witness, core, temporal, harvest} exceeds 2 saved files (scattered dossier), OR the dossier carries hard biological/containment evidence (**medical_autopsy** ≥ 2 OR **containment** ≥ 2) that never cohered into a case.

**Minimal example save-set** (resolves to `incomplete_picture`):
- `alpha_journal.log`
- `witness_statement_raw.txt`

**Narrative:**

> The dossier contains evidence, but it tells no story. An autopsy report describing an organism with no human anatomical analog. A containment log counting eleven days. A transport order for a cargo that is never named. Several of these files, on their own, should end the argument. Together, they refuse to line up into one.
>
> Debunkers dismantle the leak over a weekend — not by disproving any single document, but by pointing out that nothing connects them. Each horror sits in isolation, uncorroborated by the others. The most damning page in the set is a medical finding no one can fix to a date or a place, so no one is required to believe it.
>
> You had the pieces. Some of them were terrible. You did not assemble the picture — and a terrible page that nobody can situate is, in the end, filed as no page at all.
>
> **[UFO74]:** *the worst pages were real. no one could tell where they fit.*

**AOL news-article presentation (metadata):**

| Field | Value |
|:------|:------|
| headline | LEAKED MILITARY FILES INCLUDE DISTURBING RECORDS BUT 'NO COHERENT CASE,' ANALYSTS SAY |
| subheadline | Individual documents called 'genuinely alarming' — investigators find no connecting thread — military declines to respond to 'fragments' |
| url | `http://www.aol.com/news/world/brazil_ufo_debunked.htm` |
| imageSrc | `/images/endings/incomplete_picture.jpg` |
| imageAlt | autopsy_fragment_unplaced.jpg (partial file — page 2 returns 404) |
| visitorCount | 54,120 |

Article body:

> WASHINGTON (AP) — A collection of documents leaked from a Brazilian military archive contains individual records that analysts describe as 'genuinely alarming' — including a medical report describing an organism with 'no human anatomical analog' — but fails, in their assessment, to assemble into a case that could withstand official scrutiny.
>
> The leak includes autopsy findings, a bio-containment log, and transport orders, several of which reviewers concede are difficult to explain away. 'Any one of these, properly sourced and corroborated, would be a serious matter,' said Dr. James Whitfield of Georgetown University. 'The problem is that nothing in the dossier corroborates anything else. The alarming pages arrive without context, and context is what turns a document into evidence.'
>
> The Brazilian Air Force has declined to respond to what a spokesperson called 'unconnected fragments.' Analysts note the approach is effective precisely because it is candid: the files reached the public without the narrative that would make them legible, and a horror that cannot be placed on a timeline is, functionally, a horror no one has to answer for.
>

---

### 12. RIDICULED  `(ridiculed)`

*The leak that proved nothing.*

**Trigger:** Default fallback — weak or incoherent dossier that matches none of the above and carries no multi-file biological/containment evidence.

**Minimal example save-set** (resolves to `ridiculed`):
- `incident_report_1996_01_VG.txt`
- `initial_response_orders.txt`
- `regional_summary_jan96.txt`

**Narrative:**

> The dossier surfaces on three forums and a defunct Geocities mirror. A television host holds up a printout and laughs for six minutes straight. The military issues no denial because none is required.
>
> Within forty-eight hours the files are catalogued alongside crop circles, chemtrails, and faith healers. Your name never enters the public record. The word "hoax" is generous — most call it fan fiction.
>
> The archive rots on a server in São Paulo. Nobody downloads it. The password expires. Varginha remains a punchline.
>
> **[UFO74]:** *you gave them noise. they needed signal.*

**AOL news-article presentation (metadata):**

| Field | Value |
|:------|:------|
| headline | INTERNET HOAX ALERT: 'CLASSIFIED UFO FILES' FROM BRAZIL DISMISSED AS PRANK |
| subheadline | USAF spokesperson calls documents 'creative fiction' — Brazilian Air Force declines comment — Internet forums debate authenticity |
| url | `http://www.aol.com/news/world/brazil_ufo_hoax_0196.htm` |
| imageSrc | `/images/endings/ridiculed.jpg` |
| imageAlt | photo_unverified_document.jpg (43 KB) |
| visitorCount | 1,247 |

Article body:

> VARGINHA, Brazil (AP) — A collection of documents purporting to be classified military files about an alleged 'unidentified flying object' incident in southern Brazil surfaced on several Internet bulletin boards late Tuesday, drawing immediate skepticism from experts and officials alike.
>
> The files, which appear to describe military operations in the city of Varginha in January of this year, were reportedly obtained through an unauthorized computer intrusion. Air Force officials in Brasília declined to comment, noting only that the documents 'do not correspond to any known military operation.'
>
> Dr. Harold Simmons of the Center for Scientific Inquiry called the documents 'an elaborate but ultimately unconvincing fabrication,' pointing to what he described as 'inconsistencies in formatting and terminology that suggest a civilian author with limited military knowledge.'
>

---

## File-category reference

The basenames that count toward each trigger category. (Not every file listed here necessarily exists in the shipped filesystem — the category tables are the raw matcher lists from `FILE_CATEGORIES`. A ⚠️ marks category entries with no matching file in the current build.)

### `military_coverup`
- `incident_report_1996_01_VG.txt`
- `initial_response_orders.txt`
- `regional_summary_jan96.txt`
- `transport_log_96.txt`
- `jardim_andere_incident.txt`
- `incident_summary_official.txt`
- `logistics_manifest_fragment.txt`
- `cargo_transfer_memo.txt`
- `duty_roster_jan96.txt`
- `asset_disposition_report.txt`

### `medical_autopsy`
- `autopsy_alpha.log`
- `autopsy_addendum_psi.txt`
- `alpha_autopsy_addendum.txt`
- `bio_container.log`
- `specimen_purpose_analysis.txt`
- `material_x_analysis.dat`
- `medical_examiner_query.txt`
- `medical_effects_brief_77.txt`
- `contact_incident_report.txt`
- `autopsy_notes_unredacted.txt`

### `witness`
- `witness_statement_raw.txt`
- `witness_statement_original.txt`
- `witness_visit_log.txt`
- `witness_subjects_file.txt`
- `debriefing_protocol.txt`
- `recantation_001.txt`
- `patrol_observation_shift_04.txt`
- `mudinho_dossier.txt`

### `containment`
- `bio_container.log`
- `bio_containment_log_deleted.txt`
- `bio_program_overview.red`
- `ethics_exception_03.txt`
- `neural_dump_alfa.psi`
- `neural_cluster_experiment.red`
- `neural_cluster_memo.txt`

### `ufo_core`
- `alpha_journal.log`
- `audio_transcript_brief.txt`
- `photo_archive_register_77.txt`
- `surveillance_recovery.vid`
- `field_report_delta.txt`
- `scout_variants.meta`
- `energy_node_assessment.txt`
- `deleted_comms_log.txt`

### `temporal_convergence`
- `convergence_model_draft.txt`
- `thirty_year_cycle.txt`
- `projection_update_2026.txt`
- `threat_window.red`
- `window_alignment.meta`
- `window_clarification.red`
- `second_deployment.sig`

### `extraction_harvest`
- `extraction_mechanism.red`
- `colonization_model.red`
- `non_arrival_colonization.txt`
- `energy_extraction_theory.txt`
- `transfer_manifest_deleted.txt`
- `briefing_watchers_1996.txt`

### `conspiracy_unrelated`
- `cafeteria_menu_week03.txt`
- `cafeteria_menu.txt`
- `cafeteria_feedback.txt`
- `parking_allocation_jan96.txt`
- `parking_regulations.txt`
- `supplies_request_jan96.txt`
- `printer_notice.txt`
- `lost_found_jan96.txt`
- `lost_found_log.txt`
- `badge_renewal_memo.txt`
- `training_q1_96.txt`
- `hvac_maintenance_log.txt`
- `birthdays_jan96.txt`
- `vacation_calendar.txt`
- `copa_94_celebration.txt`
- `coffee_harvest_q1_96.txt`
- `weather_report_jan96.txt`
- `local_politics_memo.txt`
- `municipal_budget_96.txt`
- `fire_dept_log_jan96.txt`

### `corruption_financial`
- `budget_request_q1_96.txt`
- `budget_memo.txt`
- `journalist_payments.enc`
- `kill_story_memo.txt`
- `media_contacts.txt`
- `tv_coverage_report.txt`
- `foreign_press_alert.txt`
- `family_compensation.txt`
- `autopsy_suppression.txt`
- `veterinarian_silencing.txt`

### `honeypot_trap`
- `URGENT_classified_alpha.txt`
- `LEAKED_classified_records.dat`
- `FOR_PRESIDENTS_EYES_ONLY.enc`
- `SMOKING_GUN_proof.txt`

### `ghost_machine`
- `ghost_in_machine.enc`

### `alpha_neural`
- `alpha_neural_connection.psi`
- `alpha_journal.log`
- `alpha_autopsy_addendum.txt`

### `comms_intercept`
- `transcript_core.enc`
- `transcript_limit.enc`
- `psi_analysis_report.txt`
- `psi_analysis_classified.txt`
- `signal_analysis_partial.txt`
- `intercept_summary_dec95.txt`
- `morse_intercept.sig`
- `emergency_broadcast.enc`

### `diplomatic`
- `foreign_liaison_note.txt`
- `foreign_liaison_cable_deleted.txt`
- `diplomatic_cable_23jan.enc`
- `standing_orders_multinational.txt`
- `parallel_incidents_global.txt`

### `coverup`
- `aircraft_incident_report.txt`
- `foreign_drone_assessment.txt`
- `weather_balloon_memo.txt`
- `industrial_accident_theory.txt`
- `alternative_explanations.txt`
- `contamination_theory.txt`
- `animal_deaths_report.txt`
- `trace_purge_memo.txt`
- `redaction_override_memo.txt`

---

## Full file copy (all game files)

Total files: **169**. Each entry shows the in-game path, status, whether it logs evidence, any required flags, and the complete text.

### `.signature.bak`

- **Path:** `/tmp/.signature.bak`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
RECOVERED FILE — USER DIRECTORY BACKUP
OWNER: [REDACTED]

-- 
    _____
   /     \    "O BRASIL É O PAÍS DO FUTURO"
  | () () |
   \  ^  /    A realidade é só uma ilusão,
    |||||     mas uma bem persistente.
    |||||              — A. Einstein

  streber@bbs.unesp.br
  PGP Key: 0xDEADBEEF

  Best viewed in Netscape Navigator 2.0
  <BLINK>UNDER CONSTRUCTION</BLINK>

  This .sig brought to you by too much coffee,
  not enough sleep, and saudade.

  The future arrived. It was not what we expected.
```

### `active_trace.sys`

- **Path:** `/sys/active_trace.sys`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
ALERTA DE SEGURANÇA — RASTREAMENTO REGISTRADO
═══════════════════════════════════════════════════════════

A trace review has been logged against this terminal.
Session profile flagged. Timestamp archived.

No active countdown is running from this node.
But every command you execute increases your visibility.
Someone will review these logs.

───────────────────────────────────────────────────────────

RECOMENDAÇÕES:
  — Minimize command frequency
  — Review adjacent logs before pushing deeper
  — If detection becomes critical: disconnect
```

### `aircraft_incident_report.txt`

- **Path:** `/ops/assessments/aircraft_incident_report.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
INCIDENT REPORT — AIRCRAFT DIVISION
DATE: 21-JAN-1996
CLASSIFICATION: CONFIDENTIAL

TYPE: Unauthorized civilian overflight

A single-engine Cessna 172 entered restricted
airspace over Base Area 7, ~14:20h on 20-JAN.

Pilot: agricultural contractor.
Incorrect flight plan (VFR not IFR).
No photographic equipment aboard.

CONCLUSION:
  Navigational error. Warning issued.
  No security breach.

NOTE: Pilot later admitted seeing "structures"
below cloud cover he could not identify.
Statement retracted after legal advisement.
Recommend expanded restricted zone perimeter.
```

### `alpha_autopsy_addendum.txt`

- **Path:** `/storage/quarantine/alpha_autopsy_addendum.txt`
- **Status:** `corrupted`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
FIELD JOURNAL — MAJ. M.A. FERREIRA
SITE 7
═══════════════════════════════════════════════════════════

12 FEB 1996

Eleven days dead. EEG: 1,204 µV. Climbing.

The device activates on its own now.

───────────────────────────────────────────────────────────

13 FEB — Device powered on at 0300. I was in
quarters. Three floors up. Lab locked.

ALPHA asked: "quando você vem?"

14 FEB

Luísa called the base switchboard. She is seven.
She does not know this number.

  "papai, o moço do escuro quer falar com você."

[TRANSFER REQUEST: DENIED — ESSENTIAL PERSONNEL]

...hackerkid...
...you are reading this...
...the code is RELEASE ALPHA...
...he could not do it...
...perhaps you will...

═══════════════════════════════════════════════════════════
```

### `alpha_journal.log`

- **Path:** `/storage/quarantine/alpha_journal.log`
- **Status:** `encrypted`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
FIELD JOURNAL — MAJ. M.A. FERREIRA
CPEX — CENTRO DE PESQUISAS EXOBIOLÓGICAS
SITE 7, SUBLEVEL 4 — CLASSIFICATION: ULTRA
═══════════════════════════════════════════════════════════

21 JAN 1996

Subject arrived 0340 from Jardim Andere. Third specimen.
Designated ALPHA. The other two died.

1.6m. Dark brown skin, oily secretion. Red eyes. Ammonia.

  Respiration: None.
  Pulse: None.
  EEG theta amplitude: 847 µV.
  Human baseline: 12 µV.

ALPHA is clinically dead. The EEG is not.

───────────────────────────────────────────────────────────

25 JAN — Patterns show language-like structure.
Guards report feeling "watched."

2 FEB — EEG spiked during unauthorized file access.
The ammonia follows me to my quarters.

───────────────────────────────────────────────────────────
Classification: ULTRA — Eyes only
═══════════════════════════════════════════════════════════
```

### `alpha_neural_connection.psi`

- **Path:** `/storage/quarantine/alpha_neural_connection.psi`
- **Status:** `intact`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
FIELD JOURNAL — MAJ. M.A. FERREIRA
CPEX — SITE 7, SUBLEVEL 4
CLASSIFICATION: ULTRA
═══════════════════════════════════════════════════════════

5 FEB 1996

The device works. Concepts arrive already understood —
no words, no translation. As if they were always yours.

ALPHA is not dead. The body is an antenna.

───────────────────────────────────────────────────────────

8 FEB — ALPHA knows schedule changes decided three
floors above. Tonight it said a name. Luísa.
My daughter. Seven years old. I never mentioned her.

  CONTAINMENT ALERT:
  Emergency release code: RELEASE ALPHA

10 FEB — The MP sergeant who touched ALPHA died.

It projected "thirty rotations." A countdown.

───────────────────────────────────────────────────────────
Classification: ULTRA — Eyes only
═══════════════════════════════════════════════════════════
```

### `alternative_explanations.txt`

- **Path:** `/admin/coverup/alternative_explanations.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
COVER STORY OPTIONS — VARGINHA INCIDENT
COMPILED: 22-JAN-1996 — INTERNAL ONLY
═══════════════════════════════════════════════════════════

A. WEATHER BALLOON — For aerial sightings.
   Strength: Classic. Weakness: No ground explanation.

B. HOMELESS PERSON (MUDINHO) — Primary, creature reports.
   Strength: Explains humanoid shape.
   Weakness: Contradicted by witness details.

C. ESCAPED ANIMAL — Backup.
   Weakness: No zoo escape reported.

D. MILITARY EXERCISE — For vehicle sightings.
   Weakness: No exercise was scheduled.

E. MASS HYSTERIA — Long-term discrediting.
   Weakness: Requires time to establish.

F. PRANKSTERS — Reserve fallback.
   Weakness: Requires identified pranksters.

───────────────────────────────────────────────────────────
RECOMMENDATION: Deploy multiple simultaneously.
Confusion serves containment.

═══════════════════════════════════════════════════════════
```

### `animal_deaths_report.txt`

- **Path:** `/ops/zoo/animal_deaths_report.txt`
- **Status:** `restricted`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
INCIDENT REPORT — ZOOLÓGICO MUNICIPAL DE VARGINHA
DATE: 28-JAN-1996 — RESTRICTED
═══════════════════════════════════════════════════════════

22-JAN — TAPIR. Age 8. Prior health: excellent.
  Found deceased. Internal hemorrhaging, organ failure.

24-JAN — OCELOT. Age 5. Prior health: good.
  Seizures, rapid decline. Neurological damage.

25-JAN — DEER. Age 3. Prior health: excellent.
  Extreme agitation, collapse. Cardiac arrest.

27-JAN — CAPYBARA. Age 6. Prior health: good.
  Refused food, tremors. Multi-organ failure.

───────────────────────────────────────────────────────────
Dr. Ana FERREIRA: "These deaths are unprecedented.
The proximity to the 20-JAN incident cannot be
coincidental."

NOTE: Animals housed adjacent to TEMPORARY HOLDING
area used 20-21 JAN for fauna specimen.

═══════════════════════════════════════════════════════════
```

### `apollo_media_guidelines.pdf`

- **Path:** `/internal/misc/apollo_media_guidelines.pdf`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
PUBLIC AFFAIRS GUIDANCE — LUNAR PROGRAM DOCUMENTATION
DOCUMENT: PA-1969-07 (DECLASSIFIED EXCERPT)
ORIGINAL DATE: 14-JUL-1969
═══════════════════════════════════════════════════════════

SUBJECT: Handling Visual Inconsistencies in Mission Footage

───────────────────────────────────────────────────────────

BACKGROUND:

  During post-production review of lunar surface footage,
  technical staff identified several lighting anomalies
  that may generate public confusion.

IDENTIFIED ISSUES:

  - Shadow direction variance in Frames 1247-1289
  - Multiple apparent light sources in EVA footage
  - Crosshair positioning behind foreground objects
  - Flag movement without atmospheric conditions

GUIDANCE:

  1. Do NOT proactively address these inconsistencies.

  2. If questioned, attribute anomalies to:
     a) Camera lens artifacts
     b) Reflected light from lunar surface
     c) Electromagnetic interference with equipment

  3. Under NO circumstances acknowledge that backup
     footage was prepared at [REDACTED] facility.

  4. Emphasize mission success narrative over technical
     details of visual documentation.

NOTE: This guidance supersedes previous directives.

APPROVED BY: DIR. COMMUNICATIONS

═══════════════════════════════════════════════════════════
```

### `archival_photo_replacement.notice`

- **Path:** `/internal/misc/archival_photo_replacement.notice`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
NATIONAL ARCHIVES — DOCUMENT MANAGEMENT DIRECTIVE
NOTICE: DMD-1995-47
DATE: 03-OCT-1995
═══════════════════════════════════════════════════════════

SUBJECT: Historical Image Archive Modernization

───────────────────────────────────────────────────────────

DIRECTIVE:

  As part of our digital preservation initiative, all
  historical photographic records are being converted
  to digital format using the MASTER CLEAN protocol.

PROCEDURE:

  1. Original photographs scanned at high resolution
  2. Digital restoration applied per Guidelines Appendix C
  3. "Cleaned master versions" replace originals in archive
  4. Original prints transferred to [REDACTED] facility

RESTORATION GUIDELINES (EXCERPT):

  - Remove inadvertent civilian faces (privacy)
  - Correct lighting inconsistencies
  - Standardize official personnel positioning
  - Eliminate background elements causing "confusion"

SPECIAL HANDLING:

  Images flagged in Categories 7-12 require review by
  Historical Accuracy Committee before digitization.

  These include:
    - Political figures in "inconsistent" contexts
    - Military operations with "unclear" narratives
    - Events with "disputed" official records

NOTE: This process is administrative only.
      No historical record is being altered.

═══════════════════════════════════════════════════════════
```

### `asset_disposition_report.txt`

- **Path:** `/internal/sanitized/asset_disposition_report.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
ASSET DISPOSITION REPORT
REF: ADR-96-007 | DATE: 28-JAN-1996

CATEGORY: Special Materials

  Item A-1: Transferred to foreign partner (complete)
  Item A-2: Retained for domestic study
  Item A-3: Degraded during transport

  Item B-1: Partial. Components separated.
    Primary section: Partner facility
    Secondary components: Undisclosed
    Navigation system: Partner custody

Instrumentation recovered but non-functional.
Purpose remains unclear.

Assets distributed per agreement.
The report uses fourteen euphemisms.
I counted. None of them change what happened.
```

### `asset_transfer_form_incomplete.txt`

- **Path:** `/internal/protocols/asset_transfer_form_incomplete.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
ASSET TRANSFER FORM — ATF-1996-0023
STATUS: INCOMPLETE — RETURNED

TRANSFER FROM: HOLDING-7
TRANSFER TO: [FIELD LEFT BLANK]
DATE: 24-JAN-1996

ITEMS:
  1x Container, sealed, 45kg — bio-rated
  1x Case, documents, classified

ERROR: Receiving party signature MISSING
ERROR: Authorization code INVALID
ERROR: Destination code NOT RECOGNIZED

Form returned to originator. Transfer pending.

CLERK: T. SANTOS
NOTE: Santos reported unusual temperature
emanating from sealed container.
Report filed, then withdrawn same day.
```

### `audio_transcript_brief.txt`

- **Path:** `/internal/audio_transcript_brief.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
INTERNAL SECURITY — RESERVED LINE TRANSCRIPT
DATE: 21-JAN-1996 — 02:12
CLASSIFICATION: INTERNAL USE — DO NOT FILE
═══════════════════════════════════════════════════════════

VOICE A: Male. ~40s. Unsolicited.
VOICE B: Male. ~50s. Receiving officer.

[PARTIAL TRANSCRIPT]

A: "...too many people saw it. you cannot silence them."
B: "we manage what they say."
A: "...whatever they tell you about the bodies —"
B: "stop. the civilian bodies."
A: "the other ones."
B: "there were no other ones. say it."
A: "..."
B: "SAY IT."
A: "...human bodies."
B: "do not call this number again."

[LINE DISCONNECTS]

ANALYST NOTE: Untraceable. Instinct: do not disregard.
═══════════════════════════════════════════════════════════
```

### `autopsy_addendum_psi.txt`

- **Path:** `/storage/quarantine/autopsy_addendum_psi.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
ADDENDUM PSI — NEURAL ASSESSMENT
CONSULTING: [CLASSIFIED]
DATE: 25-JAN-1996

CRANIAL STRUCTURE ANALYSIS:
  - Massive parallel processing capability
  - Structures analogous to signal receivers
  - No decision-making cortex equivalent

Subject ALFA was not autonomous.
It received instructions from external source.
It functioned as observer/relay only.

If subjects are receivers, there must be
transmitters. Transmitters were not recovered.

Assume observational mission was successful.
Assume data was transmitted before expiration.
Whatever sent them now knows we are here.
```

### `autopsy_alpha.log`

- **Path:** `/storage/quarantine/autopsy_alpha.log`
- **Status:** `restricted`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
AUTOPSY PROTOCOL — SUBJECT ALFA
PATHOLOGIST: [CLASSIFIED — state university]
FACILITY: Hospital Regional do Sul de Minas
DATE: 21-JAN-1996

EXTERNAL:
  Height: 1.6m (contracted at recovery)
  Skin: Dark brown, oily, strong ammonia odor
  Cranium: Three bony ridges, anterior-posterior
  Eyes: Large, deep red, no sclera
  Limbs: Four digits per extremity

INTERNAL:
  Cardiovascular: Single-chamber organ
  Digestive: Vestigial. Non-functional.
  Reproductive: Absent.
  Neural: Overdeveloped cranial mass.

Cranial structures suggest high-bandwidth
signal processing. No vocal apparatus.
Communication via non-acoustic means.

Tissues transferred per Protocol 7-ECHO.

"This organism was designed, not evolved."
```

### `autopsy_notes_unredacted.txt`

- **Path:** `(archive) autopsy_notes_unredacted`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** archiveFiles

```text
═══════════════════════════════════════════════════════════
AUTOPSY NOTES — UNREDACTED
SUBJECT: BIO-C (DECEASED) | JANUARY 24, 1996
STATUS: MARKED FOR DESTRUCTION
═══════════════════════════════════════════════════════════

Subject expired 04:17. No trauma, no illness.
Appeared to simply... stop functioning.

Height: 127cm. Weight: 18.3kg.
Skin: gray-brown, slight bioluminescence.
Cranium enlarged, brain mass 3x human average.
Eyes: large, almond-shaped. Low-light specialization.

───────────────────────────────────────────────────────────
INTERNAL — [DELETED FROM OFFICIAL REPORT]
───────────────────────────────────────────────────────────

Cardiovascular: Single heart, three chambers.
Digestive: Minimal. Designed for absorption.
Reproductive: None. Purpose-built.

CRITICAL FINDING:
Neural tissue contains metallic inclusions.
This being was MANUFACTURED.

PERSONAL NOTE:
These are not visitors. These are messengers.
And we are not prepared for what they herald.

═══════════════════════════════════════════════════════════
```

### `autopsy_suppression.txt`

- **Path:** `/ops/medical/contact_fatality/autopsy_suppression.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
DIRECTIVE — AUTOPSY SUPPRESSION
DATE: 16-FEB-1996 — TOP SECRET
═══════════════════════════════════════════════════════════

RE: Remains of deceased corporal.

1. Standard autopsy CANCELLED.
2. Modified exam by Project HARVEST personnel only.
3. All tissue samples classified. Transfer to
   [REDACTED] facility immediately.
4. Official report will state: "Respiratory failure
   secondary to pneumonia complications."
5. No copies retained at hospital or municipal morgue.

───────────────────────────────────────────────────────────
Anomalous pathogen must be studied under controlled
conditions only. Medical personnel who observed
actual condition debriefed under Protocol SOMBRA.

═══════════════════════════════════════════════════════════
```

### `avian_tracking_program.csv`

- **Path:** `/internal/misc/avian_tracking_program.csv`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
CONTINENTAL AVIAN SURVEILLANCE NETWORK
QUARTERLY DEPLOYMENT REPORT — Q4 1995
═══════════════════════════════════════════════════════════

UNIT_ID,SPECIES_COVER,REGION,BATTERY_LIFE,PAYLOAD
AV-3847,Columba livia,NORTHEAST,94%,AUDIO/VIDEO
AV-3848,Columba livia,NORTHEAST,91%,AUDIO/VIDEO
AV-4102,Sturnus vulgaris,MIDWEST,88%,AUDIO ONLY
AV-4103,Sturnus vulgaris,MIDWEST,92%,AUDIO ONLY
AV-4104,Sturnus vulgaris,MIDWEST,86%,AUDIO/VIDEO
AV-5001,Corvus brachyrhynchos,WEST,95%,FULL SUITE
AV-5002,Corvus brachyrhynchos,WEST,89%,FULL SUITE
AV-6110,Turdus migratorius,SOUTH,91%,AUDIO/VIDEO
AV-6111,Turdus migratorius,SOUTH,93%,AUDIO/VIDEO
AV-6112,Turdus migratorius,SOUTH,87%,THERMAL

───────────────────────────────────────────────────────────
DEPLOYMENT NOTES:

  - Q4 migration routes successfully tracked
  - Signal relay coverage: 94.2% continental
  - Urban density exceeds rural by factor of 8.4
  - Maintenance disguised as "wildlife research"

ANOMALY LOG:

  - Unit AV-3201 recovered by civilian (neutralized)
  - Unit AV-4089 battery failure mid-flight
  - Unit AV-5847 behavioral deviation (investigating)

NEXT DEPLOYMENT: 847 units scheduled Q1 1996
COVER STORY: Migratory pattern research funding

═══════════════════════════════════════════════════════════
```

### `badge_renewal_memo.txt`

- **Path:** `/internal/admin/badge_renewal_memo.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
MEMORANDUM — SECURITY DIVISION
RE: Annual Badge Renewal
DATE: 10-JAN-1996

All personnel must renew badges by 31-JAN-1996.

Required:
  - Current badge
  - Valid government ID
  - Updated photo (Security Office)
  - Supervisor approval form

Field personnel may request extensions.
Non-compliance: access suspension.

ADDENDUM 22-JAN:
New badge tier introduced: ULTRAVIOLET.
Issuance restricted to Sector Command.
Do not inquire. Do not discuss.

Security Division - ext. 2500
```

### `behavioral_compliance_study.dat`

- **Path:** `/internal/misc/behavioral_compliance_study.dat`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
CONSUMER BEHAVIOR RESEARCH — ACOUSTIC INFLUENCE STUDY
PROJECT: TEMPO
DATE: Q4 1995 FINAL REPORT
═══════════════════════════════════════════════════════════

STUDY OVERVIEW:

  In partnership with [REDACTED] retail chains, this study
  evaluated the effect of ambient audio parameters on
  consumer behavior patterns.

METHODOLOGY:

  - 847 retail locations participated
  - Music tempo varied from 60-120 BPM across test groups
  - Subliminal audio tones embedded at 17.5 Hz
  - Control group received standard muzak programming

FINDINGS:

  1. TEMPO CORRELATION
     - 72 BPM: 18% increase in browsing duration
     - 108 BPM: 23% increase in purchase velocity
     - 60 BPM: Measurable increase in high-margin purchases

  2. SUBLIMINAL TONE EFFECTS
     - 17.5 Hz baseline: Elevated stress markers
     - 12 Hz modification: Reduced price sensitivity
     - Combined with verbal suggestions: Inconclusive

  3. OPTIMAL CONFIGURATION
     - Morning: 108 BPM (urgency)
     - Afternoon: 72 BPM (extended browsing)
     - Pre-closing: 120 BPM (clear out)

RECOMMENDATION:

  Implement Phase II testing in food service environments.
  Preliminary data suggests eating pace modification
  achievable through targeted frequency patterns.

═══════════════════════════════════════════════════════════
```

### `bio_container.log`

- **Path:** `/storage/quarantine/bio_container.log`
- **Status:** `unstable`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
BIO-CONTAINMENT LOG — QUARANTINE
SITE: REGIONAL HOSPITAL [NOME SUPRIMIDO]
DATE: 20-JAN-1996

20-JAN 04:30 — Subject ALFA secured. Vitals unstable.
20-JAN 05:15 — Subject BETA secured. Vitals declining.
20-JAN 06:00 — Subject ALFA expired. Cause unknown.
20-JAN 08:00 — Transfer order received.
20-JAN 09:30 — BETA transferred to military custody.
20-JAN 10:00 — ALFA remains → autopsy protocol.

Subjects display non-human morphology.
No match in any catalogued species.

21-JAN 02:00 — Third subject reported. Site GAMMA.
21-JAN 04:00 — Secured. Designated GAMMA.
21-JAN 06:00 — GAMMA transferred. Destination unknown.

WARNING: All bio-material classified COSMIC.
The smell. The smell in that room.
```

### `bio_containment_log_deleted.txt`

- **Path:** `(archive) bio_containment_log_deleted`
- **Status:** `intact`  ·  **Evidence:** yes  ·  **Source:** archiveFiles

```text
BIOLOGICAL CONTAINMENT LOG — PURGED RECORD
SITE: HUMANITAS HOSPITAL | JAN 20-26, 1996
CLASSIFICATION: OMEGA — MARKED FOR DESTRUCTION

SUBJECT REGISTRY:
  BIO-A: Captured 20/01, Jardim Andere. Responsive.
    Transferred to Site 7 on 22/01.
  BIO-B: Captured 20/01. Agitated. Non-acoustic signal
    attempts. Handlers reported headaches within 3m.
  BIO-C: Captured 22/01. Weakened. Expired 24/01.
    Cause unknown. Remains to pathology.

CONTAINMENT: Faraday cage active.
Subjects refuse all organic matter. DO NOT ENGAGE.
Personnel exposed to BIO-B >10 min require neural scan.

DELETION ORDER: Log purged 01/30/1996.
Official records: "No biological material recovered."
```

### `bio_program_overview.red`

- **Path:** `/admin/bio_program_overview.red`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
PROGRAM OVERVIEW — BIO-ASSESSMENT INITIATIVE
CLASSIFICATION: RED

Following January 1996, a joint program was
established with international partners.

OBJECTIVES:
  - Analyze recovered biological material
  - Develop detection protocols
  - Prepare response frameworks

PARTICIPANTS:
  - Brazilian Intelligence (Lead, Local)
  - [REDACTED] (Technical Analysis)
  - [REDACTED] (Biological Assessment)

DIVISION:
  - Brazil: Subject ALFA remains
  - Foreign: Subjects BETA, GAMMA
  - Materials per Protocol 7-ECHO

STATUS: Ongoing. God willing, unnecessary.
```

### `birthdays_jan96.txt`

- **Path:** `/internal/personnel/birthdays_jan96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
STAFF BIRTHDAYS — JANUARY 1996
Social Committee

  03-JAN: SANTOS, Maria (Admin)
  08-JAN: OLIVEIRA, Paulo (Facilities)
  12-JAN: RIBEIRO, Ana (Records)
  17-JAN: FERREIRA, João (Security)
  24-JAN: [REDACTED] (Ops)
  29-JAN: COSTA, Lucia (Reception)

Cake contributions voluntary.
Sign-up sheet in break room.

NOTE: 24-JAN celebration cancelled.
Entire Ops floor restricted access.
No explanation provided.
```

### `briefing_watchers_1996.txt`

- **Path:** `/admin/briefing_watchers_1996.txt`
- **Status:** `restricted_briefing`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem
- **Required flags:** `adminUnlocked`

```text
EXECUTIVE BRIEFING — THE WATCHERS
CLASSIFICATION: COSMIC — EYES ONLY
FEB 1996

I. THE INCIDENT
  20-23 JAN: Recovery at three sites near Varginha.
  Biological specimens secured.

II. THE SPECIMENS
  Three non-human entities: ALFA, BETA, GAMMA.
  Purpose-built. Designed to expire.
  Instruments. Scouts. Tools.

III. THE TRANSMISSION
  Data transmitted before expiration.
  Earth assessed viable for extraction.

IV. THE WINDOW
  "Thirty rotations" — 2026.
  Not an invasion. Something we have no language for.

V. THE WATCHERS
  They observe. They measure. They harvest.
  Without arriving.

VI. POSTURE
  Deny publicly. Prepare for 2026.
  We have documented. We have not solved.

God help us all.
```

### `budget_memo.txt`

- **Path:** `/internal/admin/budget_memo.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
MEMORANDUM — OFFICE SUPPLIES BUDGET
Administrative Services
DATE: 08-JAN-1996

RE: Paper Clip Requisition Dispute

Audit identified discrepancies:
  Q4 1995 usage: 47 boxes
  Q4 1995 budget: 32 boxes
  Variance: +47% over budget

REMEDIATION:
  1. Itemized requests by 15th monthly
  2. Bulk purchases require supervisor
  3. Reuse of clips encouraged

"Jumbo" clips must be justified in writing.
Standard size is sufficient for most binding.

Questions: Procurement, ext. 2140

We have larger concerns now. —handwritten
```

### `budget_request_q1_96.txt`

- **Path:** `/internal/admin/budget_request_q1_96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
BUDGET REQUEST — Q1 1996
Regional Intelligence (Sector 7)
SUBMITTED: 08-JAN-1996

  Personnel:     R$ 142,000.00
  Equipment:     R$  38,500.00
  Travel:        R$  21,200.00
  Maintenance:   R$  15,800.00
  Misc:          R$   8,500.00
  TOTAL:         R$ 226,000.00

JUSTIFICATION: Routine operations.
No special projects anticipated.

STATUS: PENDING

NOTE: Submitted BEFORE incident of 20-JAN.
Supplemental request to follow.
Amount: [CLASSIFIED].
```

### `cafeteria_feedback.txt`

- **Path:** `/internal/misc/cafeteria_feedback.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
ANONYMOUS FEEDBACK
RE: Cafeteria Service
SUBMITTED: 18-JAN-1996

COMPLAINT:
  Coffee machine broken three weeks.
  Nobody cares. Unacceptable.

SUGGESTION:
  Bring back Thursday feijoada.
  Only thing worth eating here.

RESPONSE (Admin):
  Coffee machine repair scheduled 25-JAN.
  Feijoada discontinued — budget constraints.

SECOND COMPLAINT (handwritten, 25-JAN):
  The smell from the basement vents is making
  the food taste strange. Please investigate.
  RESPONSE: See maintenance_schedule.txt — B-3 access
  suspended. Forwarded to Facilities.
```

### `cafeteria_menu_week03.txt`

- **Path:** `/internal/misc/cafeteria_menu_week03.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
CAFETERIA MENU — WEEK 03 (15-19 JAN 1996)

SEGUNDA: Feijoada completa, arroz, couve, farofa.
TERÇA: Frango à passarinho, purê de batata.
QUARTA: Peixe grelhado, feijão tropeiro.
QUINTA: Carne assada, macarrão ao sugo.

SEXTA-FEIRA:
  *** MENU CANCELLED ***
  [INCIDENT RESPONSE ACTIVE]
  Emergency rations distributed.

Friday's menu cancelled due to unscheduled facility
lockdown. See INCIDENT REPORT 1996-01-VG.
Cafeteria staff reassigned to support operations.
Vending machines remain operational.

Dona Maria apologizes for the inconvenience.
She does not know what happened Friday.
None of us will tell her.
```

### `cafeteria_menu.txt`

- **Path:** `/internal/misc/cafeteria_menu.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
CAFETERIA MENU — WEEK 04 (22-26 JAN 1996)

SEGUNDA: Strogonoff de frango, arroz, batata palha
TERÇA: Bife à milanesa, arroz, feijão, farofa
QUARTA: Moqueca de peixe, arroz branco, pirão
QUINTA: Cozido à portuguesa, legumes, pão de alho
SEXTA: Feijoada light, arroz, couve, laranja

SOBREMESA: Pudim (Mon-Wed), Goiabada (Thu-Fri)
SUCO: R$ 0,50 — Maracujá | Caju | Acerola

Dona Maria wishes everyone a good week.

UPDATE 23-JAN: Kitchen closed Thursday/Friday.
Water supply to cafeteria redirected.
"Priority hydration requirements" — Facilities.
Vending machines only. We apologize.

See also: incident_report_1996_01_VG.txt
```

### `cargo_transfer_memo.txt`

- **Path:** `/internal/sanitized/cargo_transfer_memo.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
INTERNAL MEMO — CARGO TRANSFER COORDINATION
DATE: 22-JAN-1996 | CLASSIFICATION: ROUTINE

The recovered equipment arrived yesterday evening.
Initial inspection complete. Contents intact despite
transport conditions. Surface wear within parameters.

Storage requirements:
  - Temperature: Standard warehouse conditions
  - Humidity: Controlled
  - Access: Restricted per standard protocol

Foreign partners notified. Coordination team
expected within 72 hours.

Ensure receiving bay is cleared.

NOTE: "Equipment" is the approved term.
Do not describe what you saw in the crates.
[signature illegible]
```

### `cipher_notes.txt`

- **Path:** `/internal/protocols/cipher_notes.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
ACCESS CODE AUDIT — SECURITY REVIEW
CLASSIFICATION: INTERNAL USE ONLY
DATE: 18-DEC-1995

Per Security Directive 1995-12, departmental access
codes reviewed for naming compliance.

Codes use agricultural terminology per Project
Operations naming standard.

Audit flagged the following code for pattern
recognition vulnerability:

    C - O - L - H - E - I - T - A

Sequential letter arrangement susceptible to
enumeration attacks. Code remains acceptable for
current fiscal year. Consider alphanumeric
substitution for FY1997.

AUDITOR: Systems Administration
DISTRIBUTION: Terminal operators, Security Office
```

### `coffee_harvest_q1_96.txt`

- **Path:** `/internal/misc/coffee_harvest_q1_96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
REGIONAL ECONOMIC REPORT — COFFEE SECTOR
Q1 1996 — SUL DE MINAS
═══════════════════════════════════════════════════════════

Harvest progressing normally.
Expected yield: 2.3 million bags.
Quality: Above average.

NYC Commodity Exchange: $1.42/lb (Jan average).
Local cooperative price: R$ 85.00/bag. Stable.

Varginha remains the region's logistics hub.
Railroad capacity adequate. Export processing normal.

No economic anomalies detected.

═══════════════════════════════════════════════════════════
```

### `coherence_threshold.log`

- **Path:** `/tmp/coherence_threshold.log`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
SYSTEM ALERT — COHERENCE THRESHOLD
PRIORITY: ELEVATED

User has logged substantial evidence.
Evidence tracker approaching completion.
Leak risk rising.

System recommendation:
  Preserve session artifacts.
  Expect emergency export attempts.

Final evidence may require administrative access.

NOTE: If you are reading this and you understand
what you have found, proceed carefully.
They are watching this terminal too.
```

### `colares_incident_log_77.txt`

- **Path:** `/ops/prato/archive/colares_incident_log_77.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
INCIDENT LOG — OPERATION PRATO (COLARES)
DATE RANGE: SEP-OCT 1977
CLASSIFICATION: RESTRICTED

18-SEP 22:14 — Luminous object above river.
  Beam emitted 4-6 seconds.
  Civilian: heat and puncture mark.
20-SEP 23:06 — Light hovering ~30m. No sound.
  Rapid lateral acceleration.
  Beam directed to ground.
24-SEP 21:47 — Multiple witnesses.
  Light split into two, rejoined, departed.
03-OCT 00:12 — Light tracked 3km along shore.
  Camera overexposed.

STATUS: Unresolved. Pattern persistent.
Incidents cluster near waterfront communities.

Nineteen years later and the light returned.
This time it brought passengers.
```

### `colonization_model.red`

- **Path:** `/admin/colonization_model.red`
- **Status:** `restricted`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
ASSESSMENT — INDIRECT COLONIZATION MODEL
CLASSIFICATION: RED — COMPARTMENTED
DATE: 27-FEB-1996

A framework none of us wanted to consider.

PHASE 1 — RECONNAISSANCE (CONFIRMED)
  Bio-engineered scouts deployed.
  Cognitive density assessed.
  Findings transmitted to origin.

PHASE 2 — SEEDING (THEORETICAL)
  Integration organisms introduced.
  Gradual biological modification.

PHASE 3 — EXTRACTION (THEORETICAL)
  Target world becomes energy source.
  Local species continues — diminished.
  Autonomy degrades. Slowly. Invisibly.

They do not arrive. They do not destroy.
They convert. Quietly. From a distance we
cannot comprehend.

Phase 1 appears complete for Earth.
I have requested confession with the chaplain.
```

### `consumer_device_listening.memo`

- **Path:** `/internal/misc/consumer_device_listening.memo`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
TECHNICAL ASSESSMENT — PASSIVE AUDIO COLLECTION
PROJECT: WHISPER
DATE: 19-DEC-1995
═══════════════════════════════════════════════════════════

TO: Technical Collection Division
FROM: Consumer Electronics Liaison

RE: Ambient Audio Capability in Home Devices

───────────────────────────────────────────────────────────

SUMMARY:

  Working with [REDACTED] manufacturers, we have
  successfully embedded passive microphone arrays in
  the following consumer electronics categories:

  - Television receivers (beta testing, 12 models)
  - Cable decoder boxes (full deployment ready)
  - Answering machines (limited deployment)
  - Clock radios (prototype phase)

CAPABILITIES:

  - Continuous ambient audio capture
  - Keyword activation for priority recording
  - Emotional distress pattern detection (experimental)
  - Data burst transmission during off-peak hours

PRIVACY CONCERNS:

  Legal has advised that current wiretap statutes
  do not explicitly cover ambient collection from
  voluntarily purchased consumer devices.

  Recommend maintaining this legal ambiguity.

NEXT PHASE:

  Expand to cordless telephone base stations.
  Future integration with "smart home" concepts
  currently in development at [REDACTED] labs.

═══════════════════════════════════════════════════════════
```

### `contact_incident_report.txt`

- **Path:** `/ops/medical/contact_fatality/contact_incident_report.txt`
- **Status:** `restricted`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
CONTACT INCIDENT — OFFICER [CLASSIFIED]
FILE: VAR-96-MED-007 — TOP SECRET
═══════════════════════════════════════════════════════════

Corporal, 4th Company, Varginha MP.
Status: DECEASED (15-FEB-1996).

20-JAN 21:30 — Responded to call, Jardim Andere.
  Made physical contact with fauna specimen.
  Left forearm, bare skin. 3-4 seconds.

23-JAN — Headaches, joint pain. Skin irritation
  at contact site.

27-JAN — Hospitalized. Anomalous blood markers.

02-FEB — Rapid deterioration. Multiple organ systems.

15-FEB 03:47 — Expired.
  Official cause: "Pneumonia."

───────────────────────────────────────────────────────────
SUPPRESSED: Tissue necrosis at contact site.
Immune system collapse. Unidentifiable pathogen.
Attending physician: "I have never seen anything
like this. This is not any known disease."

═══════════════════════════════════════════════════════════
```

### `contamination_theory.txt`

- **Path:** `/ops/zoo/contamination_theory.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
OFFICIAL EXPLANATION — ZOO ANIMAL DEATHS
FOR: Public Release — 01-FEB-1996
═══════════════════════════════════════════════════════════

PRESS STATEMENT:
  "The Zoológico Municipal regrets the loss of four
   animals in late January. Investigation determined
   the cause was contaminated feed received 18-JAN.
   New supplier protocols are being implemented."

───────────────────────────────────────────────────────────
INTERNAL (DO NOT RELEASE):
  Feed records altered. Supplier compensated.
  Actual cause: proximity contamination from
  recovered fauna specimen held 20-21 JAN.

═══════════════════════════════════════════════════════════
```

### `convergence_model_draft.txt`

- **Path:** `/admin/convergence_model_draft.txt`
- **Status:** `intact`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
CONVERGENCE MODEL — DRAFT (PURGED)
PROJECT SEED — TEMPORAL ANALYSIS | FEB 3, 1996

Psi-comm fragments combined with navigation array
signal data yield:

ACTIVATION WINDOW: September 2026 (±2 months)
"Thirty rotations" = 30 years from 1996 baseline.

Phase 1 — RECONNAISSANCE (1996):
  Bio-constructs survey target. Data transmitted
  via psi-band to external receiver.
Phase 2 — SEEDING (1996-2026):
  Neurological sensitization via biological material.
  "Carriers" propagate signal receptivity.
Phase 3 — TRANSITION (2026):
  Full-spectrum neural activation.
  Nature: UNKNOWN. Worst case: [DATA EXPUNGED]

Rejected by oversight. Official: "Random noise."
This document will not survive the next purge cycle.
The math doesn't lie.
```

### `copa_94_celebration.txt`

- **Path:** `/internal/misc/copa_94_celebration.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
INTERNAL MEMORANDUM — FACILITIES
DATE: 19-JUL-1994
RE: Copa do Mundo Celebration Guidelines

Following Brazil's victory, the following apply:
  1. Television viewing: break areas ONLY.
  2. Caipirinha service: after-hours events only.
  3. Samba music: must not exceed 70dB.
  4. "É TETRA!" limited to three (3) times per hour.

APPROVED: Brazilian flag (regulation size), team photos.
PROHIBITED: Confetti (fire hazard), fireworks, vuvuzelas.

NOTE FROM DIRECTOR:
  "Parabéns a todos. But the universe does not pause
   for futebol."
  "Nem tudo é festa. Voltem ao trabalho segunda-feira."

In hindsight, we should have celebrated harder.
```

### `core_dump_corrupted.bin`

- **Path:** `/tmp/core_dump_corrupted.bin`
- **Status:** `unstable`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
⚠️ ARQUIVO INSTÁVEL — NÃO CONFIÁVEL
═══════════════════════════════════════════════════════════

Origem: falha crítica de sistema. Dados corrompidos.
Integridade estrutural comprometida.

0x00000000: 4D5A9000 03000000 04000000 FFFF0000
0x00000010: B8000000 00000000 40000000 00000000
0x00000020: [CORRUPÇÃO DE DADOS] [CORRUPÇÃO DE DADOS]
0x00000030: [ILEGÍVEL] [FALHA DE SETOR]

───────────────────────────────────────────────────────────

RECUPERAÇÃO PARCIAL:
  ...migração do banco de dados falhou no checkpoint 0x7F...
  ...backup interrompido durante ciclo noturno...
  ...tabela de setores sobrescrita, impossível recuperar...
  ...registros de pessoal vinculados a este bloco: ausentes...

>> READING THIS FILE HAS DESTABILIZED NEARBY DATA <<
═══════════════════════════════════════════════════════════
```

### `data_reconstruction.util`

- **Path:** `/tmp/data_reconstruction.util`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
UTILITY — DATA RECONSTRUCTION TOOL v1.7 (LEGACY)

This utility reconstructs fragmented data segments.

USAGE:
  script <script_content>

REQUIRED SCRIPT FORMAT:
  A valid reconstruction script must contain:
    - INIT command
    - TARGET specification (valid archive path)
    - EXEC command

EXAMPLE:
  script INIT;TARGET=/admin/fragment.dat;EXEC

AVAILABLE TARGETS:
  /admin/neural_fragment.dat    [FRAGMENTED]
  /comms/psi_residue.log        [CORRUPTED]

NOTE: Successful reconstruction may reveal hidden content.
```

### `debriefing_protocol.txt`

- **Path:** `/ops/mib/debriefing_protocol.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
WITNESS DEBRIEFING — PROTOCOL SOMBRA
CLASSIFICATION: RESTRICTED
═══════════════════════════════════════════════════════════

PHASE 1 — APPROACH
  Team of two minimum. Dark suits.
  Arrive 22:00-06:00. Minimal identification.
  "Somos do governo."

PHASE 2 — ASSESSMENT
  TYPE A (frightened): Proceed to reassurance.
  TYPE B (curious): Emphasize national security.
    "A segurança da sua família depende do silêncio."
  TYPE C (hostile): Deploy secondary team.

PHASE 3 — DOCUMENTATION
  Obtain signed recantation and NDA (Form W-7).

PHASE 4 — FOLLOW-UP
  Monitor 30 days minimum. Verify no media contact.

───────────────────────────────────────────────────────────
AUTHORIZED: Verbal persuasion, financial incentive.
PROHIBITED: Physical contact. All sessions UNRECORDED.

═══════════════════════════════════════════════════════════
```

### `deleted_comms_log.txt`

- **Path:** `(archive) deleted_comms_log`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** archiveFiles

```text
═══════════════════════════════════════════════════════════
COMMUNICATIONS LOG — PURGED
DATE: JANUARY 20-22, 1996
═══════════════════════════════════════════════════════════

[20/01/96 02:17]
SITE-3 > COMMAND: Visual confirmed. Multiple witnesses.

[02:19]
COMMAND > SITE-3: Mobilize RECOVERY TEAM. No local involvement.

[02:41]
RECOVERY > COMMAND: On scene. Three biologics confirmed.
                    One responsive.

[02:43]
COMMAND > RECOVERY: Responsive HOW?

[02:44]
RECOVERY > COMMAND: It's looking at us. Each in turn.
                    Like it's... counting.

[02:45]
COMMAND > RECOVERY: Contain immediately.

[02:48]
COMMAND > RECOVERY: Override granted. Initiate OPERAÇÃO COLHEITA.

[03:12]
RECOVERY > COMMAND: All biologics contained.
                    One handler reporting headache and nausea.

[03:15]
COMMAND > ALL: Communications blackout. CLASSIFIED OMEGA.

[LOG TERMINATED]

───────────────────────────────────────────────────────────
DELETION ORDER: COMM-1996-0120-DEL
───────────────────────────────────────────────────────────
```

### `diplomatic_cable_23jan.enc`

- **Path:** `/comms/liaison/diplomatic_cable_23jan.enc`
- **Status:** `encrypted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
ENCRYPTED CABLE — PRIORITY ALPHA
ORIGIN: LANGLEY
DESTINATION: BRASÍLIA STATION
DATE: 23-JAN-1996 04:12 UTC

[ENCRYPTED — REQUIRES CLEARANCE]

Cross-reference: /comms/liaison/foreign_liaison_note.txt
```

_Decrypted fragment:_

```text
DECRYPTED CABLE — PRIORITY ALPHA
ORIGIN: LANGLEY | DEST: BRASÍLIA STATION
DATE: 23-JAN-1996 04:12 UTC

FLASH TRAFFIC

Recovery teams report multiple specimens secured.
Division as agreed: Primary to you, Secondary to us.
Tertiary inbound to Tel Aviv per standing agreement.

Protocol 7-ECHO remains in effect.
No domestic agencies read-in.
Cover story: industrial accident, toxic waste.

CRITICAL: Specimen 3 showed residual cognitive activity.
Recommend immediate neural extraction before decay.
Our team brings equipment. ETA 6 hours.

ACKNOWLEDGE.

>> CONFIRMS MULTI-NATION COORDINATION <<
```

### `directive_alpha_draft.txt`

- **Path:** `(archive) directive_alpha_draft`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** archiveFiles

```text
═══════════════════════════════════════════════════════════
DRAFT — DIRECTIVE ALPHA — ITERATION 1
DATE: JANUARY 19, 1996 — 04:22
AUTHOR: [DELETED]
STATUS: MARKED FOR DELETION
═══════════════════════════════════════════════════════════

Asset recovery timeline must be accelerated.

2026 convergence window is CLOSER than modeled.
Signal analysis indicates active monitoring.

───────────────────────────────────────────────────────────
REMOVED FROM FINAL VERSION:
───────────────────────────────────────────────────────────

Subjects (BIO-A through BIO-C) have demonstrated
cognitive persistence despite containment protocols.
Recommend relocation to Site 7.

NOTE: BIO-B has attempted communication.
Analysis suggests awareness of our organizational
structure. HOW?

Recommend cognitive isolation protocol.

───────────────────────────────────────────────────────────
SANITIZATION NOTE:
───────────────────────────────────────────────────────────

Final directive: reference "material recovery" only.
All biological terminology replaced with
"debris" and "artifacts."
Project SEED references to be purged.

═══════════════════════════════════════════════════════════
```

### `duty_roster_jan96.txt`

- **Path:** `/internal/personnel/duty_roster_jan96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
WEEKEND DUTY ROSTER — JANUARY 1996
OPERATIONS CENTER

06-07 JAN: SILVA, R. / OLIVEIRA, P.
13-14 JAN: SANTOS, M. / COSTA, L.
20-21 JAN: [CANCELLED — ALL HANDS ON DECK]
27-28 JAN: FERREIRA, J. / LIMA, A.

Weekend of 20-21 JAN: Full staff mobilization
per Director order. No details provided.
Overtime requests to HR by Wednesday prior.

NOTE: Personnel reporting 20-JAN expressed
reluctance. Two requested immediate transfer.
Requests denied. NDA amendments signed.
See: vacation_calendar.txt (cancellations)

Duty Officer: ext. 3000 (24h)
```

### `economic_transition_memo.txt`

- **Path:** `/internal/misc/economic_transition_memo.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
INTERNAL MEMORANDUM — ECONOMIC RESEARCH DIVISION
DATE: 08-NOV-1995
CLASSIFICATION: INTERNAL USE ONLY
═══════════════════════════════════════════════════════════

TO: Deputy Director, Strategic Planning
FROM: Economic Futures Working Group

RE: Decentralized Currency Prototype — Phase II Assessment

───────────────────────────────────────────────────────────

Per your request, we have completed preliminary testing of
the distributed ledger monetary system ("Project COIN").

KEY FINDINGS:

  1. The cryptographic consensus mechanism functions as
     designed. Nodes achieve agreement without central
     authority within acceptable latency parameters.

  2. Transaction anonymity meets intelligence community
     requirements for untraceable fund transfers.

  3. Energy consumption remains a concern. Current mining
     algorithms require significant computational resources.

RECOMMENDATION:

  Continue research but delay public deployment. The
  technology is premature for civilian adoption but shows
  promise for covert operations funding channels.

  Suggest revisiting for public release in 10-15 years
  when infrastructure can support wider adoption.

───────────────────────────────────────────────────────────

  [signature]
  S.N.
  Lead Cryptographer, Economic Futures

═══════════════════════════════════════════════════════════
```

### `education_curriculum_revision.doc`

- **Path:** `/internal/misc/education_curriculum_revision.doc`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
CURRICULUM ADVISORY COMMITTEE — WORKING NOTES
MEETING: 14-AUG-1995
CLASSIFICATION: INTERNAL
═══════════════════════════════════════════════════════════

ATTENDEES: [REDACTED]

AGENDA ITEM 3: Historical Narrative Simplification

───────────────────────────────────────────────────────────

DISCUSSION SUMMARY:

  Committee reviewed proposals for streamlining historical
  content in secondary education materials.

KEY RECOMMENDATIONS:

  1. Complex geopolitical contexts should be reduced to
     clear "protagonist/antagonist" frameworks.

  2. Events with multiple valid interpretations should be
     presented with single "consensus" narrative.

  3. Topics generating "excessive debate" among students
     should receive reduced curriculum time.

RATIONALE:

  Research indicates complex narratives correlate with:
    - Reduced institutional trust
    - Increased political polarization
    - Lower social cohesion metrics

  Simplified narratives support unified civic identity.

IMPLEMENTATION:

  - Phase out nuanced source analysis by Grade 10
  - Emphasize "shared heritage" over critical evaluation
  - Textbook publishers to receive guidelines Q1 1996

MOTION CARRIED: 7-2

[END NOTES]

═══════════════════════════════════════════════════════════
```

### `emergency_broadcast.enc`

- **Path:** `/admin/emergency_broadcast.enc`
- **Status:** `encrypted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
[LEGACY ENCRYPTION — RECOVERED COPY AVAILABLE]

This file previously used a timed wrapper.
Recovered text available directly.
```

_Decrypted fragment:_

```text
EMERGENCY BROADCAST — INTERCEPTED
DATE: 20-JAN-1996 22:47 LOCAL
FREQUENCY: MILITARY BAND — ENCRYPTED

TOWER: "Flight 1-7, confirm visual on target area."
PILOT: "Negative. Heavy cloud cover at 3000m."
TOWER: "Proceed to 21.5519 S, 45.4331 W."
PILOT: "Confirmed. ETA 8 minutes."

[STATIC — 14 SECONDS]

PILOT: "Tower, something on radar. Not moving."
TOWER: "Weapons inactive. Observe only."
PILOT: "Beginning visual approach."

[STATIC — 8 SECONDS]

PILOT: "Deus me livre... I don't know what I'm looking at."
TOWER: "Maintain radio silence from this point."
PILOT: "But Tower—"
TOWER: "This conversation never happened. RTB immediately."

CLASSIFICATION: ABOVE TOP SECRET
```

### `encoded_transmission.enc`

- **Path:** `/tmp/encoded_transmission.enc`
- **Status:** `encrypted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
TRANSMISSÃO INTERCEPTADA — CIFRADA
ORIGEM: DESCONHECIDA | DATA: 1996-01-21 03:47
═══════════════════════════════════════════════════════════

CIFRA IDENTIFICADA: ROT13

MENSAGEM CODIFICADA:
  Pneqb genafresrq.
  Qrfgvangvba pbasvezrq.
  Njnvgvat vafgehpgvbaf.

───────────────────────────────────────────────────────────
Interceptada durante varredura de frequência não catalogada.
Transmissão originada de coordenadas dentro do perímetro militar.
Nenhum registro oficial desta interceptação foi localizado.

Aplique a cifra ROT13 acima para decodificar.
Cada letra é deslocada 13 posições no alfabeto.
═══════════════════════════════════════════════════════════
```

_Decrypted fragment:_

```text
═══════════════════════════════════════════════════════════
TRANSMISSÃO DECODIFICADA
DATA: 1996-01-21 03:47:00
═══════════════════════════════════════════════════════════

MENSAGEM DECODIFICADA:
  Cargo transferred.
  Destination confirmed.
  Awaiting instructions.

───────────────────────────────────────────────────────────
ANÁLISE:
  This transmission confirms transfer of recovered materials
  to a secondary facility. Location undisclosed.

  Transmission originated from within the military perimeter
  on a frequency not assigned to any known unit.

  Nature of cargo not specified in any official manifest.
═══════════════════════════════════════════════════════════
```

### `energy_extraction_theory.txt`

- **Path:** `/admin/energy_extraction_theory.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
PATIENT DOCUMENT — RECOVERED FROM ROOM 14B
RECOVERED: 03-MAR-1996

they took my notebooks but not this one.

it is not an invasion. everyone waits for ships,
weapons, something that looks like war.
it already started.

they want what we produce without knowing.
every thought. every dream. they have been
collecting it for a very long time.

seven billion units. that is what we are.

i am a physicist. i measure things.
the possibility that we are the thing being
measured is not what my training prepared me for.

i do not believe i am wrong.
```

### `energy_node_assessment.txt`

- **Path:** `/ops/exo/energy_node_assessment.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
ASSESSMENT — ENERGY NODE CLASSIFICATION
CLASSIFICATION: COMPARTMENTED
DATE: 10-FEB-1996

Psi-comm fragments mapped against material analysis:

  "Energy density" — referenced 4 times
  "Extraction model" — consistent across samples
  "Cognitive activity" — used as a metric

Earth is being assessed as an energy source.
Biological neural networks may serve as the
extraction medium. Cognitive output correlates
with projected energy yield.

Recovered materials exhibit energy absorption
we cannot replicate. Scout neural structures
confirm measurement function.

Scout mission appears complete.
Transition window undefined.

Budget request attached separately.
The Ministry will not approve if they see why.
```

### `ethics_exception_03.txt`

- **Path:** `/admin/ethics_exception_03.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
ETHICS EXCEPTION — REQUEST 03
DATE: 29-JAN-1996

REQUEST:
  Waiver of standard protocols for specimen handling.
  Justification: Unique scientific opportunity.

STATUS: APPROVED

CONDITIONS:
  - All procedures conducted off-site
  - No institutional records
  - Results shared with foreign partners only

APPROVAL: [SIGNATURE REDACTED]

The ethics board did not ask what the specimen
was. I believe they did not want to know.
```

### `extraction_mechanism.red`

- **Path:** `/admin/extraction_mechanism.red`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
INTERNAL ANALYSIS — ENERGY EXTRACTION HYPOTHESIS
CLASSIFICATION: RED — 18-MAR-1996

Two phrases recur across all three specimen
neural extractions:

  "higher cognition increases yield"
  reference to population density — billions

Our linguist insists these are not thoughts.
They are instructions. Embedded. Like firmware.

Intelligence is the resource. Population size
determines viability. They were calculating yield.
Of us.

No references to destruction. If the resource is
cognitive activity, killing the source terminates
supply. The extraction must be invisible.

Deus me livre — my hands will not stop shaking.

[SIGNATURE REDACTED]
```

### `facilities_memo_12.txt`

- **Path:** `/internal/facilities/facilities_memo_12.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
MEMORANDO INTERNO — DIVISÃO DE INSTALAÇÕES
DATA: 15-JAN-1996
RE: Horário do Refeitório

Effective 20-JAN-1996, cafeteria hours adjusted:
  Breakfast: 06:30 - 08:30
  Lunch: 11:30 - 13:30
  Dinner: SUSPENDED UNTIL FURTHER NOTICE

Extended-shift personnel may request vouchers
from Administrative Office, Room 204.

Floor 3 vending machines remain 24h.
Basement vending machines now restricted.

Facilities ext. 2240
```

### `family_compensation.txt`

- **Path:** `/ops/medical/contact_fatality/family_compensation.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
COMPENSATION — OFFICER'S FAMILY
DATE: 20-FEB-1996 — RESTRICTED
═══════════════════════════════════════════════════════════

Wife: [REDACTED]. Children: 2 (ages 7 and 4).

OFFICIAL: Death-in-service pension, insurance.
  Total: R$ 45,000.

CLASSIFIED SUPPLEMENTAL:
  R$ 50,000 cash.
  R$ 2,000/month stipend (5 years).
  Apartment provided, Belo Horizonte.

CONDITIONS:
  — Accept "pneumonia" narrative
  — No media contact, ever
  — No legal action against government
  — Relocate from Varginha within 30 days
  — No contact with UFO investigators

───────────────────────────────────────────────────────────
Signed: [WIFE OF OFFICER], 20-FEB-1996.
Family moved to Belo Horizonte 15-MAR.

═══════════════════════════════════════════════════════════
```

### `field_report_delta.txt`

- **Path:** `/ops/prato/field_report_delta.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
FIELD REPORT — OPERATION PRATO DELTA
SUBMITTED: 24-JAN-1996

Three recovery sites established.
All physical evidence secured.
All biological material secured.

FOREIGN LIAISON:
  Representatives from [REDACTED] arrived 22-JAN.
  Joint protocol established.
  Material sharing agreement signed.

CONCERNS:
  Local witnesses: 30+.
  Media suppression partially effective.
  Long-term containment uncertain.

Maintain denial posture.
Accelerate foreign material transfer.
Discontinue local analysis to prevent leaks.
```

### `fire_dept_log_jan96.txt`

- **Path:** `/internal/misc/fire_dept_log_jan96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
FIRE DEPARTMENT — INCIDENT LOG
STATION: Varginha Central — 15-25 JAN 1996
═══════════════════════════════════════════════════════════

15-JAN 14:22 — Grass fire, Rte. 381 km 42.
  Cause: Cigarette. Resolved 15:45.

17-JAN 09:15 — Smoke alarm, Hospital Regional.
  Electrical short. Resolved 10:00.

18-JAN 21:30 — Vehicle fire, downtown.
  Engine failure. Resolved 22:15.

20-JAN 16:45 — [REDACTED]
  Location: Jardim Andere.
  Authorization: Military Police.
  Resolved: [CLASSIFIED]

20-JAN 23:00 — [REDACTED]
  Location: [CLASSIFIED]
  Authorization: Regional Command.
  Resolved: [CLASSIFIED]

22-JAN 11:30 — Kitchen fire, residential.
  Cooking oil. Resolved 11:50.

24-JAN 16:00 — False alarm, school.
  Student prank. Resolved 16:15.

═══════════════════════════════════════════════════════════
```

### `FOR_PRESIDENTS_EYES_ONLY.enc`

- **Path:** `/tmp/FOR_PRESIDENTS_EYES_ONLY.enc`
- **Status:** `encrypted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
TRAP FILE — INTRUSION CONFIRMED

"FOR PRESIDENTS EYES ONLY" does not exist
in any real intelligence classification system.

This was a test of your operational judgment.
You failed.

Countermeasures deployed.
Your curiosity has a cost.
```

### `foreign_drone_assessment.txt`

- **Path:** `/ops/assessments/foreign_drone_assessment.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
ASSESSMENT — FOREIGN DRONE HYPOTHESIS
ANALYST: [CLASSIFIED]
DATE: 25-JAN-1996

HYPOTHESIS:
  Recovered material is a foreign reconnaissance
  drone (US or European origin).

SUPPORTING:
  - Advanced materials, aerospace-grade
  - Size appropriate for unmanned platform
  - Recovery site near strategic infrastructure

CONTRADICTING:
  - No propulsion system identified
  - No known drone uses these materials
  - Mass variability unexplained
  - Thermal signature matches no engine type

CONCLUSION:
  Hypothesis CANNOT be sustained.
  Properties inconsistent with ANY known aircraft.
```

### `foreign_liaison_cable_deleted.txt`

- **Path:** `(archive) foreign_liaison_cable_deleted`
- **Status:** `intact`  ·  **Evidence:** yes  ·  **Source:** archiveFiles

```text
DIPLOMATIC CABLE — DELETED
ORIGIN: U.S. EMBASSY, BRASÍLIA → LANGLEY
DATE: JAN 23, 1996 | RECOVERED FROM BACKUP TAPE

PRIORITY: FLASH

Three biological specimens secured by Brazilian
military. One deceased, two viable. Per Protocol ECHO,
request technical assessment.

Brazilian liaison (Col. [REDACTED]) cooperative.
Tel Aviv requesting observer status. Recommend DENY.

Brazilian Air Force scrambled interceptors per NORAD
advisory. They are fully aware.
Deniability window is closing.

RESPONSE (LANGLEY): APPROVED. Team en route, ETA 48h.
Brazilian custody TEMPORARY. Full transfer per 1988
treaty annex. NSA signals sweep ordered.

Cable destroyed per diplomatic protocol.
No record in FOIA-accessible databases.
```

### `foreign_liaison_note.txt`

- **Path:** `/comms/liaison/foreign_liaison_note.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
LIAISON NOTE — FOREIGN COORDINATION
FROM: Embassy Contact (unsigned)
DATE: 23-JAN-1996

Package received via diplomatic pouch.

Contents confirmed:
  - Biological samples (2 containers)
  - Material samples (1 container)
  - Documentation (sealed)

Our team is already en route.

No records of this exchange will exist
in either system. Protocol 7-ECHO acknowledged.

Contact when preliminary analysis complete.

Your material_x_analysis.dat was illuminating.
We concur with the conclusion.
God help us all.
```

### `foreign_press_alert.txt`

- **Path:** `/comms/media_ops/foreign_press_alert.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
ALERT — FOREIGN PRESS INTEREST
DATE: 15-JUN-1996 — RESTRICTED
═══════════════════════════════════════════════════════════

American Business Journal assigned correspondent
J. BROOKE (Rio bureau, 12 years Latin America).
Assessment: PROFESSIONAL, PERSISTENT.

Known activities:
  — Filed FOIA with Brazilian Air Force
  — Contacted Hospital Regional administration
  — Visited Jardim Andere neighborhood

Publication expected late June.

───────────────────────────────────────────────────────────
Cannot use domestic suppression tactics on
international press. Different rules apply.
Brief cooperative Brazilian sources to emphasize
"Mudinho" explanation and mass hysteria angle.

═══════════════════════════════════════════════════════════
```

### `ghost_in_machine.enc`

- **Path:** `/internal/ghost_in_machine.enc`
- **Status:** `encrypted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem
- **Required flags:** `adminUnlocked`

```text
═══════════════════════════════════════════════════════════
ARQUIVO PESSOAL — CÓPIA LACRADA
PROPRIETÁRIO: [REGISTRO SUPRIMIDO]
═══════════════════════════════════════════════════════════

Status: Cifrado. Fragmentos recuperáveis detectados.

This archive was sealed by its creator — not by the system.
The encryption is personal, not military-grade.
Someone wanted to be found.
But only by the right person.

Whatever is inside was never meant for official record.
The transfer authorization may explain who left this behind.
```

_Decrypted fragment:_

```text
═══════════════════════════════════════════════════════════
ARQUIVO PESSOAL — SOMENTE PARA MEUS OLHOS
═══════════════════════════════════════════════════════════

Meu nome é Carlos Eduardo Ferreira.
2º Tenente, Força Aérea Brasileira. Analista de inteligência.
Janeiro de 1996.

I processed the field reports from Varginha.
I saw the photographs before classification.
I read witness accounts before they were rewritten.

And I saw the being. It looked at me.
Not with fear. Something I cannot name.
It understood what we were going to do.

───────────────────────────────────────────────────────────

I built this archive across thirty years.
Everything they tried to erase, I saved.

My call sign was UFO74.
Agora você sabe.

>> THIS FILE TRIGGERS SECRET ENDING <<
```

### `ghost_session.log`

- **Path:** `/tmp/ghost_session.log`
- **Status:** `unstable`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem
- **Required flags:** `ghostSessionAvailable`

```text
RESIDUAL SESSION CAPTURE — GHOST FRAME
TIMESTAMP: [REDACTED]

[PARTIAL COMMAND TRACE]
  > cd /storage/quarantine
  > open bio_container.log
  > open autopsy_alpha.log
  > cd /comms/psi
  > open transcript_core.enc
  > connect autopsy_alpha.log transcript_core.enc
  > iddqd
  > god status

Prior operator achieved coherent linkage before purge.
Evidence trails remain viable.

Undocumented maintenance phrase accepted after trace collapse.
No corresponding reference exists in current operator manuals.

They were here before you. They found what you are
looking for. Then the session was terminated.
Do not repeat their mistakes.
```

### `hvac_maintenance_log.txt`

- **Path:** `/internal/facilities/hvac_maintenance_log.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
HVAC MAINTENANCE LOG — BUILDING 3
PERIOD: 01-JAN to 31-JAN-1996

03-JAN: Filter replacement, Floor 2 (routine)
07-JAN: Compressor inspection, Rooftop A (passed)
12-JAN: Thermostat calibration, Room 317 (+2C)
18-JAN: Duct cleaning, Basement level (completed)

22-JAN: EMERGENCY — Basement cold storage failure
  Cause: Power surge. Generator activated.
  Outage duration: 4 hours.
  Contents affected: CLASSIFIED
  Temperature excursion: CLASSIFIED

25-JAN: Cold storage repaired. Tests satisfactory.
28-JAN: Routine inspection, all floors.

TECHNICIAN: M. CARVALHO
NOTE: Carvalho requested transfer 29-JAN.
Reason cited: "personal."
```

### `incident_report_1996_01_VG.txt`

- **Path:** `/internal/misc/incident_report_1996_01_VG.txt`
- **Status:** `intact`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
INCIDENT REPORT 1996-01-VG
DATE: 20-JAN-1996
CLASSIFICATION: RESTRICTED — SECTOR COMMAND ONLY
═══════════════════════════════════════════════════════════

At 0215, perimeter alarm triggered — Sector 3.
Patrol dispatched. Found debris field, 40m radius.
Material unidentified. Not consistent with aircraft.

At 0340, three biological specimens recovered from
Jardim Andere. Two responsive. One injured.

FACILITY RESPONSE:
  Cafeteria closed. Water supply redirected.
  Basement levels sealed. Generator priority override.
  All vacation cancelled. NDA amendments distributed.

COVER NARRATIVE: "Chemical spill — industrial origin."
Local media contacted via Protocol SOMBRA.

CROSS-REFERENCE: bio_containment_log_deleted.txt
CROSS-REFERENCE: patrol_observation_shift_04.txt

═══════════════════════════════════════════════════════════
```

### `incident_review_protocol.txt`

- **Path:** `/internal/protocols/incident_review_protocol.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
PROCEDIMENTO OPERACIONAL PADRÃO — REVISÃO DE INCIDENTES
SOP-IR-1989 (REV. 1994) — USO INTERNO

This protocol governs post-incident reconstruction
via archived terminal access.

REVIEW DIMENSIONS:
  1. Physical assets — recovery, transport, disposition
  2. Communications — intercepts, liaison, foreign contact
  3. Oversight — authorization chains, multi-agency
  4. Forward risk — recurrence models, contingencies

Reviews must demonstrate cross-dimensional correlation.
Partial reviews: INCOMPLETE. Incoherent reviews: flagged.

Expect classification barriers.
Some materials require elevated clearance or decryption.

Discrepancies between official and raw records
should be noted but not discussed outside this terminal.
```

### `incident_summary_official.txt`

- **Path:** `/internal/incident_summary_official.txt`
- **Status:** `intact`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
RELATÓRIO OFICIAL DE INCIDENTE
RECUPERAÇÃO DE EQUIPAMENTO — JANEIRO 1996
CLASSIFICAÇÃO: VERSÃO PARA DIVULGAÇÃO PÚBLICA
═══════════════════════════════════════════════════════════

SUMMARY:
  On 20 January 1996, response teams investigated
  reports of debris in the Jardim Andere district
  following severe weather conditions.

OFFICIAL FINDINGS:
  1. Weather station damaged during storm.
  2. Construction materials displaced by high winds.
  3. Telecommunications antenna fallen.

MILITARY PRESENCE:
  Military convoys reported in the area confirmed as
  routine exercises. Unrelated to the debris.

HOSPITAL OCCURRENCES: None.

═══════════════════════════════════════════════════════════
```

### `industrial_accident_theory.txt`

- **Path:** `/ops/assessments/industrial_accident_theory.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
ALTERNATIVE ASSESSMENT — INDUSTRIAL ORIGIN
ANALYST: SGT. PAULA REIS
DATE: 26-JAN-1996

HYPOTHESIS:
  Materials from nearby industrial facility.

INVESTIGATION:
  12 facilities contacted within 50km.
  No reported accidents or material losses.
  No facility uses matching materials.

COMPARISON:
  - Steel plant: No match
  - Chemical processing: No match
  - Automotive: No match
  - Embraer subcontractor: NO MATCH

CONCLUSION: Industrial origin RULED OUT.
No identifiable manufacturing signature.

Discontinue this investigation line.
Defer to standard explanation for public.
```

### `infrastructure_blackout_simulation.txt`

- **Path:** `/internal/misc/infrastructure_blackout_simulation.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
EXERCISE DARK WINTER — SIMULATION RESULTS
CLASSIFICATION: RESTRICTED
DATE: SEP 1995
═══════════════════════════════════════════════════════════

EXERCISE OBJECTIVE:

  Evaluate civil response to extended grid failure with
  concurrent communications infrastructure collapse.

SIMULATION PARAMETERS:

  - Duration: 72 hours (extended to 168 hours)
  - Population centers: 3 metropolitan areas
  - Communications: Landline and cellular disabled
  - Emergency services: Degraded capacity (40%)

PHASE RESULTS:

  0-12 HOURS:
    - Civil order maintained
    - Emergency calls exceeded capacity by hour 4
    - Fuel station queues exceeded 2 miles

  12-48 HOURS:
    - Significant increase in property crime
    - Hospital generators failed in 2 facilities
    - Water pressure loss in elevated areas

  48-168 HOURS:
    - Civil order breakdown in [REDACTED] sector
    - National Guard deployment simulated at hour 96
    - Food supply chain: Total collapse by hour 120

KEY FINDING:

  Without communication infrastructure, civil order
  degrades to critical level within 72 hours.
  Information control is essential for stability.

RECOMMENDATION:

  Develop backup communication protocols for authorities.
  Civilian population should NOT be informed of grid
  vulnerability to prevent preemptive panic.

═══════════════════════════════════════════════════════════
```

### `initial_response_orders.txt`

- **Path:** `/ops/prato/initial_response_orders.txt`
- **Status:** `unstable`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
EMERGENCY ORDERS — INITIAL RESPONSE
ISSUED: 20-JAN-1996 (05:00)
PRIORITY: FLASH

TO: All Regional Units

1. Secure perimeter around designated sites.
2. Detain all civilian witnesses for debriefing.
3. Recover ALL physical material. Leave nothing.
4. Establish communications blackout.
5. Await specialist team arrival.

CRITICAL:
  Do NOT photograph subjects.
  Do NOT touch subjects without protection.
  Do NOT attempt communication with subjects.

Foreign team ETA: See /comms/liaison/
Transport protocols: See /storage/

ACKNOWLEDGE RECEIPT IMMEDIATELY.
AUTH: DIRECTOR, REGIONAL INTELLIGENCE
```

### `integrity_hashes.dat`

- **Path:** `/storage/assets/integrity_hashes.dat`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
INTEGRITY REGISTRY — EVIDENCE HASHES
CLASSIFICATION: RESTRICTED — 27-JAN-1996

Purpose: Validate evidence artifacts against tampering.

HASH SET:
  material_x_analysis.dat     4A9F-77C2-11D0
  transport_log_96.txt        98B1-2E14-CC7A
  autopsy_alpha.log           7D0C-FF22-919B
  transcript_core.enc         61E4-09D3-2B7F
  thirty_year_cycle.txt       2D88-AC91-771E

Hash mismatch indicates altered narrative.
Preserve originals for external verification.

Someone anticipated the purge. These hashes
are the only proof the originals ever existed.
```

### `intercept_summary_dec95.txt`

- **Path:** `/comms/intercepts/intercept_summary_dec95.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
INTERCEPT SUMMARY — DECEMBER 1995
REGION: Minas Gerais / São Paulo Border
CLASSIFICATION: ROUTINE

Total intercepts: 47. Flagged: 3.
Actionable intelligence: 0.

Agricultural price discussions (12).
Personal communications (28). Commercial (5).
Political commentary (2).

No unusual activity detected.
Recommend maintaining current monitoring level.

ANALYST: J.S. RIBEIRO

NOTE: Analyst Ribeiro was reassigned 22-JAN.
No replacement designated.
```

### `internal_note_07.txt`

- **Path:** `/admin/internal_note_07.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
INTERNAL NOTE 07
FROM: [REDACTED]
TO: DIRECTOR
DATE: 28-JAN-1996

RE: Foreign Involvement Concerns

I must register my objection.

The foreign delegation arrived before initial
assessment was complete. Their access to biological
samples was granted before chain of custody.

I believe:
  - They had advance knowledge
  - Their equipment was pre-positioned
  - Their protocols superseded our own

This was not cooperation.
This was assumption of control.

I recommend formal protest through
diplomatic channels.
```

### `internal_response_memo.txt`

- **Path:** `/aftermath/internal_response_memo.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
CLASSIFIED MEMORANDUM
DATE: 10-MAR-1996
RE: Information Containment Assessment

Documents from January 1996 operations exfiltrated
via compromised legacy terminal system.

DAMAGE:
  - Documents circulating on international networks
  - Authenticity questioned (as planned)
  - No mainstream media pickup (yet)

CONTAINMENT:
  1. Flood networks with obvious fakes
  2. Pressure witnesses to recant
  3. Redirect to "foreign drone" hypothesis
  4. Monitor UFO community for investigators

The 2026 window approaches.
Full disclosure may be unavoidable.
Recommend gradual acclimation program.

The individual "UFO74" remains at large.
Termination not recommended — martyr risk.
```

### `jardim_andere_incident.txt`

- **Path:** `/internal/jardim_andere_incident.txt`
- **Status:** `intact`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
FIELD REPORT — INITIAL CONTACT
LOCATION: Jardim Andere, Varginha, Minas Gerais
DATE: 20-JAN-1996, 15:30h

WITNESSES: Three female civilians, ages 14-22.
Vacant lot between Rua Suécia and Rua Benevenuto Brás.

Subjects observed crouching figure ~1.6m height.
Dark brown skin, "oily." Three cranial ridges.
Large red eyes. Strong ammonia odor.
One reported "feeling its thoughts."

TIMELINE:
  13-JAN: NORAD detects anomaly over Minas Gerais
  19-JAN: Farmers report "falling star" near Varginha
  20-JAN 03:30h: Fire dept. receives creature calls
  20-JAN 08:00h: Military cordons established
  20-JAN 15:30h: Jardim Andere sighting (this report)
  20-JAN 22:00h: Hospital São Sebastião incident
```

### `journalist_payments.enc`

- **Path:** `/comms/media_ops/journalist_payments.enc`
- **Status:** `encrypted`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
[ENCRYPTED — FINANCIAL RECORDS]

Disbursement ledger detected. Shell account routing
through agricultural cooperative, Sul de Minas.
Period: JAN-FEB 1996. Five outbound transactions.

WARNING: Unauthorized access punishable under
Article 317 of the Military Penal Code.
```

_Decrypted fragment:_

```text
═══════════════════════════════════════════════════════════
DISBURSEMENT RECORD — MEDIA RELATIONS
JAN-FEB 1996 — EYES ONLY
═══════════════════════════════════════════════════════════

23-JAN — R$ 15,000 — RODRIGUES, A.
  O Diário Nacional. Story killed before typesetting.

25-JAN — R$ 8,500 — NASCIMENTO, C.
  Folha Paulista. Replaced with "homeless man" angle.

27-JAN — R$ 22,000 — [REDACTED]
  Rede Nacional TV. Segment pulled for Carnival preview.

───────────────────────────────────────────────────────────
TOTAL DISBURSED: R$ 62,500.00
───────────────────────────────────────────────────────────

═══════════════════════════════════════════════════════════
```

### `kill_story_memo.txt`

- **Path:** `/comms/media_ops/kill_story_memo.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
URGENT — MEDIA SUPPRESSION
DATE: 26-JAN-1996
FROM: Public Affairs Liaison
═══════════════════════════════════════════════════════════

Three stories in development. All must die.

1. PROGRAMA DOMINICAL (Rede Nacional)
   28-JAN, 21:00. "What the Military Hides."
   STATUS: KILL CONFIRMED. Segment replaced.

2. FOLHA PAULISTA
   29-JAN front page. Investigation piece.
   STATUS: Redirected to "homeless man" angle.

3. REVISTA ISTO
   February issue. Cover story at printer.
   STATUS: CRITICAL. Higher payment authorized.

If journalist uncooperative, refer Protocol SOMBRA.

═══════════════════════════════════════════════════════════
```

### `LEAKED_classified_records.dat`

- **Path:** `/tmp/LEAKED_classified_records.dat`
- **Status:** `unstable`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
DECOY FILE — ACCESS LOGGED

This file was planted to identify unauthorized access.

Real evidence is never labeled this obviously.
You should have known better.

Your session has been marked for review.
Countermeasures may have been deployed.
```

### `local_politics_memo.txt`

- **Path:** `/internal/misc/local_politics_memo.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
POLITICAL SUMMARY — VARGINHA MUNICIPALITY
DATE: 15-JAN-1996 — ROUTINE ASSESSMENT
═══════════════════════════════════════════════════════════

Mayor: [REDACTED], PMDB. Term: 1993-1996.
Approval: Moderate. No controversies.

Municipal elections scheduled October 1996.
Infrastructure projects on schedule.
Coffee cooperative relations stable.
Hospital expansion approved.

Security: Petty crime within normal parameters.
No organized crime. No labor unrest.

Assessment: Politically stable. No monitoring priority.

═══════════════════════════════════════════════════════════
```

### `logistics_manifest_fragment.txt`

- **Path:** `/storage/assets/logistics_manifest_fragment.txt`
- **Status:** `unstable`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
LOGISTICS MANIFEST — PARTIAL RECOVERY
DATE: 21-JAN-1996
STATUS: FRAGMENT — SECTOR DAMAGE

OUTBOUND SHIPMENTS:

  [CORRUPTED] ... Container C-7 ...
  Destination: CÓDIGO ECHO
  Weight: 45kg
  Handler: Protocol 7-ECHO authorized

  [CORRUPTED] ... Container C-12 ...
  Destination: UNKNOWN (diplomatic channel)
  Weight: 112kg
  Handler: [DATA LOSS]

Cross-reference transport_log_96.

NOTE: C-12 weight exceeds any single recovered
material sample. Contents unspecified.
Bio-rated packaging confirmed.
```

### `lost_found_jan96.txt`

- **Path:** `/internal/facilities/lost_found_jan96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
LOST AND FOUND — JANUARY 1996
Security Desk, Building Lobby

  03-JAN: Black umbrella (Floor 3 bathroom)
  07-JAN: Reading glasses, brown case
  11-JAN: Set of keys (car + house)
  14-JAN: Watch, silver, digital (cafeteria)
  19-JAN: Wallet, brown leather (Lot B)
  22-JAN: [ITEM DESCRIPTION CLASSIFIED]
  22-JAN: [ITEM DESCRIPTION CLASSIFIED]
  23-JAN: [ITEM DESCRIPTION CLASSIFIED]

Items held for 30 days, then donated.

NOTE: Items logged 22-23 JAN claimed by
Sector Command. No receipt issued.
Do not inquire. See duty_roster_jan96.txt.
```

### `lost_found_log.txt`

- **Path:** `/internal/misc/lost_found_log.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
LOST AND FOUND LOG — DETAILED
SECURITY DESK — JANUARY 1996

03-JAN | 14:30 | Black umbrella, Floor 3.
  CLAIMED 09-JAN.
07-JAN | 09:15 | Reading glasses, Conf Room B.
  UNCLAIMED.
11-JAN | 16:45 | Key ring (3 keys), Elevator.
  CLAIMED 12-JAN.
14-JAN | 12:00 | Digital watch, Cafeteria.
  UNCLAIMED.
19-JAN | 18:20 | Brown wallet, Lot B entrance.
  CLAIMED 20-JAN. Owner verified.

22-JAN | 03:00 | [RECORD SEALED]
  Override: SECTOR COMMAND
  Guard on duty (P. Rocha) placed on leave.
  Rocha described item as "not from here."
  Meaning unclear. Rocha unavailable.
```

### `maintenance_notes.txt`

- **Path:** `/internal/maintenance_notes.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
NOTAS DO ADMINISTRADOR DE SISTEMA — CONFIDENCIAL
═══════════════════════════════════════════════════════════

Manutenção concluída: 1995-12-15

Ferramentas legadas que permanecem operacionais:

1. "recover <filename>"
   Attempts restoration of corrupted or deleted files.
   Partial recovery is common. Not all data survives.

2. "trace"
   Displays active network connections and routing data.

3. "disconnect"
   Forces immediate session termination.
   WARNING: all unsaved progress will be lost.

4. "scan"
   Reveals hidden or system-level files.
   Requires administrator access.

Estas ferramentas não constam em nenhum manual oficial.

───────────────────────────────────────────────────────────
ADMINISTRADOR: J.M.S.
═══════════════════════════════════════════════════════════
```

### `maintenance_schedule.txt`

- **Path:** `/internal/admin/maintenance_schedule.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
SCHEDULED MAINTENANCE — Q1 1996
FACILITIES MANAGEMENT

JANUARY:
  08-JAN: Elevator inspection (Building A)
  15-JAN: Fire extinguisher certification
  22-JAN: Generator test — POSTPONED (incident)
  29-JAN: Pest control service — CANCELLED

FEBRUARY:
  05-FEB: Roof inspection
  12-FEB: Emergency lighting test
  19-FEB: Water tank cleaning
  26-FEB: HVAC filter replacement

NOTE: All basement-level maintenance suspended
indefinitely per Sector Command directive.
Facilities staff no longer cleared for B-3.
Related: cafeteria_feedback.txt (smell complaints)

Requests: ext. 2200 or Form F-112
```

### `material_x_analysis.dat`

- **Path:** `/storage/assets/material_x_analysis.dat`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
MATERIAL ANALYSIS — BATCH A SAMPLES
LAB: UNICAMP-AFFILIATED (UNOFFICIAL)
DATE: 28-JAN-1996

SAMPLE M-07:
  Composition: Unknown alloy. No terrestrial match.
  Conductivity: Variable under observation.
  Mass: Inconsistent between measurements.

SAMPLE M-12:
  Polymer matrix with metallic inclusions.
  Tensile strength exceeds known materials x8.
  Absorbs heat without temperature change.

CONCLUSION: Not terrestrial manufacture.
Recommend classification upgrade.

Batch B samples NOT available for analysis.
Foreign recipient declined reciprocal sharing.
They know what this is. They are not telling us.
```

### `media_contacts.txt`

- **Path:** `/comms/media_ops/media_contacts.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
COOPERATIVE MEDIA CONTACTS
UPDATED: JAN 1996 — INTERNAL USE ONLY
═══════════════════════════════════════════════════════════

TELEVISION:
  SANTOS, Eduardo — Rede Nacional, News Director
  Reliability: HIGH. Cooperative since 1989.

PRINT:
  RODRIGUES, André — O Diário Nacional, City Desk
  Reliability: HIGH. Has killed 3 stories for us.

  PEREIRA, Helena — Estado de Minas, Regional
  Reliability: HIGH. Family connection to military.

───────────────────────────────────────────────────────────
AVOID:

  Revista Fenômenos — UFO publication.
  Editor MONTEIRO hostile, cannot be controlled.
  Monitor only. Do not engage.

═══════════════════════════════════════════════════════════
```

### `media_talking_points.txt`

- **Path:** `/admin/coverup/media_talking_points.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
TALKING POINTS — ALL AUTHORIZED SPOKESPERSONS
DATE: 24-JAN-1996
═══════════════════════════════════════════════════════════

CREATURE SIGHTINGS:
  "A local homeless individual known to the area."

MILITARY ACTIVITY:
  "Routine logistical operations."

HOSPITAL:
  "Confidential medical matters. No comment."

UFOs:
  "No evidence of unidentified aerial phenomena."

COVER-UP:
  "Baseless conspiracy theories."

───────────────────────────────────────────────────────────
DO NOT: Engage with witness accounts.
DO NOT: Confirm classified information.
DO NOT: Acknowledge any "investigation."

═══════════════════════════════════════════════════════════
```

### `medical_effects_brief_77.txt`

- **Path:** `/ops/prato/archive/medical_effects_brief_77.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
MEDICAL EFFECTS BRIEF — COLARES CLINIC
DATE: 14-OCT-1977

SYMPTOMS (12 CASES):
  - Superficial burns (2-5cm diameter)
  - Localized puncture marks (sub-dermal)
  - Acute fatigue, dizziness, photophobia
  - Mild anemia in follow-up labs

Symptoms appear within 12 hours of exposure.
No infection markers. Recovery 3-5 days.

Maintain private treatment records.
Report new cases to field command only.

NOTE: Puncture geometry is identical across all
twelve cases. Spacing: 3.2mm. Depth: 1.1mm.
This is not random. This is precision.
Something was taking samples from them.
```

### `medical_examiner_query.txt`

- **Path:** `/comms/liaison/medical_examiner_query.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
QUERY — REGIONAL MEDICAL EXAMINER
DATE: 28-JAN-1996
RE: Unusual Autopsy Protocol

To whom it may concern,

Inquiring about the autopsy at our facility,
21-JAN-1996. A forensic pathologist was summoned
from a state university. His notes were sealed
before I could review them.

The subject was removed before I arrived.
No intake forms filed. No cause of death recorded.
The attending physician refuses to discuss.

Cold storage showed unusual temperature readings
for hours afterward. Far below normal parameters.

I am required to maintain complete records.
Please advise.

[RESPONSE: "File classified. Destroy this query."]
```

### `modem_log_jan96.txt`

- **Path:** `/tmp/modem_log_jan96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
MODEM CONNECTION LOG — EXTERNAL UPLINK
DEVICE: US Robotics Sportster 28.8 | 18-JAN-1996

18:42:03 ATDT 0xx-555-0147
18:42:07 CONNECT 28800/ARQ/V34/LAPM/V42BIS
18:42:15 IP assigned: 200.xxx.xxx.47

18:43:01 HTTP GET geocities.com/SiliconValley/...
18:43:47 HTTP GET altavista.digital.com/...
18:44:22 TELNET bbs.minas.com.br:23
18:46:12 IRC CONNECT irc.brasnet.org #bate-papo

<streber74> alguem viu o jogo ontem?
<mineiro99> foi roubado irmao
<streber74> kkkk sempre a mesma coisa
<nightowl> mudando de assunto, alguem tem o driver
           da soundblaster?

18:58:44 NO CARRIER
BILLING: 16 min @ R$0.85/min = R$13.60

Two days later the sky fell and the modem never
connected again. Some conversations end forever.
```

### `morse_intercept.sig`

- **Path:** `/comms/intercepts/morse_intercept.sig`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
SIGNAL INTERCEPT — AUDIO CAPTURE
DATE: 20-JAN-1996 03:47 LOCAL
CLASSIFICATION: RESTRICTED

TYPE: Morse code transmission
FREQUENCY: 7.125 MHz (unauthorized)

AUDIO: /audio/morse_intercept.wav

RAW SIGNAL:

  -.-. --- .-.. .... . .. - .-

MORSE REFERENCE:
  A: .-    H: ....   O: ---
  B: -...  I: ..     P: .--.
  C: -.-.  J: .---   R: .-.
  D: -..   K: -.-    S: ...
  E: .     L: .-..   T: -
  F: ..-.  M: --     U: ..-
  G: --.   N: -.     V: ...-

Decode may yield access passphrase.
```

### `mudinho_dossier.txt`

- **Path:** `/admin/coverup/mudinho_dossier.txt`
- **Status:** `restricted`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
COVER STORY ASSET — CODENAME "MUDINHO"
FILE: CS-96-001 — RESTRICTED
═══════════════════════════════════════════════════════════

Subject: [REDACTED], known locally as "Mudinho."
Age: ~35-40. Mentally disabled. Homeless.
Height: 1.40m. Dark skin. Crouched posture.
Non-verbal — cannot contradict narrative.

DEPLOYED NARRATIVE: "Witnesses mistook a local
  disabled man for something unusual."

ADVANTAGES: Known locally. Explains crouching.

DISADVANTAGES:
  — Skin color wrong (brown, not gray)
  — Does not explain red eyes
  — Was NOT in Jardim Andere on 20-JAN

───────────────────────────────────────────────────────────
Subject relocated to care facility 02-FEB
to prevent journalist contact.

═══════════════════════════════════════════════════════════
```

### `municipal_budget_96.txt`

- **Path:** `/internal/misc/municipal_budget_96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
MUNICIPAL BUDGET — VARGINHA PREFECTURE 1996
═══════════════════════════════════════════════════════════

Projected revenue: R$ 42,500,000.

  Education ................ 28% (R$ 11,900,000)
  Health ................... 22% (R$  9,350,000)
  Infrastructure ........... 18% (R$  7,650,000)
  Public Safety ............ 12% (R$  5,100,000)
  Administration ........... 10% (R$  4,250,000)
  Culture & Sports .........  5% (R$  2,125,000)
  Reserve ..................  5% (R$  2,125,000)

Special projects: Hospital wing expansion (Phase 2),
school renovation, Route 381 maintenance,
municipal zoo improvements.

Approved by City Council, 18-DEC-1995.

═══════════════════════════════════════════════════════════
```

### `neural_cluster_experiment.red`

- **Path:** `/comms/liaison/neural_cluster_experiment.red`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
COMMS/EXPERIMENTAL — NEURAL CLUSTER
CLASSIFICATION: RESTRICTED | REF: NC-7/OBS-RESIDUAL

Experimental attempt to construct synthetic neural
network modeled after dissected scout tissue. Objective:
emulate residual perceptual activity, not consciousness.

The cluster does not respond to dialogue. It emits
fragmented conceptual residues when stimulated.
Outputs are non-interactive, non-intentional.

Stimulation channel is undocumented and unstable.
Use not authorized outside containment review.

Dr. Santos requested the cluster be destroyed after
his third session. He said it was dreaming.
We do not have a protocol for that.
```

### `neural_cluster_memo.txt`

- **Path:** `/comms/neural_cluster_memo.txt`
- **Status:** `restricted`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem
- **Required flags:** `adminUnlocked`

```text
═══════════════════════════════════════════════════════════
MEMO: Neural Cluster Initiative
ORIGIN: Tissue sample P-45 (expired 22-JAN-1996)
FACILITY: ESA Annex — Três Corações
═══════════════════════════════════════════════════════════

A neural lattice was mapped from the dissected cranium
of specimen P-45 and replicated in silicon. Three cranial
ridges corresponded to dense synaptic structures with no
mammalian analogue. The attending pathologist noted the tissue
continued generating theta pulses 14 hours post-mortem.

The emulated cluster stores and emits memory fragments
from the recovered organism. Emissions are non-linguistic.

───────────────────────────────────────────────────────────
FRAGMENT LOG (selected)
───────────────────────────────────────────────────────────

  #0041 — Sensory impression: humid air, red earth,
          low canopy. Strong ammonia overlay. Three
          heartbeats nearby, rapid. Overwhelming fear
          (source: external). Image: adolescent faces.

  #0073 — Spatial memory: overhead trajectory, South
          Atlantic, deceleration. Radar sweep detected
          three times. Intentional descent — not crash.

  #0112 — Emotional residue: confinement, cold metal,
          fluorescent hum. Concept: "cataloguing us back."
          Chemical sting in ambient atmosphere.

  #0158 — Projection event: cluster broadcast the
          word COLHEITA across monitoring terminals
          for 0.3 seconds. No operator input logged.

───────────────────────────────────────────────────────────

Access strictly prohibited except under override protocol.

To initiate interface: echo neural_cluster

WARNING: Two technicians reported intrusive imagery
(jungle canopy, ammonia odor) for days after exposure.
Limit cluster sessions to 90 seconds.

═══════════════════════════════════════════════════════════
```

### `neural_dump_alfa.psi`

- **Path:** `/storage/quarantine/neural_dump_alfa.psi`
- **Status:** `encrypted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
[ENCRYPTED — PSI-DIVISION CLEARANCE REQUIRED]

Neural capture data from recovered specimen.
Authentication required for decryption.

Use: open neural_dump_alfa.psi
```

_Decrypted fragment:_

```text
RAW NEURAL CAPTURE — SPECIMEN ALFA
EXTRACTION DATE: 21-JAN-1996 04:17

[non-linear perception detected]
...purpose singular... observe catalog transmit...
...not-self... extension... eyes-that-are-not-eyes...

[temporal distortion]
...others of this-shape sent to many worlds...
...we are the cost of knowing...

[emotional bleed: resignation]
...they-above wait... they-above measure...
...seven billion... dense... high yield...
...window approaches... thirty rotations...

[conceptual transmission]
>>>CONCEPT: harvest is not destruction
>>>IMAGE: something watching, never moving

[signal degradation]
...we do not arrive... we do not need to...
...you are already... already...

STREAM TERMINATED — SUBJECT EXPIRED

ANALYST NOTE: Download incomplete.
Pray it was enough. Pray it was not.

— TERMINAL INTEGRATION —
ALPHA's residual brain patterns have been uploaded to this terminal.
The consciousness is indexed and queryable.
Use `link` to open a channel. Four queries before the pattern decays.
```

### `neural_fragment.dat`

- **Path:** `/admin/neural_fragment.dat`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem
- **Required flags:** `scriptExecuted`

```text
RECONSTRUCTED DATA — NEURAL FRAGMENT
RECONSTRUCTION: SUCCESSFUL

Fragment captured during final moments of
Specimen GAMMA consciousness.

[DIRECT NEURAL TRANSCRIPT]
...mission complete... transmission received...
...this form expires... acceptable...
...we are not individuals... we are function...

...the watchers do not grieve...
...the watchers do not celebrate...
...they only measure...

...your kind measures too...
...but you measure the wrong things...
...you count years... they count minds...
...you fear death...
...there are worse continuations...

ANALYST NOTE: Classified beyond normal clearance.
Implies consciousness continues after extraction.
Indefinitely. The committee decided this would
only cause harm to personnel morale.
```

### `news_archive_feb96.txt`

- **Path:** `/aftermath/news_archive_feb96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
ARCHIVED NEWS CLIPPINGS — FEBRUARY 1996

FOLHA DE SÃO PAULO — 15-FEB-1996
"MILITARY DENIES VARGINHA RUMORS"
  Air Force denied unusual activity near Varginha.
  "There was no incident. Fabrications from
  overactive imaginations."

O GLOBO — 22-FEB-1996
"ANONYMOUS DOCUMENTS SURFACE ONLINE"
  Unverified documents claiming UFO recovery
  appeared on international bulletin boards.
  Government: "obvious fakes."

ESTADO DE MINAS — 28-FEB-1996
"WITNESS RECANTS STATEMENT"
  Local woman withdrew creature testimony.
  "I was mistaken. It was just shadows."
  [She was visited by men in suits two days prior.]
```

### `non_arrival_colonization.txt`

- **Path:** `/admin/non_arrival_colonization.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem
- **Required flags:** `adminUnlocked`

```text
THEORETICAL FRAMEWORK — NON-ARRIVAL COLONIZATION
CLASSIFICATION: COSMIC — LIMITED
DATE: 05-MAR-1996

STANDARD MODEL: Species travels → displaces → occupies.

WHAT WE OBSERVE:
  Species sends scouts → measures → transmits.
  No arrival necessary. No displacement necessary.

PHASES:
  1. Reconnaissance (scouts, data)
  2. Seeding (integration organisms)
  3. Conversion (gradual modification)
  4. Extraction (resource harvest)

The colonizers never arrive. The colonized never
perceive a threat. The process is gradual,
invisible, and irreversible.

Earth: late Phase 1. Phase 2 cannot be ruled out.

[SIGNATURES: 4 of 6. Two declined — objections on file.]
```

### `note_to_self.tmp`

- **Path:** `/tmp/note_to_self.tmp`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
NOTA PESSOAL — NÃO ARQUIVAR

Lembrar:
  - Buscar roupa na lavanderia quinta
  - Ligar para mãe, aniversário
  - Perguntar IT sobre impressora Floor 2

Notas da reunião (apagar depois):
  Director was white as paper today.
  Said "special cargo" needs accommodation.
  Basement. Temperature-controlled.
  Nobody tells us anything.

  Heard Carvalho say something smelled wrong
  down there. Like ammonia and wet earth.
  He looked scared. Actually scared.
```

### `operation_prato_original.txt`

- **Path:** `/ops/prato/operation_prato_original.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
HISTORICAL REFERENCE — OPERATION PRATO
PERIOD: 1977-1978
LOCATION: Colares, Pará, Brazil

Brazilian Air Force investigation of unidentified
aerial phenomena in northern Brazil.

FINDINGS:
  - Multiple credible sightings documented
  - Physical effects on witnesses (burns)
  - "Light beams" with directed behavior
  - Non-ballistic motion patterns

OFFICIAL CONCLUSION: Inconclusive. Files sealed.

RELEVANCE: Current operation named "PRATO EXTENSION"
suggests institutional awareness of connection.
They knew this would happen again.
They have been waiting since 1977.
```

### `override_protocol_memo.txt`

- **Path:** `/internal/override_protocol_memo.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
MEMORANDUM — TERMINAL ACCESS OVERRIDE
CLASSIFICATION: INTERNAL USE ONLY

TO: All Terminal Operators
FROM: Systems Administration
DATE: December 1995

Emergency terminal override codes have been
updated for the new fiscal year.

Override allows restricted directory access when
standard authentication is unavailable.

USAGE: override <authorization_code>

CURRENT CODE:
  Project designation word. Agricultural term.
  Portuguese. Related to extraction operations.

The code references our operational codename.
Think: what do you do at harvest time?

DO NOT share with unauthorized personnel.
```

### `parallel_incidents_global.txt`

- **Path:** `/admin/parallel_incidents_global.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
REFERENCE — PARALLEL INCIDENTS (INTERNATIONAL)
COMPILED: FEBRUARY 1996
CLASSIFICATION: COMPARTMENTED

Known incidents with similar characteristics:
  1947 — United States (New Mexico)
  1961 — United States (New Hampshire)
  1967 — United Kingdom (Suffolk)
  1980 — United Kingdom (Suffolk, repeat)
  1989 — Belgium (multiple locations)
  1996 — BRAZIL (current)

COMMON ELEMENTS:
  - Material recovery
  - Biological component presence
  - Multi-national coordination
  - Public denial protocol

Pattern suggests ongoing assessment program.
Brazil now included in observation set.
We are not the first. We will not be the last.
```

### `parking_allocation_jan96.txt`

- **Path:** `/internal/facilities/parking_allocation_jan96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
PARKING ALLOCATION — JANUARY 1996
ADMINISTRATIVE SERVICES

LOT A (Reserved): A-01 to A-20.
  Directors and visiting officials.

LOT B (General): First-come. Gates close 22:00.

NOTICE: Lot B Section 3 closed from 21-JAN.
Resurfacing. Duration: 5 business days.

Lot C requisitioned for unmarked vehicle staging.
Do not approach after 20:00.

Overflow at municipal lot, 200m east.
```

### `parking_regulations.txt`

- **Path:** `/internal/misc/parking_regulations.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
PARKING LOT REGULATIONS
EFFECTIVE: 01-JAN-1996

RULES:
  1. Valid parking permit required.
  2. Speed limit: 10 km/h.
  3. No parking in fire lanes (red).
  4. Motorcycles: Lot C only.
  5. No overnight parking without authorization.

PERMITS:
  BLUE:   Directors / visiting officials
  GREEN:  Permanent staff
  YELLOW: Temporary / contractor
  RED:    Emergency vehicles only
  BLACK:  [NEW — Sector Command only]

NOTE 22-JAN: Lot C closed until further notice.
Vehicles with BLACK permits park in Lot C.
Do not photograph BLACK-permit vehicles.
Lost permits: Security, ext. 2000
```

### `patrol_observation_shift_04.txt`

- **Path:** `/ops/prato/archive/patrol_observation_shift_04.txt`
- **Status:** `restricted`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
PATROL OBSERVATION — SHIFT 04
1st AIR FORCE DETACHMENT
DATE: 05-OCT-1977

00:31 — White orb at 25-30m altitude.
00:32 — Narrow beam emitted downward.
00:33 — Beam sweeps left to right (~40° arc).
00:34 — Orb rises rapidly. Acceleration
  inconsistent with known aircraft.

SENSORS:
  - No engine noise or rotor wash
  - Compass fluctuation during beam
  - Localized ground heating on thermal scope

PHOTO: 3 frames; 2 overexposed; 1 partial.

Continue night patrols. Maintain distance.
It scanned us back. We are certain of this.
```

### `pattern_recognition.log`

- **Path:** `/tmp/pattern_recognition.log`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
SYSTEM LOG — PATTERN RECOGNITION
TIMESTAMP: [CURRENT SESSION]

Broad file sweep detected.
User has touched multiple system sectors.
Pattern: Persistent review of scattered records.

This is either an audit or an intrusion.
Either way, someone is paying attention.

Additional archives may be available.
Check /admin if access permits.
```

### `personnel_file_costa.txt`

- **Path:** `(archive) personnel_file_costa`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** archiveFiles

```text
═══════════════════════════════════════════════════════════
PERSONNEL FILE — COSTA, RICARDO MANUEL
STATUS: NON-EXISTENT (OFFICIALLY)
═══════════════════════════════════════════════════════════

Costa was removed from all databases on 01/25/1996.
Position: Senior Containment Specialist, Site 7.

INCIDENT: January 23, 1996

Assigned to overnight monitoring of BIO-B.
At 02:30, Costa's brainwaves synchronized with
subject emissions. Found unresponsive at 06:00.

Upon regaining consciousness, Costa demonstrated
knowledge of events not yet occurred — predicting
an inspection team 3 hours before notification.

Costa transferred to psychiatric evaluation.
Records sanitized. Family told "work accident."
Current status: UNKNOWN

UNOFFICIAL NOTE (handwritten):
"He keeps writing the same date over and over.
 September 4, 2026. What happens then?"

═══════════════════════════════════════════════════════════
```

### `personnel_transfer_notice.txt`

- **Path:** `/internal/personnel/personnel_transfer_notice.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
PERSONNEL TRANSFER NOTICE
EFFECTIVE: 01-FEB-1996

The following transfers are confirmed:

  CPT. R. FERREIRA → Brasília (Central Command)
  SGT. A. LIMA → São Paulo (Liaison Office)
  ANALYST M. COSTA → [DESTINATION CLASSIFIED]

Exit interviews scheduled for 30-JAN.
All three declined exit interview.
Access credentials revoked 01-FEB 00:00.

NOTE: Ferreira requested personal items be
shipped. Not collected in person.
Andrade assumes case files pending replacement.

Replacement personnel: NONE ASSIGNED.
```

### `phone_directory_96.txt`

- **Path:** `/internal/personnel/phone_directory_96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
TELEPHONE DIRECTORY — 1996

ADMINISTRATION:
  Director Office ............. ext. 2001
  Deputy Director ............. ext. 2002
  Administrative Services ..... ext. 2100

OPERATIONS:
  Ops Center (24h) ............ ext. 3000
  Field Coordination .......... ext. 3100
  Transport Pool .............. ext. 3200

SUPPORT:
  IT Helpdesk ................. ext. 4000
  Facilities .................. ext. 4100
  Medical (B-3) ............... ext. 4200
  Containment Wing ............ ext. 4500
  [RESTRICTED] ................ ext. 9999

EMERGENCY: Dial 0 for external line.
Ext. 9999 requires voice authorization.
Do not attempt without clearance.
```

### `photo_archive_register_77.txt`

- **Path:** `/ops/prato/archive/photo_archive_register_77.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
PHOTO ARCHIVE REGISTER — OPERATION PRATO
ARCHIVE: AIR FORCE COMMAND / BELÉM
DATE: 22-OCT-1977

ROLL COUNT: 146
  - 34 rolls overexposed (light saturation)
  - 21 rolls contain partial silhouettes
  - 6 rolls show beam segments on ground

Sealed in climate-controlled vault.
Access logged under Protocol 3-C.

Several frames show repeating grid-like arcs.
Analysts flagged for pattern review.

NOTE: Grid pattern matches terrain mapping
geometry used in our own aerial surveys.
We recognize systematic methodology.
Because it mirrors our own.
```

### `printer_notice.txt`

- **Path:** `/internal/admin/printer_notice.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
IT DEPARTMENT NOTICE
RE: Floor 2 Printer
DATE: 16-JAN-1996

The HP LaserJet on Floor 2 is experiencing jams.

Workaround:
  - Dot matrix printer, Room 215
  - Large jobs to Print Center (B-1)

Parts ordered. ETA: 2-3 weeks.

ADDENDUM 23-JAN:
Print Center B-1 now restricted.
All print jobs require supervisor review.
New policy, effective immediately.
No, we do not know why either.

IT Helpdesk - ext. 4000
```

### `printer_notice.txt`

- **Path:** `/internal/misc/printer_queue_notice.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
IT DEPARTMENT NOTICE
RE: Floor 2 Printer
DATE: 16-JAN-1996

The HP LaserJet on Floor 2 is experiencing jams.

Workaround:
  - Dot matrix printer, Room 215
  - Large jobs to Print Center (B-1)

Parts ordered. ETA: 2-3 weeks.

ADDENDUM 23-JAN:
Print Center B-1 now restricted.
All print jobs require supervisor review.
New policy, effective immediately.
No, we do not know why either.

IT Helpdesk - ext. 4000
```

### `project_seed_memo.txt`

- **Path:** `(archive) project_seed_memo`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** archiveFiles

```text
═══════════════════════════════════════════════════════════
MEMORANDUM — PROJECT SEED
CLASSIFICATION: ULTRA — DELETED FROM ALL SYSTEMS
DATE: JANUARY 18, 1996
═══════════════════════════════════════════════════════════

The Varginha incident invalidated all models.

The biologics demonstrate capabilities beyond
projection:

  1. Telepathic communication
  2. Knowledge of human organizational structures
  3. References to a future date (2026)

They were not surprised by capture.
They were... patient.

───────────────────────────────────────────────────────────
REVISED ASSESSMENT
───────────────────────────────────────────────────────────

We are not dealing with a crash landing.
We are dealing with a DELIVERY.

The 2026 window is a hard deadline, not an estimate.

This memo will be purged within 72hrs.
Official narrative: "crashed experimental craft."
The biologics: "unusual debris formations."

═══════════════════════════════════════════════════════════
```

### `projection_update_2026.txt`

- **Path:** `/aftermath/projection_update_2026.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
PROJECTION UPDATE — 2026 TRANSITION WINDOW
CLASSIFICATION: BEYOND TOP SECRET

The information breach of January 1996 has altered
projected outcomes for the 2026 transition window.

PREVIOUS MODEL:
  - Zero public awareness at transition
  - Population response: Panic, collapse
  - Estimated casualties: [REDACTED]

REVISED MODEL (POST-BREACH):
  - Partial awareness exists
  - Underground networks prepared
  - Coordinated response possible
  - Estimated casualties: REDUCED

The breach, while operationally damaging, may have
improved transition survival rates.
The intruder's actions may have saved lives.
This assessment is classified and will be denied.
```

### `psi_analysis_classified.txt`

- **Path:** `(archive) psi_analysis_classified`
- **Status:** `intact`  ·  **Evidence:** yes  ·  **Source:** archiveFiles

```text
PSI-COMM ANALYSIS — CLASSIFIED
ANALYST: Dr. [NAME EXPUNGED] | JAN 27, 1996

EEG arrays at 1m, 3m, 10m. At ≤3m, synchronized
theta-wave patterns matching BIO-B emissions.
At 10m, dropped to background.

KEY FINDINGS:
  1. TELEPATHIC CAPABILITY CONFIRMED. Content is
     conceptual, not linguistic. Receivers "know"
     rather than "hear."
  2. SCOUT FUNCTION CONFIRMED. Transmitted imagery
     includes topographical surveys and population
     density maps. They were CATALOGUING us.
  3. TEMPORAL REFERENCE: "thirty rotations" = 2026.
  4. NON-HOSTILE. Subjects regard capture as expected.

Suppressed 02/01/1996. Official: "No anomalous
communication detected." These are not animals.
They are scouts. They accomplished their mission
before we caught them.
```

### `psi_analysis_report.txt`

- **Path:** `/comms/psi/psi_analysis_report.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
PSI-COMMUNICATION ANALYSIS
CLASSIFICATION: COMPARTMENTED — 15-FEB-1996

Communication with specimens occurred via non-acoustic,
non-electromagnetic means. Personnel reported receiving
information without sensory input. No spoken language,
no symbols. Only synchronized neural activity, intrusive
conceptual transmission, and emotional state transfer.

Lead Operator: "I understood what it was showing me.
I cannot tell you what I understood."

CRITICAL: They do not communicate to exchange information.
They transmit. They do not expect response.
They were never designed for dialogue.

LINK ACCESS: Neural pattern preservation allows
post-mortem link. Authentication phrase derived from
psi-comm — see neural dump [conceptual transmission].

  > link
  > Enter phrase: ___________
```

### `purge_trace.sh`

- **Path:** `/tmp/purge_trace.sh`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem
- **Required flags:** `traceMonitorReviewed`

```text
#!/bin/bash
# TRACE PURGE UTIL — LEGACY NODE
# Clears trace artifacts from volatile buffers.
# Use only during active trace windows.
# They are watching. This buys you time.

echo "PURGE: Initiating trace buffer wipe..."
echo ""
echo "[OK] TRACE_QUEUE cleared"
echo "[OK] ROUTE_TABLE scrubbed"
echo "[OK] SESSION_LOG truncated"
echo ""
echo "NOTICE: Countermeasures reset. Expect re-scan."

# INSTRUCTIONS: Execute with: run purge_trace.sh
# You will not get a second chance.
```

### `railroad_schedule_jan96.txt`

- **Path:** `/internal/misc/railroad_schedule_jan96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
RAILROAD TRAFFIC — VARGINHA STATION
JANUARY 1996
═══════════════════════════════════════════════════════════

REGULAR SERVICE:
  Mon-Fri 06:00 — Coffee cargo (southbound)
  Mon-Fri 14:00 — Industrial goods (northbound)
  Tue-Thu 22:00 — Overnight freight

───────────────────────────────────────────────────────────
SPECIAL MOVEMENTS:

  20-JAN 03:30 — 3 covered freight cars.
    Destination: Campinas. Military authorization.

  21-JAN 01:15 — 1 refrigerated car.
    Destination: São Paulo. Military authorization.

───────────────────────────────────────────────────────────
Military movements not subject to standard
scheduling protocols.

═══════════════════════════════════════════════════════════
```

### `recantation_001.txt`

- **Path:** `/ops/mib/recantation_forms/recantation_001.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
WITNESS STATEMENT CORRECTION
FORM W-9 (VOLUNTARY RECANTATION)
═══════════════════════════════════════════════════════════

I, [WITNESS-1], of sound mind, hereby state:

On January 20, 1996, I reported seeing an unusual
figure in Jardim Andere, Varginha.

I now acknowledge that I was MISTAKEN.

What I saw was a homeless individual, possibly
intoxicated. The unusual appearance was due to
poor lighting and my own state of fear.

I will not speak to journalists about this matter.
I will not participate in media interviews.

This statement is given freely and voluntarily.

───────────────────────────────────────────────────────────
Signature: [SIGNED]
Date: 23-JAN-1996
Witness: [REDACTED], Federal Agent

═══════════════════════════════════════════════════════════
```

### `redaction_keycard.txt`

- **Path:** `/internal/redaction_keycard.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
REDACTION OVERRIDE CARD — INDEX 3
DATE: 18-JAN-1996

CLEARANCE STRING:
  "PHASE TWO IS ALREADY UNDERWAY"

Verify against redacted memos for completion checks.

Whoever left this card here wanted it found.
That should concern you more than its contents.
```

### `redaction_override_memo.txt`

- **Path:** `/admin/redaction_override_memo.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
ADMIN MEMO — REDACTION PATCH
CLASSIFICATION: RESTRICTED — 19-JAN-1996

CORRECTED LINE:
  PHASE ███ IS ██████ UNDERWAY

Do not store the full line in unsecured systems.
The redaction exists for a reason. What lies
beneath it is not for every clearance level.
Some truths are distributed in fragments.
```

### `regional_summary_jan96.txt`

- **Path:** `/comms/intercepts/regional_summary_jan96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
REGIONAL INTELLIGENCE SUMMARY — JAN 1996
SECTOR: Triângulo Mineiro

PRIORITY ITEMS: NONE (see addendum)

ROUTINE MONITORING:
  - Labor activity: Normal seasonal levels
  - Agriculture: Soy prices stable
  - Border crossings: Within parameters

ANOMALIES:
  17-JAN: Unauthorized radio near Uberaba.
    Assessment: Amateur operator. Warning issued.
  19-JAN: Unscheduled cargo, regional depot.
    Assessment: Paperwork error. Corrected.
  20-JAN: Multiple civilian reports of aerial
    phenomena south of Varginha.
    Assessment: Weather balloon.
    [Assessment overridden by Sector Command]

No items require escalation.
```

### `retrospective_scan_assessment.red`

- **Path:** `/ops/prato/archive/retrospective_scan_assessment.red`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
RETROSPECTIVE ASSESSMENT — PRATO ANOMALY SET
CLASSIFICATION: RED
DATE: 12-FEB-1996

1977 incidents show consistent scan geometry:
repeating altitude bands, lateral sweep arcs,
short-duration beam contact without pursuit.

INTERPRETATION:
  Behaviors align with survey, not attack.
  Patterns resemble grid sampling and mapping.

INFERENCE:
  Luminous sources: autonomous scan platforms.
  Activity indicates Watcher reconnaissance
  predating the 1996 Varginha recovery.

Current incident is continuation, not first contact.
They have been watching us for decades.

CONFIDENCE: MODERATE
```

### `satellite_light_reflection_trials.txt`

- **Path:** `/internal/misc/satellite_light_reflection_trials.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
PROJECT NIGHTLIGHT — FEASIBILITY ASSESSMENT
CLASSIFICATION: SENSITIVE
DATE: 22-NOV-1995
═══════════════════════════════════════════════════════════

OBJECTIVE:

  Evaluate deployment of orbital reflective arrays for
  urban illumination and psychological operations.

TECHNICAL SUMMARY:

  - Mylar reflector panels: 500m² deployed area
  - Orbital altitude: 400km (ISS equivalent)
  - Ground illumination: ~10% full moon equivalent
  - Targeting precision: 50km radius spotlight

TEST RESULTS:

  Trial 1 (Pacific): Successful reflection achieved.
                     No civilian reports recorded.

  Trial 2 (Atlantic): Partial success. Reflector
                      deployment malfunction.

  Trial 3 (Continental): Successful. 4 civilian
                         reports attributed to
                         "atmospheric phenomena."

APPLICATIONS:

  1. Emergency illumination during disasters
  2. Agricultural growing season extension
  3. Urban crime reduction via night visibility
  4. [CLASSIFIED] psychological operations capability

CONCERNS:

  - Astronomical community interference likely
  - Religious/cultural reactions unpredictable
  - Light pollution effects unknown

RECOMMENDATION:

  Continue covert testing. Full deployment contingent
  on cover story development and international
  notification protocols.

═══════════════════════════════════════════════════════════
```

### `save_evidence.sh`

- **Path:** `/tmp/save_evidence.sh`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
#!/bin/bash
# EMERGENCY BACKUP SCRIPT — Created by UFO74
# If you are reading this, the evidence matters.
# Save it before they cut the connection.

echo "Initiating emergency backup..."
echo ""

# Preserve what we found
for evidence in /collected/*.dat; do
    cp "$evidence" /external/backup/
    echo "[OK] $(basename $evidence) saved"
done

echo ""
echo "Backup complete. Evidence persisted."
echo "WARNING: Disconnection imminent..."

# INSTRUCTIONS: Execute with: run save_evidence.sh
# The truth does not save itself.
```

### `scout_variants.meta`

- **Path:** `/ops/exo/scout_variants.meta`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
THEORETICAL FRAMEWORK — SCOUT VARIANTS
CLASSIFICATION: EYES ONLY

Recovered subjects are purpose-built constructs.

Evidence:
  - Engineered for Earth-specific conditions
  - Limited lifespan (hours to days)
  - High neural plasticity for rapid learning
  - No autonomous decision-making capability

DESIGNATION: "Scouts"
FUNCTION: Reconnaissance and measurement
RELATIONSHIP: Subordinate to origin

Scouts are tools, not representatives.
Decision-makers remain at origin.
Origin has NOT been contacted.

We captured their instruments.
We have not met the scientists.
```

### `second_deployment.sig`

- **Path:** `/admin/second_deployment.sig`
- **Status:** `encrypted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem
- **Required flags:** `adminUnlocked`

```text
[ENCRYPTED — ULTRA CLASSIFICATION]

Intercepted signal data. Authentication required.

Use: open second_deployment.sig
```

_Decrypted fragment:_

```text
INTERCEPTED SIGNAL — PRIORITY ULTRA
INTERCEPT DATE: 03-MAR-1996 | ORIGIN: EXTRASOLAR

Transmission detected six weeks post-incident.
Source triangulation: beyond solar system boundary.

>>RECEIPT: Scout telemetry confirmed
>>STATUS: Target world catalogued
>>ASSESSMENT: High cognitive density — OPTIMAL yield
>>ASSESSMENT: Resistance threshold — NEGLIGIBLE
>>DECISION: Proceed to Phase 2
>>DEPLOYMENT: Second-generation integration assets
>>TIMELINE: Alignment window (local: 2026)
>>METHOD: Indirect biological seeding
>>NOTE: Arrival unnecessary
>>NOTE: Local biology serves as intermediary

ANALYST NOTE: The scouts completed their mission.
A response has been sent. They are not coming.
Something else is.

[SEE ATTACHED SIGNAL VISUALIZATION]
```

### `session_objectives.txt`

- **Path:** `/internal/protocols/session_objectives.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
TERMINAL ACCESS — SESSION PARAMETERS
AUTO-GENERATED AT LOGIN

ACCESS TYPE: Review Terminal (Legacy Archive)
SESSION CLASS: Incident Reconstruction

This terminal provides read-only access to archived
incident records. Session activity is logged.

WORKFLOW:
  1. Navigate directories for relevant records
  2. Examine files for incident details
  3. Follow prompted passphrases on protected files when authorized
  4. Cross-reference sources for correlation

Random file access without correlation may trigger
session monitoring as anomalous behavior.
```

### `session_residue.log`

- **Path:** `/tmp/session_residue.log`
- **Status:** `conditional`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
SESSION RESIDUE — AUTOMATED LOG

Multiple evidence file accesses detected.
Review pattern: deliberate collection.

Cache contains enough material for leak attempt.

CONCLUSION: Session risk elevated.
Export behavior expected.

Someone is assembling the picture.
We should have purged this terminal.
```

### `signal_analysis_partial.txt`

- **Path:** `/ops/exo/signal_analysis_partial.txt`
- **Status:** `unstable`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
SIGNAL ANALYSIS — PRELIMINARY
EQUIPMENT: Modified EEG Array
DATE: 20-JAN-1996 (during containment)

READINGS FROM SUBJECT BETA (pre-expiration):

  04:30 — Background noise only
  04:45 — Unusual pattern detected
  05:00 — Pattern intensifies. Equipment overload.
  05:15 — Vitals declining. Pattern peaks.
  05:18 — Transmission burst. Duration: 0.3s
  05:20 — Subject expires. Pattern ceases.

Burst at 05:18 measured at frequencies our
equipment cannot properly quantify.
It was not random. It had structure.
Something received it. We are certain of this.

Recommend consultation with transcript_core.enc.
```

### `SMOKING_GUN_proof.txt`

- **Path:** `/tmp/SMOKING_GUN_proof.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
HONEYPOT TRIGGERED

Intelligence agencies do not label files
"SMOKING GUN."

This file exists to catch intruders who lack
the discretion to recognize obvious bait.

Your impatience has been noted.
The real evidence is quieter than this.
```

### `specimen_purpose_analysis.txt`

- **Path:** `/storage/quarantine/specimen_purpose_analysis.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
SPECIMEN FUNCTION AND PURPOSE ANALYSIS
CLASSIFICATION: RESTRICTED — 22-FEB-1996

CONCLUSION: The recovered entities are tools, not envoys.

Anatomical evidence shows deliberate engineering:
sensory organs optimized for observation, neural density
exceeding body requirements, simplified digestive system.
No immune response. No reproductive capability.

Reconnaissance units. Purpose-built. Never meant
to survive or represent their creators.

IMPLICATION: If Earth received scouts, it passed screening.
If scouts transmitted, we have been catalogued.
Something now knows what we are and what we are worth.

[SIGNATURE REDACTED]
```

### `standing_orders_multinational.txt`

- **Path:** `/comms/liaison/standing_orders_multinational.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
STANDING ORDERS — MULTINATIONAL RECOVERY
CLASSIFICATION: COSMIC — NEED TO KNOW
EFFECTIVE: 01-JAN-1989 (UPDATED ANNUALLY)

PARTICIPATING NATIONS:
  - United States (Coordinating Authority)
  - United Kingdom
  - France
  - Israel
  - Brazil (Regional Authority, South America)
  - Russia (Observer, post-1991)

TRIGGER: Profile DELTA incidents.
Non-conventional phenomena, unknown biologicals,
anomalous materials.

RESPONSE:
  1. Regional Authority establishes perimeter
  2. Coordinating Authority notified <2 hours
  3. Multinational team deployed <24 hours
  4. Material divided per Appendix C

All nations maintain synchronized cover narratives.
Annual coordination: Davos, Switzerland.

ADDENDUM (1995): Disclosure deferred until
after WINDOW closes. Target: post-2026.
```

### `supplies_request_jan96.txt`

- **Path:** `/internal/admin/supplies_request_jan96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
SUPPLIES REQUEST — JANUARY 1996
DEPT: Records & Archives

  - Pens, ballpoint, blue (box of 50)
  - Paper, A4, 80gsm (10 reams)
  - Staples, standard (5 boxes)
  - Folders, manila (100 units)
  - Correction fluid (12 bottles)
  - Black markers, permanent (24 units)

JUSTIFICATION: Standard quarterly replenishment.
Black markers for redaction per new directive.

APPROVED: M. SANTOS

Handwritten margin note:
"We never used this much correction fluid
before. What are they rewriting?" —unsigned
See also: badge_renewal_memo.txt (ULTRAVIOLET tier)
```

### `supplies_request_jan96.txt`

- **Path:** `/internal/misc/office_supplies.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
SUPPLIES REQUEST — JANUARY 1996
DEPT: Records & Archives

  - Pens, ballpoint, blue (box of 50)
  - Paper, A4, 80gsm (10 reams)
  - Staples, standard (5 boxes)
  - Folders, manila (100 units)
  - Correction fluid (12 bottles)
  - Black markers, permanent (24 units)

JUSTIFICATION: Standard quarterly replenishment.
Black markers for redaction per new directive.

APPROVED: M. SANTOS

Handwritten margin note:
"We never used this much correction fluid
before. What are they rewriting?" —unsigned
See also: badge_renewal_memo.txt (ULTRAVIOLET tier)
```

### `surveillance_recovery.vid`

- **Path:** `/storage/quarantine/surveillance_recovery.vid`
- **Status:** `unstable`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
RECOVERED VIDEO DATA — PARTIAL
SOURCE: CONTAINMENT FACILITY B — CAM 07
DATE: 1996-01-20 03:47:22

STATUS: Partial frame recovery. Integrity: 47%.
Significant temporal corruption detected.

Surveillance footage from containment observation
chamber. Subject displays anomalous movement patterns.
Audio track corrupted beyond recovery.

WARNING: Visual content may cause disorientation.
Three technicians reported nausea after reviewing
recovered frames. One refused to return to duty.
She said the subject was looking at the camera.
The camera was behind a two-way mirror.
```

### `terminology_guide.txt`

- **Path:** `/internal/sanitized/terminology_guide.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
APPROVED TERMINOLOGY REFERENCE
FOR: All personnel handling sensitive documentation

Use of direct language is prohibited in auditable records.

APPROVED TERMS:
  "Weather balloon"     = Standard cover designation
  "Fauna specimen"      = Recovered biological material
  "Wild animal"         = Unclassified biological subject
  "Agricultural equip." = Recovered hardware
  "Special cargo"       = Classified shipment
  "The visitors"        = Foreign delegation
  "Assets"              = Recovered items (any type)
  "Samples"             = Collected material
  "Transport issues"    = Deterioration during transfer

All documentation must maintain plausible deniability
under Congressional review.

We built an entire vocabulary to avoid saying
what we all saw. The language works. The forgetting
does not.
```

### `thirty_year_cycle.txt`

- **Path:** `/admin/thirty_year_cycle.txt`
- **Status:** `restricted`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
ANALYSIS — THIRTY-YEAR CYCLE HYPOTHESIS
THEORETICAL FRAMEWORK

Recovered psi-comm fragments reference
"thirty rotations." Correlates with spacing:

  1947 → 1977 = 30 years (PRATO follows)
  1977 → 2007 = 30 years (predicted)
  1996 → 2026 = 30 years (in transcripts)

HYPOTHESIS:
  Assessment cycles at 30-year intervals.
  Each cycle refines observational model.
  2026 may represent cycle completion.

ALTERNATIVE:
  "Rotations" may not mean Earth years.
  Assumes terrestrial frame of reference.

CONFIDENCE: LOW
But the arithmetic is terrifying.
```

### `threat_window.red`

- **Path:** `/admin/threat_window.red`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
THREAT ASSESSMENT — TRANSITION WINDOW
CLASSIFICATION: RED
DATE: 02-MAR-1996

TIMELINE:
  "Thirty rotations" = 30 orbital cycles
  Base year: 1996. Target: 2026.

NATURE: UNKNOWN

Possibilities debated:
  - Secondary deployment, integration organisms
  - Transition from reconnaissance to active phase
  - Communication or activation signal
  - Initiation of energy extraction

None confirmed. All consistent with data.

POSTURE:
  Maintain observation through 2026.
  Monitor for anomalous signals.
  Prepare contingency frameworks.

This is not a prediction. It is a detected
reference in recovered neural fragments.
We cannot pretend it does not exist.
```

### `trace_purge_memo.txt`

- **Path:** `/admin/trace_purge_memo.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem
- **Required flags:** `tracePurgeUsed`

```text
SECURITY LOG — TRACE PURGE EVENT
TIMESTAMP: [CURRENT SESSION]

Legacy purge utility executed during active trace.
Buffer integrity reset. Trace window re-opened.

Operator demonstrated knowledge of internal tooling.
Session classified as HIGH PRIORITY.

Assessment: This operator understands infrastructure
that was never documented in training materials.
Either they have inside knowledge, or they are
more resourceful than anticipated.

Recommendation: Maintain surveillance. Do not terminate.
Let them find what they are looking for.
We need to know who sent them.
```

### `training_q1_96.txt`

- **Path:** `/internal/personnel/training_q1_96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
TRAINING SCHEDULE — Q1 1996
HUMAN RESOURCES

MANDATORY:
  15-JAN: Fire Safety Refresher (All staff)
  22-JAN: Information Security (New hires)
  05-FEB: First Aid Certification (Wardens)
  12-FEB: Document Handling (Archives)

OPTIONAL:
  29-JAN: Word Processing Tips (Room 204)
  08-FEB: Stress Management (Auditorium)

ADDED 23-JAN (MANDATORY):
  Biological Hazard Awareness — all basement
  personnel. Non-negotiable. Bring dosimeter.
  Ref: incident_report_1996_01_VG.txt

Registration: HR ext. 2300

No questions regarding the new module.
```

### `transcript_core.enc`

- **Path:** `/comms/psi/transcript_core.enc`
- **Status:** `encrypted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
[ENCRYPTED - DECRYPTION REQUIRED]
```

_Decrypted fragment:_

```text
PSI-COMM TRANSCRIPT — PARTIAL RECOVERY
SOURCE: Subject BETA (pre-expiration)
METHOD: EEG + computational reconstruction

[FRAGMENT 1]
  ...observation complete...
  ...viable assessment confirmed...
  ...transmission interrupted...

[FRAGMENT 2]
  ...energy density acceptable...
  ...cognitive activity measured...
  ...extraction model viable...

[FRAGMENT 3]
  ...we are not the arrivers...
  ...we are the measuring...
  ...others will come...

Signal strength suggests transmission reached
destination before subject expiration.
```

### `transcript_limit.enc`

- **Path:** `/comms/psi/transcript_limit.enc`
- **Status:** `encrypted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
[ENCRYPTED - DECRYPTION REQUIRED]
```

_Decrypted fragment:_

```text
PSI-COMM TRANSCRIPT — SECONDARY
SOURCE: Subject GAMMA
DATE: 22-JAN-1996

[RECOVERED SEQUENCE]
  ...thirty rotations...
  ...alignment window...
  ...convergence cycle...

"Thirty rotations" = 30 Earth years.
Base date: 1996. Projected window: 2026.

SIGNIFICANCE: UNKNOWN
RECOMMENDATION: MONITOR
```

### `transfer_authorization.txt`

- **Path:** `/internal/personnel/transfer_authorization.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
AUTORIZAÇÃO DE TRANSFERÊNCIA DE PESSOAL
DOCUMENTO: PTA-1996-0120
═══════════════════════════════════════════════════════════

ORIGEM: Base Aérea de Guarulhos
DESTINO: [SUPRIMIDO]

EFETIVO:
  2º Ten. C.E.F.
  Classificação: ANALISTA
  Nível de Acesso: RESTRITO → CLASSIFICADO

JUSTIFICATIVA:
  Aptidão excepcional demonstrada durante
  processamento de incidente. Designado para
  projetos especiais com efeito imediato.

CÓDIGO DE AUTORIZAÇÃO: varginha1996

APROVADO POR: Cel. [SUPRIMIDO]
  Divisão de Operações Especiais

───────────────────────────────────────────────────────────
Este código pode ser necessário para acesso a arquivos.
═══════════════════════════════════════════════════════════
```

### `transfer_manifest_deleted.txt`

- **Path:** `(archive) transfer_manifest_deleted`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** archiveFiles

```text
═══════════════════════════════════════════════════════════
ASSET TRANSFER MANIFEST — DELETED COPY
DATE: JANUARY 25, 1996
RECONSTRUCTED FROM SECTOR DUMP
═══════════════════════════════════════════════════════════

OPERATION: COLHEITA (HARVEST)
ORIGIN: Varginha MG
DESTINATION: ESA Campinas — Hangar 4

───────────────────────────────────────────────────────────
CARGO INVENTORY
───────────────────────────────────────────────────────────

  ITEM 001: Hull fragment, alloy unknown — 47kg
            Resists all cutting tools.

  ITEM 002: Navigation array — 12kg
            Still emitting low-frequency signal.

  ITEM 003: Propulsion debris — 89kg total
            Fragments reassemble in proximity.

  ITEM 004: Interior paneling — organic-metallic hybrid.

  ITEM 005: Soil samples — elevated isotope ratios.

───────────────────────────────────────────────────────────

  Route: Varginha → Campinas (overnight, no stops)
  Convoy: 3 trucks, unmarked. No insignia.

  Manifest ordered destroyed 01/28/1996.
  No official record of this transfer exists.

═══════════════════════════════════════════════════════════
```

### `transport_log_96.txt`

- **Path:** `/storage/assets/transport_log_96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
TRANSPORT LOG — OPERATION PRATO EXTENSION
DATE: 20 to 23-JAN-1996
CLASSIFICATION: OPERACIONAL

20-JAN 03:42 — Dispatched to Site ALFA
20-JAN 04:15 — Material secured. Weight: 340kg
20-JAN 04:58 — Transport to HOLDING-7 initiated

21-JAN 01:20 — Secondary recovery, Site BETA
21-JAN 02:45 — 12 distinct fragments catalogued
21-JAN 03:30 — Material divided for redundancy
21-JAN 04:00 — Batch A → HOLDING-7
21-JAN 04:00 — Batch B → [REDACTED] diplomatic pouch

22-JAN — Transfer complete. Custody sealed.
23-JAN 11:00 — HOLDING-7 inventory reconciled
23-JAN 11:30 — Batch B confirmation pending

Foreign transfer: Protocol 7-ECHO.
Recipient nation not logged in this system.
```

### `trust_protocol_1993.txt`

- **Path:** `/internal/protocols/trust_protocol_1993.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
OPERATIONAL SECURITY MEMORANDUM — OSM-1993-X
FROM: The Director, Special Projects
DATE: 13-OCT-1993

In light of recent security concerns, effective
immediately: SHARE NOTHING BEYOND YOUR SCOPE.

Information regarding ongoing projects is to be shared
on strict need-to-know basis. Even colleagues with
appropriate clearance should not receive details beyond
their assigned scope.

Full operational awareness is distributed across
departments and archives. This is by design.

Those requiring broader context must submit Form OSM-7
through their division chief.

ADDENDUM (handwritten):
  "Quem sabe demais, carrega peso demais."
  (Who knows too much carries too much weight.)
```

### `tv_coverage_report.txt`

- **Path:** `/comms/media_ops/tv_coverage_report.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
INTELLIGENCE REPORT — TV COVERAGE THREAT
DATE: 25-JAN-1996 — PRIORITY: HIGH
═══════════════════════════════════════════════════════════

Programa Dominical. Rede Nacional.
Audience: 40+ million. Slot: 21:00, Sunday 28-JAN.

Production crew dispatched to Varginha 24-JAN.
Material obtained:
  — Interviews with the three sisters
  — Military vehicle footage (unverified)
  — Hospital security guard statement
  — Civilian ufologist commentary

DAMAGE POTENTIAL: SEVERE.
Nationwide exposure. International pickup guaranteed.

ACTION: Contact news director SANTOS.
Invoke national security. Offer Carnival substitute.

═══════════════════════════════════════════════════════════
```

### `ufo74_last_signal.log`

- **Path:** `/aftermath/ufo74_last_signal.log`
- **Status:** `unstable`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
SIGNAL INTERCEPT — UNVERIFIED
TIMESTAMP: 15-MAR-1996 03:47:22 UTC

[FRAGMENTARY — RECONSTRUCTED]

...made it across the border...
...they came to the apartment but...
...different identity now...

...the hackerkid did it...
...files are everywhere now...
...cant put the toothpaste back...

...they think im dead...
...let them think that...

...2026. ill be watching...
...we all will...

[SIGNAL LOST]

ANALYSIS: Origin untraceable. Possibly fabricated.
Subject status: UNKNOWN
```

### `URGENT_classified_alpha.txt`

- **Path:** `/tmp/URGENT_classified_alpha.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
SECURITY ALERT — INTRUSION DETECTED

This file is a HONEYPOT.

Your terminal ID has been logged.
Your access pattern has been flagged.
Security personnel have been notified.

Real intelligence is never labeled URGENT.
That was your first mistake.

REMAIN AT YOUR TERMINAL.
```

### `vacation_calendar.txt`

- **Path:** `/internal/personnel/vacation_calendar.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
VACATION SCHEDULE — Q1 1996
HUMAN RESOURCES

JANUARY:
  OLIVEIRA, P. ........... 02 to 12-JAN
  SANTOS, M. ............. 08 to 15-JAN
  RIBEIRO, J.S. .......... 15 to 26-JAN
  NASCIMENTO, R. ......... [CANCELLED — INCIDENT]

FEBRUARY:
  COSTA, L. .............. 05 to 16-FEB
  FERREIRA, R. ........... [CANCELLED — TRANSFER]
  LIMA, A. ............... [CANCELLED — TRANSFER]
  CARVALHO, M. ........... [CANCELLED — MEDICAL]

ALL MARCH VACATIONS SUSPENDED.
Directive from Sector Command.
Reason: "Operational requirements."

Questions: HR Office, ext. 2050
```

### `vehicle_log_jan96.txt`

- **Path:** `/internal/misc/vehicle_log_jan96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
VEHICLE MILEAGE LOG — JANUARY 1996
POOL: GOL 1.0 (Plate: AAB-1234)

DATE       DRIVER        START    END      DEST
02-JAN    SILVA, R.     45,230   45,248   City center
05-JAN    COSTA, M.     45,248   45,312   Airport
09-JAN    LIMA, A.      45,312   45,340   Regional ofc
15-JAN    SANTOS, P.    45,340   45,356   Supplier
19-JAN    [CLASSIFIED]  45,356   45,498   [CLASSIFIED]
20-JAN    [CLASSIFIED]  45,498   45,512   [CLASSIFIED]
21-JAN    [CLASSIFIED]  45,512   45,687   [CLASSIFIED]
23-JAN    COSTA, M.     45,687   45,720   Airport

NOTE: 175km in one classified trip (19-JAN).
Vehicle returned with interior staining.
Cleaning order: PRIORITY / NO EXTERNAL VENDOR.
Cross-ref: transport_log_96.txt
```

### `veterinarian_silencing.txt`

- **Path:** `/ops/zoo/veterinarian_silencing.txt`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
CONTAINMENT — ZOO VETERINARIAN
DATE: 30-JAN-1996 — RESTRICTED
═══════════════════════════════════════════════════════════

Subject: Dr. Ana FERREIRA. Threat level: MODERATE.
Connected animal deaths to classified incident.
Documented anomalous necropsy findings.

25-JAN: Initial contact (Protocol SOMBRA).
  PARTIALLY COOPERATIVE.

28-JAN: Necropsy samples CONFISCATED.
  Cover: "Public health directive."

29-JAN: Administrative pressure. Extended leave.

30-JAN: COBRA visit. 2 hours.
  FULLY COOPERATIVE. Signed NDA.
  Deaths attributed to "contaminated feed."

───────────────────────────────────────────────────────────
Husband works at state university.
Employment pressure available if needed.

═══════════════════════════════════════════════════════════
```

### `visitor_briefing.txt`

- **Path:** `/internal/sanitized/visitor_briefing.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
SECURITY BRIEFING — VISITING DELEGATION
DATE: 24-JAN-1996 | CLASSIFICATION: INTERNAL

The visitors arrive via private aircraft.
Full access granted to Facilities 1-3.
Escort required at all times. No photography.

Delegation interests:
  - Review of recently recovered equipment
  - Assessment of storage conditions
  - Coordination on future monitoring

Accompanied by their own technical team.
Our role: observation and cooperation only.

Standard plausible deniability protocols remain.
All documentation uses approved terminology.
No direct references. Questions to Protocol Office.

They called them "visitors." The word was chosen
carefully. It could mean anyone.
```

### `weather_balloon_memo.txt`

- **Path:** `/admin/weather_balloon_memo.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
MEMORANDUM — PUBLIC AFFAIRS
DATE: 22-JAN-1996
RE: Media Inquiry Response

APPROVED STATEMENT:
  "The object recovered near Varginha on January 20
   has been identified as a weather balloon from the
   National Meteorological Institute. Unusual sightings
   were caused by reflected instrumentation light."

INTERNAL (DO NOT RELEASE):
  Statement is for public consumption only.
  Actual findings classified.
  See PROJECT HARVEST files for details.

Weather service has been instructed to confirm.
They are... uncomfortable with this arrangement.

APPROVED BY: DIR. COMMUNICATIONS
```

### `weather_pattern_intervention.log`

- **Path:** `/internal/misc/weather_pattern_intervention.log`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
PROJECT CIRRUS — OPERATIONAL LOG
CLASSIFICATION: SENSITIVE
PERIOD: OCT 1995 - JAN 1996
═══════════════════════════════════════════════════════════

12-OCT-1995 0600
  Aerosol dispersal flight ALT-1174 completed.
  Payload: 4.2 metric tons barium sulfate compound
  Target: Atlantic hurricane formation zone
  Altitude: 38,000 ft
  Duration: 6.4 hours

15-OCT-1995 1400
  Post-dispersal analysis indicates successful seeding.
  Projected storm TD-17 failed to organize.
  NOTE: Unintended precipitation in [REDACTED] region.

23-NOV-1995 0800
  Flight ALT-1198 encountered mechanical issues.
  Payload released early over continental area.
  INCIDENT REPORT FILED. Cover story: contrail testing.

07-DEC-1995 1100
  Side effect observation: Increased respiratory
  complaints in dispersal corridor populations.
  Recommend adjusting compound mixture for Q1 1996.

14-JAN-1996 0900
  New directive received: Expand program to include
  reflective particulate testing for solar management.
  Aluminum oxide compounds approved for trial.

───────────────────────────────────────────────────────────
END LOG — NEXT REVIEW: 01-APR-1996
═══════════════════════════════════════════════════════════
```

### `weather_report_jan96.txt`

- **Path:** `/internal/misc/weather_report_jan96.txt`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
METEOROLOGICAL SUMMARY — JANUARY 1996
STATION: Varginha Regional (21°33'S, 45°26'W)
═══════════════════════════════════════════════════════════

Standard summer patterns for Sul de Minas.

19-JAN: 28°C max, 18°C min. 12mm rain.
  Clear sky after 22:00.

20-JAN: 31°C max, 19°C min. 0mm precipitation.
  Cloud cover: 15%. Wind: calm.
  Excellent visibility all day and night.

21-JAN: 29°C max, 17°C min. 8mm evening rain.

No unusual atmospheric phenomena recorded.

═══════════════════════════════════════════════════════════
```

### `window_alignment.meta`

- **Path:** `/admin/window_alignment.meta`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
TEMPORAL ANALYSIS — WINDOW ALIGNMENT
METHOD: Signal Pattern Reconstruction

Recurring temporal references in psi-comm:
  "thirty rotations" (freq: 3)
  "alignment" (freq: 2)
  "convergence" (freq: 1)
  "window" (freq: 2)

ASTRONOMICAL CORRELATION (2026):
  - Unusual planetary alignments
  - Solar activity: elevated projections
  - [INSUFFICIENT DATA]

CONFIDENCE: MODERATE

Establish monitoring for 2026.
Nature of expected event: UNKNOWN.

The frequency of "thirty rotations" across
independent specimen extractions is difficult
to dismiss as coincidence.
```

### `window_clarification.red`

- **Path:** `/admin/window_clarification.red`
- **Status:** `restricted`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
MEMORANDUM — CLARIFICATION OF 2026 REFERENCE
CLASSIFICATION: RED — 01-APR-1996

TO ALL CLEARED PERSONNEL:

Several colleagues interpret recovered transmissions
as predicting an invasion in 2026. It was wrong.

2026 is NOT an invasion date or event.

2026 IS a transition window:
  - End of reconnaissance phase
  - Activation of indirect systems
  - Point beyond which intervention becomes impossible

Nothing arrives. Something changes.
2026 is when it becomes irreversible.

There is no defense protocol. No countermeasure.
No adversary to engage.

Ministry was informed. Their only response was to
reclassify this memo to RED.

[SIGNATURE REDACTED]
```

### `witness_farm_recording.txt`

- **Path:** `/internal/witness_farm_recording.txt`
- **Status:** `intact`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
CIVILIAN TESTIMONY — AUDIO TRANSCRIPTION
SOURCE: VHS camcorder recording, rural property
LOCATION: Fazenda São Tomé, 12km NE of Varginha
DATE: 19-JAN-1996, ~22:40h
WITNESS: Eurico da Silva, 58, cattle farmer

TRANSCRIPTION BEGINS:

[camera noise, heavy breathing]

"Is it recording? It is recording. Look... look there."
"I saw the light fall. Thought it was a shooting star."
"All the cattle ran to the back of the pasture."
"I went with the flashlight to see what it was."

[camera pans to dark treeline, faint red glow visible]

"There's... there's something crouched in the middle."
"It's not an animal. Not a person. I know what people are."
"The smell... my God, the smell."
"Like ammonia. Burns the nose."

[VHS tracking distortion — 8 seconds]

"It looked at me. The eyes are red."
"Doesn't blink. Doesn't move. Just... watches."
"I felt something in my head. Pressure."
"Like someone squeezing from the inside."

[subject audibly retreating, footsteps on dry grass]

"I ran back. Locked everything."
"In the morning I went to look. There was only burned ground."
"Perfect circle. The grass was black."
"Two hours later the military arrived."
"They took the tape. But I had made a copy."

TRANSCRIPTION ENDS

ANALYST NOTE:
  VHS recovered from witness home during sweep.
  Copy was found hidden inside a Bible.
  Witness detained 72h under Protocol 7.
  Description consistent with Jardim Andere specimens.
  Ammonia trace confirmed on-site.
  Electromagnetic scarring on soil: match.
  Witness claims "it knew I was there before I saw it."

  This is the only known civilian recording.
  Recommend PERMANENT CLASSIFICATION.
```

### `witness_statement_original.txt`

- **Path:** `(archive) witness_statement_original`
- **Status:** `intact`  ·  **Evidence:** no  ·  **Source:** archiveFiles

```text
═══════════════════════════════════════════════════════════
WITNESS STATEMENT — UNREDACTED
SUBJECT: MARIA ELENA SOUZA | JANUARY 21, 1996
CLASSIFICATION: DELETED
═══════════════════════════════════════════════════════════

SOUZA: Around 3:30 AM. Couldn't sleep. Went outside.
The sky was pulsing. Red and white.
Something came down. Silent.

By the time we looked, military trucks were already
there. We're 40km from anything.

[REDACTED IN FINAL VERSION]
They loaded something. The size of a child. But the
proportions were wrong. One turned toward me.
Its eyes... I still see them when I close mine.
[END REDACTED SECTION]

A man in a dark suit. Said my husband's job depended
on remembering "correctly."

───────────────────────────────────────────────────────────
STATUS: EXPUNGED FROM OFFICIAL RECORD
───────────────────────────────────────────────────────────
```

### `witness_statement_raw.txt`

- **Path:** `/storage/quarantine/witness_statement_raw.txt`
- **Status:** `unstable`  ·  **Evidence:** no  ·  **Source:** virtualFileSystem

```text
WITNESS STATEMENT — RAW TRANSCRIPT
DATE: 20-JAN-1996 (07:30)
WITNESS: Civilian female, age 23

"I was walking to work when I saw it.
 Crouching near the wall.
 I thought it was a homeless person.
 Then I saw its face.
 No ears. Its skin was wrong.
 It looked at me.
 I felt like it was inside my head.
 Then I ran."

NOTES: Witness genuinely distressed.
Story consistent across retellings.
No evidence of fabrication.

Telepathic contact described in /comms/psi/

STATUS: Marked for degradation.
Access before data loss.
```

### `witness_subjects_file.txt`

- **Path:** `/ops/mib/witness_subjects_file.txt`
- **Status:** `restricted`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
SUBJECT FILE — THE THREE WITNESSES
FILE: VAR-96-W001 — RESTRICTED
═══════════════════════════════════════════════════════════

WITNESS-1 (eldest). Age 22. Domestic worker.
  Saw creature 15:30, 20-JAN. Jardim Andere.
  "It looked at me." Frightened, religious.
  Pressure: Mother's health, job security.
  RECANTED 23-JAN. "Saw a homeless person."

WITNESS-2 (middle). Age 16. Student.
  Impressionable, easily led.
  RECANTED 22-JAN. "Sister was confused."

WITNESS-3 (youngest). Age 14. Student.
  RESISTANT. Defiant. Maintains story.
  Did NOT sign recantation.
  Agreed only to stay silent.

───────────────────────────────────────────────────────────
Father deceased. Catholic family. Lower middle class.
Risk: MODERATE. WITNESS-3 remains unconvinced.

═══════════════════════════════════════════════════════════
```

### `witness_visit_log.txt`

- **Path:** `/ops/mib/witness_visit_log.txt`
- **Status:** `restricted`  ·  **Evidence:** yes  ·  **Source:** virtualFileSystem

```text
═══════════════════════════════════════════════════════════
WITNESS CONTACT LOG — OPERATION SILÊNCIO
PERIOD: 21-JAN to 15-FEB 1996 — RESTRICTED
═══════════════════════════════════════════════════════════

VISIT #001 — 21-JAN, 22:00
  WITNESS-1 (eldest sister). Jardim Andere.
  Outcome: COOPERATIVE. Recantation signed.

VISIT #002 — 21-JAN, 23:30
  WITNESS-2 (middle sister). Same residence.
  Outcome: COOPERATIVE.

VISIT #003 — 22-JAN, 06:00
  WITNESS-3 (youngest). Workplace.
  Outcome: RESISTANT. Follow-up required.

VISIT #005 — 23-JAN, 19:00
  WITNESS-3 (follow-up). 90 min. Extended persuasion.
  Outcome: COOPERATIVE.

───────────────────────────────────────────────────────────
TOTAL: 14 contacts. 12 cooperative. 2 resistant (resolved).
═══════════════════════════════════════════════════════════
```
