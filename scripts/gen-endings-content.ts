/**
 * One-off + repeatable extraction: reads the live ENDINGS (English) and the
 * ending-region translations from RUNTIME_COMMAND_SUPPLEMENT, and writes them
 * to app/data/endingsContent.json as the source of truth.
 *
 * JSON shape:
 *   { <endingId>: {
 *       fields: Omit<GameEnding,'id'>,                      // English
 *       translations: { 'pt-BR': Record<englishString,string>,
 *                       'es': Record<englishString,string> } // owned ending-region entries
 *   } }
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ENDINGS, type EndingId } from '../app/engine/endings';
import { RUNTIME_COMMAND_SUPPLEMENT } from '../app/i18n/runtimeCommandSupplement';

// The English strings each ending contributes (for filtering the supplement).
function englishStringsOf(id: EndingId): string[] {
  const e = ENDINGS[id];
  return [
    e.title, e.subtitle, e.ufo74_final,
    ...e.narrative,
    e.aol.headline, e.aol.subheadline, e.aol.imageAlt,
    ...e.aol.body,
  ];
}

const ids = Object.keys(ENDINGS) as EndingId[];
// Build a global map englishString -> owning endingId (first owner wins).
const owner = new Map<string, EndingId>();
for (const id of ids) for (const s of englishStringsOf(id)) if (!owner.has(s)) owner.set(s, id);

const out: Record<string, unknown> = {};
for (const id of ids) {
  const perLocale: Record<'pt-BR' | 'es', Record<string, string>> = { 'pt-BR': {}, es: {} };
  for (const locale of ['pt-BR', 'es'] as const) {
    const dict = RUNTIME_COMMAND_SUPPLEMENT[locale];
    for (const [en, translated] of Object.entries(dict)) {
      if (owner.get(en) === id) perLocale[locale][en] = translated;
    }
  }
  out[id] = { fields: ENDINGS[id], translations: perLocale };
}

const target = resolve(import.meta.dirname, '../app/data/endingsContent.json');
writeFileSync(target, JSON.stringify(out, null, 2) + '\n', 'utf-8');
console.log(`wrote ${target} (${ids.length} endings)`);
