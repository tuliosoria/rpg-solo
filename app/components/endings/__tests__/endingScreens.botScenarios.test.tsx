/**
 * Joins bot-produced terminal outcomes to the screens that replace the terminal.
 *
 * The headless sweep proves the state machine can reach each outcome. These
 * assertions render the exact state each fatal scenario produced in all three
 * locales, and also render the identity reveal from a real pro run.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { executeCommand } from '../../../engine/commands';
import {
  ALL_SCENARIO_IDS,
  BOT_SCENARIOS,
  type BotScenarioId,
  resolveScenarioSeed,
} from '../../../engine/bot/scenarios';
import { runHeadless } from '../../../engine/bot/sweep';
import { I18nProvider, type Language } from '../../../i18n';

vi.mock('../../../storage/statistics', () => ({ recordEnding: vi.fn() }));
vi.mock('../../../lib/steamBridge', () => ({ setTrayLanguage: vi.fn(async () => undefined) }));

import BadEnding from '../BadEnding';
import NeutralEnding from '../NeutralEnding';
import SecretEnding from '../SecretEnding';

const LANGUAGES: Language[] = ['en', 'pt-BR', 'es'];
const PLACEHOLDER = /\{\{\s*\w+\s*\}\}/;
const RAW_KEY = /\b(?:ending|runtime|engine)\.[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+/;
const FATAL_SCENARIOS = ALL_SCENARIO_IDS.filter(id => BOT_SCENARIOS[id].expect.kind === 'gameOver');

function playScenario(scenario: BotScenarioId) {
  const seed = resolveScenarioSeed(scenario, 1);
  return runHeadless(executeCommand, 'novice', seed, { kind: 'scenario', scenario }).state;
}

function finishAnimation() {
  for (const delay of [300, 300, 5000, 300]) {
    act(() => {
      vi.advanceTimersByTime(delay);
    });
  }
}

beforeEach(() => {
  window.localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe.each(FATAL_SCENARIOS)('screen for bot scenario %s', scenario => {
  const state = playScenario(scenario);

  it.each(LANGUAGES)('renders its terminal outcome cleanly in %s', language => {
    window.localStorage.setItem('terminal1996_language', language);
    const isNeutral = state.endingType === 'neutral';

    render(
      <I18nProvider>
        {isNeutral ? (
          <NeutralEnding
            onRestartAction={vi.fn()}
            commandCount={state.sessionCommandCount}
            detectionLevel={state.detectionLevel}
            textSpeed="instant"
          />
        ) : (
          <BadEnding
            onRestartAction={vi.fn()}
            reason={state.gameOverReason}
            commandCount={state.sessionCommandCount}
            detectionLevel={state.detectionLevel}
            textSpeed="instant"
          />
        )}
      </I18nProvider>
    );
    finishAnimation();

    const text = document.body.textContent || '';
    expect(state.isGameOver).toBe(true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(text, 'unresolved {{placeholder}}').not.toMatch(PLACEHOLDER);
    expect(text, 'raw translation key on screen').not.toMatch(RAW_KEY);
    expect(text).not.toContain('undefined');
    expect(text).not.toContain('NaN');

    if (!isNeutral && state.gameOverReason) {
      if (language === 'en') expect(text).toContain(state.gameOverReason);
      else expect(text).not.toContain(state.gameOverReason);
    }
  });
});

describe('identity reveal reached by bot-test pro', () => {
  const state = runHeadless(executeCommand, 'pro', 1, { kind: 'default' }).state;

  it.each(LANGUAGES)('renders cleanly in %s', language => {
    window.localStorage.setItem('terminal1996_language', language);
    expect(state.ufo74SecretDiscovered).toBe(true);

    render(
      <I18nProvider>
        <SecretEnding
          onDismissAction={vi.fn()}
          commandCount={state.sessionCommandCount}
          detectionLevel={state.detectionLevel}
          textSpeed="instant"
        />
      </I18nProvider>
    );
    finishAnimation();

    const text = document.body.textContent || '';
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(text, 'unresolved {{placeholder}}').not.toMatch(PLACEHOLDER);
    expect(text, 'raw translation key on screen').not.toMatch(RAW_KEY);
    expect(text).not.toContain('undefined');
    expect(text).not.toContain('NaN');
  });
});
