'use client';

import { useRef, useEffect, memo } from 'react';
import styles from './StaticNoise.module.css';

interface StaticNoiseProps {
  /** Noise intensity 0-1. 0 = hidden, 1 = strongest overlay */
  intensity: number;
  /** Whether the alien face should be materializing */
  alienVisible: boolean;
}

const CANVAS_SIZE = 200;
const FRAME_INTERVAL = 83; // ~12fps for authentic TV static feel
const ALIEN_FADE_IN_STEP = 0.0045; // ~5.5s to reach max at 12fps
const ALIEN_FADE_OUT_STEP = 0.012; // ~2.1s to disappear
const ALIEN_MAX_OPACITY = 0.12;
const BASE_NOISE_OPACITY = 0.015;
const MAX_NOISE_OPACITY = 0.22;

const StaticNoise = memo(function StaticNoise({
  intensity,
  alienVisible,
}: StaticNoiseProps) {
  const isActive = intensity > 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const alienDataRef = useRef<ImageData | null>(null);
  const alienOpacityRef = useRef(0);
  const intensityRef = useRef(intensity);
  const alienVisibleRef = useRef(alienVisible);
  const animFrameRef = useRef<number>(0);

  intensityRef.current = intensity;
  alienVisibleRef.current = alienVisible;

  // Pre-load and process alien face into grayscale pixel data
  useEffect(() => {
    const img = new Image();
    img.src = '/images/bio-program.png';
    img.onload = () => {
      const offscreen = document.createElement('canvas');
      offscreen.width = CANVAS_SIZE;
      offscreen.height = CANVAS_SIZE;
      const ctx = offscreen.getContext('2d');
      if (!ctx) return;

      // Crop to the facial region and render it smaller than the full overlay,
      // so it feels glimpsed inside the static rather than stamped on the screen.
      ctx.filter = 'grayscale(100%) contrast(1.85) brightness(0.28)';
      const srcX = img.width * 0.12;
      const srcY = img.height * 0.0;
      const srcW = img.width * 0.76;
      const srcH = img.height * 0.55;
      const destW = CANVAS_SIZE * 0.66;
      const destH = CANVAS_SIZE * 0.8;
      const destX = (CANVAS_SIZE - destW) / 2;
      const destY = CANVAS_SIZE * 0.06;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, destX, destY, destW, destH);

      alienDataRef.current = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    };
  }, []);

  // Main animation loop — reads all dynamic values from refs
  useEffect(() => {
    if (!isActive) {
      alienOpacityRef.current = 0;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    let lastFrame = 0;

    const render = (time: number) => {
      if (time - lastFrame >= FRAME_INTERVAL) {
        lastFrame = time;

        const currentIntensity = intensityRef.current;
        if (currentIntensity > 0) {
          // Animate alien opacity toward target
          const target = alienVisibleRef.current ? ALIEN_MAX_OPACITY : 0;
          if (alienOpacityRef.current < target) {
            alienOpacityRef.current = Math.min(
              alienOpacityRef.current + ALIEN_FADE_IN_STEP,
              target
            );
          } else if (alienOpacityRef.current > target) {
            alienOpacityRef.current = Math.max(
              alienOpacityRef.current - ALIEN_FADE_OUT_STEP,
              0
            );
          }

          const imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE);
          const data = imageData.data;
          const alienData = alienDataRef.current?.data;
          const alienOp = alienOpacityRef.current;

          for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 255;

            if (alienData && alienOp > 0.005) {
              const alienBrightness = alienData[i]; // grayscale: R=G=B
              const alienAlpha = alienData[i + 3] / 255;

              // Per-pixel random threshold creates organic emergence —
              // the face "forms" from the noise as more pixels cross the threshold
              if (Math.random() < alienOp * alienAlpha * 1.8) {
                const blend = 0.35 + Math.random() * 0.4;
                const v = alienBrightness * blend + noise * (1 - blend);
                data[i] = data[i + 1] = data[i + 2] = v;
              } else {
                data[i] = data[i + 1] = data[i + 2] = noise;
              }
            } else {
              data[i] = data[i + 1] = data[i + 2] = noise;
            }
            data[i + 3] = 255;
          }

          ctx.putImageData(imageData, 0, 0);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isActive]);

  if (!isActive) return null;

  // Keep the static legible at all times: transparent at low levels,
  // stronger near 100% detection, but never opaque enough to replace text.
  const canvasOpacity = Math.min(
    MAX_NOISE_OPACITY,
    BASE_NOISE_OPACITY + intensity * intensity * (MAX_NOISE_OPACITY - BASE_NOISE_OPACITY)
  );

  return (
    <canvas
      ref={canvasRef}
      className={styles.noiseCanvas}
      style={{ opacity: canvasOpacity }}
      aria-hidden="true"
    />
  );
});

export default StaticNoise;
