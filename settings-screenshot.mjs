import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });

// Go to game
await page.goto('http://localhost:3000');
await page.waitForTimeout(2000);

// Click NEW GAME  
await page.click('text=NEW GAME');
await page.waitForTimeout(4000);

// Press Escape to open pause menu
await page.keyboard.press('Escape');
await page.waitForTimeout(1000);

// Take screenshot of pause menu first
await page.screenshot({ path: '/tmp/pause-menu.png' });

// Click Settings
await page.click('text=SETTINGS');
await page.waitForTimeout(1000);

// Take screenshot of settings
await page.screenshot({ path: '/tmp/settings-menu.png' });

await browser.close();
