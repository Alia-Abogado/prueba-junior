import { createFileRoute } from '@tanstack/react-router'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState } from 'react'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
  MessageResponse,
  MessageToolbar,
} from '@/components/ai-elements/message'
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input'
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from '@/components/ai-elements/reasoning'
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion'
import { Shimmer } from '@/components/ai-elements/shimmer'
import { CopyIcon, RefreshCwIcon, ScaleIcon } from 'lucide-react'
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
  ToolSearchQuery,
  ToolSearchResults,
} from '@/components/ai-elements/tool'
import { Plan, PlanHeader, PlanTitle, PlanContent, PlanTrigger } from '@/components/ai-elements/plan'

export const Route = createFileRoute('/')({
  component: ChatPage,
  ssr: false,
})

const transport = new DefaultChatTransport({ api: '/api/chat' })

function ChatPage() {
  const [input, setInput] = useState('')
  const {
    messages,
    sendMessage,
    status,
    stop,
    regenerate,
  } = useChat({ transport })

  const isStreaming = status === 'streaming'
  const isLoading = status === 'submitted' || isStreaming

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <Conversation>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState>
              <div className="flex flex-col items-center gap-6">
                <div className="space-y-1 text-center">
                  <ScaleIcon className="mx-auto size-8 text-muted-foreground" />
                  <h3 className="font-medium text-sm">Asistente Legal Mexicano</h3>
                  <p className="text-muted-foreground text-sm">
                    Pregunta sobre leyes, trámites y procedimientos legales en México.
                  </p>
                </div>
                <Suggestions>
                  <Suggestion
                    suggestion="¿Cuáles son mis derechos como inquilino en México?"
                    onClick={(s) => setInput(s)}
                  />
                  <Suggestion
                    suggestion="¿Cómo es el proceso de divorcio en México?"
                    onClick={(s) => setInput(s)}
                  />
                  <Suggestion
                    suggestion="¿Qué dice la Ley Federal del Trabajo sobre el despido injustificado?"
                    onClick={(s) => setInput(s)}
                  />
                </Suggestions>
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                {message.parts.map((part, i) => {
                  if (part.type === 'reasoning') {
                    return (
                      <Reasoning
                        key={`reasoning-${i}`}
                        isStreaming={
                          isStreaming &&
                          message.id === messages[messages.length - 1]?.id
                        }
                      >
                        <ReasoningTrigger />
                        <ReasoningContent>{part.text}</ReasoningContent>
                      </Reasoning>
                    )
                  }

                  if (part.type === 'text') {
                    const hasToolPart = message.parts.some((p) => p.type.startsWith('tool-'))
                    if (hasToolPart) {
                      return (
                        <MessageContent key={`text-${i}`}>
                          <MessageResponse>{part.text}</MessageResponse>
                        </MessageContent>
                      )
                    }
                    return (
                      <MessageContent key={`text-${i}`}>
                        <MessageResponse>{part.text}</MessageResponse>
                      </MessageContent>
                    )
                  }

                  // Handle tool call parts
                  if (part.type.startsWith('tool-')) {
                    const toolPart = part as {
                      type: string
                      toolCallId?: string
                      input?: unknown
                      output?: unknown
                      state?: string
                      errorText?: string
                      approval?: { id: string }
                    }
                    const toolName = toolPart.type.replace('tool-', '')

                    // Handle plan tool (pre-approval step)
                    if (toolName === 'plan') {
                      const planInput = toolPart.input as { plan?: string } | undefined
                      const planText = typeof planInput?.plan === 'string'
                        ? planInput.plan
                        : ''

                      return (
                        <div key={`plan-${i}`}>
                          <Plan
                            defaultOpen={true}
                            isStreaming={
                              isLoading &&
                              message.id === messages[messages.length - 1]?.id
                            }
                          >
                            <PlanHeader>
                              <PlanTitle>Plan</PlanTitle>
                              <PlanTrigger />
                            </PlanHeader>
                            <PlanContent>
                              <MessageResponse>{planText}</MessageResponse>
                            </PlanContent>
                          </Plan>
                        </div>
                      )
                    }

                    // Handle web_search tool (componentes Tool + ToolSearchQuery + ToolSearchResults)
                    if (toolName === 'web_search') {
                      const searchInput = toolPart.input as { query?: string } | undefined
                      const searchQuery = typeof searchInput?.query === 'string' ? searchInput.query : ''
                      const searchOutput = toolPart.output as {
                        query?: string
                        results?: Array<{ title?: string; url?: string; content?: string }>
                        error?: string
                      } | undefined
                      const results = searchOutput?.results ?? []
                      const errorMsg =
                        toolPart.errorText ||
                        searchOutput?.error ||
                        (toolPart.state === 'output-error' ? 'No se pudo completar la búsqueda.' : undefined)

                      return (
                        <Tool key={toolPart.toolCallId ?? `web_search-${i}`}>
                          <ToolHeader
                            type={toolPart.type as `tool-${string}`}
                            state={(toolPart.state ?? 'input-available') as 'input-streaming' | 'input-available' | 'output-available' | 'output-error'}
                            title="Buscando en la web..."
                          />
                          <ToolContent>
                            {searchQuery && <ToolSearchQuery query={searchQuery} />}
                            {(toolPart.state === 'output-available' || toolPart.state === 'output-error') && (
                              <ToolSearchResults
                                results={results}
                                error={errorMsg}
                              />
                            )}
                          </ToolContent>
                        </Tool>
                      )
                    }

                    // Handle other tools generically
                    return (
                      <Tool key={toolPart.toolCallId ?? `tool-${i}`}>
                        <ToolHeader
                          type={toolPart.type as `tool-${string}`}
                          state={(toolPart.state ?? 'input-available') as 'input-streaming' | 'input-available' | 'output-available' | 'output-error'}
                          title={`Ejecutando ${toolName}...`}
                        />
                        <ToolContent>
                          <ToolInput input={toolPart.input} />
                          {(toolPart.state === 'output-available' || toolPart.state === 'output-error') && (
                            <ToolOutput output={toolPart.output} errorText={toolPart.errorText} />
                          )}
                        </ToolContent>
                      </Tool>
                    )
                  }

                  return null
                })}

                {message.role === 'assistant' && !isLoading && (
                  <MessageToolbar>
                    <MessageActions>
                      <MessageAction
                        tooltip="Copiar"
                        onClick={() => {
                          const text = message.parts
                            .filter(
                              (p): p is Extract<typeof p, { type: 'text' }> =>
                                p.type === 'text',
                            )
                            .map((p) => p.text)
                            .join('\n')
                          navigator.clipboard.writeText(text)
                        }}
                      >
                        <CopyIcon className="size-4" />
                      </MessageAction>
                      {message.id === messages[messages.length - 1]?.id && (
                        <MessageAction tooltip="Regenerar" onClick={() => regenerate()}>
                          <RefreshCwIcon className="size-4" />
                        </MessageAction>
                      )}
                    </MessageActions>
                  </MessageToolbar>
                )}
              </Message>
            ))
          )}

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer duration={1.5}>Pensando...</Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>

        <ConversationScrollButton />
      </Conversation>

      <div className="border-t p-4">
        <PromptInput
          onSubmit={({ text }) => {
            if (!text.trim()) return
            sendMessage({ text })
            setInput('')
          }}
          className="mx-auto max-w-3xl"
        >
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta legal..."
          />
          <PromptInputFooter>
            <div />
            <PromptInputSubmit
              status={status}
              onStop={stop}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}
