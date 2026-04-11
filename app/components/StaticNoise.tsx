'use client';

import { useRef, useEffect, memo } from 'react';
import styles from './StaticNoise.module.css';

interface StaticNoiseProps {
  /** Noise intensity 0-1. 0 = hidden, 1 = full whiteout */
  intensity: number;
  /** Whether the alien face should be materializing */
  alienVisible: boolean;
}

const CANVAS_SIZE = 200;
const FRAME_INTERVAL = 83; // ~12fps for authentic TV static feel
const ALIEN_FADE_IN_STEP = 0.006; // ~4.2s to reach max at 12fps
const ALIEN_FADE_OUT_STEP = 0.012; // ~2.1s to disappear
const ALIEN_MAX_OPACITY = 0.3;

const StaticNoise = memo(function StaticNoise({
  intensity,
  alienVisible,
}: StaticNoiseProps) {
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

      // Crop to face region — high contrast, very dark, grayscale
      // The face occupies roughly the upper 55% of the image, centered
      ctx.filter = 'grayscale(100%) contrast(2.0) brightness(0.3)';
      const srcX = img.width * 0.12;
      const srcY = img.height * 0.0;
      const srcW = img.width * 0.76;
      const srcH = img.height * 0.55;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

      alienDataRef.current = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    };
  }, []);

  // Main animation loop — reads all dynamic values from refs
  useEffect(() => {
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
  }, []);

  if (intensity <= 0) return null;

  // Quadratic ease-in: early stages very subtle, accelerates dramatically
  const canvasOpacity = Math.min(0.88, intensity * intensity * 0.88);

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
