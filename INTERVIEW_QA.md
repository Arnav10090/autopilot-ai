# AutoPilot AI - Technical Interview Q&A Guide

## Project Summary

- **What it does**: AutoPilot AI is an intelligent project planning platform that transforms vague software concepts into comprehensive, execution-ready project plans using a multi-agent AI orchestration system
- **Core technology**: Next.js 16 (App Router) frontend with Node.js/Express backend, PostgreSQL database, and multi-LLM provider support (Gemini + Groq)
- **Key innovation**: Four specialized AI agents (Requirements, Tech Stack, Task Planner, Risk Assessment) work in sequence with structured JSON validation, automatic fallbacks, and comprehensive error handling
- **Architecture highlights**: Factory pattern for LLM providers, guard-based execution with timeouts/retries, context-aware chat system with memory management, and multi-format export (PDF, DOCX, CSV, JSON, Markdown)
- **Production-ready features**: OAuth 2.0 authentication (Google/GitHub), real-time streaming responses, internationalization (4 languages), dark mode, WCAG accessibility, and comprehensive metrics tracking

---

## Section 1: Project Architecture & Design Decisions

### Q1: Why did you choose Next.js App Router over the Pages Router for this project?

**Difficulty:** Medium  
**Category:** Architecture

**Answer:**

I chose Next.js 16 with the App Router because it provides several advantages for this AI-powered application. First, the App Router's server components allow me to optimize data fetching - I can fetch project data on the server before hydration, reducing client-side JavaScript. Second, the layout system in `app/(main)/layout.tsx` lets me create a persistent shell with `<Header>`, `<SideNav>`, and `<ChatWidget>` that doesn't re-render on navigation, which is crucial for maintaining chat state.

The route groups like `app/(main)` and `app/auth` let me organize routes with different layouts without affecting the URL structure. For example, auth pages don't need the sidebar, so they're in a separate group. The App Router also has better TypeScript support and streaming SSR, which I leverage for the AI chat feature in `contexts/ChatContext.tsx` where I use Server-Sent Events for streaming LLM responses.

**Key talking points:**
- Server components reduce client bundle size (important for the large UI component library)
- Layout nesting prevents unnecessary re-renders of persistent UI elements
- Route groups enable clean separation of authenticated vs public pages
- Built-in loading and error boundaries improve UX during AI processing

**Follow-up the interviewer might ask:** How do you handle client-side state in server components?


### Q2: Walk me through the multi-agent orchestration architecture. Why did you design it this way?

**Difficulty:** Hard  
**Category:** Architecture / LLM

**Answer:**

The multi-agent system in `backend/src/services/agentOrchestrator.js` runs four specialized agents sequentially with explicit dependencies. I designed it as a pipeline where each agent's output feeds into the next:

1. **Requirements Agent** (`requirementAgent.js`) runs first - extracts functional/non-functional requirements, assumptions, and missing information
2. **Tech Stack Agent** (`techStackAgent.js`) receives requirements + user constraints, recommends frontend/backend/database/deployment choices
3. **Task Planner Agent** (`taskPlannerAgent.js`) gets requirements + tech stack + deadline, generates a detailed execution plan with 35-50 tasks across 5-7 modules
4. **Risk Assessment Agent** (`riskAssessmentAgent.js`) analyzes everything and identifies risks with severity levels and mitigation strategies

Each agent is wrapped in `executeWithGuards` utility which provides:
- JSON schema validation using AJV
- Automatic retries (up to 3 attempts)
- Timeout protection (15-90 seconds depending on agent)
- Deterministic fallbacks if all retries fail
- Metrics tracking (success/failure/latency)

I added 2-second cooldowns between agents to respect Groq's rate limits. The sequential design ensures data consistency - for example, the Task Planner can't run before we know the tech stack.

**Key talking points:**
- Sequential execution prevents race conditions and ensures data dependencies
- Each agent has a single responsibility (SRP from SOLID principles)
- Guard utilities make the system resilient to LLM failures
- Rate limiting prevents API quota exhaustion

**Follow-up the interviewer might ask:** What happens if the Requirements Agent fails after all retries?


### Q3: Explain your data flow from user input to final project plan. What are the critical paths?

**Difficulty:** Medium  
**Category:** Architecture

**Answer:**

The data flow follows this path:

**Frontend (ProjectForm.tsx):**
1. User fills multi-step form (5 steps: info, team, constraints, quality, review)
2. Form data is validated client-side and auto-saved to localStorage as draft
3. On submit, `analyzeProject()` from `services/api.ts` sends POST to `/api/projects/analyze`

**Backend (project.controller.js → agentOrchestrator.js):**
4. Controller extracts `user_id` from request and calls `runFullAnalysis(input)`
5. Orchestrator runs 4 agents sequentially, each returning structured JSON
6. Results are saved to PostgreSQL via `project.repository.js` - one row in `projects` table, one in `project_outputs` with JSONB columns

**Database (PostgreSQL):**
7. `projects` table stores metadata (description, team_size, deadline, status)
8. `project_outputs` table stores agent results as JSONB (requirements, tech_stack, task_plan, risks)
9. Transaction ensures atomicity - both inserts succeed or both roll back

**Response & Display:**
10. Backend returns `{ project_id, status: "Completed" }`
11. Frontend shows `AgentProgress` animation component
12. On completion, redirects to `/project/[id]` which fetches full project data
13. Project detail page transforms JSONB into React components (RequirementsSection, TechStackSection, etc.)

