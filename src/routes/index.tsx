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

// TODO: Import Tool components for displaying web search results
// import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from '@/components/ai-elements/tool'

// TODO: Import Plan components for displaying the agent's plan
// import { Plan, PlanHeader, PlanTitle, PlanContent, PlanTrigger } from '@/components/ai-elements/plan'

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
                    Pregunta sobre leyes, tramites y procedimientos legales en Mexico.
                  </p>
                </div>
                <Suggestions>
                  <Suggestion
                    suggestion="¿Cuales son mis derechos como inquilino en Mexico?"
                    onClick={(s) => setInput(s)}
                  />
                  <Suggestion
                    suggestion="¿Como es el proceso de divorcio en Mexico?"
                    onClick={(s) => setInput(s)}
                  />
                  <Suggestion
                    suggestion="¿Que dice la Ley Federal del Trabajo sobre el despido injustificado?"
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
                    if (message.role === 'user') {
                      return (
                        <MessageContent key={`text-${i}`}>
                          {part.text}
                        </MessageContent>
                      )
                    }
                    return (
                      <MessageContent key={`text-${i}`}>
                        <MessageResponse>{part.text}</MessageResponse>
                      </MessageContent>
                    )
                  }

                  // TODO: Handle tool call parts
                  // Tool parts have type 'tool-{toolName}' (e.g., 'tool-plan', 'tool-web_search')
                  // Each tool part has: part.toolCallId, part.input, part.output, part.state
                  //
                  // For 'tool-plan': Render using Plan, PlanHeader, PlanTitle, PlanContent
                  //   - part.input.plan contains the markdown plan text
                  //   - Example:
                  //     <Plan key={part.toolCallId}>
                  //       <PlanTrigger>
                  //         <PlanHeader><PlanTitle>Plan</PlanTitle></PlanHeader>
                  //       </PlanTrigger>
                  //       <PlanContent>{part.input.plan}</PlanContent>
                  //     </Plan>
                  //
                  // For 'tool-web_search': Render using Tool, ToolHeader, ToolContent, ToolInput, ToolOutput
                  //   - part.input.query contains the search query
                  //   - part.output contains the search results (when part.state === 'result')
                  //   - Example:
                  //     <Tool key={part.toolCallId} name="web_search">
                  //       <ToolHeader>Buscando en la web...</ToolHeader>
                  //       <ToolContent>
                  //         <ToolInput>{JSON.stringify(part.input)}</ToolInput>
                  //         {part.state === 'result' && <ToolOutput>{JSON.stringify(part.output)}</ToolOutput>}
                  //       </ToolContent>
                  //     </Tool>
                  //
                  // Hint: Check part.type.startsWith('tool-') to detect tool parts
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
