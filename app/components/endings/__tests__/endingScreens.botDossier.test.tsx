/**
 * Joins the two halves the bot harness deliberately keeps apart.
 *
 * `bot-test sweep` drives `executeCommand` and nothing else, so a green sweep
 * proves every ending is still *reachable* and says nothing about the screen it
 * puts on the player's monitor. `Victory.test.tsx` covers the opposite half: it
 * renders all twelve endings, but from `defaultProps` — no dossier and English
 * only — so the parts of the screen that are built from what the player
 * actually saved (`buildLeakPrologue`, the revelation-resolved AOL body) are
 * rendered from an empty set, in one language.
 *
 * This walks the bot to each ending, takes the dossier it really built, and
 * renders the real screen from it in all three languages.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ImgHTMLAttributes } from 'react';
import React from 'react';
import { DEFAULT_GAME_STATE, GameState } from '../../../types';
import { executeCommand } from '../../../engine/commands';
import { decideNextCommand } from '../../../engine/bot/strategy';
import { ALL_ENDING_IDS } from '../../../engine/bot/endingTargets';
import { createBotMemory, BotGoal } from '../../../engine/bot/types';
import { determineEnding, type EndingId } from '../../../engine/endings';
import { I18nProvider, type Language } from '../../../i18n';

vi.mock('next/image', () => ({
  default: ({ alt, src, ...props }: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={typeof src === 'string' ? src : ''} {...props} />
  ),
}));
vi.mock('../../../storage/statistics', () => ({ recordEnding: vi.fn() }));
vi.mock('../../../engine/achievements', () => ({ unlockAchievement: vi.fn(() => null) }));
vi.mock('../../../lib/steamBridge', () => ({ setTrayLanguage: vi.fn(async () => undefined) }));

import Victory from '../Victory';

const LANGUAGES: Language[] = ['en', 'pt-BR', 'es'];
const PLACEHOLDER = /\{\{\s*\w+\s*\}\}/;
/** A missing translation key falls through to the key itself, which looks like this. */
const RAW_KEY = /\b(?:ending|runtime|engine)\.[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+/;

function freshState(seed: number): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    tutorialComplete: true,
    seed,
    rngState: seed,
    sessionStartTime: 0,
    filesRead: new Set<string>(),
    savedFiles: new Set<string>(),
    flags: { ...(DEFAULT_GAME_STATE.flags || {}) },
  } as GameState;
}

/** Plays a real `bot-test ending <id>` run and returns the state it ended in. */
function playToEnding(ending: EndingId, seed = 1): GameState {
  const goal: BotGoal = { kind: 'ending', ending };
  let state = freshState(seed);
  let memory = createBotMemory();
  for (let i = 0; i < 400; i++) {
    const { decision, memory: next } = decideNextCommand(state, memory, 'pro', seed, goal);
    memory = next;
    if (decision.kind === 'done') break;
    const input = decision.kind === 'enter' ? '' : decision.text;
    state = { ...state, ...executeCommand(input, state).stateChanges } as GameState;
  }
  return state;
}

describe.each(ALL_ENDING_IDS)('ending screen for %s', ending => {
  const state = playToEnding(ending);

  it('is reached with the dossier it was aiming at', () => {
    expect(state.gameWon).toBe(true);
    expect(determineEnding(state.savedFiles)).toBe(ending);
    expect(state.savedFiles.size).toBe(10);
  });

  it.each(LANGUAGES)('renders that dossier cleanly in %s', language => {
    window.localStorage.setItem('terminal1996_language', language);

    render(
      <I18nProvider>
        <Victory
          onRestartAction={vi.fn()}
          commandCount={40}
          detectionLevel={state.detectionLevel}
          maxDetectionReached={state.detectionLevel}
          filesReadCount={state.filesRead.size}
          endingId={ending}
          savedFiles={state.savedFiles}
          textSpeed="instant"
        />
      </I18nProvider>
    );

    const text = document.body.textContent || '';
    expect(text, 'unresolved {{placeholder}}').not.toMatch(PLACEHOLDER);
    expect(text, 'raw translation key on screen').not.toMatch(RAW_KEY);
    expect(text).not.toContain('undefined');
    expect(text).not.toContain('NaN');
    // Labelled, or a screen reader announces an unnamed dialog.
    expect(screen.getAllByRole('dialog').length).toBeGreaterThan(0);
  });
});