Critical paths: LLM API calls (can timeout), database writes (must be transactional), and the orchestrator's sequential execution (one failure can cascade).

**Key talking points:**
- Clear separation of concerns (UI → API → Business Logic → Data)
- JSONB storage allows flexible schema for AI-generated content
- Transaction guarantees prevent partial project creation
- Auto-save prevents data loss during form filling

**Follow-up the interviewer might ask:** How do you handle concurrent requests from multiple users?


### Q4: Why did you implement a factory pattern for LLM providers? What problem does it solve?

**Difficulty:** Medium  
**Category:** Architecture / Design Patterns

**Answer:**

The factory pattern in `backend/src/services/llm/llm.factory.js` solves the problem of LLM provider abstraction and runtime selection. I created an `LLMInterface` base class that defines the contract (`sendMessage`, `streamResponse`, `summarize`), then implemented two concrete providers:

- **GeminiProvider** (`gemini.provider.js`) - uses Google's Generative AI SDK with `gemini-1.5-flash` model
- **GroqProvider** (`groq.provider.js`) - uses Groq SDK with `llama-3.3-70b-versatile` model

The factory's `getLLMProvider()` function auto-detects which provider to use based on environment variables:
```javascript
function detectProvider() {
  if (process.env.LLM_PROVIDER) return process.env.LLM_PROVIDER;
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  return 'gemini'; // Default fallback
}
```

This design provides several benefits:
1. **Vendor independence** - I can switch from Gemini to Groq by changing one env var
2. **Cost optimization** - Groq offers 14,400 free requests/day, so I default to it when available
3. **Fallback strategy** - If Groq hits rate limits, I can failover to Gemini
4. **Testing** - I can mock the interface for unit tests without hitting real APIs
5. **Future extensibility** - Adding OpenAI or Claude requires implementing the interface, no changes to calling code

The singleton pattern ensures only one provider instance exists, preventing connection pool exhaustion.

**Key talking points:**
- Factory + Interface pattern enables polymorphism
- Auto-detection reduces configuration burden
- Singleton prevents resource leaks
- All routes use `getLLMProvider()` - never instantiate providers directly

**Follow-up the interviewer might ask:** How would you implement automatic failover if one provider fails?


### Q5: Explain the trade-offs you made in choosing your tech stack. What would you change for a production system at scale?

**Difficulty:** Hard  
**Category:** Architecture

**Answer:**

**Current Stack Trade-offs:**

**Frontend (Next.js 16 + React 19):**
- ✅ Pros: Server components reduce bundle size, App Router has great DX, built-in optimizations
- ❌ Cons: React 19 is cutting-edge (released Dec 2024), potential stability issues, smaller community support
- Trade-off: I chose bleeding-edge for learning but would use React 18 LTS in production

**Backend (Node.js + Express):**
- ✅ Pros: Fast development, JavaScript everywhere, huge ecosystem
- ❌ Cons: Single-threaded (CPU-bound tasks block), weak typing without TS
- Trade-off: Good for I/O-heavy workloads (API calls to LLMs) but not ideal for compute

**Database (PostgreSQL with JSONB):**
- ✅ Pros: JSONB allows flexible schema for AI outputs, ACID transactions, mature
- ❌ Cons: JSONB queries are slower than normalized tables, no schema enforcement
- Trade-off: Flexibility over performance - AI outputs have unpredictable structure

**LLM Providers (Gemini + Groq):**
- ✅ Pros: Groq is extremely fast (14,400 free req/day), Gemini has good quality
- ❌ Cons: Vendor lock-in, rate limits, no fine-tuning control
- Trade-off: Speed and cost over customization

**What I'd Change at Scale (10,000+ users):**

1. **Add Redis caching** - Cache project plans for 24h, reduce DB load by 80%
2. **Implement job queues (Bull/BullMQ)** - Move agent orchestration to background workers, return immediately with status polling
3. **Switch to TypeScript backend** - Type safety prevents runtime errors in production
4. **Add vector database (Pinecone/Weaviate)** - Store embeddings of past projects for RAG-based recommendations
5. **Implement rate limiting (Redis + express-rate-limit)** - Prevent abuse, currently no protection
6. **Add observability (DataDog/New Relic)** - Current metrics in `utils/metrics.js` are basic, need distributed tracing
7. **Database read replicas** - Separate read/write workloads, current single instance is bottleneck
8. **CDN for static assets** - Next.js images should be on CloudFront/Cloudflare
9. **Horizontal scaling** - Current architecture is stateless (good!) but needs load balancer
10. **Fine-tuned model** - Train on successful project plans to improve quality

**Key talking points:**
- Current stack optimizes for development speed over scale
- JSONB is a pragmatic choice for unpredictable AI outputs
- Stateless architecture makes horizontal scaling easier
- Biggest gaps: caching, job queues, observability

**Follow-up the interviewer might ask:** How would you implement the job queue system for agent orchestration?


### Q6: How does your folder structure support scalability and maintainability?

**Difficulty:** Easy  
**Category:** Architecture

**Answer:**

I organized the codebase with clear separation of concerns:

