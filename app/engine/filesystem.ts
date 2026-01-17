// Filesystem resolver and navigation

import { FileSystemNode, DirectoryNode, FileNode, GameState, FileMutation } from '../types';
import { FILESYSTEM_ROOT } from '../data/filesystem';

export function resolvePath(path: string, currentPath: string): string {
  // Handle absolute vs relative paths
  let segments: string[];
  
  if (path.startsWith('/')) {
    segments = path.split('/').filter(Boolean);
  } else {
    const currentSegments = currentPath.split('/').filter(Boolean);
    const newSegments = path.split('/').filter(Boolean);
    segments = [...currentSegments, ...newSegments];
  }
  
  // Handle .. and .
  const resolved: string[] = [];
  for (const seg of segments) {
    if (seg === '..') {
      resolved.pop();
    } else if (seg !== '.') {
      resolved.push(seg);
    }
  }
  
  return '/' + resolved.join('/');
}

export function getNode(path: string, state: GameState): FileSystemNode | null {
  const segments = path.split('/').filter(Boolean);
  let current: FileSystemNode = FILESYSTEM_ROOT;
  
  for (const segment of segments) {
    if (current.type !== 'dir') return null;
    const child: FileSystemNode | undefined = current.children[segment];
    if (!child) return null;
    
    // Check access requirements
    if (child.requiredFlags) {
      const hasAllFlags = child.requiredFlags.every((f: string) => state.flags[f]);
      if (!hasAllFlags) return null;
    }
    
    if (child.accessThreshold && state.accessLevel < child.accessThreshold) {
      return null;
    }
    
    current = child;
  }
  
  return current;
}

export function listDirectory(path: string, state: GameState): { name: string; type: 'dir' | 'file'; status?: string }[] | null {
  const node = getNode(path, state);
  if (!node || node.type !== 'dir') return null;
  
  const entries: { name: string; type: 'dir' | 'file'; status?: string }[] = [];
  
  for (const [name, child] of Object.entries(node.children)) {
    // Check visibility requirements
    if (child.requiredFlags) {
      const hasAllFlags = child.requiredFlags.every(f => state.flags[f]);
      if (!hasAllFlags) continue;
    }
    
    if (child.accessThreshold && state.accessLevel < child.accessThreshold) {
      continue;
    }
    
    // Check if file is deleted
    const fullPath = path === '/' ? `/${name}` : `${path}/${name}`;
    const mutation = state.fileMutations[fullPath];
    if (mutation?.deleted) continue;
    
    entries.push({
      name: child.type === 'dir' ? `${name}/` : name,
      type: child.type,
      status: child.type === 'file' ? (child as FileNode).status : undefined,
    });
  }
  
  return entries.sort((a, b) => {
    // Directories first, then files
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export function getFileContent(path: string, state: GameState, decrypted: boolean = false): string[] | null {
  const node = getNode(path, state);
  if (!node || node.type !== 'file') return null;
  
  const file = node as FileNode;
  const mutation = state.fileMutations[path];
  
  // Check if deleted or locked
  if (mutation?.deleted) return null;
  if (mutation?.locked) return ['[FILE LOCKED]'];
  
  // Get base content
  let content: string[];
  if (decrypted && file.decryptedFragment && mutation?.decrypted) {
    content = [...file.decryptedFragment];
  } else if (file.status === 'encrypted' && !mutation?.decrypted) {
    return ['[ENCRYPTED - DECRYPTION REQUIRED]'];
  } else {
    content = [...file.content];
  }
  
  // Time-sensitive content degradation
  // Files with 'time_sensitive' in content become partially corrupted after 30 commands
  const commandCount = state.sessionCommandCount || 0;
  const isTimeSensitive = file.content.some((line: string) => 
    line.includes('TIME-SENSITIVE') || 
    line.includes('[EARLY SESSION ONLY]') ||
    path.includes('early_') ||
    path.includes('initial_')
  );
  
  if (isTimeSensitive && commandCount > 30) {
    // Progressively corrupt time-sensitive files
    const corruptionLevel = Math.min(Math.floor((commandCount - 30) / 10), 5);
    content = content.map((line: string, idx: number) => {
      if (idx === 0 || idx === content.length - 1) return line; // Keep first/last line
      if (Math.random() < corruptionLevel * 0.15) {
        return '[DATA DEGRADED - RETRIEVAL WINDOW EXCEEDED]';
      }
      return line;
    });
    
    if (corruptionLevel >= 3) {
      content.push('');
      content.push('[WARNING: File integrity compromised due to delayed access]');
    }
  }
  
  // Apply mutations (corruption)
  if (mutation) {
    for (const lineIdx of mutation.corruptedLines || []) {
      if (lineIdx < content.length) {
        content[lineIdx] = '[DATA LOSS]';
      }
    }
    
    if (mutation.truncatedLine !== undefined && mutation.truncatedLine < content.length) {
      const line = content[mutation.truncatedLine];
      const cutPoint = Math.floor(line.length * 0.4);
      content[mutation.truncatedLine] = line.substring(0, cutPoint) + '—[CORRUPTION]';
    }
  }
  
  return content;
}

export function canAccessFile(path: string, state: GameState): { accessible: boolean; reason?: string } {
  const node = getNode(path, state);
  if (!node) return { accessible: false, reason: 'FILE NOT FOUND' };
  if (node.type !== 'file') return { accessible: false, reason: 'NOT A FILE' };
  
  const file = node as FileNode;
  const mutation = state.fileMutations[path];
  
  if (mutation?.deleted) return { accessible: false, reason: 'FILE DELETED' };
  if (mutation?.locked) return { accessible: false, reason: 'FILE LOCKED' };
  
  if (file.status === 'restricted' || file.status === 'restricted_briefing') {
    if (file.accessThreshold && state.accessLevel < file.accessThreshold) {
      return { accessible: false, reason: 'ACCESS DENIED - CLEARANCE INSUFFICIENT' };
    }
    if (!state.flags.adminUnlocked && path.startsWith('/admin')) {
      return { accessible: false, reason: 'ACCESS DENIED - RESTRICTED ARCHIVE' };
    }
  }
  
  return { accessible: true };
}

export function getFileReveals(path: string): string[] {
  const segments = path.split('/').filter(Boolean);
  let current: FileSystemNode = FILESYSTEM_ROOT;
  
  for (const segment of segments) {
    if (current.type !== 'dir') return [];
    const child: FileSystemNode | undefined = current.children[segment];
    if (!child) return [];
    current = child;
  }
  
  if (current.type === 'file') {
    return (current as FileNode).reveals || [];
  }
  
  return [];
}
