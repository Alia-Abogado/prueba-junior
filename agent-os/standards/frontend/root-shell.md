# Root Shell & CSS URL Imports

The root layout (`__root.tsx`) defines the HTML shell and global stylesheet injection.

## Global Stylesheet Pattern

```tsx
// __root.tsx
import appCss from '../styles.css?url'  // ?url is required

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})
```

- Use `?url` suffix when importing CSS for the `head()` links array
- Without `?url`, the import returns CSS content instead of a URL — breaks SSR
- Component-level CSS (e.g., `Header.css`) uses direct `import './Header.css'` without `?url`

## Shell Component Requirements

- Must render `<HeadContent />` inside `<head>` — injects metadata from `head()`
- Must render `<Scripts />` before `</body>` — hydrates the client router
- Must render `<Outlet />` for child route content

## Rules

- Add new global stylesheets to the `links` array in `head()`, not as side-effect imports
- Only use `?url` for stylesheets in `head()` links; component CSS uses direct imports
