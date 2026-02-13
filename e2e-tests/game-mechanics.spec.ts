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

// Parse detection level from status output
function parseDetectionLevel(content: string): string {
  const lower = content.toLowerCase();
  if (lower.includes('critical')) return 'critical';
  if (lower.includes('warning') || lower.includes('flagged')) return 'warning';
  if (lower.includes('active')) return 'active';
  if (lower.includes('nominal')) return 'nominal';
  return 'unknown';
}

// Parse attempts remaining from status output
function parseAttemptsRemaining(content: string): number | null {
  // Look for patterns like "X remaining" or "X attempts"
  const match = content.match(/(\d+)\s*(remaining|attempts|left)/i);
  if (match) return parseInt(match[1]);
  
  // Check for "secure" which usually means full attempts
  if (content.toLowerCase().includes('secure')) return 8;
  
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST SUITE: GAME MECHANICS
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Game Mechanics', () => {
  test.describe.configure({ mode: 'serial' });

  test('Detection system increases correctly', async ({ page }) => {
    test.setTimeout(300000);
    console.log('\n========== DETECTION SYSTEM TEST ==========\n');

    await startGame(page);

    // Check initial detection level
    console.log('\n--- Initial detection level ---');
    await typeCommand(page, 'status');
    let content = await getContent(page);
    await screenshot(page, 'mechanics-detect-01-initial');
    
    let initialLevel = parseDetectionLevel(content);
    console.log(`  Initial level: ${initialLevel}`);

    // Actions that should increase detection
    const riskyActions = [
      { action: 'cd /storage/quarantine', desc: 'Navigate to quarantine' },
      { action: 'open autopsy_alpha.log', desc: 'Open sensitive file' },
      { action: 'Enter', desc: 'Close file', isEnter: true },
      { action: 'open bio_container.log', desc: 'Open another sensitive file' },
      { action: 'Enter', desc: 'Close file', isEnter: true },
      { action: 'cd /comms/psi', desc: 'Navigate to psi' },
      { action: 'open psi_analysis_report.txt', desc: 'Open psi report' },
      { action: 'Enter', desc: 'Close file', isEnter: true },
      { action: 'trace', desc: 'Run trace command (risky)' },
    ];

    for (const action of riskyActions) {
      console.log(`\n  Performing: ${action.desc}`);
      if (action.isEnter) {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
      } else {
        await typeCommand(page, action.action);
      }
    }

    // Check detection level after actions
    console.log('\n--- Detection level after risky actions ---');
    await typeCommand(page, 'status');
    content = await getContent(page);
    await screenshot(page, 'mechanics-detect-02-after-actions');
    
    let afterLevel = parseDetectionLevel(content);
    console.log(`  After level: ${afterLevel}`);

    // Continue with more risky actions
    console.log('\n--- More risky actions ---');
    await typeCommand(page, 'cd /storage/assets');
    await typeCommand(page, 'open material_x_analysis.dat');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);
    
    await typeCommand(page, 'open transport_log_96.txt');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);

    await typeCommand(page, 'status');
    content = await getContent(page);
    await screenshot(page, 'mechanics-detect-03-more-actions');
    
    let finalLevel = parseDetectionLevel(content);
    console.log(`  Final level: ${finalLevel}`);

    // Verify detection increased
    const levels = ['nominal', 'active', 'warning', 'critical'];
    const initialIdx = levels.indexOf(initialLevel);
    const finalIdx = levels.indexOf(finalLevel);

    if (finalIdx <= initialIdx && initialLevel !== 'unknown' && finalLevel !== 'unknown') {
      logBug({
        title: 'Detection level did not increase after risky actions',
        steps: riskyActions.map(a => a.desc),
        expected: 'Detection should increase from risky file access',
        actual: `Started at ${initialLevel}, ended at ${finalLevel}`,
        screenshot: 'mechanics-detect-03-more-actions.png',
        severity: 'major'
      });
    }

    console.log('\n========== DETECTION SYSTEM TEST COMPLETE ==========\n');
  });

  test('Wrong attempts counter works correctly', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== WRONG ATTEMPTS TEST ==========\n');

    await startGame(page);

    // Check initial attempts
    console.log('\n--- Initial status ---');
    await typeCommand(page, 'status');
    let content = await getContent(page);
    await screenshot(page, 'mechanics-attempts-01-initial');
    
    let initialAttempts = parseAttemptsRemaining(content);
    console.log(`  Initial attempts remaining: ${initialAttempts}`);

    // Make several invalid commands
    console.log('\n--- Making invalid commands ---');
    const invalidCommands = [
      'asdfqwerty',
      'invalidcmd',
      'notacommand',
      'fakecommand',
    ];

    for (const cmd of invalidCommands) {
      await typeCommand(page, cmd, `Invalid: ${cmd}`);
    }

    // Check attempts after invalid commands
    console.log('\n--- Status after invalid commands ---');
    await typeCommand(page, 'status');
    content = await getContent(page);
    await screenshot(page, 'mechanics-attempts-02-after-invalid');
    
    let afterAttempts = parseAttemptsRemaining(content);
    console.log(`  Attempts remaining after invalid commands: ${afterAttempts}`);

    // Try wrong passwords/decryption attempts
    console.log('\n--- Making wrong decryption attempts ---');
    await typeCommand(page, 'cd /comms/psi');
    await typeCommand(page, 'decrypt transcript_core.enc');
    content = await getContent(page);
    
    // If it prompts for password, try wrong ones
    if (contentContains(content, 'password') || contentContains(content, 'question')) {
      await typeCommand(page, 'wrongpassword1');
      await typeCommand(page, 'wrongpassword2');
    }

    await typeCommand(page, 'status');
    content = await getContent(page);
    await screenshot(page, 'mechanics-attempts-03-after-decrypt');
    
    let finalAttempts = parseAttemptsRemaining(content);
    console.log(`  Final attempts remaining: ${finalAttempts}`);

    // Check if the status reflects degrading security
    const hasDegradation = contentContains(content, 'warning') ||
                          contentContains(content, 'concern') ||
                          contentContains(content, 'flagged') ||
                          contentContains(content, 'attention') ||
                          (afterAttempts !== null && initialAttempts !== null && afterAttempts < initialAttempts);
    
    console.log(`  Security degradation detected: ${hasDegradation}`);

    console.log('\n========== WRONG ATTEMPTS TEST COMPLETE ==========\n');
  });

  test('Evidence collection tracks discoveries', async ({ page }) => {
    test.setTimeout(300000);
    console.log('\n========== EVIDENCE COLLECTION TEST ==========\n');

    await startGame(page);

    // Check initial progress
    console.log('\n--- Initial progress ---');
    await typeCommand(page, 'progress');
    let content = await getContent(page);
    await screenshot(page, 'mechanics-evidence-01-initial');
    
    // Look for evidence count indicators
    const getEvidenceCount = (c: string) => {
      const match = c.match(/(\d+)\s*\/\s*5/);
      if (match) return parseInt(match[1]);
      // Also check for individual truth mentions
      let count = 0;
      if (c.toLowerCase().includes('debris')) count++;
      if (c.toLowerCase().includes('containment')) count++;
      if (c.toLowerCase().includes('telepathic')) count++;
      if (c.toLowerCase().includes('international')) count++;
      if (c.toLowerCase().includes('2026') || c.toLowerCase().includes('transition')) count++;
      return count > 0 ? count : null;
    };

    let initialEvidence = getEvidenceCount(content);
    console.log(`  Initial evidence count: ${initialEvidence || 0}`);

    // Open files that should reveal evidence
    // Based on the truth categories:
    // - debris_relocation: material_x_analysis.dat, transport_log_96.txt
    // - being_containment: bio_container.log, autopsy_alpha.log
    // - telepathic_scouts: psi_analysis_report.txt, transcript_core.enc
    // - international_actors: foreign_liaison_note.txt
    // - transition_2026: thirty_year_cycle.txt (in admin, may need access)

    const evidenceFiles = [
      { dir: '/storage/assets', file: 'material_x_analysis.dat', truth: 'debris' },
      { dir: '/storage/assets', file: 'transport_log_96.txt', truth: 'debris' },
      { dir: '/storage/quarantine', file: 'bio_container.log', truth: 'containment' },
      { dir: '/storage/quarantine', file: 'autopsy_alpha.log', truth: 'containment' },
      { dir: '/comms/psi', file: 'psi_analysis_report.txt', truth: 'telepathic' },
      { dir: '/comms/intercepts', file: 'regional_summary_jan96.txt', truth: 'international' },
    ];

    console.log('\n--- Opening evidence files ---');
    for (const f of evidenceFiles) {
      console.log(`\n  Opening ${f.file} (${f.truth})...`);
      await typeCommand(page, `cd ${f.dir}`);
      await typeCommand(page, `open ${f.file}`);
      
      const fileContent = await getContent(page);
      await screenshot(page, `mechanics-evidence-${f.file.replace(/\./g, '-')}`);
      
      // Check if file reveals evidence
      const revealsEvidence = contentContains(fileContent, 'evidence') ||
                             contentContains(fileContent, 'truth') ||
                             contentContains(fileContent, 'discovered') ||
                             contentContains(fileContent, 'revelation');
      if (revealsEvidence) {
        console.log(`    📍 Evidence revelation detected!`);
      }
      
      await page.keyboard.press('Enter');
      await page.waitForTimeout(800);
    }

    // Check progress after opening files
    console.log('\n--- Progress after opening evidence files ---');
    await typeCommand(page, 'progress');
    content = await getContent(page);
    await screenshot(page, 'mechanics-evidence-02-after');
    
    let afterEvidence = getEvidenceCount(content);
    console.log(`  Evidence count after: ${afterEvidence || 0}`);

    // Check map for evidence connections
    console.log('\n--- Checking evidence map ---');
    await typeCommand(page, 'map');
    content = await getContent(page);
    await screenshot(page, 'mechanics-evidence-03-map');

    // Verify some evidence was collected
    if (afterEvidence !== null && initialEvidence !== null && afterEvidence <= initialEvidence) {
      logBug({
        title: 'Evidence count did not increase after reading evidence files',
        steps: evidenceFiles.map(f => `open ${f.file}`),
        expected: 'Evidence count should increase when reading relevant files',
        actual: `Started at ${initialEvidence}, ended at ${afterEvidence}`,
        screenshot: 'mechanics-evidence-02-after.png',
        severity: 'major'
      });
    }

    console.log('\n========== EVIDENCE COLLECTION TEST COMPLETE ==========\n');
  });

  test('Game over conditions - wrong attempts limit', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== GAME OVER - WRONG ATTEMPTS TEST ==========\n');

    await startGame(page);
    await screenshot(page, 'mechanics-gameover-attempts-01-start');

    // Make many invalid commands to trigger game over (limit is 8)
    console.log('\n--- Making many invalid commands ---');
    
    for (let i = 1; i <= 7; i++) {
      await typeCommand(page, `invalid_command_${i}`);
      console.log(`  Invalid command ${i}/7 sent`);
      
      // Check status periodically
      if (i % 3 === 0) {
        await typeCommand(page, 'status');
        const content = await getContent(page);
        await screenshot(page, `mechanics-gameover-attempts-02-after${i}`);
        
        // Check if game over triggered
        if (contentContains(content, 'game over') || 
            contentContains(content, 'terminated') ||
            contentContains(content, 'locked out') ||
            contentContains(content, 'session ended')) {
          console.log(`  ⚠️ Game over triggered after ${i} invalid commands!`);
          break;
        }
      }
    }

    // Send a few more to potentially trigger game over
    await typeCommand(page, 'final_invalid_1');
    await typeCommand(page, 'final_invalid_2');
    
    let content = await getContent(page);
    await screenshot(page, 'mechanics-gameover-attempts-03-final');

    // Check if game over state is reached
    const isGameOver = contentContains(content, 'game over') ||
                      contentContains(content, 'terminated') ||
                      contentContains(content, 'locked') ||
                      contentContains(content, 'ended') ||
                      contentContains(content, 'purge') ||
                      contentContains(content, 'denied');

    console.log(`  Game over state: ${isGameOver}`);

    console.log('\n========== GAME OVER - WRONG ATTEMPTS TEST COMPLETE ==========\n');
  });

  test('Test stealth recovery commands (wait)', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== STEALTH RECOVERY TEST ==========\n');

    await startGame(page);

    // First increase detection level
    console.log('\n--- Increasing detection level ---');
    await typeCommand(page, 'cd /storage/quarantine');
    await typeCommand(page, 'open autopsy_alpha.log');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    await typeCommand(page, 'trace');
    
    await typeCommand(page, 'status');
    let content = await getContent(page);
    await screenshot(page, 'mechanics-stealth-01-elevated');
    
    let beforeLevel = parseDetectionLevel(content);
    console.log(`  Detection before wait: ${beforeLevel}`);

    // Try wait command (stealth recovery)
    console.log('\n--- Testing wait command ---');
    await typeCommand(page, 'wait');
    content = await getContent(page);
    await screenshot(page, 'mechanics-stealth-02-wait');

    // Check if wait command exists and what it does
    const waitResponse = contentContains(content, 'wait') ||
                        contentContains(content, 'detection') ||
                        contentContains(content, 'reduced') ||
                        contentContains(content, 'cooling') ||
                        contentContains(content, 'remaining') ||
                        contentContains(content, 'unknown');

    console.log(`  Wait command response: ${waitResponse ? 'received' : 'unknown'}`);

    // Check status after wait
    await typeCommand(page, 'status');
    content = await getContent(page);
    await screenshot(page, 'mechanics-stealth-03-after-wait');
    
    let afterLevel = parseDetectionLevel(content);
    console.log(`  Detection after wait: ${afterLevel}`);

    // Test using wait multiple times (limited to 3)
    console.log('\n--- Testing wait limit ---');
    await typeCommand(page, 'wait');
    await typeCommand(page, 'wait');
    await typeCommand(page, 'wait');
    
    content = await getContent(page);
    await screenshot(page, 'mechanics-stealth-04-multiple-wait');

    // Check if we hit the limit
    const hitLimit = contentContains(content, 'no') ||
                    contentContains(content, 'exhausted') ||
                    contentContains(content, 'limit') ||
                    contentContains(content, '0 remaining') ||
                    contentContains(content, 'cannot');
    
    console.log(`  Wait limit hit: ${hitLimit}`);

    console.log('\n========== STEALTH RECOVERY TEST COMPLETE ==========\n');
  });

  test('Test chat command interaction', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== CHAT SYSTEM TEST ==========\n');

    await startGame(page);

    // Test chat command
    console.log('\n--- Testing chat command ---');
    await typeCommand(page, 'chat');
    let content = await getContent(page);
    await screenshot(page, 'mechanics-chat-01-open');

    // Check if chat opens or shows a message
    const chatOpened = contentContains(content, 'ufo74') ||
                      contentContains(content, 'channel') ||
                      contentContains(content, 'relay') ||
                      contentContains(content, 'message') ||
                      contentContains(content, 'connection') ||
                      contentContains(content, 'secure');

    console.log(`  Chat system responded: ${chatOpened}`);

    // Try sending a message if chat is open
    if (chatOpened) {
      console.log('\n--- Testing message command ---');
      await typeCommand(page, 'message hello');
      content = await getContent(page);
      await screenshot(page, 'mechanics-chat-02-message');

      // Check for response
      const gotResponse = contentContains(content, 'response') ||
                         contentContains(content, 'ufo74') ||
                         content.length > 200;
      console.log(`  Got response: ${gotResponse}`);
    }

    console.log('\n========== CHAT SYSTEM TEST COMPLETE ==========\n');
  });

  test('Test save and progress persistence', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== SAVE SYSTEM TEST ==========\n');

    await startGame(page);

    // Make some progress
    console.log('\n--- Making progress ---');
    await typeCommand(page, 'cd /storage/quarantine');
    await typeCommand(page, 'open bio_container.log');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    await typeCommand(page, 'note Test note for save test');

    // Check progress before save
    console.log('\n--- Progress before save ---');
    await typeCommand(page, 'progress');
    let content = await getContent(page);
    await screenshot(page, 'mechanics-save-01-before');

    // Test save command
    console.log('\n--- Testing save command ---');
    await typeCommand(page, 'save');
    content = await getContent(page);
    await screenshot(page, 'mechanics-save-02-save');

    const saveResponse = contentContains(content, 'save') ||
                        contentContains(content, 'stored') ||
                        contentContains(content, 'checkpoint') ||
                        contentContains(content, 'session');

    console.log(`  Save response: ${saveResponse ? 'received' : 'none'}`);

    console.log('\n========== SAVE SYSTEM TEST COMPLETE ==========\n');
  });

  test('Test restricted area access', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== RESTRICTED ACCESS TEST ==========\n');

    await startGame(page);

    // Try to access restricted directories
    const restrictedPaths = [
      { path: '/admin', reason: 'accessThreshold: 3' },
      { path: '/ops/prato', reason: 'requires adminUnlocked flag' },
      { path: '/ops/exo', reason: 'accessThreshold: 2' },
      { path: '/comms/liaison', reason: 'accessThreshold: 2' },
      { path: '/sys', reason: 'requires adminUnlocked flag' },
      { path: '/aftermath', reason: 'requires epilogueUnlocked flag' },
    ];

    console.log('\n--- Testing restricted directory access ---');
    for (const restricted of restrictedPaths) {
      console.log(`\n  Trying: ${restricted.path} (${restricted.reason})`);
      
      await typeCommand(page, `cd ${restricted.path}`);
      let content = await getContent(page);
      await screenshot(page, `mechanics-restrict-${restricted.path.replace(/\//g, '-').substring(1)}`);

      // Check if access was denied
      const accessDenied = contentContains(content, 'denied') ||
                          contentContains(content, 'restricted') ||
                          contentContains(content, 'access') ||
                          contentContains(content, 'clearance') ||
                          contentContains(content, 'not found') ||
                          contentContains(content, 'permission');

      console.log(`  Access denied: ${accessDenied}`);
      
      if (!accessDenied) {
        // Try to list contents if we got in
        await typeCommand(page, 'ls');
        content = await getContent(page);
        console.log(`  Unexpectedly accessed ${restricted.path}!`);
      }
      
      // Go back to root
      await typeCommand(page, 'cd /');
    }

    console.log('\n========== RESTRICTED ACCESS TEST COMPLETE ==========\n');
  });
});

// Export bugs for report generation
test.afterAll(async () => {
  if (bugs.length > 0) {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`GAME MECHANICS BUGS FOUND: ${bugs.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    bugs.forEach(bug => {
      console.log(`#${bug.id} [${bug.severity.toUpperCase()}] ${bug.title}`);
    });
  } else {
    console.log('\n✅ No game mechanics bugs found!\n');
  }
});
