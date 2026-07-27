import { describe, it, expect } from 'vitest';
import { resolveSubmitInput } from '../resolveSubmitInput';

describe('resolveSubmitInput', () => {
  it('uses the override when provided, including empty string', () => {
    expect(resolveSubmitInput('typed value', 'open x')).toBe('open x');
    expect(resolveSubmitInput('typed value', '')).toBe(''); // Enter-only mode
  });
  it('falls back to the live input value when override is undefined', () => {
    expect(resolveSubmitInput('typed value', undefined)).toBe('typed value');
  });
});
