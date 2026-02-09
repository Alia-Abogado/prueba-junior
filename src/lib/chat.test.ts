import { describe, it, expect } from 'vitest'
import { streamText, stepCountIs, simulateReadableStream } from 'ai'
import { MockLanguageModelV3 } from 'ai/test'
import { z } from 'zod'

const testTools = {
  plan: {
    description: 'Create a step-by-step plan before taking action.',
    inputSchema: z.object({
      plan: z.string().describe('The step-by-step plan in markdown format'),
    }),
    execute: async () => ({ status: 'success' as const }),
  },
  web_search: {
    description: 'Search the web for current legal information.',
    inputSchema: z.object({
      query: z.string().describe('The search query'),
    }),
    execute: async ({ query }: { query: string }) => ({
      query: String(query ?? ''),
      results: [] as { title: string; url: string; content: string }[],
      error: 'TAVILY_API_KEY no configurada',
    }),
  },
}

async function parseUIMessageStreamResponse(response: Response): Promise<unknown[]> {
  const text = await response.text()
  const chunks: unknown[] = []
  const events = text.split('\n\n')
  for (const event of events) {
    const line = event.split('\n')[0]
    if (line?.startsWith('data: ')) {
      const payload = line.slice(6)
      if (payload === '[DONE]') continue
      try {
        chunks.push(JSON.parse(payload))
      } catch {
        // ignore parse errors
      }
    }
  }
  return chunks
}

describe('Chat API (streamText + tools)', () => {
  it('devuelve una respuesta solo con texto cuando el modelo no usa ninguna herramienta', async () => {
    const model = new MockLanguageModelV3({
      doStream: async () => ({
        stream: simulateReadableStream({
          chunks: [
            { type: 'text-start', id: 'text-1' },
            { type: 'text-delta', id: 'text-1', delta: 'Hola, ' },
            { type: 'text-delta', id: 'text-1', delta: '¿en qué puedo ayudarte?' },
            { type: 'text-end', id: 'text-1' },
            {
              type: 'finish',
              finishReason: { unified: 'stop', raw: undefined },
              usage: {
                inputTokens: { total: 10, noCache: 10 },
                outputTokens: { total: 15, text: 15, reasoning: undefined },
              },
            },
          ],
        }),
      }),
    })

    const result = streamText({
      model,
      messages: [{ role: 'user', content: 'Hola' }],
      stopWhen: stepCountIs(5),
      tools: testTools,
    })

    const response = result.toUIMessageStreamResponse()
    const chunks = await parseUIMessageStreamResponse(response)

    const toolChunks = chunks.filter(
      (c): c is { type: string; toolName?: string } =>
        typeof c === 'object' &&
        c !== null &&
        'type' in c &&
        (c.type === 'tool-input-start' ||
          c.type === 'tool-input-available' ||
          c.type === 'tool-input-delta')
    )

    expect(toolChunks.length).toBe(0)

    const textDeltas = chunks.filter(
      (c): c is { type: 'text-delta'; delta: string } =>
        typeof c === 'object' && c !== null && 'type' in c && c.type === 'text-delta'
    )
    const fullText = textDeltas.map((d) => d.delta).join('')
    expect(fullText).toContain('Hola')
    expect(fullText).toContain('¿en qué puedo ayudarte?')
  })

  it('usa la herramienta plan cuando el modelo devuelve un tool-call plan', async () => {
    const planContent = '1. **Identificar** el tipo de conflicto.\n2. **Analizar** el marco legal.'
    const model = new MockLanguageModelV3({
      doStream: async () => ({
        stream: simulateReadableStream({
          chunks: [
            {
              type: 'tool-call',
              toolCallId: 'call-plan-1',
              toolName: 'plan',
              input: JSON.stringify({ plan: planContent }),
            },
            {
              type: 'finish',
              finishReason: { unified: 'stop', raw: undefined },
              usage: {
                inputTokens: { total: 10, noCache: 10 },
                outputTokens: { total: 50, text: 50, reasoning: undefined },
              },
            },
          ],
        }),
      }),
    })

    const result = streamText({
      model,
      messages: [{ role: 'user', content: 'Necesito asesoría por un despido injustificado' }],
      stopWhen: stepCountIs(5),
      tools: testTools,
    })

    const response = result.toUIMessageStreamResponse()
    const chunks = await parseUIMessageStreamResponse(response)

    const planToolChunks = chunks.filter(
      (c): c is { type: string; toolName?: string; input?: unknown } =>
        typeof c === 'object' &&
        c !== null &&
        'type' in c &&
        ('toolName' in c ? (c as { toolName?: string }).toolName === 'plan' : false)
    )

    expect(planToolChunks.length).toBeGreaterThan(0)
    const toolInputAvailable = planToolChunks.find(
      (c) => c.type === 'tool-input-available' || c.type === 'tool-input-start'
    )
    expect(toolInputAvailable).toBeDefined()
    if (toolInputAvailable && 'toolName' in toolInputAvailable) {
      expect(toolInputAvailable.toolName).toBe('plan')
    }

    const outputAvailable = chunks.find(
      (c): c is { type: 'tool-output-available'; output?: unknown } =>
        typeof c === 'object' && c !== null && 'type' in c && c.type === 'tool-output-available'
    )
    expect(outputAvailable).toBeDefined()
    expect(outputAvailable?.output).toEqual({ status: 'success' })
  })

  it('usa la herramienta web_search cuando el modelo devuelve un tool-call web_search', async () => {
    const searchQuery = 'Ley Federal del Trabajo artículo 123 2024'
    const model = new MockLanguageModelV3({
      doStream: async () => ({
        stream: simulateReadableStream({
          chunks: [
            {
              type: 'tool-call',
              toolCallId: 'call-web-1',
              toolName: 'web_search',
              input: JSON.stringify({ query: searchQuery }),
            },
            {
              type: 'finish',
              finishReason: { unified: 'stop', raw: undefined },
              usage: {
                inputTokens: { total: 10, noCache: 10 },
                outputTokens: { total: 30, text: 30, reasoning: undefined },
              },
            },
          ],
        }),
      }),
    })

    const result = streamText({
      model,
      messages: [{ role: 'user', content: '¿Qué dice el artículo 123 de la LFT actualizado?' }],
      stopWhen: stepCountIs(5),
      tools: testTools,
    })

    const response = result.toUIMessageStreamResponse()
    const chunks = await parseUIMessageStreamResponse(response)

    const webSearchChunks = chunks.filter(
      (c): c is { type: string; toolName?: string } =>
        typeof c === 'object' &&
        c !== null &&
        'type' in c &&
        'toolName' in c &&
        (c as { toolName?: string }).toolName === 'web_search'
    )

    expect(webSearchChunks.length).toBeGreaterThan(0)

    const toolOutputAvailable = chunks.find(
      (c): c is { type: 'tool-output-available'; output?: { query: string; results: unknown[]; error?: string } } =>
        typeof c === 'object' && c !== null && 'type' in c && c.type === 'tool-output-available'
    )
    expect(toolOutputAvailable).toBeDefined()
    expect(toolOutputAvailable?.output?.query).toBe(searchQuery)
    expect(toolOutputAvailable?.output?.results).toEqual([])
    expect(toolOutputAvailable?.output?.error).toBe('TAVILY_API_KEY no configurada')
  })
})
