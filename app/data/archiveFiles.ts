// Archive/Past-Only Files - Files that only exist in the archive/rewind state
// These contain deleted evidence, unredacted versions, and pre-sanitized reports

import { FileNode } from '../types';
import { createSeededRng, seededRandomInt } from '../engine/rng';

// ═══════════════════════════════════════════════════════════════════════════
// PAST-ONLY FILES - Only visible when inArchiveMode is true
// ═══════════════════════════════════════════════════════════════════════════

export const witness_statement_original: FileNode = {
  type: 'file',
  name: 'witness_statement_original.txt',
  status: 'intact',
  content: [
    '═══════════════════════════════════════════════════════════',
    'WITNESS STATEMENT — UNREDACTED',
    'SUBJECT: MARIA ELENA SOUZA | JANUARY 21, 1996',
    'CLASSIFICATION: DELETED',
    '═══════════════════════════════════════════════════════════',
    '',
    'SOUZA: Around 3:30 AM. Couldn\'t sleep. Went outside.',
    'The sky was pulsing. Red and white.',
    'Something came down. Silent.',
    '',
    'By the time we looked, military trucks were already',
    'there. We\'re 40km from anything.',
    '',
    '[REDACTED IN FINAL VERSION]',
    'They loaded something. The size of a child. But the',
    'proportions were wrong. One turned toward me.',
    'Its eyes... I still see them when I close mine.',
    '[END REDACTED SECTION]',
    '',
    'A man in a dark suit. Said my husband\'s job depended',
    'on remembering "correctly."',
    '',
    '───────────────────────────────────────────────────────────',
    'STATUS: EXPUNGED FROM OFFICIAL RECORD',
    '───────────────────────────────────────────────────────────',
  ],

};

export const directive_alpha_draft: FileNode = {
  type: 'file',
  name: 'directive_alpha_draft.txt',
  status: 'intact',
  content: [
    '═══════════════════════════════════════════════════════════',
    'DRAFT — DIRECTIVE ALPHA — ITERATION 1',
    'DATE: JANUARY 19, 1996 — 04:22',
    'AUTHOR: [DELETED]',
    'STATUS: MARKED FOR DELETION',
    '═══════════════════════════════════════════════════════════',
    '',
    'Asset recovery timeline must be accelerated.',
    '',
    '2026 convergence window is CLOSER than modeled.',
    'Signal analysis indicates active monitoring.',
    '',
    '───────────────────────────────────────────────────────────',
    'REMOVED FROM FINAL VERSION:',
    '───────────────────────────────────────────────────────────',
    '',
    'Subjects (BIO-A through BIO-C) have demonstrated',
    'cognitive persistence despite containment protocols.',
    'Recommend relocation to Site 7.',
    '',
    'NOTE: BIO-B has attempted communication.',
    'Analysis suggests awareness of our organizational',
    'structure. HOW?',
    '',
    'Recommend cognitive isolation protocol.',
    '',
    '───────────────────────────────────────────────────────────',
    'SANITIZATION NOTE:',
    '───────────────────────────────────────────────────────────',
    '',
    'Final directive: reference "material recovery" only.',
    'All biological terminology replaced with',
    '"debris" and "artifacts."',
    'Project SEED references to be purged.',
    '',
    '═══════════════════════════════════════════════════════════',
  ],

};

export const deleted_comms_log: FileNode = {
  type: 'file',
  name: 'deleted_comms_log.txt',
  status: 'intact',
  content: [
    '═══════════════════════════════════════════════════════════',
    'COMMUNICATIONS LOG — PURGED',
    'DATE: JANUARY 20-22, 1996',
    '═══════════════════════════════════════════════════════════',
    '',
    '[20/01/96 02:17]',
    'SITE-3 > COMMAND: Visual confirmed. Multiple witnesses.',
    '',
    '[02:19]',
    'COMMAND > SITE-3: Mobilize RECOVERY TEAM. No local involvement.',
    '',
    '[02:41]',
    'RECOVERY > COMMAND: On scene. Three biologics confirmed.',
    '                    One responsive.',
    '',
    '[02:43]',
    'COMMAND > RECOVERY: Responsive HOW?',
    '',
    '[02:44]',
    'RECOVERY > COMMAND: It\'s looking at us. Each in turn.',
    '                    Like it\'s... counting.',
    '',
    '[02:45]',
    'COMMAND > RECOVERY: Contain immediately.',
    '',
    '[02:48]',
    'COMMAND > RECOVERY: Override granted. Initiate OPERAÇÃO COLHEITA.',
    '',
    '[03:12]',
    'RECOVERY > COMMAND: All biologics contained.',
    '                    One handler reporting headache and nausea.',
    '',
    '[03:15]',
    'COMMAND > ALL: Communications blackout. CLASSIFIED OMEGA.',
    '',
    '[LOG TERMINATED]',
    '',
    '───────────────────────────────────────────────────────────',
    'DELETION ORDER: COMM-1996-0120-DEL',
    '───────────────────────────────────────────────────────────',
  ],

};

