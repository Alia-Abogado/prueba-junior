import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
// import { streamText, type UIMessage } from 'ai'
// import { z } from 'zod'
// import { SYSTEM_PROMPT } from '@/lib/prompts'

// TODO: Install an AI provider. Pick ONE:
//   npm install @ai-sdk/anthropic   (then set ANTHROPIC_API_KEY in .env)
//   npm install @ai-sdk/openai      (then set OPENAI_API_KEY in .env)
//
// Then uncomment the provider import:
//   import { anthropic } from '@ai-sdk/anthropic'
//   import { openai } from '@ai-sdk/openai'

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as {
          messages: Array<unknown>
        }

        // TODO: Implement the AI chat endpoint.
        // Use streamText() from the 'ai' package with your chosen provider.
        //
        // Here's the structure you should implement:
        //
        // const result = streamText({
        //   model: anthropic('claude-sonnet-4-20250514'),  // or openai('gpt-4o')
        //   system: SYSTEM_PROMPT,
        //   messages: messages as UIMessage[],
        //   tools: {
        //     plan: {
        //       description: 'Create a step-by-step plan before taking action. This is a client-side tool that displays in the UI.',
        //       parameters: z.object({
        //         plan: z.string().describe('The step-by-step plan in markdown format'),
        //       }),
        //       // No execute function — this is a client-side tool that auto-resolves
        //     },
        //     web_search: {
        //       description: 'Search the web for current legal information, laws, or regulations.',
        //       parameters: z.object({
        //         query: z.string().describe('The search query'),
        //       }),
        //       execute: async ({ query }) => {
        //         // TODO: Implement web search using Tavily, Serper, or another search API
        //         // For now, return empty results
        //         return { query, results: [] }
        //       },
        //     },
        //   },
        //   maxSteps: 5,
        // })
        //
        // IMPORTANT: Use toUIMessageStreamResponse() (NOT toDataStreamResponse())
        // return result.toUIMessageStreamResponse()

        void messages

        return json(
          {
            error:
              'No AI provider configured. See src/routes/api/chat.ts for instructions.',
          },
          { status: 501 },
        )
      },
    },
  },
})
