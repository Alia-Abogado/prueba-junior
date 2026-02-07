import { createFileRoute } from '@tanstack/react-router'
import { streamText } from 'ai'
import { z } from 'zod'
import { SYSTEM_PROMPT } from '@/lib/prompts'
import { openai } from '@ai-sdk/openai'

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as {
          messages: Array<unknown>
        }

        const convertedMessages = (messages as any[]).map((msg: any) => ({
          role: msg.role,
          content: msg.parts
            ?.filter((p: any) => p.type === 'text')
            .map((p: any) => ({ type: 'text' as const, text: p.text })) || []
        }))

        const result = streamText({
          model: openai('gpt-4o-mini'),
          system: SYSTEM_PROMPT,
          messages: convertedMessages as any,
          tools: {
            plan: {
              description: 'Create a step-by-step plan before taking action. This is a client-side tool that displays in the UI.',
              inputSchema: z.object({
                plan: z.string().describe('The step-by-step plan in markdown format'),
              }),
              // No execute function — this is a client-side tool that auto-resolves
            },
            web_search: {
              description: 'Search the web for current legal information, laws, or regulations.',
              inputSchema: z.object({
                query: z.string().describe('The search query'),
              }),
              execute: async ({ query }) => {
                // TODO: Implement web search using Tavily, Serper, or another search API
                // For now, return empty results
                return { query, results: [] }
              },
            },
          },
        })

        return result.toUIMessageStreamResponse()
      },
    },
  },
})
