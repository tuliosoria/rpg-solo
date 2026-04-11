import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import StaticNoise from '../StaticNoise';

describe('StaticNoise', () => {
  const mockContext = {
    createImageData: vi.fn((width: number, height: number) => ({
      data: new Uint8ClampedArray(width * height * 4),
      width,
      height,
    })),
    putImageData: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(200 * 200 * 4),
      width: 200,
      height: 200,
    })),
    drawImage: vi.fn(),
    filter: '',
  } as unknown as CanvasRenderingContext2D;

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockContext);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('initializes the canvas when static activates after starting hidden', async () => {
    const { container, rerender } = render(<StaticNoise intensity={0} alienVisible={false} />);

    expect(container.querySelector('canvas')).toBeNull();

    rerender(<StaticNoise intensity={0.5} alienVisible={false} />);

    await waitFor(() => {
      const canvas = container.querySelector('canvas') as HTMLCanvasElement | null;
      expect(canvas).not.toBeNull();
      expect(canvas?.width).toBe(200);
      expect(canvas?.height).toBe(200);
    });
  });
});
