import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'url'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@opentelemetry/api': fileURLToPath(
        new URL('./node_modules/@opentelemetry/api/build/src/index.js', import.meta.url)
      ),
    },
  },
  plugins: [viteTsConfigPaths({ projects: ['./tsconfig.json'] })],
  test: {
    globals: false,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
