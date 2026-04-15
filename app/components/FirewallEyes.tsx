'use client';

import React, { useEffect, useRef, useMemo, useState, memo } from 'react';
import { useI18n, translateStatic } from '../i18n';
import styles from './FirewallEyes.module.css';

// Detection threshold for firewall activation
const DETECTION_THRESHOLD = 25;
const SCREEN_OVERLAY_BOUNDS = { position: 'absolute' as const, inset: 0 };

// Detection band → eye count
function getEyeCount(detectionLevel: number): number {
  if (detectionLevel >= 90) return 10;
  if (detectionLevel >= 80) return 8;
  if (detectionLevel >= 60) return 6;
  if (detectionLevel >= 40) return 4;
  if (detectionLevel >= 25) return 2;
  return 0;
}

// Detection band key — changes only at thresholds
function getDetectionBand(detectionLevel: number): number {
  if (detectionLevel >= 90) return 90;
  if (detectionLevel >= 80) return 80;
  if (detectionLevel >= 60) return 60;
  if (detectionLevel >= 40) return 40;
  if (detectionLevel >= 25) return 25;
  return 0;
}

// Predefined edge positions — first N selected based on eye count
interface EyePosition {
  edge: 'top' | 'bottom' | 'left' | 'right';
  offset: string; // CSS value along the edge
  blinkClass: string;
}

const EDGE_POSITIONS: EyePosition[] = [
  { edge: 'top', offset: '25%', blinkClass: styles.blinkA },
  { edge: 'bottom', offset: '70%', blinkClass: styles.blinkB },
  { edge: 'right', offset: '35%', blinkClass: styles.blinkC },
  { edge: 'left', offset: '60%', blinkClass: styles.blinkA },
  { edge: 'top', offset: '65%', blinkClass: styles.blinkB },
  { edge: 'bottom', offset: '30%', blinkClass: styles.blinkC },
  { edge: 'left', offset: '25%', blinkClass: styles.blinkA },
  { edge: 'right', offset: '75%', blinkClass: styles.blinkB },
  { edge: 'top', offset: '85%', blinkClass: styles.blinkC },
  { edge: 'bottom', offset: '50%', blinkClass: styles.blinkA },
];

function getEdgeStyle(pos: EyePosition): React.CSSProperties {
  switch (pos.edge) {
    case 'top':
      return { left: pos.offset };
    case 'bottom':
      return { left: pos.offset };
    case 'left':
      return { top: pos.offset };
    case 'right':
      return { top: pos.offset };
  }
}

function getEdgeClassName(edge: string): string {
  switch (edge) {
    case 'top': return styles.edgeTop;
    case 'bottom': return styles.edgeBottom;
    case 'left': return styles.edgeLeft;
    case 'right': return styles.edgeRight;
    default: return '';
  }
}

interface FirewallEyesProps {
  detectionLevel: number;
  firewallActive: boolean;
  firewallDisarmed: boolean;
  onActivateFirewall: () => void;
  onFirewallTaunt?: () => void;
  externalGlowTrigger?: number;
}

