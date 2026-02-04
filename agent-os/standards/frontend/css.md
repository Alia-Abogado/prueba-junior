# CSS Approach

Project is migrating to Tailwind CSS. **New code should use Tailwind utilities.**

## Current State

- Tailwind CSS is installed and configured via `@tailwindcss/vite` plugin
- Global styles imported in `__root.tsx` via `styles.css` (contains `@import "tailwindcss"`)
- Legacy plain CSS files exist (e.g., `Header.css`, `App.css`, `start.css`)
- Some components mix Tailwind utilities and plain CSS classes

## Rules for New Code

- Use Tailwind utility classes for all new styling
- Do not create new `.css` files for components
- When modifying existing components, migrate to Tailwind if touching the styling
- Global styles that can't be expressed as utilities go in `styles.css`

## Legacy CSS Pattern (do not use for new code)

```tsx
// Old pattern — co-located CSS file
import './Header.css'
<div className="nav-item">...</div>
```

```tsx
// New pattern — Tailwind utilities
<div className="px-2 font-bold">...</div>
```

## Gotchas

- `App.css` is CRA boilerplate — ignore its naming conventions (PascalCase classes)
- Plain CSS classes are global and not scoped — Tailwind avoids this problem
- When refactoring, verify Tailwind utilities match the existing CSS values exactly
