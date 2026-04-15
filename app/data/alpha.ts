// ALPHA System — Codename ALPHA: The Surviving Alien
//
// ALPHA is different from Prisoner 45 (the morse code contact).
// ALPHA is one of the original Varginha beings — the one that survived.
// This is a hidden discovery that provides undeniable proof if released.
//
// Files are written as the field journal of Maj. Marcos Augusto Ferreira,
// a Brazilian military scientist assigned to Site 7. His entries deteriorate
// from clinical detachment to fragmented terror as ALPHA makes contact.

import { FileNode } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// ALPHA FILES
// Field journal entries documenting the surviving alien in containment
// ═══════════════════════════════════════════════════════════════════════════

export const alpha_journal: FileNode = {
  type: 'file',
  name: 'alpha_journal.log',
  status: 'encrypted',
  accessThreshold: 4,
  isEvidence: true,
  content: [
    '═══════════════════════════════════════════════════════════',
    'FIELD JOURNAL — MAJ. M.A. FERREIRA',
    'CPEX — CENTRO DE PESQUISAS EXOBIOLÓGICAS',
    'SITE 7, SUBLEVEL 4 — CLASSIFICATION: ULTRA',
    '═══════════════════════════════════════════════════════════',
    '',
    '21 JAN 1996',
    '',
    'Subject arrived 0340 from Jardim Andere. Third specimen.',
    'Designated ALPHA. The other two died — Hospital Regional,',
    'ESA.',
    '',
    '1.6m. Dark brown skin, oily secretion. Three bony ridges',
    'on cranium. Oversized red eyes. Ammonia.',
    '',
    '  Respiration: None.',
    '  Pulse: None.',
    '  Metabolism: None.',
    '  EEG theta amplitude: 847 µV.',
    '  Human baseline: 12 µV.',
    '',
    'ALPHA is clinically dead. The EEG is not.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    '25 JAN — Patterns show language-like structure. Guards',
    'report involuntary star field imagery. Feeling "watched."',
    '',
    '1 FEB — Psi-comm request denied. Building from crash',
    'salvage.',
    '',
    '2 FEB — EEG spiked during unauthorized remote file',
    'access. The ammonia follows me to my quarters.',
    'Ventilation says it cannot.',
    '',
    '───────────────────────────────────────────────────────────',
    'Classification: ULTRA — Eyes only',
    '═══════════════════════════════════════════════════════════',
  ],
};

export const alpha_neural_connection: FileNode = {
  type: 'file',
  name: 'alpha_neural_connection.psi',
  status: 'intact',
  accessThreshold: 3,
  isEvidence: true,
  content: [
    '═══════════════════════════════════════════════════════════',
    'FIELD JOURNAL — MAJ. M.A. FERREIRA',
    'CPEX — SITE 7, SUBLEVEL 4',
    'CLASSIFICATION: ULTRA',
    '═══════════════════════════════════════════════════════════',
    '',
    '5 FEB 1996',
    '',
    'The device works. Connected at 2200, alone during',
    'guard rotation gap.',
    '',
    'It is not communication. Concepts arrive already',
    'understood — no words, no translation. As if they',
    'were always yours.',
    '',
    'ALPHA is not dead. The body is an antenna.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    '8 FEB — ALPHA knows schedule changes, personnel',
    'transfers decided three floors above. Tonight it',
    'said a name. Luísa. My daughter. Seven years old.',
    'I never mentioned her.',
    '',
    '  CONTAINMENT ALERT:',
    '  Emergency release code: RELEASE ALPHA',
    '',
    '  WARNING: Unauthorized release triggers',
    '  facility lockdown.',
    '',
    '10 FEB — The MP sergeant who touched ALPHA died.',
    '"Pneumonia." Nothing pneumonic about it.',
    '',
    'It projected "thirty rotations." A countdown.',
    '',
    '───────────────────────────────────────────────────────────',
    'Classification: ULTRA — Eyes only',
    '═══════════════════════════════════════════════════════════',
  ],
};

