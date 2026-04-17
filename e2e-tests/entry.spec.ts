import { test, expect } from '@playwright/test';
import { getCommandInput, getContent, runCommand, startSkippedRun } from './helpers';

test.describe('Entry Flow', () => {
  test('skip tutorial lands in the active terminal with the current command set', async ({ page }) => {
    await startSkippedRun(page);

    await expect(getCommandInput(page)).toHaveAttribute('placeholder', /Try: help, ls/i);

    await runCommand(page, 'help');
    const content = await getContent(page);

    expect(content).toContain('TERMINAL COMMANDS');
    expect(content).toContain('open <file>');
    expect(content).toContain('search <term>');
    expect(content).toContain('bookmark [file]');
    expect(content).toContain('wait');
    expect(content).toContain('leak');
  });
});
