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

// Files organized by directory
const FILES_BY_DIRECTORY: Record<string, string[]> = {
  '/storage/assets': [
    'material_x_analysis.dat',
    'transport_log_96.txt',
    'logistics_manifest_fragment.txt',
  ],
  '/storage/quarantine': [
    'bio_container.log',
    'autopsy_alpha.log',
    'autopsy_addendum_psi.txt',
    'witness_statement_raw.txt',
    'specimen_purpose_analysis.txt',
    'jardim_andere_incident.txt',
  ],
  '/ops/assessments': [
    'aircraft_incident_report.txt',
    'foreign_drone_assessment.txt',
    'industrial_accident_theory.txt',
  ],
  '/comms/psi': [
    'psi_analysis_report.txt',
  ],
  '/comms/intercepts': [
    'intercept_summary_dec95.txt',
    'regional_summary_jan96.txt',
    'morse_intercept.sig',
  ],
  '/internal': [
    'audio_transcript_brief.txt',
    'redaction_keycard.txt',
    'override_protocol_memo.txt',
  ],
  '/internal/protocols': [
    'incident_review_protocol.txt',
    'session_objectives.txt',
    'trust_protocol_1993.txt',
    'cipher_notes.txt',
  ],
  '/internal/sanitized': [
    'cargo_transfer_memo.txt',
    'visitor_briefing.txt',
    'asset_disposition_report.txt',
    'terminology_guide.txt',
  ],
  '/internal/personnel': [
    'personnel_transfer_notice.txt',
    'duty_roster_jan96.txt',
    'birthdays_jan96.txt',
    'training_q1_96.txt',
    'phone_directory_96.txt',
    'vacation_calendar.txt',
  ],
  '/internal/facilities': [
    'facilities_memo_12.txt',
    'parking_allocation_jan96.txt',
    'hvac_maintenance_log.txt',
    'lost_found_jan96.txt',
  ],
  '/internal/admin': [
    'budget_request_q1_96.txt',
    'supplies_request_jan96.txt',
    'printer_notice.txt',
    'badge_renewal_memo.txt',
    'budget_memo.txt',
    'maintenance_schedule.txt',
  ],
  '/internal/misc': [
    'cafeteria_menu_week03.txt',
    'cafeteria_menu.txt',
    'cafeteria_feedback.txt',
    'copa_94_celebration.txt',
    'vehicle_log_jan96.txt',
    'parking_regulations.txt',
    'lost_found_log.txt',
  ],
  '/tmp': [
    'note_to_self.tmp',
    'pattern_recognition.log',
    'coherence_threshold.log',
    'modem_log_jan96.txt',
  ],
};

// Encrypted files that need decrypt command
const ENCRYPTED_FILES: Record<string, string[]> = {
  '/comms/psi': ['transcript_core.enc', 'transcript_limit.enc'],
  '/tmp': ['encoded_transmission.enc'],
};

// Files that may reveal evidence (based on filesystem analysis)
const EVIDENCE_FILES = [
  '/storage/assets/material_x_analysis.dat',
  '/storage/assets/transport_log_96.txt',
  '/storage/quarantine/bio_container.log',
  '/storage/quarantine/autopsy_alpha.log',
  '/storage/quarantine/witness_statement_raw.txt',
  '/comms/psi/transcript_core.enc',
  '/comms/intercepts/regional_summary_jan96.txt',
];

// ═══════════════════════════════════════════════════════════════════════════
// TEST SUITE: FILE INTERACTIONS
// ═══════════════════════════════════════════════════════════════════════════

