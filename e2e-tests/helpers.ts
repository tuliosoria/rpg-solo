import { type Page } from '@playwright/test';

export const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

export interface Bug {
  id: number;
  title: string;
  steps: string[];
  expected: string;
  actual: string;
  screenshot?: string;
  severity: 'critical' | 'major' | 'minor' | 'cosmetic';
}

export function createBugTracker(suiteName: string) {
  const bugs: Bug[] = [];
  let bugCounter = 0;

  const logBug = (bug: Omit<Bug, 'id'>): Bug => {
    const newBug = { ...bug, id: ++bugCounter };
    bugs.push(newBug);
    console.log(`\n🐛 BUG #${newBug.id}: ${newBug.title}`);
    console.log(`   Severity: ${newBug.severity}`);
    console.log(`   Steps: ${newBug.steps.join(' → ')}`);
    console.log(`   Expected: ${newBug.expected}`);
    console.log(`   Actual: ${newBug.actual}`);
    if (newBug.screenshot) {
      console.log(`   Screenshot: ${newBug.screenshot}`);
    }
    return newBug;
  };

  const reportBugs = () => {
    if (bugs.length > 0) {
      console.log('\n═══════════════════════════════════════════════════════════');
      console.log(`${suiteName.toUpperCase()} BUGS FOUND: ${bugs.length}`);
      console.log('═══════════════════════════════════════════════════════════\n');
      bugs.forEach(bug => {
        console.log(`#${bug.id} [${bug.severity.toUpperCase()}] ${bug.title}`);
      });
      return;
    }

    console.log(`\n✅ No ${suiteName.toLowerCase()} bugs found!\n`);
  };

  return { bugs, logBug, reportBugs };
}

export async function typeCommand(page: Page, command: string, stepName?: string): Promise<void> {
  if (stepName) {
    console.log(`  ⏳ ${stepName}: "${command}"...`);
  }
  await page.keyboard.type(command, { delay: 30 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  if (stepName) {
    console.log(`  ✅ ${stepName}: Done`);
  }
}

export async function pressEnter(page: Page, stepName?: string): Promise<void> {
  if (stepName) {
    console.log(`  ⏳ ${stepName}: Pressing Enter...`);
  }
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  if (stepName) {
    console.log(`  ✅ ${stepName}: Done`);
  }
}

export async function getContent(page: Page): Promise<string> {
  return (await page.textContent('body')) || '';
}

export function contentContains(content: string, text: string): boolean {
  return content.toLowerCase().includes(text.toLowerCase());
}

export async function screenshot(page: Page, name: string): Promise<string> {
  const path = `e2e-tests/screenshots/${name}.png`;
  await page.screenshot({ path });
  return path;
}

export async function startGame(page: Page): Promise<void> {
  console.log(`  🎮 Starting game at ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  await pressEnter(page, 'Intro step 1');
  await pressEnter(page, 'Intro step 2');
  await pressEnter(page, 'Intro step 3');

  await typeCommand(page, 'ls', 'Tutorial: ls');
  await typeCommand(page, 'cd internal', 'Tutorial: cd internal');
  await typeCommand(page, 'cd misc', 'Tutorial: cd misc');
  await typeCommand(
    page,
    'open cafeteria_menu_week03.txt',
    'Tutorial: open cafeteria_menu_week03.txt'
  );
  await typeCommand(page, 'cd ..', 'Tutorial: cd ..');
  await typeCommand(page, 'cd ..', 'Tutorial: cd .. again');

  await pressEnter(page, 'Briefing step 1');
  await pressEnter(page, 'Briefing step 2');
  await pressEnter(page, 'Briefing step 3');
  await pressEnter(page, 'Briefing step 4');
  await pressEnter(page, 'Briefing step 5');

  console.log('  ✅ Tutorial completed, game active');
}
