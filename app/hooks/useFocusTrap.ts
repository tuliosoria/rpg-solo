'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]',
]
  .map(s => `${s}:not([tabindex="-1"])`)
  .join(', ');

/**
 * Traps keyboard focus within a modal container element.
 *
 * - Saves the previously focused element on mount and restores it on unmount.
 * - Focuses the first focusable child inside the container on mount.
 * - Wraps Tab / Shift+Tab so focus cannot leave the container.
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Save the element that had focus before the modal opened
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Focus the first focusable element inside the container
    const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      // If nothing is focusable, focus the container itself so key events work
      container.setAttribute('tabindex', '-1');
      container.focus();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      const currentFocusable = container!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (currentFocusable.length === 0) return;

      const first = currentFocusable[0];
      const last = currentFocusable[currentFocusable.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if on the first element, wrap to the last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if on the last element, wrap to the first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the previously focused element
      previouslyFocused?.focus();
    };
  }, [containerRef]);
}