test.describe('File Interactions', () => {
  test.describe.configure({ mode: 'serial' });

  test('Open files in storage directory', async ({ page }) => {
    test.setTimeout(300000);
    console.log('\n========== STORAGE FILES TEST ==========\n');

    await startGame(page);

    let filesOpened = 0;
    let filesFailed: string[] = [];

    // Storage/assets
    console.log('\n--- /storage/assets ---');
    await typeCommand(page, 'cd /storage/assets');
    await typeCommand(page, 'ls');
    await screenshot(page, 'files-storage-assets-ls');

    for (const file of FILES_BY_DIRECTORY['/storage/assets']) {
      console.log(`\n  Opening: ${file}`);
      await typeCommand(page, `open ${file}`);
      const content = await getContent(page);
      await screenshot(page, `files-storage-assets-${file.replace(/\./g, '-')}`);

      if (contentContains(content, 'not found') || contentContains(content, 'error')) {
        filesFailed.push(`/storage/assets/${file}`);
        console.log(`  ❌ Failed to open ${file}`);
      } else {
        filesOpened++;
        console.log(`  ✅ Opened ${file}`);
        // Press Enter to close file view
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
      }
    }

    // Storage/quarantine
    console.log('\n--- /storage/quarantine ---');
    await typeCommand(page, 'cd /storage/quarantine');
    await typeCommand(page, 'ls');
    await screenshot(page, 'files-storage-quarantine-ls');

    for (const file of FILES_BY_DIRECTORY['/storage/quarantine']) {
      console.log(`\n  Opening: ${file}`);
      await typeCommand(page, `open ${file}`);
      const content = await getContent(page);
      await screenshot(page, `files-storage-quarantine-${file.replace(/\./g, '-')}`);

      if (contentContains(content, 'not found') || contentContains(content, 'error')) {
        filesFailed.push(`/storage/quarantine/${file}`);
      } else {
        filesOpened++;
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
      }
    }

    console.log(`\n✅ Opened ${filesOpened} files from storage`);
    if (filesFailed.length > 0) {
      console.log(`❌ Failed to open: ${filesFailed.join(', ')}`);
    }
    
    expect(filesOpened).toBeGreaterThan(5);
  });

  test('Open files in internal directory', async ({ page }) => {
    test.setTimeout(300000);
    console.log('\n========== INTERNAL FILES TEST ==========\n');

    await startGame(page);

    let filesOpened = 0;

    const internalDirs = [
      '/internal',
      '/internal/protocols',
      '/internal/sanitized',
      '/internal/personnel',
      '/internal/facilities',
      '/internal/admin',
      '/internal/misc',
    ];

    for (const dir of internalDirs) {
      const files = FILES_BY_DIRECTORY[dir];
      if (!files || files.length === 0) continue;

      console.log(`\n--- ${dir} ---`);
      await typeCommand(page, `cd ${dir}`);
      await typeCommand(page, 'ls');
      await screenshot(page, `files-${dir.replace(/\//g, '-').substring(1)}-ls`);

      // Open first 3 files in each directory to save time
      for (const file of files.slice(0, 3)) {
        console.log(`  Opening: ${file}`);
        await typeCommand(page, `open ${file}`);
        const content = await getContent(page);
        
        if (!contentContains(content, 'not found') && !contentContains(content, 'error')) {
          filesOpened++;
          await page.keyboard.press('Enter');
          await page.waitForTimeout(800);
        }
      }
    }

    console.log(`\n✅ Opened ${filesOpened} files from internal`);
    expect(filesOpened).toBeGreaterThan(10);
  });

  test('Open files in comms and ops directories', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== COMMS AND OPS FILES TEST ==========\n');

    await startGame(page);

    let filesOpened = 0;

    // Comms directories
    console.log('\n--- /comms/psi ---');
    await typeCommand(page, 'cd /comms/psi');
    await typeCommand(page, 'ls');
    await screenshot(page, 'files-comms-psi-ls');

    for (const file of FILES_BY_DIRECTORY['/comms/psi'] || []) {
      await typeCommand(page, `open ${file}`);
      const content = await getContent(page);
      if (!contentContains(content, 'not found')) {
        filesOpened++;
        await page.keyboard.press('Enter');
        await page.waitForTimeout(800);
      }
    }

    console.log('\n--- /comms/intercepts ---');
    await typeCommand(page, 'cd /comms/intercepts');
    await typeCommand(page, 'ls');
    await screenshot(page, 'files-comms-intercepts-ls');

    for (const file of FILES_BY_DIRECTORY['/comms/intercepts'] || []) {
      await typeCommand(page, `open ${file}`);
      const content = await getContent(page);
      if (!contentContains(content, 'not found')) {
        filesOpened++;
        await page.keyboard.press('Enter');
        await page.waitForTimeout(800);
      }
    }

    // Ops directories
    console.log('\n--- /ops/assessments ---');
    await typeCommand(page, 'cd /ops/assessments');
    await typeCommand(page, 'ls');
    await screenshot(page, 'files-ops-assessments-ls');

    for (const file of FILES_BY_DIRECTORY['/ops/assessments'] || []) {
      await typeCommand(page, `open ${file}`);
      const content = await getContent(page);
      if (!contentContains(content, 'not found')) {
        filesOpened++;
        await page.keyboard.press('Enter');
        await page.waitForTimeout(800);
      }
    }

    console.log(`\n✅ Opened ${filesOpened} files from comms/ops`);
    expect(filesOpened).toBeGreaterThan(3);
  });

  test('Open files in tmp directory', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== TMP FILES TEST ==========\n');

    await startGame(page);

    console.log('\n--- /tmp ---');
    await typeCommand(page, 'cd /tmp');
    await typeCommand(page, 'ls');
    await screenshot(page, 'files-tmp-ls');

    let filesOpened = 0;

    for (const file of FILES_BY_DIRECTORY['/tmp'] || []) {
      console.log(`  Opening: ${file}`);
      await typeCommand(page, `open ${file}`);
      const content = await getContent(page);
      await screenshot(page, `files-tmp-${file.replace(/\./g, '-')}`);

      if (!contentContains(content, 'not found') && 
          !contentContains(content, 'error') &&
          !contentContains(content, 'restricted')) {
        filesOpened++;
        await page.keyboard.press('Enter');
        await page.waitForTimeout(800);
      }
    }

    console.log(`\n✅ Opened ${filesOpened} files from tmp`);
  });

  test('Test encrypted files with decrypt command', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== ENCRYPTED FILES TEST ==========\n');

    await startGame(page);

    // Navigate to comms/psi for encrypted files
    console.log('\n--- Testing encrypted files in /comms/psi ---');
    await typeCommand(page, 'cd /comms/psi');
    await typeCommand(page, 'ls');
    await screenshot(page, 'files-encrypt-01-ls');

    // Try to open encrypted file directly
    console.log('\n  Trying to open encrypted file directly...');
    await typeCommand(page, 'open transcript_core.enc');
    let content = await getContent(page);
    await screenshot(page, 'files-encrypt-02-open-direct');

    // Check if it shows encrypted message or requires decryption
    const isEncrypted = contentContains(content, 'encrypted') || 
                       contentContains(content, 'decrypt') ||
                       contentContains(content, 'access') ||
                       contentContains(content, 'locked');
    console.log(`  Encrypted indicator: ${isEncrypted}`);

    // Try decrypt command
    console.log('\n  Trying decrypt command...');
    await typeCommand(page, 'decrypt transcript_core.enc');
    content = await getContent(page);
    await screenshot(page, 'files-encrypt-03-decrypt');

    // Check decrypt response
    const decryptResponse = contentContains(content, 'security') ||
                           contentContains(content, 'password') ||
                           contentContains(content, 'question') ||
                           contentContains(content, 'access') ||
                           contentContains(content, 'decrypt');
    console.log(`  Decrypt response received: ${decryptResponse}`);

    // Try another encrypted file
    console.log('\n  Trying transcript_limit.enc...');
    await typeCommand(page, 'decrypt transcript_limit.enc');
    content = await getContent(page);
    await screenshot(page, 'files-encrypt-04-limit');

    // Try encrypted file in tmp
    console.log('\n--- Testing encrypted file in /tmp ---');
    await typeCommand(page, 'cd /tmp');
    await typeCommand(page, 'ls');
    await typeCommand(page, 'open encoded_transmission.enc');
    content = await getContent(page);
    await screenshot(page, 'files-encrypt-05-tmp-enc');

    console.log('\n========== ENCRYPTED FILES TEST COMPLETE ==========\n');
  });

  test('Test opening non-existent files', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== NON-EXISTENT FILES TEST ==========\n');

    await startGame(page);

    const fakeFiles = [
      'fakefile.txt',
      'nonexistent.dat',
      'secret_document.pdf',
      'classified.enc',
      '../../../etc/passwd',
      'file with spaces.txt',
      '.hidden_file',
      'really_long_filename_that_probably_does_not_exist_in_the_system.txt',
    ];

    await typeCommand(page, 'cd /internal');

    for (const file of fakeFiles) {
      console.log(`\n  Trying to open: ${file}`);
      await typeCommand(page, `open ${file}`);
      const content = await getContent(page);
      
      const hasError = contentContains(content, 'not found') ||
                      contentContains(content, 'no such') ||
                      contentContains(content, 'does not exist') ||
                      contentContains(content, 'error') ||
                      contentContains(content, 'invalid');
      
      if (!hasError) {
        logBug({
          title: `No error when opening non-existent file: ${file}`,
          steps: ['cd /internal', `open ${file}`],
          expected: 'Should show file not found error',
          actual: `Content: ${content.substring(0, 200)}...`,
          severity: 'minor'
        });
      }
    }

    await screenshot(page, 'files-nonexistent-complete');
    console.log('\n========== NON-EXISTENT FILES TEST COMPLETE ==========\n');
  });

  test('Verify file content rendering', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== FILE CONTENT RENDERING TEST ==========\n');

    await startGame(page);

    // Test various file types and verify content appears correctly
    const testFiles = [
      { path: '/internal/misc', file: 'cafeteria_menu.txt', expect: ['menu', 'cafeteria'] },
      { path: '/internal/protocols', file: 'session_objectives.txt', expect: ['session', 'objective'] },
      { path: '/storage/quarantine', file: 'witness_statement_raw.txt', expect: ['witness', 'statement'] },
      { path: '/internal/personnel', file: 'phone_directory_96.txt', expect: ['phone', 'directory'] },
    ];

    for (const testFile of testFiles) {
      console.log(`\n--- Testing ${testFile.path}/${testFile.file} ---`);
      
      await typeCommand(page, `cd ${testFile.path}`);
      await typeCommand(page, `open ${testFile.file}`);
      
      const content = await getContent(page);
      await screenshot(page, `files-render-${testFile.file.replace(/\./g, '-')}`);

      let found = 0;
      for (const expected of testFile.expect) {
        if (contentContains(content, expected)) {
          found++;
        }
      }

      if (found < testFile.expect.length) {
        logBug({
          title: `File content may not render correctly: ${testFile.file}`,
          steps: [`cd ${testFile.path}`, `open ${testFile.file}`],
          expected: `Should contain: ${testFile.expect.join(', ')}`,
          actual: `Found ${found}/${testFile.expect.length} expected keywords`,
          severity: 'major'
        });
      }

      // Close file
      await page.keyboard.press('Enter');
      await page.waitForTimeout(800);
    }

    console.log('\n========== FILE CONTENT RENDERING TEST COMPLETE ==========\n');
  });

  test('Test detection level increases when opening files', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== DETECTION LEVEL TEST ==========\n');

    await startGame(page);

    // Check initial status
    console.log('\n--- Initial status ---');
    await typeCommand(page, 'status');
    let content = await getContent(page);
    await screenshot(page, 'files-detection-01-initial');
    
    // Extract detection info from content
    const getDetectionInfo = (c: string) => {
      const lower = c.toLowerCase();
      return {
        nominal: lower.includes('nominal'),
        active: lower.includes('active'),
        warning: lower.includes('warning') || lower.includes('flagged'),
        critical: lower.includes('critical'),
      };
    };

    let initialDetection = getDetectionInfo(content);
    console.log(`  Initial detection: ${JSON.stringify(initialDetection)}`);

    // Open several files to increase detection
    console.log('\n--- Opening files to increase detection ---');
    
    const filesToOpen = [
      { dir: '/storage/assets', file: 'material_x_analysis.dat' },
      { dir: '/storage/quarantine', file: 'autopsy_alpha.log' },
      { dir: '/storage/quarantine', file: 'bio_container.log' },
      { dir: '/comms/intercepts', file: 'regional_summary_jan96.txt' },
    ];

    for (const f of filesToOpen) {
      await typeCommand(page, `cd ${f.dir}`);
      await typeCommand(page, `open ${f.file}`);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
    }

    // Check status after opening files
    console.log('\n--- Status after opening files ---');
    await typeCommand(page, 'status');
    content = await getContent(page);
    await screenshot(page, 'files-detection-02-after');

    let afterDetection = getDetectionInfo(content);
    console.log(`  After detection: ${JSON.stringify(afterDetection)}`);

    // Detection should have increased (or stayed same if already high)
    // At minimum, it should not have decreased
    const detectionIncreased = !initialDetection.nominal || afterDetection.active || 
                               afterDetection.warning || afterDetection.critical;
    
    console.log(`  Detection increased: ${detectionIncreased}`);

    // Open more files to push detection higher
    console.log('\n--- Opening more files ---');
    
    await typeCommand(page, 'cd /storage/quarantine');
    await typeCommand(page, 'open witness_statement_raw.txt');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    await typeCommand(page, 'cd /internal/sanitized');
    await typeCommand(page, 'open cargo_transfer_memo.txt');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    await typeCommand(page, 'status');
    content = await getContent(page);
    await screenshot(page, 'files-detection-03-final');

    let finalDetection = getDetectionInfo(content);
    console.log(`  Final detection: ${JSON.stringify(finalDetection)}`);

    console.log('\n========== DETECTION LEVEL TEST COMPLETE ==========\n');
  });

  test('Test progress command shows evidence collection', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n========== EVIDENCE COLLECTION TEST ==========\n');

    await startGame(page);

    // Check initial progress
    console.log('\n--- Initial progress ---');
    await typeCommand(page, 'progress');
    let content = await getContent(page);
    await screenshot(page, 'files-evidence-01-initial');

    // Open evidence-related files
    console.log('\n--- Opening evidence files ---');
    
    const evidenceFiles = [
      { dir: '/storage/assets', file: 'material_x_analysis.dat' },
      { dir: '/storage/assets', file: 'transport_log_96.txt' },
      { dir: '/storage/quarantine', file: 'autopsy_alpha.log' },
      { dir: '/storage/quarantine', file: 'bio_container.log' },
      { dir: '/comms/intercepts', file: 'regional_summary_jan96.txt' },
    ];

    for (const f of evidenceFiles) {
      console.log(`  Opening ${f.file}...`);
      await typeCommand(page, `cd ${f.dir}`);
      await typeCommand(page, `open ${f.file}`);
      
      const content = await getContent(page);
      
      // Check if this file reveals evidence
      const revealsEvidence = contentContains(content, 'evidence') ||
                             contentContains(content, 'truth') ||
                             contentContains(content, 'discovered') ||
                             contentContains(content, 'linked');
      
      if (revealsEvidence) {
        console.log(`    📍 This file may reveal evidence!`);
      }
      
      await page.keyboard.press('Enter');
      await page.waitForTimeout(800);
    }

    // Check progress after opening files
    console.log('\n--- Progress after opening evidence files ---');
    await typeCommand(page, 'progress');
    content = await getContent(page);
    await screenshot(page, 'files-evidence-02-after');

    // Check for evidence indicators
    const hasProgress = contentContains(content, 'evidence') ||
                       contentContains(content, 'truth') ||
                       contentContains(content, 'progress') ||
                       contentContains(content, 'discovered') ||
                       contentContains(content, '/5') ||
                       contentContains(content, '0/') ||
                       contentContains(content, '1/') ||
                       contentContains(content, '2/');
    
    console.log(`  Progress indicators found: ${hasProgress}`);

    // Test map command to see evidence connections
    console.log('\n--- Testing map command ---');
    await typeCommand(page, 'map');
    content = await getContent(page);
    await screenshot(page, 'files-evidence-03-map');

    console.log('\n========== EVIDENCE COLLECTION TEST COMPLETE ==========\n');
  });

  test('Test last and bookmark commands for files', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n========== LAST AND BOOKMARK TEST ==========\n');

    await startGame(page);

    // Open a file
    await typeCommand(page, 'cd /internal/misc');
    await typeCommand(page, 'open cafeteria_menu.txt');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);
    await screenshot(page, 'files-lastbookmark-01-opened');

    // Test last command
    console.log('\n--- Testing last command ---');
    await typeCommand(page, 'last');
    let content = await getContent(page);
    await screenshot(page, 'files-lastbookmark-02-last');
    
    const lastWorks = contentContains(content, 'cafeteria') || 
                     contentContains(content, 're-reading') ||
                     contentContains(content, 'menu');
    console.log(`  Last command works: ${lastWorks}`);

    // Test bookmark command
    console.log('\n--- Testing bookmark command ---');
    await typeCommand(page, 'bookmark cafeteria_menu.txt');
    content = await getContent(page);
    await screenshot(page, 'files-lastbookmark-03-bookmark');

    // List bookmarks
    await typeCommand(page, 'bookmark');
    content = await getContent(page);
    await screenshot(page, 'files-lastbookmark-04-bookmark-list');

    const bookmarkWorks = contentContains(content, 'cafeteria') ||
                         contentContains(content, 'bookmark');
    console.log(`  Bookmark works: ${bookmarkWorks}`);

    console.log('\n========== LAST AND BOOKMARK TEST COMPLETE ==========\n');
  });
});

// Export bugs for report generation
test.afterAll(async () => {
  if (bugs.length > 0) {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`FILE INTERACTION BUGS FOUND: ${bugs.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    bugs.forEach(bug => {
      console.log(`#${bug.id} [${bug.severity.toUpperCase()}] ${bug.title}`);
    });
  } else {
    console.log('\n✅ No file interaction bugs found!\n');
  }
});
