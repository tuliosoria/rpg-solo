/**
 * Guards every hardcoded virtual-filesystem path in live source.
 *
 * Game code refers to in-world files by absolute string path — video
 * attachments, leak-prologue lists, idle-hint conditions, ending checks. None of
 * those lookups throw when the path is wrong. `filesRead.has(...)` on a path
 * that does not exist is simply always false, and a video keyed to a missing
 * file simply never plays. The content quietly disappears, and only in the
 * branch a tester might not reach.
 *
 * Two shipped bugs of exactly this shape motivated this suite:
 *
 *  - `visitor.mp4` was keyed to `/internal/protocols/sanitized/visitor_briefing.txt`,
 *    but `sanitized` is a sibling of `protocols`, so the video never attached.
 *  - `terminal.idleHint.7` retired itself on `/comms/radio_intercept_log.txt`,
 *    a file that has never existed, so the hint nagged players forever.
 *
 * `evidence-video-attachments.test.ts` covers one such list. This covers the
 * rest by scanning source rather than enumerating call sites, so a path added in
 * a new file is guarded the day it lands.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { FILESYSTEM_ROOT } from '../../data/virtualFileSystem';
import { FileSystemNode } from '../../types';

/**
 * Top-level directories of the in-world filesystem. Used to tell a game path
 * apart from a web asset path or an import specifier, both of which also start
 * with `/` but have nothing to do with the VFS.
 */
const VFS_ROOTS = [
  'internal',
  'ops',
  'storage',
  'comms',
  'admin',
  'archive',
  'personal',
  'system',
  'research',
  'evidence',
];

const VFS_EXTENSIONS = 'txt|log|enc|psi|sig|red|dat|md';

/** Absolute, multi-segment path literal ending in an in-world file extension. */
const PATH_LITERAL = new RegExp(
  `['"\`](\\/(?:[A-Za-z0-9_.-]+\\/)+[A-Za-z0-9_.-]+\\.(?:${VFS_EXTENSIONS}))['"\`]`,
  'g'
);

/**
 * Paths that are deliberately absent from the live filesystem.
 *
 * Each entry needs a reason. This list is the pressure valve that keeps the
 * suite honest: without it the test would have to be deleted the first time a
 * legitimate synthetic path appeared, and the whole class would go unguarded
 * again.
 */
const INTENTIONALLY_ABSENT: Array<{ prefix: string; reason: string }> = [
  {
    // ARCHIVE_FILES are injected into directories only while archive/rewind mode
    // is active; by definition they are not part of the live tree. `open` still
    // consults them, to keep retired archive paths answering "file not found".
    prefix: 'app/data/archiveFiles.ts',
    reason: 'archive-mode overlay files, injected at runtime rather than mounted in the live tree',
  },
];

function resolvePath(path: string): FileSystemNode | null {
  const segments = path.split('/').filter(Boolean);
  let current: FileSystemNode = FILESYSTEM_ROOT;

  for (const segment of segments) {
    if (current.type !== 'dir') return null;
    const child: FileSystemNode | undefined = current.children[segment];
    if (!child) return null;
    current = child;
  }

  return current;
}

function collectSourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      // Tests legitimately name missing paths to assert on their absence.
      if (entry !== 'node_modules' && entry !== '__tests__') collectSourceFiles(full, out);
    } else if (/\.tsx?$/.test(full) && !/\.test\./.test(full)) {
      out.push(full);
    }
  }
  return out;
}

interface Reference {
  path: string;
  file: string;
  line: number;
}

/**
 * Blanks out comments so prose cannot trip the scanner.
 *
 * Comments discuss paths — including, in this very suite and at the fix site,
 * the two broken paths that motivated it. A guard that fails because someone
 * documented a bug trains people to delete the guard, so only real code counts.
 *
 * Quote state is tracked rather than regex-stripped: `'https://…'` contains a
 * `//` that a naive strip would treat as a comment, silently truncating the line
 * and hiding any path literal after it.
 */
function stripComments(source: string): string {
  let out = '';
  let quote: string | null = null;
  let comment: 'line' | 'block' | null = null;

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (comment === 'line') {
      if (ch === '\n') {
        comment = null;
        out += ch;
      }
      continue;
    }

    if (comment === 'block') {
      if (ch === '*' && next === '/') {
        comment = null;
        i++;
      } else if (ch === '\n') {
        // Preserve newlines so reported line numbers stay accurate.
        out += ch;
      }
      continue;
    }

    if (quote) {
      // Skip the escaped character outright; a trailing `\\` must not be read as
      // escaping the closing quote.
      if (ch === '\\') {
        out += ch + (next ?? '');
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      out += ch;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      out += ch;
      continue;
    }

    if (ch === '/' && next === '/') {
      comment = 'line';
      i++;
      continue;
    }

    if (ch === '/' && next === '*') {
      comment = 'block';
      i++;
      continue;
    }

    out += ch;
  }

  return out;
}

function collectPathReferences(): Reference[] {
  const references: Reference[] = [];

  for (const file of collectSourceFiles('app')) {
    const source = stripComments(readFileSync(file, 'utf8'));

    for (const match of source.matchAll(PATH_LITERAL)) {
      const path = match[1];
      if (!VFS_ROOTS.includes(path.split('/')[1])) continue;

      const line = source.slice(0, match.index).split('\n').length;
      references.push({ path, file, line });
    }
  }

  return references;
}

describe('virtual filesystem path references', () => {
  const references = collectPathReferences();

  it('finds the path literals it is meant to guard', () => {
    // Without this, a refactor that moved every path into a data structure the
    // regex no longer matches would leave the suite passing while checking
    // nothing at all.
    expect(references.length).toBeGreaterThan(10);
  });

  it('resolves every path referenced by live game code to a real file', () => {
    const broken = references
      .filter(ref => !INTENTIONALLY_ABSENT.some(entry => ref.file.startsWith(entry.prefix)))
      .filter(ref => resolvePath(ref.path)?.type !== 'file')
      .map(ref => `${ref.file}:${ref.line} → ${ref.path}`);

    expect(broken).toEqual([]);
  });

  it('keeps the intentionally-absent allowlist earning its place', () => {
    // If an allowlisted module stops referencing absent paths, the entry is dead
    // and should be removed rather than left to silence a future real bug.
    const unnecessary = INTENTIONALLY_ABSENT.filter(
      entry =>
        !references.some(ref => ref.file.startsWith(entry.prefix) && resolvePath(ref.path) === null)
    ).map(entry => entry.prefix);

    expect(unnecessary).toEqual([]);
  });
});
