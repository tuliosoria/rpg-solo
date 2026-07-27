/** Chooses the submit source: an explicit override (even '') wins over the live input. */
export function resolveSubmitInput(inputValue: string, overrideInput?: string): string {
  return overrideInput ?? inputValue;
}
