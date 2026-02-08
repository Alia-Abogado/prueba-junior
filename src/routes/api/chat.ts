import { createFileRoute } from '@tanstack/react-router'
import { streamText, stepCountIs } from 'ai'
import { z } from 'zod'
import { SYSTEM_PROMPT } from '@/lib/prompts'
import { openai } from '@ai-sdk/openai'
import { tavily } from '@tavily/core'

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as {
          messages: Array<unknown>
        }

        const convertedMessages = (messages as any[]).map((msg: any) => ({
          role: msg.role,
          content: Array.isArray(msg.parts)
            ? msg.parts
              .filter((p: any) => p.type === 'text')
              .map((p: any) => p.text)
              .join('\n')
            : msg.content || '',
        }))

        const result = streamText({
          model: openai('gpt-4o-mini'),
          system: SYSTEM_PROMPT,
          messages: convertedMessages as any,
          stopWhen: stepCountIs(5),
          tools: {
            plan: {
              description: 'Create a step-by-step plan before taking action. This is a client-side tool that displays in the UI.',
              inputSchema: z.object({
                plan: z.string().describe('The step-by-step plan in markdown format'),
              }),
              execute: async () => ({ status: 'success' }),
            },
            web_search: {
              description: 'Search the web for current legal information, laws, or regulations.',
              inputSchema: z.object({
                query: z.string().describe('The search query'),
              }),
              execute: async ({ query }) => {
                const searchQuery = typeof query === 'string' ? query : String(query ?? '')
                if (!searchQuery.trim()) {
                  return { query: searchQuery, results: [], error: 'Query vacía' }
                }
                try {
                  const apiKey = process.env.TAVILY_API_KEY
                  if (!apiKey) {
                    return { query: searchQuery, results: [], error: 'TAVILY_API_KEY no configurada' }
                  }
                  const tvly = tavily({ apiKey })
                  const searchResult = await tvly.search(searchQuery, {
                    searchDepth: 'basic',
                    maxResults: 5,
                  })

                  return {
                    query: searchQuery,
                    results: (searchResult?.results ?? []).map((r: { title?: string; url?: string; content?: string }) => ({
                      title: r.title ?? '',
                      url: r.url ?? '',
                      content: r.content ?? '',
                    })),
                  }
                } catch (error) {
                  console.error('Tavily search error:', error)
                  return { query: searchQuery, results: [], error: 'Failed to search' }
                }
              },
            },
          },
        })
        return result.toUIMessageStreamResponse()
      },
    },
  },
})
