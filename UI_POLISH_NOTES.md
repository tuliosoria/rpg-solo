## UI Polish Summary

This project received a design system upgrade focused on consistency, accessibility, and future extensibility.

### Added
- Design tokens in `app/globals.css` (colors, spacing, typography, shadows, radii, transitions, motion preferences).
- Reusable components in `app/components/ui.tsx`:
  - `Button` (variants: primary, outline, danger, success, neutral; sizes; loading state)
  - `Panel` (glass / blurred surface wrapper)
  - `Modal` (accessible overlay)
- Metadata, skip link, and footer improvements in `layout.tsx`.
- A refined main menu panel in `page.tsx` using tokens and panel aesthetic.

### Tokens Overview
Key CSS variables (see `globals.css`):
- Color palette: `--color-primary-###`, semantic: `--accent`, `--danger`, etc.
- Spacing: `--space-[1..16]`
- Typography scale: `--text-xs` to `--text-4xl`
- Radii: `--radius-xs` through `--radius-pill`
- Shadows: `--shadow-xs` .. `--shadow-lg`, `--shadow-glow`
- Motion: `--transition-fast | base | emph`

### Utility Classes
- `.container-balanced` for responsive width.
- `.panel` for structured surfaces.
- `.btn`, `.btn-outline`, `.btn-danger`, `.btn-success`, `.btn-neutral` basic token-based buttons.
- `.fade-in-up` for entrance transitions.

### Accessibility Upgrades
- Skip link to main content.
- Reduced motion respect via media queries.
- Focus rings using semantic accent color.
- Buttons maintain contrast in both color schemes.

### Next Steps (Potential Enhancements)
- Dark mode toggle (currently auto via `prefers-color-scheme`).
- Centralized theme switcher (fantasy / terminal / modern variants).
- Extract inline styles inside `RpgSolo.tsx` into composable components.
- Implement CSS logical properties for better i18n direction support.
- Add Jest/Playwright snapshot tests for critical UI components.

### Migration Notes
Legacy inline styling is still present in gameplay screens. It can be progressively migrated to tokens & components without breaking stateful logic.

---
Generated on: 2025-08-27T00:00:00Z
