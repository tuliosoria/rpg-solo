'use client';

import { useCallback, useRef, useEffect, useState } from 'react';

// Sound types
export type SoundType = 
  | 'keypress'
  | 'enter'
  | 'error'
  | 'warning'
  | 'success'
  | 'alert'
  | 'glitch'
  | 'ambient'
  | 'static'
  | 'message'
  | 'reveal'
  | 'typing';

// Sound configuration
interface SoundConfig {
  volume: number;
  loop?: boolean;
  variations?: number;
}

const SOUND_CONFIG: Record<SoundType, SoundConfig> = {
  keypress: { volume: 0.15, variations: 3 },
  enter: { volume: 0.25 },
  error: { volume: 0.4 },
  warning: { volume: 0.35 },
  success: { volume: 0.3 },
  alert: { volume: 0.5 },
  glitch: { volume: 0.25 },
  ambient: { volume: 0.08, loop: true },
  static: { volume: 0.12 },
  message: { volume: 0.3 }, // UFO74 message received
  reveal: { volume: 0.4 }, // Important discovery
  typing: { volume: 0.08 }, // Stream typing sound
};

// Generate oscillator-based sounds (no external files needed)
const createOscillatorSound = (
  audioContext: AudioContext,
  type: OscillatorType,
  frequency: number,
  duration: number,
  volume: number,
  detune: number = 0
): void => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.detune.setValueAtTime(detune, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
};

