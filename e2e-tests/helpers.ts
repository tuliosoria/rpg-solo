import { expect, type Locator, type Page } from '@playwright/test';

export const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:3000';

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
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await expect(page.getByRole('button', { name: /new game/i })).toBeVisible();
  await waitForAllContent(page, ['VARGINHA', 'TERMINAL 1996', 'Brazilian Intelligence Legacy System, 1996']);
}

export async function openNewGamePrompt(page: Page): Promise<void> {
  await openMainMenu(page);
  await page.getByRole('button', { name: /new game/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: /skip/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /tutorial/i })).toBeVisible();
}

export async function startSkippedRun(page: Page): Promise<void> {
  await openNewGamePrompt(page);
  await page.getByRole('button', { name: /skip/i }).click();
  await waitForAllContent(page, [
    '✓ USER hackerkid REGISTERED',
    'UFO74: Save 10 dossier files. Leak them. Watch your risk.',
    '[UFO74 has disconnected]',
  ]);
  await expect(getCommandInput(page)).toBeVisible();
  await expect(getCommandInput(page)).toBeEnabled();
}

export async function startTutorialRun(page: Page): Promise<void> {
  await openNewGamePrompt(page);
  await page.getByRole('button', { name: /tutorial/i }).click();
  await waitForAllContent(page, ['BRAZILIAN INTELLIGENCE LEGACY SYSTEM', 'TERMINAL ACCESS POINT — NODE 7']);
}

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
