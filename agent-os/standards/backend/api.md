# Server Functions vs API Routes

Two patterns for server-side endpoints. **Prefer API routes (`server.handlers`)** for new endpoints.

## API Routes (preferred)

```ts
// src/routes/api.names.ts
import { json } from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/names')({
  server: {
    handlers: {
      GET: () => json(['Alice', 'Bob']),
      POST: async ({ request }) => {
        const body = await request.json()
        // handle mutation
        return json({ success: true })
      },
    },
  },
})
```

- Returns `Response` objects (use `json()` helper)
- Called via `fetch('/api/names')` from client
- Lives in `src/routes/` with `api.` prefix in filename
- Best for: REST endpoints, external consumers, standard HTTP semantics

## Server Functions (use when tightly coupled to a component)

```ts
// src/data/my-data.ts
import { createServerFn } from '@tanstack/react-start'

export const getData = createServerFn({ method: 'GET' })
  .handler(async () => { /* server logic */ })
```

- Called directly as functions: `await getData()`
- Type-safe return values (no manual type assertion)
- Best for: route loaders, RPC-style calls tightly coupled to UI

## Rules

- Default to API routes for new endpoints
- Use server functions only when type-safe RPC is needed (e.g., route loaders)
- API route files use `api.` prefix: `api.users.ts`, `api.posts.ts`
- Server function files live in `src/data/`
