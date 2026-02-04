# SSR Mode Selection

Each route can specify an SSR mode. **Default to SPA mode (`ssr: false`)** for new routes.

## Three Modes

### SPA Mode (default for new routes)

```tsx
export const Route = createFileRoute('/my-route')({
  ssr: false,
  component: MyComponent,
})

function MyComponent() {
  const [data, setData] = useState([])
  useEffect(() => { fetchData().then(setData) }, [])
}
```

- No server rendering; data fetched client-side in `useEffect`
- Use for: dashboards, authenticated pages, interactive UIs

### Full SSR (`ssr: true` or omitted)

```tsx
export const Route = createFileRoute('/my-route')({
  component: MyComponent,
  loader: async () => await getMyData(),
})

function MyComponent() {
  const data = Route.useLoaderData()  // pre-loaded, no useEffect needed
}
```

- Use for: SEO-critical pages, public landing pages

### Data-Only SSR (`ssr: 'data-only'`)

```tsx
export const Route = createFileRoute('/my-route')({
  ssr: 'data-only',
  component: MyComponent,
  loader: async () => await getMyData(),
})
```

- Server fetches data as JSON; HTML rendered on client
- Use for: pages needing server data but heavy client interactivity

## Rules

- Match component logic to SSR mode: don't use `Route.useLoaderData()` with `ssr: false`
- Don't use `useEffect` for data fetching with full SSR — causes double-fetching
- New routes should use `ssr: false` unless SEO or server data is required