function FirewallEyesComponent({
  detectionLevel,
  firewallActive,
  firewallDisarmed,
  onActivateFirewall,
  onFirewallTaunt,
  externalGlowTrigger,
}: FirewallEyesProps) {
  const { t } = useI18n();
  const trackingPupilRef = useRef<HTMLDivElement | null>(null);
  const trackingIrisRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const lastPhraseIndexRef = useRef<number>(-1);
  const tauntTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isGlowing, setIsGlowing] = useState(false);

  // Activate firewall when detection reaches threshold
  useEffect(() => {
    if (!firewallActive && !firewallDisarmed && detectionLevel >= DETECTION_THRESHOLD) {
      onActivateFirewall();
    }
  }, [detectionLevel, firewallActive, firewallDisarmed, onActivateFirewall]);

  const band = getDetectionBand(detectionLevel);
  const eyeCount = useMemo(() => getEyeCount(detectionLevel), [band]); // eslint-disable-line react-hooks/exhaustive-deps
  const positions = useMemo(() => EDGE_POSITIONS.slice(0, eyeCount), [eyeCount]);

  const isHighAlert = detectionLevel >= 80;

  // Cursor tracking for one eye at ≥80% detection (via refs, no state)
  useEffect(() => {
    if (!isHighAlert) return;

    const onMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const pupil = trackingPupilRef.current;
        const iris = trackingIrisRef.current;
        if (!pupil || !iris) return;

        const rect = iris.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const maxShift = 4;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const clamp = Math.min(1, dist / 200);
        const tx = (dx / dist) * maxShift * clamp;
        const ty = (dy / dist) * maxShift * clamp;
        pupil.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHighAlert]);

  // Audio taunts with eye glow — random interval 60-180s
  useEffect(() => {
    if (!firewallActive || firewallDisarmed) return;

    const scheduleTaunt = () => {
      const delay = (60 + Math.random() * 120) * 1000;
      tauntTimerRef.current = setTimeout(() => {
        // Pick a random phrase, never same twice in a row
        let idx: number;
        do {
          idx = Math.floor(Math.random() * FIREWALL_PHRASES.length);
        } while (idx === lastPhraseIndexRef.current && FIREWALL_PHRASES.length > 1);
        lastPhraseIndexRef.current = idx;

        // Speak the taunt (may fail silently if browser blocks it)
        speakCustomFirewallVoice(t(FIREWALL_PHRASES[idx].key));

        // Glow for 3 seconds — always fires regardless of speech success
        setIsGlowing(true);
        setTimeout(() => setIsGlowing(false), 3000);

        // Notify Terminal for UFO74 reaction — always fires
        onFirewallTaunt?.();

        // Schedule next taunt
        scheduleTaunt();
      }, delay);
    };

    scheduleTaunt();

    return () => {
      if (tauntTimerRef.current !== null) {
        clearTimeout(tauntTimerRef.current);
        tauntTimerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firewallActive, firewallDisarmed]);

  // External glow trigger (e.g. blocked search term)
  useEffect(() => {
    if (!externalGlowTrigger) return;
    setIsGlowing(true);
    const timer = setTimeout(() => setIsGlowing(false), 3000);
    return () => clearTimeout(timer);
  }, [externalGlowTrigger]);

  // Don't render if disarmed or not active
  if (firewallDisarmed || !firewallActive) return null;

  return (
    <div className={styles.firewallContainer} style={SCREEN_OVERLAY_BOUNDS}>
      {positions.map((pos, i) => {
        const isTrackingEye = isHighAlert && i === 0;
        const eyeClasses = [
          styles.eye,
          getEdgeClassName(pos.edge),
          pos.blinkClass,
          isHighAlert ? styles.highAlert : '',
          isTrackingEye ? styles.tracking : '',
          isGlowing ? styles.glowing : '',
        ].filter(Boolean).join(' ');

        return (
          <div
            key={`fw-eye-${i}`}
            className={eyeClasses}
            style={{
              ...getEdgeStyle(pos),
              animationDelay: `${i * 0.3}s`,
            }}
            data-testid="firewall-ambient-eye"
          >
            <div className={styles.eyeSocket}>
              <div
                className={styles.iris}
                ref={isTrackingEye ? trackingIrisRef : undefined}
              >
                <div
                  className={styles.pupil}
                  ref={isTrackingEye ? trackingPupilRef : undefined}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const FirewallEyes = memo(FirewallEyesComponent);
export default FirewallEyes;

// Creepy voice phrases for firewall eyes
const FIREWALL_PHRASES = [
  { key: 'firewall.voice.seeYou', fallback: 'I see you' },
  { key: 'firewall.voice.youWillFail', fallback: 'You will fail' },
  { key: 'firewall.voice.weBlockYou', fallback: 'We block you' },
  { key: 'firewall.voice.cannotEscape', fallback: 'Cannot escape' },
  { key: 'firewall.voice.foundYou', fallback: 'Found you' },
  { key: 'firewall.voice.resistanceIsFutile', fallback: 'Resistance is futile' },
];

// Firewall audio — plays pre-recorded audio files instead of TTS
const FIREWALL_AUDIO_PATHS = [
  '/audio/firewall-audio.wav',
  '/audio/firewall-audio-2.wav',
  '/audio/firewall-voice-3.wav',
  '/audio/firewall-audio-4.wav',
];
let firewallAudioElements: HTMLAudioElement[] = [];
let audioUnlocked = false;
let lastAudioIndex = -1;

// Initialize firewall audio — preload all audio files
export function initVoices(): void {
  if (typeof window === 'undefined') return;
  firewallAudioElements = FIREWALL_AUDIO_PATHS.map(path => {
    const audio = new Audio(path);
    audio.preload = 'auto';
    return audio;
  });
}

// Unlock audio playback — must be called from a user gesture (click/keydown)
// to satisfy browser autoplay policy.
export function unlockSpeechSynthesis(): void {
  if (audioUnlocked || typeof window === 'undefined') return;
  const first = firewallAudioElements[0];
  if (first) {
    first.volume = 0;
    first.play().then(() => {
      first.pause();
      first.currentTime = 0;
      first.volume = 1.0;
    }).catch(() => {});
  }
  audioUnlocked = true;
}

// Play a random firewall audio file (never same twice in a row)
export function speakCustomFirewallVoice(_phrase: string): void {
  if (typeof window === 'undefined' || !firewallAudioElements.length) return;
  try {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * firewallAudioElements.length);
    } while (idx === lastAudioIndex && firewallAudioElements.length > 1);
    lastAudioIndex = idx;

    const audio = firewallAudioElements[idx];
    audio.currentTime = 0;
    audio.volume = 1.0;
    audio.play().catch(() => {});
  } catch {
    // Audio failed — glow + UFO74 reaction still fire from the caller
  }
}

// Export constants for use elsewhere
export const FIREWALL_PHRASE_TEXT = FIREWALL_PHRASES.map(phrase =>
  translateStatic(phrase.key, undefined, phrase.fallback)
);

export { DETECTION_THRESHOLD, FIREWALL_PHRASES };
