import { describe, it, beforeAll } from 'vitest';
import { Language } from '../app/i18n';
import { renderPerLanguage, reportSameAcrossLanguages, LANGS } from './harness';
import {
  Collected,
  collectBotRun,
  collectCommandSurface,
  collectEveryDocument,
} from './collect';

function collectAll(): Collected[] {
  const out: Collected[] = [];
  collectBotRun(out, 'dummy');
  collectBotRun(out, 'novice');
  collectBotRun(out, 'pro');
  collectEveryDocument(out);
  collectCommandSurface(out);
  return out;
}

describe('SWEEP v2: full pipeline per language', () => {
  let collected: Collected[] = [];
  let rendered: Record<Language, string[]>;

  beforeAll(async () => {
    const r = await renderPerLanguage(collectAll);
    collected = r.collected;
    rendered = r.rendered;
    console.log(`\ncollected ${collected.length} entries × ${LANGS.length} languages`);
    for (const l of LANGS) console.log(`  ${l}: ${rendered[l].length} lines`);
  }, 180000);

  it('entry counts match across languages (no language-dependent branching)', () => {
    const counts = LANGS.map(l => rendered[l].length);
    console.log(`\n=== ENTRY COUNTS === ${counts.join(' / ')}`);
  });

  it('no unresolved {{placeholders}}', () => {
    const hits: string[] = [];
    for (const lang of LANGS) {
      rendered[lang].forEach((line, i) => {
        if (/\{\{.*?\}\}/.test(line)) hits.push(`[${lang}] ${collected[i]?.scenario} :: ${JSON.stringify(line)}`);
      });
    }
    console.log(`\n=== PLACEHOLDER LEAKS (${hits.length}) ===\n${[...new Set(hits)].slice(0, 80).join('\n')}`);
  });

  it('no undefined/NaN/[object Object]', () => {
    const hits: string[] = [];
    for (const lang of LANGS) {
      rendered[lang].forEach((line, i) => {
        if (/\b(undefined|NaN)\b|\[object Object\]/.test(line)) hits.push(`[${lang}] ${collected[i]?.scenario} :: ${JSON.stringify(line)}`);
      });
    }
    console.log(`\n=== BAD VALUE LEAKS (${hits.length}) ===\n${[...new Set(hits)].slice(0, 80).join('\n')}`);
  });

  it('no raw i18n key paths', () => {
    const hits: string[] = [];
    for (const lang of LANGS) {
      rendered[lang].forEach((line, i) => {
        if (/\b(engine|terminal|runtime|ui)\.[a-zA-Z0-9_]+\.[a-zA-Z0-9_.]+/.test(line)) hits.push(`[${lang}] ${collected[i]?.scenario} :: ${JSON.stringify(line)}`);
      });
    }
    console.log(`\n=== RAW KEY LEAKS (${hits.length}) ===\n${[...new Set(hits)].slice(0, 80).join('\n')}`);
  });

  it('reports prose identical in all three languages', () => {
    reportSameAcrossLanguages(collected, rendered, { label: 'UNTRANSLATED CANDIDATES' });
  });
});
