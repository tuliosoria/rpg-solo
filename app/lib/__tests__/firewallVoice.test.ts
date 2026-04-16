import { beforeEach, describe, expect, it, vi } from 'vitest';

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

    expect(createdAudio).toHaveLength(9);
    expect(createdAudio[0].play).toHaveBeenCalledTimes(1);
    expect(createdAudio[0].pause).toHaveBeenCalledTimes(1);
    expect(createdAudio[0].currentTime).toBe(0);
    expect(createdAudio[0].volume).toBe(1);
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
});