export const personnel_file_costa: FileNode = {
  type: 'file',
  name: 'personnel_file_costa.txt',
  status: 'intact',
  content: [
    '═══════════════════════════════════════════════════════════',
    'PERSONNEL FILE — COSTA, RICARDO MANUEL',
    'STATUS: NON-EXISTENT (OFFICIALLY)',
    '═══════════════════════════════════════════════════════════',
    '',
    'Costa was removed from all databases on 01/25/1996.',
    'Position: Senior Containment Specialist, Site 7.',
    '',
    'INCIDENT: January 23, 1996',
    '',
    'Assigned to overnight monitoring of BIO-B.',
    'At 02:30, Costa\'s brainwaves synchronized with',
    'subject emissions. Found unresponsive at 06:00.',
    '',
    'Upon regaining consciousness, Costa demonstrated',
    'knowledge of events not yet occurred — predicting',
    'an inspection team 3 hours before notification.',
    '',
    'Costa transferred to psychiatric evaluation.',
    'Records sanitized. Family told "work accident."',
    'Current status: UNKNOWN',
    '',
    'UNOFFICIAL NOTE (handwritten):',
    '"He keeps writing the same date over and over.',
    ' September 4, 2026. What happens then?"',
    '',
    '═══════════════════════════════════════════════════════════',
  ],

};

export const project_seed_memo: FileNode = {
  type: 'file',
  name: 'project_seed_memo.txt',
  status: 'intact',
  content: [
    '═══════════════════════════════════════════════════════════',
    'MEMORANDUM — PROJECT SEED',
    'CLASSIFICATION: ULTRA — DELETED FROM ALL SYSTEMS',
    'DATE: JANUARY 18, 1996',
    '═══════════════════════════════════════════════════════════',
    '',
    'The Varginha incident invalidated all models.',
    '',
    'The biologics demonstrate capabilities beyond',
    'projection:',
    '',
    '  1. Telepathic communication',
    '  2. Knowledge of human organizational structures',
    '  3. References to a future date (2026)',
    '',
    'They were not surprised by capture.',
    'They were... patient.',
    '',
    '───────────────────────────────────────────────────────────',
    'REVISED ASSESSMENT',
    '───────────────────────────────────────────────────────────',
    '',
    'We are not dealing with a crash landing.',
    'We are dealing with a DELIVERY.',
    '',
    'The 2026 window is a hard deadline, not an estimate.',
    '',
    'This memo will be purged within 72hrs.',
    'Official narrative: "crashed experimental craft."',
    'The biologics: "unusual debris formations."',
    '',
    '═══════════════════════════════════════════════════════════',
  ],

};

export const autopsy_notes_unredacted: FileNode = {
  type: 'file',
  name: 'autopsy_notes_unredacted.txt',
  status: 'intact',
  content: [
    '═══════════════════════════════════════════════════════════',
    'AUTOPSY NOTES — UNREDACTED',
    'SUBJECT: BIO-C (DECEASED) | JANUARY 24, 1996',
    'STATUS: MARKED FOR DESTRUCTION',
    '═══════════════════════════════════════════════════════════',
    '',
    'Subject expired 04:17. No trauma, no illness.',
    'Appeared to simply... stop functioning.',
    '',
    'Height: 127cm. Weight: 18.3kg.',
    'Skin: gray-brown, slight bioluminescence.',
    'Cranium enlarged, brain mass 3x human average.',
    'Eyes: large, almond-shaped. Low-light specialization.',
    '',
    '───────────────────────────────────────────────────────────',
    'INTERNAL — [DELETED FROM OFFICIAL REPORT]',
    '───────────────────────────────────────────────────────────',
    '',
    'Cardiovascular: Single heart, three chambers.',
    'Digestive: Minimal. Designed for absorption.',
    'Reproductive: None. Purpose-built.',
    '',
    'CRITICAL FINDING:',
    'Neural tissue contains metallic inclusions.',
    'This being was MANUFACTURED.',
    '',
    'PERSONAL NOTE:',
    'These are not visitors. These are messengers.',
    'And we are not prepared for what they herald.',
    '',
    '═══════════════════════════════════════════════════════════',
  ],

};

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN ARCHIVE FILES — Only visible in /admin during rewind after override protocol
// These contain the most damning deleted evidence recovered during rewind
// ═══════════════════════════════════════════════════════════════════════════

