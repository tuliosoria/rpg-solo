import { test, expect } from '@playwright/test';
import { BASE_URL } from './helpers';

const LOCALES = [
  {
    language: 'en',
    newGame: '[ NEW GAME ]',
    loadGame: '[ LOAD GAME ]',
    loadTitle: 'SAVED SESSIONS',
    options: '[ OPTIONS ]',
    optionsTitle: 'OPTIONS',
    credits: '[ CREDITS ]',
    creditsTitle: 'CREDITS',
    masterVolume: 'Master Volume',
    screenFlicker: 'Screen Flicker',
    fontSize: 'Font Size',
    back: '[ BACK ]',
  },
  {
    language: 'pt-BR',
    newGame: '[ NOVO JOGO ]',
    loadGame: '[ CARREGAR JOGO ]',
    loadTitle: 'SESSÕES SALVAS',
    options: '[ OPÇÕES ]',
    optionsTitle: 'OPÇÕES',
    credits: '[ CRÉDITOS ]',
    creditsTitle: 'CRÉDITOS',
    masterVolume: 'Volume geral',
    screenFlicker: 'Tremulação de tela',
    fontSize: 'Tamanho da fonte',
    back: '[ VOLTAR ]',
  },
  {
    language: 'es',
    newGame: '[ NUEVA PARTIDA ]',
    loadGame: '[ CARGAR PARTIDA ]',
    loadTitle: 'SESIONES GUARDADAS',
    options: '[ OPCIONES ]',
    optionsTitle: 'OPCIONES',
    credits: '[ CRÉDITOS ]',
    creditsTitle: 'CRÉDITOS',
    masterVolume: 'Volumen maestro',
    screenFlicker: 'Parpadeo de pantalla',
    fontSize: 'Tamaño de fuente',
    back: '[ VOLVER ]',
  },
] as const;

test.describe('Menu accessibility and responsive layout', () => {
  test.use({ viewport: { width: 360, height: 640 } });

  for (const locale of LOCALES) {
    test(`${locale.language} keeps keyboard activation and mobile options reachable`, async ({
      page,
    }) => {
      await page.addInitScript(language => {
        window.sessionStorage.setItem('terminal1996_introSeen', '1');
        window.localStorage.setItem('terminal1996_language', language);
      }, locale.language);
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });

      const newGame = page.getByRole('button', { name: locale.newGame });
      const loadGame = page.getByRole('button', { name: locale.loadGame });
      await expect(newGame).toBeVisible();

      await page.keyboard.press('Tab');
      await expect(newGame).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(loadGame).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('heading', { name: locale.loadTitle })).toBeVisible();

      await page.keyboard.press('Escape');
      const credits = page.getByRole('button', { name: locale.credits });
      await newGame.focus();
      await credits.hover();
      await expect(credits).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('heading', { name: locale.creditsTitle })).toBeVisible();

      await page.keyboard.press('Escape');
      await page.getByRole('button', { name: locale.options }).click();
      await expect(page.getByRole('heading', { name: locale.optionsTitle })).toBeVisible();
      const volumeSlider = page.getByRole('slider', { name: locale.masterVolume });
      await expect(volumeSlider).toBeVisible();
      await volumeSlider.focus();
      await page.keyboard.press('ArrowDown');
      await expect(
        page.getByRole('button', { name: /Ambient Sound|Som ambiente|Sonido ambiental/i })
      ).toBeFocused();

      const screenFlicker = page.getByRole('button', { name: new RegExp(locale.screenFlicker) });
      await screenFlicker.click();
      await screenFlicker.focus();
      await page.keyboard.press('ArrowDown');
      await expect(page.getByRole('button', { name: new RegExp(locale.fontSize) })).toBeFocused();

      const back = page.getByRole('button', { name: locale.back });
      const scrollContainer = back.locator('..');
      const metrics = await scrollContainer.evaluate(element => ({
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        overflowY: getComputedStyle(element).overflowY,
      }));

      expect(metrics.overflowY).toBe('auto');
      expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
      await back.scrollIntoViewIfNeeded();
      await expect(back).toBeVisible();
      await back.click();
      await expect(newGame).toBeVisible();
    });
  }

  test('does not disable browser zoom', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('terminal1996_introSeen', '1');
    });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).not.toContain('maximum-scale');
    expect(viewport).not.toContain('user-scalable=no');
  });
});
