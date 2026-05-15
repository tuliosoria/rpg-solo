import { test } from '@playwright/test';
import {
  runCommand,
  startLiveRun,
  waitForAllContent,
} from './helpers';

test.describe('Investigation Commands', () => {
  test('search, save, unread, and progress reflect the live investigation flow', async ({ page }) => {
    await startLiveRun(page);

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
      'Use "open <path>" to inspect a result or "save <path>" to keep it.',
    ]);

    await runCommand(page, 'open /internal/misc/cafeteria_menu_week03.txt');
    await waitForAllContent(page, [
      'FILE: /internal/misc/cafeteria_menu_week03.txt',
      'CAFETERIA MENU — WEEK 03 (15-19 JAN 1996)',
    ]);

    await runCommand(page, 'save cafeteria_menu_week03.txt');
    await waitForAllContent(page, [
      'FILE SAVED TO DOSSIER: cafeteria_menu_week03.txt',
      'Dossier: 1/10',
    ]);

    await runCommand(page, 'unread');
    await waitForAllContent(page, ['UNREAD FILES', 'parking_regulations.txt']);
  });
});
