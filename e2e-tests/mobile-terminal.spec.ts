import { test, expect } from '@playwright/test';
import { BASE_URL } from './helpers';

const LOCALES = [
  {
    language: 'en',
    newGame: '[ NEW GAME ]',
    skipOnboarding: 'press esc to skip onboarding guide',
    pause: 'Pause menu',
    pauseResume: 'RESUME GAME',
    settings: 'SETTINGS',
    pauseExit: 'EXIT TO MENU',
    confirmTitle: 'EXIT TO MENU?',
    confirmNo: 'NO, CONTINUE',
    settingsTitle: 'SETTINGS',
    soundEffects: 'Sound Effects',
    masterVolume: 'Master Volume',
    closeSettings: '[ CLOSE ]',
    headerSave: '💾 SAVE SESSION',
    saveTitle: 'SAVE SESSION',
    saveName: 'Session Name (optional):',
    cancelSave: '[ CANCEL ]',
  },
  {
    language: 'pt-BR',
    newGame: '[ NOVO JOGO ]',
    skipOnboarding: 'pressione esc para pular a introdução',
    pause: 'Menu de pausa',
    pauseResume: 'CONTINUAR JOGO',
    settings: 'CONFIGURAÇÕES',
    pauseExit: 'SAIR PARA O MENU',
    confirmTitle: 'SAIR PARA O MENU?',
    confirmNo: 'NÃO, CONTINUAR',
    settingsTitle: 'CONFIGURAÇÕES',
    soundEffects: 'Efeitos sonoros',
    masterVolume: 'Volume geral',
    closeSettings: '[ FECHAR ]',
    headerSave: '💾 SALVAR SESSÃO',
    saveTitle: 'SALVAR SESSÃO',
    saveName: 'Nome da sessão (opcional):',
    cancelSave: '[ CANCELAR ]',
  },
  {
    language: 'es',
    newGame: '[ NUEVA PARTIDA ]',
    skipOnboarding: 'presiona esc para saltar la introducción',
    pause: 'Menú de pausa',
    pauseResume: 'REANUDAR PARTIDA',
    settings: 'CONFIGURACIÓN',
    pauseExit: 'SALIR AL MENÚ',
    confirmTitle: '¿SALIR AL MENÚ?',
    confirmNo: 'NO, CONTINUAR',
    settingsTitle: 'CONFIGURACIÓN',
    soundEffects: 'Efectos de sonido',
    masterVolume: 'Volumen maestro',
    closeSettings: '[ CERRAR ]',
    headerSave: '💾 GUARDAR SESIÓN',
    saveTitle: 'GUARDAR SESIÓN',
    saveName: 'Nombre de sesión (opcional):',
    cancelSave: '[ CANCELAR ]',
  },
] as const;

test.describe('Mobile terminal layout', () => {
  test.use({ viewport: { width: 360, height: 480 } });

  for (const locale of LOCALES) {
    test(`${locale.language} keeps onboarding and terminal controls reachable`, async ({
      page,
    }) => {
      await page.addInitScript(language => {
        window.sessionStorage.setItem('terminal1996_introSeen', '1');
        window.localStorage.setItem('terminal1996_language', language);
      }, locale.language);
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: locale.newGame }).click();

      const onboarding = page.getByRole('dialog');
      const skipOnboarding = page.getByRole('button', { name: locale.skipOnboarding });
      await expect(onboarding).toBeVisible();

      const onboardingMetrics = await onboarding.evaluate(element => ({
        overflowX: getComputedStyle(element).overflowX,
        overflowY: getComputedStyle(element).overflowY,
      }));
      expect(onboardingMetrics.overflowX).toBe('hidden');
      expect(onboardingMetrics.overflowY).toBe('auto');

      await skipOnboarding.scrollIntoViewIfNeeded();
      await expect(skipOnboarding).toBeVisible();
      expect((await skipOnboarding.boundingBox())?.height).toBeGreaterThanOrEqual(44);
      await skipOnboarding.click();

      const tutorialChoices = page.getByRole('dialog').getByRole('button');
      await expect(tutorialChoices).toHaveCount(2);
      for (let index = 0; index < 2; index += 1) {
        const choice = tutorialChoices.nth(index);
        await choice.scrollIntoViewIfNeeded();
        expect((await choice.boundingBox())?.height).toBeGreaterThanOrEqual(44);
      }
      await tutorialChoices.first().click();

      const pauseButton = page.getByRole('button', { name: locale.pause });
      await expect(pauseButton).toBeVisible();
      const pauseBox = await pauseButton.boundingBox();
      expect(pauseBox?.width).toBeGreaterThanOrEqual(44);
      expect(pauseBox?.height).toBeGreaterThanOrEqual(44);

      const statusBar = pauseButton.locator('..');
      const statusMetrics = await statusBar.evaluate(element => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }));
      expect(statusMetrics.scrollWidth).toBeLessThanOrEqual(statusMetrics.clientWidth);

      await pauseButton.click();
      const resumeButton = page.getByRole('button', { name: locale.pauseResume });
      const settingsButton = page.getByRole('button', { name: locale.settings });
      await resumeButton.focus();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await expect(settingsButton).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('heading', { name: locale.settingsTitle })).toBeVisible();
      await expect(page.getByRole('button', { name: locale.soundEffects })).toHaveAttribute(
        'aria-pressed'
      );
      await expect(page.getByRole('slider', { name: locale.masterVolume })).toBeVisible();

      const settingsDialog = page.getByRole('dialog');
      const settingsModal = settingsDialog.locator('[class*="modal"]');
      const settingsMetrics = await settingsModal.evaluate(element => ({
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        overflowX: getComputedStyle(element).overflowX,
        overflowY: getComputedStyle(element).overflowY,
      }));
      expect(settingsMetrics.overflowX).toBe('hidden');
      expect(settingsMetrics.overflowY).toBe('auto');
      expect(settingsMetrics.scrollHeight).toBeGreaterThan(settingsMetrics.clientHeight);

      const closeSettings = page.getByRole('button', { name: locale.closeSettings });
      await closeSettings.scrollIntoViewIfNeeded();
      await expect(closeSettings).toBeVisible();
      await closeSettings.click();
      await expect(page.getByRole('textbox', { name: /terminal/i })).toBeEnabled();

      await pauseButton.click();
      const exitButton = page.getByRole('button', { name: locale.pauseExit });
      await exitButton.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('heading', { name: locale.confirmTitle })).toBeVisible();
      const continueButton = page.getByRole('button', { name: locale.confirmNo });
      await expect(continueButton).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(exitButton).toBeFocused();
      await page.keyboard.press('Escape');

      await page.getByRole('button', { name: /VARGINHA: TERMINAL 1996/i }).click();
      await page.getByRole('button', { name: locale.headerSave }).click();
      await expect(page.getByRole('heading', { name: locale.saveTitle })).toBeVisible();
      await expect(page.getByRole('textbox', { name: locale.saveName })).toBeVisible();

      const cancelSave = page.getByRole('button', { name: locale.cancelSave });
      await cancelSave.scrollIntoViewIfNeeded();
      expect((await cancelSave.boundingBox())?.height).toBeGreaterThanOrEqual(44);
      await cancelSave.click();
      await expect(page.getByRole('textbox', { name: /terminal/i })).toBeEnabled();
    });
  }
});
