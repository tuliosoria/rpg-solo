import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSound } from '../useSound';

describe('useSound', () => {
  let originalAudioContext: typeof AudioContext | undefined;
  let createOscillatorSpy: ReturnType<typeof vi.fn>;
  let createGainSpy: ReturnType<typeof vi.fn>;
  let createBufferSpy: ReturnType<typeof vi.fn>;
  let createBufferSourceSpy: ReturnType<typeof vi.fn>;
  let createBiquadFilterSpy: ReturnType<typeof vi.fn>;
  let resumeSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    originalAudioContext = window.AudioContext;

    // Create spies
    createOscillatorSpy = vi.fn(() => ({
      type: 'sine',
      frequency: { setValueAtTime: vi.fn() },
      detune: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }));

    createGainSpy = vi.fn(() => ({
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    }));

    createBufferSpy = vi.fn((channels: number, length: number) => ({
      getChannelData: vi.fn(() => new Float32Array(length)),
    }));

    createBufferSourceSpy = vi.fn(() => ({
      buffer: null,
      loop: false,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }));

    createBiquadFilterSpy = vi.fn(() => ({
      type: 'lowpass',
      frequency: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
      Q: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
    }));

    resumeSpy = vi.fn(() => Promise.resolve());

    // Create a proper class mock
    class MockAudioContext {
      state = 'running';
      currentTime = 0;
      sampleRate = 44100;
      destination = {};

      createOscillator = createOscillatorSpy;
      createGain = createGainSpy;
      createBuffer = createBufferSpy;
      createBufferSource = createBufferSourceSpy;
      createBiquadFilter = createBiquadFilterSpy;
      resume = resumeSpy;
      close = vi.fn(() => Promise.resolve());
    }

    // @ts-expect-error - Mocking AudioContext
    window.AudioContext = MockAudioContext;
  });

  afterEach(() => {
    if (originalAudioContext) {
      window.AudioContext = originalAudioContext;
    }
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('returns sound control functions', () => {
      const { result } = renderHook(() => useSound());

      expect(result.current.playSound).toBeInstanceOf(Function);
      expect(result.current.playKeySound).toBeInstanceOf(Function);
      expect(result.current.startAmbient).toBeInstanceOf(Function);
      expect(result.current.stopAmbient).toBeInstanceOf(Function);
      expect(result.current.toggleSound).toBeInstanceOf(Function);
      expect(result.current.updateAmbientTension).toBeInstanceOf(Function);
    });

    it('starts with sound enabled', () => {
      const { result } = renderHook(() => useSound());

      expect(result.current.soundEnabled).toBe(true);
    });

    it('starts with default master volume', () => {
      const { result } = renderHook(() => useSound());

      expect(result.current.masterVolume).toBe(0.5);
    });
  });

  describe('toggleSound', () => {
    it('toggles sound enabled state', () => {
      const { result } = renderHook(() => useSound());

      expect(result.current.soundEnabled).toBe(true);

      act(() => {
        result.current.toggleSound();
      });

      expect(result.current.soundEnabled).toBe(false);

      act(() => {
        result.current.toggleSound();
      });

      expect(result.current.soundEnabled).toBe(true);
    });
  });

  describe('setMasterVolume', () => {
    it('updates master volume', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.setMasterVolume(0.8);
      });

      expect(result.current.masterVolume).toBe(0.8);
    });
  });

  describe('playSound', () => {
    it('does not play when sound is disabled', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.toggleSound(); // Disable sound
      });

      act(() => {
        result.current.playSound('keypress');
      });

      // AudioContext should not create oscillator when sound is disabled
      expect(createOscillatorSpy).not.toHaveBeenCalled();
    });

    it('creates oscillator for keypress sound', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playSound('keypress');
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
      expect(createGainSpy).toHaveBeenCalled();
    });

    it('creates oscillator for enter sound', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playSound('enter');
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
    });

    it('creates noise buffer for glitch sound', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playSound('glitch');
      });

      expect(createBufferSpy).toHaveBeenCalled();
      expect(createBufferSourceSpy).toHaveBeenCalled();
      expect(createBiquadFilterSpy).toHaveBeenCalled();
    });

    it('creates noise buffer for static sound', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playSound('static');
      });

      expect(createBufferSpy).toHaveBeenCalled();
      expect(createBufferSourceSpy).toHaveBeenCalled();
    });
  });

  describe('playKeySound', () => {
    it('does not play when sound is disabled', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.toggleSound();
      });

      act(() => {
        result.current.playKeySound('a');
      });

      expect(createOscillatorSpy).not.toHaveBeenCalled();
    });

    it('plays different sound for space key', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playKeySound(' ');
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
    });

    it('plays different sound for backspace key', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playKeySound('Backspace');
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
    });

    it('plays regular sound for letter keys', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playKeySound('x');
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
    });
  });

  describe('ambient sounds', () => {
    it('starts ambient sound', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.startAmbient();
      });

      expect(createBufferSpy).toHaveBeenCalled();
      expect(createBufferSourceSpy).toHaveBeenCalled();
      expect(createBiquadFilterSpy).toHaveBeenCalled();
    });

    it('does not start ambient when sound is disabled', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.toggleSound();
      });

      act(() => {
        result.current.startAmbient();
      });

      expect(createBufferSourceSpy).not.toHaveBeenCalled();
    });

    it('stops ambient sound without throwing', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.startAmbient();
      });

      act(() => {
        result.current.stopAmbient();
      });

      // Should not throw
      expect(true).toBe(true);
    });

    it('calls updateAmbientTension without error', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.startAmbient();
      });

      act(() => {
        result.current.updateAmbientTension(75);
      });

      // Should not throw
      expect(createBiquadFilterSpy).toHaveBeenCalled();
    });
  });

  describe('special sounds', () => {
    it('plays error sound', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playSound('error');
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
    });

    it('plays warning sound', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playSound('warning');
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
    });

    it('plays success sound', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playSound('success');
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
    });

    it('plays alert sound', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playSound('alert');
      });

      // Alert uses setTimeout for repeating beeps, advance timers
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
      vi.useRealTimers();
    });

    it('plays message sound', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playSound('message');
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
    });

    it('plays reveal sound', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playSound('reveal');
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
    });

    it('plays typing sound', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playSound('typing');
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
    });

    it('plays transmission sound', () => {
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playSound('transmission');
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
    });

    it('plays fanfare sound', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useSound());

      act(() => {
        result.current.playSound('fanfare');
      });

      // Fanfare uses setTimeout for note sequence, advance timers
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(createOscillatorSpy).toHaveBeenCalled();
      vi.useRealTimers();
    });
  });
});
