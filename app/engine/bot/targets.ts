import { FILE_CATEGORIES } from '../endings';

/**
 * Filenames whose presence in the dossier steers determineEnding() toward the
 * secret ending. Derived from the endings source of truth so it never drifts.
 */
export function secretEndingTargets(): string[] {
  return [
    ...FILE_CATEGORIES.ghost_machine,
    ...FILE_CATEGORIES.alpha_neural,
    ...FILE_CATEGORIES.temporal_convergence,
  ];
}

/**
 * The minimal set of files determineEnding() actually requires for the secret
 * ending (endings.ts: hasGhostMachine && hasAlphaNeural && hasPhysicist &&
 * hasConvergence). The dossier caps at 10 slots, so `pro` must save these
 * FIRST before filling remaining slots with other evidence.
 */
export function secretCriticalTargets(): string[] {
  return [
    FILE_CATEGORIES.ghost_machine[0], // ghost_in_machine.enc  -> hasGhostMachine
    FILE_CATEGORIES.alpha_neural[0], // alpha_neural_connection.psi -> hasAlphaNeural
    'convergence_model_draft.txt', // -> hasConvergence
    'thirty_year_cycle.txt', // -> hasPhysicist
  ];
}

/** True if the given path's basename is one of the secret-ending target files. */
export function isSecretTarget(path: string): boolean {
  const name = path.split('/').pop() || '';
  return secretEndingTargets().some(t => name === t || name.includes(t.replace(/\.[^.]+$/, '')));
}