**Frontend Structure:**
```
app/
  (main)/          # Authenticated routes with sidebar layout
  auth/            # Public auth routes (signin, signup, callback)
components/
  global/          # Shared components (Header, SideNav, ChatWidget)
  ProjectDetail/   # Feature-specific components
  ui/              # Reusable UI primitives (Button, Card, Input)
contexts/          # React Context providers (Theme, Chat, Language)
services/          # API clients and business logic
types/             # TypeScript type definitions
```

**Backend Structure:**
```
backend/src/
  config/          # Passport OAuth configuration
  controllers/     # Request handlers (thin layer)
  db/              # Database connection, repositories, migrations
  routes/          # Express route definitions
  services/        # Business logic (agents, LLM providers)
    llm/           # LLM abstraction layer
  utils/           # Shared utilities (guards, validation, metrics)
  prompts/         # Versioned system prompts (v1.system.txt)
```

**Scalability Benefits:**
1. **Feature-based components** - `ProjectDetail/` folder contains all related components, easy to extract into separate package
2. **Service layer separation** - Business logic in `services/` is independent of HTTP layer, can be reused in CLI/workers
3. **Repository pattern** - `db/project.repository.js` abstracts database queries, easy to swap PostgreSQL for MongoDB
4. **Versioned prompts** - `prompts/v1.system.txt` allows A/B testing different prompt versions
5. **UI primitives** - `components/ui/` creates a design system, ensures consistency

**Maintainability Benefits:**
1. **Colocation** - Related code lives together (e.g., all LLM providers in `services/llm/`)
2. **Clear dependencies** - Contexts don't import from services, services don't import from components
3. **Single responsibility** - Each file has one job (e.g., `geminiClient.js` only calls Gemini API)

**Key talking points:**
- Route groups in App Router enable layout-based organization
- Repository pattern makes database swapping trivial
- Service layer can be extracted to microservices later
- Versioned prompts support experimentation

**Follow-up the interviewer might ask:** How would you split this into microservices?


### Q7: Explain your approach to error handling across the stack. How do you ensure the system degrades gracefully?

**Difficulty:** Hard  
**Category:** Architecture / Reliability

**Answer:**

I implemented a multi-layered error handling strategy:

**Layer 1: LLM Call Protection (`executeWithGuards` in `utils/executeWithGuards.js`)**
```javascript
export async function executeWithGuards({
  agentName, runAgent, schema, fallback,
  maxRetries = 2, timeoutMs = 15000
}) {
  // Wraps every agent call with:
  // 1. Timeout protection (withTimeout utility)
  // 2. JSON schema validation (AJV)
  // 3. Automatic retries (up to 3 attempts)
  // 4. Deterministic fallback on total failure
  // 5. Metrics recording (success/failure/latency)
}
```

**Layer 2: Rate Limit Handling (`groqClient.js`)**
```javascript
if (res.status === 429 && retryCount < MAX_RETRIES) {
  const retryAfter = parseRetryAfter(await res.text());
  const waitTime = retryAfter ? (retryAfter * 1000) + 500 : 30000;
  await sleep(waitTime);
  return callGroq(prompt, retryCount + 1); // Exponential backoff
}
```

**Layer 3: Chat Error Taxonomy (`routes/chat.routes.js`)**
```javascript
const ERROR_RESPONSES = {
  LLM_TIMEOUT: { status: 504, message: 'Response took too long...' },
  RATE_LIMITED: { status: 429, message: 'Too many requests...' },
  INVALID_CONTEXT: { status: 400, message: 'Something went wrong...' },
  MODEL_REFUSAL: { status: 422, message: "I can't help with that..." },
  INTERNAL_ERROR: { status: 500, message: 'An error occurred...' }
};
```

**Layer 4: Frontend Error Boundaries**
- React error boundaries catch component crashes
- `ChatContext.tsx` has error state for chat failures
- `ProjectForm.tsx` shows user-friendly error messages

**Graceful Degradation Examples:**
1. **Agent failure** → Uses deterministic fallback (e.g., `taskPlanFallback` generates 20-task plan)
2. **Database failure** → Returns 500 but doesn't crash server
3. **Streaming failure** → Falls back to non-streaming response
4. **OAuth failure** → Redirects to signin with error parameter

**Key talking points:**
- Defense in depth - multiple layers catch different failure modes
- User-friendly error messages hide technical details
- Fallbacks ensure users always get a result
- Metrics track failure rates for monitoring

**Follow-up:** How do you prevent cascading failures in the agent pipeline?


### Q8: How did you design the authentication system? Why OAuth over traditional email/password?

**Difficulty:** Medium  
**Category:** Architecture / Security

**Answer:**

I implemented a hybrid authentication system supporting both OAuth (Google/GitHub) and traditional email/password:

**OAuth Flow (`config/passport.js` + `routes/auth.routes.js`):**
1. User clicks "Sign in with Google" → redirects to `/api/auth/google`
2. Passport.js initiates OAuth flow with Google
3. Google redirects to `/api/auth/google/callback` with authorization code
4. Passport exchanges code for user profile
5. `createOAuthUser()` in `user.repository.js` checks if email exists:
   - If yes → links OAuth provider to existing account (account linking)
   - If no → creates new user + OAuth account entry
6. Redirects to frontend `/auth/callback?user={...}` with user data

**Traditional Flow (`routes/auth.routes.js`):**
1. User submits email/password → POST `/api/auth/register` or `/api/auth/login`
2. Password hashed with bcrypt (10 salt rounds)
3. Stored in `users.password_hash` column
4. Login validates with `bcrypt.compare()`

