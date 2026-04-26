import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import Terminal from '../Terminal';
import { DEFAULT_GAME_STATE, GameState } from '../../types';
import { I18nProvider } from '../../i18n';

vi.mock('next/image', () => ({
  default: (p: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...(p as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  },
}));
vi.mock('../../storage/saves', () => ({
  autoSave: vi.fn(() => Date.now()),
  loadGameState: vi.fn(),
  saveGameState: vi.fn(),
  saveCheckpoint: vi.fn(),
  loadCheckpoint: vi.fn(),
  getCheckpointSlots: vi.fn(() => []),
  getLatestCheckpoint: vi.fn(() => null),
  deleteCheckpoint: vi.fn(),
  clearCheckpoints: vi.fn(),
}));
vi.mock('../../storage/statistics', () => ({
  incrementStatistic: vi.fn(),
  addPlaytime: vi.fn(),
  recordEnding: vi.fn(),
}));
vi.mock('../../engine/achievements', () => ({
  unlockAchievement: vi.fn(() => null),
  getAchievements: vi.fn(() => []),
  Achievement: {},
}));

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

async function runFileOpenCase(opts: {
  language: 'pt-BR' | 'es' | 'en';
  command: string;
  expectedPromptRegex: RegExp;
}) {
  window.localStorage.setItem('terminal1996_language', opts.language);
  window.localStorage.setItem(
    'terminal1996_options',
    JSON.stringify({ textSpeed: 'instant' })
  );

  const state: GameState = {
    ...DEFAULT_GAME_STATE,
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    tutorialComplete: true,
    tutorialStep: -1,
    currentPath: '/internal',
    accessLevel: 5,
    flags: { ...DEFAULT_GAME_STATE.flags, internal_unlocked: true },
  } as GameState;

  render(
    <I18nProvider>
      <Terminal initialState={state} onExitAction={vi.fn()} onSaveRequestAction={vi.fn()} />
    </I18nProvider>
  );

  await act(async () => {
    await wait(50);
  });

  const input = document.querySelector('input[type="text"]') as HTMLInputElement;
  expect(input).toBeTruthy();
  fireEvent.change(input, { target: { value: opts.command } });
  const form = input.closest('form') as HTMLFormElement;
  await act(async () => {
    fireEvent.submit(form);
    await wait(50);
  });
  await act(async () => {
    await wait(500);
  });

  const text = document.body.textContent ?? '';
  expect(text).toMatch(opts.expectedPromptRegex);
}

describe('video prompt fires for translated open/cat commands', () => {
  it('PT-BR: `abrir witness_farm_recording.txt` shows prompt', async () => {
    await runFileOpenCase({
      language: 'pt-BR',
      command: 'abrir witness_farm_recording.txt',
      expectedPromptRegex: /Há um vídeo anexado a este arquivo/,
    });
  });

  it('PT-BR: `abrir jardim_andere_incident.txt` shows prompt', async () => {
    await runFileOpenCase({
      language: 'pt-BR',
      command: 'abrir jardim_andere_incident.txt',
      expectedPromptRegex: /Há um vídeo anexado a este arquivo/,
    });
  });

  it('ES: `abrir jardim_andere_incident.txt` shows prompt', async () => {
    await runFileOpenCase({
      language: 'es',
      command: 'abrir jardim_andere_incident.txt',
      expectedPromptRegex: /Hay un video adjunto/i,
    });
  });

  it('EN: `open jardim_andere_incident.txt` shows prompt', async () => {
    await runFileOpenCase({
      language: 'en',
      command: 'open jardim_andere_incident.txt',
      expectedPromptRegex: /There is a video attached/i,
    });
  });
});
