/**
 * Guards the column alignment of the `help` command table.
 *
 * The table is drawn from one locale string per row, each carrying its own
 * padding: `"  <command>" + spaces + "<description>"`. Nothing computes that
 * padding at runtime, so a row is aligned only because someone counted spaces
 * correctly — and a translated command name is almost never the same length as
 * its English original.
 *
 * That is exactly how this drifted. English was fine, but `es` had 12 ragged
 * rows and `pt-br` 11: the localized names (`progreso`, `esconder`, `vazar`)
 * padded to a different width than the commands that stay English (`ls`,
 * `chat`, `tree`), so the description column zig-zagged down one of the most
 * frequently opened screens in the game — and only for players reading those
 * languages.
 *
 * `boxAlignment.test.ts` cannot catch it: these rows have no `║` borders, so
 * nothing about them looks like a box.
 */
import { describe, it, expect } from 'vitest';
import en from '../../locales/en.json';
import es from '../../locales/es.json';
import ptBr from '../../locales/pt-br.json';

const LOCALES: Array<[string, Record<string, string>]> = [
  ['en', en as Record<string, string>],
  ['es', es as Record<string, string>],
  ['pt-br', ptBr as Record<string, string>],
];

const HELP_MENU_PREFIX = 'engine.commands.system.helpMenu.';

/** The column every description starts at, set by the longest command name. */
const DESCRIPTION_COLUMN = 20;

/**
 * `override protocol <code>` is longer than the command field on its own, and
 * shortening it would misrepresent what the player has to type. It is the one
 * row allowed to run past the column.
 */
const OVERSIZED_ROWS = ['override'];

// Count by code point so accented Latin characters and the ↑/↓ arrows each
// occupy the single terminal column they render as.
const width = (value: string): number => [...value].length;

interface HelpRow {
  key: string;
  name: string;
  value: string;
  command: string;
  descriptionColumn: number;
}

/**
 * Rows of the form `"  <command><padding><description>"`.
 *
 * Commands may contain single spaces (`help [cmd]`, `override protocol <code>`),
 * so the split is on the run of two-or-more spaces, never the first space. A row
 * whose command exactly fills the field is separated by a single space and has
 * no such run — it is already at the column by construction, and is skipped.
 */
function helpRows(table: Record<string, string>): HelpRow[] {
  const rows: HelpRow[] = [];

  for (const [key, value] of Object.entries(table)) {
    if (!key.startsWith(HELP_MENU_PREFIX)) continue;
    if (typeof value !== 'string') continue;
    // Section titles and trailing prose are not table rows.
    if (!/^ {2}\S/.test(value)) continue;

    const match = value.match(/^ {2}(.*?)( {2,})(\S.*)$/);
    if (!match) continue;

    rows.push({
      key,
      name: key.slice(HELP_MENU_PREFIX.length),
      value,
      command: match[1],
      descriptionColumn: 2 + width(match[1]) + match[2].length,
    });
  }

  return rows;
}

describe('help menu column alignment', () => {
  it('finds the rows it is meant to guard', () => {
    // Without this, a refactor that moved the table out of the locale files
    // would leave every assertion below vacuously true.
    for (const [locale, table] of LOCALES) {
      expect(helpRows(table).length, `${locale} has no help rows`).toBeGreaterThan(15);
    }
  });

  it('starts every description at the same column, in every language', () => {
    const ragged: string[] = [];

    for (const [locale, table] of LOCALES) {
      for (const row of helpRows(table)) {
        if (OVERSIZED_ROWS.includes(row.name)) continue;
        if (row.descriptionColumn !== DESCRIPTION_COLUMN) {
          ragged.push(
            `${locale} ${row.name}: description at column ${row.descriptionColumn}, ` +
              `expected ${DESCRIPTION_COLUMN} — ${JSON.stringify(row.value)}`
          );
        }
      }
    }

    expect(ragged).toEqual([]);
  });

  it('keeps every command short enough to reach the column', () => {
    // A command needs at least one space after it, so anything wider than
    // DESCRIPTION_COLUMN - 3 can never align and would silently become a second
    // permanent exception.
    const tooLong: string[] = [];

    for (const [locale, table] of LOCALES) {
      for (const row of helpRows(table)) {
        if (OVERSIZED_ROWS.includes(row.name)) continue;
        if (width(row.command) > DESCRIPTION_COLUMN - 3) {
          tooLong.push(`${locale} ${row.name}: "${row.command}" is ${width(row.command)} chars`);
        }
      }
    }

    expect(tooLong).toEqual([]);
  });

  it('keeps the oversized-row exemption earning its place', () => {
    // If a translation shortens one of these enough to fit, the exemption
    // should go rather than quietly hide a future misalignment.
    const nowFits: string[] = [];

    for (const [locale, table] of LOCALES) {
      for (const row of helpRows(table)) {
        if (!OVERSIZED_ROWS.includes(row.name)) continue;
        if (width(row.command) <= DESCRIPTION_COLUMN - 3) {
          nowFits.push(`${locale} ${row.name}: "${row.command}" now fits — drop the exemption`);
        }
      }
    }

    expect(nowFits).toEqual([]);
  });
});
