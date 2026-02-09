# Solution

## Decisiones técnicas

### Elección del proveedor de modelo de lenguaje (OpenAI vs Anthropic)

Se eligió **OpenAI** como proveedor principal del modelo de lenguaje por su mayor estabilidad, disponibilidad y facilidad de integración dentro del contexto de la prueba técnica. Durante el desarrollo se detectaron limitaciones prácticas con Anthropic, principalmente relacionadas con el acceso a créditos, lo que generaba bloqueos al ejecutar pruebas locales y validar el flujo completo. Estas restricciones impactaban directamente en la capacidad de iterar y depurar el sistema de forma eficiente.

Además, el ecosistema de OpenAI se integra de manera más natural con el SDK de Vercel AI, facilitando el streaming de respuestas, el manejo de mensajes y el uso de utilidades como streamText. Su flexibilidad en la elección de modelos y costos, junto con una documentación más alineada al stack utilizado, redujo el riesgo técnico y aceleró la implementación. Finalmente, el comportamiento esperado del asistente depende también de un `SYSTEM_PROMPT` bien diseñado, entendiendo que incluso el mejor modelo no cumple su función si las instrucciones que lo guían no son claras y precisas.

### Uso de herramientas (Tools) y separación de responsabilidades

Se estructuró el comportamiento del asistente mediante herramientas claramente diferenciadas:

- **plan**: utilizada exclusivamente para estructurar el razonamiento previo en consultas legales complejas. Esta herramienta permite que el asistente organice los pasos lógicos de la respuesta antes de entregarla, y además introduce un punto de control donde el usuario puede confirmar o ajustar el enfoque.

- **web_search**: utilizada solo cuando es estrictamente necesario obtener información legal actualizada, como cambios recientes en leyes, regulaciones vigentes o jurisprudencia moderna. Esta decisión evita llamadas innecesarias a servicios externos, reduce costos y mejora el tiempo de respuesta en consultas generales.

Esta separación refuerza la mantenibilidad del sistema, hace más predecible el comportamiento de la IA y permite demostrar control explícito sobre cuándo y por qué se usan herramientas externas.

### Elección de Tavily como proveedor de búsqueda

Se eligió **Tavily** como proveedor de búsqueda debido a su enfoque optimizado para recuperación de información estructurada y relevante para modelos de lenguaje. A diferencia de otras alternativas, Tavily está diseñado para integrarse directamente en flujos de IA, devolviendo resultados más concisos, priorizando fuentes relevantes y actuales, algo clave en un asistente legal donde la vigencia de la información es crítica.

Otra razón clave fue la simplicidad de integración, lo que permitió implementar búsquedas controladas sin necesidad de lógica adicional compleja (post-procesamiento) para filtrar o resumir resultados, y encaja mejor con un flujo de razonamiento controlado por el modelo. 

### Incorporar tests automatizados

Se incorporaron tests automatizados para verificar el comportamiento del asistente legal "El Abogado AI". A pesar de que no eran un requerimiento explícito de la prueba, se decidió hacerlo porque el proyecto involucra comportamiento no trivial, como streaming de respuestas y uso condicional de herramientas (tools), y consideré importante validar estos flujos de forma controlada y reproducible.

Para ello se utilizó Vitest junto con las utilidades de testing del SDK de `ai`, específicamente `MockLanguageModelV3` y `simulateReadableStream`. Esto permitió simular distintos comportamientos del modelo sin depender de llamadas reales a la API, manteniendo los tests rápidos, deterministas y sin consumo de créditos. Los tests se dividen en tres categorías:

- **Devuelve una respuesta solo con texto cuando el modelo no usa ninguna herramienta**: Verifica que el asistente devuelva una respuesta solo con texto cuando el modelo no usa ninguna herramienta.
- **Usa la herramienta plan cuando el modelo devuelve un tool-call plan**: Verifica que el asistente use la herramienta `plan` cuando el modelo devuelve un tool-call plan.
- **Usa la herramienta web_search cuando el modelo devuelve un tool-call web_search**: Verifica que el asistente use la herramienta `web_search` cuando el modelo devuelve un tool-call web_search.

### Proceso de desarrollo

