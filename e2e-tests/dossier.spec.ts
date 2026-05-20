import { test, expect, type Page } from '@playwright/test';
import {
  basename,
  extractLeakSequence,
  getCommandInput,
  getContent,
  restoreCommandInput,
  runCommand,
  startLiveRun,
  waitForAllContent,
} from './helpers';

const DOSSIER_FILES = [
  '/internal/admin/budget_request_q1_96.txt',
  '/internal/admin/supplies_request_jan96.txt',
  '/internal/admin/printer_notice.txt',
  '/internal/admin/badge_renewal_memo.txt',
  '/internal/admin/maintenance_schedule.txt',
  '/internal/misc/cafeteria_menu_week03.txt',
  '/internal/misc/cafeteria_menu.txt',
  '/internal/misc/cafeteria_feedback.txt',
  '/internal/misc/vehicle_log_jan96.txt',
  '/internal/misc/parking_regulations.txt',
] as const;

async function saveFileToDossier(page: Page, filePath: string) {
  await runCommand(page, `open ${filePath}`, { waitForInput: false });
  await waitForAllContent(page, [`FILE: ${filePath}`]);
  await restoreCommandInput(page);

  const fileName = basename(filePath);
  await runCommand(page, `save ${fileName}`);
  await waitForAllContent(page, [
    `FILE SAVED TO DOSSIER: ${fileName}`,
  ]);
}

test.describe('Dossier Leak Flow', () => {
  test('can prepare a dossier, unlock the leak sequence, and transmit it', async ({ page }) => {
    test.setTimeout(240000);

    await startLiveRun(page);

    for (const filePath of DOSSIER_FILES.slice(0, 5)) {
      await saveFileToDossier(page, filePath);
    }

    await runCommand(page, 'progress');
    await waitForAllContent(page, [
      'Files saved: 5/10',
      'LEAK PREP AVAILABLE — run "leak" to open the 3-step channel.',
    ]);

    await runCommand(page, 'leak');
    await waitForAllContent(page, ['LEAK CHANNEL ENCRYPTED']);

    const sequenceSource = await getContent(page);
    const leakSequence = extractLeakSequence(sequenceSource);
    expect(leakSequence).toHaveLength(3);

    for (const filePath of DOSSIER_FILES.slice(5)) {
      await saveFileToDossier(page, filePath);
    }

    await runCommand(page, 'progress');
    await waitForAllContent(page, [
      'Files saved: 10/10',
      'DOSSIER COMPLETE',
    ]);

    for (const [index, step] of leakSequence.entries()) {
      await runCommand(page, `leak ${step}`);

      if (index < leakSequence.length - 1) {
        await waitForAllContent(page, [`Step ${index + 1}/3 confirmed.`]);
      } else {
        await waitForAllContent(page, ['PREPARATION SEQUENCE COMPLETE']);
      }
    }

    await expect(getCommandInput(page)).toBeVisible();
    await expect(getCommandInput(page)).toBeEnabled();
    await runCommand(page, 'leak', { waitForInput: false });
    await waitForAllContent(page, ['LEAK TRANSMISSION INITIATED', 'TRANSMISSION SUCCESSFUL.']);

    // After transmission, the engine resolves the dossier to an ending and
    // transitions to the Victory phase. This dossier (7 conspiracy_unrelated
    // + 1 corruption_financial + 2 uncategorized + 0 ufo_core) trips the
    // `wrong_story` priority rule (corruption+conspiracy >= 5 && core <= 1).
    // Verify the Victory AOL page actually renders that ending so a future
    // change to determineEnding() or the Victory pipeline cannot silently
    // break the leak → ending wiring.
    await waitForAllContent(page, [
      'MILITARY BUDGET SCANDAL UNCOVERED IN LEAKED BRAZILIAN DOCUMENTS',
      'THE WRONG STORY',
    ]);
  });
});
