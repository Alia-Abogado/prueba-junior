# AI Elements

AI Elements is a React component library built on top of shadcn/ui specifically designed for building AI-native applications. Created by Vercel, it provides pre-built, customizable components for conversations, messages, code blocks, reasoning displays, tool visualization, workflow canvases, and more. The library integrates seamlessly with the Vercel AI SDK and uses Tailwind CSS for styling.

The library follows the shadcn/ui philosophy where components are added directly to your codebase (not hidden in node_modules), allowing full customization. It includes a CLI tool for easy installation and supports both individual component installation and bulk installation of all components at once.

## Installation

### CLI Installation

Install AI Elements components using the dedicated CLI or shadcn CLI.

```bash
# Install all components at once (recommended)
npx ai-elements@latest

# Install specific components
npx ai-elements@latest add message
npx ai-elements@latest add conversation
npx ai-elements@latest add code-block

# Alternative: Use shadcn CLI directly
npx shadcn@latest add https://ai-sdk.dev/elements/api/registry/all.json
npx shadcn@latest add https://ai-sdk.dev/elements/api/registry/message.json
```

---

## Conversation Component

The Conversation component provides a container for chat conversations with automatic scroll-to-bottom functionality and empty state handling.

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import { MessageSquareIcon } from 'lucide-react';

