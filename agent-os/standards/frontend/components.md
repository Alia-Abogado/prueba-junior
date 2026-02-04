# Component Structure

Functional React components with Tailwind CSS styling.

## Pattern

```tsx
// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string
  items: string[]
}

export function MyComponent({ title, items }: MyComponentProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item} className="py-1">{item}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Rules

- Use functional components with explicit props interfaces
- Style with Tailwind utilities (no new CSS files)
- Components live in `src/components/`
- Route-specific components can live in the route file itself
- Keep state as local as possible; lift only when needed by siblings

## Naming

- Component files: PascalCase (`MyComponent.tsx`)
- Props interfaces: `ComponentNameProps`
- One primary component per file; small helpers can coexist
