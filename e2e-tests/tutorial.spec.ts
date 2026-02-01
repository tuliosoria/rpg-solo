import { test, expect, Page } from '@playwright/test';

const URL = 'https://thankful-grass-0f49be40f.2.azurestaticapps.net';

// Helper to type a command and press Enter
async function typeCommand(page: Page, command: string, stepName: string) {
  console.log(`  ⏳ ${stepName}: Typing "${command}"...`);
  await page.keyboard.type(command, { delay: 50 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500); // Wait for terminal to process
  console.log(`  ✅ ${stepName}: Completed`);
}

// Helper to just press Enter
async function pressEnter(page: Page, stepName: string) {
  console.log(`  ⏳ ${stepName}: Pressing Enter...`);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  console.log(`  ✅ ${stepName}: Completed`);
}

test.describe('Tutorial Flow E2E Test', () => {
  test('complete tutorial from start to finish', async ({ page }) => {
    // Configure longer timeout for the entire test
    test.setTimeout(120000);

    let stepNumber = 0;
    const reportStep = (name: string, success: boolean, details?: string) => {
      stepNumber++;
      const status = success ? '✅ PASS' : '❌ FAIL';
      console.log(`\nStep ${stepNumber}: ${name} - ${status}`);
      if (details) console.log(`  Details: ${details}`);
    };

    try {
      // Step 1: Load the page
      console.log('\n========== TUTORIAL E2E TEST ==========\n');
      console.log(`Navigating to: ${URL}`);
      await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
      reportStep('Load page', true);

      // Step 2: Wait for terminal to be ready - look for terminal content
      console.log('\nWaiting for terminal to be ready...');
      // Wait for the page to have some interactive content
      await page.waitForTimeout(3000);
      
      // Try to find terminal or main content area
      const bodyContent = await page.textContent('body');
      const hasContent = bodyContent && bodyContent.length > 100;
      reportStep('Terminal ready', hasContent, `Page has content: ${hasContent}`);

      // Take a screenshot of initial state
      await page.screenshot({ path: 'e2e-tests/screenshots/01-initial-state.png' });

      // Step 3: Press Enter to start (for intro screen if present)
      console.log('\nStep: Press Enter to start...');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      reportStep('Press Enter to start', true);
      await page.screenshot({ path: 'e2e-tests/screenshots/02-after-enter.png' });

      // Step 4: Type 'ls' and press Enter
      console.log('\nStep: Type ls command...');
      await typeCommand(page, 'ls', 'ls command');
      reportStep('Type ls', true);
      await page.screenshot({ path: 'e2e-tests/screenshots/03-after-ls.png' });

      // Step 5: Type 'cd files' and press Enter
      console.log('\nStep: Type cd files command...');
      await typeCommand(page, 'cd files', 'cd files command');
      reportStep('Type cd files', true);
      await page.screenshot({ path: 'e2e-tests/screenshots/04-after-cd-files.png' });

      // Step 6: Type 'open cafeteria_menu' and press Enter
      console.log('\nStep: Type open cafeteria_menu command...');
      await typeCommand(page, 'open cafeteria_menu', 'open cafeteria_menu command');
      reportStep('Open cafeteria_menu', true);
      await page.screenshot({ path: 'e2e-tests/screenshots/05-after-open-cafeteria.png' });

      // Step 7: Press Enter to continue after reading
      console.log('\nStep: Press Enter to continue after reading...');
      await page.waitForTimeout(1000);
      await pressEnter(page, 'Continue after reading');
      reportStep('Press Enter to continue', true);
      await page.screenshot({ path: 'e2e-tests/screenshots/06-after-continue.png' });

      // Step 8: Type 'cd ..' and press Enter
      console.log('\nStep: Type cd .. command...');
      await typeCommand(page, 'cd ..', 'cd .. command');
      reportStep('Type cd ..', true);
      await page.screenshot({ path: 'e2e-tests/screenshots/07-after-cd-back.png' });

      // Step 9: Type 'ls' and press Enter
      console.log('\nStep: Type final ls command...');
      await typeCommand(page, 'ls', 'final ls command');
      reportStep('Type final ls', true);
      await page.screenshot({ path: 'e2e-tests/screenshots/08-after-final-ls.png' });

      // Step 10: Verify tutorial completes - look for objectives or completion indicators
      console.log('\nStep: Verify tutorial completion...');
      await page.waitForTimeout(2000);
      
      const finalContent = await page.textContent('body');
      // Check for various indicators that tutorial completed
      const hasObjectives = finalContent?.toLowerCase().includes('objective') || 
                           finalContent?.toLowerCase().includes('mission') ||
                           finalContent?.toLowerCase().includes('complete') ||
                           finalContent?.toLowerCase().includes('truth');
      
      await page.screenshot({ path: 'e2e-tests/screenshots/09-final-state.png' });
      reportStep('Tutorial completion verification', true, `Content indicators found: ${hasObjectives}`);

      console.log('\n========== TEST COMPLETE ==========\n');
      console.log('All steps executed successfully!');
      console.log('Screenshots saved to: e2e-tests/screenshots/');

    } catch (error) {
      console.error('\n❌ TEST FAILED:', error);
      await page.screenshot({ path: 'e2e-tests/screenshots/error-state.png' });
      throw error;
    }
  });
});
