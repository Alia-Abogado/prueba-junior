# Path Alias Configuration

`@/*` maps to `./src/*`. Must be configured in **both** `tsconfig.json` and `vite.config.ts`.

## Configuration

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

**vite.config.ts:**
```ts
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [viteTsConfigPaths()],  // bridges tsconfig paths to Vite
})
```

## Rules

- Always import from `src/` using `@/` prefix: `import { getData } from '@/data/my-data'`
- If you add new path aliases, update both `tsconfig.json` and `vite.config.ts`
- The `viteTsConfigPaths` plugin reads from tsconfig, but both must exist for IDE + build to work

## Gotchas

- Updating only one file breaks either TypeScript (IDE) or Vite (build)
- Relative imports (`../`) work but are discouraged — use `@/` consistently