export const transfer_manifest_deleted: FileNode = {
  type: 'file',
  name: 'transfer_manifest_deleted.txt',
  status: 'intact',
  content: [
    '═══════════════════════════════════════════════════════════',
    'ASSET TRANSFER MANIFEST — DELETED COPY',
    'DATE: JANUARY 25, 1996',
    'RECONSTRUCTED FROM SECTOR DUMP',
    '═══════════════════════════════════════════════════════════',
    '',
    'OPERATION: COLHEITA (HARVEST)',
    'ORIGIN: Varginha MG',
    'DESTINATION: ESA Campinas — Hangar 4',
    '',
    '───────────────────────────────────────────────────────────',
    'CARGO INVENTORY',
    '───────────────────────────────────────────────────────────',
    '',
    '  ITEM 001: Hull fragment, alloy unknown — 47kg',
    '            Resists all cutting tools.',
    '',
    '  ITEM 002: Navigation array — 12kg',
    '            Still emitting low-frequency signal.',
    '',
    '  ITEM 003: Propulsion debris — 89kg total',
    '            Fragments reassemble in proximity.',
    '',
    '  ITEM 004: Interior paneling — organic-metallic hybrid.',
    '',
    '  ITEM 005: Soil samples — elevated isotope ratios.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    '  Route: Varginha → Campinas (overnight, no stops)',
    '  Convoy: 3 trucks, unmarked. No insignia.',
    '',
    '  Manifest ordered destroyed 01/28/1996.',
    '  No official record of this transfer exists.',
    '',
    '═══════════════════════════════════════════════════════════',
  ],

};

export const bio_containment_log_deleted: FileNode = {
  type: 'file',
  name: 'bio_containment_log_deleted.txt',
  status: 'intact',
  isEvidence: true,
  content: [
    'BIOLOGICAL CONTAINMENT LOG — PURGED RECORD',
    'SITE: HUMANITAS HOSPITAL | JAN 20-26, 1996',
    'CLASSIFICATION: OMEGA — MARKED FOR DESTRUCTION',
    '',
    'SUBJECT REGISTRY:',
    '  BIO-A: Captured 20/01, Jardim Andere. Responsive.',
    '    Transferred to Site 7 on 22/01.',
    '  BIO-B: Captured 20/01. Agitated. Non-acoustic signal',
    '    attempts. Handlers reported headaches within 3m.',
    '  BIO-C: Captured 22/01. Weakened. Expired 24/01.',
    '    Cause unknown. Remains to pathology.',
    '',
    'CONTAINMENT: Faraday cage active.',
    'Subjects refuse all organic matter. DO NOT ENGAGE.',
    'Personnel exposed to BIO-B >10 min require neural scan.',
    '',
    'DELETION ORDER: Log purged 01/30/1996.',
    'Official records: "No biological material recovered."',
  ],

};

export const psi_analysis_classified: FileNode = {
  type: 'file',
  name: 'psi_analysis_classified.txt',
  status: 'intact',
  isEvidence: true,
  content: [
    'PSI-COMM ANALYSIS — CLASSIFIED',
    'ANALYST: Dr. [NAME EXPUNGED] | JAN 27, 1996',
    '',
    'EEG arrays at 1m, 3m, 10m. At ≤3m, synchronized',
    'theta-wave patterns matching BIO-B emissions.',
    'At 10m, dropped to background.',
    '',
    'KEY FINDINGS:',
    '  1. TELEPATHIC CAPABILITY CONFIRMED. Content is',
    '     conceptual, not linguistic. Receivers "know"',
    '     rather than "hear."',
    '  2. SCOUT FUNCTION CONFIRMED. Transmitted imagery',
    '     includes topographical surveys and population',
    '     density maps. They were CATALOGUING us.',
    '  3. TEMPORAL REFERENCE: "thirty rotations" = 2026.',
    '  4. NON-HOSTILE. Subjects regard capture as expected.',
    '',
    'Suppressed 02/01/1996. Official: "No anomalous',
    'communication detected." These are not animals.',
    'They are scouts. They accomplished their mission',
    'before we caught them.',
  ],

};

