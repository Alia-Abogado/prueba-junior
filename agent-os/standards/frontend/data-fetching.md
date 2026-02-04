# Data Fetching Decision Tree

Choose the data fetching approach based on the route's SSR mode and use case.

## Decision Table

| Approach | SSR? | Uses Loader? | Client Code | Best For |
|----------|------|-------------|-------------|----------|
| **Fetch API** | No | No | `fetch()` + `useEffect` | REST endpoints, external APIs |
| **Server Function in useEffect** | No | No | `getData()` + `useEffect` | Type-safe client fetching |
| **Loader (Full SSR)** | Yes | Yes | `Route.useLoaderData()` | SEO pages, pre-rendered content |
| **Loader (Data-Only)** | Partial | Yes | `Route.useLoaderData()` | Server data + client rendering |

## Default Pattern (SPA Mode)

```tsx
export const Route = createFileRoute('/my-route')({
  ssr: false,
  component: MyComponent,
})

function MyComponent() {
  const [data, setData] = useState<MyType[]>([])
  useEffect(() => {
    fetch('/api/my-endpoint').then(r => r.json()).then(setData)
  }, [])
}
```

## Mutations

- Call server functions or API routes from event handlers
- Always `router.invalidate()` after mutations to refresh loader data
- Clear local form state after successful mutations

## Rules

- Default to SPA mode + `fetch()` / `useEffect` for new routes
- Use loaders only when SSR is needed (SEO, public pages)
- Server functions in `src/data/` for reusable data access
- API routes for REST endpoints consumed by `fetch()`
- Never mix `useEffect` data fetching with full SSR loaders — causes double-fetching
