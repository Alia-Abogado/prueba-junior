# Project Conventions

## ES Modules Only

`"type": "module"` in `package.json`. All code uses `import`/`export`.

- No `require()` or `module.exports` anywhere
- Config files (`vite.config.ts`, etc.) use ES module syntax
- Server functions and Nitro handlers also use ESM

## Nitro Nightly Builds

Uses `"nitro": "npm:nitro-nightly@latest"` intentionally for latest features.

- Accept that nightly builds may introduce breaking changes
- Coordinate before updating dependencies
- Documentation may lag behind nightly features
- This is intentional for accessing bleeding-edge TanStack Start capabilities

## File Organization

```
src/
  components/    → Reusable UI components
  data/          → Server functions (createServerFn)
  routes/        → File-based routes and API handlers
    api.*        → API route handlers (server.handlers)
    *.tsx        → Page routes
  router.tsx     → Router factory (getRouter)
  routeTree.gen.ts → Auto-generated (read-only)
  styles.css     → Global Tailwind entry point
```

## Naming Conventions

- Route files: kebab-case with dot separators (`start.ssr.full-ssr.tsx`)
- Components: PascalCase (`Header.tsx`)
- Server functions: camelCase exports (`getPunkSongs`)
- API routes: `api.` prefix in filename (`api.names.ts`)
- Data files: descriptive names in `src/data/` (`demo.punk-songs.ts`)
