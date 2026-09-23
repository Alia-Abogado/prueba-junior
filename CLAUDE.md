# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npm run test` — Run all tests (Vitest)
- `npx vitest run src/path/to/test.test.ts` — Run a single test file

## Architecture

This is a **TanStack Start** application (React 19 + TanStack Router + Nitro server runtime) with file-based routing and SSR support. It is a scaffolded exercise for building "El Abogado AI", a Mexican legal assistant chatbot using the AI SDK v6.

### Routing

Routes live in `src/routes/` and are auto-generated into a route tree by the TanStack Router plugin. The generated file `routeTree.gen.ts` is read-only and should never be edited manually.

- `__root.tsx` — Root layout wrapping all routes (includes Header and devtools)
- `index.tsx` — Main chat page with AI Elements components
- `api/chat.ts` — API route for AI chat (scaffolded, needs implementation)
- Routes support three SSR modes via the `ssr` property: `true` (full SSR), `'data-only'`, or `false` (SPA)

### AI SDK v6 / @ai-sdk/react v3

- `useChat` uses `transport: new DefaultChatTransport({ api: '/api/chat' })`
- `DefaultChatTransport` imported from `ai` (not `@ai-sdk/react`)
- Backend uses `streamText()` and returns `result.toUIMessageStreamResponse()`
- Tool parts in messages have type `tool-{toolName}`, with `part.input`, `part.output`, `part.state`
- Reasoning parts use `part.text` (not `part.reasoning`)

### Path Aliases

`@/*` maps to `./src/*` (configured in both tsconfig.json and vite.config.ts).

### Styling

Tailwind CSS utility classes. AI Elements components in `src/components/ai-elements/` and `src/components/ui/`.

### Testing

Vitest with @testing-library/react and jsdom.

### Key Files

- `src/router.tsx` — Router instance creation (imports generated routeTree)
- `src/routes/__root.tsx` — Root layout with HTML shell, head content, and branded header
- `src/routes/index.tsx` — Chat page (has TODO comments for tool rendering)
- `src/routes/api/chat.ts` — API endpoint (has TODO comments for AI provider setup)
- `src/lib/prompts.ts` — System prompt (has TODO comments for legal assistant prompt)
- `vite.config.ts` — Vite plugins: devtools, nitro, tsconfig-paths, TanStack Start, React

## Shipping

All changes ship through the no-mistakes gate:

- Commit on a feature branch, then push with `git push no-mistakes <branch>`. Never push directly to `origin`.
- no-mistakes runs review, test, lint and document checks, then pushes to origin and opens the PR. Follow progress with `no-mistakes status` or the `/no-mistakes` skill.
- Per-repo gate commands live in `.no-mistakes.yaml`. It is only read from the default branch.
