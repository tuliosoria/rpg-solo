/**
 * Content-integrity guards.
 *
 * These tests protect against a class of silent regression where engine
 * lookup tables drift away from the authored content in `app/data/**`:
 * an ending category can list a file that no longer exists, or a command
 * surface (help text, Tab completion) can advertise something the registry
 * cannot execute. None of these fail loudly at runtime — they just quietly
 * make content unreachable or punish the player.
 */
import { describe, it, expect } from 'vitest';
import { FILE_CATEGORIES } from '../endings';
import { FILESYSTEM_ROOT } from '../../data/virtualFileSystem';
import { commands } from '../commands/index';
import { PUBLIC_COMMANDS } from '../commands/utils';
import type { FileSystemNode } from '../../types';

function collectPaths(node: FileSystemNode, current = '', out: string[] = []): string[] {
  if (node.type === 'file') {
    out.push(current);
    return out;
  }
  for (const [name, child] of Object.entries(node.children)) {
    collectPaths(child, current ? `${current}/${name}` : `/${name}`, out);
  }
  return out;
}

const ALL_PATHS = collectPaths(FILESYSTEM_ROOT);
const ALL_BASENAMES = new Set(ALL_PATHS.map(p => p.split('/').pop()!));

describe('FILE_CATEGORIES integrity', () => {
  it('only lists basenames that exist in the virtual filesystem', () => {
    const missing: string[] = [];

    for (const [category, names] of Object.entries(FILE_CATEGORIES)) {
      for (const name of names as readonly string[]) {
        if (!ALL_BASENAMES.has(name)) {
          missing.push(`${category} -> ${name}`);
        }
      }
    }

    // A category entry that names a non-existent file can never be counted,
    // so it silently raises the bar for the ending it belongs to.
    expect(missing).toEqual([]);
  });

  it('has no duplicate basenames in the filesystem', () => {
    // `save` and `determineEnding` both resolve files by basename, so two
    // files sharing a name would make the dossier ambiguous.
    const seen = new Map<string, string[]>();
    for (const path of ALL_PATHS) {
      const base = path.split('/').pop()!;
      seen.set(base, [...(seen.get(base) ?? []), path]);
    }

    const duplicates = [...seen.entries()]
      .filter(([, paths]) => paths.length > 1)
      .map(([base, paths]) => `${base}: ${paths.join(', ')}`);

    expect(duplicates).toEqual([]);
  });
});

describe('advertised commands are executable', () => {
  it('every PUBLIC_COMMANDS entry has a registered handler', () => {
    // Tab completion and "did you mean" both draw from this list. Offering a
    // command with no handler costs the player detection and an invalid
    // attempt (8 invalid attempts ends the run).
    const orphaned = PUBLIC_COMMANDS.filter(cmd => typeof commands[cmd] !== 'function');
    expect(orphaned).toEqual([]);
  });
});
