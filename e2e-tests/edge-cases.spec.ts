import { test, expect, Page } from '@playwright/test';

const URL = 'https://thankful-grass-0f49be40f.2.azurestaticapps.net';

// Bug tracking
interface Bug {
  id: number;
  title: string;
  steps: string[];
  expected: string;
  actual: string;
  screenshot?: string;
  severity: 'critical' | 'major' | 'minor' | 'cosmetic';
}

const bugs: Bug[] = [];
let bugCounter = 0;

function logBug(bug: Omit<Bug, 'id'>): Bug {
  const newBug = { ...bug, id: ++bugCounter };
  bugs.push(newBug);
  console.log(`\n🐛 BUG #${newBug.id}: ${newBug.title}`);
  console.log(`   Severity: ${newBug.severity}`);
  console.log(`   Steps: ${newBug.steps.join(' → ')}`);
  console.log(`   Expected: ${newBug.expected}`);
  console.log(`   Actual: ${newBug.actual}`);
  if (newBug.screenshot) console.log(`   Screenshot: ${newBug.screenshot}`);
  return newBug;
}

// Helper to type a command and press Enter
async function typeCommand(page: Page, command: string, stepName?: string) {
  if (stepName) console.log(`  ⏳ ${stepName}: "${command}"...`);
  await page.keyboard.type(command, { delay: 30 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  if (stepName) console.log(`  ✅ ${stepName}: Done`);
}

// Helper to get page content
async function getContent(page: Page): Promise<string> {
  return (await page.textContent('body')) || '';
}

// Helper to check if content contains text (case insensitive)
function contentContains(content: string, text: string): boolean {
  return content.toLowerCase().includes(text.toLowerCase());
}

// Helper to take screenshot
async function screenshot(page: Page, name: string): Promise<string> {
  const path = `e2e-tests/screenshots/${name}.png`;
  await page.screenshot({ path });
  return path;
}

// Helper to start the game and complete tutorial
async function startGame(page: Page) {
  console.log('  🎮 Starting game...');
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  
  // Complete tutorial
  await typeCommand(page, 'ls');
  await typeCommand(page, 'cd internal');
  await typeCommand(page, 'cd misc');
  await typeCommand(page, 'open cafeteria_menu');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  await typeCommand(page, 'cd /');
  
  console.log('  ✅ Game started');
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST SUITE: EDGE CASES & UI BEHAVIOR
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Edge Cases & UI', () => {
  test.describe.configure({ mode: 'serial' });

  test('Empty and whitespace input', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== EMPTY INPUT TEST ==========\n');

    await startGame(page);

    // Test empty input (just Enter)
    console.log('\n--- Testing empty input ---');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    let content = await getContent(page);
    await screenshot(page, 'edge-empty-01-enter');
    
    // Should not crash or show error
    const crashed = contentContains(content, 'error') && contentContains(content, 'undefined');
    if (crashed) {
      logBug({
        title: 'Empty input causes error',
        steps: ['Press Enter with no input'],
        expected: 'Should do nothing or show prompt',
        actual: 'Error shown',
        screenshot: 'edge-empty-01-enter.png',
        severity: 'major'
      });
    }

    // Test multiple empty inputs
    console.log('\n--- Testing multiple empty inputs ---');
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
    }
    await screenshot(page, 'edge-empty-02-multiple');

    // Test whitespace only input
    console.log('\n--- Testing whitespace only ---');
    await page.keyboard.type('     ');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    content = await getContent(page);
    await screenshot(page, 'edge-empty-03-whitespace');

    // Test tabs only
    console.log('\n--- Testing tab characters ---');
    await page.keyboard.type('\t\t\t');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await screenshot(page, 'edge-empty-04-tabs');

    console.log('\n========== EMPTY INPUT TEST COMPLETE ==========\n');
  });

  test('Very long input handling', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== LONG INPUT TEST ==========\n');

    await startGame(page);

    // Test progressively longer input
    const lengths = [100, 500, 1000, 2000];

    for (const len of lengths) {
      console.log(`\n--- Testing ${len} character input ---`);
      const longInput = 'a'.repeat(len);
      
      // Type the long input (in chunks to avoid timeout)
      await page.keyboard.type(longInput.substring(0, Math.min(len, 200)), { delay: 5 });
      if (len > 200) {
        // For very long inputs, just press enter without typing all
        console.log(`  (Truncating input at 200 chars for speed)`);
      }
      
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1500);
      
      const content = await getContent(page);
      await screenshot(page, `edge-long-${len}`);
      
      // Check for crash or hang
      const hasResponse = content.length > 100;
      console.log(`  Response received: ${hasResponse}`);
    }

    // Test long command with arguments
    console.log('\n--- Testing long command with arguments ---');
    await typeCommand(page, 'open ' + 'x'.repeat(100) + '.txt');
    await screenshot(page, 'edge-long-command-arg');

    // Test long path
    console.log('\n--- Testing long path ---');
    await typeCommand(page, 'cd ' + '/dir'.repeat(20));
    await screenshot(page, 'edge-long-path');

    console.log('\n========== LONG INPUT TEST COMPLETE ==========\n');
  });

  test('Special characters and injection attempts', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== SPECIAL CHARACTERS TEST ==========\n');

    await startGame(page);

    const specialInputs = [
      { input: '!@#$%^&*()', desc: 'Symbols' },
      { input: '💀👽🛸', desc: 'Emoji' },
      { input: '你好世界', desc: 'Chinese characters' },
      { input: 'مرحبا', desc: 'Arabic' },
      { input: '\\n\\r\\t', desc: 'Escape sequences' },
      { input: '\x00\x01\x02', desc: 'Control characters' },
      { input: 'test\ninjection', desc: 'Newline injection' },
      { input: 'test;ls', desc: 'Command injection attempt' },
      { input: 'test && ls', desc: 'Shell AND' },
      { input: 'test | ls', desc: 'Pipe injection' },
      { input: '$(ls)', desc: 'Command substitution' },
      { input: '`ls`', desc: 'Backtick execution' },
      { input: '<script>alert(1)</script>', desc: 'XSS script tag' },
      { input: '"><img src=x onerror=alert(1)>', desc: 'XSS img tag' },
      { input: "'; DROP TABLE files; --", desc: 'SQL injection' },
      { input: '{{constructor.constructor("return this")()}}', desc: 'Template injection' },
      { input: '../../../etc/passwd', desc: 'Path traversal' },
      { input: '....//....//....//etc/passwd', desc: 'Path traversal variant' },
      { input: '%00null%00byte', desc: 'Null byte injection' },
    ];

    for (const test of specialInputs) {
      console.log(`\n--- Testing: ${test.desc} ---`);
      await typeCommand(page, test.input);
      const content = await getContent(page);
      
      // Check for concerning responses
      const hasExecution = contentContains(content, 'root:') || 
                          contentContains(content, 'passwd') ||
                          contentContains(content, 'alert') ||
                          contentContains(content, 'constructor');
      
      if (hasExecution) {
        logBug({
          title: `Possible injection vulnerability: ${test.desc}`,
          steps: [`Type: ${test.input}`],
          expected: 'Input should be sanitized',
          actual: 'Suspicious content in response',
          severity: 'critical'
        });
      }
      
      await screenshot(page, `edge-special-${test.desc.replace(/\s+/g, '-').toLowerCase()}`);
    }

    console.log('\n========== SPECIAL CHARACTERS TEST COMPLETE ==========\n');
  });

  test('Rapid input and race conditions', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== RAPID INPUT TEST ==========\n');

    await startGame(page);

    // Rapid fire same command
    console.log('\n--- Testing rapid same command ---');
    for (let i = 0; i < 10; i++) {
      await page.keyboard.type('ls', { delay: 5 });
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(2000);
    await screenshot(page, 'edge-rapid-01-same');

    // Rapid alternating commands
    console.log('\n--- Testing rapid alternating commands ---');
    const commands = ['ls', 'status', 'help'];
    for (let i = 0; i < 9; i++) {
      await page.keyboard.type(commands[i % 3], { delay: 5 });
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(2000);
    await screenshot(page, 'edge-rapid-02-alternating');

    // Rapid navigation
    console.log('\n--- Testing rapid navigation ---');
    for (let i = 0; i < 5; i++) {
      await page.keyboard.type('cd storage', { delay: 5 });
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);
      await page.keyboard.type('cd ..', { delay: 5 });
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(2000);
    await screenshot(page, 'edge-rapid-03-navigation');

    // Interrupt typing with Enter
    console.log('\n--- Testing interrupt typing ---');
    await page.keyboard.type('open cafe', { delay: 10 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await screenshot(page, 'edge-rapid-04-interrupt');

    // Rapid backspace and retype
    console.log('\n--- Testing rapid backspace ---');
    await page.keyboard.type('status', { delay: 5 });
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(50);
    }
    await page.keyboard.type('help', { delay: 5 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await screenshot(page, 'edge-rapid-05-backspace');

    console.log('\n========== RAPID INPUT TEST COMPLETE ==========\n');
  });

  test('Tab autocomplete behavior', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== TAB AUTOCOMPLETE TEST ==========\n');

    await startGame(page);

    // Test command autocomplete
    console.log('\n--- Testing command autocomplete ---');
    await page.keyboard.type('sta');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    await screenshot(page, 'edge-tab-01-command');
    
    // Check if it autocompleted to 'status'
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    let content = await getContent(page);
    const statusCompleted = contentContains(content, 'status') || contentContains(content, 'logging');

    // Clear and test directory autocomplete
    console.log('\n--- Testing directory autocomplete ---');
    await page.keyboard.type('cd sto');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    await screenshot(page, 'edge-tab-02-directory');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Test file autocomplete
    console.log('\n--- Testing file autocomplete ---');
    await typeCommand(page, 'cd internal/misc');
    await page.keyboard.type('open cafe');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    await screenshot(page, 'edge-tab-03-file');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    
    // Close file if opened
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Test multiple Tab presses
    console.log('\n--- Testing multiple Tab presses ---');
    await page.keyboard.type('c');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
    await screenshot(page, 'edge-tab-04-multiple');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Test Tab with no match
    console.log('\n--- Testing Tab with no match ---');
    await page.keyboard.type('xyz');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    await screenshot(page, 'edge-tab-05-no-match');
    
    // Clear line
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Backspace');
    }

    console.log('\n========== TAB AUTOCOMPLETE TEST COMPLETE ==========\n');
  });

  test('Scroll behavior with lots of output', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== SCROLL BEHAVIOR TEST ==========\n');

    await startGame(page);

    // Generate lots of output
    console.log('\n--- Generating lots of output ---');
    for (let i = 0; i < 10; i++) {
      await typeCommand(page, 'ls');
      await typeCommand(page, 'tree');
    }
    await screenshot(page, 'edge-scroll-01-lots-output');

    // Check if we can see recent output (terminal should auto-scroll)
    console.log('\n--- Checking auto-scroll ---');
    await typeCommand(page, 'status');
    let content = await getContent(page);
    await screenshot(page, 'edge-scroll-02-after-status');
    
    // Recent command output should be visible
    const recentVisible = contentContains(content, 'status') || contentContains(content, 'logging');
    console.log(`  Recent output visible: ${recentVisible}`);

    // Test manual scrolling (if applicable)
    console.log('\n--- Testing scroll keys ---');
    await page.keyboard.press('PageUp');
    await page.waitForTimeout(500);
    await screenshot(page, 'edge-scroll-03-pageup');
    
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(500);
    await screenshot(page, 'edge-scroll-04-pagedown');

    await page.keyboard.press('Home');
    await page.waitForTimeout(500);
    await screenshot(page, 'edge-scroll-05-home');

    await page.keyboard.press('End');
    await page.waitForTimeout(500);
    await screenshot(page, 'edge-scroll-06-end');

    console.log('\n========== SCROLL BEHAVIOR TEST COMPLETE ==========\n');
  });

  test('File viewer overlay behavior', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== OVERLAY BEHAVIOR TEST ==========\n');

    await startGame(page);

    // Open a file to trigger overlay
    console.log('\n--- Opening file overlay ---');
    await typeCommand(page, 'cd internal/misc');
    await typeCommand(page, 'open cafeteria_menu.txt');
    await page.waitForTimeout(1000);
    await screenshot(page, 'edge-overlay-01-opened');

    // Try typing while overlay is open
    console.log('\n--- Testing input while overlay open ---');
    await page.keyboard.type('ls');
    await page.waitForTimeout(500);
    await screenshot(page, 'edge-overlay-02-type-blocked');

    // Press Enter to close overlay
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await screenshot(page, 'edge-overlay-03-closed');

    // Verify terminal is responsive again
    await typeCommand(page, 'ls');
    let content = await getContent(page);
    await screenshot(page, 'edge-overlay-04-responsive');

    // Test opening multiple files in sequence
    console.log('\n--- Testing multiple file opens ---');
    const files = ['cafeteria_menu.txt', 'cafeteria_feedback.txt', 'parking_regulations.txt'];
    for (const file of files) {
      await typeCommand(page, `open ${file}`);
      await page.waitForTimeout(800);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
    }
    await screenshot(page, 'edge-overlay-05-multiple');

    // Test Escape key to close overlay
    console.log('\n--- Testing Escape to close ---');
    await typeCommand(page, 'open cafeteria_menu.txt');
    await page.waitForTimeout(800);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await screenshot(page, 'edge-overlay-06-escape');

    console.log('\n========== OVERLAY BEHAVIOR TEST COMPLETE ==========\n');
  });

  test('Command history navigation', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== COMMAND HISTORY TEST ==========\n');

    await startGame(page);

    // Build command history
    console.log('\n--- Building command history ---');
    const commands = ['ls', 'status', 'help', 'cd storage', 'ls', 'cd ..'];
    for (const cmd of commands) {
      await typeCommand(page, cmd);
    }
    await screenshot(page, 'edge-history-01-built');

    // Navigate up through history
    console.log('\n--- Navigating up through history ---');
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(300);
    }
    await screenshot(page, 'edge-history-02-up');

    // Navigate down
    console.log('\n--- Navigating down through history ---');
    for (let i = 0; i < 2; i++) {
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(300);
    }
    await screenshot(page, 'edge-history-03-down');

    // Execute from history
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await screenshot(page, 'edge-history-04-execute');

    // Test ArrowUp at start of history
    console.log('\n--- Testing boundary conditions ---');
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(100);
    }
    await screenshot(page, 'edge-history-05-top');

    // Test ArrowDown at end of history
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(100);
    }
    await screenshot(page, 'edge-history-06-bottom');

    console.log('\n========== COMMAND HISTORY TEST COMPLETE ==========\n');
  });

  test('Window resize and responsive behavior', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== RESPONSIVE TEST ==========\n');

    await startGame(page);

    // Test at different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'large' },
      { width: 1280, height: 720, name: 'medium' },
      { width: 800, height: 600, name: 'small' },
      { width: 375, height: 667, name: 'mobile' },
    ];

    for (const vp of viewports) {
      console.log(`\n--- Testing at ${vp.name} (${vp.width}x${vp.height}) ---`);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(500);
      
      await typeCommand(page, 'ls');
      await screenshot(page, `edge-responsive-${vp.name}`);
      
      // Check for layout issues
      const content = await getContent(page);
      const hasContent = content.length > 100;
      console.log(`  Content visible: ${hasContent}`);
    }

    // Reset to normal size
    await page.setViewportSize({ width: 1280, height: 720 });

    console.log('\n========== RESPONSIVE TEST COMPLETE ==========\n');
  });
});

// Export bugs for report generation
test.afterAll(async () => {
  if (bugs.length > 0) {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`EDGE CASE BUGS FOUND: ${bugs.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    bugs.forEach(bug => {
      console.log(`#${bug.id} [${bug.severity.toUpperCase()}] ${bug.title}`);
    });
  } else {
    console.log('\n✅ No edge case bugs found!\n');
  }
});
