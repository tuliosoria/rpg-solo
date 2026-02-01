# E2E Testing Guide

> End-to-end testing for **Varginha: Terminal 1996** using Playwright

---

## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Test Structure](#test-structure)
4. [Running Tests](#running-tests)
5. [Screenshots](#screenshots)
6. [Adding New Tests](#adding-new-tests)
7. [CI Integration](#ci-integration)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### What is E2E Testing?

End-to-end (E2E) testing simulates real user interactions with the application, testing the complete flow from start to finish. Unlike unit tests that verify individual functions, E2E tests validate that the entire system works together correctly.

### Why E2E Testing Matters for This Project

For a terminal-based game like Varginha: Terminal 1996, E2E tests are particularly valuable because:

- **User Flow Validation**: Ensures the tutorial and game commands work as players would actually use them
- **Visual Regression Detection**: Screenshots capture the terminal state at each step, making visual bugs obvious
- **Integration Confidence**: Verifies that the terminal, command parser, filesystem, and UI all work together
- **Refactoring Safety**: Catch breaking changes before they reach production

### What Our Tests Cover

The current E2E test suite validates the **tutorial flow**:
1. Loading the application
2. Starting the game (pressing Enter)
3. Basic navigation commands (`ls`, `cd`)
4. Opening files (`open cafeteria_menu`)
5. Directory traversal (`cd ..`)

---

## Setup

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- Modern browser (Chromium is installed automatically)

### Installation

1. **Install project dependencies** (includes Playwright):

```bash
npm install
```

2. **Install Playwright browsers**:

```bash
npx playwright install chromium
```

This downloads the Chromium browser that Playwright uses for testing. Other browsers (Firefox, WebKit) can be added if needed.

3. **Create screenshots directory** (if not exists):

```bash
mkdir -p e2e-tests/screenshots
```

### Verify Installation

```bash
npx playwright --version
# Should output: Version 1.58.x or higher
```

---

## Test Structure

### Directory Layout

```
e2e-tests/
├── playwright.config.ts    # Playwright configuration
├── tutorial.spec.ts        # Tutorial flow test
└── screenshots/            # Generated screenshots
    ├── 01-initial-state.png
    ├── 02-after-enter.png
    ├── ...
    └── error-state.png     # Captured on failures
```

### Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',                    // Tests are in the e2e-tests folder
  fullyParallel: false,            // Run tests sequentially (important for game state)
  forbidOnly: !!process.env.CI,    // Fail if .only() is left in CI
  retries: 0,                      // No retries (tests should be deterministic)
  workers: 1,                      // Single worker (game state is shared)
  reporter: 'list',                // Simple list output
  timeout: 120000,                 // 2-minute timeout per test

  use: {
    baseURL: 'https://thankful-grass-0f49be40f.2.azurestaticapps.net',
    trace: 'on-first-retry',       // Capture trace on retry
    screenshot: 'only-on-failure', // Auto-screenshot on failure
    headless: true,                // Run without visible browser
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Key Configuration Choices

| Setting | Value | Reason |
|---------|-------|--------|
| `fullyParallel` | `false` | Game state must be tested sequentially |
| `workers` | `1` | Prevents race conditions in game state |
| `timeout` | `120000` | Terminal animations and delays need time |
| `headless` | `true` | Faster execution, works in CI |

### Test File Anatomy (`tutorial.spec.ts`)

```typescript
import { test, expect, Page } from '@playwright/test';

// Target URL (production or staging)
const URL = 'https://thankful-grass-0f49be40f.2.azurestaticapps.net';

// Helper: Type a command and press Enter
async function typeCommand(page: Page, command: string, stepName: string) {
  console.log(`  ⏳ ${stepName}: Typing "${command}"...`);
  await page.keyboard.type(command, { delay: 50 });  // 50ms between keys
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);  // Wait for terminal to process
  console.log(`  ✅ ${stepName}: Completed`);
}

// Helper: Just press Enter
async function pressEnter(page: Page, stepName: string) {
  console.log(`  ⏳ ${stepName}: Pressing Enter...`);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  console.log(`  ✅ ${stepName}: Completed`);
}

test.describe('Tutorial Flow E2E Test', () => {
  test('complete tutorial from start to finish', async ({ page }) => {
    test.setTimeout(120000);  // 2-minute timeout

    // ... test steps with screenshots ...
  });
});
```

### Helper Functions

| Function | Purpose |
|----------|---------|
| `typeCommand(page, command, stepName)` | Types a command with realistic delay, presses Enter, waits for processing |
| `pressEnter(page, stepName)` | Presses Enter and waits (for confirmations, continuing after reading) |

The `delay: 50` parameter simulates human typing speed, which helps avoid race conditions with the terminal's input handling.

---

## Running Tests

### Basic Commands

```bash
# Run all E2E tests
npx playwright test --config=e2e-tests/playwright.config.ts

# Run with visible browser (for debugging)
npx playwright test --config=e2e-tests/playwright.config.ts --headed

# Run specific test file
npx playwright test --config=e2e-tests/playwright.config.ts tutorial.spec.ts

# Run with verbose output
npx playwright test --config=e2e-tests/playwright.config.ts --reporter=line
```

### Debugging

```bash
# Run with Playwright Inspector (step through test)
npx playwright test --config=e2e-tests/playwright.config.ts --debug

# Generate and view trace on failure
npx playwright test --config=e2e-tests/playwright.config.ts --trace on
npx playwright show-trace test-results/*/trace.zip
```

### Expected Output

```
Running 1 test using 1 worker

========== TUTORIAL E2E TEST ==========

Navigating to: https://thankful-grass-0f49be40f.2.azurestaticapps.net

Step 1: Load page - ✅ PASS

Waiting for terminal to be ready...

Step 2: Terminal ready - ✅ PASS
  Details: Page has content: true

Step: Press Enter to start...
  ⏳ Press Enter to start: Pressing Enter...
  ✅ Press Enter to start: Completed

Step 3: Press Enter to start - ✅ PASS

... (additional steps) ...

========== TEST COMPLETE ==========

All steps executed successfully!
Screenshots saved to: e2e-tests/screenshots/

  ✓ 1 tutorial.spec.ts:23:3 › Tutorial Flow E2E Test › complete tutorial (45s)

  1 passed (47s)
```

---

## Screenshots

### Automatic Screenshot Capture

The test captures screenshots at each significant step:

| Screenshot | Step | Purpose |
|------------|------|---------|
| `01-initial-state.png` | After page load | Verify initial terminal render |
| `02-after-enter.png` | After first Enter | Confirm game started |
| `03-after-ls.png` | After `ls` command | Verify directory listing |
| `04-after-cd-files.png` | After `cd files` | Confirm navigation |
| `05-after-open-cafeteria.png` | After opening file | Verify file content display |
| `06-after-continue.png` | After reading | Confirm return to terminal |
| `07-after-cd-back.png` | After `cd ..` | Verify navigation back |
| `08-after-final-ls.png` | After final `ls` | Verify final state |
| `09-final-state.png` | End of test | Capture completion |
| `error-state.png` | On failure only | Debug information |

### Screenshot Implementation

```typescript
// Take screenshot at a specific step
await page.screenshot({ 
  path: 'e2e-tests/screenshots/03-after-ls.png' 
});

// Error handling with screenshot
try {
  // ... test steps ...
} catch (error) {
  await page.screenshot({ path: 'e2e-tests/screenshots/error-state.png' });
  throw error;
}
```

### Viewing Screenshots

Screenshots are saved to `e2e-tests/screenshots/`. Review them to:

- Verify the terminal renders correctly
- Check for visual regressions
- Debug test failures
- Document expected game behavior

---

## Adding New Tests

### Step 1: Create a New Spec File

```typescript
// e2e-tests/command-help.spec.ts
import { test, expect, Page } from '@playwright/test';

const URL = 'https://thankful-grass-0f49be40f.2.azurestaticapps.net';

async function typeCommand(page: Page, command: string) {
  await page.keyboard.type(command, { delay: 50 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
}

test.describe('Help Command Tests', () => {
  test('help command displays available commands', async ({ page }) => {
    test.setTimeout(60000);

    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await page.keyboard.press('Enter');  // Start game
    await page.waitForTimeout(2000);

    await typeCommand(page, 'help');
    
    const content = await page.textContent('body');
    expect(content).toContain('ls');
    expect(content).toContain('cd');
    expect(content).toContain('open');

    await page.screenshot({ path: 'e2e-tests/screenshots/help-command.png' });
  });
});
```

### Step 2: Test Patterns

**Testing Command Output:**

```typescript
await typeCommand(page, 'status');
const content = await page.textContent('body');
expect(content).toContain('Detection Level');
```

**Testing Navigation:**

```typescript
await typeCommand(page, 'cd classified');
await typeCommand(page, 'ls');
const content = await page.textContent('body');
expect(content).toContain('expected_file.txt');
```

**Testing Error Handling:**

```typescript
await typeCommand(page, 'invalidcommand');
const content = await page.textContent('body');
expect(content?.toLowerCase()).toContain('unknown');
```

### Step 3: Best Practices

1. **Use meaningful timeouts**: Terminal animations take time
2. **Take screenshots at key steps**: Helps debug failures
3. **Log progress**: Console output helps track test execution
4. **Handle async properly**: Always `await` Playwright methods
5. **Clean test boundaries**: Each test should start from a known state

### Test Ideas for Future Coverage

- [ ] Detection level increases after suspicious actions
- [ ] Password-protected file access flow
- [ ] UFO74 chat interaction
- [ ] Game over conditions
- [ ] Save/load functionality
- [ ] All five truth discoveries

---

## CI Integration

### GitHub Actions Workflow

Create `.github/workflows/e2e.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps

      - name: Create screenshots directory
        run: mkdir -p e2e-tests/screenshots

      - name: Run E2E tests
        run: npx playwright test --config=e2e-tests/playwright.config.ts

      - name: Upload screenshots
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: e2e-screenshots
          path: e2e-tests/screenshots/
          retention-days: 7

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: test-results/
          retention-days: 7
```

### Key CI Considerations

| Setting | Purpose |
|---------|---------|
| `timeout-minutes: 15` | Prevents runaway tests |
| `--with-deps` | Installs browser dependencies on Linux |
| `if: always()` | Upload screenshots even on failure |
| `retention-days: 7` | Clean up old artifacts |

### Running Against Local Dev Server

For CI that tests against a local build:

```yaml
- name: Build application
  run: npm run build

- name: Start server
  run: npm start &
  
- name: Wait for server
  run: npx wait-on http://localhost:3000

- name: Run E2E tests
  run: npx playwright test --config=e2e-tests/playwright.config.ts
  env:
    E2E_BASE_URL: http://localhost:3000
```

Then update your config:

```typescript
use: {
  baseURL: process.env.E2E_BASE_URL || 'https://thankful-grass-0f49be40f.2.azurestaticapps.net',
  // ...
},
```

---

## Troubleshooting

### Common Issues

#### Test Times Out

**Symptom**: Test fails with "Timeout 120000ms exceeded"

**Solutions**:
1. Increase timeout: `test.setTimeout(180000);`
2. Check if the target URL is accessible
3. Reduce `waitForTimeout` values if they're too conservative
4. Run with `--headed` to see what's happening

#### Element Not Found

**Symptom**: "Waiting for selector failed"

**Solutions**:
1. The game uses dynamic content; wait longer after commands
2. Check if the selector is correct with `--debug` mode
3. Use `page.textContent('body')` for full-page text checks

#### Screenshots Are Blank/Wrong

**Symptom**: Screenshots don't show expected content

**Solutions**:
1. Add more wait time before screenshot
2. Check if content is rendering (CSS issues, hydration)
3. Run with `--headed` to verify visual state

#### CI Fails but Local Passes

**Symptom**: Tests pass locally but fail in GitHub Actions

**Solutions**:
1. Ensure `--with-deps` is used for Playwright install
2. Check if timing differences matter (CI is often slower)
3. Verify the target URL is accessible from GitHub's network
4. Add more explicit waits instead of relying on timing

### Debug Commands

```bash
# See exactly what the browser sees
npx playwright test --config=e2e-tests/playwright.config.ts --headed --slowmo=500

# Step through interactively
npx playwright test --config=e2e-tests/playwright.config.ts --debug

# Generate detailed trace
npx playwright test --config=e2e-tests/playwright.config.ts --trace on

# View the trace
npx playwright show-trace test-results/*/trace.zip
```

### Network Issues

If tests fail due to network issues:

```typescript
// Increase navigation timeout
await page.goto(URL, { 
  waitUntil: 'networkidle', 
  timeout: 60000  // 60 seconds
});

// Retry on network failure
test.describe.configure({ retries: 2 });
```

### Flaky Test Mitigation

For tests that occasionally fail:

1. **Add explicit waits** instead of fixed timeouts:
   ```typescript
   await page.waitForSelector('.terminal-output', { state: 'visible' });
   ```

2. **Use retry configuration** sparingly:
   ```typescript
   test.describe.configure({ retries: 1 });
   ```

3. **Check for race conditions** in command handling

---

## Quick Reference

```bash
# Install
npm install
npx playwright install chromium

# Run tests
npx playwright test --config=e2e-tests/playwright.config.ts

# Debug
npx playwright test --config=e2e-tests/playwright.config.ts --debug

# Headed mode
npx playwright test --config=e2e-tests/playwright.config.ts --headed
```

---

*Last updated: February 2026*
