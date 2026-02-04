# Router Invalidation After Mutations

After server-side mutations, manually invalidate the router to refresh loader data.

## Pattern

```tsx
function MyComponent() {
  const router = useRouter()
  const data = Route.useLoaderData()

  const handleSubmit = useCallback(async () => {
    await addItem({ data: newItem })
    router.invalidate()  // Required: refreshes all loader data
  }, [newItem])
}
```

## Rules

- Always call `router.invalidate()` after mutations that affect loader data
- Without invalidation, the UI will show stale data
- `router.invalidate()` re-runs all active route loaders
- Clear local form state after successful mutation

## Gotchas

- Forgetting `router.invalidate()` is the most common bug after mutations
- Invalidation is global — all active loaders re-run, not just the current route's
- There is no automatic cache invalidation; it's always manual
