import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  contentContains,
  getContent,
  pressEnter,
  screenshot,
  typeCommand,
} from './helpers';

test.describe('Tutorial Flow E2E Test', () => {
  test('completes the current tutorial flow and unlocks gameplay', async ({ page }) => {
    test.setTimeout(180000);

    console.log('\n========== TUTORIAL E2E TEST ==========\n');
    console.log(`Navigating to: ${BASE_URL}`);

    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    let content = await getContent(page);
    expect(content).toContain('BRAZILIAN INTELLIGENCE LEGACY SYSTEM');
    expect(content).toContain('SYSTEM DATE: JANUARY 1996');
    await screenshot(page, '01-initial-state');

    await pressEnter(page, 'Intro step 1');
    content = await getContent(page);
    expect(content).toContain('Connection established.');
    expect(content).toContain("You're inside their system.");
    await screenshot(page, '02-after-intro-step-1');

    await pressEnter(page, 'Intro step 2');
    content = await getContent(page);
    expect(content).toContain('You will be... hackerkid.');
    await screenshot(page, '03-after-intro-step-2');

    await pressEnter(page, 'Intro step 3');
    content = await getContent(page);
    expect(content).toContain('USER hackerkid REGISTERED');
    expect(content).toContain('Type `ls`');
    await screenshot(page, '04-after-intro-step-3');

    await typeCommand(page, 'ls', 'Tutorial command: ls');
    content = await getContent(page);
    expect(contentContains(content, 'Directory: /')).toBe(true);
    expect(contentContains(content, 'storage')).toBe(true);
    expect(contentContains(content, 'internal')).toBe(true);
    await screenshot(page, '05-after-ls');

    await typeCommand(page, 'cd internal', 'Tutorial command: cd internal');
    content = await getContent(page);
    expect(contentContains(content, 'Directory: /internal')).toBe(true);
    expect(contentContains(content, 'misc')).toBe(true);
    await screenshot(page, '06-after-cd-internal');

    await typeCommand(page, 'cd misc', 'Tutorial command: cd misc');
    content = await getContent(page);
    expect(contentContains(content, 'Directory: /internal/misc')).toBe(true);
    expect(contentContains(content, 'cafeteria_menu_week03.txt')).toBe(true);
    await screenshot(page, '07-after-cd-misc');

    await typeCommand(
      page,
      'open cafeteria_menu_week03.txt',
      'Tutorial command: open cafeteria_menu_week03.txt'
    );
    content = await getContent(page);
    expect(content).toContain('CAFETERIA MENU — WEEK 3, JANUARY 1996');
    expect(content).toContain('Coffee machine still OUT OF SERVICE.');
    await screenshot(page, '08-after-open-cafeteria');

    await typeCommand(page, 'cd ..', 'Tutorial command: cd ..');
    content = await getContent(page);
    expect(contentContains(content, '/internal>')).toBe(true);
    expect(contentContains(content, 'Now go back to root')).toBe(true);
    await screenshot(page, '09-after-first-cd-back');

    await typeCommand(page, 'cd ..', 'Tutorial command: cd .. again');
    content = await getContent(page);
    expect(content).toContain('Good. You know enough.');
    expect(content).toContain('Now the real thing.');
    await screenshot(page, '10-after-second-cd-back');

    await pressEnter(page, 'Briefing step 1');
    content = await getContent(page);
    expect(content).toContain('Your mission: find 5 pieces of evidence.');

    await pressEnter(page, 'Briefing step 2');
    content = await getContent(page);
    expect(content).toContain('Risk hits 100%');

    await pressEnter(page, 'Briefing step 3');
    content = await getContent(page);
    expect(content).toContain('Type wrong commands 8 times');

    await pressEnter(page, 'Briefing step 4');
    content = await getContent(page);
    expect(content).toContain('Some files are bait.');

    await pressEnter(page, 'Briefing step 5');
    content = await getContent(page);
    expect(content).toContain('[UFO74 has disconnected]');
    await screenshot(page, '11-after-briefing');

    await typeCommand(page, 'ls', 'Post-tutorial ls');
    content = await getContent(page);
    expect(contentContains(content, 'storage')).toBe(true);
    expect(contentContains(content, 'ops')).toBe(true);
    expect(contentContains(content, 'comms')).toBe(true);
    expect(contentContains(content, 'internal')).toBe(true);
    await screenshot(page, '12-after-post-tutorial-ls');
  });
});