**Database Schema:**
```sql
users (id, name, email, password_hash, account_status)
oauth_accounts (id, user_id, provider, provider_user_id)
```

**Why OAuth?**
1. **Security** - No password storage/management burden, Google handles 2FA
2. **UX** - One-click signin, no password reset flows
3. **Trust** - Users trust Google/GitHub more than unknown apps
4. **Account linking** - Users can link multiple providers to one account

**Why Keep Email/Password?**
1. **Fallback** - Some users don't have Google/GitHub accounts
2. **Enterprise** - Corporate users may not be allowed to use OAuth
3. **Control** - Full control over auth flow (useful for testing)

**Security Measures:**
- Passwords hashed with bcrypt (not plain text)
- OAuth state parameter prevents CSRF
- Session secrets in environment variables
- Account status field allows soft deletion

**Key talking points:**
- Hybrid approach maximizes user choice
- Account linking prevents duplicate accounts
- bcrypt is industry standard for password hashing
- Passport.js abstracts OAuth complexity

**Follow-up:** How would you implement JWT-based authentication instead of sessions?


### Q9: Walk me through your state management strategy. Why Context API over Redux or Zustand?

**Difficulty:** Medium  
**Category:** Frontend Architecture

**Answer:**

I used React Context API with multiple specialized providers instead of a global state library:

**Context Providers:**
1. **ThemeContext** (`contexts/ThemeContext.tsx`) - Manages light/dark mode, persists to localStorage
2. **ChatContext** (`contexts/ChatContext.tsx`) - Chat messages, streaming state, session management
3. **LanguageContext** (`contexts/LanguageContext.tsx`) - i18n with 4 languages (English, Spanish, French, German)
4. **SearchContext** (`contexts/SearchContext.tsx`) - Global search state
5. **SidebarContext** (`contexts/SidebarContext.tsx`) - Sidebar collapse state

**Why Context API?**
1. **Built-in** - No external dependencies, reduces bundle size
2. **Simple state** - Each context manages isolated domain (theme, chat, language)
3. **No global store needed** - State is scoped to features, not shared globally
4. **Server component friendly** - Works well with Next.js App Router
5. **Performance** - Each context has few subscribers, re-renders are localized

**When I'd Use Redux/Zustand:**
- **Complex state logic** - If I had deeply nested state with many interdependencies
- **Time-travel debugging** - Redux DevTools for debugging state changes
- **Middleware needs** - If I needed sagas, thunks, or complex async logic
- **Large team** - Redux enforces patterns, Context can become messy at scale

**Performance Optimizations:**
```typescript
// ChatContext only re-renders chat components, not entire app
export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // ... other state
  
  return (
    <ChatContext.Provider value={{ messages, sendMessage, ... }}>
      {children}
    </ChatContext.Provider>
  );
}
```

**Key talking points:**
- Context API is sufficient for isolated feature state
- Multiple small contexts > one large context (prevents unnecessary re-renders)
- localStorage persistence for theme/language improves UX
- Would consider Zustand for complex cross-feature state

**Follow-up:** How do you prevent unnecessary re-renders with Context?


### Q10: Explain your database schema design. Why JSONB for agent outputs instead of normalized tables?

**Difficulty:** Medium  
**Category:** Database / Architecture

**Answer:**

I designed a hybrid schema with normalized tables for structured data and JSONB for AI-generated content:

**Schema (`db/init_db.js`):**
```sql
-- Normalized tables
users (id, name, email, password_hash, phone, dob, account_status, created_at)
oauth_accounts (id, user_id, provider, provider_user_id, created_at)
projects (id, user_id, project_description, team_size, deadline, skill_level, constraints, status, created_at)

-- JSONB storage
project_outputs (id, project_id, requirements JSONB, tech_stack JSONB, task_plan JSONB, risks JSONB, created_at)
```

**Why JSONB for Agent Outputs?**

1. **Unpredictable structure** - AI outputs vary wildly:
   - Requirements might have 5 or 50 functional requirements
   - Task plan might have 3 or 10 modules with varying task counts
   - Normalizing would require complex joins (requirements table, tasks table, modules table, etc.)

2. **Schema flexibility** - If I improve prompts and agents return new fields, no migration needed

3. **Query performance** - I mostly fetch entire project outputs, not individual requirements
   ```javascript
   // Single query gets everything
   const project = await getProjectById(id);
   // vs. multiple joins for normalized schema
   ```

4. **Atomic updates** - Updating a project plan is one UPDATE, not cascading updates across tables

5. **PostgreSQL JSONB advantages**:
   - Indexed for fast lookups: `CREATE INDEX ON project_outputs USING GIN (requirements);`
   - Can query nested fields: `WHERE requirements->'functional_requirements' @> '["User authentication"]'`
   - Stored in binary format (faster than JSON text)

**Trade-offs:**
- ❌ Can't enforce schema at DB level (rely on AJV validation in code)
- ❌ Harder to query individual requirements across projects
- ❌ Slightly slower than normalized tables for specific field queries
- ✅ Much simpler code, fewer joins, faster development

**When I'd Normalize:**
- If I needed to query "all projects with React in tech stack"
- If I needed to aggregate task estimates across projects
- If schema was stable and predictable

**Key talking points:**
- JSONB is pragmatic for AI-generated content
- PostgreSQL JSONB has good performance characteristics
- Normalized tables for user data (predictable schema)
- Trade flexibility for query complexity

