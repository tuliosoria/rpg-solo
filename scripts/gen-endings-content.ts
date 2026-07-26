/**
 * Repeatable extraction: reads the live ENDINGS (English) and the ending-region
 * translations from RUNTIME_COMMAND_SUPPLEMENT's source, and writes them to
 * app/data/endingsContent.json as the source of truth.
 *
 * Translations are attributed to an ending by the `// ENDING N: <id>` comment
 * regions in runtimeCommandSupplement.ts (NOT by matching ENDINGS field strings),
 * so every ending-region entry is captured verbatim — including strings emitted
 * by dynamic producers (government-scandal / alien-revelation / leak-prologue copy)
 * whose English no longer matches a static ENDINGS field. This guarantees the
 * regenerated supplement is byte-identical to the original.
 *
 * JSON shape:
 *   { <endingId>: {
 *       fields: Omit<GameEnding,'id'>,                       // English
 *       translations: { 'pt-BR': Record<string,string>,
 *                       'es': Record<string,string> }        // all ending-region entries
 *   } }
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ENDINGS, type EndingId } from '../app/engine/endings';

type Locale = 'pt-BR' | 'es';

const SUPPLEMENT_PATH = resolve(import.meta.dirname, '../app/i18n/runtimeCommandSupplement.ts');
const source = readFileSync(SUPPLEMENT_PATH, 'utf-8');

const REGION_HEADER = '\u2550\u2550\u2550 Ending translations \u2550\u2550\u2550';
const REGION_END = "'Leak sequence not initialized.':";

function regionText(localeSlice: string): string {
  const start = localeSlice.indexOf(REGION_HEADER);
  if (start === -1) throw new Error('region header not found');
  const end = localeSlice.indexOf(REGION_END, start);
  if (end === -1) throw new Error('region end sentinel not found');
  return localeSlice.slice(start, end);
}

function parseRegion(region: string): Record<string, Record<string, string>> {
  const parts = region.split(/\/\/ ENDING \d+:\s*(\w+)\s*\n/);
  const out: Record<string, Record<string, string>> = {};
  for (let i = 1; i < parts.length; i += 2) {
    const id = parts[i];
    const body = parts[i + 1] ?? '';
    const dict = new Function(`return {${body}};`)() as Record<string, string>;
    out[id] = dict;
  }
  return out;
}

const esStart = source.indexOf('\n  es: {');
if (esStart === -1) throw new Error('es locale object not found');
const ptSlice = source.slice(0, esStart);
const esSlice = source.slice(esStart);

const perLocaleRegions: Record<Locale, Record<string, Record<string, string>>> = {
  'pt-BR': parseRegion(regionText(ptSlice)),
  es: parseRegion(regionText(esSlice)),
};

const ids = Object.keys(ENDINGS) as EndingId[];
const out: Record<string, unknown> = {};
for (const id of ids) {
  out[id] = {
    fields: ENDINGS[id],
    translations: {
      'pt-BR': perLocaleRegions['pt-BR'][id] ?? {},
      es: perLocaleRegions.es[id] ?? {},
    },
  };
}

const target = resolve(import.meta.dirname, '../app/data/endingsContent.json');
writeFileSync(target, JSON.stringify(out, null, 2) + '\n', 'utf-8');
console.log(`wrote ${target} (${ids.length} endings)`);
