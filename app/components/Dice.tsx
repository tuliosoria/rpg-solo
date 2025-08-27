"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Dice component (3D cube spin + sounds)
 * Props:
 *  - sides: number (default 20)
 *  - rolling: boolean triggers animation
 *  - finalValue?: number sets the result to display after animation stops
 *  - durationMs: total animation time before locking final value (default 1200)
 *  - onComplete?: (value:number) => void fired after animation completes
 *  - size: pixel size (square) of dice
 *  - Click during roll to speed-stop
 *  - smooth?: boolean enable physics smoothing (default true)
 *  - ticks?: boolean enable subtle tick sounds (default true)
 *  - motionPreference?: 'auto' | 'reduced' | 'full' force motion mode
 */
export interface DiceProps {
  sides?: number;
  rolling: boolean;
  finalValue?: number | null;
  durationMs?: number;
  onComplete?: (value: number) => void;
  size?: number; // px
  smooth?: boolean;
  ticks?: boolean;
  motionPreference?: 'auto' | 'reduced' | 'full';
  polish?: boolean; // enable enhanced visual polish (glow dynamics)
  settleWobble?: boolean; // subtle post-landing wobble
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3); // cubic ease-out

// Audio manager: rumble + stop beep + optional ticks
const useDiceAudio = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const rumbleRef = useRef<AudioBufferSourceNode | null>(null);
  const tickGainRef = useRef<GainNode | null>(null);
  const lastTickTimeRef = useRef<number>(0);

  const ensureCtx = async () => {
    if (typeof window === 'undefined') return null;
    try {
      const Ctx: typeof AudioContext | undefined = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return null;
      if (!ctxRef.current) ctxRef.current = new Ctx();
      if (ctxRef.current.state === 'suspended') await ctxRef.current.resume().catch(() => {});
      return ctxRef.current;
    } catch {
      return null;
    }
  };

  const makeNoiseBuffer = (ctx: AudioContext) => {
    const len = ctx.sampleRate; // 1s
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      const brown = (lastOut + 0.02 * white) / 1.02;
      lastOut = brown;
      data[i] = brown * 0.5;
    }
    return buffer;
  };

  const startRumble = async () => {
    const ctx = await ensureCtx();
    if (!ctx) return;
    // Stop previous if any
    stopRumble();
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(ctx);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 420;
    const gn = ctx.createGain();
    gn.gain.value = 0;
    src.connect(lp).connect(gn).connect(ctx.destination);
    src.start();
    gainRef.current = gn;
    rumbleRef.current = src;
    try {
      const t = ctx.currentTime;
      gn.gain.cancelScheduledValues(t);
      gn.gain.setValueAtTime(0, t);
      gn.gain.linearRampToValueAtTime(0.16, t + 0.08);
    } catch {}
  };

  const stopRumble = () => {
    const ctx = ctxRef.current;
    if (!ctx || !gainRef.current || !rumbleRef.current) return;
    const gn = gainRef.current;
    const src = rumbleRef.current;
    try {
      const t = ctx.currentTime;
      gn.gain.cancelScheduledValues(t);
      gn.gain.setValueAtTime(gn.gain.value, t);
      gn.gain.linearRampToValueAtTime(0, t + 0.08);
      src.stop(t + 0.1);
    } catch {}
    rumbleRef.current = null;
    gainRef.current = null;
  };

  const stopBeep = async (crit?: 'success' | 'failure') => {
    const ctx = await ensureCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gn = ctx.createGain();
      osc.type = crit === 'failure' ? 'sawtooth' : 'triangle';
      const base = crit === 'success' ? 1800 : crit === 'failure' ? 220 : 1200;
      osc.frequency.value = base;
      gn.gain.value = 0.001;
      osc.connect(gn).connect(ctx.destination);
      const t = ctx.currentTime;
      gn.gain.setValueAtTime(0.0001, t);
      gn.gain.exponentialRampToValueAtTime(0.15, t + 0.01);
      gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      osc.start(t);
      osc.stop(t + 0.16);
    } catch {}
  };

  const playTick = async (intensity: number) => {
    // intensity 0..1 controls volume & slight pitch variance
    const ctx = await ensureCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // cap tick rate
      if (lastTickTimeRef.current && now - lastTickTimeRef.current < 0.04) return; // max ~25/sec
      lastTickTimeRef.current = now;
      const osc = ctx.createOscillator();
      const gn = ctx.createGain();
      const base = 880 + 440 * intensity + (Math.random() - 0.5) * 60;
      osc.type = 'square';
      osc.frequency.value = base;
      gn.gain.value = 0.0005 + intensity * 0.003;
      osc.connect(gn).connect(ctx.destination);
      gn.gain.setValueAtTime(gn.gain.value, now);
      gn.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.075);
    } catch {}
  };

  return { startRumble, stopRumble, stopBeep, playTick };
};