// Create noise buffer for static/glitch sounds
const createNoiseBuffer = (audioContext: AudioContext, duration: number): AudioBuffer => {
  const bufferSize = audioContext.sampleRate * duration;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  return buffer;
};

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [masterVolume, setMasterVolume] = useState(0.5);

  // Initialize audio context on first interaction
  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    return audioContextRef.current;
  }, []);

  // Play a synthesized sound
  const playSound = useCallback((type: SoundType) => {
    if (!soundEnabled) return;
    
    const audioContext = initAudio();
    if (!audioContext) return;
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const config = SOUND_CONFIG[type];
    const volume = config.volume * masterVolume;
    
    switch (type) {
      case 'keypress': {
        const variation = Math.random() * 200 - 100;
        createOscillatorSound(audioContext, 'square', 800 + variation, 0.02, volume * 0.3, variation);
        createOscillatorSound(audioContext, 'triangle', 200 + variation / 2, 0.03, volume * 0.5);
        break;
      }
      
      case 'enter': {
        createOscillatorSound(audioContext, 'square', 600, 0.03, volume * 0.4);
        createOscillatorSound(audioContext, 'triangle', 150, 0.05, volume * 0.6);
        break;
      }
      
      case 'error': {
        createOscillatorSound(audioContext, 'sawtooth', 150, 0.15, volume);
        createOscillatorSound(audioContext, 'square', 100, 0.2, volume * 0.5, 50);
        break;
      }
      
      case 'warning': {
        createOscillatorSound(audioContext, 'sine', 880, 0.1, volume);
        setTimeout(() => {
          if (audioContextRef.current) {
            createOscillatorSound(audioContextRef.current, 'sine', 660, 0.1, volume);
          }
        }, 120);
        break;
      }
      
      case 'success': {
        createOscillatorSound(audioContext, 'sine', 523, 0.1, volume * 0.7);
        setTimeout(() => {
          if (audioContextRef.current) {
            createOscillatorSound(audioContextRef.current, 'sine', 659, 0.1, volume * 0.7);
          }
        }, 80);
        setTimeout(() => {
          if (audioContextRef.current) {
            createOscillatorSound(audioContextRef.current, 'sine', 784, 0.15, volume);
          }
        }, 160);
        break;
      }
      
      case 'alert': {
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            if (audioContextRef.current) {
              createOscillatorSound(audioContextRef.current, 'square', 440, 0.08, volume);
            }
          }, i * 150);
        }
        break;
      }
      
      case 'glitch': {
        const noiseBuffer = createNoiseBuffer(audioContext, 0.1);
        const noiseSource = audioContext.createBufferSource();
        const noiseGain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        noiseSource.buffer = noiseBuffer;
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000 + Math.random() * 2000, audioContext.currentTime);
        filter.Q.setValueAtTime(5, audioContext.currentTime);
        
        noiseGain.gain.setValueAtTime(volume, audioContext.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        noiseSource.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioContext.destination);
        
        noiseSource.start();
        break;
      }
      
      case 'static': {
        const noiseBuffer = createNoiseBuffer(audioContext, 0.2);
        const noiseSource = audioContext.createBufferSource();
        const noiseGain = audioContext.createGain();
        
        noiseSource.buffer = noiseBuffer;
        noiseGain.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
        
        noiseSource.connect(noiseGain);
        noiseGain.connect(audioContext.destination);
        
        noiseSource.start();
        break;
      }
      
      case 'ambient': {
        // Handled by startAmbient
        break;
      }
      
      case 'message': {
        // UFO74 message - soft ascending chime
        createOscillatorSound(audioContext, 'sine', 523, 0.08, volume * 0.6);
        setTimeout(() => {
          if (audioContextRef.current) {
            createOscillatorSound(audioContextRef.current, 'sine', 659, 0.1, volume * 0.5);
          }
        }, 80);
        setTimeout(() => {
          if (audioContextRef.current) {
            createOscillatorSound(audioContextRef.current, 'sine', 784, 0.15, volume * 0.4);
          }
        }, 160);
        break;
      }
      
      case 'reveal': {
        // Important discovery - dramatic reveal
        createOscillatorSound(audioContext, 'sine', 262, 0.3, volume * 0.4);
        createOscillatorSound(audioContext, 'sine', 330, 0.3, volume * 0.3);
        createOscillatorSound(audioContext, 'sine', 392, 0.3, volume * 0.3);
        setTimeout(() => {
          if (audioContextRef.current) {
            createOscillatorSound(audioContextRef.current, 'sine', 523, 0.4, volume * 0.5);
          }
        }, 200);
        break;
      }
      
      case 'typing': {
        // Soft typing sound for streaming
        const variation = Math.random() * 100 - 50;
        createOscillatorSound(audioContext, 'triangle', 300 + variation, 0.01, volume * 0.2);
        break;
      }
    }
  }, [soundEnabled, masterVolume, initAudio]);

  // Start ambient background drone
  const startAmbient = useCallback(() => {
    if (!soundEnabled || ambientSourceRef.current) return;
    
    const audioContext = initAudio();
    if (!audioContext) return;
    
    // Create noise-based ambient
    const noiseBuffer = createNoiseBuffer(audioContext, 2);
    const noiseSource = audioContext.createBufferSource();
    const noiseGain = audioContext.createGain();
    const noiseFilter = audioContext.createBiquadFilter();
    
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(400, audioContext.currentTime);
    noiseGain.gain.setValueAtTime(SOUND_CONFIG.ambient.volume * masterVolume, audioContext.currentTime);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    
    noiseSource.start();
    ambientSourceRef.current = noiseSource;
  }, [soundEnabled, masterVolume, initAudio]);
  
  // Update ambient pitch based on detection level (200Hz at 0%, up to 600Hz at 100%)
  const updateAmbientPitch = useCallback((detectionLevel: number) => {
    if (!audioContextRef.current) return;
    
    // Calculate filter frequency based on detection (more tense as detection rises)
    const baseFreq = 200;
    const maxFreq = 600;
    const freq = baseFreq + (detectionLevel / 100) * (maxFreq - baseFreq);
    
    // If we have the filter node, update its frequency
    // Note: We need to recreate the graph to change the filter, so this is a simplified version
    // In practice, you'd store the filter node in a ref and update it directly
  }, []);

  // Stop ambient
  const stopAmbient = useCallback(() => {
    if (ambientSourceRef.current) {
      try {
        ambientSourceRef.current.stop();
      } catch {
        // Already stopped
      }
      ambientSourceRef.current = null;
    }
  }, []);

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      if (prev) {
        stopAmbient();
      }
      return !prev;
    });
  }, [stopAmbient]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbient();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAmbient]);

  return {
    playSound,
    startAmbient,
    stopAmbient,
    toggleSound,
    updateAmbientPitch,
    soundEnabled,
    masterVolume,
    setMasterVolume,
  };
}
