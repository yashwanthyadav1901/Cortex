import type { Roadmap } from "../types";

export const aiAgentsRoadmap: Roadmap = {
  pillar: "ai_agents",
  title: "AI Agents — 1 Week Intensive",
  description:
    "LLM APIs → tool use → agent loops → MCP → frameworks → enterprise patterns → production. Build from scratch first, then frameworks, then ship.",
  stages: [
    {
      title: "LLM API Mastery",
      nodes: [
        {
          slug: "agent-llm-api-fundamentals",
          title: "LLM API Deep Dive",
          summary:
            "Messages API, system prompts, streaming, model selection, token management, and cost optimization — the foundation every agent is built on.",
          why: "Every agent is an API loop. If you don't understand the raw API, you're debugging abstractions blind.",
          estHours: 4,
          tasks: [
            "Read the Claude Messages API docs end to end — make a streaming chat completion call with system prompt, user message, and assistant prefill",
            "Build a CLI chat client in Python that streams responses token-by-token, tracks input/output tokens per turn, and displays running cost",
            "Experiment with temperature, top_p, and max_tokens: generate 10 responses to the same prompt at temperature 0 vs 1.0 and compare",
            "Read the Anthropic model comparison page and write a decision matrix: when to use Haiku vs Sonnet vs Opus based on latency, cost, and capability",
            "Implement prompt caching for a multi-turn conversation and measure the cost reduction vs uncached calls",
          ],
          resources: [
            {
              title: "Claude Messages API — Anthropic docs",
              url: "https://docs.anthropic.com/en/api/messages",
              type: "docs",
              note: "The single source of truth — read every parameter",
            },
            {
              title: "Anthropic SDK (Python) — quickstart",
              url: "https://docs.anthropic.com/en/docs/initial-setup",
              type: "docs",
            },
            {
              title: "Prompt caching — Anthropic docs",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching",
              type: "docs",
            },
            {
              title: "AI Agents Course — Functions, Tools, and Agents with LangChain (DeepLearning.AI)",
              url: "https://www.deeplearning.ai/short-courses/functions-tools-agents-langchain/",
              type: "course",
              note: "Covers API fundamentals before adding framework abstractions",
            },
            {
              title: "Intro to LLM APIs — AI Jason",
              url: "https://www.youtube.com/watch?v=xRMGBtYmSOk",
              type: "video",
            },
            {
              title: "Anthropic Cookbook — API usage examples",
              url: "https://github.com/anthropics/anthropic-cookbook",
              type: "practice",
              note: "Runnable notebooks covering streaming, caching, and model selection",
            },
            {
              title: "OpenAI Cookbook — API patterns and examples",
              url: "https://github.com/openai/openai-cookbook",
              type: "practice",
            },
          ],
        },
        {
          slug: "agent-structured-output",
          title: "Structured Output & Validation",
          summary:
            "JSON mode, tool_result schemas, Pydantic/Zod validation, retry-on-failure — making LLMs produce machine-readable output reliably.",
          why: "Agents need structured data to act on. Unstructured text is for humans; tools need JSON they can trust.",
          estHours: 4,
          row: 1,
          tasks: [
            "Use Claude's tool_use feature to force JSON output matching a Pydantic schema — handle the case where the model returns malformed JSON",
            "Build a retry wrapper: if output fails validation, feed the error back to the model and re-request (max 3 retries)",
            "Compare three approaches to structured output: system prompt instructions, tool_use forcing, and prefilled assistant response — measure reliability on 50 test cases",
            "Implement a Zod schema validator in TypeScript that parses LLM responses and returns typed objects or descriptive errors",
          ],
          resources: [
            {
              title: "Tool use for structured output — Anthropic docs",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview",
              type: "docs",
            },
            {
              title: "Instructor — structured LLM outputs library",
              url: "https://github.com/jxnl/instructor",
              type: "docs",
              note: "Study the patterns even if you don't use the library",
            },
            {
              title: "Pydantic docs — model validation",
              url: "https://docs.pydantic.dev/latest/",
              type: "docs",
            },
            {
              title: "Structured Outputs with LLMs — Jason Liu (Instructor creator)",
              url: "https://www.youtube.com/watch?v=XBst5gVrKx0",
              type: "video",
              note: "Deep dive on Pydantic-based validation patterns for LLM outputs",
            },
            {
              title: "Extracting Structured Data from LLMs — LangChain blog",
              url: "https://blog.langchain.dev/structured-output/",
              type: "article",
            },
            {
              title: "Zod — TypeScript-first schema validation",
              url: "https://zod.dev/",
              type: "docs",
            },
            {
              title: "Anthropic Cookbook — tool use for structured output",
              url: "https://github.com/anthropics/anthropic-cookbook/tree/main/tool_use",
              type: "practice",
            },
          ],
        },
      ],
    },
    {
      title: "Tool Use & Function Calling",
      nodes: [
        {
          slug: "agent-tool-calling",
          title: "Function Calling Deep Dive",
          summary:
            "Native tool/function calling, JSON schema definitions, tool_choice control, parallel tool calls, and handling tool errors gracefully.",
          why: "Tool calling is how agents interact with the world. Master the protocol and every framework becomes transparent.",
          estHours: 4,
          tasks: [
            "Read the Claude tool use docs and implement a calculator tool: define the JSON schema, send a message that triggers it, and handle the tool_use → tool_result round-trip",
            "Implement 3 tools (calculator, web fetcher, file reader) and send a message that triggers parallel tool calls — handle all results in a single response",
            "Test every tool_choice mode: auto, any, and specific tool forcing — write a test case showing when each is appropriate",
            "Build error handling: what happens when a tool throws? Feed the error back as a tool_result with is_error: true and observe how the model recovers",
            "Read the OpenAI function calling docs and compare the schema format with Claude's — note the differences for cross-provider portability",
          ],
          resources: [
            {
              title: "Tool use — Claude docs",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview",
              type: "docs",
              note: "Read every section including error handling",
            },
            {
              title: "Tool use examples — Anthropic cookbook",
              url: "https://github.com/anthropics/anthropic-cookbook/tree/main/tool_use",
              type: "docs",
            },
            {
              title: "OpenAI function calling docs (for comparison)",
              url: "https://platform.openai.com/docs/guides/function-calling",
              type: "docs",
            },
            {
              title: "Building AI Agents with Tool Use — James Briggs",
              url: "https://www.youtube.com/watch?v=cGimkpCYkV0",
              type: "video",
            },
            {
              title: "Function Calling and Tool Use — DeepLearning.AI short course",
              url: "https://www.deeplearning.ai/short-courses/functions-tools-agents-langchain/",
              type: "course",
            },
            {
              title: "LLM Powered Autonomous Agents — Lilian Weng",
              url: "https://lilianweng.github.io/posts/2023-06-23-agent/",
              type: "article",
              note: "Comprehensive overview covering tool use as a core agent capability",
            },
            {
              title: "Anthropic Cookbook — tool use examples",
              url: "https://github.com/anthropics/anthropic-cookbook/tree/main/tool_use",
              type: "practice",
            },
          ],
          projectSlugs: ["enterprise-agent"],
        },
        {
          slug: "agent-tool-design",
          title: "Tool Design Patterns",
          summary:
            "Schema design principles, composable tools, idempotency, input validation, and tool result formatting for reliable agent execution.",
          why: "Bad tools make bad agents. Tool design is prompt engineering for the action layer.",
          estHours: 4,
          row: 1,
          tasks: [
            "Design tool schemas for a file management system: read, write, list, delete — make descriptions clear enough that the model picks the right tool without ambiguity",
            "Implement an idempotent tool: calling it twice with the same input produces the same result without side effects (e.g., 'create or update' instead of 'create')",
            "Build a tool registry pattern: tools are defined as classes/objects with schema, handler, and validation — the registry dynamically builds the tool list for the API call",
            "Test tool discoverability: give the model 10 tools and a vague request — does it pick the right one? Improve descriptions until it does reliably",
          ],
          resources: [
            {
              title: "Building effective agents — Anthropic",
              url: "https://www.anthropic.com/research/building-effective-agents",
              type: "article",
              note: "Focus on the tool design principles",
            },
            {
              title: "Tool use best practices — Claude docs",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/best-practices-and-limitations",
              type: "docs",
            },
            {
              title: "JSON Schema reference",
              url: "https://json-schema.org/understanding-json-schema/",
              type: "docs",
            },
            {
              title: "Building effective agents — Anthropic (tool design section)",
              url: "https://www.anthropic.com/research/building-effective-agents",
              type: "article",
              note: "Focus on the section about tool descriptions and schema clarity",
            },
            {
              title: "API Design Patterns (book) — JJ Geewax",
              url: "https://www.manning.com/books/api-design-patterns",
              type: "book",
              note: "Idempotency, naming, and composability principles apply directly to tool design",
            },
            {
              title: "How to Build AI Agents — Dave Ebbelaar",
              url: "https://www.youtube.com/watch?v=MOyl58VF2ak",
              type: "video",
            },
          ],
          projectSlugs: ["mcp-tool-server"],
        },
      ],
    },
    {
      title: "The Agent Loop",
      nodes: [
        {
          slug: "agent-architectures",
          title: "Agent Architecture Patterns",
          summary:
            "Anthropic's 5 agentic patterns, ReAct loops, plan-and-execute, and building the reason → act → observe loop from scratch.",
          why: "Understanding the patterns lets you pick the right one. Most production agents use 2-3 composed patterns, not a framework's default.",
          estHours: 4,
          tasks: [
            "Read Anthropic's 'Building effective agents' article and diagram all 5 patterns: prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer",
            "Implement a ReAct agent from scratch: the model reasons in <thinking> tags, selects a tool, observes the result, and loops until it has the answer — with a max-step budget of 10",
            "Build a routing agent: given a user query, classify it into one of 3 categories and dispatch to a specialized prompt — measure accuracy on 20 test queries",
            "Implement the evaluator-optimizer pattern: an agent generates a response, a second LLM call critiques it, and the agent revises — compare output quality vs single-pass",
            "Write a decision guide: given a task description, which pattern(s) would you combine? Test on 5 real-world scenarios",
          ],
          resources: [
            {
              title: "Building effective agents — Anthropic",
              url: "https://www.anthropic.com/research/building-effective-agents",
              type: "article",
              note: "The most important article — read it twice",
            },
            {
              title: "ReAct: Synergizing Reasoning and Acting (paper)",
              url: "https://arxiv.org/abs/2210.03629",
              type: "article",
            },
            {
              title: "Prompt Engineering Guide — agents section",
              url: "https://www.promptingguide.ai/research/llm-agents",
              type: "article",
            },
            {
              title: "LLM Powered Autonomous Agents — Lilian Weng",
              url: "https://lilianweng.github.io/posts/2023-06-23-agent/",
              type: "article",
              note: "The definitive technical blog post on agent architectures",
            },
            {
              title: "AI Agents in LangGraph — DeepLearning.AI short course",
              url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/",
              type: "course",
            },
            {
              title: "What are AI Agents? — Matt Berman",
              url: "https://www.youtube.com/watch?v=F_Bi_1OMDJA",
              type: "video",
            },
            {
              title: "Awesome AI Agents — curated repo of agent projects",
              url: "https://github.com/e2b-dev/awesome-ai-agents",
              type: "practice",
              note: "Study real agent implementations for pattern recognition",
            },
          ],
          projectSlugs: ["enterprise-agent"],
        },
        {
          slug: "agent-state-and-memory",
          title: "State & Memory Management",
          summary:
            "Conversation context, working memory, summarization strategies, persistent memory stores, and context window optimization.",
          why: "Agents that forget fail. Memory architecture determines what tasks an agent can handle beyond a single exchange.",
          estHours: 4,
          row: 1,
          tasks: [
            "Implement a sliding-window memory: keep the last N messages in context, summarize older messages into a running summary, and prepend it as system context",
            "Build a scratchpad pattern: the agent writes intermediate results to a structured working memory (JSON object) that persists across tool calls within a task",
            "Implement persistent memory with a vector store: after each conversation, extract key facts, embed them, and retrieve relevant memories at the start of new conversations",
            "Measure the impact: run the same 10-step task with full context, summarized context, and no memory — compare completion rate and accuracy",
          ],
          resources: [
            {
              title: "Extended thinking — Claude docs",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking",
              type: "docs",
            },
            {
              title: "Prompt caching for long conversations — Anthropic",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching",
              type: "docs",
            },
            {
              title: "MemGPT: Towards LLMs as Operating Systems (paper)",
              url: "https://arxiv.org/abs/2310.08560",
              type: "article",
            },
            {
              title: "Building Long-Term Memory for AI Agents — AI Jason",
              url: "https://www.youtube.com/watch?v=bMiMOBOjDiM",
              type: "video",
            },
            {
              title: "Cognitive Architectures for Language Agents (CoALA paper)",
              url: "https://arxiv.org/abs/2309.02427",
              type: "article",
              note: "Formal framework for agent memory: working, episodic, semantic, and procedural",
            },
            {
              title: "LangChain — conversational memory types",
              url: "https://python.langchain.com/docs/how_to/#memory",
              type: "docs",
            },
            {
              title: "Building AI Agent memory systems — Dave Ebbelaar",
              url: "https://www.youtube.com/watch?v=6cKmSseDGBM",
              type: "video",
            },
          ],
        },
      ],
    },
    {
      title: "MCP & Tool Ecosystem",
      nodes: [
        {
          slug: "agent-mcp-protocol",
          title: "Model Context Protocol",
          summary:
            "Resources, tools, prompts, transports (stdio, SSE, streamable HTTP), protocol lifecycle, authentication, and the MCP specification.",
          why: "MCP is becoming the USB-C of AI tools — a standard interface between models and the systems they interact with.",
          estHours: 4,
          tasks: [
            "Read the MCP specification end to end — draw a sequence diagram showing the full lifecycle: initialization, capability negotiation, tool listing, tool invocation, and shutdown",
            "Compare the 3 transport types (stdio, SSE, streamable HTTP): implement a hello-world MCP server using stdio transport in Python",
            "Read the MCP authorization spec and explain how OAuth 2.0 integration works for remote MCP servers",
            "Set up 2 existing MCP servers from the ecosystem (e.g., filesystem, GitHub) in Claude Desktop and test them on real tasks",
          ],
          resources: [
            {
              title: "Model Context Protocol — specification",
              url: "https://modelcontextprotocol.io/",
              type: "docs",
              note: "The full spec — read the architecture and core sections",
            },
            {
              title: "MCP Python SDK",
              url: "https://github.com/modelcontextprotocol/python-sdk",
              type: "docs",
            },
            {
              title: "MCP servers directory",
              url: "https://github.com/modelcontextprotocol/servers",
              type: "docs",
            },
            {
              title: "What is MCP? Model Context Protocol Explained — AI Jason",
              url: "https://www.youtube.com/watch?v=J47JDDwMrfM",
              type: "video",
            },
            {
              title: "MCP: The USB-C of AI — Simon Willison",
              url: "https://simonwillison.net/2024/Apr/17/model-context-protocol/",
              type: "article",
            },
            {
              title: "Building MCP servers — Anthropic engineering blog",
              url: "https://www.anthropic.com/engineering/model-context-protocol",
              type: "article",
            },
            {
              title: "MCP specification — deep dive into transports",
              url: "https://modelcontextprotocol.io/docs/concepts/transports",
              type: "docs",
            },
          ],
          projectSlugs: ["mcp-tool-server"],
        },
        {
          slug: "agent-mcp-building",
          title: "Building MCP Servers & Clients",
          summary:
            "Creating MCP servers in Python/TypeScript, building host applications, tool routing, server management, and testing strategies.",
          why: "Building an MCP server teaches you both sides of the protocol and makes you dangerous with any MCP-compatible client.",
          estHours: 4,
          row: 1,
          tasks: [
            "Build an MCP server in Python that exposes 3 tools: a database query tool, a file search tool, and a summarization tool — test with the MCP inspector",
            "Build the same server in TypeScript using the MCP TS SDK — compare the developer experience and note the differences",
            "Implement a custom MCP client/host that connects to your server, lists available tools, and routes tool calls from an LLM conversation",
            "Add authentication to your MCP server: require an API key header, return proper error responses for unauthorized requests",
          ],
          resources: [
            {
              title: "Building MCP servers — quickstart",
              url: "https://modelcontextprotocol.io/quickstart/server",
              type: "docs",
            },
            {
              title: "Building MCP clients — quickstart",
              url: "https://modelcontextprotocol.io/quickstart/client",
              type: "docs",
            },
            {
              title: "MCP TypeScript SDK",
              url: "https://github.com/modelcontextprotocol/typescript-sdk",
              type: "docs",
            },
            {
              title: "Build Your Own MCP Server — step-by-step tutorial",
              url: "https://modelcontextprotocol.io/tutorials/building-mcp-with-llms",
              type: "practice",
              note: "Official tutorial for building a server using LLM assistance",
            },
            {
              title: "MCP Inspector — test and debug MCP servers",
              url: "https://modelcontextprotocol.io/docs/tools/inspector",
              type: "practice",
            },
            {
              title: "Building MCP Servers in Python — James Briggs",
              url: "https://www.youtube.com/watch?v=PsGC5eqnVAg",
              type: "video",
            },
            {
              title: "MCP client implementation guide",
              url: "https://modelcontextprotocol.io/docs/concepts/clients",
              type: "docs",
            },
          ],
          projectSlugs: ["mcp-tool-server"],
        },
      ],
    },
    {
      title: "Agent Frameworks",
      nodes: [
        {
          slug: "agent-langgraph-crewai",
          title: "LangGraph & CrewAI",
          summary:
            "LangGraph state machines and checkpointing, CrewAI role-based agents, AutoGen conversation patterns — when to use each framework. For full deep-dives, see the standalone LangGraph and CrewAI roadmaps.",
          why: "Frameworks trade flexibility for speed. Knowing what they abstract away lets you choose wisely and debug effectively.",
          estHours: 4,
          tasks: [
            "Build a simple agent in LangGraph: define a state graph with tool-calling and conditional edges, implement checkpointing for resume-on-failure",
            "Build the same agent in CrewAI: define a crew with 2 agents (researcher + writer), assign roles and tools, and run a multi-step task",
            "Read the AutoGen architecture docs and implement a 2-agent conversation where agents debate and converge on an answer",
            "Write a comparison table: LangGraph vs CrewAI vs AutoGen vs raw API — evaluate on flexibility, debugging ease, production readiness, and learning curve",
          ],
          resources: [
            {
              title: "LangGraph — official docs",
              url: "https://langchain-ai.github.io/langgraph/",
              type: "docs",
              note: "Focus on the concepts: state, nodes, edges, checkpointing",
            },
            {
              title: "CrewAI — official docs",
              url: "https://docs.crewai.com/",
              type: "docs",
            },
            {
              title: "AutoGen — Microsoft research",
              url: "https://microsoft.github.io/autogen/",
              type: "docs",
            },
            {
              title: "AI Agents in LangGraph — DeepLearning.AI short course",
              url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/",
              type: "course",
              note: "Hands-on course by the LangChain team — builds agents step by step",
            },
            {
              title: "Multi AI Agent Systems with CrewAI — DeepLearning.AI",
              url: "https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/",
              type: "course",
            },
            {
              title: "LangGraph vs CrewAI vs AutoGen — AI Jason comparison",
              url: "https://www.youtube.com/watch?v=1mz6RzdcnM4",
              type: "video",
            },
            {
              title: "LangGraph quickstart tutorial",
              url: "https://langchain-ai.github.io/langgraph/tutorials/introduction/",
              type: "practice",
            },
          ],
          projectSlugs: ["framework-comparison"],
        },
        {
          slug: "agent-claude-sdk",
          title: "Claude Agent SDK",
          summary:
            "Anthropic's Agent SDK for building custom agents, tool registration, agent composition, guardrails, and comparing with raw API approaches.",
          why: "The official SDK encodes Anthropic's best practices for agent construction — learn what opinions it bakes in and why.",
          estHours: 4,
          row: 1,
          tasks: [
            "Read the Claude Agent SDK docs and build a simple agent: register 2 tools, define guardrails, and run a multi-step task",
            "Implement agent handoffs: a triage agent routes to a specialist agent based on the query type — use the SDK's built-in handoff patterns",
            "Compare your raw API agent (from the Agent Loop stage) with the SDK version: lines of code, error handling coverage, and behavior on edge cases",
            "Build a custom tool provider that wraps an existing REST API as SDK-compatible tools — test with real API calls",
          ],
          resources: [
            {
              title: "Claude Agent SDK — Anthropic docs",
              url: "https://docs.anthropic.com/en/docs/agents-and-tools/agent-sdk",
              type: "docs",
            },
            {
              title: "Agent SDK examples — Anthropic cookbook",
              url: "https://github.com/anthropics/anthropic-cookbook",
              type: "docs",
            },
            {
              title: "Claude Code internals — reference architecture",
              url: "https://www.anthropic.com/engineering/claude-code-best-practices",
              type: "article",
              note: "A production agent built on these patterns",
            },
            {
              title: "Building AI Agents from Scratch — DeepLearning.AI",
              url: "https://www.deeplearning.ai/short-courses/ai-agentic-design-patterns-with-autogen/",
              type: "course",
            },
            {
              title: "Build an Agent with the Claude API — Anthropic tutorial",
              url: "https://docs.anthropic.com/en/docs/agents-and-tools/overview",
              type: "practice",
            },
            {
              title: "AI Agent Frameworks Compared — Matt Berman",
              url: "https://www.youtube.com/watch?v=yY4gMhDzONE",
              type: "video",
            },
          ],
          projectSlugs: ["multi-agent-pipeline"],
        },
      ],
    },
    {
      title: "Enterprise Patterns",
      nodes: [
        {
          slug: "agent-guardrails-safety",
          title: "Guardrails & Safety",
          summary:
            "Input/output validation, prompt injection defense, PII filtering, content moderation, sandboxing tool execution, and permission models.",
          why: "An agent without guardrails is a liability. Enterprise deployment demands defense-in-depth before anything goes to production.",
          estHours: 4,
          tasks: [
            "Implement input guardrails: a pre-processing step that detects prompt injection attempts using a classifier LLM call — test against 10 known injection patterns",
            "Build output guardrails: validate agent responses against a content policy (no PII leakage, no harmful content) using a separate LLM-as-judge call",
            "Implement a permission model for tools: destructive actions (delete, write, send) require explicit user confirmation before execution",
            "Read the OWASP Top 10 for LLM applications and implement mitigations for the top 3 risks relevant to agents (injection, insecure output, excessive agency)",
          ],
          resources: [
            {
              title: "OWASP Top 10 for LLM applications",
              url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
              type: "docs",
            },
            {
              title: "Prompt injection primer — Simon Willison",
              url: "https://simonwillison.net/series/prompt-injection/",
              type: "article",
            },
            {
              title: "Guardrails for agents — Anthropic cookbook",
              url: "https://github.com/anthropics/anthropic-cookbook",
              type: "docs",
            },
            {
              title: "Prompt Injection Explained — Simon Willison's blog",
              url: "https://simonwillison.net/2023/Apr/14/worst-that-can-happen/",
              type: "article",
              note: "Real-world prompt injection examples and defense strategies",
            },
            {
              title: "Red-Teaming LLM Applications — DeepLearning.AI",
              url: "https://www.deeplearning.ai/short-courses/red-teaming-llm-applications/",
              type: "course",
            },
            {
              title: "AI Safety & Alignment — Matt Berman overview",
              url: "https://www.youtube.com/watch?v=pYXy-A4siMw",
              type: "video",
            },
            {
              title: "Guardrails AI — open-source validation framework",
              url: "https://github.com/guardrails-ai/guardrails",
              type: "practice",
              note: "Study the validation patterns even if you build your own",
            },
          ],
          projectSlugs: ["enterprise-agent"],
        },
        {
          slug: "agent-agentic-rag",
          title: "Agentic RAG",
          summary:
            "Agent-driven retrieval with query decomposition, iterative search, self-grading retrieval, citation verification, and multi-source synthesis.",
          why: "Naive RAG hits a ceiling. Agentic RAG — where the agent decides what to search, evaluates results, and re-queries — is how production knowledge systems work.",
          estHours: 4,
          row: 1,
          tasks: [
            "Build a basic RAG agent: the agent has a 'search' tool backed by a vector store — it formulates queries, evaluates retrieved chunks for relevance, and re-queries if unsatisfied",
            "Implement query decomposition: for complex questions, the agent breaks them into sub-queries, retrieves for each, and synthesizes the final answer",
            "Add citation verification: after generating an answer, the agent checks each claim against the retrieved sources and flags unsupported statements",
            "Compare naive RAG (single query → top-k → generate) vs agentic RAG on 10 multi-hop questions — measure answer accuracy and source relevance",
          ],
          resources: [
            {
              title: "RAG chapter — Chip Huyen's AI Engineering notes",
              url: "https://huyenchip.com/2023/10/10/multimodal.html",
              type: "article",
            },
            {
              title: "Adaptive RAG (paper)",
              url: "https://arxiv.org/abs/2403.14403",
              type: "article",
            },
            {
              title: "LangGraph RAG tutorial",
              url: "https://langchain-ai.github.io/langgraph/tutorials/rag/langgraph_adaptive_rag/",
              type: "docs",
            },
            {
              title: "Building and Evaluating Advanced RAG — DeepLearning.AI",
              url: "https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/",
              type: "course",
            },
            {
              title: "Agentic RAG with LlamaIndex — DeepLearning.AI",
              url: "https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/",
              type: "course",
            },
            {
              title: "RAG from scratch — LangChain YouTube series",
              url: "https://www.youtube.com/playlist?list=PLfaIDFEXuae2LXbO1_PKyVJiQ23CLFamk",
              type: "video",
              note: "14-part series building RAG systems from fundamentals",
            },
            {
              title: "LlamaIndex — agentic RAG documentation",
              url: "https://docs.llamaindex.ai/en/stable/",
              type: "docs",
            },
          ],
          projectSlugs: ["agentic-rag-pipeline"],
        },
        {
          slug: "agent-human-in-loop",
          title: "Human-in-the-Loop",
          summary:
            "Approval gates, escalation policies, feedback collection, streaming intermediate results, and audit trails for agent actions.",
          why: "Enterprise agents always have a human somewhere in the loop. Designing for oversight is what separates prototypes from production.",
          estHours: 4,
          row: 1,
          tasks: [
            "Implement an approval gate: before executing any tool marked 'requires_approval', pause execution, present the planned action to the user, and wait for confirmation",
            "Build an escalation policy: if the agent's confidence is below a threshold (measured via self-assessment), escalate to a human with full context",
            "Implement streaming intermediate results: as the agent works through a multi-step task, stream each step's reasoning and tool results to the UI in real-time",
            "Build an audit trail: log every agent decision (tool selected, input, output, reasoning) to a structured JSON log that can be reviewed after the fact",
          ],
          resources: [
            {
              title: "Human-in-the-loop patterns — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/",
              type: "docs",
            },
            {
              title: "Streaming — Claude docs",
              url: "https://docs.anthropic.com/en/api/messages-streaming",
              type: "docs",
            },
            {
              title: "Building effective agents — Anthropic (orchestration section)",
              url: "https://www.anthropic.com/research/building-effective-agents",
              type: "article",
            },
            {
              title: "Human-in-the-Loop Agent Patterns — LangGraph tutorial",
              url: "https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/",
              type: "practice",
            },
            {
              title: "Building Production AI Agents — AI Engineer talk",
              url: "https://www.youtube.com/watch?v=2sIPsv3fDlQ",
              type: "video",
            },
            {
              title: "Designing Human-AI Collaboration — Chip Huyen",
              url: "https://huyenchip.com/2024/01/14/ai-engineering.html",
              type: "article",
              note: "Covers the spectrum from full automation to human-in-the-loop",
            },
          ],
          projectSlugs: ["multi-agent-pipeline"],
        },
      ],
    },
    {
      title: "Production & Reliability",
      nodes: [
        {
          slug: "agent-multi-agent-orchestration",
          title: "Multi-Agent Orchestration",
          summary:
            "Supervisor/worker patterns, agent delegation, shared state, agent-to-agent communication, and handoff protocols.",
          why: "Complex tasks often exceed what one agent can handle. Multi-agent systems decompose work but introduce coordination challenges you need to solve.",
          estHours: 4,
          tasks: [
            "Build a supervisor agent that breaks a complex task into subtasks and delegates each to a specialist worker agent — collect and synthesize the results",
            "Implement agent handoffs: the supervisor passes conversation context to a specialist, the specialist completes its part, and hands back to the supervisor with results",
            "Build shared state: multiple agents read/write to a common state object (e.g., a research brief) — handle concurrent access and conflicts",
            "Implement a debate pattern: two agents argue opposing positions on a question, a judge agent evaluates the arguments and declares a winner with reasoning",
          ],
          resources: [
            {
              title: "Multi-agent systems — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/",
              type: "docs",
            },
            {
              title: "Claude Agent SDK — multi-agent patterns",
              url: "https://docs.anthropic.com/en/docs/agents-and-tools/agent-sdk",
              type: "docs",
            },
            {
              title: "CrewAI — multi-agent orchestration",
              url: "https://docs.crewai.com/",
              type: "docs",
            },
            {
              title: "Multi AI Agent Systems with CrewAI — DeepLearning.AI",
              url: "https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/",
              type: "course",
              note: "Hands-on course building supervisor/worker multi-agent systems",
            },
            {
              title: "Building Multi-Agent Systems — AI Jason",
              url: "https://www.youtube.com/watch?v=2aVF9qSXsfA",
              type: "video",
            },
            {
              title: "Multi-agent debate and collaboration patterns — LangGraph tutorial",
              url: "https://langchain-ai.github.io/langgraph/tutorials/multi_agent/",
              type: "practice",
            },
            {
              title: "A Survey on LLM-based Multi-Agent Systems (paper)",
              url: "https://arxiv.org/abs/2402.01680",
              type: "article",
            },
          ],
          projectSlugs: ["multi-agent-pipeline"],
        },
        {
          slug: "agent-observability-eval",
          title: "Observability & Evaluation",
          summary:
            "LLM tracing, structured logging, cost tracking, agent eval frameworks, trajectory evaluation, and regression testing for multi-step workflows.",
          why: "You can't improve what you can't measure. Agent observability is how you go from 'it works sometimes' to 'it works reliably.'",
          estHours: 4,
          row: 1,
          tasks: [
            "Set up Langfuse (or LangSmith) tracing for an agent: instrument every LLM call, tool invocation, and decision point — visualize a full agent trace",
            "Build a cost tracker: log input/output tokens per step, compute total cost per task, and set budget alerts that terminate the agent if exceeded",
            "Create an agent eval suite: define 15 tasks with success criteria (e.g., 'file created with correct content', 'answer matches expected'), run the agent, and compute pass rate",
            "Implement trajectory evaluation: for a multi-step task, evaluate not just the final output but whether each intermediate step was reasonable (LLM-as-judge per step)",
          ],
          resources: [
            {
              title: "Langfuse — open-source LLM observability",
              url: "https://langfuse.com/docs",
              type: "docs",
            },
            {
              title: "Your AI product needs evals — Hamel Husain",
              url: "https://hamel.dev/blog/posts/evals/",
              type: "article",
            },
            {
              title: "Define success criteria — Claude docs",
              url: "https://docs.claude.com/en/docs/test-and-evaluate/define-success",
              type: "docs",
            },
            {
              title: "LLM Evaluation & Testing — DeepLearning.AI short course",
              url: "https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/",
              type: "course",
            },
            {
              title: "Langfuse — tracing and observability quickstart",
              url: "https://langfuse.com/docs/get-started",
              type: "practice",
            },
            {
              title: "LLM App Evaluation — AI Engineer talk",
              url: "https://www.youtube.com/watch?v=r-HUnht-Gns",
              type: "video",
            },
            {
              title: "Braintrust — eval framework for LLM apps",
              url: "https://www.braintrustdata.com/docs",
              type: "docs",
              note: "Alternative to Langfuse — good eval primitives",
            },
          ],
          projectSlugs: ["agent-eval-suite"],
        },
        {
          slug: "agent-deployment-scale",
          title: "Deployment at Scale",
          summary:
            "Queue-based agent execution, error recovery and retry strategies, fallback models, rate limiting, containerized deployment, and production monitoring.",
          why: "A demo agent runs in a notebook. A production agent needs queues, retries, fallbacks, and monitoring — this is where engineering meets AI.",
          estHours: 4,
          row: 1,
          tasks: [
            "Deploy an agent behind a FastAPI endpoint with async execution: the client submits a task, gets a task ID, and polls for results — the agent runs in a background worker",
            "Implement retry with exponential backoff: when an LLM call fails (rate limit, timeout, server error), retry with increasing delays and fall back to a smaller model after 3 failures",
            "Add rate limiting: cap concurrent agent executions per user, queue excess requests, and return meaningful status updates while tasks wait",
            "Containerize your agent with Docker: health checks, graceful shutdown (finish current step before stopping), and environment-based configuration for API keys and model selection",
            "Build a production monitoring dashboard: track task completion rate, average cost per task, P95 latency, and error rate over time",
          ],
          resources: [
            {
              title: "FastAPI background tasks and workers",
              url: "https://fastapi.tiangolo.com/tutorial/background-tasks/",
              type: "docs",
            },
            {
              title: "Claude API rate limits and error handling",
              url: "https://docs.anthropic.com/en/api/rate-limits",
              type: "docs",
            },
            {
              title: "Production best practices — Anthropic docs",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
              type: "docs",
            },
            {
              title: "Designing Machine Learning Systems (book) — Chip Huyen",
              url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/",
              type: "book",
              note: "Chapters on deployment, monitoring, and reliability apply directly to agent systems",
            },
            {
              title: "Deploying AI Agents to Production — Dave Ebbelaar",
              url: "https://www.youtube.com/watch?v=Gc0fGwdCDGs",
              type: "video",
            },
            {
              title: "Modal — serverless agent deployment platform",
              url: "https://modal.com/docs/guide",
              type: "docs",
              note: "Useful for queue-based async agent execution without managing infra",
            },
            {
              title: "Building AI Products — Chip Huyen on production patterns",
              url: "https://huyenchip.com/2024/01/14/ai-engineering.html",
              type: "article",
            },
          ],
          projectSlugs: ["enterprise-agent"],
        },
      ],
    },
  ],
};