export const Dice: React.FC<DiceProps> = ({
  sides = 20,
  rolling,
  finalValue = null,
  durationMs = 1200,
  onComplete,
  size = 64,
  smooth = true,
  ticks = true,
  motionPreference = 'auto',
  polish = true,
  settleWobble = true
}) => {
  const [displayValue, setDisplayValue] = useState<number>(() => Math.floor(Math.random() * sides) + 1);
  const startRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const accelRef = useRef(false);
  const [rot, setRot] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [transitioningHome, setTransitioningHome] = useState(false);
  const { startRumble, stopRumble, stopBeep, playTick } = useDiceAudio();

  // Physics state
  const velRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTimeRef = useRef<number | null>(null);
  const homingRef = useRef(false);
  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const faceShuffleCooldownRef = useRef(0);
  // Store a chosen final result early (at homing start) to prevent end pop
  const lockedFinalRef = useRef<number | null>(null);
  // Dynamic glow factor (0..1) derived from rotational velocity
  const [glowFactor, setGlowFactor] = useState(0);
  const lastGlowUpdateRef = useRef(0);
  // Post-settle wobble (ease-out fraction 0..1)
  const [settleProgress, setSettleProgress] = useState(0);
  const settlingRef = useRef(false);
  const settleStartRef = useRef(0);
  const settleRafRef = useRef<number | null>(null);
  const prefersReduced = useMemo(() => {
    if (motionPreference === 'full') return false;
    if (motionPreference === 'reduced') return true;
    if (typeof window === 'undefined') return false;
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, [motionPreference]);

  const isCritSuccess = displayValue === 20 && sides === 20;
  const isCritFailure = displayValue === 1 && sides === 20;

  const faceValues = useMemo(() => {
    const used = new Set<number>([displayValue]);
    const others: number[] = [];
    while (others.length < 5) {
      const v = Math.floor(Math.random() * sides) + 1;
      if (!used.has(v)) {
        used.add(v);
        others.push(v);
      }
    }
    // Face order: [front, back, right, left, top, bottom]
    return [displayValue, ...others.slice(0, 5)];
  }, [displayValue, sides]);

  useEffect(() => {
    if (!rolling) return;
    completedRef.current = false;
    accelRef.current = false;
    setTransitioningHome(false);
    startRef.current = performance.now();
    lastTimeRef.current = null;
  homingRef.current = false;
  lockedFinalRef.current = null;
    targetRef.current = { x: 0, y: 0 };
    faceShuffleCooldownRef.current = 0;
    if (!prefersReduced) startRumble();

    // Initialize velocities (random directions for variety)
    const baseSpeed = smooth ? 1400 : 900; // deg/sec magnitude
    velRef.current = {
      x: (Math.random() * 2 - 1) * baseSpeed,
      y: (Math.random() * 2 - 1) * baseSpeed * 1.4,
    };
    setRot({ x: 0, y: 0 });

    const loop = (now: number) => {
      if (!startRef.current) startRef.current = now;
      if (lastTimeRef.current == null) lastTimeRef.current = now;
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000); // seconds
      lastTimeRef.current = now;
      const elapsed = now - startRef.current;
      const total = durationMs * (accelRef.current ? 0.28 : 1);
      let t = Math.min(1, elapsed / total);

  if (!homingRef.current && t >= 0.78) {
        homingRef.current = true;
        setTransitioningHome(true);
        // Lock final value now for continuity (use provided finalValue or random)
        const locked = finalValue ?? Math.floor(Math.random() * sides) + 1;
        lockedFinalRef.current = locked;
        setDisplayValue(locked); // ensure front face already shows result
      }

      if (!homingRef.current) {
        // Apply damping to velocities
        const damping = smooth ? 0.94 : 0.9;
        velRef.current.x *= damping;
        velRef.current.y *= damping;
        // Random micro jitter injection proportional to remaining energy
        const energy = (1 - t);
        velRef.current.x += (Math.random() - 0.5) * 80 * energy;
        velRef.current.y += (Math.random() - 0.5) * 100 * energy;

        setRot(prev => ({
          x: prev.x + velRef.current.x * dt,
          y: prev.y + velRef.current.y * dt,
        }));

        if (polish) {
          // derive glow intensity from current velocity magnitude; throttle to ~60fps
          if (now - lastGlowUpdateRef.current > 16) {
            lastGlowUpdateRef.current = now;
            const mag = Math.min(1, Math.hypot(velRef.current.x, velRef.current.y) / 1800);
            setGlowFactor(mag);
          }
        }

        // Controlled face value changes: freq decreases over time
        // Only shuffle faces if we have not locked the final value yet
        if (lockedFinalRef.current == null) {
          faceShuffleCooldownRef.current -= dt;
            const shuffleInterval = 0.04 + t * 0.22; // start fast, slow down
            if (faceShuffleCooldownRef.current <= 0) {
              faceShuffleCooldownRef.current = shuffleInterval;
              const val = Math.floor(Math.random() * sides) + 1;
              setDisplayValue(val);
              if (ticks && !prefersReduced) {
                // Tick volume based on velocity magnitude
                const mag = Math.min(1, Math.hypot(velRef.current.x, velRef.current.y) / 1500);
                playTick(mag * 0.9);
              }
            }
        }
      } else {
        // Homing: smoothly ease rotations to nearest face orientation (0,0)
        setRot(prev => {
          const ease = 1 - Math.pow(1 - t, 3);
          const nx = prev.x * (0.6 - 0.5 * ease); // exponential damp
          const ny = prev.y * (0.6 - 0.5 * ease);
          return { x: nx, y: ny };
        });
      }

      if (t < 1) {
        requestAnimationFrame(loop);
      } else {
        // Use locked final value (should always be set). Fallback defensively.
        const final = lockedFinalRef.current ?? finalValue ?? Math.floor(Math.random() * sides) + 1;
        setRot({ x: 0, y: 0 });
        stopRumble();
        if (!prefersReduced) {
          stopBeep(final === 20 && sides === 20 ? 'success' : final === 1 && sides === 20 ? 'failure' : undefined);
        }
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.(final);
        }

        // Trigger settle wobble animation if enabled
        if (polish && settleWobble && !prefersReduced) {
          settlingRef.current = true;
          settleStartRef.current = performance.now();
          const animateSettle = (ts: number) => {
            if (!settlingRef.current) return;
            const p = Math.min(1, (ts - settleStartRef.current) / 520); // 0.52s settle
            // ease-out cubic
            const eased = 1 - Math.pow(1 - p, 3);
            setSettleProgress(eased);
            if (p < 1) {
              settleRafRef.current = requestAnimationFrame(animateSettle);
            } else {
              settlingRef.current = false;
            }
          };
          settleRafRef.current = requestAnimationFrame(animateSettle);
        }
      }
    };

    const raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      stopRumble();
  if (settleRafRef.current) cancelAnimationFrame(settleRafRef.current);
  settlingRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolling, sides, finalValue, durationMs, onComplete, smooth, ticks, motionPreference]);

  useEffect(() => {
    if (!rolling) stopRumble();
  }, [rolling, stopRumble]);

  // When not rolling, reflect provided finalValue immediately
  useEffect(() => {
    if (!rolling && finalValue != null) {
      setDisplayValue(finalValue);
      setRot({ x: 0, y: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolling, finalValue]);

  const handleClick = () => {
    if (rolling) accelRef.current = true;
  };

  // Compose settle wobble transform post-roll
  let wobbleTransform = '';
  if (polish && settleWobble && settleProgress > 0 && !rolling) {
    const inv = 1 - settleProgress; // decreasing from 1 -> 0
    // subtle breathing scale & micro tilts
    const scale = 1 + 0.045 * inv * Math.sin(inv * Math.PI * 3.1);
    const tiltX = inv * 4 * Math.sin(inv * Math.PI * 5.2);
    const tiltY = inv * -3.5 * Math.sin(inv * Math.PI * 4.6);
    wobbleTransform = ` scale(${scale.toFixed(4)}) rotateX(${tiltX.toFixed(3)}deg) rotateY(${tiltY.toFixed(3)}deg)`;
  }

  return (
    <div
      className="dice-container select-none"
      role="img"
      aria-label={`d${sides} showing ${displayValue}`}
      style={{
        width: size,
        height: size,
        perspective: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        onClick={handleClick}
        className={`relative flex items-center justify-center font-bold rounded-md`}
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          cursor: rolling ? 'pointer' : 'default',
        }}
      >
        {/* 3D cube */}
        <div
          style={{
            position: 'relative',
            width: size,
            height: size,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)${wobbleTransform}`,
            transition: transitioningHome ? 'transform 360ms cubic-bezier(0.23, 1.4, 0.32, 1)' : undefined,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const half = size / 2;
            let faceTransform = '';
            if (idx === 0) faceTransform = `translateZ(${half}px)`; // front
            if (idx === 1) faceTransform = `rotateY(180deg) translateZ(${half}px)`; // back
            if (idx === 2) faceTransform = `rotateY(90deg) translateZ(${half}px)`; // right
            if (idx === 3) faceTransform = `rotateY(-90deg) translateZ(${half}px)`; // left
            if (idx === 4) faceTransform = `rotateX(90deg) translateZ(${half}px)`; // top
            if (idx === 5) faceTransform = `rotateX(-90deg) translateZ(${half}px)`; // bottom

            const isFront = idx === 0;
            const baseGradient = isFront
              ? (displayValue === 20 && sides === 20
                  ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                  : displayValue === 1 && sides === 20
                  ? 'linear-gradient(135deg,#ef4444,#b91c1c)'
                  : (/* default */ 'linear-gradient(135deg,#1d4ed8,#4f46e5)'))
              : 'linear-gradient(135deg,#111827,#1f2937)';
            const rollingGradient = isFront ? 'linear-gradient(135deg,#4338ca,#7e22ce)' : 'linear-gradient(135deg,#111827,#1f2937)';
            const bg = rolling ? rollingGradient : baseGradient;
            // Dynamic glow based on state + glowFactor (front face only)
            let glow = '0 0 4px rgba(0,0,0,0.5)';
            if (isFront) {
              const gf = polish ? glowFactor : 0.4;
              if (displayValue === 20 && sides === 20) {
                glow = `0 0 ${8 + 8 * gf}px rgba(34,197,94,${0.55 + 0.35 * gf})`;
              } else if (displayValue === 1 && sides === 20) {
                glow = `0 0 ${8 + 8 * gf}px rgba(239,68,68,${0.55 + 0.35 * gf})`;
              } else if (rolling) {
                glow = `0 0 ${6 + 12 * gf}px rgba(168,85,247,${0.5 + 0.4 * gf})`;
              } else {
                glow = `0 0 ${5 + 5 * gf}px rgba(99,102,241,${0.5 + 0.35 * gf})`;
              }
            }

            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  backfaceVisibility: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: size * 0.5,
                  borderRadius: 12,
                  border: '2px solid rgba(255,255,255,0.2)',
                  boxShadow: `${glow}, inset 0 0 8px rgba(0,0,0,0.6)`,
                  background: bg,
                  transform: faceTransform,
                  userSelect: 'none',
                }}
              >
                {faceValues[idx]}
              </div>
            );
          })}
        </div>
        {rolling && (
          <span
            className="absolute"
            style={{
              bottom: -Math.max(10, size * 0.18),
              fontSize: size * 0.22,
              letterSpacing: '1px',
              color: '#c4b5fd',
              textShadow: '0 0 6px rgba(168,85,247,0.6)'
            }}
          >
            rolling...
          </span>
        )}
        {/* Accessibility live region for announcing result */}
        <div aria-live="polite" style={{position:'absolute',width:1,height:1,overflow:'hidden',clip:'rect(0 0 0 0)'}}>
          {!rolling && lockedFinalRef.current != null ? `Result: ${lockedFinalRef.current}` : ''}
        </div>
      </div>
    </div>
  );
};

export default Dice;
