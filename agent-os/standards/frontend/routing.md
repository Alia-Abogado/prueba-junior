# File-Based Routing (Dot Notation)

Routes use TanStack Router's dot-notation in filenames to define URL paths.

## Filename → URL Mapping

```
src/routes/demo/start.server-funcs.tsx  →  /demo/start/server-funcs
src/routes/demo/start.ssr.full-ssr.tsx  →  /demo/start/ssr/full-ssr
src/routes/demo/api.names.ts           →  /demo/api/names
```

- Dots (`.`) in filenames become path separators (`/`)
- Directories still work for top-level grouping (e.g., `demo/`)
- `index` suffix creates the base path: `start.ssr.index.tsx` → `/demo/start/ssr/`

## Rules

- Name files using kebab-case segments separated by dots
- Use directories only for top-level grouping, dots for nested paths
- Never edit `routeTree.gen.ts` — it's auto-generated on build
- Every route file must export a `Route` constant via `createFileRoute()`

## Common Mistakes

- Creating nested directories instead of using dots: use `start.ssr.full-ssr.tsx`, not `start/ssr/full-ssr.tsx`
- Forgetting to rebuild after adding/removing routes — types in `routeTree.gen.ts` become stale
