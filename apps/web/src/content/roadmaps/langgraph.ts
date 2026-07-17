import type { Roadmap } from "../types";

export const langgraphRoadmap: Roadmap = {
  pillar: "langgraph",
  title: "LangGraph — Fundamentals to Production Agents",
  description:
    "StateGraph fundamentals → tool-calling agents → persistence → human-in-the-loop → multi-agent → streaming → production deployment. Learn the graph model deeply, then ship durable agents.",
  stages: [
    {
      title: "Graph Fundamentals",
      nodes: [
        {
          slug: "lg-graph-fundamentals",
          title: "StateGraph, Nodes & Edges",
          summary:
            "Build and compile your first StateGraph: nodes as functions, normal edges, START/END, invoke vs stream — LangGraph's core execution model.",
          why: "Everything in LangGraph is a graph. If you can't reason about nodes, edges, and supersteps, every later abstraction stays magic.",
          estHours: 4,
          tasks: [
            "Install langgraph and build a 3-node StateGraph (classify → route → respond) with add_node, add_edge, START, and END — compile and invoke it",
            "Draw the compiled graph with graph.get_graph().draw_mermaid() and verify the topology matches your mental model",
            "Compare .invoke() vs .stream() on the same graph and inspect what each superstep emits",
            "Deliberately create a graph with a dead-end node (no path to END) and observe the compile-time/runtime behavior",
            "Rebuild one of your existing scripted LLM pipelines as a StateGraph and note what got clearer",
          ],
          resources: [
            {
              title: "LangGraph — Graph API concepts (low level)",
              url: "https://langchain-ai.github.io/langgraph/concepts/low_level/",
              type: "docs",
              note: "The single most important page — read it twice",
            },
            {
              title: "LangGraph quickstart",
              url: "https://docs.langchain.com/oss/python/langgraph/quickstart",
              type: "docs",
            },
            {
              title: "Introduction to LangGraph — LangChain Academy",
              url: "https://academy.langchain.com/courses/intro-to-langgraph",
              type: "course",
              note: "Free official course — Module 1 covers graphs and state",
            },
            {
              title: "Graph API how-tos",
              url: "https://langchain-ai.github.io/langgraph/how-tos/graph-api/",
              type: "docs",
            },
          ],
        },
        {
          slug: "lg-state-reducers",
          title: "State Schemas & Reducers",
          summary:
            "TypedDict/Pydantic state, reducer functions, add_messages, and MessagesState — how state accumulates across nodes instead of being overwritten.",
          why: "State design is agent design. Reducers are the difference between a conversation that accumulates and one that silently drops messages.",
          estHours: 4,
          row: 1,
          tasks: [
            "Define a state schema with TypedDict and observe default overwrite behavior when two nodes write the same key",
            "Add an Annotated reducer (operator.add) to a list field and verify appends instead of overwrites",
            "Rebuild the same state with add_messages and MessagesState — send a message with an existing id and confirm it updates in place",
            "Use a Pydantic model as state schema and trigger a validation error from a node's return value",
            "Write a custom reducer that deduplicates items by id and test it with parallel node writes",
          ],
          resources: [
            {
              title: "State schemas and reducers — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/low_level/#state",
              type: "docs",
            },
            {
              title: "LangChain Academy — State and Memory module",
              url: "https://academy.langchain.com/courses/intro-to-langgraph",
              type: "course",
            },
            {
              title: "add_messages reference",
              url: "https://langchain-ai.github.io/langgraph/reference/graphs/",
              type: "docs",
            },
            {
              title: "LangGraph state management patterns — blog",
              url: "https://blog.langchain.dev/langgraph/",
              type: "article",
            },
          ],
        },
        {
          slug: "lg-conditional-routing",
          title: "Conditional Edges & Command",
          summary:
            "Dynamic routing with conditional edges, the Command return type for combined state-update-plus-goto, loops, and recursion limits.",
          why: "Agents are loops with decisions. Conditional edges and Command are how a graph decides what happens next at runtime.",
          estHours: 3,
          tasks: [
            "Add a conditional edge that routes to different nodes based on an LLM classification of the input",
            "Rewrite the same routing using Command(goto=..., update=...) returned from a node — compare readability",
            "Build a loop (draft → critique → revise) that exits when a quality check passes, and hit the default recursion limit on purpose",
            "Raise the recursion_limit via config and add your own loop counter in state as a safety rail",
          ],
          resources: [
            {
              title: "Conditional edges — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/low_level/#conditional-edges",
              type: "docs",
            },
            {
              title: "Command — combining control flow and state updates",
              url: "https://langchain-ai.github.io/langgraph/concepts/low_level/#command",
              type: "docs",
              note: "Command is the modern idiom — many older tutorials predate it",
            },
            {
              title: "Recursion limit how-to",
              url: "https://langchain-ai.github.io/langgraph/how-tos/graph-api/#impose-a-recursion-limit",
              type: "docs",
            },
          ],
        },
      ],
    },
    {
      title: "Tool-Calling Agents",
      nodes: [
        {
          slug: "lg-prebuilt-react-agent",
          title: "create_react_agent & ToolNode",
          summary:
            "Ship a tool-calling agent in a few lines with the prebuilt create_react_agent, ToolNode, and tools_condition.",
          why: "The prebuilt agent is the 80% case and the production baseline. Know exactly what it gives you before you customize.",
          estHours: 4,
          tasks: [
            "Build a create_react_agent with two tools (web search + calculator) and a system prompt — trace a multi-tool conversation",
            "Inspect the prebuilt graph with get_graph() and identify the agent node, ToolNode, and the conditional edge between them",
            "Add a structured response_format so the agent returns a validated Pydantic object as its final answer",
            "Break a tool on purpose (raise an exception) and observe how ToolNode surfaces the error back to the model",
            "Swap the model (e.g. Haiku vs Sonnet) and measure the difference in tool-call accuracy and cost on 10 test queries",
          ],
          resources: [
            {
              title: "Prebuilt agents reference — create_react_agent",
              url: "https://langchain-ai.github.io/langgraph/reference/prebuilt/",
              type: "docs",
            },
            {
              title: "Agentic concepts — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/agentic_concepts/",
              type: "docs",
            },
            {
              title: "AI Agents in LangGraph — DeepLearning.AI",
              url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/",
              type: "course",
              note: "Taught by Harrison Chase — short and practical",
            },
            {
              title: "Tool calling how-tos",
              url: "https://langchain-ai.github.io/langgraph/how-tos/tool-calling/",
              type: "docs",
            },
          ],
        },
        {
          slug: "lg-custom-agent-loop",
          title: "Agent Loop from Scratch",
          summary:
            "Rebuild the ReAct loop yourself with a StateGraph: model node → conditional edge → tool node → back — so the prebuilt is never a black box.",
          why: "Production agents always outgrow the prebuilt. When they do, you need to own the loop: custom routing, fallbacks, and per-tool logic.",
          estHours: 4,
          row: 1,
          tasks: [
            "Implement the ReAct loop manually: an LLM node that binds tools, a router checking tool_calls on the last message, and a tool-execution node",
            "Add a max-iterations guard in state that forces a final answer after N tool rounds",
            "Insert a custom node between tool execution and the model that summarizes long tool outputs before they re-enter context",
            "Add per-tool error handling: retry transient failures, but route validation errors back to the model with guidance",
            "Diff your graph against create_react_agent's and write down what the prebuilt handles that you missed",
          ],
          resources: [
            {
              title: "Build an agent from scratch — LangGraph how-to",
              url: "https://langchain-ai.github.io/langgraph/how-tos/react-agent-from-scratch/",
              type: "docs",
            },
            {
              title: "ReAct paper — Reasoning and Acting in LLMs",
              url: "https://arxiv.org/abs/2210.03629",
              type: "article",
              note: "The pattern every tool-loop descends from",
            },
            {
              title: "LangChain Academy — Agent module",
              url: "https://academy.langchain.com/courses/intro-to-langgraph",
              type: "course",
            },
            {
              title: "langgraph GitHub — examples directory",
              url: "https://github.com/langchain-ai/langgraph/tree/main/examples",
              type: "practice",
            },
          ],
        },
      ],
    },
    {
      title: "Persistence & Memory",
      nodes: [
        {
          slug: "lg-checkpointers",
          title: "Checkpointers & Threads",
          summary:
            "Durable execution with checkpointers: InMemorySaver for dev, PostgresSaver for prod, thread_id config, and resuming conversations across restarts.",
          why: "Persistence is what separates a demo from a product. Checkpointers give you multi-turn memory, crash recovery, and the foundation for human-in-the-loop.",
          estHours: 4,
          tasks: [
            "Compile a graph with InMemorySaver, run two turns on the same thread_id, and confirm the second turn sees the first's messages",
            "Swap in PostgresSaver against a local Postgres, run .setup(), and inspect the checkpoint tables it creates",
            "Kill the process mid-run and resume the same thread_id — verify the conversation survives",
            "Use get_state() and get_state_history() to inspect a thread's checkpoints programmatically",
            "Run the same graph on two different thread_ids and confirm complete isolation",
          ],
          resources: [
            {
              title: "Persistence concepts — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/persistence/",
              type: "docs",
              note: "Checkpoints, threads, state history — foundational for everything after",
            },
            {
              title: "langgraph-checkpoint-postgres",
              url: "https://github.com/langchain-ai/langgraph/tree/main/libs/checkpoint-postgres",
              type: "docs",
            },
            {
              title: "Add persistence how-to",
              url: "https://langchain-ai.github.io/langgraph/how-tos/persistence/",
              type: "docs",
            },
            {
              title: "LangChain Academy — Memory module",
              url: "https://academy.langchain.com/courses/intro-to-langgraph",
              type: "course",
            },
          ],
        },
        {
          slug: "lg-long-term-memory",
          title: "Long-Term Memory & Store",
          summary:
            "Cross-thread memory with the BaseStore/PostgresStore interface: namespaces, semantic search over memories, and agents that write their own memories.",
          why: "Threads remember a conversation; the Store remembers the user. Long-term memory is what makes an agent feel like it knows you.",
          estHours: 3,
          row: 1,
          tasks: [
            "Add an InMemoryStore to a graph and write user preferences into a (user_id, 'memories') namespace from inside a node",
            "Read those memories back in a different thread for the same user and inject them into the system prompt",
            "Enable semantic search on the store with an embedding config and query memories by similarity",
            "Build a memory-writing agent: after each conversation, it decides what (if anything) is worth persisting about the user",
            "Swap InMemoryStore for PostgresStore and verify memories survive a restart",
          ],
          resources: [
            {
              title: "Memory concepts — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/memory/",
              type: "docs",
              note: "Distinguishes thread-scoped vs cross-thread memory clearly",
            },
            {
              title: "LangMem — memory utilities for agents",
              url: "https://github.com/langchain-ai/langmem",
              type: "practice",
            },
            {
              title: "Cross-thread persistence how-to",
              url: "https://langchain-ai.github.io/langgraph/how-tos/cross-thread-persistence/",
              type: "docs",
            },
          ],
        },
      ],
    },
    {
      title: "Human-in-the-Loop",
      nodes: [
        {
          slug: "lg-human-in-the-loop",
          title: "Interrupts & Approval Gates",
          summary:
            "Pause graphs mid-run with interrupt(), resume with Command(resume=...), static breakpoints — approve/edit/reject patterns for risky tool calls.",
          why: "No one ships an agent that sends emails or moves money without an approval gate. Interrupts are LangGraph's killer production feature.",
          estHours: 4,
          tasks: [
            "Call interrupt() inside a node to pause before a destructive tool call, then resume with Command(resume={'approved': True})",
            "Build the full approve/edit/reject pattern: human can approve the tool call, edit its arguments, or reject with feedback the model sees",
            "Set a static breakpoint with interrupt_before on a node and step through execution manually",
            "Wire the interrupt payload into a tiny CLI prompt so a human can actually respond, and persist the pause across a process restart via the checkpointer",
          ],
          resources: [
            {
              title: "Human-in-the-loop concepts — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/",
              type: "docs",
              note: "interrupt() + Command(resume=...) is the modern API",
            },
            {
              title: "Human-in-the-loop how-tos",
              url: "https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/add-human-in-the-loop/",
              type: "docs",
            },
            {
              title: "LangChain Academy — Human-in-the-loop module",
              url: "https://academy.langchain.com/courses/intro-to-langgraph",
              type: "course",
            },
          ],
        },
        {
          slug: "lg-time-travel",
          title: "Time Travel & State Editing",
          summary:
            "Replay from any checkpoint, fork alternate histories with update_state, inspect state history — the debugging superpowers persistence unlocks.",
          why: "When an agent goes wrong on step 7 of 12, time travel lets you rewind, fix, and replay instead of rerunning (and re-paying for) everything.",
          estHours: 3,
          row: 1,
          tasks: [
            "Run a multi-step graph, list its checkpoints with get_state_history(), and re-invoke from a mid-run checkpoint_id",
            "Use update_state() to edit a past state (e.g. correct a bad tool result) and fork a new execution branch from it",
            "Compare the two branches' final outputs to confirm the fork diverged where you edited",
            "Build a tiny 'replay debugger' script: given a thread_id, print each checkpoint's writes step by step",
          ],
          resources: [
            {
              title: "Time travel concepts — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/time-travel/",
              type: "docs",
            },
            {
              title: "Time travel how-to",
              url: "https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/time-travel/",
              type: "docs",
            },
            {
              title: "LangGraph state history reference",
              url: "https://langchain-ai.github.io/langgraph/reference/graphs/",
              type: "docs",
            },
          ],
        },
      ],
    },
    {
      title: "Multi-Agent Patterns",
      nodes: [
        {
          slug: "lg-subgraphs",
          title: "Subgraphs",
          summary:
            "Graphs as nodes: shared vs transformed state schemas, encapsulating agent teams, and how streaming and persistence behave across subgraph boundaries.",
          why: "Subgraphs are how you scale a codebase of agents — each team owns its graph, and the parent composes them like functions.",
          estHours: 3,
          tasks: [
            "Add a compiled subgraph directly as a node when parent and child share state keys",
            "Wrap a subgraph in a function that transforms parent state to child state and back when schemas differ",
            "Stream the parent with subgraphs=True and observe namespaced events from inside the subgraph",
            "Verify checkpointing captures subgraph state by interrupting inside a subgraph and resuming",
          ],
          resources: [
            {
              title: "Subgraphs concepts — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/subgraphs/",
              type: "docs",
            },
            {
              title: "Subgraph how-tos",
              url: "https://langchain-ai.github.io/langgraph/how-tos/subgraph/",
              type: "docs",
            },
            {
              title: "LangChain Academy — Deployment & subgraphs modules",
              url: "https://academy.langchain.com/courses/intro-to-langgraph",
              type: "course",
            },
          ],
        },
        {
          slug: "lg-multi-agent-architectures",
          title: "Supervisor, Swarm & Handoffs",
          summary:
            "The multi-agent design space: supervisor routing, swarm-style handoffs with Command(goto=..., graph=PARENT), and the langgraph-supervisor / langgraph-swarm libraries.",
          why: "One agent with 30 tools underperforms three agents with 10 each. Choosing the right topology — supervisor vs swarm — is a core architecture decision.",
          estHours: 5,
          tasks: [
            "Build a supervisor system: a router agent that delegates to a research agent and a writer agent, each a create_react_agent",
            "Rebuild it with langgraph-supervisor and compare the code you deleted",
            "Implement direct handoffs: give each agent a handoff tool that returns Command(goto='other_agent', graph=Command.PARENT)",
            "Try langgraph-swarm for the same task and note when peer handoffs beat central routing",
            "Write a one-page decision doc: supervisor vs swarm vs single-agent-with-tools for three real use cases you care about",
          ],
          resources: [
            {
              title: "Multi-agent concepts — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/",
              type: "docs",
              note: "Maps the full architecture space — read before building",
            },
            {
              title: "langgraph-supervisor (Python)",
              url: "https://github.com/langchain-ai/langgraph-supervisor-py",
              type: "practice",
            },
            {
              title: "langgraph-swarm (Python)",
              url: "https://github.com/langchain-ai/langgraph-swarm-py",
              type: "practice",
            },
            {
              title: "LangGraph: Multi-Agent Workflows — LangChain blog",
              url: "https://blog.langchain.dev/langgraph-multi-agent-workflows/",
              type: "article",
            },
          ],
        },
      ],
    },
    {
      title: "Streaming & UX",
      nodes: [
        {
          slug: "lg-streaming",
          title: "Streaming Modes & Agent UX",
          summary:
            "stream_mode values/updates/messages/custom/debug, token-by-token LLM streaming from inside nodes, streaming over subgraphs — responsive agent frontends.",
          why: "An agent that thinks for 40 silent seconds feels broken. Streaming progress is the single highest-leverage UX fix for agents.",
          estHours: 3,
          tasks: [
            "Stream the same run with stream_mode='values', 'updates', and 'messages' and document what each emits and when you'd use it",
            "Stream LLM tokens from inside a specific node and render them incrementally in a CLI",
            "Emit custom progress events from a long-running tool with get_stream_writer() and stream_mode='custom'",
            "Combine multiple stream modes in one call (stream_mode=['updates', 'messages']) and demultiplex the events",
          ],
          resources: [
            {
              title: "Streaming concepts — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/streaming/",
              type: "docs",
              note: "The five stream modes table is the key reference",
            },
            {
              title: "Streaming how-tos",
              url: "https://langchain-ai.github.io/langgraph/how-tos/streaming/",
              type: "docs",
            },
            {
              title: "Agent UX patterns — LangChain blog",
              url: "https://blog.langchain.dev/ux-for-agents-part-1-chat-2/",
              type: "article",
            },
          ],
        },
      ],
    },
    {
      title: "Production",
      nodes: [
        {
          slug: "lg-langsmith-observability",
          title: "LangSmith Tracing & Evals",
          summary:
            "Instrument agents with LangSmith: traces, run trees, datasets, LLM-as-judge evaluators, agent trajectory evals, and online monitoring.",
          why: "You can't fix what you can't see. Tracing plus evals is the difference between guessing why an agent failed and knowing.",
          estHours: 4,
          tasks: [
            "Set LANGSMITH_TRACING and API key env vars, run your agent, and walk one full trace: every LLM call, tool call, and latency",
            "Create a dataset of 15 input/expected-output pairs from real failures and run evaluate() against your agent",
            "Write an LLM-as-judge evaluator for answer correctness and a heuristic evaluator for 'did it call the right tool'",
            "Run a trajectory eval that scores the sequence of tool calls, not just the final answer",
            "Set up a dashboard + alert on error rate and P99 latency for your agent's project",
          ],
          resources: [
            {
              title: "LangSmith docs",
              url: "https://docs.smith.langchain.com/",
              type: "docs",
            },
            {
              title: "LangSmith evaluation guide",
              url: "https://docs.smith.langchain.com/evaluation",
              type: "docs",
              note: "Datasets, evaluators, and experiments — the core loop",
            },
            {
              title: "Agent evals — LangSmith how-tos",
              url: "https://docs.smith.langchain.com/evaluation/how_to_guides",
              type: "docs",
            },
            {
              title: "Introduction to LangSmith — LangChain Academy",
              url: "https://academy.langchain.com/courses/intro-to-langsmith",
              type: "course",
            },
          ],
        },
        {
          slug: "lg-reliability",
          title: "Error Handling & Reliability",
          summary:
            "Retry policies on nodes, node caching, tool-error fallbacks, recursion limits, idempotency, and durability modes — agents that survive real traffic.",
          why: "Production means flaky APIs, rate limits, and model timeouts. Reliability engineering is what keeps your agent's success rate above demo-day numbers.",
          estHours: 4,
          row: 1,
          tasks: [
            "Attach a RetryPolicy to a flaky node (simulate 30% failure) and verify exponential backoff retries",
            "Add a model fallback chain: primary model → cheaper model → canned degraded response, using with_fallbacks or explicit routing",
            "Enable node-level caching with a CachePolicy and measure cost savings on repeated identical inputs",
            "Make a payment-like tool idempotent with an idempotency key stored in state, then replay the graph and confirm no double-execution",
            "Load-test your agent with 50 concurrent runs and record error taxonomy: rate limits, timeouts, tool failures, bad outputs",
          ],
          resources: [
            {
              title: "Durable execution — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/durable_execution/",
              type: "docs",
            },
            {
              title: "Node retries how-to",
              url: "https://langchain-ai.github.io/langgraph/how-tos/graph-api/#add-retry-policies",
              type: "docs",
            },
            {
              title: "Node caching how-to",
              url: "https://langchain-ai.github.io/langgraph/how-tos/graph-api/#add-node-caching",
              type: "docs",
            },
            {
              title: "Building reliable agents — LangChain blog",
              url: "https://blog.langchain.dev/how-to-think-about-agent-frameworks/",
              type: "article",
            },
          ],
        },
        {
          slug: "lg-deployment",
          title: "LangGraph Platform & Self-Hosting",
          summary:
            "langgraph.json + CLI, the LangGraph Server API (assistants/threads/runs), Cloud vs self-hosted standalone container with Postgres/Redis, scaling and cost.",
          why: "A graph on your laptop isn't a product. Deployment is where checkpointing, streaming, and interrupts all pay off — the server exposes them as APIs for free.",
          estHours: 5,
          tasks: [
            "Write a langgraph.json declaring your graph and dependencies, then run langgraph dev and explore the local Studio UI",
            "Exercise the Server API with the SDK: create an assistant, a thread, and a run; stream the run; interrupt and resume it over HTTP",
            "Build the production Docker image with langgraph build and run it as a standalone container wired to Postgres and Redis",
            "Deploy the same app to LangGraph Cloud (or document the steps) and compare ops burden vs self-hosting",
            "Write a deployment decision memo: Cloud vs self-hosted vs rolling your own FastAPI around the graph — cost, control, and compliance trade-offs",
          ],
          resources: [
            {
              title: "LangGraph Platform concepts",
              url: "https://langchain-ai.github.io/langgraph/concepts/langgraph_platform/",
              type: "docs",
            },
            {
              title: "Deployment options — LangGraph docs",
              url: "https://langchain-ai.github.io/langgraph/concepts/deployment_options/",
              type: "docs",
              note: "Cloud, hybrid, and fully self-hosted compared honestly",
            },
            {
              title: "Self-hosted deployment guide",
              url: "https://langchain-ai.github.io/langgraph/concepts/self_hosted/",
              type: "docs",
            },
            {
              title: "LangGraph CLI reference",
              url: "https://langchain-ai.github.io/langgraph/cloud/reference/cli/",
              type: "docs",
            },
            {
              title: "LangGraph Server API reference",
              url: "https://langchain-ai.github.io/langgraph/cloud/reference/api/api_ref.html",
              type: "docs",
            },
          ],
        },
      ],
    },
  ],
};
