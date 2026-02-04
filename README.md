# El Abogado AI — Ejercicio para Desarrollador Junior

## Descripcion

En este ejercicio vas a completar una aplicacion de chat con IA enfocada en asistencia legal mexicana. La interfaz de usuario ya esta construida con **TanStack Start** y **AI Elements**. Tu trabajo es conectar el backend con un modelo de IA, escribir el system prompt, y renderizar las herramientas (tools) en el frontend.

## Lo que ya funciona

- Interfaz de chat completa (conversacion, mensajes, input, sugerencias)
- Componentes de AI Elements instalados y listos (`src/components/ai-elements/`)
- Display de razonamiento (reasoning) del modelo
- Ruta de API scaffoldeada con la estructura correcta (`src/routes/api/chat.ts`)
- Componentes de Tool y Plan disponibles pero no importados aun

## Lo que necesitas implementar

### 1. Configurar el proveedor de IA

- Instala un proveedor: `npm install @ai-sdk/anthropic` o `npm install @ai-sdk/openai`
- Copia `.env.example` a `.env` y agrega tu API key
- Descomenta las importaciones en `src/routes/api/chat.ts`
- Implementa el llamado a `streamText()` con las herramientas definidas

### 2. Escribir el system prompt

- Abre `src/lib/prompts.ts`
- Escribe un system prompt que defina al asistente como experto en derecho mexicano
- Sigue las instrucciones en los comentarios TODO del archivo

### 3. Implementar el rendering de tool calls en el frontend

- Abre `src/routes/index.tsx`
- Descomenta las importaciones de los componentes `Tool` y `Plan`
- Implementa el rendering de los tool parts en el loop de `message.parts`
- Los tool parts tienen tipo `tool-{toolName}` (ej: `tool-plan`, `tool-web_search`)
- Sigue los ejemplos en los comentarios TODO

### 4. Implementar busqueda web (opcional)

- Elige un proveedor de busqueda (Tavily, Serper, etc.)
- Implementa la funcion `execute` del tool `web_search` en `src/routes/api/chat.ts`

### 5. Escribir SOLUTION.md

- Documenta las decisiones que tomaste
- Explica tu system prompt
- Describe que harias diferente con mas tiempo

## Referencia rapida — AI SDK v6

### useChat (frontend)

```tsx
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

const transport = new DefaultChatTransport({ api: '/api/chat' })

const { messages, sendMessage, status, stop, regenerate } = useChat({ transport })

// Enviar mensaje:
sendMessage({ text: 'Hola' })

// Estado:
// status === 'streaming' | 'submitted' | 'ready' | 'error'
```

### streamText (backend)

```typescript
import { streamText, type UIMessage } from 'ai'

const result = streamText({
  model: provider('model-name'),
  system: 'Tu system prompt',
  messages: messages as UIMessage[],
  tools: { /* ... */ },
  maxSteps: 5,
})

return result.toUIMessageStreamResponse()
```

### Tipos de parts en mensajes

| `part.type` | Descripcion | Propiedades clave |
|---|---|---|
| `'text'` | Texto del mensaje | `part.text` |
| `'reasoning'` | Razonamiento del modelo | `part.text` |
| `'tool-{name}'` | Llamada a herramienta | `part.toolCallId`, `part.input`, `part.output`, `part.state` |

### Tool states

| `part.state` | Descripcion |
|---|---|
| `'partial-call'` | Aun recibiendo los argumentos |
| `'call'` | Argumentos completos, esperando ejecucion |
| `'result'` | Ejecucion completada, `part.output` disponible |

## Archivos clave

| Archivo | Que hacer |
|---|---|
| `src/routes/api/chat.ts` | Configurar proveedor e implementar `streamText` |
| `src/lib/prompts.ts` | Escribir el system prompt |
| `src/routes/index.tsx` | Renderizar tool calls (plan y web_search) |
| `.env` | Agregar API keys |
| `SOLUTION.md` | Documentar decisiones |

## Comandos

```bash
npm install          # Instalar dependencias
npm run dev          # Iniciar servidor de desarrollo (puerto 3000)
npm run build        # Build de produccion
npm run test         # Correr tests (Vitest)
```

## Evaluacion

| Criterio | Peso |
|---|---|
| Funcionalidad del chat (responde correctamente) | 25% |
| Calidad del system prompt | 20% |
| Rendering de herramientas (plan + web_search) | 25% |
| Calidad del codigo (limpio, organizado) | 15% |
| Documentacion (SOLUTION.md) | 15% |
