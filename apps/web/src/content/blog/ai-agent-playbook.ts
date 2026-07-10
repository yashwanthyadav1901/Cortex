import type { BlogPost } from "./types";

export const aiAgentPlaybook: BlogPost = {
  slug: "ai-agent-playbook",
  title: "The Production AI Agent Playbook",
  subtitle: "Architecture Decision Guide & Deployment Checklist",
  date: "2025-07-10",
  tags: ["ai-agents", "architecture", "production", "deployment"],
  readingTimeMins: 18,
  hero: {
    intro: `Most AI agent demos are impressive. Most AI agent deployments are disasters. The gap between a compelling prototype and a reliable production system is wider than in almost any other area of software engineering — because agents introduce **non-determinism at the control-flow level**, not just at the output level.

In production, agents fail in ways that are fundamentally different from traditional software: state drift across multi-turn conversations, cost explosions from recursive tool calls, hallucinated action sequences that pass validation but corrupt data, and latency spikes that turn a 200ms user expectation into a 45-second timeout.

This guide is a decision framework — not a tutorial. It covers when to use an agent (and when a simpler architecture is the right call), how to standardize the governance layer around memory, tools, and human oversight, and a concrete deployment checklist distilled from shipping agent systems in production.`,
  },
  sections: [
    {
      kind: "prose",
      heading: "Why Agents Fail in Production",
      content: `Before choosing an architecture, understand the failure modes you're designing against:

**Non-determinism at the orchestration layer.** Traditional software has deterministic control flow with non-deterministic I/O. Agents invert this: the control flow *itself* is non-deterministic. The LLM decides which tool to call, what arguments to pass, and when to stop. This means the same input can produce fundamentally different execution traces — not just different outputs.

**State drift.** In multi-turn agent sessions, the context window becomes a mutable shared state that both the user and the agent write to. Without explicit state management, agents "forget" constraints from earlier turns, re-derive conclusions they already reached, or operate on stale assumptions after the user corrects course.

**Cost loops.** An agent that calls a tool, receives an error, retries with a slightly different approach, receives another error, and keeps iterating can burn through thousands of tokens in seconds. Without circuit breakers, a single malformed API response can turn a $0.02 query into a $15 runaway loop.

**Hallucinated action sequences.** Unlike text hallucination (which is embarrassing), action hallucination is *dangerous*. An agent that confidently calls \`DELETE /api/users/123\` because it "inferred" that was the right action from context has corrupted your data, not just your conversation.`,
    },
    {
      kind: "table",
      heading: "The Decision Matrix: When to Use an Agent",
      description:
        "Not every LLM-powered feature needs an agent. This matrix maps architecture patterns to their ideal use cases, helping you choose the simplest architecture that solves your problem.",
      columns: [
        "Architecture Pattern",
        "Ideal Use Case",
        "Complexity",
        "Cost Factor",
        "Latency Profile",
      ],
      rows: [
        [
          "**Prompt Engineering** (single LLM call)",
          "Classification, summarization, extraction, reformatting. Any task where the input fully determines the output without external data or multi-step reasoning.",
          "Low",
          "$ — single inference call",
          "200–800ms (one round-trip)",
        ],
        [
          "**RAG** (Retrieval-Augmented Generation)",
          "Q&A over proprietary data, support bots, documentation search. Tasks where the answer exists in your corpus but the user doesn't know where.",
          "Medium",
          "$$ — embedding + retrieval + inference",
          "500ms–2s (retrieval + generation)",
        ],
        [
          "**Fine-Tuning** (custom model weights)",
          "Domain-specific tone/style, structured output adherence, latency-critical classification. When prompt engineering hits a quality ceiling and you have >500 labeled examples.",
          "High (upfront)",
          "$$$ upfront, then $ per call",
          "200–600ms (optimized inference)",
        ],
        [
          "**Single Agent** (tool-calling loop)",
          "Multi-step tasks with clear tool boundaries: code generation with execution, data pipeline orchestration, form-filling with validation. One persona, one goal.",
          "High",
          "$$$ — multiple inference + tool calls",
          "5–60s (depends on loop depth)",
        ],
        [
          "**Multi-Agent System** (orchestrated agents)",
          "Complex workflows requiring distinct expertise: research + analysis + writing pipelines, adversarial verification, parallel exploration with synthesis. Multiple personas, coordinated goals.",
          "Very High",
          "$$$$ — N agents × M steps",
          "30s–5min (parallel helps)",
        ],
      ],
    },
    {
      kind: "prose",
      heading: "Framework Selection Guide",
      content: `Once you've decided an agent architecture is warranted, choose your orchestration framework based on the execution model you need:

**LangGraph / custom state machines** — Choose when your agent needs **explicit, auditable state transitions**. LangGraph models agent workflows as directed graphs where each node is a function and edges are conditional transitions. This gives you: checkpointable state (pause/resume across requests), human-in-the-loop approval gates as first-class nodes, and time-travel debugging by replaying from any checkpoint. Best for: production systems where you need to explain *why* the agent took a specific path.

**CrewAI / role-based frameworks** — Choose when your problem decomposes into **distinct personas with different prompts and tool sets**. CrewAI assigns roles (Researcher, Analyst, Writer) with individual system prompts and delegates tasks between them. The abstraction is higher-level than LangGraph — you think in roles and tasks, not nodes and edges. Best for: content pipelines, research workflows, multi-perspective analysis. Weakness: harder to debug because the orchestration logic is implicit in the role definitions.

**AutoGen / conversation-based** — Choose when agents need to **negotiate and iterate** on a shared artifact. AutoGen models multi-agent interaction as a conversation where agents take turns. This is natural for: code review (writer + reviewer loop), debate/adversarial verification, iterative refinement. Weakness: conversation-based coordination is less predictable than graph-based.

**Native custom loops** — Choose when your workflow is **simple enough that a framework adds more complexity than it removes**. A \`while\` loop with an LLM call, a tool dispatch \`switch\`, and a termination condition is often 50 lines of code that's easier to debug, profile, and modify than any framework. Best for: single-agent tool-calling loops, linear pipelines, and any case where you can enumerate the possible control flow paths. *Start here and migrate to a framework when you hit a wall.*`,
    },
    {
      kind: "prose",
      heading: "Architecture Standard: Memory Management",
      content: `Agent memory is not a feature — it's an architecture decision that affects every other component. Get it wrong and your agent either forgets critical context mid-conversation or drowns in irrelevant history.

### Short-Term Memory (Session / Thread State)

**What it is:** The context window contents for the current conversation turn. This includes the system prompt, conversation history, tool call results, and any injected context.

**The core problem:** Context windows are finite and expensive. A 128k token window costs real money to fill, and attention quality degrades with length — the model pays less attention to information in the middle of long contexts (the "lost in the middle" problem).

**Production standards:**
- **Sliding window with summarization.** Keep the last N turns verbatim and summarize older turns into a compressed state object. The summary should preserve: decisions made, constraints established, entities referenced, and current goal state.
- **Structured scratchpad.** Give the agent an explicit \`<scratchpad>\` section in its context that it updates each turn with: current objective, known constraints, pending actions, and resolved questions. This prevents state drift by forcing the agent to externalize its working memory.
- **Tool result truncation.** Never inject raw tool results into context. Summarize large API responses, truncate file contents to relevant sections, and strip boilerplate. A 50KB JSON response injected verbatim into context is a latency and cost bug.

### Long-Term Memory (Episodic / Semantic)

**What it is:** Persistent knowledge that survives across sessions — user preferences, past decisions, learned facts, and interaction patterns.

**Production standards:**
- **Vector store with metadata filtering.** Use embeddings for semantic retrieval but always attach structured metadata (timestamp, session_id, topic, confidence_score) so you can filter before ranking. Pure semantic search without temporal filtering will surface stale information.
- **Memory decay and consolidation.** Not all memories are equally valuable over time. Implement a decay function that reduces retrieval priority for older memories unless they've been reinforced by repeated access. Consolidate related memories into summary nodes to prevent the memory store from growing unboundedly.
- **Explicit memory operations.** Give the agent tools to \`remember\`, \`recall\`, and \`forget\`. Don't silently inject all retrieved memories — let the agent decide what's relevant to the current task. This reduces context pollution and gives you an audit trail of what information influenced each decision.`,
    },
    {
      kind: "prose",
      heading: "Architecture Standard: Tool Governance",
      content: `Every tool you expose to an agent is an attack surface, a cost center, and a reliability dependency. Tool governance is about making tool calls safe, predictable, and auditable.

### Sandboxing and Isolation

**Principle:** An agent should never have more permissions than the minimum required for its current task.

- **Per-tool IAM scoping.** Each tool should have its own service account or API key with the narrowest possible permissions. An agent that can read customer data should not use the same credentials as one that can modify billing records.
- **Network isolation for code execution.** If your agent executes generated code, run it in a sandboxed environment (container, VM, or WASM runtime) with no network access, limited filesystem, and a hard memory cap. Never execute agent-generated code in the same process as your application.
- **Rate limiting per tool, per session.** Set per-tool invocation limits at the session level. If an agent calls \`search_database\` more than 20 times in a single session, something has gone wrong — circuit-break and escalate to a human.

### Schema Validation

**Principle:** Tool inputs and outputs must be validated against strict JSON schemas. The LLM will occasionally produce malformed arguments — validation catches this before it reaches your APIs.

- **Strict mode on all tool schemas.** No \`additionalProperties: true\`. Every field typed, every enum exhaustive. The tighter the schema, the more the model constrains its own output.
- **Output validation too.** Validate tool *return values* before injecting them into the agent's context. A tool that returns an error object instead of the expected result type can send the agent into a confused reasoning loop.
- **Argument sanitization.** Treat tool arguments the same way you'd treat user input in a web application. SQL injection via tool arguments is a real attack vector — agent prompt injection can produce arguments like \`{"query": "'; DROP TABLE users; --"}\`.

### Timeouts and Circuit Breakers

- **Per-tool timeouts.** Every tool call gets a timeout proportional to its expected latency. A database query that hasn't returned in 5 seconds is probably stuck — don't let the agent wait 60 seconds for it.
- **Global session timeout.** Set a hard wall-clock limit on agent sessions. If the agent hasn't completed its task in 2 minutes, force-terminate and return a graceful fallback response.
- **Max loop counter.** Track the number of LLM inference calls per session. If it exceeds a threshold (e.g., 15 iterations), the agent is likely stuck in a retry loop. Break the loop, log the trace, and escalate.`,
    },
    {
      kind: "prose",
      heading: "Architecture Standard: Human-in-the-Loop (HITL)",
      content: `Not every agent action should be autonomous. HITL patterns define the boundary between "the agent acts" and "the agent proposes and waits for approval."

### When an Agent MUST Pause

Define explicit approval gates for actions that are:
- **Irreversible**: Deleting data, sending emails, posting to external platforms, modifying production configs.
- **Financial**: Any action that spends money — API calls to paid services, purchasing, billing modifications.
- **Cross-boundary**: Actions that leave your system boundary — webhook calls, third-party API mutations, file exports.
- **High-confidence-required**: When the agent's confidence score (if you track it) drops below a threshold, it should present options rather than act.

### Implementation Patterns

**Approval queue with timeout.** The agent pushes a proposed action to a queue with a structured description of what it wants to do and why. A human approves, rejects, or modifies within a timeout window. If the timeout expires, the action is rejected by default (fail-closed, not fail-open).

**Tiered autonomy.** Define autonomy levels per tool: \`autonomous\` (agent acts freely), \`notify\` (agent acts and logs for review), \`approve\` (agent proposes and waits). Start every new tool at \`approve\` and promote to \`autonomous\` only after observing 50+ successful invocations without incidents.

**Structured proposals.** When an agent pauses for approval, it should present: the specific action it wants to take (as a tool call with arguments), its reasoning chain, the expected outcome, and the rollback plan if the action fails. Vague proposals like "I'd like to update the user's account" are not actionable — require specificity.

**Feedback loops.** When a human rejects or modifies a proposed action, feed the correction back to the agent's context so it can adjust its approach. Without this, the agent will propose the same rejected action repeatedly, creating approval fatigue.`,
    },
    {
      kind: "checklist",
      heading: "Production Deployment Checklist",
      description:
        "Use this checklist before shipping any agent system to production. Each item is a concrete action, not a vague best practice.",
      categories: [
        {
          name: "Observability & Monitoring",
          items: [
            "Prompt tracing enabled — every LLM call logged with input, output, latency, and token count (LangSmith, Phoenix, or custom)",
            "Cost tracking per session — aggregate token usage and tool call costs, alert on sessions exceeding 5x median cost",
            "Tool call audit log — every tool invocation recorded with arguments, response, latency, and success/failure status",
            "Agent trajectory visualization — ability to replay any session's decision trace step-by-step for debugging",
            "Latency percentiles dashboarded — p50, p95, p99 for end-to-end agent sessions, not just individual LLM calls",
            "Error rate alerting — automated alerts when agent failure rate exceeds baseline by 2x over a 15-minute window",
            "Context window utilization tracked — monitor how much of the context window is used per turn to catch bloat early",
          ],
        },
        {
          name: "Resilience & Fallbacks",
          items: [
            "Exponential backoff with jitter on all LLM API calls — never retry immediately, never retry more than 3 times",
            "Graceful tool failure — if any tool fails, the agent receives a structured error and continues with a fallback strategy, not a raw exception",
            "Max loop counter enforced — hard limit on LLM inference iterations per session (e.g., 15), with forced termination and user notification",
            "Timeout on every tool call — no tool call blocks for more than its expected p99 latency + 50% buffer",
            "Global session timeout — hard wall-clock limit (e.g., 120 seconds) after which the agent returns a partial result with an explanation",
            "Model fallback chain — if primary model is unavailable or rate-limited, fall back to a secondary model with adjusted prompts",
            "Idempotent tool calls — all mutating tools are idempotent so retries are safe, or non-idempotent tools are never auto-retried",
          ],
        },
        {
          name: "Security & Guardrails",
          items: [
            "Prompt injection defense — input/output filtering for known injection patterns; system prompt isolated from user-controllable content",
            "PII masking before LLM calls — detect and redact PII (emails, SSNs, credit cards) before sending data to external LLM providers",
            "Per-tool IAM isolation — each tool runs with minimum-privilege credentials, no shared service account across tools",
            "Agent-generated code sandboxed — all code execution in isolated containers with no network, limited CPU/memory, and hard timeouts",
            "Output validation — agent responses validated against expected schemas before returning to users; malformed responses trigger fallback",
            "Secrets never in context — API keys, tokens, and credentials are injected at the tool layer, never visible in the agent's context window",
            "Rate limiting per user, per session — prevent individual users from triggering cost-explosion attacks via rapid agent invocations",
          ],
        },
        {
          name: "Evaluation & Testing",
          items: [
            "Golden dataset of 50+ input/expected-output pairs covering happy paths and known edge cases",
            "LLM-as-judge evaluation — automated scoring of agent outputs on relevance, accuracy, and safety using a stronger model as evaluator",
            "Regression tests for agent trajectories — not just final output, but the sequence of tool calls and reasoning steps",
            "Deterministic unit tests for every custom tool — tools tested independently of the agent with mocked inputs and expected outputs",
            "Adversarial testing — red-team prompts that attempt injection, jailbreaking, and out-of-scope requests, with pass/fail thresholds",
            "A/B testing infrastructure — ability to route traffic between agent versions and compare success rates, latency, and cost",
            "Canary deployments — new agent versions rolled out to 5% of traffic first, with automatic rollback on error rate increase",
          ],
        },
      ],
    },
  ],
};
