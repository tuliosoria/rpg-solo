import { test, expect } from '@playwright/test';
import {
  continueStory,
  getCommandInput,
  restoreCommandInput,
  runCommand,
  startTutorialRun,
  waitForAllContent,
} from './helpers';

test.describe('Interactive Tutorial', () => {
  test('walks through the gated tutorial and unlocks live play', async ({ page }) => {
    test.setTimeout(180000);

    await startTutorialRun(page);

    await continueStory(page);
    await waitForAllContent(page, [
      'Connection established.',
      "You're inside their system. Don't panic.",
    ]);

    await continueStory(page);
    await waitForAllContent(page, [
      "Hey kid! I'll create a user for you so you can investigate.",
      'You will be... hackerkid.',
    ]);

    await continueStory(page);
    await waitForAllContent(page, ['✓ USER hackerkid REGISTERED', 'Type ls']);

    await runCommand(page, 'ls');
    await waitForAllContent(page, ['Directory: /', 'comms/', 'internal/', 'ops/', 'tmp/']);

    await runCommand(page, 'cd internal');
    await waitForAllContent(page, ['Directory: /internal', 'misc']);

    await runCommand(page, 'cd misc');
    await waitForAllContent(page, ['Directory: /internal/misc', 'cafeteria_menu_week03.txt']);

    await runCommand(page, 'open cafeteria_menu_week03.txt', { waitForInput: false });
    await waitForAllContent(page, [
      'CAFETERIA MENU — WEEK 3, JANUARY 1996',
      'Coffee machine still OUT OF SERVICE.',
    ]);
    await restoreCommandInput(page);

    await runCommand(page, 'cd ..');
    await waitForAllContent(page, ['/internal>', 'Now go back to root.']);

    await runCommand(page, 'cd ..');
    await waitForAllContent(page, ['/>', 'Now the real thing.']);
    await waitForAllContent(page, [
      '/>',
      'Your mission: save 10 files to your dossier.',
      'Use save <filename> after reading a file.',
      'Once your dossier has 10 files, type leak.',
      "Risk hits 100%, you're done. They'll find you.",
      'Type wrong commands 8 times, the window closes. Permanently. So concentrate, kid!',
      'Some files are bait. Opening them spikes detection.',
      '[UFO74 has disconnected]',
    ]);

    await expect(getCommandInput(page)).toBeVisible();
    await expect(getCommandInput(page)).toBeEnabled();
  });
});
