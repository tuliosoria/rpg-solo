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
  if (stepName) console.log(`  ⏳ ${stepName}: Typing "${command}"...`);
  await page.keyboard.type(command, { delay: 30 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  if (stepName) console.log(`  ✅ ${stepName}: Completed`);
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

// Helper to start the game (complete tutorial quickly)
async function startGame(page: Page) {
  console.log('  🎮 Starting game and completing tutorial...');
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  // Press Enter to start
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  
  // Complete tutorial: ls → cd files → open cafeteria_menu → Enter → cd ..
  await typeCommand(page, 'ls');
  await typeCommand(page, 'cd files');
  
  // Check if we're in tutorial - if "files" doesn't exist, we might be in a different state
  const content = await getContent(page);
  if (contentContains(content, 'no such directory') || contentContains(content, 'not found')) {
    // Try internal/misc which should have cafeteria_menu
    await typeCommand(page, 'cd internal');
    await typeCommand(page, 'cd misc');
  }
  
  await typeCommand(page, 'open cafeteria_menu');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  await typeCommand(page, 'cd ..');
  await typeCommand(page, 'cd ..');
  await typeCommand(page, 'ls');
  
  console.log('  ✅ Tutorial completed, game active');
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST SUITE: ALL COMMANDS
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Command Tests', () => {
  test.describe.configure({ mode: 'serial' });

  test('Core Commands - ls, cd, open, help, status, clear', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== CORE COMMANDS TEST ==========\n');

    await startGame(page);
    await screenshot(page, 'commands-01-after-tutorial');

    // Test ls
    console.log('\n--- Testing ls command ---');
    await typeCommand(page, 'ls', 'ls command');
    let content = await getContent(page);
    await screenshot(page, 'commands-02-ls');
    
    // Should show directories
    const hasDirectories = contentContains(content, 'storage') || 
                          contentContains(content, 'ops') || 
                          contentContains(content, 'comms') ||
                          contentContains(content, 'internal');
    if (!hasDirectories) {
      logBug({
        title: 'ls command does not show expected directories',
        steps: ['Complete tutorial', 'cd to root', 'Type ls'],
        expected: 'Should show storage, ops, comms, internal directories',
        actual: `Content: ${content.substring(0, 200)}...`,
        screenshot: 'commands-02-ls.png',
        severity: 'major'
      });
    }
    expect(hasDirectories).toBe(true);

    // Test cd
    console.log('\n--- Testing cd command ---');
    await typeCommand(page, 'cd storage', 'cd storage');
    content = await getContent(page);
    await screenshot(page, 'commands-03-cd-storage');
    
    await typeCommand(page, 'ls', 'ls in storage');
    content = await getContent(page);
    const hasStorageContents = contentContains(content, 'assets') || contentContains(content, 'quarantine');
    if (!hasStorageContents) {
      logBug({
        title: 'storage directory does not show expected subdirectories',
        steps: ['cd storage', 'ls'],
        expected: 'Should show assets and quarantine',
        actual: `Content: ${content.substring(0, 200)}...`,
        screenshot: 'commands-03-cd-storage.png',
        severity: 'major'
      });
    }
    
    // Test cd ..
    console.log('\n--- Testing cd .. command ---');
    await typeCommand(page, 'cd ..', 'cd ..');
    await typeCommand(page, 'ls');
    content = await getContent(page);
    await screenshot(page, 'commands-04-cd-back');
    
    // Test help
    console.log('\n--- Testing help command ---');
    await typeCommand(page, 'help', 'help command');
    content = await getContent(page);
    await screenshot(page, 'commands-05-help');
    
    const hasHelpOutput = contentContains(content, 'TERMINAL COMMANDS') || 
                          contentContains(content, 'ls') && contentContains(content, 'cd');
    if (!hasHelpOutput) {
      logBug({
        title: 'help command does not show command list',
        steps: ['Type help'],
        expected: 'Should show TERMINAL COMMANDS and list of commands',
        actual: `Content: ${content.substring(0, 300)}...`,
        screenshot: 'commands-05-help.png',
        severity: 'major'
      });
    }
    expect(hasHelpOutput).toBe(true);

    // Test status
    console.log('\n--- Testing status command ---');
    await typeCommand(page, 'status', 'status command');
    content = await getContent(page);
    await screenshot(page, 'commands-06-status');
    
    const hasStatusOutput = contentContains(content, 'SYSTEM STATUS') || 
                           contentContains(content, 'LOGGING') ||
                           contentContains(content, 'detection');
    if (!hasStatusOutput) {
      logBug({
        title: 'status command does not show system status',
        steps: ['Type status'],
        expected: 'Should show SYSTEM STATUS with detection info',
        actual: `Content: ${content.substring(0, 300)}...`,
        screenshot: 'commands-06-status.png',
        severity: 'major'
      });
    }
    expect(hasStatusOutput).toBe(true);

    // Test clear
    console.log('\n--- Testing clear command ---');
    await typeCommand(page, 'clear', 'clear command');
    await screenshot(page, 'commands-07-clear');
    // Clear should work without errors - just verify no crash

    // Test progress
    console.log('\n--- Testing progress command ---');
    await typeCommand(page, 'progress', 'progress command');
    content = await getContent(page);
    await screenshot(page, 'commands-08-progress');
    
    const hasProgressOutput = contentContains(content, 'progress') || 
                             contentContains(content, 'evidence') ||
                             contentContains(content, 'truth') ||
                             contentContains(content, 'investigation');
    expect(hasProgressOutput).toBe(true);

    // Test tree
    console.log('\n--- Testing tree command ---');
    await typeCommand(page, 'tree', 'tree command');
    content = await getContent(page);
    await screenshot(page, 'commands-09-tree');

    // Test notes system
    console.log('\n--- Testing notes system ---');
    await typeCommand(page, 'note This is a test note', 'note command');
    content = await getContent(page);
    await screenshot(page, 'commands-10-note');
    
    await typeCommand(page, 'notes', 'notes command');
    content = await getContent(page);
    await screenshot(page, 'commands-11-notes');
    const hasNote = contentContains(content, 'test note') || contentContains(content, 'note');

    // Test bookmark system
    console.log('\n--- Testing bookmark system ---');
    await typeCommand(page, 'bookmark', 'bookmark list');
    content = await getContent(page);
    await screenshot(page, 'commands-12-bookmark');

    // Test unread
    console.log('\n--- Testing unread command ---');
    await typeCommand(page, 'unread', 'unread command');
    content = await getContent(page);
    await screenshot(page, 'commands-13-unread');

    // Test map
    console.log('\n--- Testing map command ---');
    await typeCommand(page, 'map', 'map command');
    content = await getContent(page);
    await screenshot(page, 'commands-14-map');

    // Test tutorial command
    console.log('\n--- Testing tutorial command ---');
    await typeCommand(page, 'tutorial', 'tutorial command');
    content = await getContent(page);
    await screenshot(page, 'commands-15-tutorial');

    console.log('\n========== CORE COMMANDS TEST COMPLETE ==========\n');
  });

  test('File Commands - open, last, decrypt', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== FILE COMMANDS TEST ==========\n');

    await startGame(page);

    // Navigate to a directory with files
    await typeCommand(page, 'cd internal');
    await typeCommand(page, 'cd misc');
    await typeCommand(page, 'ls');
    
    let content = await getContent(page);
    await screenshot(page, 'file-commands-01-ls-misc');

    // Test open command
    console.log('\n--- Testing open command ---');
    await typeCommand(page, 'open cafeteria_menu', 'open cafeteria_menu');
    content = await getContent(page);
    await screenshot(page, 'file-commands-02-open');
    
    // Should show file content
    const hasFileContent = contentContains(content, 'menu') || 
                          contentContains(content, 'cafeteria') ||
                          content.length > 500;
    expect(hasFileContent).toBe(true);

    // Press Enter to close file viewer
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Test last command
    console.log('\n--- Testing last command ---');
    await typeCommand(page, 'last', 'last command');
    content = await getContent(page);
    await screenshot(page, 'file-commands-03-last');
    
    // Should re-display last file
    const hasLastFile = contentContains(content, 're-reading') || 
                       contentContains(content, 'cafeteria') ||
                       contentContains(content, 'menu');

    // Navigate to comms for encrypted files
    console.log('\n--- Testing decrypt command ---');
    await typeCommand(page, 'cd /');
    await typeCommand(page, 'cd comms');
    await typeCommand(page, 'cd psi');
    await typeCommand(page, 'ls');
    content = await getContent(page);
    await screenshot(page, 'file-commands-04-comms-psi');

    // Try decrypt on an .enc file
    await typeCommand(page, 'decrypt transcript_core.enc', 'decrypt');
    content = await getContent(page);
    await screenshot(page, 'file-commands-05-decrypt');

    console.log('\n========== FILE COMMANDS TEST COMPLETE ==========\n');
  });

  test('Invalid Commands and Error Handling', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== INVALID COMMANDS TEST ==========\n');

    await startGame(page);

    // Test completely invalid command
    console.log('\n--- Testing invalid command ---');
    await typeCommand(page, 'asdfqwerty', 'invalid command');
    let content = await getContent(page);
    await screenshot(page, 'invalid-01-unknown');
    
    const hasErrorMessage = contentContains(content, 'unknown') || 
                           contentContains(content, 'not recognized') ||
                           contentContains(content, 'invalid') ||
                           contentContains(content, 'command not found') ||
                           contentContains(content, 'error');
    if (!hasErrorMessage) {
      logBug({
        title: 'Invalid command does not show error message',
        steps: ['Type random invalid command'],
        expected: 'Should show unknown command or error message',
        actual: `No error shown. Content: ${content.substring(0, 200)}...`,
        screenshot: 'invalid-01-unknown.png',
        severity: 'minor'
      });
    }

    // Test cd to non-existent directory
    console.log('\n--- Testing cd to non-existent directory ---');
    await typeCommand(page, 'cd nonexistentdir', 'cd nonexistent');
    content = await getContent(page);
    await screenshot(page, 'invalid-02-cd-nonexistent');
    
    const hasCdError = contentContains(content, 'not found') || 
                      contentContains(content, 'no such') ||
                      contentContains(content, 'does not exist') ||
                      contentContains(content, 'error');
    if (!hasCdError) {
      logBug({
        title: 'cd to non-existent directory does not show error',
        steps: ['Type cd nonexistentdir'],
        expected: 'Should show directory not found error',
        actual: `No error shown. Content: ${content.substring(0, 200)}...`,
        screenshot: 'invalid-02-cd-nonexistent.png',
        severity: 'minor'
      });
    }

    // Test open non-existent file
    console.log('\n--- Testing open non-existent file ---');
    await typeCommand(page, 'open fakefile.txt', 'open nonexistent');
    content = await getContent(page);
    await screenshot(page, 'invalid-03-open-nonexistent');
    
    const hasOpenError = contentContains(content, 'not found') || 
                        contentContains(content, 'no such') ||
                        contentContains(content, 'does not exist') ||
                        contentContains(content, 'error');
    if (!hasOpenError) {
      logBug({
        title: 'open non-existent file does not show error',
        steps: ['Type open fakefile.txt'],
        expected: 'Should show file not found error',
        actual: `No error shown. Content: ${content.substring(0, 200)}...`,
        screenshot: 'invalid-03-open-nonexistent.png',
        severity: 'minor'
      });
    }

    // Test cd with no argument
    console.log('\n--- Testing cd with no argument ---');
    await typeCommand(page, 'cd', 'cd no args');
    content = await getContent(page);
    await screenshot(page, 'invalid-04-cd-noargs');

    // Test open with no argument
    console.log('\n--- Testing open with no argument ---');
    await typeCommand(page, 'open', 'open no args');
    content = await getContent(page);
    await screenshot(page, 'invalid-05-open-noargs');
    
    const hasOpenUsage = contentContains(content, 'usage') || 
                        contentContains(content, 'specify') ||
                        contentContains(content, 'filename') ||
                        contentContains(content, 'file');

    // Test note with no text
    console.log('\n--- Testing note with no text ---');
    await typeCommand(page, 'note', 'note no args');
    content = await getContent(page);
    await screenshot(page, 'invalid-06-note-noargs');

    // Test decrypt with no file
    console.log('\n--- Testing decrypt with no file ---');
    await typeCommand(page, 'decrypt', 'decrypt no args');
    content = await getContent(page);
    await screenshot(page, 'invalid-07-decrypt-noargs');

    // Test morse with no text
    console.log('\n--- Testing morse with no text ---');
    await typeCommand(page, 'morse', 'morse no args');
    content = await getContent(page);
    await screenshot(page, 'invalid-08-morse-noargs');

    // Test multiple invalid commands in a row (check wrongAttempts)
    console.log('\n--- Testing multiple invalid commands ---');
    for (let i = 0; i < 3; i++) {
      await typeCommand(page, `invalid${i}`);
    }
    await typeCommand(page, 'status', 'check status after errors');
    content = await getContent(page);
    await screenshot(page, 'invalid-09-after-multiple');

    console.log('\n========== INVALID COMMANDS TEST COMPLETE ==========\n');
  });

  test('Special Commands - chat, trace, save', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== SPECIAL COMMANDS TEST ==========\n');

    await startGame(page);

    // Test chat command
    console.log('\n--- Testing chat command ---');
    await typeCommand(page, 'chat', 'chat command');
    let content = await getContent(page);
    await screenshot(page, 'special-01-chat');
    
    // Chat might open a channel or show a message
    const hasChatResponse = contentContains(content, 'ufo74') || 
                           contentContains(content, 'channel') ||
                           contentContains(content, 'relay') ||
                           contentContains(content, 'secure') ||
                           contentContains(content, 'connection') ||
                           contentContains(content, 'message');

    // Test trace command (risky)
    console.log('\n--- Testing trace command ---');
    await typeCommand(page, 'trace', 'trace command');
    content = await getContent(page);
    await screenshot(page, 'special-02-trace');
    
    const hasTraceResponse = contentContains(content, 'trace') || 
                            contentContains(content, 'connection') ||
                            contentContains(content, 'risk') ||
                            contentContains(content, 'system');

    // Check status after trace (detection should increase)
    await typeCommand(page, 'status', 'status after trace');
    content = await getContent(page);
    await screenshot(page, 'special-03-status-after-trace');

    // Test save command
    console.log('\n--- Testing save command ---');
    await typeCommand(page, 'save', 'save command');
    content = await getContent(page);
    await screenshot(page, 'special-04-save');
    
    const hasSaveResponse = contentContains(content, 'save') || 
                           contentContains(content, 'session') ||
                           contentContains(content, 'stored') ||
                           contentContains(content, 'checkpoint');

    console.log('\n========== SPECIAL COMMANDS TEST COMPLETE ==========\n');
  });

  test('Help Subcommands - help basics, help evidence, help winning', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== HELP SUBCOMMANDS TEST ==========\n');

    await startGame(page);

    // Test help basics
    console.log('\n--- Testing help basics ---');
    await typeCommand(page, 'help basics', 'help basics');
    let content = await getContent(page);
    await screenshot(page, 'help-01-basics');
    
    const hasBasicsHelp = contentContains(content, 'navigation') || 
                         contentContains(content, 'command') ||
                         contentContains(content, 'file') ||
                         contentContains(content, 'basic');

    // Test help evidence
    console.log('\n--- Testing help evidence ---');
    await typeCommand(page, 'help evidence', 'help evidence');
    content = await getContent(page);
    await screenshot(page, 'help-02-evidence');
    
    const hasEvidenceHelp = contentContains(content, 'evidence') || 
                           contentContains(content, 'truth') ||
                           contentContains(content, 'discover');

    // Test help winning
    console.log('\n--- Testing help winning ---');
    await typeCommand(page, 'help winning', 'help winning');
    content = await getContent(page);
    await screenshot(page, 'help-03-winning');
    
    const hasWinningHelp = contentContains(content, 'win') || 
                          contentContains(content, 'victory') ||
                          contentContains(content, 'complete') ||
                          contentContains(content, 'goal');

    // Test help with specific command
    console.log('\n--- Testing help ls ---');
    await typeCommand(page, 'help ls', 'help ls');
    content = await getContent(page);
    await screenshot(page, 'help-04-ls');

    console.log('\n--- Testing help cd ---');
    await typeCommand(page, 'help cd', 'help cd');
    content = await getContent(page);
    await screenshot(page, 'help-05-cd');

    console.log('\n--- Testing help open ---');
    await typeCommand(page, 'help open', 'help open');
    content = await getContent(page);
    await screenshot(page, 'help-06-open');

    console.log('\n========== HELP SUBCOMMANDS TEST COMPLETE ==========\n');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TEST SUITE: EDGE CASES
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Edge Cases', () => {
  test('Empty and Special Input', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== EDGE CASES TEST ==========\n');

    await startGame(page);

    // Test empty input (just Enter)
    console.log('\n--- Testing empty input ---');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    let content = await getContent(page);
    await screenshot(page, 'edge-01-empty');
    // Should not crash or error

    // Test very long input
    console.log('\n--- Testing very long input ---');
    const longInput = 'a'.repeat(500);
    await typeCommand(page, longInput, 'very long input');
    content = await getContent(page);
    await screenshot(page, 'edge-02-long-input');
    // Check for proper handling (truncation or error)

    // Test special characters
    console.log('\n--- Testing special characters ---');
    await typeCommand(page, '!@#$%^&*()', 'special chars');
    content = await getContent(page);
    await screenshot(page, 'edge-03-special-chars');

    await typeCommand(page, '<script>alert(1)</script>', 'XSS attempt');
    content = await getContent(page);
    await screenshot(page, 'edge-04-xss');
    // Should not execute script, just show as text or error

    await typeCommand(page, '../../../etc/passwd', 'path traversal');
    content = await getContent(page);
    await screenshot(page, 'edge-05-path-traversal');

    // Test rapid commands
    console.log('\n--- Testing rapid commands ---');
    for (let i = 0; i < 5; i++) {
      await page.keyboard.type('ls', { delay: 10 });
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(2000);
    await screenshot(page, 'edge-06-rapid');

    // Test command with extra spaces
    console.log('\n--- Testing extra spaces ---');
    await typeCommand(page, '  ls  ', 'extra spaces');
    content = await getContent(page);
    await screenshot(page, 'edge-07-extra-spaces');

    await typeCommand(page, 'cd    storage', 'multiple spaces');
    content = await getContent(page);
    await screenshot(page, 'edge-08-multiple-spaces');

    // Test case sensitivity
    console.log('\n--- Testing case sensitivity ---');
    await typeCommand(page, 'LS', 'uppercase LS');
    content = await getContent(page);
    await screenshot(page, 'edge-09-uppercase');
    
    await typeCommand(page, 'HELP', 'uppercase HELP');
    content = await getContent(page);
    await screenshot(page, 'edge-10-uppercase-help');

    console.log('\n========== EDGE CASES TEST COMPLETE ==========\n');
  });

  test('Keyboard Shortcuts', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== KEYBOARD SHORTCUTS TEST ==========\n');

    await startGame(page);

    // Test Ctrl+L (clear)
    console.log('\n--- Testing Ctrl+L ---');
    await typeCommand(page, 'ls');
    await typeCommand(page, 'help');
    await page.keyboard.press('Control+l');
    await page.waitForTimeout(1000);
    await screenshot(page, 'keyboard-01-ctrl-l');

    // Test command history with up/down arrows
    console.log('\n--- Testing command history ---');
    await typeCommand(page, 'ls');
    await typeCommand(page, 'status');
    await typeCommand(page, 'help');
    
    // Press up arrow to go back in history
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(500);
    await screenshot(page, 'keyboard-02-arrow-up-1');
    
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(500);
    await screenshot(page, 'keyboard-03-arrow-up-2');
    
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(500);
    await screenshot(page, 'keyboard-04-arrow-down');

    // Test Tab autocomplete
    console.log('\n--- Testing Tab autocomplete ---');
    await page.keyboard.type('sto');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    await screenshot(page, 'keyboard-05-tab-autocomplete');
    
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    console.log('\n========== KEYBOARD SHORTCUTS TEST COMPLETE ==========\n');
  });
});

// Export bugs for report generation
test.afterAll(async () => {
  if (bugs.length > 0) {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`BUGS FOUND: ${bugs.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    bugs.forEach(bug => {
      console.log(`#${bug.id} [${bug.severity.toUpperCase()}] ${bug.title}`);
    });
  } else {
    console.log('\n✅ No bugs found during testing!\n');
  }
});
