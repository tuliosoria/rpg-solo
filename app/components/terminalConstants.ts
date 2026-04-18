/**
 * Static data constants used by Terminal.tsx.
 * Extracted to reduce Terminal component file size.
 */

// UFO74 image comment i18n keys — maps image paths to available comment keys
export const UFO74_IMAGE_COMMENT_KEYS: Record<string, string[]> = {
  '/images/crash.webp': [
    'terminal.imageComment.crash1',
    'terminal.imageComment.crash2',
  ],
  '/images/et.webp': [
    'terminal.imageComment.et1',
    'terminal.imageComment.et2',
  ],
  '/images/et-scared.webp': [
    'terminal.imageComment.etScared1',
    'terminal.imageComment.etScared2',
  ],
  '/images/second-ship.webp': ['terminal.imageComment.secondShip1'],
  '/images/drone.webp': ['terminal.imageComment.drone1'],
  '/images/prato-delta.webp': ['terminal.imageComment.pratoDelta1'],
  '/images/et-brain.webp': [
    'terminal.imageComment.etBrain1',
    'terminal.imageComment.etBrain2',
  ],
};

// UFO74 firewall reaction i18n keys
export const UFO74_FIREWALL_REACTION_KEYS = [
  'terminal.firewallReaction.1',
  'terminal.firewallReaction.2',
  'terminal.firewallReaction.3',
  'terminal.firewallReaction.4',
  'terminal.firewallReaction.5',
  'terminal.firewallReaction.6',
  'terminal.firewallReaction.7',
] as const;

// Evidence video attachment metadata
export interface EvidenceVideoAttachment {
  filePath: string;
  fileName: string;
  videoSrc: string;
  videoTitle: string;
}

// Video source URLs resolved at build time
export const JARDIM_ANDERE_INCIDENT_VIDEO_SRC = new URL(
  '../../videos/jardim_andere_incident.mp4',
  import.meta.url
).toString();

export const AUTOPSY_VIDEO_SRC = new URL(
  '../../videos/autopsy.mp4',
  import.meta.url
).toString();

export const THEY_ARE_ALREADY_HERE_VIDEO_SRC = new URL(
  '../../videos/they-are-already-here.mp4',
  import.meta.url
).toString();

export const UFO74_VIDEO_SRC = new URL(
  '../../videos/UFO74.mp4',
  import.meta.url
).toString();

export const TRANSPORT_VIDEO_SRC = new URL(
  '../../videos/transport.mp4',
  import.meta.url
).toString();

export const TURING_TEST_VIDEO_SRC = new URL(
  '../../videos/turing test.mp4',
  import.meta.url
).toString();

export const PRISONER_45_VIDEO_SRC = new URL(
  '../../videos/prisoner 45.mp4',
  import.meta.url
).toString();

export const MIB_VIDEO_SRC = new URL(
  '../../videos/video mib.mp4',
  import.meta.url
).toString();

export const OPERACAO_PRATO_VIDEO_SRC = new URL(
  '../../videos/operacao prato.mp4',
  import.meta.url
).toString();

export const VISITOR_VIDEO_SRC = new URL(
  '../../videos/visitor.mp4',
  import.meta.url
).toString();

export const ET_VARGINHA_VIDEO_SRC = new URL(
  '../../videos/et varginha.mp4',
  import.meta.url
).toString();

// Maps filesystem paths to their attached video evidence
export const EVIDENCE_VIDEO_ATTACHMENTS: Record<string, EvidenceVideoAttachment> = {
  '/internal/jardim_andere_incident.txt': {
    filePath: '/internal/jardim_andere_incident.txt',
    fileName: 'jardim_andere_incident.txt',
    videoSrc: JARDIM_ANDERE_INCIDENT_VIDEO_SRC,
    videoTitle: 'jardim_andere_incident.mp4',
  },
  '/storage/assets/logistics_manifest_fragment.txt': {
    filePath: '/storage/assets/logistics_manifest_fragment.txt',
    fileName: 'logistics_manifest_fragment.txt',
    videoSrc: AUTOPSY_VIDEO_SRC,
    videoTitle: 'autopsy.mp4',
  },
  '/admin/energy_extraction_theory.txt': {
    filePath: '/admin/energy_extraction_theory.txt',
    fileName: 'energy_extraction_theory.txt',
    videoSrc: THEY_ARE_ALREADY_HERE_VIDEO_SRC,
    videoTitle: 'they-are-already-here.mp4',
  },
  '/internal/ghost_in_machine.enc': {
    filePath: '/internal/ghost_in_machine.enc',
    fileName: 'ghost_in_machine.enc',
    videoSrc: UFO74_VIDEO_SRC,
    videoTitle: 'UFO74.mp4',
  },
  '/storage/assets/transport_log_96.txt': {
    filePath: '/storage/assets/transport_log_96.txt',
    fileName: 'transport_log_96.txt',
    videoSrc: TRANSPORT_VIDEO_SRC,
    videoTitle: 'transport.mp4',
  },
  '/ops/mib/recantation_forms/recantation_001.txt': {
    filePath: '/ops/mib/recantation_forms/recantation_001.txt',
    fileName: 'recantation_001.txt',
    videoSrc: MIB_VIDEO_SRC,
    videoTitle: 'video mib.mp4',
  },
  '/ops/prato/operation_prato_original.txt': {
    filePath: '/ops/prato/operation_prato_original.txt',
    fileName: 'operation_prato_original.txt',
    videoSrc: OPERACAO_PRATO_VIDEO_SRC,
    videoTitle: 'operacao prato.mp4',
  },
  '/internal/protocols/sanitized/visitor_briefing.txt': {
    filePath: '/internal/protocols/sanitized/visitor_briefing.txt',
    fileName: 'visitor_briefing.txt',
    videoSrc: VISITOR_VIDEO_SRC,
    videoTitle: 'visitor.mp4',
  },
  '/internal/witness_farm_recording.txt': {
    filePath: '/internal/witness_farm_recording.txt',
    fileName: 'witness_farm_recording.txt',
    videoSrc: ET_VARGINHA_VIDEO_SRC,
    videoTitle: 'et varginha.mp4',
  },
};

// Input normalization sets for video prompt yes/no responses
export const AFFIRMATIVE_VIDEO_PROMPT_INPUTS = new Set(['y', 'yes', 's', 'sim', 'si', 'sí']);
export const NEGATIVE_VIDEO_PROMPT_INPUTS = new Set(['n', 'no', 'nao', 'não']);

// Build/version metadata
export const BUILD_NUMBER = process.env.NEXT_PUBLIC_BUILD_NUMBER;
export const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA || 'unknown';
export const HAS_BUILD_METADATA = !!BUILD_NUMBER && /^\d+$/.test(BUILD_NUMBER) && COMMIT_SHA !== 'unknown';
export const DEPLOY_VERSION = HAS_BUILD_METADATA ? `v0.${BUILD_NUMBER}.0` : 'dev-local';

// CSS-in-JS constant for full-screen overlays
export const SCREEN_OVERLAY_BOUNDS = { position: 'absolute' as const, inset: 0 };
