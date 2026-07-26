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

/** True if the given path's basename is one of the secret-ending target files. */
export function isSecretTarget(path: string): boolean {
  const name = path.split('/').pop() || '';
  return secretEndingTargets().some(t => name === t || name.includes(t.replace(/\.[^.]+$/, '')));
}
