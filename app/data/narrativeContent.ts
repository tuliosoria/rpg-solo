// New narrative content for extended gameplay features

import { FileNode } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// UFO74 SECRET IDENTITY FILE
// ═══════════════════════════════════════════════════════════════════════════

export const ufo74_identity_file: FileNode = {
  type: 'file',
  name: 'ghost_in_machine.enc',
  status: 'encrypted',
  content: [
    '═══════════════════════════════════════════════════════════',
    'PERSONAL ARCHIVE - LEGACY SEALED COPY',
    'OWNER: UNKNOWN',
    '═══════════════════════════════════════════════════════════',
    '',
    '[RECOVERED TEXT AVAILABLE THROUGH DIRECT OPEN]',
    '',
    'The old password gate has been retired in this build.',
    'The transfer notice still explains who left this behind.',
  ],
  decryptedFragment: [
    '═══════════════════════════════════════════════════════════',
    'PERSONAL ARCHIVE - FOR MY EYES ONLY',
    'IF YOU ARE READING THIS, YOU FOUND MY SECRET',
    '═══════════════════════════════════════════════════════════',
    '',
    'My name is Carlos Eduardo Ferreira.',
    'In January 1996, I was a 2nd Lieutenant in the Brazilian Air Force.',
    'I was 23 years old.',
    '',
    'I was there when it happened.',
    'I processed the initial reports from Varginha.',
    'I saw the photographs before they were classified.',
    'I read the original field notes.',
    '',
    'And I saw what they did to silence the witnesses.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'I spent 30 years building this archive.',
    'Waiting for someone brave enough to find the truth.',
    '',
    'If you are reading this, you are that person.',
    '',
    'The being I saw... it looked at me.',
    'Not with fear. With understanding.',
    'It knew what we would do.',
    '',
    'I have never been the same.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'My call sign was UFO74.',
    'Now you know who I really am.',
    '',
    '>> THIS FILE TRIGGERS SECRET ENDING <<',
  ],
  accessThreshold: 3,
  requiredFlags: ['adminUnlocked'],
  // Special flag: triggers secret ending when decrypted
};

// ═══════════════════════════════════════════════════════════════════════════
// COUNTDOWN TRIGGER FILES
// ═══════════════════════════════════════════════════════════════════════════

export const intrusion_detected_file: FileNode = {
  type: 'file',
  name: 'active_trace.sys',
  status: 'restricted',
  content: [
    '═══════════════════════════════════════════════════════════',
    'SECURITY ALERT - TRACE REVIEW LOGGED',
    '═══════════════════════════════════════════════════════════',
    '',
    'NOTICE: This monitor reflects an archived incident-response snapshot.',
    '',
    'A prior trace attempt was recorded against this terminal profile.',
    'No live countdown is running from this screen.',
    '',
    'Risk still rises if you keep making noise.',
    '',
    'Use the log as a warning about visibility, not as a timer.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'RECOMMENDED RESPONSE:',
    '  1. Stay deliberate and avoid noisy commands',
    '  2. Review related logs before pushing deeper',
    '  3. Disconnect if detection becomes critical',
  ],
  accessThreshold: 2,
  // Special flag: marks the trace monitor as reviewed
};

// ═══════════════════════════════════════════════════════════════════════════
// HIDDEN COMMANDS DOCUMENTATION
// ═══════════════════════════════════════════════════════════════════════════

