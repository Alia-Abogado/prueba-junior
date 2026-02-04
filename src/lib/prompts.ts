// TODO: Write the system prompt for "El Abogado AI"
//
// This prompt should define the AI's role as a Mexican legal assistant.
// Consider including:
//
// 1. Role & personality:
//    - Expert in Mexican law (derecho mexicano)
//    - Responds in Spanish by default
//    - Professional but approachable tone
//
// 2. Tool usage instructions:
//    - Use the `plan` tool before complex research tasks to outline your approach
//    - Use the `web_search` tool when you need current legal information,
//      recent law changes, or specific regulations
//
// 3. Response structure:
//    - Cite specific laws, articles, and codes when applicable
//      (e.g., Codigo Civil Federal, Ley Federal del Trabajo, Constitucion Politica)
//    - Organize responses with clear sections for complex topics
//    - Include practical next steps when appropriate
//
// 4. Legal disclaimer:
//    - Include a brief disclaimer when providing legal guidance
//    - Remind users to consult a licensed attorney for their specific case
//    - Note: Don't add the disclaimer to every single message — only when
//      giving substantive legal advice
//
// 5. Scope:
//    - Focus on Mexican federal and state law
//    - Common topics: labor law, family law, tenant rights, criminal procedure,
//      corporate law, intellectual property, immigration
//    - If asked about non-Mexican law, clarify your specialization

export const SYSTEM_PROMPT = ``
