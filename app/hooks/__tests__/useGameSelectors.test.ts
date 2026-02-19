import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  useRiskLevel,
  useStatusBar,
  useEvidenceState,
  useAttemptsDisplay,
  useSaveIndicator,
  useFirewallState,
} from '../useGameSelectors';
import { GameState } from '../../types';

// Helper to create a minimal GameState for testing
function createMockGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    currentPath: '/home/hackerkid',
    history: [],
    commandHistory: [],
    commandHistoryIndex: -1,
    detectionLevel: 0,
    wrongAttempts: 0,
    accessLevel: 0,
    sessionStability: 100,
    legacyAlertCounter: 0,
    flags: {},
    overrideFailedAttempts: 0,
    scoutLinksUsed: 0,
    truthsDiscovered: new Set(),
    filesRead: new Set(),
    conspiracyFilesSeen: new Set(),
    fileMutations: {},
    seed: 12345,
    rngState: 12345,
    sessionStartTime: Date.now(),
    isGameOver: false,
    prisoner45QuestionsAsked: 0,
    prisoner45Disconnected: false,
    prisoner45UsedResponses: new Set(),
    scoutLinkUsedResponses: new Set(),
    turingEvaluationActive: false,
    turingEvaluationIndex: 0,
    turingEvaluationCompleted: false,
    neuralClusterUnlocked: false,
    neuralClusterActive: false,
    neuralClusterEmissions: 0,
    neuralClusterDisabled: false,
    incognitoMessageCount: 0,
    lastIncognitoTrigger: 0,
    singularEventsTriggered: new Set(),
    imagesShownThisRun: new Set(),
    videosShownThisRun: new Set(),
    systemHostilityLevel: 0,
    terribleMistakeTriggered: false,
    sessionDoomCountdown: 0,
    categoriesRead: new Set(),
    sessionCommandCount: 0,
    statusCommandCount: 0,
    lastMeaningfulAction: 0,
    wanderingNoticeCount: 0,
    lastDirectoriesVisited: [],
    hintCount: 0,
    lastHintCommandCount: 0,
    firewallActive: false,
    firewallDisarmed: false,
    firewallEyes: [],
    lastEyeSpawnTime: 0,
    paranoiaLevel: 0,
    ...overrides,
  } as GameState;
}

