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
          tasks: [
            "Read the MDN 'How does the Internet work?' article and sketch the path a packet takes from your browser to a server and back",
            "Read the Cloudflare DNS article; then trace a real DNS lookup with `dig +trace example.com` and label each step",
            "Watch the PowerCert TCP/IP video; draw the TCP three-way handshake from memory with SYN/ACK flags",
            "Explain in 2-3 sentences why UDP exists alongside TCP and name two applications that prefer UDP",
          ],
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
            {
              title: "How DNS works — comic explanation",
              url: "https://howdns.works/",
              type: "article",
              note: "Visual comic-style walkthrough that makes DNS memorable",
            },
            {
              title: "System Design Primer — DNS section",
              url: "https://github.com/donnemartin/system-design-primer#domain-name-system",
              type: "article",
            },
            {
              title: "Networking fundamentals — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=35XjX0e_tec",
              type: "video",
            },
            {
              title: "Computer Networking: A Top-Down Approach (Kurose & Ross)",
              url: "https://gaia.cs.umass.edu/kurose_ross/index.php",
              type: "book",
              note: "The standard university networking textbook — ch. 1-3 cover this topic",
            },
          ],
        },
        {
          slug: "http-tls",
          title: "HTTP/S & TLS",
          summary:
            "HTTP semantics (methods, status codes, headers, caching), HTTP/1.1 vs 2 vs 3, and how TLS secures the pipe.",
          why: "You'll design APIs, caching, and CDNs on top of HTTP — its semantics are your toolbox.",
          tasks: [
            "Read the MDN HTTP overview; list all HTTP methods with one-line descriptions and which are idempotent",
            "Read the Cloudflare TLS article; draw the TLS 1.3 handshake sequence diagram from memory",
            "Watch the Hussein Nasser HTTP/2 vs HTTP/3 video; write a comparison table with 4 columns: feature, HTTP/1.1, HTTP/2, HTTP/3",
            "Use `curl -v https://example.com` to inspect real request/response headers and annotate each header's purpose",
          ],
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
            {
              title: "HTTP caching — MDN",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching",
              type: "docs",
              note: "HTTP caching headers are critical for system design CDN discussions",
            },
            {
              title: "How HTTPS works — comic explanation",
              url: "https://howhttps.works/",
              type: "article",
            },
            {
              title: "High Performance Browser Networking — Ilya Grigorik",
              url: "https://hpbn.co/",
              type: "book",
              note: "Free online book — chapters on HTTP/2 and TLS are exceptional",
            },
            {
              title: "TLS handshake deep dive — Cloudflare blog",
              url: "https://blog.cloudflare.com/rfc-8446-aka-tls-1-3/",
              type: "article",
            },
          ],
        },
        {
          slug: "api-styles",
          title: "API Design: REST, gRPC, GraphQL, WebSockets",
          summary:
            "Designing resource-oriented REST APIs, when to reach for gRPC or GraphQL, and realtime with WebSockets/SSE.",
          why: "Choosing the API style (and versioning/pagination strategy) is the first decision in most designs.",
          tasks: [
            "Read the Microsoft REST API design guide; design a REST API for a to-do app with 5 endpoints following their naming conventions",
            "Read the gRPC introduction; write a .proto file defining a simple service with two RPCs and explain when you'd pick gRPC over REST",
            "Complete the GraphQL official learn tutorial through the 'Schemas and Types' section",
            "Read the MDN WebSockets API docs; build a minimal WebSocket echo server in Node.js or Python",
            "Write a one-page decision matrix: REST vs gRPC vs GraphQL vs WebSockets — when to use each, with a concrete example per style",
          ],
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
            {
              title: "REST vs GraphQL vs gRPC — ByteByteGo",
              url: "https://www.youtube.com/watch?v=hkXzsB8D_mo",
              type: "video",
            },
            {
              title: "API design guide — Google Cloud",
              url: "https://cloud.google.com/apis/design",
              type: "docs",
              note: "Google's opinionated guide — great for resource-oriented API thinking",
            },
            {
              title: "Best practices for REST API design — Stack Overflow blog",
              url: "https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/",
              type: "article",
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
          tasks: [
            "Read the Cloudflare load balancing article; list 4 balancing algorithms with one sentence on when each shines",
            "Watch the ByteByteGo consistent hashing video; implement a consistent hash ring in Python with virtual nodes",
            "Read the System Design Primer load balancer section; draw a diagram showing L4 vs L7 load balancing and label what each inspects",
            "Explain the difference between active and passive health checks and what happens when a backend fails each check",
          ],
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
            {
              title: "NGINX load balancing docs",
              url: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/",
              type: "docs",
            },
            {
              title: "Load balancing — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=K0Ta65OqQkY",
              type: "video",
            },
            {
              title: "What is Elastic Load Balancing? — AWS docs",
              url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html",
              type: "docs",
            },
            {
              title: "Introduction to modern network load balancing — Envoy blog",
              url: "https://blog.envoyproxy.io/introduction-to-modern-network-load-balancing-and-proxying-a57f6ff80236",
              type: "article",
              note: "Excellent deep dive on L4 vs L7 from the Envoy creator",
            },
          ],
        },
        {
          slug: "proxies-cdn",
          title: "Reverse Proxies & CDNs",
          summary:
            "Forward vs reverse proxies, edge caching, cache invalidation at the edge, static vs dynamic content delivery.",
          why: "CDNs are how real systems get global latency down — and a cheap win to mention in any design.",
          tasks: [
            "Read the Cloudflare CDN article; draw a diagram showing a pull-based CDN serving a cache hit vs a cache miss",
            "Watch the Hussein Nasser proxy vs reverse proxy video; list 3 things a reverse proxy can do that a forward proxy cannot",
            "Read the System Design Primer CDN section; write a paragraph comparing push CDN vs pull CDN with a use case for each",
            "Explain cache invalidation at the edge: what happens when you deploy a new version of your CSS and users have stale copies?",
          ],
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
            {
              title: "CDN explained — ByteByteGo",
              url: "https://www.youtube.com/watch?v=RI9np1LWzqw",
              type: "video",
            },
            {
              title: "Amazon CloudFront — how it works",
              url: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
              type: "docs",
            },
            {
              title: "High Performance Browser Networking — caching chapter",
              url: "https://hpbn.co/optimizing-application-delivery/",
              type: "book",
            },
            {
              title: "Reverse proxy vs load balancer — NGINX blog",
              url: "https://www.nginx.com/resources/glossary/reverse-proxy-vs-load-balancer/",
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
          tasks: [
            "Read the Stripe rate limiters article; summarize token bucket, leaky bucket, fixed window, and sliding window in one sentence each",
            "Watch the ByteByteGo rate limiting video; implement a sliding window counter rate limiter using Redis or an in-memory dict",
            "Read the Cloudflare rate limiting article; draw where rate limits should live in a request's path (edge, gateway, service) and explain why",
            "Write test cases for your rate limiter: burst handling, window rollover, and concurrent requests from the same client",
          ],
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
            {
              title: "System Design Primer — rate limiting",
              url: "https://github.com/donnemartin/system-design-primer#rate-limiting",
              type: "article",
            },
            {
              title: "Rate limiting — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=mhUQe4BKZXs",
              type: "video",
            },
            {
              title: "Redis rate limiting pattern",
              url: "https://redis.io/glossary/rate-limiting/",
              type: "docs",
              note: "Shows sliding window implementation with Redis commands",
            },
            {
              title: "System design: rate limiter — Alex Xu (ByteByteGo book ch. 4)",
              url: "https://bytebytego.com/courses/system-design-interview/design-a-rate-limiter",
              type: "course",
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
          tasks: [
            "Read the microservices.io API Gateway pattern article; list 5 cross-cutting concerns an API gateway handles",
            "Read the microservices.io service registry pattern; compare client-side vs server-side discovery with a diagram for each",
            "Watch the ByteByteGo API gateway video; explain why you would or wouldn't put business logic in the gateway",
            "Draw a request flow through an API gateway showing auth, rate limiting, routing, and response transformation steps",
          ],
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
            {
              title: "Service discovery in microservices — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=s1dGAJAB0ME",
              type: "video",
            },
            {
              title: "Amazon API Gateway — developer guide",
              url: "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html",
              type: "docs",
            },
            {
              title: "Kong API gateway docs — overview",
              url: "https://docs.konghq.com/gateway/latest/",
              type: "docs",
            },
            {
              title: "Building Microservices — Sam Newman (ch. 5, service discovery)",
              url: "https://samnewman.io/books/building_microservices_2nd_edition/",
              type: "book",
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
          tasks: [
            "Complete SQLBolt lessons 1-12 to refresh core SQL (joins, aggregation, subqueries)",
            "Read 'Use The Index, Luke' chapters on WHERE, ORDER BY, and covering indexes; summarize B-tree traversal in 3 sentences",
            "Read the PostgreSQL indexes chapter; create a test table, add a composite index, and use EXPLAIN ANALYZE to compare query plans with and without it",
            "Design a schema for a blog (users, posts, comments, tags) with indexes justified for the 3 most common queries",
            "Write a paragraph explaining why adding indexes speeds up reads but slows down writes",
          ],
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
            {
              title: "How do indexes work in PostgreSQL? — Hussein Nasser",
              url: "https://www.youtube.com/watch?v=-qNSXPUFwXo",
              type: "video",
            },
            {
              title: "DDIA ch. 3 — Storage and Retrieval (B-trees & LSM trees)",
              url: "https://dataintensive.net/",
              type: "book",
              note: "Explains B-tree internals, WAL, and how they differ from LSM trees",
            },
            {
              title: "SQL vs NoSQL — ByteByteGo",
              url: "https://www.youtube.com/watch?v=Q_9cFgzZr8Q",
              type: "video",
            },
            {
              title: "Database indexing explained — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=lYh6LrSIDvY",
              type: "video",
            },
          ],
        },
        {
          slug: "nosql",
          title: "NoSQL Families",
          summary:
            "Key-value, document, wide-column, and graph stores — data models, trade-offs, and when each fits.",
          why: "Interviews love 'SQL or NoSQL, and why?' — the honest answer requires knowing all four families.",
          tasks: [
            "Read the MongoDB NoSQL explainer; create a comparison table of key-value, document, wide-column, and graph stores with data model, example DB, and best-fit use case",
            "Watch the DynamoDB deep dive talk; explain single-table design and when it saves you vs when it hurts",
            "Read DDIA ch. 2 on data models; write 2 sentences on when a document model beats a relational model and vice versa",
            "Pick a feature (e.g., social graph, product catalog, time-series metrics) and justify which NoSQL family fits best and why",
          ],
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
            {
              title: "Introduction to NoSQL — Martin Fowler (talk)",
              url: "https://www.youtube.com/watch?v=qI_g07C_Q5I",
              type: "video",
            },
            {
              title: "Cassandra data modeling — DataStax docs",
              url: "https://docs.datastax.com/en/cassandra-oss/3.x/cassandra/dml/dmlIntro.html",
              type: "docs",
            },
            {
              title: "Redis data types and abstractions — official docs",
              url: "https://redis.io/docs/latest/develop/data-types/",
              type: "docs",
            },
            {
              title: "NoSQL design for DynamoDB — AWS docs",
              url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html",
              type: "docs",
            },
          ],
        },
        {
          slug: "replication",
          title: "Replication",
          summary:
            "Leader-follower, multi-leader, and leaderless replication; replication lag and read-your-writes.",
          why: "Every highly-available design replicates data — the failure modes are where interviews dig.",
          tasks: [
            "Read DDIA ch. 5 on replication; draw diagrams for leader-follower, multi-leader, and leaderless topologies",
            "Watch the ByteByteGo replication video; explain replication lag and the read-your-writes consistency guarantee in 2-3 sentences",
            "Read the PostgreSQL high availability docs; set up streaming replication between two local Postgres instances (or describe the steps if hardware-limited)",
            "Write a scenario where multi-leader replication causes a conflict and explain two resolution strategies",
          ],
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
            {
              title: "Master-slave vs master-master replication — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=RIcNswROzCc",
              type: "video",
            },
            {
              title: "System Design Primer — replication section",
              url: "https://github.com/donnemartin/system-design-primer#replication",
              type: "article",
            },
            {
              title: "MySQL replication — official docs",
              url: "https://dev.mysql.com/doc/refman/8.0/en/replication.html",
              type: "docs",
            },
            {
              title: "Replication under the hood — PlanetScale blog",
              url: "https://planetscale.com/blog/mysql-replication",
              type: "article",
            },
          ],
        },
        {
          slug: "sharding",
          title: "Partitioning & Sharding",
          summary:
            "Hash vs range partitioning, choosing a shard key, hot spots, rebalancing, cross-shard queries.",
          why: "The standard answer to 'what when one DB isn't enough?' — and the follow-ups are all about shard keys.",
          tasks: [
            "Read the DigitalOcean sharding tutorial; explain hash-based vs range-based partitioning with one advantage and one disadvantage each",
            "Read DDIA ch. 6 on partitioning; describe what a hot spot is and two strategies to mitigate it",
            "Read the Discord blog post on storing trillions of messages; identify their shard key choice and explain why it works for their access patterns",
            "Design a sharding scheme for a user table with 500M rows: pick a shard key, justify it, and explain how you'd handle a query that spans all shards",
          ],
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
            {
              title: "Database sharding explained — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=5faMjKn0HTk",
              type: "video",
            },
            {
              title: "Consistent hashing and sharding — ByteByteGo",
              url: "https://bytebytego.com/courses/system-design-interview/design-consistent-hashing",
              type: "course",
            },
            {
              title: "Vitess — how YouTube scaled MySQL",
              url: "https://vitess.io/docs/overview/whatisvitess/",
              type: "docs",
              note: "Real-world sharding middleware used by YouTube, Slack, and others",
            },
            {
              title: "System Design Primer — database section",
              url: "https://github.com/donnemartin/system-design-primer#database",
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
          tasks: [
            "Read the PostgreSQL transaction isolation docs; create a table listing each isolation level with which anomalies it prevents",
            "Read DDIA ch. 7 on transactions; explain the difference between dirty reads, non-repeatable reads, and phantom reads with a concrete example each",
            "Study the Jepsen consistency models map; draw a hierarchy from serializable down to read-uncommitted",
            "Write a SQL script that demonstrates a lost update under read-committed and then prevents it using SELECT FOR UPDATE",
            "Explain in a paragraph why distributed transactions (2PC) are expensive and name one alternative pattern (e.g., saga)",
          ],
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
            {
              title: "Transactions explained — Hussein Nasser",
              url: "https://www.youtube.com/watch?v=wHUOeXbZCYA",
              type: "video",
            },
            {
              title: "DDIA ch. 9 — Consistency and Consensus",
              url: "https://dataintensive.net/",
              type: "book",
              note: "Covers 2PC, distributed transactions, and consensus protocols",
            },
            {
              title: "Distributed transactions: the Saga pattern — microservices.io",
              url: "https://microservices.io/patterns/data/saga.html",
              type: "article",
            },
            {
              title: "A beginner's guide to ACID and transactions — Vlad Mihalcea",
              url: "https://vladmihalcea.com/a-beginners-guide-to-acid-and-database-transactions/",
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
          tasks: [
            "Read the AWS caching overview and list the 4 caching strategies with one sentence each",
            "Watch the ByteByteGo caching video; draw a cache-aside sequence diagram from memory",
            "Implement an LRU cache in Python with O(1) get/put (dict + doubly linked list)",
            "Write a paragraph: when would you choose write-through over cache-aside, and why?",
            "Explain cache stampede and one mitigation to yourself without notes",
          ],
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
            {
              title: "Redis documentation — overview",
              url: "https://redis.io/docs/latest/",
              type: "docs",
              note: "The most popular caching store — know its data structures and eviction policies",
            },
            {
              title: "Caching pitfalls every developer should know — ByteByteGo",
              url: "https://www.youtube.com/watch?v=wh98s0XhMmQ",
              type: "video",
            },
            {
              title: "Amazon ElastiCache — caching strategies",
              url: "https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/Strategies.html",
              type: "docs",
            },
            {
              title: "LRU cache — LeetCode problem 146",
              url: "https://leetcode.com/problems/lru-cache/",
              type: "practice",
              note: "Classic coding interview problem that tests cache implementation skills",
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
          tasks: [
            "Read Kleppmann's 'Please stop calling databases CP or AP' article; summarize his main argument in 3 sentences",
            "Study the Jepsen consistency models page; draw the hierarchy from linearizability down to eventual consistency",
            "Watch the ByteByteGo CAP theorem video; explain PACELC and how it extends CAP with a concrete database example",
            "Classify 3 real databases (e.g., PostgreSQL, Cassandra, DynamoDB) on the consistency spectrum and justify each placement",
          ],
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
            {
              title: "DDIA ch. 9 — Consistency and Consensus",
              url: "https://dataintensive.net/",
              type: "book",
            },
            {
              title: "CAP theorem — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=kwCFHLbIhak",
              type: "video",
            },
            {
              title: "System Design Primer — CAP theorem",
              url: "https://github.com/donnemartin/system-design-primer#cap-theorem",
              type: "article",
            },
            {
              title: "Harvest, Yield, and Scalable Tolerant Systems — Brewer & Fox",
              url: "https://radlab.cs.berkeley.edu/people/fox/static/pubs/pdf/c18.pdf",
              type: "article",
              note: "The original harvest/yield paper that refines CAP thinking",
            },
          ],
        },
        {
          slug: "consensus",
          title: "Consensus (Raft)",
          summary:
            "Why distributed agreement is hard, leader election, log replication, quorums — via Raft.",
          why: "Underpins etcd/ZooKeeper/every distributed DB; 'how does the cluster agree?' is a senior-round question.",
          tasks: [
            "Walk through The Secret Lives of Data Raft visualization end-to-end; note what happens during leader election, log replication, and a network partition",
            "Read the Raft paper's sections 1-5; draw the state machine for a Raft node (follower, candidate, leader) with transition triggers",
            "Watch the MIT 6.824 Raft lecture; explain what a quorum is and why Raft needs a majority to commit an entry",
            "Implement a simplified Raft leader election in Python or Go (heartbeats, timeouts, vote requests) without log replication",
            "Write a paragraph explaining what happens to client writes during a Raft leader election and why the system remains safe",
          ],
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
            {
              title: "Raft — understandable consensus (paper)",
              url: "https://raft.github.io/raft.pdf",
              type: "article",
              note: "The original Raft paper — more readable than Paxos by design",
            },
            {
              title: "Paxos vs Raft — Hussein Nasser",
              url: "https://www.youtube.com/watch?v=s8JqcZtvnsM",
              type: "video",
            },
            {
              title: "etcd — how it uses Raft",
              url: "https://etcd.io/docs/v3.5/learning/",
              type: "docs",
              note: "etcd is Kubernetes' brain — see Raft in production",
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
          tasks: [
            "Read the Fowler/Lamport Clock patterns article; implement a Lamport clock in Python that increments on send, receives max+1 on receive",
            "Read DDIA ch. 8 on distributed system troubles; list 3 reasons wall clocks are unreliable across machines",
            "Read 'There is No Now' from ACM Queue; explain the difference between Lamport clocks and vector clocks in 2 sentences",
            "Draw a happens-before diagram for 3 processes exchanging messages and assign Lamport timestamps to each event",
          ],
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
            {
              title: "Distributed systems lectures — Martin Kleppmann (Cambridge)",
              url: "https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB",
              type: "course",
              note: "Full university lecture series — lectures 7-8 cover clocks and ordering",
            },
            {
              title: "Time, Clocks, and the Ordering of Events — Lamport (original paper)",
              url: "https://lamport.azurewebsites.net/pubs/time-clocks.pdf",
              type: "article",
              note: "The seminal 1978 paper — foundational to all distributed systems",
            },
            {
              title: "Vector clocks — Riak docs",
              url: "https://docs.riak.com/riak/kv/latest/learn/concepts/causal-context/index.html",
              type: "docs",
            },
          ],
        },
        {
          slug: "idempotency-retries",
          title: "Idempotency, Retries & Failure Handling",
          summary:
            "At-least-once vs exactly-once delivery, idempotency keys, retry budgets, backoff with jitter, circuit breakers.",
          why: "Networks fail constantly — designs that survive retries without double-charging users are the real skill.",
          tasks: [
            "Read the Stripe idempotency article; implement an idempotency-key middleware that deduplicates POST requests using a hash map",
            "Read the AWS Builders' Library article on retries; implement exponential backoff with jitter in Python and test it with a flaky mock endpoint",
            "Read Fowler's circuit breaker article; draw a state diagram (closed, open, half-open) with transition conditions",
            "Write a paragraph explaining the difference between at-least-once and exactly-once delivery and why exactly-once is so hard",
          ],
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
            {
              title: "Avoiding insurmountable queue backlogs — AWS Builders' Library",
              url: "https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/",
              type: "article",
            },
            {
              title: "Idempotency — ByteByteGo",
              url: "https://www.youtube.com/watch?v=4OuaONkZw1I",
              type: "video",
            },
            {
              title: "Resilience4j — circuit breaker docs",
              url: "https://resilience4j.readme.io/docs/circuitbreaker",
              type: "docs",
              note: "Popular Java resilience library — good to see a real implementation",
            },
            {
              title: "Implementing reliable delivery with idempotency — Brandur",
              url: "https://brandur.org/idempotency-keys",
              type: "article",
              note: "Excellent deep dive on implementing idempotency at the application level",
            },
          ],
        },
        {
          slug: "message-queues",
          title: "Message Queues & Pub/Sub",
          summary:
            "Async decoupling with queues, consumer groups, ordering guarantees, dead-letter queues, Kafka vs RabbitMQ vs SQS.",
          why: "The default answer to spikes, slow consumers, and fan-out — every large design includes one.",
          tasks: [
            "Read the Kafka introduction; explain topics, partitions, consumer groups, and offsets in one sentence each",
            "Read the AWS message queue overview; compare point-to-point queues vs pub/sub with a use case for each",
            "Watch the ByteByteGo Kafka vs RabbitMQ video; create a comparison table covering ordering guarantees, delivery semantics, and throughput",
            "Implement a simple in-memory message queue in Python with enqueue, dequeue, and acknowledgment (re-deliver on timeout)",
            "Explain what a dead-letter queue is and design a retry policy with 3 retries and exponential backoff before dead-lettering",
          ],
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
            {
              title: "RabbitMQ tutorials — official getting started",
              url: "https://www.rabbitmq.com/tutorials",
              type: "docs",
            },
            {
              title: "Message queues — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=oUJbuFMyBDk",
              type: "video",
            },
            {
              title: "Amazon SQS — developer guide",
              url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html",
              type: "docs",
              note: "The most-used managed queue — good to know SQS vs SNS vs Kinesis",
            },
            {
              title: "System Design Primer — asynchronism section",
              url: "https://github.com/donnemartin/system-design-primer#asynchronism",
              type: "article",
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
          tasks: [
            "Read Fowler's 'What do you mean by Event-Driven?' article; distinguish event notification, event-carried state transfer, event sourcing, and CQRS in one sentence each",
            "Read Jay Kreps' 'The Log' article; explain in a paragraph why an append-only log is a unifying abstraction for data systems",
            "Read the Kafka Streams docs overview; describe how stream processing differs from batch processing with a concrete example",
            "Design an event-sourced order system: define 4 events (OrderPlaced, ItemAdded, etc.), show how to rebuild current state from the event log",
            "Write a paragraph on when event sourcing adds unnecessary complexity and a simpler pattern would suffice",
          ],
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
            {
              title: "Event sourcing pattern — Microsoft Azure Architecture",
              url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing",
              type: "article",
            },
            {
              title: "CQRS pattern — Martin Fowler",
              url: "https://martinfowler.com/bliki/CQRS.html",
              type: "article",
            },
            {
              title: "Event-driven architecture explained — ByteByteGo",
              url: "https://www.youtube.com/watch?v=gOuAqRaDdHA",
              type: "video",
            },
            {
              title: "Designing Event-Driven Systems — Ben Stopford (free Confluent ebook)",
              url: "https://www.confluent.io/resources/ebook/designing-event-driven-systems/",
              type: "book",
              note: "Free ebook covering event-driven patterns with Kafka",
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
          tasks: [
            "Read Fowler's microservices article; list 5 characteristics of microservices and one operational cost for each",
            "Read Fowler's 'Monolith First' article; write 3 sentences on why starting with a monolith is usually safer",
            "Browse the microservices.io pattern catalog; pick 3 patterns (e.g., Saga, Database per Service, Strangler Fig) and summarize each in 2 sentences",
            "Draw an architecture diagram for a small e-commerce app as both a monolith and as microservices; annotate where the complexity shifts",
          ],
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
            {
              title: "Microservices vs monolith — ByteByteGo",
              url: "https://www.youtube.com/watch?v=lL_j7ilk7rc",
              type: "video",
            },
            {
              title: "Building Microservices — Sam Newman",
              url: "https://samnewman.io/books/building_microservices_2nd_edition/",
              type: "book",
              note: "The standard reference for microservices architecture decisions",
            },
            {
              title: "To microservices and back again — why Segment went monolith",
              url: "https://www.infoq.com/news/2020/04/microservices-back-again/",
              type: "article",
            },
            {
              title: "Strangler fig application — Martin Fowler",
              url: "https://martinfowler.com/bliki/StranglerFigApplication.html",
              type: "article",
            },
          ],
        },
        {
          slug: "observability",
          title: "Observability (Logs, Metrics, Traces)",
          summary:
            "The three pillars, SLIs/SLOs, alerting on symptoms not causes, distributed tracing.",
          why: "'How would you know it's broken?' is a guaranteed follow-up — SLO vocabulary answers it cleanly.",
          tasks: [
            "Read the Google SRE book chapter on monitoring; define SLI, SLO, and SLA with a concrete example for a web API",
            "Read the AWS Builders' Library article on instrumenting distributed systems; list the three observability pillars and what each is best at revealing",
            "Read the OpenTelemetry observability primer; explain how distributed tracing connects logs across services using trace IDs",
            "Design an alerting strategy for an API service: pick 3 SLIs, set SLO targets, and define what triggers a page vs a ticket",
          ],
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
            {
              title: "SLIs, SLOs, SLAs explained — Google Cloud",
              url: "https://cloud.google.com/blog/products/devops-sre/sre-fundamentals-slis-slas-and-slos",
              type: "article",
            },
            {
              title: "Distributed tracing — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=idDu_jXqf4E",
              type: "video",
            },
            {
              title: "The Google SRE book (free online)",
              url: "https://sre.google/sre-book/table-of-contents/",
              type: "book",
              note: "Chapters on monitoring, alerting, and SLOs are essential reading",
            },
            {
              title: "Prometheus documentation — concepts",
              url: "https://prometheus.io/docs/concepts/metric_types/",
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
          tasks: [
            "Memorize the latency numbers from Jeff Dean's gist; quiz yourself on L1 cache, SSD read, network round-trip, and disk seek",
            "Read the System Design Primer back-of-the-envelope section; practice estimating QPS for Twitter (500M users, 200M DAU, average tweets/day)",
            "Read the Hello Interview capacity planning walkthrough; estimate storage for a URL shortener handling 100M new URLs/month for 5 years",
            "Do 3 timed estimation exercises: pick a service (YouTube, Uber, WhatsApp) and estimate QPS, storage, and bandwidth in under 5 minutes each",
          ],
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
            {
              title: "Back-of-the-envelope estimation — ByteByteGo",
              url: "https://www.youtube.com/watch?v=UC5xf8FbdJc",
              type: "video",
            },
            {
              title:
                "System Design Interview — Alex Xu (ch. 2, back-of-the-envelope)",
              url: "https://bytebytego.com/courses/system-design-interview/back-of-the-envelope-estimation",
              type: "course",
            },
            {
              title: "Numbers every programmer should know by year — Colin Scott",
              url: "https://colin-scott.github.io/personal_website/research/interactive_latency.html",
              type: "practice",
              note: "Interactive visualization of latency numbers that updates by year",
            },
          ],
        },
        {
          slug: "security-basics",
          title: "Security Essentials",
          summary:
            "AuthN vs AuthZ, OAuth2/OIDC, JWTs, OWASP Top 10, secrets management, TLS everywhere.",
          why: "Designs that hand-wave auth get picked apart; OAuth flows are asked directly at senior levels.",
          tasks: [
            "Read the OWASP Top 10; pick the 5 most relevant to API design and write one mitigation for each",
            "Read Aaron Parecki's OAuth 2.0 simplified guide; draw the Authorization Code flow with PKCE step by step",
            "Watch the illustrated OAuth and OIDC video; explain the difference between authentication and authorization with a real-world analogy",
            "Decode a JWT at jwt.io; identify the header, payload, and signature sections and explain what each contains",
            "Design the auth layer for a multi-tenant SaaS app: choose between session tokens and JWTs, and justify your choice",
          ],
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
            {
              title: "JWT.io — decode, verify, and learn about JWTs",
              url: "https://jwt.io/introduction",
              type: "docs",
            },
            {
              title: "Session vs JWT authentication — ByteByteGo",
              url: "https://www.youtube.com/watch?v=fyTxwIa-1U0",
              type: "video",
            },
            {
              title: "OWASP cheat sheet series — authentication",
              url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
              type: "docs",
              note: "Practical security checklists for authentication and session management",
            },
            {
              title: "AWS IAM — how it works",
              url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/intro-structure.html",
              type: "docs",
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
          tasks: [
            "Read the Hello Interview URL shortener breakdown; list the functional and non-functional requirements before peeking at the solution",
            "Watch the ByteByteGo URL shortener video; draw the full architecture diagram from memory including ID generation, cache, and DB layers",
            "Read the System Design Primer Pastebin/URL shortener solution; compare base62 encoding vs pre-generated key tables for short URL generation",
            "Do a timed 35-minute mock: design a URL shortener on paper covering estimation, API, data model, and scaling — then compare against the Hello Interview breakdown",
          ],
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
            {
              title: "Designing a URL shortener — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=fMZMm_0ZhK4",
              type: "video",
            },
            {
              title:
                "System Design Interview — Alex Xu (ch. 8, URL shortener)",
              url: "https://bytebytego.com/courses/system-design-interview/design-a-url-shortener",
              type: "course",
            },
            {
              title: "Implementing a URL shortener — highscalability.com",
              url: "http://highscalability.com/blog/2014/7/14/bitly-lessons-learned-building-a-distributed-system-that-han.html",
              type: "article",
              note: "Real lessons from Bitly on building at scale",
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
          tasks: [
            "Read the Hello Interview WhatsApp breakdown; list requirements and identify the hardest scaling challenge before reading the solution",
            "Read the Discord blog on storing trillions of messages; explain their choice of database and partition key in 3 sentences",
            "Watch the ByteByteGo Discord design video; draw the WebSocket connection management layer showing how a message reaches the right server",
            "Design the offline message sync flow: what happens when a user comes online after 3 days? Draw the sequence diagram",
            "Do a timed 35-minute mock: design a 1-on-1 and group chat system, then compare against the Hello Interview solution",
          ],
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
            {
              title: "Designing a chat system — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=zKPNUMkwOJE",
              type: "video",
            },
            {
              title:
                "System Design Interview — Alex Xu (ch. 12, chat system)",
              url: "https://bytebytego.com/courses/system-design-interview/design-a-chat-system",
              type: "course",
            },
            {
              title: "How Slack works — Slack engineering blog",
              url: "https://slack.engineering/flannel-an-application-level-edge-cache-to-make-slack-scale/",
              type: "article",
              note: "How Slack uses edge caching to deliver messages at scale",
            },
            {
              title: "WhatsApp system architecture — highscalability.com",
              url: "http://highscalability.com/blog/2014/2/26/the-whatsapp-architecture-facebook-bought-for-19-billion.html",
              type: "article",
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
          tasks: [
            "Read the Hello Interview FB News Feed breakdown; explain fan-out-on-write vs fan-out-on-read with a diagram for each",
            "Watch the ByteByteGo news feed video; describe the celebrity problem and how a hybrid fan-out approach solves it",
            "Watch the Twitter timeline InfoQ talk; note 3 architectural decisions Twitter made and the trade-offs of each",
            "Design the feed ranking layer: propose 3 signals for ordering posts and explain how you'd avoid showing stale content",
            "Do a timed 35-minute mock: design a social media news feed, then compare against the Hello Interview solution",
          ],
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
            {
              title: "Designing a news feed system — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=fMZMm_0ZhK4",
              type: "video",
            },
            {
              title:
                "System Design Interview — Alex Xu (ch. 11, news feed)",
              url: "https://bytebytego.com/courses/system-design-interview/design-a-news-feed-system",
              type: "course",
            },
            {
              title: "Facebook's news feed architecture — highscalability.com",
              url: "http://highscalability.com/blog/2013/7/8/the-architecture-twitter-uses-to-deal-with-150m-active-users.html",
              type: "article",
            },
            {
              title: "System Design Primer — Twitter timeline solution",
              url: "https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/twitter/README.md",
              type: "article",
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
          tasks: [
            "Read the Hello Interview YouTube breakdown; list the upload pipeline steps from raw file to playable video",
            "Watch the ByteByteGo YouTube design video; draw the transcoding pipeline architecture showing how a video gets split into multiple resolutions",
            "Browse the Netflix tech blog; find one post on video encoding and summarize their approach to adaptive bitrate streaming in 3 sentences",
            "Design the view counting system: explain why a naive counter fails at scale and propose a solution using async aggregation",
            "Do a timed 35-minute mock: design a video streaming platform, then compare against the Hello Interview solution",
          ],
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
            {
              title: "Designing YouTube — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=psQzyFfsUGU",
              type: "video",
            },
            {
              title: "System Design Interview vol. 2 — Alex Xu (ch. 10, YouTube)",
              url: "https://bytebytego.com/courses/system-design-interview/design-youtube",
              type: "course",
            },
            {
              title: "How video streaming works — HLS and DASH explained",
              url: "https://www.cloudflare.com/learning/video/what-is-streaming/",
              type: "article",
            },
            {
              title: "Amazon S3 — object storage for media",
              url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
              type: "docs",
              note: "Understanding blob storage is key for any media-heavy design",
            },
          ],
        },
        {
          slug: "design-web-crawler",
          title: "Design: Web Crawler",
          summary:
            "Frontier management, politeness, dedup at scale (bloom filters), distributed coordination, freshness.",
          why: "Tests queues, dedup structures, and rate limiting together; a favorite for infra-leaning roles.",
          tasks: [
            "Read the Hello Interview web crawler breakdown; list the core components (frontier, fetcher, parser, dedup) and what each does",
            "Read the System Design Primer web crawler solution; explain how a bloom filter enables URL deduplication at scale and its false-positive trade-off",
            "Watch the ByteByteGo bloom filter video; implement a simple bloom filter in Python with 3 hash functions and test its false-positive rate",
            "Design the politeness layer: explain how to respect robots.txt and rate-limit requests per domain without starving the crawl",
            "Do a timed 35-minute mock: design a web crawler for a search engine, then compare against the Hello Interview solution",
          ],
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
            {
              title: "Designing a web crawler — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=BKZxZwUgL3Y",
              type: "video",
            },
            {
              title:
                "System Design Interview — Alex Xu (ch. 9, web crawler)",
              url: "https://bytebytego.com/courses/system-design-interview/design-a-web-crawler",
              type: "course",
            },
            {
              title: "Scrapy architecture overview",
              url: "https://docs.scrapy.org/en/latest/topics/architecture.html",
              type: "docs",
              note: "Real crawler framework architecture — useful reference for design discussions",
            },
            {
              title: "Mercator: a scalable, extensible web crawler — research paper",
              url: "https://courses.cs.washington.edu/courses/cse454/15wi/papers/mercator.pdf",
              type: "article",
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
          tasks: [
            "Watch the ByteByteGo typeahead suggestion video; draw the architecture showing the trie service, aggregation pipeline, and cache layer",
            "Read the Hello Interview post search breakdown; explain how top-K results are aggregated from distributed trie shards",
            "Read the Elasticsearch search suggesters docs; compare completion suggesters vs phrase suggesters and when to use each",
            "Implement a trie in Python that supports insert, search, and prefix-based top-K suggestions ranked by frequency",
            "Do a timed 35-minute mock: design a search autocomplete system, then compare against the Hello Interview solution",
          ],
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
            {
              title: "Designing autocomplete — Gaurav Sen",
              url: "https://www.youtube.com/watch?v=xrYTjaK5QVM",
              type: "video",
            },
            {
              title:
                "System Design Interview — Alex Xu (ch. 13, autocomplete)",
              url: "https://bytebytego.com/courses/system-design-interview/design-a-search-autocomplete-system",
              type: "course",
            },
            {
              title: "How search works — Google",
              url: "https://www.google.com/search/howsearchworks/",
              type: "article",
              note: "High-level overview from Google on crawling, indexing, and serving",
            },
            {
              title: "Trie data structure — implement autocomplete (LeetCode 208 + 211)",
              url: "https://leetcode.com/problems/implement-trie-prefix-tree/",
              type: "practice",
            },
          ],
          projectSlugs: ["trie-autocomplete"],
        },
      ],
    },
  ],
};