**Follow-up:** How would you add full-text search across all project requirements?


---

## Section 2: Multi-Agent LLM System Deep-Dive

### Q11: How are the four agents defined? What are their individual responsibilities and why this separation?

**Difficulty:** Medium  
**Category:** LLM / Architecture

**Answer:**

Each agent has a single, well-defined responsibility following the Single Responsibility Principle:

**1. Requirements Agent (`requirementAgent.js`)**
- **Input**: Raw project description, team size, deadline, skill level, constraints
- **Output**: Structured requirements object with 4 arrays
- **Responsibility**: Extract what the system should do (functional), how it should perform (non-functional), what we're assuming, and what's missing
- **Prompt strategy**: Explicitly instructs "Do NOT suggest solutions" to prevent scope creep
- **Retry logic**: Validates minimum 5 items in each category, retries up to 3 times if insufficient

**2. Tech Stack Agent (`techStackAgent.js`)**
- **Input**: Requirements object + original constraints
- **Output**: Technology recommendations for frontend, backend, database, deployment
- **Responsibility**: Recommend practical, production-ready technologies with justification
- **Prompt strategy**: "Justify each choice briefly" ensures explainability
- **Validation**: Ensures each category has both `choice` and `reason` fields

**3. Task Planner Agent (`taskPlannerAgent.js`)**
- **Input**: Requirements + tech stack + deadline
- **Output**: Detailed execution plan with 5-7 modules, 35-50 tasks total
- **Responsibility**: Break work into actionable tasks with estimates, dependencies, roles, acceptance criteria
- **Prompt strategy**: Demands minimum task counts to prevent shallow plans
- **Fallback**: `generateComprehensiveExecutionPlan()` creates deterministic 7-module plan if AI fails
- **Complexity**: Most complex agent - 90s timeout, generates 50+ tasks across modules

**4. Risk Assessment Agent (`riskAssessmentAgent.js`)**
- **Input**: Requirements + tech stack + task plan
- **Output**: Risk list with severity (Low/Medium/High) and mitigation strategies
- **Responsibility**: Identify technical, delivery, and security risks
- **Prompt strategy**: "Imagine this will be reviewed by a CTO" raises quality bar
- **Validation**: Minimum 3 risks, must cover different categories

**Why This Separation?**
1. **Focused prompts** - Each agent has a narrow task, prompts are more effective
2. **Parallel development** - I can improve one agent without affecting others
3. **Testability** - Each agent can be tested independently
4. **Failure isolation** - If Risk Agent fails, I still have requirements/tech stack/tasks
5. **Reusability** - Requirements Agent could be used in other workflows

**Key talking points:**
- Each agent is a pure function (input → output)
- Sequential execution ensures data dependencies
- Fallbacks prevent total system failure
- Prompt engineering is agent-specific

**Follow-up:** Could these agents run in parallel? What would you need to change?


### Q12: Walk me through the structured JSON validation system. How do you ensure LLM outputs are valid?

**Difficulty:** Hard  
**Category:** LLM / Validation

**Answer:**

I use a multi-layered validation approach with JSON Schema + AJV + retry logic:

**Layer 1: JSON Schema Definitions (`utils/schema.js`)**
```javascript
export const requirementsSchema = {
  type: "object",
  required: ["functional_requirements", "non_functional_requirements", "assumptions", "missing_information"],
  properties: {
    functional_requirements: { type: "array", items: { type: "string" } },
    non_functional_requirements: { type: "array", items: { type: "string" } },
    assumptions: { type: "array", items: { type: "string" } },
    missing_information: { type: "array", items: { type: "string" } }
  }
};
```

**Layer 2: AJV Validation (`executeWithGuards.js`)**
```javascript
const ajv = new Ajv();
const validate = ajv.compile(schema);

for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
  const result = await withTimeout(runAgent(), timeoutMs);
  
  if (validate(result)) {
    // Success - record metrics and return
    recordSuccess(agentName, latency, retries);
    return result;
  }
  
  // Validation failed - retry or fallback
  if (attempt > maxRetries) {
    recordFallback(agentName);
    return fallback;
  }
}
```

**Layer 3: Prompt Engineering**
Every agent prompt includes:
```
Rules:
- Output ONLY valid JSON
- Do NOT add explanations
- Follow the exact schema provided
```

And provides example format:
```json
{
  "functional_requirements": ["User can create a project","..."],
  "non_functional_requirements": ["Response time < 2s","..."],
  ...
}
```

**Layer 4: Response Cleaning**
```javascript
const raw = await callGemini(prompt);
const cleaned = raw.replace(/```json|```/g, "").trim();
const parsed = JSON.parse(cleaned);
```

**Layer 5: Business Logic Validation**
Beyond schema, I validate business rules:
```javascript
const functional = parsed.functional_requirements || [];
const nonFunctional = parsed.non_functional_requirements || [];

if (functional.length >= 5 && nonFunctional.length >= 5) {
  return parsed; // Meets minimum quality bar
}
```

**Failure Modes Handled:**
1. **Invalid JSON** → Retry with stronger prompt
2. **Missing required fields** → AJV catches, retry
3. **Wrong types** → AJV catches (e.g., string instead of array)
4. **Insufficient items** → Business logic catches, retry
5. **All retries exhausted** → Return deterministic fallback