Antes de comenzar el desarrollo, estructuré la prueba técnica de manera planificada, organizando tareas y prioridades en un tablero de Trello y analizando a fondo la documentación, la arquitectura y las tecnologías del proyecto para comprender el contexto antes de programar. A partir de esta base, evalué distintos proveedores de modelos y herramientas de búsqueda mediante investigación y pruebas prácticas, desarrollé el asistente y afiné de forma iterativa el system prompt, integrando planificación previa y búsqueda web.

## Explicación del system prompt

El `SYSTEM_PROMPT` fue diseñado para definir de forma clara el rol, los límites y el comportamiento del asistente legal "El Abogado AI" desde el primer momento. La decisión principal fue establecer a la IA como un asistente legal mexicano informativo, no como un abogado que emite asesoramiento legal vinculante. Esto es clave tanto desde el punto de vista ético como técnico, ya que reduce riesgos de alucinaciones legales y mantiene al sistema alineado con buenas prácticas de IA responsable.

El `SYSTEM_PROMPT` define explícitamente que el asistente debe responder en español, utilizar un tono profesional pero cercano, y priorizar explicaciones claras para usuarios que no necesariamente tienen formación jurídica. Esto asegura que las respuestas sean comprensibles y útiles, especialmente en un contexto de usuarios generales que buscan orientación inicial sobre un problema legal.

Una decisión importante fue forzar un flujo estructurado de razonamiento mediante el uso de la herramienta `plan` antes de responder preguntas legales complejas. El objetivo de este paso intermedio es que la IA organice su respuesta, identifique el marco legal aplicable y determine si necesita información adicional o confirmación del usuario antes de continuar. Este enfoque mejora la coherencia de las respuestas y permite al usuario validar que la IA entendió correctamente su situación antes de avanzar.

El `SYSTEM_PROMPT` también establece reglas claras sobre cuándo y cómo usar herramientas externas, en particular web_search. La IA solo debe recurrir a esta herramienta cuando la consulta requiera información legal actualizada, como cambios recientes en leyes, regulaciones vigentes o jurisprudencia moderna. Para preguntas legales generales o principios ampliamente conocidos, la IA debe responder únicamente con su conocimiento interno, evitando llamadas innecesarias a herramientas externas y reduciendo costos y latencia.

Otro punto clave del `SYSTEM_PROMPT` es la gestión explícita de la confirmación del usuario. Una vez que el plan ha sido presentado y aprobado mediante respuestas afirmativas como “sí”, “ok”, “de acuerdo”, “continúa”, entre otras, el asistente tiene la instrucción de no volver a llamar la herramienta plan y pasar directamente a la respuesta legal completa. Esta regla evita bucles innecesarios, mejora la experiencia de usuario y demuestra un control claro del flujo conversacional.

Finalmente, el `SYSTEM_PROMPT` define límites claros sobre lo que el asistente debe rechazar. La IA debe negarse a responder preguntas que impliquen actividades ilegales, evasión de la ley, falsificación de documentos, manipulación de procesos judiciales o cualquier acción que pueda interpretarse como asesoramiento para cometer un delito. En estos casos, el asistente debe redirigir al usuario hacia información legal general.

## Qué haría diferente con más tiempo

Con más tiempo disponible, el primer foco estaría en mejorar la gestión del estado conversacional. Actualmente, el flujo de planificación y confirmación funciona de forma determinística, pero podría fortalecerse mediante un manejo de estados más explícito. Esto permitiría mayor control sobre conversaciones largas, evitar inconsistencias y facilitar futuras extensiones del sistema.

También implementaría un historial de conversaciones persistente, almacenando los mensajes por usuario. Esto permitiría retomar consultas anteriores, dar seguimiento a casos legales y ofrecer una experiencia más realista y cercana a un asistente profesional. Además, facilitaría auditar respuestas y mejorar el sistema con base en interacciones reales.

Finalmente, se exploraría la posibilidad de soporte multi-proveedor real, permitiendo alternar entre modelos de forma configurable según costo, latencia o disponibilidad, usando un modelo más económico para clasificación inicial de la consulta (simple vs. compleja) y reservando modelos más potentes solo cuando sea necesario. Esto haría la arquitectura más resiliente y preparada para escenarios de producción.

