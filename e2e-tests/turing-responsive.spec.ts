import { test, expect } from '@playwright/test';

const { readFileSync } = process.getBuiltinModule('fs') as {
  readFileSync(path: string, encoding: 'utf8'): string;
};

const turingCss = readFileSync(
  `${process.cwd()}/app/components/overlays/TuringTestOverlay.module.css`,
  'utf8'
);

const readLocale = (name: string): Record<string, string> =>
  JSON.parse(readFileSync(`${process.cwd()}/app/locales/${name}.json`, 'utf8')) as Record<
    string,
    string
  >;

const LOCALES = [
  { language: 'en', copy: readLocale('en') },
  { language: 'pt-BR', copy: readLocale('pt-br') },
  { language: 'es', copy: readLocale('es') },
] as const;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

test.describe('Turing overlay responsive layout', () => {
  test.use({ viewport: { width: 360, height: 480 } });

  for (const locale of LOCALES) {
    test(`${locale.language} keeps every answer reachable on a short screen`, async ({ page }) => {
      const copy = locale.copy;
      const options = [1, 2, 3]
        .map(
          (number, index) => `
            <button class="option" type="button">
              <span class="optionLetter">${String.fromCharCode(65 + index)}.</span>
              <span class="optionText">${escapeHtml(copy[`turing.question.2.option${String.fromCharCode(65 + index)}`])}</span>
            </button>
          `
        )
        .join('');

      await page.setContent(`
        <style>${turingCss}</style>
        <div class="overlay" style="position:absolute;inset:0">
          <div class="container" style="width:100%;max-height:100%">
            <div class="header">
              <div class="headerLine">═══════════════════════════════════════════════</div>
              <div class="headerTitle">${escapeHtml(copy['turing.header.title'])}</div>
              <div class="headerLine">═══════════════════════════════════════════════</div>
            </div>
            <div class="interrogation">${escapeHtml(copy['turing.interrogation'])}</div>
            <div class="instructions">
              <div>${escapeHtml(copy['turing.instructions.notice'])}</div>
              <div>${escapeHtml(copy['turing.instructions.prove'])}</div>
              <div class="instructionHighlight">${escapeHtml(copy['turing.instructions.select'])}</div>
            </div>
            <div class="progress">2 / 3</div>
            <div class="questionBox">
              <div class="questionPrompt">${escapeHtml(copy['turing.question.2.prompt'])}</div>
              <div class="options">${options}</div>
            </div>
            <div class="footer">${escapeHtml(copy['turing.footer'])}</div>
          </div>
        </div>
      `);

      const container = page.locator('.container');
      const metrics = await container.evaluate(element => ({
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        overflowY: getComputedStyle(element).overflowY,
      }));
      expect(metrics.overflowY).toBe('auto');
      expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

      const answers = page.getByRole('button');
      await expect(answers).toHaveCount(3);
      for (let index = 0; index < 3; index += 1) {
        const answer = answers.nth(index);
        await answer.scrollIntoViewIfNeeded();
        await expect(answer).toBeVisible();
        expect((await answer.boundingBox())?.height).toBeGreaterThanOrEqual(44);
      }
    });
  }
});