**Why This Works:**
- LLMs are good at following structured formats when prompted correctly
- Multiple retries handle occasional hallucinations
- Fallbacks ensure system never crashes
- Metrics track validation failure rates

**Key talking points:**
- JSON Schema is industry standard for validation
- AJV is fast (compiles schemas to functions)
- Prompt engineering is critical for structured output
- Fallbacks prevent cascading failures

**Follow-up:** How would you handle partial validation failures (e.g., 4 requirements instead of 5)?


### Q13: Explain your prompt engineering strategy. What makes a good prompt for structured output?

**Difficulty:** Hard  
**Category:** LLM / Prompt Engineering

**Answer:**

I follow a structured prompt template across all agents with these key elements:

**1. Role Definition**
```
You are a senior software requirements analyst.
```
Sets the LLM's persona and expertise level. "Senior" implies experience and quality.

**2. Strict Rules Section**
```
Rules:
- Do NOT suggest solutions.
- Do NOT add explanations.
- Output ONLY valid JSON.
```
Negative instructions prevent common failure modes (scope creep, verbose output, malformed JSON).

**3. Context Injection**
```
Project Description: ${input.project_description}
Constraints:
Team Size: ${input.team_size}
Deadline: ${input.deadline}
```
Provides all necessary information upfront. LLMs perform better with complete context.

**4. Explicit Instructions**
```
Instruction:
Provide at least 5 functional requirements, 5 non-functional requirements, and 5 assumptions.
```
Quantitative requirements prevent lazy outputs. "At least 5" is more effective than "several".

**5. Example Format**
```json
Example format:
{
  "functional_requirements": ["User can create a project","..."],
  "non_functional_requirements": ["Response time < 2s","..."],
  ...
}
```
Few-shot learning - showing the exact structure dramatically improves compliance.

**6. Quality Bar**
```
Imagine this risk assessment will be reviewed by a CTO.
```
(Risk Agent) - Appeals to the LLM's training on professional standards.

**7. Retry Awareness**
```
Attempt: ${attempt} of ${maxAttempts}
```
Informs the LLM this is a retry, sometimes improves output quality.

**Prompt Engineering Principles I Follow:**
1. **Be specific** - "5 requirements" not "some requirements"
2. **Use examples** - Show don't tell
3. **Negative instructions** - Tell it what NOT to do
4. **Structured format** - Sections with clear headers
5. **Context completeness** - All info in one prompt (no multi-turn for structured output)
6. **Temperature control** - Use 0.7 for balance of creativity and consistency

**What Makes This Effective:**
- LLMs are trained on professional documentation, so formal tone works
- JSON examples trigger the model's code generation capabilities
- Negative instructions prevent common failure modes
- Quantitative requirements are easier to validate

**Key talking points:**
- Prompt engineering is iterative - I tested many variations
- Structured prompts > conversational prompts for JSON output
- Examples are more effective than descriptions
- Version control prompts in separate files (`prompts/v1.system.txt`)

**Follow-up:** How would you A/B test different prompt versions?


### Q14: How do you use multiple LLM providers (Gemini + Groq)? What's the strategy for choosing between them?

**Difficulty:** Medium  
**Category:** LLM

**Answer:**

I implemented a provider abstraction layer with automatic selection based on availability and cost:

**Provider Selection Logic (`llm.factory.js`):**
```javascript
function detectProvider() {
  if (process.env.LLM_PROVIDER) return process.env.LLM_PROVIDER; // Explicit override
  if (process.env.GROQ_API_KEY) return 'groq';                   // Prefer Groq (free)
  if (process.env.GEMINI_API_KEY) return 'gemini';               // Fallback to Gemini
  return 'gemini';                                                // Default
}
```

**Why This Strategy?**

**Groq (Primary):**
- **Model**: `llama-3.1-8b-instant` (switched from 70B for higher rate limits)
- **Speed**: Extremely fast inference (< 1s for most responses)
- **Cost**: 14,400 free requests/day
- **Rate limits**: 30 req/min, automatic retry with exponential backoff
- **Use case**: Perfect for development and low-traffic production

**Gemini (Fallback):**
- **Model**: `gemini-1.5-flash`
- **Quality**: Better reasoning for complex tasks
- **Cost**: Pay-per-use after free tier
- **Use case**: Production at scale, or when Groq hits limits

**Actual Usage (`geminiClient.js`):**
```javascript
export async function callGemini(prompt) {
  return callGroq(prompt); // Despite the name, routes to Groq!
}
```
This is a clever abstraction - all agents call `callGemini()` but it actually uses Groq. I can swap providers by changing one line.

**Rate Limit Handling (`groqClient.js`):**
```javascript
if (res.status === 429 && retryCount < MAX_RETRIES) {
  const retryAfter = parseRetryAfter(await res.text());
  const waitTime = retryAfter ? (retryAfter * 1000) + 500 : 30000;
  await sleep(waitTime);
  return callGroq(prompt, retryCount + 1);
}
```

**Provider Comparison:**
| Feature | Groq | Gemini |
|---------|------|--------|
| Speed | ⚡ Fastest | 🐢 Slower |
| Cost | 💰 Free (14.4k/day) | 💸 Paid |
| Quality | ✅ Good | ✅✅ Better |
| Rate Limits | ⚠️ 30/min | ✅ Higher |
| Context Window | 128K | 128K |

