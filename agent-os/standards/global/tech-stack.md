# Tech Stack

## Framework & Runtime
- **Application Framework:** TanStack Start (TanStack Router + Nitro server)
- **Language/Runtime:** TypeScript (ES2022 target, strict mode)
- **Package Manager:** npm
- **Server Runtime:** Nitro (nightly builds)

## Frontend
- **UI Framework:** React 19
- **CSS Framework:** Tailwind CSS (migrating from plain CSS)
- **Routing:** TanStack Router (file-based, type-safe)
- **Icons:** lucide-react

## Build & Dev
- **Build Tool:** Vite 7+
- **Dev Tools:** TanStack Router Devtools, React Router Devtools
- **Module Resolution:** Bundler mode (`moduleResolution: "bundler"`)
- **Module System:** ES Modules only (`"type": "module"`)

## Testing & Quality
- **Test Framework:** Vitest + @testing-library/react (jsdom)
- **Type Checking:** TypeScript strict mode with `noUnusedLocals`, `noUnusedParameters`

## Key Dependencies
- `@tanstack/react-router` — Type-safe file-based routing
- `@tanstack/react-start` — SSR, server functions, API routes
- `nitro-nightly` — Server runtime (bleeding-edge, intentional)
- `@tailwindcss/vite` — Tailwind CSS Vite plugin
