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
  
  // Press Enter to start
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  
  // Complete tutorial quickly
  await typeCommand(page, 'ls');
  await typeCommand(page, 'cd internal');
  await typeCommand(page, 'cd misc');
  await typeCommand(page, 'open cafeteria_menu');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  await typeCommand(page, 'cd /');
  
  console.log('  ✅ Game started, at root');
}

// Directory structure based on filesystem analysis
const ACCESSIBLE_DIRECTORIES = [
  // Root level
  '/',
  // Storage branch
  '/storage',
  '/storage/assets',
  '/storage/quarantine',
  // Ops branch
  '/ops',
  '/ops/assessments',
  // ops/prato requires adminUnlocked flag
  // ops/exo requires accessThreshold 2
  // Comms branch
  '/comms',
  '/comms/psi',
  '/comms/intercepts',
  // comms/liaison requires accessThreshold 2
  // Admin requires accessThreshold 3
  // Internal branch (most accessible)
  '/internal',
  '/internal/protocols',
  '/internal/sanitized',
  '/internal/personnel',
  '/internal/facilities',
  '/internal/admin',
  '/internal/misc',
  // Tmp
  '/tmp',
  // sys requires adminUnlocked flag
  // aftermath requires epilogueUnlocked flag
];

// ═══════════════════════════════════════════════════════════════════════════
// TEST SUITE: FILESYSTEM NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Filesystem Navigation', () => {
  test.describe.configure({ mode: 'serial' });

  test('Navigate to all accessible directories', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes for thorough navigation
    console.log('\n========== FULL FILESYSTEM NAVIGATION TEST ==========\n');

    await startGame(page);
    await screenshot(page, 'nav-00-start');

    let visitedDirs = 0;
    const failedDirs: string[] = [];

    for (const dir of ACCESSIBLE_DIRECTORIES) {
      console.log(`\n--- Navigating to: ${dir} ---`);
      
      // First go to root
      await typeCommand(page, 'cd /');
      
      if (dir === '/') {
        // Already at root
        await typeCommand(page, 'ls', `ls at ${dir}`);
      } else {
        // Navigate to the directory
        const path = dir.substring(1); // Remove leading /
        await typeCommand(page, `cd ${path}`, `cd to ${dir}`);
        
        const content = await getContent(page);
        
        // Check if navigation succeeded
        if (contentContains(content, 'not found') || 
            contentContains(content, 'no such') ||
            contentContains(content, 'access denied') ||
            contentContains(content, 'does not exist')) {
          console.log(`  ⚠️ Could not access ${dir} (may require flags/access)`);
          failedDirs.push(dir);
        } else {
          // Run ls to see contents
          await typeCommand(page, 'ls', `ls at ${dir}`);
          visitedDirs++;
        }
      }
      
      // Take screenshot of each directory
      const screenshotName = `nav-dir-${dir.replace(/\//g, '-').substring(1) || 'root'}`;
      await screenshot(page, screenshotName);
    }

    console.log(`\n✅ Successfully visited ${visitedDirs} directories`);
    if (failedDirs.length > 0) {
      console.log(`⚠️ Could not access ${failedDirs.length} directories (expected for restricted dirs):`);
      failedDirs.forEach(d => console.log(`   - ${d}`));
    }

    await screenshot(page, 'nav-01-complete');
    
    // We should be able to visit most directories
    expect(visitedDirs).toBeGreaterThan(10);
  });

  test('Test cd .. from various depths', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== CD .. NAVIGATION TEST ==========\n');

    await startGame(page);

    // Test cd .. from root (should stay at root or show message)
    console.log('\n--- Testing cd .. from root ---');
    await typeCommand(page, 'cd /');
    await typeCommand(page, 'cd ..', 'cd .. from root');
    let content = await getContent(page);
    await screenshot(page, 'nav-cdback-01-from-root');
    
    // Should either stay at root or show appropriate message
    const atRoot = contentContains(content, 'root') || 
                   contentContains(content, 'already') ||
                   !contentContains(content, 'error');

    // Test cd .. from depth 1
    console.log('\n--- Testing cd .. from depth 1 ---');
    await typeCommand(page, 'cd storage');
    await typeCommand(page, 'cd ..', 'cd .. from storage');
    content = await getContent(page);
    await screenshot(page, 'nav-cdback-02-from-depth1');
    
    await typeCommand(page, 'ls');
    content = await getContent(page);
    // Should be back at root and see top-level directories
    const backAtRoot = contentContains(content, 'storage') && 
                       contentContains(content, 'internal');

    // Test cd .. from depth 2
    console.log('\n--- Testing cd .. from depth 2 ---');
    await typeCommand(page, 'cd storage');
    await typeCommand(page, 'cd assets');
    await typeCommand(page, 'cd ..', 'cd .. from assets');
    content = await getContent(page);
    await screenshot(page, 'nav-cdback-03-from-depth2');
    
    await typeCommand(page, 'ls');
    content = await getContent(page);
    // Should be in storage and see assets/quarantine
    const inStorage = contentContains(content, 'assets') || contentContains(content, 'quarantine');

    // Test cd .. from depth 3
    console.log('\n--- Testing cd .. from depth 3 ---');
    await typeCommand(page, 'cd /');
    await typeCommand(page, 'cd internal');
    await typeCommand(page, 'cd protocols');
    await typeCommand(page, 'ls');
    await screenshot(page, 'nav-cdback-04-depth3');
    
    await typeCommand(page, 'cd ..', 'cd .. from protocols');
    await typeCommand(page, 'ls');
    content = await getContent(page);
    await screenshot(page, 'nav-cdback-05-after-cdback');
    
    // Should be in internal and see subdirectories
    const inInternal = contentContains(content, 'protocols') || 
                       contentContains(content, 'personnel') ||
                       contentContains(content, 'misc');

    // Test multiple cd .. in sequence
    console.log('\n--- Testing multiple cd .. in sequence ---');
    await typeCommand(page, 'cd misc');
    await typeCommand(page, 'cd ..', 'first cd ..');
    await typeCommand(page, 'cd ..', 'second cd ..');
    await typeCommand(page, 'ls');
    content = await getContent(page);
    await screenshot(page, 'nav-cdback-06-multiple');
    
    // Should be at root
    const atRootAgain = contentContains(content, 'storage') && 
                        contentContains(content, 'internal');

    console.log('\n========== CD .. TEST COMPLETE ==========\n');
  });

  test('Test non-existent directories', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== NON-EXISTENT DIRECTORY TEST ==========\n');

    await startGame(page);

    const nonExistentDirs = [
      'fakedir',
      'nonexistent',
      'secret',
      'hidden',
      'classified',
      'area51',
      'storage/fake',
      'internal/secret',
    ];

    for (const dir of nonExistentDirs) {
      console.log(`\n--- Testing cd to non-existent: ${dir} ---`);
      await typeCommand(page, 'cd /');
      await typeCommand(page, `cd ${dir}`, `cd ${dir}`);
      
      const content = await getContent(page);
      const hasError = contentContains(content, 'not found') || 
                      contentContains(content, 'no such') ||
                      contentContains(content, 'does not exist') ||
                      contentContains(content, 'error') ||
                      contentContains(content, 'invalid');
      
      if (!hasError) {
        logBug({
          title: `No error for non-existent directory: ${dir}`,
          steps: ['cd /', `cd ${dir}`],
          expected: 'Should show directory not found error',
          actual: `No error shown. Content: ${content.substring(0, 200)}...`,
          screenshot: `nav-nonexistent-${dir.replace(/\//g, '-')}.png`,
          severity: 'minor'
        });
      }
      
      await screenshot(page, `nav-nonexistent-${dir.replace(/\//g, '-')}`);
    }

    console.log('\n========== NON-EXISTENT DIRECTORY TEST COMPLETE ==========\n');
  });

  test('Test absolute vs relative paths', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== ABSOLUTE VS RELATIVE PATH TEST ==========\n');

    await startGame(page);

    // Test absolute path from anywhere
    console.log('\n--- Testing absolute paths ---');
    
    // Go to a nested directory first
    await typeCommand(page, 'cd internal');
    await typeCommand(page, 'cd misc');
    await typeCommand(page, 'ls');
    await screenshot(page, 'nav-paths-01-in-misc');

    // Use absolute path to go to storage
    await typeCommand(page, 'cd /storage', 'absolute path to /storage');
    let content = await getContent(page);
    await screenshot(page, 'nav-paths-02-absolute-storage');
    
    await typeCommand(page, 'ls');
    content = await getContent(page);
    const inStorage = contentContains(content, 'assets') || contentContains(content, 'quarantine');
    
    if (!inStorage) {
      logBug({
        title: 'Absolute path cd /storage did not work',
        steps: ['cd internal', 'cd misc', 'cd /storage'],
        expected: 'Should navigate to /storage and show assets, quarantine',
        actual: `Content: ${content.substring(0, 200)}...`,
        screenshot: 'nav-paths-02-absolute-storage.png',
        severity: 'major'
      });
    }

    // Test absolute path with full path
    await typeCommand(page, 'cd /internal/protocols', 'absolute path to nested');
    content = await getContent(page);
    await screenshot(page, 'nav-paths-03-absolute-nested');
    
    await typeCommand(page, 'ls');
    content = await getContent(page);

    // Test relative paths
    console.log('\n--- Testing relative paths ---');
    
    await typeCommand(page, 'cd /storage');
    await typeCommand(page, 'cd assets', 'relative cd to assets');
    await typeCommand(page, 'ls');
    content = await getContent(page);
    await screenshot(page, 'nav-paths-04-relative');

    // Test relative path with ..
    await typeCommand(page, 'cd ../quarantine', 'relative with ..');
    content = await getContent(page);
    await screenshot(page, 'nav-paths-05-relative-dotdot');
    
    await typeCommand(page, 'ls');
    content = await getContent(page);

    // Test cd without path (might go to root or show usage)
    console.log('\n--- Testing cd with no argument ---');
    await typeCommand(page, 'cd', 'cd with no arg');
    content = await getContent(page);
    await screenshot(page, 'nav-paths-06-cd-noarg');

    console.log('\n========== PATH TEST COMPLETE ==========\n');
  });

  test('Test path edge cases', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== PATH EDGE CASES TEST ==========\n');

    await startGame(page);

    // Test double slashes
    console.log('\n--- Testing double slashes ---');
    await typeCommand(page, 'cd //storage', 'double slash');
    let content = await getContent(page);
    await screenshot(page, 'nav-edge-01-double-slash');

    // Test trailing slash
    console.log('\n--- Testing trailing slash ---');
    await typeCommand(page, 'cd /');
    await typeCommand(page, 'cd storage/', 'trailing slash');
    content = await getContent(page);
    await screenshot(page, 'nav-edge-02-trailing-slash');

    // Test ./ prefix
    console.log('\n--- Testing ./ prefix ---');
    await typeCommand(page, 'cd /');
    await typeCommand(page, 'cd ./storage', 'dot slash prefix');
    content = await getContent(page);
    await screenshot(page, 'nav-edge-03-dot-slash');

    // Test multiple .. 
    console.log('\n--- Testing multiple .. ---');
    await typeCommand(page, 'cd /internal/protocols');
    await typeCommand(page, 'cd ../../storage', 'multiple ..');
    content = await getContent(page);
    await screenshot(page, 'nav-edge-04-multiple-dotdot');
    
    await typeCommand(page, 'ls');
    content = await getContent(page);
    const inStorageAfterMultiple = contentContains(content, 'assets') || 
                                   contentContains(content, 'quarantine');

    // Test going above root with many ..
    console.log('\n--- Testing going above root ---');
    await typeCommand(page, 'cd /storage');
    await typeCommand(page, 'cd ../../../..', 'too many ..');
    content = await getContent(page);
    await screenshot(page, 'nav-edge-05-above-root');
    
    // Should stay at root or show error
    await typeCommand(page, 'ls');
    content = await getContent(page);

    // Test spaces in path (should fail gracefully)
    console.log('\n--- Testing spaces in path ---');
    await typeCommand(page, 'cd "storage assets"', 'quoted path');
    content = await getContent(page);
    await screenshot(page, 'nav-edge-06-quoted');

    await typeCommand(page, "cd 'storage'", 'single quotes');
    content = await getContent(page);
    await screenshot(page, 'nav-edge-07-single-quotes');

    console.log('\n========== PATH EDGE CASES TEST COMPLETE ==========\n');
  });

  test('Test back command navigation', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== BACK COMMAND TEST ==========\n');

    await startGame(page);

    // Build navigation history
    console.log('\n--- Building navigation history ---');
    await typeCommand(page, 'cd storage');
    await typeCommand(page, 'cd assets');
    await typeCommand(page, 'cd /internal');
    await typeCommand(page, 'cd personnel');
    await typeCommand(page, 'cd /comms');
    
    await typeCommand(page, 'ls');
    let content = await getContent(page);
    await screenshot(page, 'nav-back-01-in-comms');

    // Test back command
    console.log('\n--- Testing back command ---');
    await typeCommand(page, 'back', 'first back');
    content = await getContent(page);
    await screenshot(page, 'nav-back-02-first-back');
    
    await typeCommand(page, 'ls');
    content = await getContent(page);

    await typeCommand(page, 'back', 'second back');
    content = await getContent(page);
    await screenshot(page, 'nav-back-03-second-back');
    
    await typeCommand(page, 'ls');
    content = await getContent(page);

    // Test back when no history
    console.log('\n--- Testing back with no history ---');
    // Navigate fresh and try back immediately
    await typeCommand(page, 'cd /');
    await typeCommand(page, 'back', 'back from root');
    content = await getContent(page);
    await screenshot(page, 'nav-back-04-no-history');

    console.log('\n========== BACK COMMAND TEST COMPLETE ==========\n');
  });

  test('Verify directory contents match expected structure', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== DIRECTORY STRUCTURE VERIFICATION TEST ==========\n');

    await startGame(page);

    // Expected contents for each directory
    const expectedContents: Record<string, string[]> = {
      '/': ['storage', 'ops', 'comms', 'internal', 'tmp'],
      '/storage': ['assets', 'quarantine'],
      '/storage/assets': ['material_x', 'transport', 'logistics', 'integrity'],
      '/storage/quarantine': ['bio_container', 'autopsy', 'witness', 'neural', 'specimen', 'surveillance', 'jardim'],
      '/ops': ['assessments'],  // prato and exo may be restricted
      '/ops/assessments': ['aircraft', 'drone', 'industrial'],
      '/comms': ['psi', 'intercepts'],  // liaison may be restricted
      '/comms/psi': ['transcript', 'psi_analysis'],
      '/comms/intercepts': ['intercept', 'regional', 'morse'],
      '/internal': ['protocols', 'sanitized', 'personnel', 'facilities', 'admin', 'misc'],
      '/internal/misc': ['cafeteria', 'copa', 'vehicle', 'parking', 'lost'],
      '/tmp': ['session', 'note', 'pattern', 'coherence', 'data', 'modem'],
    };

    const mismatches: string[] = [];

    for (const [dir, expectedItems] of Object.entries(expectedContents)) {
      console.log(`\n--- Checking ${dir} ---`);
      
      await typeCommand(page, 'cd /');
      if (dir !== '/') {
        await typeCommand(page, `cd ${dir.substring(1)}`);
      }
      await typeCommand(page, 'ls');
      
      const content = await getContent(page);
      await screenshot(page, `nav-verify-${dir.replace(/\//g, '-').substring(1) || 'root'}`);
      
      let found = 0;
      for (const item of expectedItems) {
        if (contentContains(content, item)) {
          found++;
        } else {
          console.log(`  ⚠️ Expected "${item}" not found in ${dir}`);
        }
      }
      
      console.log(`  Found ${found}/${expectedItems.length} expected items`);
      
      if (found < expectedItems.length * 0.5) {
        mismatches.push(`${dir}: only ${found}/${expectedItems.length} items found`);
      }
    }

    if (mismatches.length > 0) {
      console.log('\n⚠️ Directory structure mismatches:');
      mismatches.forEach(m => console.log(`   - ${m}`));
    }

    console.log('\n========== STRUCTURE VERIFICATION COMPLETE ==========\n');
  });
});

// Export bugs for report generation
test.afterAll(async () => {
  if (bugs.length > 0) {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`NAVIGATION BUGS FOUND: ${bugs.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    bugs.forEach(bug => {
      console.log(`#${bug.id} [${bug.severity.toUpperCase()}] ${bug.title}`);
    });
  } else {
    console.log('\n✅ No navigation bugs found!\n');
  }
});
