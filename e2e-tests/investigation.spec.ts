import { test } from '@playwright/test';
import {
  runCommand,
  startSkippedRun,
  waitForAllContent,
} from './helpers';

test.describe('Investigation Commands', () => {
  test('search, bookmark, unread, and progress reflect the live investigation flow', async ({
    page,
  }) => {
    await startSkippedRun(page);

    await runCommand(page, 'progress');
    await waitForAllContent(page, [
      'DOSSIER — LEAK PREPARATION',
      'Files saved: 0/10',
      'No files saved. Use "save <filename>" after reading a file.',
    ]);

    await runCommand(page, 'search parking');
    await waitForAllContent(page, [
      'SEARCH RESULTS',
      'QUERY: parking',
      'parking_regulations.txt',
      'Use "open <path>" to inspect a result or "bookmark <path>" to save it.',
    ]);

    await runCommand(page, 'bookmark /internal/misc/cafeteria_menu_week03.txt');
    await waitForAllContent(page, [
      'Bookmarked: /internal/misc/cafeteria_menu_week03.txt',
      'Use "bookmark" to view all bookmarks',
    ]);

    await runCommand(page, 'bookmark');
    await waitForAllContent(page, [
      'BOOKMARKED FILES',
      'cafeteria_menu_week03.txt',
      '/internal/misc/cafeteria_menu_week03.txt',
    ]);

    await runCommand(page, 'unread');
    await waitForAllContent(page, ['UNREAD FILES', '/internal/misc/cafeteria_menu_week03.txt']);
  });
});
