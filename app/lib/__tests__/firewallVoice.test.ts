import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockOptions } = vi.hoisted(() => ({
  mockOptions: { soundEffectsEnabled: true, masterVolume: 100 },
}));

vi.mock('../../hooks/useOptions', () => ({
  readStoredOptions: () => mockOptions,
}));

interface MockAudioElement {
  preload: string;
  volume: number;
  currentTime: number;
  play: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
}

describe('firewallVoice', () => {
  let createdAudio: MockAudioElement[] = [];

  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    createdAudio = [];

    mockOptions.soundEffectsEnabled = true;
    mockOptions.masterVolume = 100;

    class AudioMock {
      preload = '';
      volume = 1;
      currentTime = 0;
      play = vi.fn(() => Promise.resolve());
      pause = vi.fn();

      constructor(_audioPath: string) {
        createdAudio.push(this);
      }
    }

    vi.stubGlobal('window', {});
    vi.stubGlobal('Audio', AudioMock);
  });

  it('initializes audio on first unlock request', async () => {
    const { unlockSpeechSynthesis } = await import('../firewallVoice');

    unlockSpeechSynthesis();
    await Promise.resolve();

    expect(createdAudio).toHaveLength(8);
    expect(createdAudio[0].play).toHaveBeenCalledTimes(1);
    expect(createdAudio[0].pause).toHaveBeenCalledTimes(1);
    expect(createdAudio[0].currentTime).toBe(0);
    // The unlock play is silent, and stays silent: playback volume is resolved
    // per taunt from the player's settings, never left over from the primer.
    expect(createdAudio[0].volume).toBe(0);
  });

  it('can still play taunts after unlocking before initVoices runs', async () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    const { unlockSpeechSynthesis, speakCustomFirewallVoice } = await import('../firewallVoice');

    unlockSpeechSynthesis();
    await Promise.resolve();
    speakCustomFirewallVoice('');

    expect(createdAudio[0].play).toHaveBeenCalledTimes(2);
    randomSpy.mockRestore();
  });

  describe('respects the player audio settings', () => {
    // These taunts are jump-scare loud. Playing them through a mute is not a
    // cosmetic slip — it overrides a deliberate accessibility choice.
    async function playOneTaunt() {
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      const { initVoices, speakCustomFirewallVoice } = await import('../firewallVoice');
      initVoices();
      speakCustomFirewallVoice('');
      randomSpy.mockRestore();
      return createdAudio[0];
    }

    it('plays at full volume when master volume is 100', async () => {
      const audio = await playOneTaunt();

      expect(audio.play).toHaveBeenCalledTimes(1);
      expect(audio.volume).toBe(1);
    });

    it('scales playback to the master volume setting', async () => {
      mockOptions.masterVolume = 40;
      const audio = await playOneTaunt();

      expect(audio.play).toHaveBeenCalledTimes(1);
      expect(audio.volume).toBeCloseTo(0.4);
    });

    it('stays silent when sound effects are switched off', async () => {
      mockOptions.soundEffectsEnabled = false;
      const audio = await playOneTaunt();

      expect(audio.play).not.toHaveBeenCalled();
    });

    it('stays silent when master volume is zero', async () => {
      mockOptions.masterVolume = 0;
      const audio = await playOneTaunt();

      expect(audio.play).not.toHaveBeenCalled();
    });
  });
});