**Future Improvements:**
1. **Automatic failover** - If Groq fails, try Gemini
2. **Load balancing** - Distribute requests across providers
3. **Cost optimization** - Use Groq for simple tasks, Gemini for complex
4. **A/B testing** - Compare output quality between providers

**Key talking points:**
- Factory pattern enables runtime provider switching
- Groq's speed is game-changing for UX
- Rate limit handling prevents cascading failures
- Abstraction layer makes adding OpenAI/Claude trivial

**Follow-up:** How would you implement automatic failover between providers?


### Q15: How is agent failure handled? What happens if one agent returns bad output?

**Difficulty:** Hard  
**Category:** LLM / Reliability

**Answer:**

I implemented a defense-in-depth strategy with multiple failure handling layers:

**1. Validation Failures → Automatic Retry**
If an agent returns invalid JSON or fails schema validation, `executeWithGuards` automatically retries up to 3 times with the same prompt. This handles transient LLM issues.

**2. All Retries Exhausted → Deterministic Fallback**
Each agent has a hardcoded fallback in `utils/fallbacks.js`:
- `requirementsFallback`: Basic CRUD, usability, performance requirements
- `techStackFallback`: React, Node.js, PostgreSQL, Vercel
- `taskPlanFallback`: 20-task plan across 2 modules
- `riskFallback`: "Incomplete requirements" risk

**3. Task Planner Special Case → Comprehensive Fallback**
The Task Planner has the most sophisticated fallback - `generateComprehensiveExecutionPlan()` creates a deterministic 7-module, 50+ task plan based on requirements. It's not AI-generated but still useful.

**4. Cascading Failures → Partial Results**
If Requirements Agent fails, all downstream agents use fallbacks. But the system still returns a complete project plan - just lower quality.

**5. Metrics Tracking**
```javascript
recordSuccess(agentName, latency, retries);  // Successful after retries
recordFailure(agentName, latency, retries);  // All retries failed
recordFallback(agentName);                   // Using fallback
```

**Real-World Scenario:**
```
User submits project → Requirements Agent succeeds
                     → Tech Stack Agent fails (3 retries)
                     → Uses techStackFallback (React/Node/PostgreSQL)
                     → Task Planner receives fallback tech stack
                     → Generates plan based on fallback
                     → Risk Agent identifies "Generic tech stack" as risk
                     → User gets complete (but generic) project plan
```

**Why This Works:**
- Users always get a result (never a blank page)
- Fallbacks are production-tested (not random)
- Metrics help identify which agents fail most
- Partial results are better than no results

**Key talking points:**
- Graceful degradation over hard failures
- Deterministic fallbacks are predictable
- Metrics enable monitoring and alerting
- System never crashes, always returns something

**Follow-up:** How would you improve fallback quality over time?

---

### Q16: Explain how confidence scores are computed. Where are they used?

**Difficulty:** Medium  
**Category:** LLM

**Answer:**

Currently, confidence scores are **hardcoded placeholders** in the frontend, not computed by the AI agents. This is a known limitation.

**Current Implementation:**
In `app/(main)/project/[id]/page.tsx`:
```typescript
const techStackProps = {
  recommendations: Object.entries(project.tech_stack || {}).map(([category, data]: any, i) => ({
    id: `tech-${i}`,
    category,
    choice: data?.choice || '',
    reason: data?.reason || '',
    confidence: 4.2,  // ← Hardcoded!
    icon: '🔧',
  })),
};
```

**Why Hardcoded?**
1. LLMs don't naturally output confidence scores
2. Would require additional prompt engineering: "Rate your confidence 1-5"
3. LLM-generated confidence is often unreliable (overconfident)
4. Focused on core functionality first

**How I'd Implement Real Confidence:**

**Option 1: Prompt-Based**
```
For each recommendation, provide a confidence score (1-5) based on:
- How well it matches the requirements
- Team skill level compatibility
- Industry adoption
```

**Option 2: Ensemble Voting**
Run the same agent 3 times, compare outputs:
- 3/3 agree → confidence = 5
- 2/3 agree → confidence = 3
- All different → confidence = 1

**Option 3: Retrieval-Augmented**
Compare recommendation against database of successful projects:
- High similarity → high confidence
- Low similarity → low confidence

**Option 4: User Feedback Loop**
Track which recommendations users accept/reject:
- "React for frontend" accepted 90% → confidence = 4.5
- "MongoDB for database" accepted 40% → confidence = 2.0

**Where Confidence Would Be Useful:**
1. **UI indicators** - Show warning for low-confidence recommendations
2. **Sorting** - Display high-confidence items first
3. **Explanations** - "Low confidence because team skill level is beginner"
4. **A/B testing** - Compare confidence vs. actual user satisfaction

**Key talking points:**
- Current implementation is MVP (hardcoded)
- Real confidence requires additional LLM calls or ensemble methods
- User feedback is most reliable confidence signal
- Trade-off: accuracy vs. latency/cost

**Follow-up:** How would you validate that LLM confidence scores are accurate?


### Q17: How is context passed between agents? Do they share state?

**Difficulty:** Medium  
**Category:** LLM / Architecture

**Answer:**

Agents are **stateless functions** that receive context explicitly as parameters. There's no shared state or global variables.

