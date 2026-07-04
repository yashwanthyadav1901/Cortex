import type { Roadmap } from "../types";

export const systemDesignRoadmap: Roadmap = {
  pillar: "system_design",
  title: "System Design",
  description:
    "From how a request travels the internet to designing planet-scale systems. Follows the DDIA + system-design-primer arc: fundamentals → data → distributed systems → architecture → case studies.",
  stages: [
    {
      title: "Internet Fundamentals",
      nodes: [
        {
          slug: "how-internet-works",
          title: "How the Internet Works (DNS, IP, TCP)",
          summary:
            "What actually happens when you hit enter on a URL: DNS resolution, TCP handshakes, packets, routing.",
          why: "Every design discussion assumes this mental model; latency intuition starts here.",
          estHours: 4,
          resources: [
            {
              title: "How does the Internet work? — MDN",
              url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work",
              type: "article",
            },
            {
              title: "What is DNS? — Cloudflare Learning",
              url: "https://www.cloudflare.com/learning/dns/what-is-dns/",
              type: "article",
            },
            {
              title: "TCP/IP explained — PowerCert animated video",
              url: "https://www.youtube.com/watch?v=EkNq4TrHP_U",
              type: "video",
            },
          ],
        },
        {
          slug: "http-tls",
          title: "HTTP/S & TLS",
          summary:
            "HTTP semantics (methods, status codes, headers, caching), HTTP/1.1 vs 2 vs 3, and how TLS secures the pipe.",
          why: "You'll design APIs, caching, and CDNs on top of HTTP — its semantics are your toolbox.",
          estHours: 5,
          resources: [
            {
              title: "HTTP overview — MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
              type: "docs",
            },
            {
              title: "What is TLS? — Cloudflare Learning",
              url: "https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/",
              type: "article",
            },
            {
              title: "HTTP/2 vs HTTP/3 — Hussein Nasser",
              url: "https://www.youtube.com/watch?v=ai8cf0hZ9cQ",
              type: "video",
            },
          ],
        },
        {
          slug: "api-styles",
          title: "API Design: REST, gRPC, GraphQL, WebSockets",
          summary:
            "Designing resource-oriented REST APIs, when to reach for gRPC or GraphQL, and realtime with WebSockets/SSE.",
          why: "Choosing the API style (and versioning/pagination strategy) is the first decision in most designs.",
          estHours: 6,
          resources: [
            {
              title: "REST API design best practices — Microsoft",
              url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design",
              type: "article",
            },
            {
              title: "Introduction to gRPC — official docs",
              url: "https://grpc.io/docs/what-is-grpc/introduction/",
              type: "docs",
            },
            {
              title: "GraphQL — official learn section",
              url: "https://graphql.org/learn/",
              type: "docs",
            },
            {
              title: "WebSockets API — MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
              type: "docs",
            },
          ],
          projectSlugs: ["realtime-chat"],
        },
      ],
    },
    {
      title: "Traffic Layer",
      nodes: [
        {
          slug: "load-balancing",
          title: "Load Balancing",
          summary:
            "L4 vs L7 balancing, algorithms (round-robin, least-connections, consistent hashing), health checks, failover.",
          why: "The first component you draw in any scalable design; consistent hashing alone is interview gold.",
          estHours: 5,
          row: 1,
          resources: [
            {
              title: "What is load balancing? — Cloudflare Learning",
              url: "https://www.cloudflare.com/learning/performance/what-is-load-balancing/",
              type: "article",
            },
            {
              title: "Consistent Hashing explained — ByteByteGo",
              url: "https://www.youtube.com/watch?v=UF9Iqmg94tk",
              type: "video",
            },
            {
              title: "System Design Primer — load balancer section",
              url: "https://github.com/donnemartin/system-design-primer#load-balancer",
              type: "article",
            },
          ],
        },
        {
          slug: "proxies-cdn",
          title: "Reverse Proxies & CDNs",
          summary:
            "Forward vs reverse proxies, edge caching, cache invalidation at the edge, static vs dynamic content delivery.",
          why: "CDNs are how real systems get global latency down — and a cheap win to mention in any design.",
          estHours: 4,
          row: 1,
          resources: [
            {
              title: "What is a CDN? — Cloudflare Learning",
              url: "https://www.cloudflare.com/learning/cdn/what-is-a-cdn/",
              type: "article",
            },
            {
              title: "Proxy vs reverse proxy — Hussein Nasser",
              url: "https://www.youtube.com/watch?v=SqqrOspasag",
              type: "video",
            },
            {
              title: "System Design Primer — CDN section",
              url: "https://github.com/donnemartin/system-design-primer#content-delivery-network",
              type: "article",
            },
          ],
        },
        {
          slug: "rate-limiting",
          title: "Rate Limiting",
          summary:
            "Token bucket, leaky bucket, fixed/sliding windows; where limits live (edge, gateway, service) and what to return.",
          why: "A standard interview question on its own, and every public API you build needs one.",
          estHours: 4,
          resources: [
            {
              title: "Scaling your API with rate limiters — Stripe Engineering",
              url: "https://stripe.com/blog/rate-limiters",
              type: "article",
            },
            {
              title: "Rate limiting algorithms — ByteByteGo",
              url: "https://www.youtube.com/watch?v=mhUQe4BKZXs",
              type: "video",
            },
            {
              title: "What is rate limiting? — Cloudflare Learning",
              url: "https://www.cloudflare.com/learning/bots/what-is-rate-limiting/",
              type: "article",
            },
          ],
          projectSlugs: ["rate-limiter-service"],
        },
        {
          slug: "api-gateway",
          title: "API Gateways & Service Discovery",
          summary:
            "Single entry point for auth, routing, throttling, and request shaping; how services find each other.",
          why: "The glue of microservice architectures — interviews expect you to know what belongs in the gateway.",
          estHours: 3,
          resources: [
            {
              title: "API Gateway pattern — microservices.io",
              url: "https://microservices.io/patterns/apigateway.html",
              type: "article",
            },
            {
              title: "Service registry pattern — microservices.io",
              url: "https://microservices.io/patterns/service-registry.html",
              type: "article",
            },
            {
              title: "What is an API gateway? — ByteByteGo",
              url: "https://www.youtube.com/watch?v=6ULyxuHKxg8",
              type: "video",
            },
          ],
        },
      ],
    },
    {
      title: "Data Layer",
      nodes: [
        {
          slug: "sql-indexing",
          title: "Relational Databases & Indexing",
          summary:
            "Schema design, B-tree indexes, query plans, covering indexes, and why writes fight reads.",
          why: "'Add an index' is the answer to half of all performance problems — knowing *which* index is the skill.",
          estHours: 8,
          resources: [
            {
              title: "Use The Index, Luke — SQL indexing guide",
              url: "https://use-the-index-luke.com/",
              type: "book",
            },
            {
              title: "PostgreSQL docs — indexes chapter",
              url: "https://www.postgresql.org/docs/current/indexes.html",
              type: "docs",
            },
            {
              title: "SQLBolt — interactive SQL refresher",
              url: "https://sqlbolt.com/",
              type: "practice",
            },
          ],
        },
        {
          slug: "nosql",
          title: "NoSQL Families",
          summary:
            "Key-value, document, wide-column, and graph stores — data models, trade-offs, and when each fits.",
          why: "Interviews love 'SQL or NoSQL, and why?' — the honest answer requires knowing all four families.",
          estHours: 5,
          resources: [
            {
              title: "NoSQL explained — MongoDB",
              url: "https://www.mongodb.com/resources/basics/databases/nosql-explained",
              type: "article",
            },
            {
              title: "DynamoDB deep dive — AWS re:Invent talk",
              url: "https://www.youtube.com/watch?v=HaEPXoXVf2k",
              type: "video",
            },
            {
              title: "Designing Data-Intensive Applications — ch. 2 (data models)",
              url: "https://dataintensive.net/",
              type: "book",
              note: "THE system design book. Read it cover to cover over this whole stage.",
            },
          ],
        },
        {
          slug: "replication",
          title: "Replication",
          summary:
            "Leader-follower, multi-leader, and leaderless replication; replication lag and read-your-writes.",
          why: "Every highly-available design replicates data — the failure modes are where interviews dig.",
          estHours: 6,
          row: 1,
          resources: [
            {
              title: "DDIA ch. 5 — Replication",
              url: "https://dataintensive.net/",
              type: "book",
            },
            {
              title: "PostgreSQL high availability docs",
              url: "https://www.postgresql.org/docs/current/high-availability.html",
              type: "docs",
            },
            {
              title: "Database replication explained — ByteByteGo",
              url: "https://www.youtube.com/watch?v=bI8Ry6GhMSE",
              type: "video",
            },
          ],
        },
        {
          slug: "sharding",
          title: "Partitioning & Sharding",
          summary:
            "Hash vs range partitioning, choosing a shard key, hot spots, rebalancing, cross-shard queries.",
          why: "The standard answer to 'what when one DB isn't enough?' — and the follow-ups are all about shard keys.",
          estHours: 6,
          row: 1,
          resources: [
            {
              title: "Understanding database sharding — DigitalOcean",
              url: "https://www.digitalocean.com/community/tutorials/understanding-database-sharding",
              type: "article",
            },
            {
              title: "DDIA ch. 6 — Partitioning",
              url: "https://dataintensive.net/",
              type: "book",
            },
            {
              title: "How Discord stores trillions of messages",
              url: "https://discord.com/blog/how-discord-stores-trillions-of-messages",
              type: "article",
            },
          ],
          projectSlugs: ["url-shortener"],
        },
        {
          slug: "transactions",
          title: "Transactions & Isolation Levels",
          summary:
            "ACID, isolation anomalies (dirty/non-repeatable/phantom reads), snapshot isolation, distributed transactions.",
          why: "Correctness under concurrency separates senior answers from junior ones; isolation levels are the vocabulary.",
          estHours: 6,
          resources: [
            {
              title: "PostgreSQL docs — transaction isolation",
              url: "https://www.postgresql.org/docs/current/transaction-iso.html",
              type: "docs",
            },
            {
              title: "DDIA ch. 7 — Transactions",
              url: "https://dataintensive.net/",
              type: "book",
            },
            {
              title: "Jepsen — consistency models map",
              url: "https://jepsen.io/consistency",
              type: "article",
            },
          ],
        },
        {
          slug: "caching",
          title: "Caching Strategies",
          summary:
            "Cache-aside, write-through/behind, TTLs, eviction (LRU/LFU), stampede protection, and the invalidation problem.",
          why: "Caching is the highest-leverage performance tool — and its failure modes (staleness, stampedes) are classic questions.",
          estHours: 6,
          resources: [
            {
              title: "Caching overview — AWS",
              url: "https://aws.amazon.com/caching/",
              type: "article",
            },
            {
              title: "Caching strategies explained — ByteByteGo",
              url: "https://www.youtube.com/watch?v=dGAgxozNWFE",
              type: "video",
            },
            {
              title: "System Design Primer — cache section",
              url: "https://github.com/donnemartin/system-design-primer#cache",
              type: "article",
            },
          ],
          projectSlugs: ["url-shortener", "lru-lfu-cache"],
        },
      ],
    },
    {
      title: "Distributed Systems",
      nodes: [
        {
          slug: "cap-consistency",
          title: "CAP & Consistency Models",
          summary:
            "What partition tolerance really forces, linearizability vs eventual consistency, PACELC.",
          why: "The vocabulary for every availability-vs-consistency trade-off you'll ever argue.",
          estHours: 4,
          resources: [
            {
              title: "Please stop calling databases CP or AP — Martin Kleppmann",
              url: "https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html",
              type: "article",
            },
            {
              title: "Jepsen consistency models",
              url: "https://jepsen.io/consistency",
              type: "article",
            },
            {
              title: "CAP theorem — ByteByteGo",
              url: "https://www.youtube.com/watch?v=BHqjEjzAicA",
              type: "video",
            },
          ],
        },
        {
          slug: "consensus",
          title: "Consensus (Raft)",
          summary:
            "Why distributed agreement is hard, leader election, log replication, quorums — via Raft.",
          why: "Underpins etcd/ZooKeeper/every distributed DB; 'how does the cluster agree?' is a senior-round question.",
          estHours: 6,
          row: 1,
          resources: [
            {
              title: "The Secret Lives of Data — Raft visualization",
              url: "https://thesecretlivesofdata.com/raft/",
              type: "article",
            },
            {
              title: "Raft paper & site",
              url: "https://raft.github.io/",
              type: "docs",
            },
            {
              title: "MIT 6.824 — Raft lectures",
              url: "https://pdos.csail.mit.edu/6.824/",
              type: "course",
            },
          ],
          projectSlugs: ["raft-kv-store"],
        },
        {
          slug: "clocks-ordering",
          title: "Time, Clocks & Ordering",
          summary:
            "Why wall clocks lie, logical clocks (Lamport), vector clocks, and ordering events across machines.",
          why: "Explains a whole class of distributed bugs; Lamport clocks are a favorite 'do they really get it?' probe.",
          estHours: 4,
          row: 1,
          resources: [
            {
              title: "Lamport Clock — Patterns of Distributed Systems (Fowler)",
              url: "https://martinfowler.com/articles/patterns-of-distributed-systems/lamport-clock.html",
              type: "article",
            },
            {
              title: "DDIA ch. 8 — the trouble with distributed systems",
              url: "https://dataintensive.net/",
              type: "book",
            },
            {
              title: "There is No Now — ACM Queue",
              url: "https://queue.acm.org/detail.cfm?id=2745385",
              type: "article",
            },
          ],
        },
        {
          slug: "idempotency-retries",
          title: "Idempotency, Retries & Failure Handling",
          summary:
            "At-least-once vs exactly-once delivery, idempotency keys, retry budgets, backoff with jitter, circuit breakers.",
          why: "Networks fail constantly — designs that survive retries without double-charging users are the real skill.",
          estHours: 4,
          resources: [
            {
              title: "Designing robust and predictable APIs with idempotency — Stripe",
              url: "https://stripe.com/blog/idempotency",
              type: "article",
            },
            {
              title: "Timeouts, retries, and backoff with jitter — AWS Builders' Library",
              url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
              type: "article",
            },
            {
              title: "Circuit breaker pattern — Martin Fowler",
              url: "https://martinfowler.com/bliki/CircuitBreaker.html",
              type: "article",
            },
          ],
        },
        {
          slug: "message-queues",
          title: "Message Queues & Pub/Sub",
          summary:
            "Async decoupling with queues, consumer groups, ordering guarantees, dead-letter queues, Kafka vs RabbitMQ vs SQS.",
          why: "The default answer to spikes, slow consumers, and fan-out — every large design includes one.",
          estHours: 6,
          resources: [
            {
              title: "Apache Kafka — official introduction",
              url: "https://kafka.apache.org/intro",
              type: "docs",
            },
            {
              title: "Message queues — AWS overview",
              url: "https://aws.amazon.com/message-queue/",
              type: "article",
            },
            {
              title: "Kafka vs RabbitMQ — ByteByteGo",
              url: "https://www.youtube.com/watch?v=w8xWTIFU4C8",
              type: "video",
            },
          ],
          projectSlugs: ["mini-message-queue"],
        },
        {
          slug: "event-driven-streams",
          title: "Event-Driven Architecture & Streams",
          summary:
            "Events vs commands, event sourcing, CQRS, stream processing, and log-as-source-of-truth thinking.",
          why: "Modern data platforms are streams end-to-end; knowing when event sourcing helps (and when it hurts) matters.",
          estHours: 5,
          resources: [
            {
              title: "What do you mean by 'Event-Driven'? — Martin Fowler",
              url: "https://martinfowler.com/articles/201701-event-driven.html",
              type: "article",
            },
            {
              title: "The Log: what every software engineer should know — Jay Kreps",
              url: "https://web.archive.org/web/2024/https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying",
              type: "article",
              note: "Archived copy — the original LinkedIn post moved",
            },
            {
              title: "Kafka Streams docs",
              url: "https://kafka.apache.org/documentation/streams/",
              type: "docs",
            },
          ],
        },
      ],
    },
    {
      title: "Architecture & Operations",
      nodes: [
        {
          slug: "monolith-microservices",
          title: "Monoliths vs Microservices",
          summary:
            "Service boundaries, data ownership, the operational tax of distribution, and monolith-first thinking.",
          why: "Knowing when NOT to use microservices is the strongest signal of judgment in a design round.",
          estHours: 4,
          resources: [
            {
              title: "Microservices — Martin Fowler & James Lewis",
              url: "https://martinfowler.com/articles/microservices.html",
              type: "article",
            },
            {
              title: "Monolith First — Martin Fowler",
              url: "https://martinfowler.com/bliki/MonolithFirst.html",
              type: "article",
            },
            {
              title: "microservices.io — pattern catalog",
              url: "https://microservices.io/patterns/index.html",
              type: "docs",
            },
          ],
        },
        {
          slug: "observability",
          title: "Observability (Logs, Metrics, Traces)",
          summary:
            "The three pillars, SLIs/SLOs, alerting on symptoms not causes, distributed tracing.",
          why: "'How would you know it's broken?' is a guaranteed follow-up — SLO vocabulary answers it cleanly.",
          estHours: 4,
          row: 1,
          resources: [
            {
              title: "Monitoring distributed systems — Google SRE book",
              url: "https://sre.google/sre-book/monitoring-distributed-systems/",
              type: "book",
            },
            {
              title: "Instrumenting distributed systems — AWS Builders' Library",
              url: "https://aws.amazon.com/builders-library/instrumenting-distributed-systems-for-operational-visibility/",
              type: "article",
            },
            {
              title: "OpenTelemetry docs — observability primer",
              url: "https://opentelemetry.io/docs/concepts/observability-primer/",
              type: "docs",
            },
          ],
        },
        {
          slug: "capacity-estimation",
          title: "Back-of-Envelope Estimation",
          summary:
            "Latency numbers every engineer should know, QPS math, storage sizing, bandwidth budgets.",
          why: "Interviews open with 'estimate the scale' — fluency here buys credibility for everything after.",
          estHours: 3,
          row: 1,
          resources: [
            {
              title: "System Design Primer — back-of-the-envelope",
              url: "https://github.com/donnemartin/system-design-primer#back-of-the-envelope-calculations",
              type: "article",
            },
            {
              title: "Latency numbers every programmer should know",
              url: "https://gist.github.com/jboner/2841832",
              type: "article",
            },
            {
              title: "Capacity planning walkthrough — Hello Interview",
              url: "https://www.hellointerview.com/learn/system-design/deep-dives/numbers-to-know",
              type: "article",
            },
          ],
        },
        {
          slug: "security-basics",
          title: "Security Essentials",
          summary:
            "AuthN vs AuthZ, OAuth2/OIDC, JWTs, OWASP Top 10, secrets management, TLS everywhere.",
          why: "Designs that hand-wave auth get picked apart; OAuth flows are asked directly at senior levels.",
          estHours: 5,
          resources: [
            {
              title: "OWASP Top 10",
              url: "https://owasp.org/www-project-top-ten/",
              type: "docs",
            },
            {
              title: "OAuth 2.0 simplified — Aaron Parecki",
              url: "https://aaronparecki.com/oauth-2-simplified/",
              type: "article",
            },
            {
              title: "Illustrated guide to OAuth and OIDC",
              url: "https://www.youtube.com/watch?v=t18YB3xDfXI",
              type: "video",
            },
          ],
        },
      ],
    },
    {
      title: "Case Studies",
      nodes: [
        {
          slug: "design-url-shortener",
          title: "Design: URL Shortener",
          summary:
            "The 'hello world' of system design: ID generation, redirects, caching, analytics at scale.",
          why: "The canonical warm-up interview question — and a perfect first end-to-end design to internalize.",
          estHours: 3,
          row: 1,
          resources: [
            {
              title: "Design a URL shortener — Hello Interview breakdown",
              url: "https://www.hellointerview.com/learn/system-design/problem-breakdowns/bitly",
              type: "article",
            },
            {
              title: "System Design Primer — Pastebin/URL shortener solution",
              url: "https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/pastebin/README.md",
              type: "article",
            },
            {
              title: "Design a URL shortener — ByteByteGo",
              url: "https://www.youtube.com/watch?v=JQDHz72OA3c",
              type: "video",
            },
          ],
          projectSlugs: ["url-shortener"],
        },
        {
          slug: "design-chat",
          title: "Design: Chat System",
          summary:
            "WebSocket connections at scale, message fan-out, presence, delivery receipts, offline sync.",
          why: "Exercises realtime infra + storage + ordering all at once; a top-3 most-asked design.",
          estHours: 4,
          row: 1,
          resources: [
            {
              title: "Design a chat application — Hello Interview (WhatsApp)",
              url: "https://www.hellointerview.com/learn/system-design/problem-breakdowns/whatsapp",
              type: "article",
            },
            {
              title: "How Discord stores trillions of messages",
              url: "https://discord.com/blog/how-discord-stores-trillions-of-messages",
              type: "article",
            },
            {
              title: "Design Discord — ByteByteGo style walkthrough",
              url: "https://www.youtube.com/watch?v=cqAmqiEOSC8",
              type: "video",
            },
          ],
          projectSlugs: ["realtime-chat"],
        },
        {
          slug: "design-news-feed",
          title: "Design: News Feed",
          summary:
            "Fan-out on write vs read, celebrity problem, ranking, feed caching and pagination.",
          why: "The classic push-vs-pull trade-off question; every social product interview touches it.",
          estHours: 4,
          row: 2,
          resources: [
            {
              title: "Design a news feed — Hello Interview (FB News Feed)",
              url: "https://www.hellointerview.com/learn/system-design/problem-breakdowns/fb-news-feed",
              type: "article",
            },
            {
              title: "Design a news feed system — ByteByteGo",
              url: "https://www.youtube.com/watch?v=27factnLIfk",
              type: "video",
            },
            {
              title: "Twitter timeline architecture — InfoQ talk",
              url: "https://www.infoq.com/presentations/Twitter-Timeline-Scalability/",
              type: "video",
            },
          ],
          projectSlugs: ["news-feed-service"],
        },
        {
          slug: "design-video-streaming",
          title: "Design: Video Streaming (YouTube)",
          summary:
            "Upload pipelines, transcoding, adaptive bitrate (HLS/DASH), CDN strategy, view counting.",
          why: "Forces blob storage + async processing + CDN reasoning — a different muscle from CRUD designs.",
          estHours: 4,
          row: 2,
          resources: [
            {
              title: "Design YouTube — Hello Interview breakdown",
              url: "https://www.hellointerview.com/learn/system-design/problem-breakdowns/youtube",
              type: "article",
            },
            {
              title: "Design YouTube — ByteByteGo",
              url: "https://www.youtube.com/watch?v=jPKTo1iGQiE",
              type: "video",
            },
            {
              title: "Netflix tech blog — video processing at scale",
              url: "https://netflixtechblog.com/",
              type: "article",
            },
          ],
        },
        {
          slug: "design-web-crawler",
          title: "Design: Web Crawler",
          summary:
            "Frontier management, politeness, dedup at scale (bloom filters), distributed coordination, freshness.",
          why: "Tests queues, dedup structures, and rate limiting together; a favorite for infra-leaning roles.",
          estHours: 3,
          row: 3,
          resources: [
            {
              title: "Design a web crawler — Hello Interview breakdown",
              url: "https://www.hellointerview.com/learn/system-design/problem-breakdowns/web-crawler",
              type: "article",
            },
            {
              title: "System Design Primer — web crawler solution",
              url: "https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/web_crawler/README.md",
              type: "article",
            },
            {
              title: "Bloom filters explained — ByteByteGo",
              url: "https://www.youtube.com/watch?v=V3pzxngeLqw",
              type: "video",
            },
          ],
          projectSlugs: ["web-crawler"],
        },
        {
          slug: "design-autocomplete",
          title: "Design: Search Autocomplete",
          summary:
            "Trie/prefix services, top-K aggregation pipelines, typo tolerance, caching hot prefixes.",
          why: "Beautifully combines a DSA structure (trie) with data pipelines — interviewers love the crossover.",
          estHours: 3,
          row: 3,
          resources: [
            {
              title: "Design typeahead suggestion — ByteByteGo video",
              url: "https://www.youtube.com/watch?v=us0qySiUsGU",
              type: "video",
            },
            {
              title: "Prefix search at scale — Hello Interview (post search)",
              url: "https://www.hellointerview.com/learn/system-design/problem-breakdowns/fb-post-search",
              type: "article",
            },
            {
              title: "Elasticsearch — search suggesters docs",
              url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html",
              type: "docs",
            },
          ],
          projectSlugs: ["trie-autocomplete"],
        },
      ],
    },
  ],
};
