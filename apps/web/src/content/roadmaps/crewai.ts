import type { Roadmap } from "../types";

export const crewaiRoadmap: Roadmap = {
  pillar: "crewai",
  title: "CrewAI — Fundamentals to Production Crews",
  description:
    "Agents, tasks & crews → tools → Flows orchestration → memory & knowledge → guardrails & testing → production deployment. Role-based multi-agent systems, shipped properly.",
  stages: [
    {
      title: "Crew Fundamentals",
      nodes: [
        {
          slug: "crew-core-concepts",
          title: "Agents, Tasks & Crews",
          summary:
            "Role/goal/backstory agent design, task descriptions and expected_output, assembling a Crew, kickoff(), YAML vs code configuration, and the crewai CLI scaffold.",
          why: "CrewAI's entire model is role-playing agents collaborating on tasks. Get the role/goal/backstory craft right and everything downstream improves.",
          estHours: 4,
          tasks: [
            "Scaffold a project with crewai create crew and read every generated file: agents.yaml, tasks.yaml, crew.py, main.py",
            "Build a two-agent crew (researcher + writer) that produces a briefing doc — run it with crewai run",
            "Rewrite one agent's role/goal/backstory three ways and compare output quality on the same task",
            "Sharpen a task's description and expected_output until results are consistent across 3 runs",
            "Rebuild the same crew in pure Python (no YAML) with @CrewBase decorators removed, to see what the config layer actually does",
          ],
          resources: [
            {
              title: "Agents — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/agents",
              type: "docs",
              note: "Role/goal/backstory plus every agent parameter",
            },
            {
              title: "Tasks — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/tasks",
              type: "docs",
            },
            {
              title: "Crews — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/crews",
              type: "docs",
            },
            {
              title: "Multi AI Agent Systems with crewAI — DeepLearning.AI",
              url: "https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/",
              type: "course",
              note: "Taught by CrewAI's founder — the best structured intro",
            },
            {
              title: "CrewAI quickstart",
              url: "https://docs.crewai.com/en/quickstart",
              type: "docs",
            },
          ],
        },
        {
          slug: "crew-processes",
          title: "Sequential & Hierarchical Processes",
          summary:
            "Process types, task context chaining, manager LLM vs custom manager agent in hierarchical crews, and task output objects with output_file.",
          why: "Process choice decides who's in charge: a fixed pipeline or a manager delegating dynamically. Picking wrong wastes tokens and produces chaos.",
          estHours: 3,
          row: 1,
          tasks: [
            "Run a 3-task crew with Process.sequential and pass earlier task outputs into a later task via context=[...]",
            "Switch the same crew to Process.hierarchical with a manager_llm and watch the delegation in verbose logs",
            "Replace manager_llm with a custom manager_agent and constrain how it delegates",
            "Inspect TaskOutput objects (raw, pydantic, json_dict) after kickoff and write one task's result to output_file",
            "Document when hierarchical actually beat sequential for your test case — and when it just burned tokens",
          ],
          resources: [
            {
              title: "Processes — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/processes",
              type: "docs",
            },
            {
              title: "Hierarchical process guide",
              url: "https://docs.crewai.com/en/how-to/hierarchical-process",
              type: "docs",
            },
            {
              title: "Task outputs — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/tasks#task-output",
              type: "docs",
            },
            {
              title: "crewAI-examples repo",
              url: "https://github.com/crewAIInc/crewAI-examples",
              type: "practice",
            },
          ],
        },
      ],
    },
    {
      title: "Tools",
      nodes: [
        {
          slug: "crew-builtin-tools",
          title: "The crewai-tools Toolkit",
          summary:
            "SerperDevTool, ScrapeWebsiteTool, file and RAG tools — wiring built-in tools into agents and tasks, and deciding which agent gets which tool.",
          why: "Tools are what turn role-players into workers. The built-in toolkit covers search, scraping, and RAG so you don't rebuild plumbing.",
          estHours: 3,
          tasks: [
            "Give a research agent SerperDevTool + ScrapeWebsiteTool and have it produce a sourced market summary",
            "Use DirectoryReadTool + FileReadTool to let an agent analyze a local codebase or docs folder",
            "Try a RAG tool (e.g. PDFSearchTool) over a real PDF and compare answers vs raw file reading",
            "Assign a tool at the task level instead of the agent level and confirm task-level tools win",
            "Audit token usage with tools on vs off for the same task — tools change the cost profile dramatically",
          ],
          resources: [
            {
              title: "Tools overview — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/tools",
              type: "docs",
            },
            {
              title: "Tools catalog",
              url: "https://docs.crewai.com/en/tools/overview",
              type: "docs",
              note: "Browse the full list before building anything custom",
            },
            {
              title: "crewAI-tools GitHub",
              url: "https://github.com/crewAIInc/crewAI-tools",
              type: "practice",
            },
          ],
        },
        {
          slug: "crew-custom-tools",
          title: "Custom Tools & Structured Output",
          summary:
            "@tool decorator vs BaseTool subclass with args_schema, tool caching and error handling, and output_pydantic/output_json for typed task results.",
          why: "Real crews call your internal APIs and databases. Custom tools plus typed task outputs are how crew results become machine-usable, not just prose.",
          estHours: 4,
          row: 1,
          tasks: [
            "Write a custom tool with the @tool decorator that hits a real API you use, with a docstring the LLM can actually route on",
            "Rewrite it as a BaseTool subclass with a Pydantic args_schema and proper error messages returned to the agent",
            "Add cache_function to skip repeat calls with identical arguments and verify the cache hit in logs",
            "Set output_pydantic on a task and consume the typed result downstream in plain Python",
            "Break the tool (bad API key) and design the error message so the agent recovers instead of hallucinating",
          ],
          resources: [
            {
              title: "Creating custom tools — CrewAI docs",
              url: "https://docs.crewai.com/en/how-to/create-custom-tools",
              type: "docs",
            },
            {
              title: "Structured task outputs — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/tasks#getting-structured-consistent-outputs-from-tasks",
              type: "docs",
              note: "output_pydantic is the production default — use it everywhere",
            },
            {
              title: "Pydantic docs — model validation",
              url: "https://docs.pydantic.dev/latest/",
              type: "docs",
            },
          ],
        },
      ],
    },
    {
      title: "Flows",
      nodes: [
        {
          slug: "crew-flows-basics",
          title: "Flows: Event-Driven Orchestration",
          summary:
            "The Flow class, @start/@listen, or_/and_ conditions, @router branching, and structured (Pydantic) vs unstructured flow state.",
          why: "Crews are autonomous; Flows are precise. Production systems need deterministic orchestration around LLM steps — Flows are CrewAI's answer.",
          estHours: 5,
          tasks: [
            "Build a Flow with a @start method and two chained @listen steps passing data through flow state",
            "Use a Pydantic model for flow state and compare against the unstructured dict approach",
            "Add a @router that branches to different paths based on an LLM classification step",
            "Combine triggers with or_() and and_() and verify firing order in the logs",
            "Scaffold with crewai create flow and study how the template structures a real multi-step flow",
          ],
          resources: [
            {
              title: "Flows — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/flows",
              type: "docs",
              note: "The core page — read fully before writing a flow",
            },
            {
              title: "Practical Multi AI Agents — DeepLearning.AI",
              url: "https://www.deeplearning.ai/short-courses/practical-multi-ai-agents-and-advanced-use-cases-with-crewai/",
              type: "course",
              note: "Covers Flows and advanced production use cases",
            },
            {
              title: "Mastering Flow state — CrewAI guide",
              url: "https://docs.crewai.com/en/guides/flows/mastering-flow-state",
              type: "docs",
            },
          ],
        },
        {
          slug: "crew-flows-with-crews",
          title: "Crews Inside Flows & Persistence",
          summary:
            "Composing crews as flow steps, @persist for durable flow state, flow.plot() visualization — precision orchestration wrapped around autonomous crews.",
          why: "The winning production pattern: deterministic Flow skeleton, autonomous Crew muscles. Persistence makes long-running flows restartable instead of fragile.",
          estHours: 4,
          row: 1,
          tasks: [
            "Build a flow where step one is plain Python, step two kicks off a research crew, and step three post-processes the crew's typed output",
            "Add @persist to the flow and confirm state is restored after killing and rerunning the process",
            "Generate the flow diagram with flow.plot() and sanity-check the topology",
            "Add a human-approval branch: router sends low-confidence crew output to a review path before publishing",
            "Compare this architecture against a single hierarchical crew doing everything — cost, latency, and debuggability",
          ],
          resources: [
            {
              title: "Build your first flow — CrewAI guide",
              url: "https://docs.crewai.com/en/guides/flows/first-flow",
              type: "docs",
            },
            {
              title: "Flow persistence (@persist) — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/flows#flow-persistence",
              type: "docs",
            },
            {
              title: "crewAI-examples — flows",
              url: "https://github.com/crewAIInc/crewAI-examples",
              type: "practice",
            },
          ],
        },
      ],
    },
    {
      title: "Memory & Knowledge",
      nodes: [
        {
          slug: "crew-memory",
          title: "Memory Systems",
          summary:
            "memory=True: short-term (RAG), long-term (SQLite), and entity memory; custom embedder config and external providers like Mem0.",
          why: "Without memory, every kickoff starts from zero. Memory lets crews learn from past runs and keep entities straight within a run.",
          estHours: 4,
          tasks: [
            "Enable memory=True on a crew and inspect what actually gets stored (short-term Chroma, long-term SQLite) on disk",
            "Run the same crew twice on related inputs and find concrete evidence of long-term memory influencing run two",
            "Configure a custom embedder (e.g. a different provider/model) for memory and verify it's used",
            "Wire up external memory with Mem0 for user-scoped memory across sessions",
            "Reset memories with crewai reset-memories and document when stale memory hurt output quality",
          ],
          resources: [
            {
              title: "Memory — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/memory",
              type: "docs",
              note: "Short-term, long-term, entity, and external memory explained",
            },
            {
              title: "Mem0 integration docs",
              url: "https://docs.mem0.ai/integrations/crewai",
              type: "docs",
            },
            {
              title: "CrewAI CLI reference (reset-memories)",
              url: "https://docs.crewai.com/en/concepts/cli",
              type: "docs",
            },
          ],
        },
        {
          slug: "crew-knowledge",
          title: "Knowledge Sources",
          summary:
            "Grounding agents in files, PDFs, CSVs, and custom BaseKnowledgeSource implementations; agent-level vs crew-level knowledge, chunking and embedder settings.",
          why: "Knowledge is RAG done for you: domain docs the agent consults automatically. It's the fastest way to make a generic agent an expert in your domain.",
          estHours: 3,
          row: 1,
          tasks: [
            "Attach a StringKnowledgeSource and a PDF knowledge source to a crew and confirm answers cite the injected facts",
            "Move knowledge from crew level to a single agent and verify only that agent can use it",
            "Tune chunk_size/chunk_overlap and measure retrieval quality differences on specific questions",
            "Implement a custom BaseKnowledgeSource that pulls from an API (e.g. your notes app) and ground a crew in it",
          ],
          resources: [
            {
              title: "Knowledge — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/knowledge",
              type: "docs",
            },
            {
              title: "Custom knowledge sources — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/knowledge#custom-knowledge-sources",
              type: "docs",
            },
            {
              title: "RAG fundamentals — DeepLearning.AI",
              url: "https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/",
              type: "course",
              note: "Background on the retrieval mechanics Knowledge wraps",
            },
          ],
        },
      ],
    },
    {
      title: "Reliability & Quality",
      nodes: [
        {
          slug: "crew-guardrails-planning",
          title: "Guardrails, Planning & Callbacks",
          summary:
            "Task guardrails (validation functions with retry), planning=True with a planning LLM, task/step callbacks, and max_iter/max_rpm safety rails.",
          why: "LLM output is a distribution, not a guarantee. Guardrails convert 'usually right' into 'validated or retried' — the core reliability primitive in CrewAI.",
          estHours: 4,
          tasks: [
            "Write a guardrail function that validates a task's output (e.g. word count + required sections) and returns (False, error) to force a retry",
            "Chain a Pydantic-validation guardrail with output_pydantic and set max_retries deliberately",
            "Enable planning=True with a cheap planning LLM and diff the task execution vs unplanned runs",
            "Add task_callback and step_callback logging every step to a JSONL file for later analysis",
            "Set max_iter and max_rpm on agents and confirm the crew degrades gracefully instead of looping forever",
          ],
          resources: [
            {
              title: "Task guardrails — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/tasks#task-guardrails",
              type: "docs",
              note: "The retry-on-invalid loop — use on every production task",
            },
            {
              title: "Planning — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/planning",
              type: "docs",
            },
            {
              title: "Agent parameters reference (max_iter, max_rpm)",
              url: "https://docs.crewai.com/en/concepts/agents#agent-attributes",
              type: "docs",
            },
          ],
        },
        {
          slug: "crew-testing-training",
          title: "Testing & Training Crews",
          summary:
            "crewai test for scored eval runs across iterations and models, crewai train with human feedback, and building your own eval harness on task outputs.",
          why: "\"It worked when I ran it\" is not a test suite. Scored, repeated eval runs are how you catch regressions when you change a prompt, model, or tool.",
          estHours: 4,
          row: 1,
          tasks: [
            "Run crewai test -n 3 on your crew and read the per-task and per-agent score table it produces",
            "Re-run the same test with a different eval LLM and compare score stability",
            "Run crewai train -n 2, give real feedback at each iteration, and verify the trained crew's outputs improve",
            "Build a small custom eval harness: kickoff over 10 fixed inputs, validate outputs with Pydantic + an LLM judge, and emit pass/fail",
            "Wire that harness into CI so prompt changes can't merge without passing evals",
          ],
          resources: [
            {
              title: "Testing — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/testing",
              type: "docs",
            },
            {
              title: "Training — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/training",
              type: "docs",
            },
            {
              title: "LLM evals guide — Hamel Husain",
              url: "https://hamel.dev/blog/posts/evals/",
              type: "article",
              note: "Framework-agnostic eval thinking that applies directly here",
            },
          ],
        },
      ],
    },
    {
      title: "Production",
      nodes: [
        {
          slug: "crew-observability-cost",
          title: "Observability, Evals & Cost Control",
          summary:
            "Tracing integrations (AgentOps, Langfuse, Arize Phoenix, OpenTelemetry), usage_metrics token accounting, and model tiering plus rate limiting for cost.",
          why: "A crew of five agents can silently 10x your token bill. Tracing and per-run cost accounting are non-negotiable before real users touch it.",
          estHours: 4,
          tasks: [
            "Integrate one tracing backend (Langfuse or AgentOps) and walk a full trace of a crew run: every LLM call, tool call, and latency",
            "Log crew.usage_metrics after each kickoff and build a per-run cost report (prompt vs completion tokens x model price)",
            "Tier your models: manager/planner on a strong model, worker agents on a cheap one — measure quality delta and cost savings",
            "Add max_rpm and request timeouts, then simulate a provider outage and confirm the crew fails loudly and fast",
            "Set an alert threshold: any single run exceeding $X or Y minutes gets flagged with its trace link",
          ],
          resources: [
            {
              title: "Observability overview — CrewAI docs",
              url: "https://docs.crewai.com/en/observability/overview",
              type: "docs",
              note: "Lists every supported tracing integration",
            },
            {
              title: "Langfuse + CrewAI integration",
              url: "https://langfuse.com/docs/integrations/crewai",
              type: "docs",
            },
            {
              title: "AgentOps + CrewAI",
              url: "https://docs.crewai.com/en/observability/agentops",
              type: "docs",
            },
            {
              title: "LLMs and cost management — CrewAI docs",
              url: "https://docs.crewai.com/en/concepts/llms",
              type: "docs",
            },
          ],
        },
        {
          slug: "crew-deployment",
          title: "Deploying Crews",
          summary:
            "CrewAI AMP/Enterprise deploy (crewai deploy) vs self-hosting: a FastAPI wrapper around kickoff_async, background job patterns, Docker, and env/secrets management.",
          why: "The last mile: a crew is only a product when it's an API someone can call. Choose managed vs self-hosted deliberately — the ops profiles differ hugely.",
          estHours: 5,
          tasks: [
            "Wrap your crew in FastAPI: a POST endpoint that runs kickoff_async in a background task and a GET endpoint that polls run status",
            "Containerize it with Docker, inject all keys via env vars/secrets (never in code), and run it locally end to end",
            "Add a job queue (or at minimum a semaphore) so concurrent requests can't spawn unbounded crews",
            "Deploy the same crew via CrewAI AMP with crewai deploy (or document the flow) and compare against your self-hosted stack",
            "Write the production runbook: how to roll back a prompt change, rotate a key, and debug a failed run from its trace",
          ],
          resources: [
            {
              title: "CrewAI AMP / Enterprise — docs",
              url: "https://docs.crewai.com/en/enterprise/introduction",
              type: "docs",
            },
            {
              title: "Deploy crew — CrewAI enterprise guide",
              url: "https://docs.crewai.com/en/enterprise/guides/deploy-crew",
              type: "docs",
            },
            {
              title: "Kickoff async — CrewAI docs",
              url: "https://docs.crewai.com/en/how-to/kickoff-async",
              type: "docs",
            },
            {
              title: "FastAPI background tasks",
              url: "https://fastapi.tiangolo.com/tutorial/background-tasks/",
              type: "docs",
              note: "The minimal self-hosting pattern before reaching for Celery",
            },
          ],
        },
      ],
    },
  ],
};