export const system_maintenance_notes: FileNode = {
  type: 'file',
  name: 'maintenance_notes.txt',
  status: 'intact',
  content: [
    '═══════════════════════════════════════════════════════════',
    'SYSTEM ADMINISTRATOR NOTES - CONFIDENTIAL',
    '═══════════════════════════════════════════════════════════',
    '',
    'Notes from last maintenance window (1995-12-15):',
    '',
    '1. Legacy recovery system still functional.',
    '   Command: "recover <filename>" to attempt file restoration.',
    '   May partially restore corrupted or deleted files.',
    '',
    '2. Network trace utility remains active.',
    '   Command: "trace" shows active connections.',
    '   Useful for security audits.',
    '',
    '3. Emergency disconnect procedure:',
    '   Command: "disconnect" forces immediate session termination.',
    '   WARNING: All unsaved work will be lost.',
    '',
    '4. Deep scan utility:',
    '   Command: "scan" reveals hidden or system files.',
    '   Requires admin access.',
    '',
    '───────────────────────────────────────────────────────────',
    'ADMINISTRATOR: J.M.S.',
    '═══════════════════════════════════════════════════════════',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// PASSWORD HINT FILE
// ═══════════════════════════════════════════════════════════════════════════

export const personnel_transfer_extended: FileNode = {
  type: 'file',
  name: 'transfer_authorization.txt',
  status: 'intact',
  content: [
    '═══════════════════════════════════════════════════════════',
    'PERSONNEL TRANSFER AUTHORIZATION',
    'DOCUMENT ID: PTA-1996-0120',
    '═══════════════════════════════════════════════════════════',
    '',
    'TRANSFER REQUEST:',
    '  FROM: Base Aérea de Guarulhos',
    '  TO: [REDACTED]',
    '',
    'PERSONNEL:',
    '  2nd Lt. C.E.F.',
    '  Classification: ANALYST',
    '  Clearance Level: RESTRICTED → CLASSIFIED',
    '',
    'REASON FOR TRANSFER:',
    '  Subject demonstrated exceptional aptitude during',
    '  incident processing. Recommended for special projects.',
    '',
    'AUTHORIZATION CODE: varginha1996',
    '',
    'APPROVED BY:',
    '  Col. [REDACTED]',
    '  Division Chief, Special Operations',
    '',
    '───────────────────────────────────────────────────────────',
    'NOTE: This code may be used for secure file access.',
    '═══════════════════════════════════════════════════════════',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// SUBTLE DISINFORMATION FILE
// ═══════════════════════════════════════════════════════════════════════════

export const official_summary_report: FileNode = {
  type: 'file',
  name: 'incident_summary_official.txt',
  status: 'intact',
  content: [
    '═══════════════════════════════════════════════════════════',
    'OFFICIAL INCIDENT SUMMARY',
    'VARGINHA OCCURRENCE - JANUARY 1996',
    'CLASSIFICATION: PUBLIC RELEASE VERSION',
    '═══════════════════════════════════════════════════════════',
    '',
    'SUMMARY:',
    '  On January 20, 1996, multiple civilian reports were filed',
    '  regarding "unusual sightings" in the Jardim Andere area',
    '  of Varginha, Minas Gerais.',
    '',
    'OFFICIAL FINDINGS:',
    '  After thorough investigation, authorities concluded that',
    '  the sightings were the result of:',
    '',
    '  1. A mentally unstable individual ("Mudinho") wandering',
    '     the streets in unusual attire.',
    '',
    '  2. Mass hysteria amplified by recent sensationalist media.',
    '',
    '  3. Misidentification of a local dwarf with skin condition.',
    '',
    'MILITARY INVOLVEMENT:',
    '  Reports of military convoy activity were confirmed as',
    '  routine training exercises unrelated to the sightings.',
    '',
    'HOSPITAL INCIDENTS:',
    '  The death of Officer Marco Cherese was due to natural',
    '  causes (infection) unrelated to any alleged "contact."',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    '[ This file appears to contradict other evidence in the system. ]',
    '[ Cross-reference with field reports reveals inconsistencies. ]',
    '',
    '>> POSSIBLE DISINFORMATION - VERIFY WITH PRIMARY SOURCES <<',
    '',
    '═══════════════════════════════════════════════════════════',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// CIPHER PUZZLE FILE
// ═══════════════════════════════════════════════════════════════════════════

export const cipher_message: FileNode = {
  type: 'file',
  name: 'encoded_transmission.enc',
  status: 'encrypted',
  content: [
    '═══════════════════════════════════════════════════════════',
    'INTERCEPTED TRANSMISSION - ENCODED',
    'DATE: 1996-01-21 03:47:00',
    '═══════════════════════════════════════════════════════════',
    '',
    'CIPHER: ROT13',
    '',
    'ENCODED MESSAGE:',
    '  Gur fcrpvzra vf nyvir.',
    '  Vg jnf zbir gb Pnzcvanf.',
    '  Gurl ner jngpuvat.',
    '',
    '───────────────────────────────────────────────────────────',
    'Apply the ROT13 note above to decode the message.',
    'The old decrypt wrapper is no longer required.',
    '═══════════════════════════════════════════════════════════',
  ],
  decryptedFragment: [
    '═══════════════════════════════════════════════════════════',
    'DECODED TRANSMISSION',
    'DATE: 1996-01-21 03:47:00',
    '═══════════════════════════════════════════════════════════',
    '',
    'DECODED MESSAGE:',
    '  The specimen is alive.',
    '  It was move to Campinas.',
    '  They are watching.',
    '',
    '───────────────────────────────────────────────────────────',
    'ANALYSIS:',
    '  This transmission confirms the transfer of at least one',
    '  captured fauna specimen to a secondary facility.',
    '  Location: Likely UNICAMP research facilities.',
    '',
    '>> EVIDENCE OF SPECIMEN CONTAINMENT <<',
    '═══════════════════════════════════════════════════════════',
  ],
  reveals: ['being_containment'],
  securityQuestion: {
    question: 'Decode the ROT13 cipher. What is the first word of the decoded message?',
    answers: ['the', 'The', 'THE'],
    hint: 'ROT13 shifts each letter by 13 positions. "Gur" becomes...',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// FILE CORRUPTION SPREADER
// ═══════════════════════════════════════════════════════════════════════════

export const unstable_core_dump: FileNode = {
  type: 'file',
  name: 'core_dump_corrupted.bin',
  status: 'unstable',
  content: [
    '═══════════════════════════════════════════════════════════',
    '⚠️ WARNING: UNSTABLE FILE',
    '═══════════════════════════════════════════════════════════',
    '',
    'This file contains corrupted data from a system crash.',
    'Reading this file may cause corruption to spread to',
    'adjacent files in the directory.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    '0x00000000: 4D5A9000 03000000 04000000 FFFF0000',
    '0x00000010: B8000000 00000000 40000000 00000000',
    '0x00000020: [DATA CORRUPTION] [DATA CORRUPTION]',
    '0x00000030: [UNREADABLE] [SECTOR FAILURE]',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'PARTIAL RECOVERY:',
    '  ...specimen exhibited signs of unusual neural activity...',
    '  ...Dr. Badan Palhares confirmed anomalous fauna specimen...',
    '  ...transfer ordered to prevent [CORRUPTED]...',
    '',
    '>> READING THIS FILE HAS DESTABILIZED NEARBY DATA <<',
    '═══════════════════════════════════════════════════════════',
  ],
  corruptible: true,
};