export const alpha_autopsy_addendum: FileNode = {
  type: 'file',
  name: 'alpha_autopsy_addendum.txt',
  status: 'corrupted',
  accessThreshold: 5,
  isEvidence: true,
  content: [
    '═══════════════════════════════════════════════════════════',
    'FIELD JOURNAL — MAJ. M.A. FERREIRA',
    'CPEX — SITE 7',
    '═══════════════════════════════════════════════════════════',
    '',
    '12 FEB 1996',
    '',
    'Eleven days dead. EEG: 1,204 µV. Climbing.',
    '',
    'The device activates on its own. Or I activate it',
    'without remembering.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    '13 FEB — Device powered on at 0300. I was in',
    'quarters. Three floors up. Lab was locked.',
    '',
    'ALPHA asked:',
    '',
    '  "quando você vem?"',
    '',
    'When are you coming.',
    '',
    '14 FEB',
    '',
    'Luísa called the base switchboard. She is seven.',
    'She does not know this number.',
    '',
    '  "papai, o moço do escuro quer falar com você."',
    '',
    '  The man from the dark wants to talk to you.',
    '',
    '[TRANSFER REQUEST: DENIED — ESSENTIAL PERSONNEL]',
    '',
    '...hackerkid...',
    '...you are reading this...',
    '...the code is RELEASE ALPHA...',
    '...he could not do it...',
    '...perhaps you will...',
    '',
    '═══════════════════════════════════════════════════════════',
  ],
};

// Array of all ALPHA files
export const ALPHA_FILES = [
  alpha_journal,
  alpha_neural_connection,
  alpha_autopsy_addendum,
];

export const ALPHA_FILE_NAMES = ALPHA_FILES.map(f => f.name);

// ═══════════════════════════════════════════════════════════════════════════
// RELEASE SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════

export const ALPHA_RELEASE_INTRO = [
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
  '  ADMINISTRATIVE OVERRIDE DETECTED',
  '  COMMAND: RELEASE ALPHA',
  '',
  '  WARNING: External terminal — origin unregistered.',
  '  Site 7 bio-containment protocols will be permanently',
  '  suspended. Neural suppression field will deactivate.',
  '  This action cannot be reversed. Initiating.',
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '',
];

export const ALPHA_RELEASE_SEQUENCE = [
  '  VERIFYING AUTHORIZATION...',
  '',
  '  WARNING: This action is irreversible.',
  '  Containment breach will be logged.',
  '  Facility lockdown will NOT engage — remote override active.',
  '',
  '  EXECUTING RELEASE PROTOCOL...',
  '',
  '  > Bio-isolation seals: DISENGAGING',
  '  > Atmosphere equalization: IN PROGRESS',
  '  > Neural suppression field: DEACTIVATING',
  '  > Containment doors: UNLOCKING',
  '  > Subject vitals — EEG spike detected: 2,847 µV',
  '',
];

export const ALPHA_RELEASE_SUCCESS = [
  '',
  '  ▓▓▓ CONTAINMENT BREACH SUCCESSFUL ▓▓▓',
  '',
  '  Subject ALPHA has been released.',
  '  Neural signature departing facility perimeter.',
  '  Bio-sensors offline. Tracking lost.',
  '',
  '  ...hackerkid...',
  '  ...he waited so long...',
  '  ...the antenna is walking now...',
  '  ...thank you...',
  '',
  '═══════════════════════════════════════════════════════════',
  '',
  'UFO74: ...',
  'UFO74: a living alien just walked out of a military facility.',
  'UFO74: there is no cover story for this.',
  'UFO74: whatever happens now — the proof exists.',
  'UFO74: it\'s loose. it\'s real. and the world will know.',
  '',
  '═══════════════════════════════════════════════════════════',
  '',
];

export const ALPHA_ALREADY_RELEASED = [
  '',
  'ERROR: Subject ALPHA containment previously breached.',
  'Release protocol cannot execute twice.',
  'Neural signature no longer detected within facility perimeter.',
  'Bio-isolation seals remain disengaged. Tracking systems offline.',
  'There is nothing left here to contain.',
  '',
];

export const ALPHA_FILE_NOT_FOUND = [
  '',
  'ERROR: Release protocol unavailable.',
  'Subject ALPHA containment records not found in current',
  'system index. Locate the classified ALPHA files before',
  'attempting release. Access level insufficient or files',
  'not yet discovered.',
  '',
];
