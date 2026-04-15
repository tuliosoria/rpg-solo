import type { TextSpeed } from '../types';

const TEXT_SPEED_DELAY_MULTIPLIER: Record<TextSpeed, number> = {
  slow: 1.5,
  normal: 1,
  fast: 0.6,
  instant: 0.08,
};

export function scaleTextSpeedDelay(
  baseDelay: number,
  textSpeed: TextSpeed,
  minimumDelay = 20
): number {
  if (baseDelay <= 0) {
    return 0;
  }

  return Math.max(minimumDelay, Math.round(baseDelay * TEXT_SPEED_DELAY_MULTIPLIER[textSpeed]));
}
