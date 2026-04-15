// Dossier-Based Endings System for Terminal 1996
//
// 12 endings determined by pattern-matching the player's saved dossier (savedFiles).
// The game checks what combination of files the player chose to save and selects
// the best-matching ending based on priority order.

import { GameState } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// NEW DOSSIER-BASED ENDING TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type EndingId =
  | 'ridiculed'
  | 'ufo74_exposed'
  | 'the_2026_warning'
  | 'government_scandal'
  | 'prisoner_45_freed'
  | 'harvest_understood'
  | 'nothing_changes'
  | 'incomplete_picture'
  | 'wrong_story'
  | 'hackerkid_caught'
  | 'secret_ending'
  | 'real_ending';

export interface AolPresentation {
  headline: string;
  subheadline: string;
  body: string[];
  url: string;
  imageSrc?: string;
  imageAlt: string;
  imageSrc?: string;
  visitorCount: number;
}

export interface GameEnding {
  id: EndingId;
  title: string;
  subtitle: string;
  narrative: string[];
  ufo74_final: string;
  aol: AolPresentation;
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE CATEGORIES — Real filenames from the game filesystem
// ═══════════════════════════════════════════════════════════════════════════

const FILE_CATEGORIES = {
  military_coverup: [
    'incident_report_1996_01_VG.txt',
    'initial_response_orders.txt',
    'regional_summary_jan96.txt',
    'transport_log_96.txt',
    'jardim_andere_incident.txt',
    'incident_summary_official.txt',
    'logistics_manifest_fragment.txt',
    'cargo_transfer_memo.txt',
    'duty_roster_jan96.txt',
    'asset_disposition_report.txt',
  ],
  medical_autopsy: [
    'autopsy_alpha.log',
    'autopsy_addendum_psi.txt',
    'alpha_autopsy_addendum.txt',
    'bio_container.log',
    'specimen_purpose_analysis.txt',
    'material_x_analysis.dat',
    'medical_examiner_query.txt',
    'medical_effects_brief_77.txt',
    'contact_incident_report.txt',
    'autopsy_notes_unredacted.txt',
  ],
  witness: [
    'witness_statement_raw.txt',
    'witness_statement_original.txt',
    'witness_visit_log.txt',
    'witness_subjects_file.txt',
    'debriefing_protocol.txt',
    'recantation_001.txt',
    'patrol_observation_shift_04.txt',
    'mudinho_dossier.txt',
  ],
  containment: [
    'bio_container.log',
    'bio_containment_log_deleted.txt',
    'bio_program_overview.red',
    'ethics_exception_03.txt',
    'neural_dump_alfa.psi',
    'neural_cluster_experiment.red',
    'neural_cluster_memo.txt',
  ],
  ufo_core: [
    'alpha_journal.log',
    'audio_transcript_brief.txt',
    'photo_archive_register_77.txt',
    'surveillance_recovery.vid',
    'field_report_delta.txt',
    'scout_variants.meta',
    'energy_node_assessment.txt',
    'deleted_comms_log.txt',
  ],
  temporal_convergence: [
    'convergence_model_draft.txt',
    'thirty_year_cycle.txt',
    'projection_update_2026.txt',
    'threat_window.red',
    'window_alignment.meta',
    'window_clarification.red',
    'second_deployment.sig',
  ],
  extraction_harvest: [
    'extraction_mechanism.red',
    'colonization_model.red',
    'non_arrival_colonization.txt',
    'energy_extraction_theory.txt',
    'transfer_manifest_deleted.txt',
    'briefing_watchers_1996.txt',
  ],
  conspiracy_unrelated: [
    'cafeteria_menu_week03.txt',
    'cafeteria_menu.txt',
    'cafeteria_feedback.txt',
    'parking_allocation_jan96.txt',
    'parking_regulations.txt',
    'supplies_request_jan96.txt',
    'printer_notice.txt',
    'lost_found_jan96.txt',
    'lost_found_log.txt',
    'badge_renewal_memo.txt',
    'training_q1_96.txt',
    'hvac_maintenance_log.txt',
    'birthdays_jan96.txt',
    'vacation_calendar.txt',
    'copa_94_celebration.txt',
    'coffee_harvest_q1_96.txt',
    'weather_report_jan96.txt',
    'local_politics_memo.txt',
    'municipal_budget_96.txt',
    'fire_dept_log_jan96.txt',
  ],
  corruption_financial: [
    'budget_request_q1_96.txt',
    'budget_memo.txt',
    'journalist_payments.enc',
    'kill_story_memo.txt',
    'media_contacts.txt',
    'tv_coverage_report.txt',
    'foreign_press_alert.txt',
    'family_compensation.txt',
    'autopsy_suppression.txt',
    'veterinarian_silencing.txt',
  ],
  honeypot_trap: [
    'URGENT_classified_alpha.txt',
    'LEAKED_classified_records.dat',
    'FOR_PRESIDENTS_EYES_ONLY.enc',
    'SMOKING_GUN_proof.txt',
  ],
  ghost_machine: ['ghost_in_machine.enc'],
  alpha_neural: [
    'alpha_neural_connection.psi',
    'alpha_journal.log',
    'alpha_autopsy_addendum.txt',
  ],
  comms_intercept: [
    'transcript_core.enc',
    'transcript_limit.enc',
    'psi_analysis_report.txt',
    'psi_analysis_classified.txt',
    'signal_analysis_partial.txt',
    'intercept_summary_dec95.txt',
    'morse_intercept.sig',
    'emergency_broadcast.enc',
  ],
  diplomatic: [
    'foreign_liaison_note.txt',
    'foreign_liaison_cable_deleted.txt',
    'diplomatic_cable_23jan.enc',
    'standing_orders_multinational.txt',
    'parallel_incidents_global.txt',
  ],
  coverup: [
    'aircraft_incident_report.txt',
    'foreign_drone_assessment.txt',
    'weather_balloon_memo.txt',
    'industrial_accident_theory.txt',
    'alternative_explanations.txt',
    'contamination_theory.txt',
    'animal_deaths_report.txt',
    'trace_purge_memo.txt',
    'redaction_override_memo.txt',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// ENDING DETERMINATION — Dossier pattern matching
// ═══════════════════════════════════════════════════════════════════════════

export function determineEnding(savedFiles: Set<string>): EndingId {
  const files = [...savedFiles];
  const fileNames = files.map(f => f.split('/').pop() || '');

  const countCategory = (category: string[]): number =>
    fileNames.filter(f => category.includes(f)).length;

  const hasGhostMachine = fileNames.some(f => f.includes('ghost_in_machine'));
  const hasAlphaNeural = countCategory(FILE_CATEGORIES.alpha_neural) > 0;
  const hasConvergence = fileNames.some(f => f.includes('convergence'));
  const hasPhysicist = fileNames.some(f =>
    f.includes('thirty_year_cycle') || f.includes('projection_update_2026')
  );
  const honeypotCount = countCategory(FILE_CATEGORIES.honeypot_trap);
  const militaryCount = countCategory(FILE_CATEGORIES.military_coverup);
  const corruptionCount = countCategory(FILE_CATEGORIES.corruption_financial);
  const conspiracyCount = countCategory(FILE_CATEGORIES.conspiracy_unrelated);
  const witnessCount = countCategory(FILE_CATEGORIES.witness);
  const containmentCount = countCategory(FILE_CATEGORIES.containment);
  const temporalCount = countCategory(FILE_CATEGORIES.temporal_convergence);
  const harvestCount = countCategory(FILE_CATEGORIES.extraction_harvest);
  const medicalCount = countCategory(FILE_CATEGORIES.medical_autopsy);
  const coreCount = countCategory(FILE_CATEGORIES.ufo_core);

  // Priority 1: HackerKid Caught — saved obvious honeypot files
  if (honeypotCount >= 2) return 'hackerkid_caught';

  // Priority 2: Secret Ending — ghost_in_machine + alpha neural + temporal convergence evidence
  if (hasGhostMachine && hasAlphaNeural && hasPhysicist && hasConvergence) return 'secret_ending';

  // Priority 3: UFO74 Exposed — ghost_in_machine.enc present
  if (hasGhostMachine) return 'ufo74_exposed';

  // Priority 4: The Real Ending — comprehensive dossier
  if (coreCount >= 2 && medicalCount >= 2 && witnessCount >= 1 && militaryCount >= 2) return 'real_ending';

  // Priority 5: The Wrong Story — mostly corruption/mundane, minimal core evidence
  if (corruptionCount + conspiracyCount >= 5 && coreCount <= 1) return 'wrong_story';

  // Priority 6: Government Scandal — heavy military/coverup focus
  if (militaryCount >= 4) return 'government_scandal';

  // Priority 7: Prisoner 45 Freed — containment + witness testimony
  if (containmentCount >= 2 && witnessCount >= 1) return 'prisoner_45_freed';

  // Priority 8: The 2026 Warning — temporal/convergence focus
  if (temporalCount >= 2) return 'the_2026_warning';

  // Priority 9: The Harvest Understood — extraction theory
  if (harvestCount >= 2) return 'harvest_understood';

  // Priority 10: Nothing Changes — decent dossier but missing the full picture
  if (coreCount >= 2 && medicalCount >= 1 && militaryCount >= 1) return 'nothing_changes';

  // Priority 11: Incomplete Picture — scattered, no category dominates
  const maxCategory = Math.max(
    militaryCount, medicalCount, witnessCount, coreCount, temporalCount, harvestCount
  );
  if (maxCategory <= 2) return 'incomplete_picture';

  // Default: Ridiculed — weak or incoherent dossier
  return 'ridiculed';
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDING CONTENT — 12 dossier-based endings
// ═══════════════════════════════════════════════════════════════════════════

const ENDING_IMAGE_ROOT = '/images/endings';

export const ENDINGS: Record<EndingId, Omit<GameEnding, 'id'>> = {
  ridiculed: {
    title: 'RIDICULED',
    subtitle: 'The leak that proved nothing.',
    narrative: [
      'The dossier surfaces on three forums and a defunct Geocities mirror. A television host holds up a printout and laughs for six minutes straight. The military issues no denial because none is required.',
      'Within forty-eight hours the files are catalogued alongside crop circles, chemtrails, and faith healers. Your name never enters the public record. The word "hoax" is generous — most call it fan fiction.',
      'The archive rots on a server in São Paulo. Nobody downloads it. The password expires. Varginha remains a punchline.',
    ],
    ufo74_final: 'you gave them noise. they needed signal.',
    aol: {
      headline: "INTERNET HOAX ALERT: 'CLASSIFIED UFO FILES' FROM BRAZIL DISMISSED AS PRANK",
      subheadline: "USAF spokesperson calls documents 'creative fiction' — Brazilian Air Force declines comment — Internet forums debate authenticity",
      body: [
        "VARGINHA, Brazil (AP) — A collection of documents purporting to be classified military files about an alleged 'unidentified flying object' incident in southern Brazil surfaced on several Internet bulletin boards late Tuesday, drawing immediate skepticism from experts and officials alike.",
        "The files, which appear to describe military operations in the city of Varginha in January of this year, were reportedly obtained through an unauthorized computer intrusion. Air Force officials in Brasília declined to comment, noting only that the documents 'do not correspond to any known military operation.'",
        "Dr. Harold Simmons of the Center for Scientific Inquiry called the documents 'an elaborate but ultimately unconvincing fabrication,' pointing to what he described as 'inconsistencies in formatting and terminology that suggest a civilian author with limited military knowledge.'",
      ],
      url: 'http://www.aol.com/news/world/brazil_ufo_hoax_0196.htm',
      imageSrc: `${ENDING_IMAGE_ROOT}/photo-unverified-document.jpg`,
      imageAlt: 'photo_unverified_document.jpg (43 KB)',
      imageSrc: '/images/endings/ridiculed.jpg',
      visitorCount: 1247,
    },
  },
  ufo74_exposed: {
    title: 'UFO74 EXPOSED',
    subtitle: 'The ghost had a name all along.',
    narrative: [
      'The decrypted file spreads before anyone can suppress it. Carlos Eduardo Ferreira — intelligence officer, Brazilian Air Force, stationed at Guarulhos in 1996. Thirty years building the archive in secret.',
      'Military intelligence confirms the service record within hours. The denial is immediate, automatic, and too late. Ferreira\'s face is on every screen in the country. He never wanted fame. He wanted someone to believe him.',
      'The Air Force opens an internal inquiry. Three generals retire early. The archive survives because it was already everywhere. UFO74 is no longer a call sign. It is a name.',
    ],
    ufo74_final: 'you found me. now finish what i started.',
    aol: {
      headline: 'MILITARY OFFICER IDENTIFIED AS SOURCE OF CLASSIFIED BRAZILIAN DATA LEAK',
      subheadline: "Carlos E. Ferreira, Brazilian Air Force intelligence — service record confirmed — three generals request early retirement",
      body: [
        "BRASÍLIA, Brazil (Reuters) — A decrypted computer file circulating on the Internet has identified a Brazilian Air Force intelligence officer as the source of a massive unauthorized disclosure of classified military documents, according to officials familiar with the matter.",
        "The officer, identified as Carlos Eduardo Ferreira, was reportedly stationed at Guarulhos Air Base during the period described in the leaked files. Military intelligence confirmed the service record within hours of the file's release, though a spokesperson declined to comment on the substance of the allegations.",
        "Three senior Air Force generals have submitted requests for early retirement in what analysts describe as an attempt to distance themselves from the growing scandal. The leaked archive, which Ferreira allegedly maintained for decades, contains documents related to military operations in southern Minas Gerais state.",
      ],
      url: 'http://www.aol.com/news/world/brazil_leak_officer_id.htm',
      imageSrc: `${ENDING_IMAGE_ROOT}/ferreira_service_photo_CLASSIFIED.jpg`,
      imageAlt: 'ferreira_service_photo_CLASSIFIED.jpg (unable to load)',
      imageSrc: '/images/endings/ufo74_exposed.jpg',
      visitorCount: 89341,
    },
  },
  the_2026_warning: {
    title: 'THE 2026 WARNING',
    subtitle: 'Thirty rotations. The clock does not stop.',
    narrative: [
      'The convergence data hits academic servers first. Physicists in three countries confirm the thirty-year cycle independently. 1947. 1977. 1996. The pattern is clean, the projection is specific: September 2026, plus or minus two months.',
      'Governments issue no statements. Private aerospace firms begin relocating satellite arrays. The Brazilian Air Force reclassifies seven archived directives without explanation.',
      'The public does not panic because the public does not understand logarithmic signal propagation. Those who do understand have gone very quiet.',
    ],
    ufo74_final: 'the window is real. you gave them time.',
    aol: {
      headline: 'SCIENTISTS IDENTIFY 30-YEAR PATTERN IN UNEXPLAINED ATMOSPHERIC EVENTS',
      subheadline: "Next predicted occurrence: September 2026 — private aerospace firms reportedly repositioning satellite arrays — no official comment",
      body: [
        "GENEVA, Switzerland (AP) — Physicists at three independent research institutions have confirmed the existence of a thirty-year cyclical pattern in atmospheric anomaly data, according to a joint preliminary report released Wednesday. The pattern, if validated, would predict a significant event window in late 2026.",
        "The analysis was prompted by documents leaked from a Brazilian military archive earlier this month. While the researchers declined to speculate on the nature of the anomalies, they confirmed the mathematical model described in the leaked files is 'internally consistent and statistically significant.'",
        "Several private aerospace companies have begun what industry sources describe as 'precautionary repositioning' of satellite monitoring arrays, though none would confirm a connection to the leaked data. The Brazilian government has issued no statement.",
      ],
      url: 'http://www.aol.com/news/science/30year_cycle_atmospheric.htm',
      imageSrc: `${ENDING_IMAGE_ROOT}/convergence_chart_draft.jpg`,
      imageAlt: 'convergence_chart_draft.gif (image not available)',
      imageSrc: '/images/endings/the_2026_warning.jpg',
      visitorCount: 156782,
    },
  },
  government_scandal: {
    title: 'BRAZILIAN GOVERNMENT SCANDAL',
    subtitle: 'The coverup was bigger than the event.',
    narrative: [
      'Transport logs. Response orders. Incident reports signed by officers who officially never existed. The leak does not prove alien contact — it proves the Brazilian military mobilized an entire region to hide something on January 20, 1996.',
      'Congressional inquiries open in Brasília. Three colonels are subpoenaed. One refuses to testify. The Jardim Andere site is cordoned off for "environmental assessment" that never produces a report.',
      'The question shifts. It is no longer about what landed. It is about who authorized the silence, who paid for it, and where the bodies went.',
    ],
    ufo74_final: 'they will sacrifice officers to protect the secret.',
    aol: {
      headline: 'LEAKED DOCUMENTS REVEAL MASSIVE BRAZILIAN MILITARY OPERATION IN VARGINHA',
      subheadline: "Transport logs and response orders prove classified mobilization — three colonels subpoenaed — Congressional inquiry opens in Brasília",
      body: [
        "BRASÍLIA, Brazil (AP) — Classified military documents leaked to the Internet this week reveal what appears to be a large-scale Brazilian Army operation in the southern city of Varginha in January 1996, involving troop movements, vehicle requisitions, and command orders that were never disclosed to the public or to civilian authorities.",
        "The documents include transport logs, incident reports signed by officers whose service records contain no reference to the operation, and response orders authorizing the cordoning of a residential area described only as 'the Jardim Andere site.' The purpose of the operation is not specified in any of the recovered files.",
        "Three colonels have been subpoenaed to testify before a Congressional committee in Brasília. One has reportedly refused. The Ministry of Defense issued a brief statement calling the documents 'unverified' but did not deny their authenticity.",
      ],
      url: 'http://www.aol.com/news/world/brazil_military_coverup.htm',
      imageSrc: `${ENDING_IMAGE_ROOT}/transport_log_scan.jpg`,
      imageAlt: 'transport_log_scan_96.jpg (connection timed out)',
      imageSrc: '/images/endings/government_scandal.jpg',
      visitorCount: 234519,
    },
  },
  prisoner_45_freed: {
    title: 'PRISONER 45 FREED',
    subtitle: 'The containment logs were never supposed to leave.',
    narrative: [
      'Bio-containment records. Neural dump data. Ethics exceptions signed by committee. The dossier does not show a captured animal — it shows a detained intelligence, held in a Faraday cage for eleven days while handlers reported headaches and cognitive intrusion.',
      'The witness statements give it weight. The sisters. The patrol officers. The veterinarian they silenced. Each testimony corroborates the containment timeline independently.',
      'A São Paulo judge orders the military to produce "all biological materials recovered January 1996." The military responds that no such materials exist. The containment logs say otherwise.',
    ],
    ufo74_final: 'it was never a specimen. it was a prisoner.',
    aol: {
      headline: "CLASSIFIED LOGS DESCRIBE 'NON-HUMAN ENTITY' DETAINED IN MILITARY FACILITY",
      subheadline: "Bio-containment records leaked — handlers reported 'cognitive intrusion' — São Paulo judge demands military disclosure",
      body: [
        "SÃO PAULO, Brazil (UPI) — Leaked bio-containment records from a Brazilian military facility describe what personnel referred to as a 'detained biological intelligence' held for eleven days in a Faraday-shielded chamber, according to documents released on the World Wide Web late Thursday.",
        "The logs, which include ethics exception forms signed by a medical committee, describe handlers experiencing 'persistent headaches and reported cognitive intrusion events' during the detention period. The entity, designated as 'Specimen Alpha' in some documents and 'Prisoner 45' in others, is described as exhibiting 'responsive behavior inconsistent with any known terrestrial species.'",
        "A judge in São Paulo has ordered the military to produce 'all biological materials recovered in January 1996.' The military responded Friday that no such materials exist. The leaked containment logs appear to contradict this statement directly.",
      ],
      url: 'http://www.aol.com/news/world/brazil_containment_logs.htm',
      imageAlt: 'bio_container_photo_EXPUNGED.jpg (file not found)',
      imageSrc: '/images/endings/prisoner_45_freed.jpg',
      visitorCount: 67823,
    },
  },
  harvest_understood: {
    title: 'THE HARVEST UNDERSTOOD',
    subtitle: 'Colonization does not require arrival.',
    narrative: [
      'The extraction documents land in the wrong hands — or the right ones. The colonization model. The harvest timeline. The mechanism that requires no ships, no invasion, no contact at all.',
      'Three universities publish independent analyses within a month. The consensus is clinical and devastating: the model is internally consistent, the energy mathematics are sound, and the thirty-year seeding cycle aligns with observed neurological data.',
      'Nobody wants to say the word "colonization" on television. They use "resource assessment" instead. It means the same thing.',
    ],
    ufo74_final: 'they do not need to come here. they never did.',
    aol: {
      headline: "LEAKED THEORY DESCRIBES 'COLONIZATION WITHOUT ARRIVAL' BY UNKNOWN INTELLIGENCE",
      subheadline: "Three universities confirm energy mathematics — 'internally consistent,' researchers say — no government comment",
      body: [
        "CAMBRIDGE, Mass. (AP) — Documents leaked from a classified Brazilian military archive describe a theoretical model for what the files term 'non-arrival colonization' — a process by which an unknown intelligence could extract resources from a planetary system without physical presence or direct contact, according to an analysis published Thursday by researchers at MIT.",
        "Three universities have now independently reviewed the leaked extraction model and confirmed that its energy mathematics are, in the words of one physicist, 'disturbingly sound.' The model describes a thirty-year seeding cycle that researchers say aligns with observed neurological data from the Brazilian military's own classified medical files.",
        "No government has issued a formal response. Television commentators have avoided the word 'colonization,' preferring the term 'resource assessment.' Scientists familiar with the data say the distinction is academic.",
      ],
      url: 'http://www.aol.com/news/science/colonization_theory_leaked.htm',
      imageAlt: 'extraction_diagram_classified.gif (access denied)',
      imageSrc: '/images/endings/harvest_understood.jpg',
      visitorCount: 45192,
    },
  },
  nothing_changes: {
    title: 'NOTHING CHANGES',
    subtitle: 'The truth arrived. Nobody moved.',
    narrative: [
      'The dossier is strong. Autopsy reports. Field observations. Military intercepts. Enough to establish that something non-human was recovered in Varginha in January 1996. Enough to demand answers.',
      'Panels convene. Experts testify. The footage circulates. For two weeks, the world pays attention. Then an election cycle begins, a currency collapses, a celebrity dies, and the feed moves on.',
      'The files remain available. Downloaded fourteen million times. Cited in zero policy changes. The truth is free and weightless.',
    ],
    ufo74_final: 'you proved everything. it was not enough.',
    aol: {
      headline: 'VARGINHA FILES DOWNLOADED 14 MILLION TIMES; GOVERNMENTS WORLDWIDE SILENT',
      subheadline: "Evidence called 'compelling' by experts — zero policy changes — election coverage resumes",
      body: [
        "NEW YORK (AP) — The collection of classified military documents known as the 'Varginha Files' has been downloaded more than fourteen million times since its release on the Internet two weeks ago, making it one of the most widely distributed document leaks in the brief history of the World Wide Web. Despite this, no government has issued a formal response.",
        "Panels of experts convened at universities in four countries have called the evidence 'compelling' and 'worthy of official investigation.' Footage from the original incident has circulated on cable news networks for approximately twelve days before being displaced by coverage of ongoing elections and financial markets.",
        "The files remain freely available on multiple mirror sites. Analysts note that the unprecedented volume of downloads has produced no measurable political or policy impact. 'The truth is out there,' noted one commentator. 'It turns out that is not sufficient.'",
      ],
      url: 'http://www.aol.com/news/world/varginha_files_14million.htm',
      imageAlt: 'download_counter_screenshot.gif (server busy)',
      imageSrc: '/images/endings/nothing_changes.jpg',
      visitorCount: 14023847,
    },
  },
  incomplete_picture: {
    title: 'INCOMPLETE PICTURE',
    subtitle: 'Fragments do not make a case.',
    narrative: [
      'The dossier contains evidence, but it tells no story. A medical report here. A transport log there. No thread connects them. No narrative emerges. The files are real and they prove nothing.',
      'Debunkers dismantle the leak in a weekend. Each document, taken alone, has an innocent explanation. The military does not even need to respond. The files discredit themselves through isolation.',
      'You had the pieces. You did not assemble the picture.',
    ],
    ufo74_final: 'scattered evidence is the same as no evidence.',
    aol: {
      headline: "LEAKED MILITARY DOCUMENTS FAIL TO SUPPORT UFO CLAIMS, SAY ANALYSTS",
      subheadline: "Debunkers dismantle evidence in 72 hours — 'each file has innocent explanation' — military issues no denial",
      body: [
        "WASHINGTON (AP) — A collection of documents leaked from a Brazilian military archive and purporting to describe contact with a non-human intelligence has been largely discredited by independent analysts, who say the files, while possibly authentic, fail to tell a coherent story.",
        "The leak contains medical reports, transport logs, and communications intercepts, but analysts say no thread connects them into a meaningful narrative. 'Each document, taken individually, has an innocent explanation,' said Dr. James Whitfield of Georgetown University. 'Taken together, they prove nothing more than that the Brazilian military generates paperwork.'",
        "The Brazilian Air Force has issued no official denial, which analysts interpret not as confirmation but as an indication that the documents do not warrant response. Several Internet forums that initially promoted the files have moved on to other topics.",
      ],
      url: 'http://www.aol.com/news/world/brazil_ufo_debunked.htm',
      imageAlt: 'scattered_documents_photo.jpg (404 Not Found)',
      imageSrc: '/images/endings/incomplete_picture.jpg',
      visitorCount: 3891,
    },
  },
  wrong_story: {
    title: 'THE WRONG STORY',
    subtitle: 'You investigated the cafeteria.',
    narrative: [
      'The dossier arrives on journalists\' desks and produces genuine confusion. Budget memos. Parking allocations. A coffee harvest report. Media payment records that prove corruption but not contact.',
      'The financial angle gains traction. Three military officials face embezzlement charges. A journalist wins an award for exposing the media suppression network. The actual event — the beings, the autopsies, the containment — is never mentioned.',
      'You exposed a scandal. The wrong one.',
    ],
    ufo74_final: 'you found the lie but missed the truth behind it.',
    aol: {
      headline: 'MILITARY BUDGET SCANDAL UNCOVERED IN LEAKED BRAZILIAN DOCUMENTS',
      subheadline: "Three officials face embezzlement charges — journalist wins award for exposé — actual UFO claims ignored",
      body: [
        "BRASÍLIA, Brazil (Reuters) — Classified documents leaked from a Brazilian military installation have led not to the confirmation of extraterrestrial contact, as the anonymous source apparently intended, but to the exposure of a significant financial corruption network within the armed forces.",
        "The leaked files contain detailed budget memoranda, media payment records, and what prosecutors describe as 'a systematic program to suppress unfavorable news coverage through direct payments to journalists.' Three senior military officials now face embezzlement and fraud charges. A reporter for Folha de São Paulo has been awarded the Maria Moors Cabot Prize for her coverage of the scandal.",
        "Notably absent from the dossier are any substantive references to the alleged non-human contact that the leaker appeared to be documenting. Analysts describe the collection as 'accidentally important for entirely the wrong reasons.'",
      ],
      url: 'http://www.aol.com/news/world/brazil_budget_scandal.htm',
      imageAlt: 'budget_memo_redacted.gif (file corrupted)',
      imageSrc: '/images/endings/wrong_story.jpg',
      visitorCount: 178234,
    },
  },
  hackerkid_caught: {
    title: 'HACKERKID CAUGHT',
    subtitle: 'The honeypots worked exactly as designed.',
    narrative: [
      'Files named URGENT_classified_alpha. SMOKING_GUN_proof. FOR_PRESIDENTS_EYES_ONLY. Real classified material never advertises itself. Every file you saved was planted. Every download was logged.',
      'Military cybersecurity traces the intrusion to your terminal within ninety minutes. The dossier is quarantined before it reaches a single journalist. Your access credentials are revoked, archived, and forwarded to federal prosecutors.',
      'The decoy system was built for people exactly like you. Eager. Careless. Loud.',
    ],
    ufo74_final: 'i tried to warn you. real secrets whisper.',
    aol: {
      headline: 'COMPUTER HACKER ARRESTED AFTER DOWNLOADING MILITARY DECOY FILES',
      subheadline: "Cybersecurity trap worked 'exactly as designed' — suspect traced in 90 minutes — federal charges pending",
      body: [
        "BRASÍLIA, Brazil (AP) — Brazilian military cybersecurity personnel have arrested an individual suspected of unauthorized intrusion into a classified computer network after the suspect downloaded files that had been deliberately planted as tracking devices, officials confirmed Saturday.",
        "The files, with titles such as 'URGENT_classified_alpha' and 'FOR_PRESIDENTS_EYES_ONLY,' were designed to appeal to inexperienced intruders and contained embedded tracking mechanisms that allowed military technicians to identify the suspect's terminal within ninety minutes of the initial download.",
        "A military spokesperson confirmed that the decoy system, which has been in place since 1994, was built specifically to identify and apprehend 'unsophisticated intrusion attempts.' The suspect's collected files were quarantined before reaching any external recipient. Federal prosecutors have been notified.",
      ],
      url: 'http://www.aol.com/news/tech/hacker_military_decoy.htm',
      imageAlt: 'suspect_terminal_photo.jpg (CLASSIFIED)',
      imageSrc: '/images/endings/hackerkid_caught.jpg',
      visitorCount: 12,
    },
  },
  secret_ending: {
    title: 'THE FERREIRA PROTOCOL',
    subtitle: 'Ghost. Signal. Bridge. Ambassador.',
    narrative: [
      'Carlos Eduardo Ferreira. UFO74. The ghost in the machine. His archive decrypted. His identity confirmed. But the dossier contains more than a confession — it contains the convergence model, the neural connection data, and the thirty-year projection.',
      'The combination is deliberate. Ferreira designed it this way. The identity file authenticates the source. The neural data proves contact. The convergence model provides the timeline. Together they form a single argument no committee can dismiss.',
      'The Brazilian Air Force confirms the service record. Three allied governments request the neural data. The 2026 window enters official threat assessment documents. Ferreira\'s archive becomes the foundation of the first multinational contact protocol.',
      'He built this for thirty years. He built it for you.',
    ],
    ufo74_final: 'you assembled everything. i can rest now.',
    aol: {
      headline: "MULTINATIONAL GOVERNMENTS ESTABLISH FIRST 'CONTACT PROTOCOL' BASED ON LEAKED ARCHIVE",
      subheadline: "Three allied nations request neural data — 2026 threat window enters official assessment — Ferreira archive authenticated",
      body: [
        "UNITED NATIONS, New York (AP) — Representatives of three allied governments have formally requested access to neural interface data contained in a leaked Brazilian military archive, marking what diplomats describe as the first official acknowledgment that the documents may describe genuine non-human contact.",
        "The archive, compiled over thirty years by Brazilian Air Force intelligence officer Carlos Eduardo Ferreira, contains identity verification documents, neural connection data, and a convergence model that projects a significant event window in September 2026. Intelligence analysts say the combination was deliberately designed to form 'a single argument no committee can dismiss.'",
        "The Brazilian Air Force has confirmed Ferreira's service record. The 2026 projection has entered official threat assessment documents in at least two NATO member states. Sources describe the emerging multinational response as 'the first contact protocol' — a framework for coordinated government action in response to verified non-human intelligence.",
      ],
      url: 'http://www.aol.com/news/world/contact_protocol_established.htm',
      imageAlt: 'ferreira_protocol_document.jpg (RESTRICTED)',
      imageSrc: '/images/endings/secret_ending.jpg',
      visitorCount: 1,
    },
  },
  real_ending: {
    title: 'UNDENIABLE',
    subtitle: 'The dossier that could not be ignored.',
    narrative: [
      'Core evidence. Autopsy records. Witness testimony. Military logistics. Each category reinforces the others. The field journal establishes contact. The autopsy proves non-human biology. The witnesses confirm the timeline. The transport logs confirm the coverup.',
      'The dossier does not ask questions. It presents facts in a sequence that permits only one conclusion. International press picks it up within hours. The Brazilian government requests seventy-two hours before responding. They use all of them.',
      'The response, when it comes, is seven words: "The matter is under renewed investigation." Those seven words change everything. Denial is no longer the official position. Thirty years of silence end with a single sentence.',
    ],
    ufo74_final: 'they cannot unsay those seven words.',
    aol: {
      headline: "BRAZIL BREAKS SILENCE: 'THE MATTER IS UNDER RENEWED INVESTIGATION'",
      subheadline: "Seven words end thirty years of official denial — international press demands full disclosure — dossier called 'undeniable'",
      body: [
        "BRASÍLIA, Brazil (AP) — The Brazilian government has issued its first official acknowledgment of the 1996 Varginha incident, stating in a seven-word response that 'the matter is under renewed investigation.' The statement, released seventy-two hours after the most comprehensive dossier of evidence ever assembled reached international press outlets, effectively ends three decades of official denial.",
        "The dossier combines field journals establishing direct contact, autopsy records confirming non-human biology, independent witness testimony verifying the timeline, and military transport logs documenting the coverup. International press agencies describe the evidence as 'presenting facts in a sequence that permits only one conclusion.'",
        "Analysts note that the carefully worded response stops short of confirming extraterrestrial contact but represents a fundamental shift in the government's position. 'They cannot unsay those seven words,' noted one diplomatic observer. 'Denial is no longer the official position. Everything changes from here.'",
      ],
      url: 'http://www.aol.com/news/world/brazil_renewed_investigation.htm',
      imageAlt: 'official_statement_brasilia.jpg (loading...)',
      imageSrc: '/images/endings/real_ending.jpg',
      visitorCount: 847291,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// BACKWARD-COMPATIBLE EXPORTS — Used by Victory.tsx, Terminal.tsx, etc.
// ═══════════════════════════════════════════════════════════════════════════

export type EndingVariant = EndingId;

export interface EndingFlags {
  conspiracyFilesLeaked: boolean;
  alphaReleased: boolean;
  neuralLinkAuthenticated: boolean;
}

const ENDING_DIVIDER = '═══════════════════════════════════════════════════════════';

/**
 * Legacy: determine ending variant from boolean flags.
 * Maps the old 3-flag system to the new dossier system via a synthetic savedFiles set.
 */
export function determineEndingVariant(flags: EndingFlags): EndingVariant {
  const syntheticFiles = new Set<string>();

  // Map old flags to representative file sets
  if (flags.neuralLinkAuthenticated) {
    syntheticFiles.add('/storage/quarantine/alpha_neural_connection.psi');
    syntheticFiles.add('/storage/quarantine/alpha_journal.log');
  }
  if (flags.alphaReleased) {
    syntheticFiles.add('/ops/medical/bio_container.log');
    syntheticFiles.add('/ops/medical/autopsy_alpha.log');
    syntheticFiles.add('/ops/assessments/witness_statement_raw.txt');
    syntheticFiles.add('/comms/psi/neural_dump_alfa.psi');
    syntheticFiles.add('/comms/psi/psi_analysis_report.txt');
  }
  if (flags.conspiracyFilesLeaked) {
    syntheticFiles.add('/ops/exo/jardim_andere_incident.txt');
    syntheticFiles.add('/admin/incident_report_1996_01_VG.txt');
    syntheticFiles.add('/ops/assessments/initial_response_orders.txt');
    syntheticFiles.add('/ops/assessments/transport_log_96.txt');
    syntheticFiles.add('/comms/liaison/foreign_liaison_note.txt');
  }

  // Always provide base evidence for a non-empty dossier
  syntheticFiles.add('/ops/exo/audio_transcript_brief.txt');
  syntheticFiles.add('/storage/assets/alpha_journal.log');

  return determineEnding(syntheticFiles);
}

export function getEndingFlags(state: GameState): EndingFlags {
  const flags = state.flags || {};
  return {
    conspiracyFilesLeaked: flags.conspiracyFilesLeaked === true,
    alphaReleased: flags.alphaReleased === true,
    neuralLinkAuthenticated: flags.neuralLinkAuthenticated === true,
  };
}


export function getEndingTitle(variant: EndingVariant): string {
  const ending = (ENDINGS as Record<string, Omit<GameEnding, 'id'>>)[variant];
  return ending?.title ?? variant.toUpperCase().replace(/_/g, ' ');
}

export function getEndingNarrativeLines(variant: EndingVariant): string[] {
  const ending = (ENDINGS as Record<string, Omit<GameEnding, 'id'>>)[variant];
  if (!ending) return ['ENDING NOT FOUND'];
  return [
    ENDING_DIVIDER,
    '',
    ending.title,
    '',
    ENDING_DIVIDER,
    '',
    ...ending.narrative,
    '',
    `[UFO74]: ${ending.ufo74_final}`,
    '',
    ENDING_DIVIDER,
    '',
    ending.subtitle,
    '',
    `>> ENDING: ${ending.title} <<`,
    '',
  ];
}


