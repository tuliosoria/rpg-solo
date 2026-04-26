import { expect, type Locator, type Page } from '@playwright/test';

export const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:3000';

const ONBOARDING_STEPS = [
  {
    title: 'WHO YOU ARE',
    body: 'You are a hacker. Not the kind they make movies about.',
    prompt: 'press any key to continue.',
  },
  {
    title: 'WHAT HAPPENED',
    body: 'On January 20, 1996, something landed near Varginha, Brazil.',
    prompt: 'press any key to continue.',
  },
  {
    title: 'WHAT YOU NEED TO DO',
    body: 'Navigate the filesystem. Read the files.',
    prompt: 'press any key to continue.',
  },
  {
    title: 'WHO IS WATCHING',
    body: 'You are not alone in that terminal.',
    prompt: 'press any key to continue.',
  },
  {
    title: 'WHAT IS AT STAKE',
    body: 'This is about the future of humanity.',
    prompt: 'press any key to connect.',
  },
] as const;

export async function getContent(page: Page): Promise<string> {
  return await page.locator('body').innerText();
}

export async function waitForContent(page: Page, expected: string | RegExp): Promise<void> {
  const poller = expect.poll(() => getContent(page), {
    timeout: 30000,
    message: `Expected terminal output to include ${String(expected)}`,
  });

  if (typeof expected === 'string') {
    await poller.toContain(expected);
    return;
  }

  await poller.toMatch(expected);
}

export async function waitForAllContent(page: Page, expected: Array<string | RegExp>): Promise<void> {
  for (const value of expected) {
    await waitForContent(page, value);
  }
}

export function getCommandInput(page: Page): Locator {
  return page.getByRole('textbox');
}

export async function openMainMenu(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('terminal1996_introSeen', '1');
  });
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await expect(page.getByRole('button', { name: /new game/i })).toBeVisible();
  await waitForAllContent(page, ['VARGINHA', 'TERMINAL 1996', 'Brazilian Intelligence Legacy System, 1996']);
}

export async function openNewGamePrompt(page: Page): Promise<void> {
  await openMainMenu(page);
  await page.getByRole('button', { name: /new game/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await waitForAllContent(page, [
    ONBOARDING_STEPS[0].title,
    ONBOARDING_STEPS[0].body,
    ONBOARDING_STEPS[0].prompt,
  ]);
}

export async function advanceOnboarding(page: Page): Promise<void> {
  for (const step of ONBOARDING_STEPS) {
    await waitForAllContent(page, [step.title, step.body, step.prompt]);
    await page.keyboard.press('Enter');
  }

  await expect(page.getByRole('button', { name: /skip/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /tutorial/i })).toBeVisible();
}

export async function startTutorialRun(page: Page): Promise<void> {
  await openNewGamePrompt(page);
  await advanceOnboarding(page);
  await page.getByRole('button', { name: /tutorial/i }).click();
  await waitForAllContent(page, [
    'BRAZILIAN INTELLIGENCE LEGACY SYSTEM',
    'TERMINAL ACCESS POINT — NODE 7',
  ]);
}

export async function startLiveRun(page: Page): Promise<void> {
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
    'Your mission: read carefully and save files that strengthen your case.',
    'Use save <filename> after a file proves something.',
    'Once your dossier has 10 files, type leak. no coming back.',
    "Risk hits 100%, you're done. They'll find you.",
    'Type wrong commands 8 times, the window closes. Permanently. So concentrate, kid!',
    'Some files are bait. Opening them spikes detection.',
    '[UFO74 has disconnected]',
  ]);

  await expect(getCommandInput(page)).toBeVisible();
  await expect(getCommandInput(page)).toBeEnabled();
}

export const startSkippedRun = startLiveRun;

export async function runCommand(
  page: Page,
  command: string,
  options: { waitForInput?: boolean } = {}
): Promise<void> {
  const input = getCommandInput(page);
  const previousContent = await getContent(page);

  await expect(input).toBeVisible();
  await expect(input).toBeEnabled();
  await input.fill(command);
  await input.press('Enter');

  await expect.poll(() => getContent(page), { timeout: 30000 }).not.toBe(previousContent);

  if (options.waitForInput !== false) {
    await restoreCommandInput(page);
  }
}

export async function continueStory(page: Page): Promise<void> {
  const previousContent = await getContent(page);
  const continueButton = page.getByRole('button', { name: /Press Enter/i });

  if (await continueButton.isVisible().catch(() => false)) {
    await continueButton.click();
  } else {
    await page.keyboard.press('Enter');
  }

  await expect.poll(() => getContent(page), { timeout: 30000 }).not.toBe(previousContent);
}

export async function restoreCommandInput(page: Page): Promise<void> {
  const input = getCommandInput(page);

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const isVisible = await input.isVisible().catch(() => false);
    const isEnabled = isVisible ? await input.isEnabled().catch(() => false) : false;
    if (isVisible && isEnabled) {
      return;
    }

    await page.keyboard.press('Enter');
    await page.waitForTimeout(250);
  }

  await expect(input).toBeVisible({ timeout: 10000 });
  await expect(input).toBeEnabled({ timeout: 10000 });
}

export function basename(filePath: string): string {
  const parts = filePath.split('/');
  return parts[parts.length - 1] || filePath;
}

export function extractLeakSequence(content: string): string[] {
  return [...content.matchAll(/^\s*\d+\.\s+leak (.+)$/gm)].map((match) => match[1].trim());
}