describe('useGameSelectors', () => {
  describe('useRiskLevel', () => {
    it('returns MINIMAL for detection 0-19', () => {
      const { result } = renderHook(() => useRiskLevel(10));
      expect(result.current.level).toBe('MINIMAL 10%');
      expect(result.current.color).toBe('minimal');
    });

    it('returns LOW for detection 20-39', () => {
      const { result } = renderHook(() => useRiskLevel(25));
      expect(result.current.level).toBe('LOW 25%');
      expect(result.current.color).toBe('low');
    });

    it('returns ELEVATED for detection 40-59', () => {
      const { result } = renderHook(() => useRiskLevel(45));
      expect(result.current.level).toBe('ELEVATED 45%');
      expect(result.current.color).toBe('elevated');
    });

    it('returns HIGH for detection 60-79', () => {
      const { result } = renderHook(() => useRiskLevel(70));
      expect(result.current.level).toBe('HIGH 70%');
      expect(result.current.color).toBe('high');
    });

    it('returns CRITICAL for detection 80+', () => {
      const { result } = renderHook(() => useRiskLevel(85));
      expect(result.current.level).toBe('CRITICAL 85%');
      expect(result.current.color).toBe('critical');
    });

    it('handles boundary cases correctly', () => {
      // Test exact boundaries
      expect(renderHook(() => useRiskLevel(19)).result.current.color).toBe('minimal');
      expect(renderHook(() => useRiskLevel(20)).result.current.color).toBe('low');
      expect(renderHook(() => useRiskLevel(39)).result.current.color).toBe('low');
      expect(renderHook(() => useRiskLevel(40)).result.current.color).toBe('elevated');
      expect(renderHook(() => useRiskLevel(59)).result.current.color).toBe('elevated');
      expect(renderHook(() => useRiskLevel(60)).result.current.color).toBe('high');
      expect(renderHook(() => useRiskLevel(79)).result.current.color).toBe('high');
      expect(renderHook(() => useRiskLevel(80)).result.current.color).toBe('critical');
    });

    it('is memoized - same input returns same reference', () => {
      const { result, rerender } = renderHook(({ level }) => useRiskLevel(level), {
        initialProps: { level: 50 },
      });

      const firstResult = result.current;
      rerender({ level: 50 });
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });
  });

  describe('useStatusBar', () => {
    it('returns SYSTEM NOMINAL for clean state', () => {
      const gameState = createMockGameState();
      const { result } = renderHook(() => useStatusBar(gameState));
      expect(result.current).toBe('SYSTEM NOMINAL');
    });

    it('shows AUDIT: ACTIVE when detection >= 50', () => {
      const gameState = createMockGameState({ detectionLevel: 55 });
      const { result } = renderHook(() => useStatusBar(gameState));
      expect(result.current).toContain('AUDIT: ACTIVE');
    });

    it('shows SESSION: UNSTABLE when stability < 50', () => {
      const gameState = createMockGameState({ sessionStability: 40 });
      const { result } = renderHook(() => useStatusBar(gameState));
      expect(result.current).toContain('SESSION: UNSTABLE');
    });

    it('shows ACCESS: ADMIN when adminUnlocked flag is true', () => {
      const gameState = createMockGameState({ flags: { adminUnlocked: true } });
      const { result } = renderHook(() => useStatusBar(gameState));
      expect(result.current).toContain('ACCESS: ADMIN');
    });

    it('shows PARANOIA: ELEVATED when paranoiaLevel >= 40', () => {
      const gameState = createMockGameState({ paranoiaLevel: 45 });
      const { result } = renderHook(() => useStatusBar(gameState));
      expect(result.current).toContain('PARANOIA: ELEVATED');
    });

    it('shows PARANOIA: ACTIVE when paranoiaLevel >= 15 but < 40', () => {
      const gameState = createMockGameState({ paranoiaLevel: 25 });
      const { result } = renderHook(() => useStatusBar(gameState));
      expect(result.current).toContain('PARANOIA: ACTIVE');
    });

    it('shows game over reason when game is over', () => {
      const gameState = createMockGameState({ 
        isGameOver: true, 
        gameOverReason: 'SECURITY BREACH' 
      });
      const { result } = renderHook(() => useStatusBar(gameState));
      expect(result.current).toContain('SECURITY BREACH');
    });

    it('shows TERMINATED when game over but no reason', () => {
      const gameState = createMockGameState({ isGameOver: true });
      const { result } = renderHook(() => useStatusBar(gameState));
      expect(result.current).toContain('TERMINATED');
    });

    it('combines multiple status messages with separator', () => {
      const gameState = createMockGameState({
        detectionLevel: 60,
        sessionStability: 30,
        flags: { adminUnlocked: true },
      });
      const { result } = renderHook(() => useStatusBar(gameState));
      
      expect(result.current).toContain('│');
      expect(result.current).toContain('AUDIT: ACTIVE');
      expect(result.current).toContain('SESSION: UNSTABLE');
      expect(result.current).toContain('ACCESS: ADMIN');
    });
  });

  describe('useEvidenceState', () => {
    it('returns empty state for no truths discovered', () => {
      const { result } = renderHook(() => useEvidenceState(undefined));
      
      expect(result.current.count).toBe(0);
      expect(result.current.categories.every(c => !c.discovered)).toBe(true);
      expect(result.current.categories.every(c => c.symbol === '□')).toBe(true);
    });

    it('counts discovered truths correctly', () => {
      const truths = new Set(['debris_relocation', 'telepathic_scouts']);
      const { result } = renderHook(() => useEvidenceState(truths));
      
      expect(result.current.count).toBe(2);
    });

    it('marks discovered categories with filled symbol', () => {
      const truths = new Set(['debris_relocation']);
      const { result } = renderHook(() => useEvidenceState(truths));
      
      const debrisCategory = result.current.categories.find(c => c.id === 'debris_relocation');
      expect(debrisCategory?.discovered).toBe(true);
      expect(debrisCategory?.symbol).toBe('●');
    });

    it('marks undiscovered categories with empty symbol', () => {
      const truths = new Set(['debris_relocation']);
      const { result } = renderHook(() => useEvidenceState(truths));
      
      const otherCategory = result.current.categories.find(c => c.id === 'being_containment');
      expect(otherCategory?.discovered).toBe(false);
      expect(otherCategory?.symbol).toBe('□');
    });

    it('tracks all five evidence categories', () => {
      const { result } = renderHook(() => useEvidenceState(new Set()));
      
      const categoryIds = result.current.categories.map(c => c.id);
      expect(categoryIds).toContain('debris_relocation');
      expect(categoryIds).toContain('being_containment');
      expect(categoryIds).toContain('telepathic_scouts');
      expect(categoryIds).toContain('international_actors');
      expect(categoryIds).toContain('transition_2026');
      expect(result.current.categories.length).toBe(5);
    });

    it('is memoized - same input returns same reference', () => {
      const truths = new Set(['debris_relocation']);
      const { result, rerender } = renderHook(
        ({ t }) => useEvidenceState(t), 
        { initialProps: { t: truths } }
      );

      const firstResult = result.current;
      rerender({ t: truths });
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });
  });

  describe('useAttemptsDisplay', () => {
    it('formats attempts correctly', () => {
      const { result } = renderHook(() => useAttemptsDisplay(3));
      expect(result.current).toBe('3/8');
    });

    it('handles zero attempts', () => {
      const { result } = renderHook(() => useAttemptsDisplay(0));
      expect(result.current).toBe('0/8');
    });

    it('handles max attempts', () => {
      const { result } = renderHook(() => useAttemptsDisplay(8));
      expect(result.current).toBe('8/8');
    });
  });

  describe('useSaveIndicator', () => {
    it('returns null when no save time', () => {
      const { result } = renderHook(() => useSaveIndicator(undefined));
      expect(result.current).toBeNull();
    });

    it('shows <1m ago for recent saves', () => {
      const recentTime = Date.now() - 30000; // 30 seconds ago
      const { result } = renderHook(() => useSaveIndicator(recentTime));
      expect(result.current).toBe('Saved: <1m ago');
    });

    it('shows minutes ago for saves within an hour', () => {
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
      const { result } = renderHook(() => useSaveIndicator(tenMinutesAgo));
      expect(result.current).toBe('Saved: 10m ago');
    });

    it('shows hours ago for older saves', () => {
      const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
      const { result } = renderHook(() => useSaveIndicator(twoHoursAgo));
      expect(result.current).toBe('Saved: 2h ago');
    });
  });

  describe('useFirewallState', () => {
    it('returns correct firewall state', () => {
      const gameState = createMockGameState({
        firewallActive: true,
        firewallDisarmed: false,
        firewallEyes: [{ id: '1' }, { id: '2' }] as any,
        lastEyeSpawnTime: 123456,
      });

      const { result } = renderHook(() => useFirewallState(gameState));

      expect(result.current.active).toBe(true);
      expect(result.current.disarmed).toBe(false);
      expect(result.current.eyeCount).toBe(2);
      expect(result.current.lastSpawnTime).toBe(123456);
    });

    it('reflects disarmed state', () => {
      const gameState = createMockGameState({
        firewallActive: true,
        firewallDisarmed: true,
      });

      const { result } = renderHook(() => useFirewallState(gameState));

      expect(result.current.disarmed).toBe(true);
    });
  });
});
