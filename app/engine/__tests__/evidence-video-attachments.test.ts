import { describe, it, expect } from 'vitest';
import { EVIDENCE_VIDEO_ATTACHMENTS } from '../../components/terminalConstants';
import { FILESYSTEM_ROOT } from '../../data/virtualFileSystem';
import { FileSystemNode } from '../../types';

/**
 * Evidence videos are attached to files by hardcoded absolute path. Nothing at
 * runtime complains when a key points at a path that does not exist — the
 * player simply never sees that video, and the shipped asset is dead weight.
 *
 * `visitor.mp4` was unreachable exactly this way: its attachment was keyed to
 * `/internal/protocols/sanitized/visitor_briefing.txt`, but `sanitized` is a
 * sibling of `protocols`, not a child, so the real path is
 * `/internal/sanitized/visitor_briefing.txt`.
 */
function resolve(path: string): FileSystemNode | null {
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

describe('evidence video attachments', () => {
  const entries = Object.entries(EVIDENCE_VIDEO_ATTACHMENTS);

  it('attaches at least one video', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it('keys every attachment to a file that exists in the live filesystem', () => {
    const unreachable = entries
      .filter(([path]) => resolve(path)?.type !== 'file')
      .map(([path]) => path);

    expect(unreachable).toEqual([]);
  });

  it('keeps each attachment self-consistent', () => {
    const mismatched: string[] = [];

    for (const [path, attachment] of entries) {
      if (attachment.filePath !== path) {
        mismatched.push(`${path}: filePath is "${attachment.filePath}"`);
      }

      const node = resolve(path);
      if (node?.type === 'file' && node.name !== attachment.fileName) {
        mismatched.push(`${path}: fileName is "${attachment.fileName}", node is "${node.name}"`);
      }
    }

    expect(mismatched).toEqual([]);
  });
});