**Context Flow (`agentOrchestrator.js`):**
```javascript
export async function runFullAnalysis(input) {
  // Step 1: Requirements Agent (only needs user input)
  const requirements = await runRequirementAgent(input);
  await new Promise(r => setTimeout(r, 2000)); // Rate limit cooldown
  
  // Step 2: Tech Stack Agent (needs requirements + input)
  const techStack = await runTechStackAgent(requirements, input);
  await new Promise(r => setTimeout(r, 2000));
  
  // Step 3: Task Planner (needs requirements + tech stack + deadline)
  const taskPlan = await runTaskPlannerAgent(requirements, techStack, input.deadline);
  await new Promise(r => setTimeout(r, 2000));
  
  // Step 4: Risk Assessment (needs everything)
  const risks = await runRiskAssessmentAgent(requirements, techStack, taskPlan);
  
  return { status: "Completed", requirements, tech_stack: techStack, task_plan: taskPlan, risks };
}
```

**Key Design Principles:**

**1. Explicit Dependencies**
Each agent declares what it needs:
- Requirements Agent: `input` (project description, team size, etc.)
- Tech Stack Agent: `requirements, input`
- Task Planner: `requirements, techStack, deadline`
- Risk Assessment: `requirements, techStack, taskPlan`

**2. Immutable Data**
Agents never modify their inputs, only return new outputs. This prevents side effects.

**3. Sequential Execution**
Agents run in order because of data dependencies. Can't plan tasks without knowing the tech stack.

**4. Context Serialization**
All context is JSON-serializable, making it easy to:
- Store in database
- Send over HTTP
- Cache in Redis
- Replay for debugging

**5. No Global State**
Each `runFullAnalysis()` call is independent. Supports concurrent requests from multiple users.

**Why This Design?**

**Pros:**
- ✅ Testable - Can test each agent in isolation
- ✅ Debuggable - Can inspect inputs/outputs at each step
- ✅ Scalable - Can move agents to separate services
- ✅ Reliable - No race conditions or shared state bugs

**Cons:**
- ❌ Redundant data - Requirements passed to multiple agents
- ❌ Memory usage - Full context in memory for entire pipeline
- ❌ Can't parallelize - Sequential execution is slower

**Alternative Designs Considered:**

**Option 1: Shared Context Object**
```javascript
const context = { input, requirements: null, techStack: null, ... };
await runRequirementAgent(context); // Mutates context.requirements
await runTechStackAgent(context);   // Reads context.requirements
```
Rejected because mutation makes debugging harder.

**Option 2: Event-Driven**
```javascript
eventBus.emit('requirements-complete', requirements);
eventBus.on('requirements-complete', (req) => runTechStackAgent(req));
```
Rejected because adds complexity without clear benefits.

**Key talking points:**
- Functional programming principles (pure functions, immutability)
- Explicit dependencies make code self-documenting
- Sequential execution is simpler than event-driven
- Stateless design enables horizontal scaling

**Follow-up:** How would you refactor this to support parallel agent execution?

---

### Q18: What happens when the LLM returns unexpected fields or formats?

**Difficulty:** Medium  
**Category:** LLM / Error Handling

**Answer:**

I handle unexpected outputs through multiple defensive layers:

**Layer 1: JSON Parsing**
```javascript
const raw = await callGemini(prompt);
let parsed;
try {
  parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
} catch (err) {
  if (attempt === maxAttempts) throw err;
  continue; // Retry
}
```
Strips markdown code fences and retries on parse errors.

**Layer 2: Schema Validation**
```javascript
const validate = ajv.compile(schema);
if (!validate(parsed)) {
  throw new Error("Schema validation failed");
}
```
AJV checks:
- Required fields exist
- Field types are correct (array vs string)
- Nested structure matches schema

**Layer 3: Defensive Access**
```javascript
const functional = parsed.functional_requirements || [];
const nonFunctional = parsed.non_functional_requirements || [];
```
Use `|| []` to handle missing fields gracefully.

**Layer 4: Business Logic Validation**
```javascript
if (functional.length >= 5 && nonFunctional.length >= 5 && assumptions.length >= 5) {
  return parsed;
}
```
Even if schema passes, check quality thresholds.

**Real-World Examples:**

**Example 1: Extra Fields**
```json
{
  "functional_requirements": [...],
  "non_functional_requirements": [...],
  "assumptions": [...],
  "missing_information": [...],
  "confidence_score": 0.95  // ← Unexpected field
}
```
**Handling**: AJV ignores extra fields by default. No error.

**Example 2: Wrong Type**
```json
{
  "functional_requirements": "User authentication",  // ← String instead of array
  ...
}
```
**Handling**: AJV validation fails → retry → fallback if all retries fail.

**Example 3: Nested Unexpected Structure**
```json
{
  "functional_requirements": [
    { "id": 1, "text": "User authentication" }  // ← Object instead of string
  ],
  ...
}
```
**Handling**: AJV validation fails → retry.

**Example 4: Markdown in JSON**
```json
{
  "functional_requirements": [
    "**User authentication** - Users can sign in"  // ← Markdown formatting
  ],
  ...
}
```
**Handling**: Passes validation (still a string). Frontend renders markdown as-is. Could add sanitization layer.

**Key talking points:**
- Multiple validation layers catch different error types
- Graceful degradation (extra fields ignored, missing fields defaulted)
- Retry logic handles transient formatting issues
- Fallbacks ensure system never crashes

**Follow-up:** How would you sanitize markdown or HTML in LLM outputs?