export default function ChatInterface() {
  const { messages } = useChat();

  return (
    <Conversation className="h-[600px]">
      <ConversationContent>
        {messages.length === 0 ? (
          <ConversationEmptyState
            title="Welcome to AI Chat"
            description="Send a message to start the conversation"
            icon={<MessageSquareIcon className="size-8" />}
          />
        ) : (
          messages.map((message, index) => (
            <Message key={index} from={message.role}>
              <MessageContent>
                <MessageResponse>{message.content}</MessageResponse>
              </MessageContent>
            </Message>
          ))
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
```

---

## Message Component

The Message component displays individual chat messages with role-based styling, markdown rendering via Streamdown, and support for message branching.

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
  MessageToolbar,
  MessageBranch,
  MessageBranchContent,
  MessageBranchSelector,
  MessageBranchPrevious,
  MessageBranchNext,
  MessageBranchPage,
} from '@/components/ai-elements/message';
import { CopyIcon, ThumbsUpIcon, ThumbsDownIcon, RefreshCwIcon } from 'lucide-react';

export default function ChatMessages() {
  const { messages, reload } = useChat();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <>
      {messages.map((message, index) => (
        <Message key={index} from={message.role}>
          <MessageContent>
            <MessageResponse>{message.content}</MessageResponse>
          </MessageContent>

          {message.role === 'assistant' && (
            <MessageToolbar>
              <MessageActions>
                <MessageAction
                  tooltip="Copy"
                  onClick={() => handleCopy(message.content)}
                >
                  <CopyIcon className="size-4" />
                </MessageAction>
                <MessageAction tooltip="Good response">
                  <ThumbsUpIcon className="size-4" />
                </MessageAction>
                <MessageAction tooltip="Bad response">
                  <ThumbsDownIcon className="size-4" />
                </MessageAction>
                <MessageAction tooltip="Regenerate" onClick={() => reload()}>
                  <RefreshCwIcon className="size-4" />
                </MessageAction>
              </MessageActions>
            </MessageToolbar>
          )}
        </Message>
      ))}

      {/* Example with message branching for multiple responses */}
      <MessageBranch defaultBranch={0} onBranchChange={(idx) => console.log('Branch:', idx)}>
        <MessageBranchSelector from="assistant">
          <MessageBranchPrevious />
          <MessageBranchPage />
          <MessageBranchNext />
        </MessageBranchSelector>
        <MessageBranchContent>
          <Message from="assistant">
            <MessageContent>
              <MessageResponse>First response variant</MessageResponse>
            </MessageContent>
          </Message>
          <Message from="assistant">
            <MessageContent>
              <MessageResponse>Second response variant</MessageResponse>
            </MessageContent>
          </Message>
        </MessageBranchContent>
      </MessageBranch>
    </>
  );
}
```

---

## PromptInput Component

The PromptInput component provides an advanced input form with file attachments, model selection, and submit handling for AI chat interfaces.

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import {
  PromptInput,
  PromptInputProvider,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  usePromptInputAttachments,
} from '@/components/ai-elements/prompt-input';
import {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentRemove,
} from '@/components/ai-elements/attachments';
import { PaperclipIcon, MicIcon } from 'lucide-react';

export default function ChatInput() {
  const { append, status, stop } = useChat();

  const handleSubmit = async ({ text, files }) => {
    await append({
      role: 'user',
      content: text,
      experimental_attachments: files,
    });
  };

  return (
    <PromptInputProvider>
      <PromptInput
        onSubmit={handleSubmit}
        accept="image/*,application/pdf"
        maxFiles={5}
        maxFileSize={10 * 1024 * 1024} // 10MB
        onError={(err) => console.error(err.message)}
      >
        <AttachmentsDisplay />
        <PromptInputTextarea placeholder="Ask me anything..." />
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments label="Add files" />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <PromptInputButton>
              <MicIcon className="size-4" />
            </PromptInputButton>
          </PromptInputTools>
          <PromptInputSubmit status={status} onStop={stop} />
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  );
}

function AttachmentsDisplay() {
  const { files, remove } = usePromptInputAttachments();

  if (files.length === 0) return null;

  return (
    <Attachments variant="inline">
      {files.map((file) => (
        <Attachment key={file.id} data={file} onRemove={() => remove(file.id)}>
          <AttachmentPreview />
          <AttachmentInfo />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
}
```

---

## CodeBlock Component

The CodeBlock component displays syntax-highlighted code with Shiki, supporting multiple themes and a copy-to-clipboard button.

```tsx
'use client';

import {
  CodeBlock,
  CodeBlockContainer,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockFilename,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLanguageSelector,
  CodeBlockLanguageSelectorTrigger,
  CodeBlockLanguageSelectorValue,
  CodeBlockLanguageSelectorContent,
  CodeBlockLanguageSelectorItem,
} from '@/components/ai-elements/code-block';
import { useState } from 'react';

export default function CodeExample() {
  const [language, setLanguage] = useState('typescript');

  const code = `interface User {
  id: string;
  name: string;
  email: string;
}

async function getUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}`;

  return (
    <CodeBlock code={code} language={language} showLineNumbers>
      <CodeBlockHeader>
        <CodeBlockTitle>
          <CodeBlockFilename>user.ts</CodeBlockFilename>
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockLanguageSelector value={language} onValueChange={setLanguage}>
            <CodeBlockLanguageSelectorTrigger>
              <CodeBlockLanguageSelectorValue />
            </CodeBlockLanguageSelectorTrigger>
            <CodeBlockLanguageSelectorContent>
              <CodeBlockLanguageSelectorItem value="typescript">TypeScript</CodeBlockLanguageSelectorItem>
              <CodeBlockLanguageSelectorItem value="javascript">JavaScript</CodeBlockLanguageSelectorItem>
              <CodeBlockLanguageSelectorItem value="python">Python</CodeBlockLanguageSelectorItem>
            </CodeBlockLanguageSelectorContent>
          </CodeBlockLanguageSelector>
          <CodeBlockCopyButton
            onCopy={() => console.log('Copied!')}
            onError={(err) => console.error(err)}
          />
        </CodeBlockActions>
      </CodeBlockHeader>
    </CodeBlock>
  );
}
```

---

## Reasoning Component

The Reasoning component displays AI thought processes in a collapsible format with streaming support and automatic timing.

```tsx
'use client';

import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from '@/components/ai-elements/reasoning';

export default function ThinkingDisplay() {
  const isStreaming = true;
  const reasoningText = `Let me analyze this step by step:

1. First, I need to understand the user's question about React hooks.
2. The question involves useState and useEffect interactions.
3. I should explain the dependency array behavior.
4. Finally, provide a concrete example.`;

  return (
    <Reasoning
      isStreaming={isStreaming}
      defaultOpen={true}
      onOpenChange={(open) => console.log('Reasoning panel:', open)}
    >
      <ReasoningTrigger
        getThinkingMessage={(streaming, duration) =>
          streaming ? 'Thinking...' : `Thought for ${duration} seconds`
        }
      />
      <ReasoningContent>{reasoningText}</ReasoningContent>
    </Reasoning>
  );
}
```

---

## Tool Component

The Tool component visualizes AI tool/function calls with their inputs, outputs, and execution status.

```tsx
'use client';

import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
  getStatusBadge,
} from '@/components/ai-elements/tool';

export default function ToolCallDisplay() {
  const toolCall = {
    type: 'tool-call-weather' as const,
    state: 'output-available' as const,
    input: {
      location: 'San Francisco, CA',
      units: 'fahrenheit',
    },
    output: {
      temperature: 68,
      conditions: 'Partly cloudy',
      humidity: 65,
    },
    errorText: null,
  };

  return (
    <Tool defaultOpen={false}>
      <ToolHeader
        title="Weather Lookup"
        type={toolCall.type}
        state={toolCall.state}
      />
      <ToolContent>
        <ToolInput input={toolCall.input} />
        <ToolOutput output={toolCall.output} errorText={toolCall.errorText} />
      </ToolContent>
    </Tool>
  );
}

// Tool states: 'input-streaming' | 'input-available' | 'approval-requested' |
//              'approval-responded' | 'output-available' | 'output-error' | 'output-denied'
```

---

## Suggestion Component

The Suggestion component displays quick action suggestions as clickable buttons in a horizontally scrollable container.

```tsx
'use client';

import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';

export default function QuickActions() {
  const suggestions = [
    'What is React?',
    'Explain TypeScript generics',
    'How do I use hooks?',
    'Best practices for API design',
    'Compare REST vs GraphQL',
  ];

  const handleSuggestionClick = (suggestion: string) => {
    console.log('Selected suggestion:', suggestion);
    // Typically you'd call append() or setInput() here
  };

  return (
    <Suggestions className="py-2">
      {suggestions.map((text) => (
        <Suggestion
          key={text}
          suggestion={text}
          onClick={handleSuggestionClick}
          variant="outline"
          size="sm"
        />
      ))}
    </Suggestions>
  );
}
```

---

## Sources Component

The Sources component displays collapsible source citations used by AI responses.

```tsx
'use client';

import {
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
} from '@/components/ai-elements/sources';

export default function CitationDisplay() {
  const sources = [
    { title: 'React Documentation', url: 'https://react.dev' },
    { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/' },
    { title: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
  ];

  return (
    <Sources defaultOpen={false}>
      <SourcesTrigger count={sources.length} />
      <SourcesContent>
        {sources.map((source) => (
          <Source key={source.url} href={source.url} title={source.title} />
        ))}
      </SourcesContent>
    </Sources>
  );
}
```

---

## Attachments Component

The Attachments component displays file attachments with preview, info, and remove functionality in grid, inline, or list layouts.

```tsx
'use client';

import {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentRemove,
  AttachmentHoverCard,
  AttachmentHoverCardTrigger,
  AttachmentHoverCardContent,
  getMediaCategory,
} from '@/components/ai-elements/attachments';
import { useState } from 'react';

export default function FileAttachments() {
  const [files, setFiles] = useState([
    { id: '1', type: 'file', url: '/image.png', mediaType: 'image/png', filename: 'screenshot.png' },
    { id: '2', type: 'file', url: '/doc.pdf', mediaType: 'application/pdf', filename: 'document.pdf' },
  ]);

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  return (
    <>
      {/* Grid layout (default) - good for images */}
      <Attachments variant="grid">
        {files.map((file) => (
          <AttachmentHoverCard key={file.id}>
            <AttachmentHoverCardTrigger asChild>
              <Attachment data={file} onRemove={() => removeFile(file.id)}>
                <AttachmentPreview />
                <AttachmentRemove />
              </Attachment>
            </AttachmentHoverCardTrigger>
            <AttachmentHoverCardContent>
              <p className="text-sm">{file.filename}</p>
              <p className="text-xs text-muted-foreground">{file.mediaType}</p>
            </AttachmentHoverCardContent>
          </AttachmentHoverCard>
        ))}
      </Attachments>

      {/* Inline layout - compact chips */}
      <Attachments variant="inline">
        {files.map((file) => (
          <Attachment key={file.id} data={file} onRemove={() => removeFile(file.id)}>
            <AttachmentPreview />
            <AttachmentInfo />
            <AttachmentRemove />
          </Attachment>
        ))}
      </Attachments>

      {/* List layout - detailed view */}
      <Attachments variant="list">
        {files.map((file) => (
          <Attachment key={file.id} data={file} onRemove={() => removeFile(file.id)}>
            <AttachmentPreview />
            <AttachmentInfo showMediaType />
            <AttachmentRemove />
          </Attachment>
        ))}
      </Attachments>
    </>
  );
}
```

---

## Terminal Component

The Terminal component displays terminal/console output with ANSI color support, streaming indicators, and copy functionality.

```tsx
'use client';

import {
  Terminal,
  TerminalHeader,
  TerminalTitle,
  TerminalStatus,
  TerminalActions,
  TerminalCopyButton,
  TerminalClearButton,
  TerminalContent,
} from '@/components/ai-elements/terminal';
import { useState } from 'react';

export default function ConsoleOutput() {
  const [output, setOutput] = useState(`\x1b[32m✓\x1b[0m Compiled successfully in 1.2s
\x1b[36minfo\x1b[0m  - Collecting page data...
\x1b[36minfo\x1b[0m  - Generating static pages (0/5)
\x1b[36minfo\x1b[0m  - Generating static pages (5/5)
\x1b[32m✓\x1b[0m Build completed!

\x1b[33mwarning\x1b[0m - Some dependencies are outdated
\x1b[31merror\x1b[0m - Failed to load config file`);

  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <Terminal
      output={output}
      isStreaming={isStreaming}
      autoScroll={true}
      onClear={() => setOutput('')}
    >
      <TerminalHeader>
        <TerminalTitle>Build Output</TerminalTitle>
        <div className="flex items-center gap-1">
          <TerminalStatus />
          <TerminalActions>
            <TerminalCopyButton onCopy={() => console.log('Copied!')} />
            <TerminalClearButton />
          </TerminalActions>
        </div>
      </TerminalHeader>
      <TerminalContent />
    </Terminal>
  );
}
```

---

## FileTree Component

The FileTree component displays a hierarchical file/folder structure with expand/collapse functionality and selection support.

```tsx
'use client';

import {
  FileTree,
  FileTreeFolder,
  FileTreeFile,
  FileTreeIcon,
  FileTreeName,
  FileTreeActions,
} from '@/components/ai-elements/file-tree';
import { Button } from '@/components/ui/button';
import { FileCodeIcon, FileJsonIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

export default function ProjectFileTree() {
  const [selectedPath, setSelectedPath] = useState<string>();
  const [expanded, setExpanded] = useState(new Set(['src', 'src/components']));

  return (
    <FileTree
      expanded={expanded}
      onExpandedChange={setExpanded}
      selectedPath={selectedPath}
      onSelect={setSelectedPath}
    >
      <FileTreeFolder path="src" name="src">
        <FileTreeFolder path="src/components" name="components">
          <FileTreeFile
            path="src/components/Button.tsx"
            name="Button.tsx"
            icon={<FileCodeIcon className="size-4 text-blue-500" />}
          />
          <FileTreeFile
            path="src/components/Input.tsx"
            name="Input.tsx"
            icon={<FileCodeIcon className="size-4 text-blue-500" />}
          />
        </FileTreeFolder>
        <FileTreeFile path="src/index.tsx" name="index.tsx">
          <span className="size-4" />
          <FileTreeIcon>
            <FileCodeIcon className="size-4 text-blue-500" />
          </FileTreeIcon>
          <FileTreeName>index.tsx</FileTreeName>
          <FileTreeActions>
            <Button size="icon" variant="ghost" className="size-6">
              <TrashIcon className="size-3" />
            </Button>
          </FileTreeActions>
        </FileTreeFile>
      </FileTreeFolder>
      <FileTreeFile
        path="package.json"
        name="package.json"
        icon={<FileJsonIcon className="size-4 text-yellow-500" />}
      />
    </FileTree>
  );
}
```

---

## Artifact Component

The Artifact component displays code artifacts or documents in a panel with header, actions, and content areas.

```tsx
'use client';

import {
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactActions,
  ArtifactAction,
  ArtifactClose,
  ArtifactContent,
} from '@/components/ai-elements/artifact';
import { CodeBlock } from '@/components/ai-elements/code-block';
import { CopyIcon, DownloadIcon, ExternalLinkIcon } from 'lucide-react';

export default function CodeArtifact() {
  const code = `export function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`;

  return (
    <Artifact className="w-full max-w-2xl">
      <ArtifactHeader>
        <div>
          <ArtifactTitle>fibonacci.ts</ArtifactTitle>
          <ArtifactDescription>TypeScript function</ArtifactDescription>
        </div>
        <ArtifactActions>
          <ArtifactAction tooltip="Copy" icon={CopyIcon} />
          <ArtifactAction tooltip="Download" icon={DownloadIcon} />
          <ArtifactAction tooltip="Open in editor" icon={ExternalLinkIcon} />
          <ArtifactClose onClick={() => console.log('Close artifact')} />
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent>
        <CodeBlock code={code} language="typescript" showLineNumbers />
      </ArtifactContent>
    </Artifact>
  );
}
```

---

## Loader Component

The Loader component displays a spinning loading indicator with configurable size.

```tsx
'use client';

import { Loader } from '@/components/ai-elements/loader';

export default function LoadingStates() {
  return (
    <div className="flex items-center gap-4">
      {/* Different sizes */}
      <Loader size={12} />
      <Loader size={16} />
      <Loader size={24} />
      <Loader size={32} />

      {/* With text */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader size={16} />
        <span>Loading...</span>
      </div>
    </div>
  );
}
```

---

## Canvas Component (Workflow)

The Canvas component provides a ReactFlow-based canvas for building workflow visualizations with nodes and edges.

```tsx
'use client';

import { Canvas } from '@/components/ai-elements/canvas';
import { Controls } from '@/components/ai-elements/controls';
import { Node } from '@/components/ai-elements/node';
import { Edge } from '@/components/ai-elements/edge';
import { Panel } from '@/components/ai-elements/panel';
import { Toolbar } from '@/components/ai-elements/toolbar';
import { useCallback, useState } from 'react';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Input' }, type: 'default' },
  { id: '2', position: { x: 200, y: 100 }, data: { label: 'Process' }, type: 'default' },
  { id: '3', position: { x: 400, y: 0 }, data: { label: 'Output' }, type: 'default' },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-[500px] w-full">
      <Canvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <Panel position="top-left">
          <div className="rounded bg-background p-2 shadow">
            Workflow Editor
          </div>
        </Panel>
      </Canvas>
    </div>
  );
}
```

---

## Complete Chat Application Example

A full-featured chat application combining multiple AI Elements components.

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
  MessageToolbar,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputProvider,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';
import { Reasoning, ReasoningTrigger, ReasoningContent } from '@/components/ai-elements/reasoning';
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from '@/components/ai-elements/tool';
import { Loader } from '@/components/ai-elements/loader';
import { CopyIcon, RefreshCwIcon, ThumbsUpIcon, ThumbsDownIcon } from 'lucide-react';

export default function FullChatApp() {
  const { messages, append, status, stop, reload, isLoading } = useChat({
    api: '/api/chat',
  });

  const handleSubmit = async ({ text, files }) => {
    await append({
      role: 'user',
      content: text,
      experimental_attachments: files,
    });
  };

  const handleSuggestion = (suggestion: string) => {
    append({ role: 'user', content: suggestion });
  };

  return (
    <div className="flex h-screen flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="How can I help you today?"
              description="Ask me anything or choose a suggestion below"
            />
          ) : (
            messages.map((message, index) => (
              <Message key={index} from={message.role}>
                <MessageContent>
                  {/* Handle reasoning parts */}
                  {message.parts?.filter(p => p.type === 'reasoning').map((part, i) => (
                    <Reasoning key={i} isStreaming={isLoading && index === messages.length - 1}>
                      <ReasoningTrigger />
                      <ReasoningContent>{part.reasoning}</ReasoningContent>
                    </Reasoning>
                  ))}

                  {/* Handle tool calls */}
                  {message.parts?.filter(p => p.type.startsWith('tool-')).map((part, i) => (
                    <Tool key={i}>
                      <ToolHeader type={part.type} state={part.state} />
                      <ToolContent>
                        <ToolInput input={part.input} />
                        <ToolOutput output={part.output} errorText={part.errorText} />
                      </ToolContent>
                    </Tool>
                  ))}

                  {/* Handle text content */}
                  <MessageResponse>{message.content}</MessageResponse>
                </MessageContent>

                {message.role === 'assistant' && (
                  <MessageToolbar>
                    <MessageActions>
                      <MessageAction tooltip="Copy">
                        <CopyIcon className="size-4" />
                      </MessageAction>
                      <MessageAction tooltip="Good response">
                        <ThumbsUpIcon className="size-4" />
                      </MessageAction>
                      <MessageAction tooltip="Bad response">
                        <ThumbsDownIcon className="size-4" />
                      </MessageAction>
                      <MessageAction tooltip="Regenerate" onClick={() => reload()}>
                        <RefreshCwIcon className="size-4" />
                      </MessageAction>
                    </MessageActions>
                  </MessageToolbar>
                )}
              </Message>
            ))
          )}

          {isLoading && (
            <Message from="assistant">
              <MessageContent>
                <Loader size={16} />
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {messages.length === 0 && (
        <Suggestions className="px-4 py-2">
          <Suggestion suggestion="Explain React hooks" onClick={handleSuggestion} />
          <Suggestion suggestion="Write a TypeScript function" onClick={handleSuggestion} />
          <Suggestion suggestion="Debug my code" onClick={handleSuggestion} />
        </Suggestions>
      )}

      <div className="border-t p-4">
        <PromptInputProvider>
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea placeholder="Type your message..." />
            <PromptInputFooter>
              <div />
              <PromptInputSubmit status={status} onStop={stop} />
            </PromptInputFooter>
          </PromptInput>
        </PromptInputProvider>
      </div>
    </div>
  );
}
```

---

## Summary

AI Elements provides a comprehensive set of React components specifically designed for building AI-powered chat interfaces and applications. The library covers the complete chat experience including conversation containers with auto-scroll, message rendering with markdown support, prompt inputs with file attachments, code blocks with syntax highlighting, reasoning displays for AI thought processes, tool call visualization, source citations, and workflow canvas components for visual programming.

The components integrate seamlessly with the Vercel AI SDK's `useChat` hook and follow shadcn/ui conventions for styling and customization. Since all components are installed directly into your codebase, you have full control to modify styles, add features, or adapt behavior to your specific needs. The modular architecture allows you to use individual components or combine them to build sophisticated AI applications with minimal boilerplate code.
