/**
 * One-off generator: builds game_story_files/endings.MD
 *
 * Emits a single auditable document containing:
 *   1. All 12 endings (copy + metadata) and the exact save-file combinations
 *      that trigger each one (derived from determineEnding + FILE_CATEGORIES).
 *   2. The file-category reference (which real filenames feed each trigger).
 *   3. The full text of every game file (live filesystem + archive files),
 *      so an auditor can cross-reference leaked files against ending copy.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { FILESYSTEM_ROOT } from '../app/data/virtualFileSystem';
import * as archiveFiles from '../app/data/archiveFiles';
import { ENDINGS, FILE_CATEGORIES, determineEnding } from '../app/engine/endings';
import type { FileNode, FileSystemNode } from '../app/types';

type CollectedFile = {
  path: string;
  name: string;
  status: string;
  isEvidence: boolean;
  requiredFlags?: string[];
  content: string[];
  decryptedFragment?: string[];
  source: string;
};

function isFile(node: FileSystemNode): node is FileNode {
  return node.type === 'file';
}

// ── Walk the live filesystem tree ────────────────────────────────────────────
const collected = new Map<string, CollectedFile>();

function walk(node: FileSystemNode, path: string) {
  if (isFile(node)) {
    collected.set(path, {
      path,
      name: node.name,
      status: node.status,
      isEvidence: node.isEvidence === true,
      requiredFlags: node.requiredFlags,
      content: node.content ?? [],
      decryptedFragment: node.decryptedFragment,
      source: 'virtualFileSystem',
    });
    return;
  }
  for (const [key, child] of Object.entries(node.children)) {
    walk(child, `${path}/${key}`);
  }
}
walk(FILESYSTEM_ROOT, '');

// ── Archive files (rewind mechanic — may not live in the live tree) ───────────
for (const [exportName, value] of Object.entries(archiveFiles)) {
  if (value && typeof value === 'object' && (value as FileNode).type === 'file') {
    const node = value as FileNode;
    const key = `archive:${node.name}`;
    if (![...collected.values()].some(f => f.name === node.name)) {
      collected.set(key, {
        path: `(archive) ${exportName}`,
        name: node.name,
        status: node.status,
        isEvidence: node.isEvidence === true,
        requiredFlags: node.requiredFlags,
        content: node.content ?? [],
        decryptedFragment: node.decryptedFragment,
        source: 'archiveFiles',
      });
    }
  }
}

const files = [...collected.values()].sort((a, b) => a.name.localeCompare(b.name));
const filesByName = new Map<string, CollectedFile>();
for (const f of files) if (!filesByName.has(f.name)) filesByName.set(f.name, f);

// ── Human-readable trigger rules (priority-ordered, mirrors determineEnding) ──
const TRIGGER_RULES: { id: string; priority: number; rule: string }[] = [
  { id: 'hackerkid_caught', priority: 1, rule: '≥ 2 files from **honeypot_trap** saved (obvious decoy files).' },
  { id: 'secret_ending', priority: 2, rule: 'Has **ghost_machine** (`ghost_in_machine.enc`) AND ≥ 1 **alpha_neural** file AND a physicist file (`thirty_year_cycle*` or `projection_update_2026*`) AND a file whose name contains `convergence`.' },
  { id: 'ufo74_exposed', priority: 3, rule: 'Has **ghost_machine** (`ghost_in_machine.enc`) — but not the full secret-ending set above.' },
  { id: 'real_ending', priority: 4, rule: '**ufo_core** ≥ 2 AND **medical_autopsy** ≥ 2 AND **witness** ≥ 1 AND **military_coverup** ≥ 2.' },
  { id: 'wrong_story', priority: 5, rule: '(**corruption_financial** + **conspiracy_unrelated**) ≥ 5 AND **ufo_core** ≤ 1.' },
  { id: 'government_scandal', priority: 6, rule: '**military_coverup** ≥ 4.' },
  { id: 'prisoner_45_freed', priority: 7, rule: '**containment** ≥ 2 AND **witness** ≥ 1.' },
  { id: 'the_2026_warning', priority: 8, rule: '**temporal_convergence** ≥ 2.' },
  { id: 'harvest_understood', priority: 9, rule: '**extraction_harvest** ≥ 2.' },
  { id: 'nothing_changes', priority: 10, rule: '**ufo_core** ≥ 2 AND **medical_autopsy** ≥ 1 AND **military_coverup** ≥ 1.' },
  { id: 'incomplete_picture', priority: 11, rule: 'No single category among {military, medical, witness, core, temporal, harvest} exceeds 2 saved files (scattered dossier), OR the dossier carries hard biological/containment evidence (**medical_autopsy** ≥ 2 OR **containment** ≥ 2) that never cohered into a case.' },
  { id: 'ridiculed', priority: 12, rule: 'Default fallback — weak or incoherent dossier that matches none of the above and carries no multi-file biological/containment evidence.' },
];
const ruleById = new Map(TRIGGER_RULES.map(r => [r.id, r]));

// ── Example save-set per ending (verified against determineEnding) ────────────
function pick(cat: keyof typeof FILE_CATEGORIES, n: number): string[] {
  return FILE_CATEGORIES[cat].slice(0, n);
}
const EXAMPLES: Record<string, string[]> = {
  hackerkid_caught: pick('honeypot_trap', 2),
  secret_ending: ['ghost_in_machine.enc', 'alpha_neural_connection.psi', 'thirty_year_cycle.txt', 'convergence_model_draft.txt'],
  ufo74_exposed: ['ghost_in_machine.enc'],
  real_ending: [...pick('ufo_core', 2), ...pick('medical_autopsy', 2), ...pick('witness', 1), ...pick('military_coverup', 2)],
  wrong_story: [...pick('corruption_financial', 3), ...pick('conspiracy_unrelated', 2)],
  government_scandal: pick('military_coverup', 4),
  prisoner_45_freed: [...pick('containment', 2), ...pick('witness', 1)],
  the_2026_warning: pick('temporal_convergence', 2),
  harvest_understood: pick('extraction_harvest', 2),
  nothing_changes: [...pick('ufo_core', 2), ...pick('medical_autopsy', 1), ...pick('military_coverup', 1)],
  incomplete_picture: [...pick('ufo_core', 1), ...pick('witness', 1)],
  // 3 military files: maxCategory = 3 (> 2, so incomplete_picture is skipped) but
  // military < 4 and no core evidence, so it falls through to the default fallback.
  ridiculed: pick('military_coverup', 3),
};

// Verify each example resolves to its intended ending.
const verification: string[] = [];
for (const [id, names] of Object.entries(EXAMPLES)) {
  const set = new Set(names.map(n => `/x/${n}`));
  const got = determineEnding(set);
  verification.push(`${got === id ? 'OK ' : 'MISMATCH'} ${id} → resolved ${got}`);
}
console.log(verification.join('\n'));

// ── Build the markdown ────────────────────────────────────────────────────────
const out: string[] = [];
const nl = () => out.push('');

out.push('# Varginha: Terminal 1996 — Endings Audit Reference');
nl();
out.push('> **Purpose.** This document is a consistency-audit reference. It maps every ending to the exact combination of leaked (saved) files that triggers it, and includes the full copy of every game file so an auditor can verify that each ending\'s description matches the evidence the player actually leaked.');
nl();
out.push('> **Ending count.** The engine defines **12** endings (`EndingId` in `app/engine/endings.ts`). The original request referenced "10 endings"; all 12 are documented below for completeness — the two extra are the boolean-driven legacy variants that survive in the dossier system (`secret_ending` "The Ferreira Protocol" and `hackerkid_caught`).');
nl();
out.push('**Generated from source** by `scripts/gen-endings-doc.ts` (do not hand-edit — regenerate). Sources of truth:');
out.push('- Ending copy & metadata: `app/engine/endings.ts` → `ENDINGS`');
out.push('- Trigger logic: `app/engine/endings.ts` → `determineEnding()` + `FILE_CATEGORIES`');
out.push('- File copy: `app/data/virtualFileSystem.ts` (`FILESYSTEM_ROOT`) + `app/data/archiveFiles.ts`');
nl();

// How triggering works
out.push('---');
nl();
out.push('## How endings are triggered');
nl();
out.push('When the player finalizes their leak, `determineEnding(savedFiles)` inspects the **basenames** of the saved file paths and counts how many fall into each category in `FILE_CATEGORIES`. Rules are evaluated in **priority order — the first matching rule wins.** A file may belong to more than one category (e.g. `bio_container.log` counts for both `medical_autopsy` and `containment`; `alpha_journal.log` counts for both `ufo_core` and `alpha_neural`).');
nl();
out.push('| Priority | Ending | Trigger condition |');
out.push('|:-------:|:-------|:------------------|');
for (const r of TRIGGER_RULES) {
  out.push(`| ${r.priority} | \`${r.id}\` | ${r.rule} |`);
}
nl();

// Per-ending detail
out.push('---');
nl();
out.push('## Endings — copy, metadata & trigger sets');
nl();

const endingIds = TRIGGER_RULES.slice().sort((a, b) => a.priority - b.priority).map(r => r.id);
for (const id of endingIds) {
  const e = (ENDINGS as Record<string, any>)[id];
  const rule = ruleById.get(id)!;
  out.push(`### ${rule.priority}. ${e.title}  \`(${id})\``);
  nl();
  out.push(`*${e.subtitle}*`);
  nl();
  out.push(`**Trigger:** ${rule.rule}`);
  nl();
  const ex = EXAMPLES[id];
  out.push(`**Minimal example save-set** (resolves to \`${determineEnding(new Set(ex.map(n => '/x/' + n)))}\`):`);
  for (const n of ex) out.push(`- \`${n}\``);
  nl();
  out.push('**Narrative:**');
  nl();
  for (const line of e.narrative) {
    out.push(`> ${line}`);
    out.push('>');
  }
  out.push(`> **[UFO74]:** *${e.ufo74_final}*`);
  nl();
  out.push('**AOL news-article presentation (metadata):**');
  nl();
  out.push('| Field | Value |');
  out.push('|:------|:------|');
  out.push(`| headline | ${e.aol.headline.replace(/\|/g, '\\|')} |`);
  out.push(`| subheadline | ${e.aol.subheadline.replace(/\|/g, '\\|')} |`);
  out.push(`| url | \`${e.aol.url}\` |`);
  out.push(`| imageSrc | \`${e.aol.imageSrc ?? '(none)'}\` |`);
  out.push(`| imageAlt | ${e.aol.imageAlt} |`);
  out.push(`| visitorCount | ${e.aol.visitorCount.toLocaleString('en-US')} |`);
  nl();
  out.push('Article body:');
  nl();
  for (const p of e.aol.body) {
    out.push(`> ${p}`);
    out.push('>');
  }
  nl();
  out.push('---');
  nl();
}

// File category reference
out.push('## File-category reference');
nl();
out.push('The basenames that count toward each trigger category. (Not every file listed here necessarily exists in the shipped filesystem — the category tables are the raw matcher lists from `FILE_CATEGORIES`. A ⚠️ marks category entries with no matching file in the current build.)');
nl();
for (const [cat, names] of Object.entries(FILE_CATEGORIES)) {
  out.push(`### \`${cat}\``);
  for (const n of names as string[]) {
    const exists = filesByName.has(n);
    out.push(`- \`${n}\`${exists ? '' : ' ⚠️ *(no matching file in current build)*'}`);
  }
  nl();
}

// Full file copy
out.push('---');
nl();
out.push('## Full file copy (all game files)');
nl();
out.push(`Total files: **${files.length}**. Each entry shows the in-game path, status, whether it logs evidence, any required flags, and the complete text.`);
nl();
for (const f of files) {
  out.push(`### \`${f.name}\``);
  out.push('');
  out.push(`- **Path:** \`${f.path || '/'}\``);
  out.push(`- **Status:** \`${f.status}\`  ·  **Evidence:** ${f.isEvidence ? 'yes' : 'no'}  ·  **Source:** ${f.source}`);
  if (f.requiredFlags && f.requiredFlags.length) {
    out.push(`- **Required flags:** ${f.requiredFlags.map(x => '`' + x + '`').join(', ')}`);
  }
  out.push('');
  out.push('```text');
  out.push(...(f.content.length ? f.content : ['(empty)']));
  out.push('```');
  if (f.decryptedFragment && f.decryptedFragment.length) {
    out.push('');
    out.push('_Decrypted fragment:_');
    out.push('');
    out.push('```text');
    out.push(...f.decryptedFragment);
    out.push('```');
  }
  out.push('');
}

const target = resolve(process.cwd(), 'game_story_files/endings.MD');
writeFileSync(target, out.join('\n'), 'utf8');
console.log(`\nWrote ${target}\n${files.length} files, 12 endings.`);
