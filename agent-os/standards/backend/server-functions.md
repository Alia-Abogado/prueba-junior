# Server Function Chaining

Server functions use a fluent API: `createServerFn({ method }).inputValidator().handler()`.

## Pattern

```ts
// GET — no input validation needed
const getTodos = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await readTodos()
  })

// POST — with input validation
const addTodo = createServerFn({ method: 'POST' })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    // `data` is the validated input
    const todos = await readTodos()
    todos.push({ id: todos.length + 1, name: data })
    await writeTodos(todos)
    return todos
  })
```

## Rules

- Specify HTTP method in `createServerFn({ method: 'GET' | 'POST' })`
- Use `.inputValidator()` for POST/PUT/DELETE to validate input shape
- In the handler, validated input arrives as `{ data }` (destructured from context)
- `.inputValidator()` is optional for GET requests

## Gotchas

- The validator receives raw input but the handler receives `{ data }` — the wrapping is implicit
- Validators validate shape only; add business logic validation inside the handler
- No built-in error handling — wrap handler logic in try/catch if needed