export const foreign_liaison_cable_deleted: FileNode = {
  type: 'file',
  name: 'foreign_liaison_cable_deleted.txt',
  status: 'intact',
  isEvidence: true,
  content: [
    'DIPLOMATIC CABLE — DELETED',
    'ORIGIN: U.S. EMBASSY, BRASÍLIA → LANGLEY',
    'DATE: JAN 23, 1996 | RECOVERED FROM BACKUP TAPE',
    '',
    'PRIORITY: FLASH',
    '',
    'Three biological specimens secured by Brazilian',
    'military. One deceased, two viable. Per Protocol ECHO,',
    'request technical assessment.',
    '',
    'Brazilian liaison (Col. [REDACTED]) cooperative.',
    'Tel Aviv requesting observer status. Recommend DENY.',
    '',
    'Brazilian Air Force scrambled interceptors per NORAD',
    'advisory. They are fully aware.',
    'Deniability window is closing.',
    '',
    'RESPONSE (LANGLEY): APPROVED. Team en route, ETA 48h.',
    'Brazilian custody TEMPORARY. Full transfer per 1988',
    'treaty annex. NSA signals sweep ordered.',
    '',
    'Cable destroyed per diplomatic protocol.',
    'No record in FOIA-accessible databases.',
  ],

};

export const convergence_model_draft: FileNode = {
  type: 'file',
  name: 'convergence_model_draft.txt',
  status: 'intact',
  isEvidence: true,
  content: [
    'CONVERGENCE MODEL — DRAFT (PURGED)',
    'PROJECT SEED — TEMPORAL ANALYSIS | FEB 3, 1996',
    '',
    'Psi-comm fragments combined with navigation array',
    'signal data yield:',
    '',
    'ACTIVATION WINDOW: September 2026 (±2 months)',
    '"Thirty rotations" = 30 years from 1996 baseline.',
    '',
    'Phase 1 — RECONNAISSANCE (1996):',
    '  Bio-constructs survey target. Data transmitted',
    '  via psi-band to external receiver.',
    'Phase 2 — SEEDING (1996-2026):',
    '  Neurological sensitization via biological material.',
    '  "Carriers" propagate signal receptivity.',
    'Phase 3 — TRANSITION (2026):',
    '  Full-spectrum neural activation.',
    '  Nature: UNKNOWN. Worst case: [DATA EXPUNGED]',
    '',
    'Rejected by oversight. Official: "Random noise."',
    'This document will not survive the next purge cycle.',
    'The math doesn\'t lie.',
  ],

};

// Map of archive files by their full paths
// These files only appear in archive mode (during rewind)
// Placed in existing directories for easier access
export const ARCHIVE_FILES: Record<string, FileNode> = {
  '/storage/quarantine/witness_statement_original.txt': witness_statement_original,
  '/storage/assets/directive_alpha_draft.txt': directive_alpha_draft,
  '/comms/deleted_comms_log.txt': deleted_comms_log,
  '/internal/personnel_file_costa.txt': personnel_file_costa,
  '/internal/project_seed_memo.txt': project_seed_memo,
  '/ops/medical/autopsy_notes_unredacted.txt': autopsy_notes_unredacted,
  // Admin archive files — only visible in /admin during rewind after override protocol
  '/admin/transfer_manifest_deleted.txt': transfer_manifest_deleted,
  '/admin/bio_containment_log_deleted.txt': bio_containment_log_deleted,
  '/admin/psi_analysis_classified.txt': psi_analysis_classified,
  '/admin/foreign_liaison_cable_deleted.txt': foreign_liaison_cable_deleted,
  '/admin/convergence_model_draft.txt': convergence_model_draft,
};

// Directories that gain additional files in archive mode
export const ARCHIVE_DIRECTORY_ADDITIONS: Record<string, string[]> = {
  '/storage/quarantine': ['witness_statement_original.txt'],
  '/storage/assets': ['directive_alpha_draft.txt'],
  '/comms': ['deleted_comms_log.txt'],
  '/internal': ['personnel_file_costa.txt', 'project_seed_memo.txt'],
  '/ops/medical': ['autopsy_notes_unredacted.txt'],
  // Admin archive additions — these require adminUnlocked to see the /admin dir
  '/admin': [
    'transfer_manifest_deleted.txt',
    'bio_containment_log_deleted.txt',
    'psi_analysis_classified.txt',
    'foreign_liaison_cable_deleted.txt',
    'convergence_model_draft.txt',
  ],
};

// Generate a random archive timestamp (formatted like 02:09:12)
export function generateArchiveTimestamp(seed: number): string {
  const rng = createSeededRng(seed);
  const hours = String(seededRandomInt(rng, 1, 5)).padStart(2, '0'); // 01-04
  const minutes = String(seededRandomInt(rng, 0, 60)).padStart(2, '0');
  const seconds = String(seededRandomInt(rng, 0, 60)).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Check if a file should randomly disappear mid-access (~10% chance)
// Uses a combination of seed and file path for deterministic but varied behavior
export function shouldFileDisappear(seed: number, filePath: string): boolean {
  // Use a simple hash to make disappearance deterministic per file per session
  const hash = filePath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const combined = (seed + hash) % 100;
  return combined < 10; // 10% chance
}
