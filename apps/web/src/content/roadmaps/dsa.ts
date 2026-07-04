import type { Roadmap } from "../types";

export const dsaRoadmap: Roadmap = {
  pillar: "dsa",
  title: "Data Structures & Algorithms",
  description:
    "Pattern-first path through DSA: master a technique, then drill it with problems. Ordering follows the NeetCode/Striver progression so each topic builds on the last.",
  stages: [
    {
      title: "Foundations",
      nodes: [
        {
          slug: "big-o",
          title: "Big-O & Complexity Analysis",
          summary:
            "How to measure time and space cost of code: O(1), O(log n), O(n), O(n log n), O(n²), amortized analysis.",
          why: "Every interview answer starts with 'what's the complexity?' — you can't pick the right approach without this lens.",
          estHours: 4,
          resources: [
            {
              title: "Big-O Notation in 100 Seconds → full explanation (NeetCode)",
              url: "https://www.youtube.com/watch?v=BgLTDT03QtU",
              type: "video",
            },
            {
              title: "Big-O Cheat Sheet — complexities of common structures",
              url: "https://www.bigocheatsheet.com/",
              type: "article",
            },
            {
              title: "VisuAlgo — interactive algorithm visualizations",
              url: "https://visualgo.net/en",
              type: "practice",
            },
          ],
        },
        {
          slug: "arrays-strings",
          title: "Arrays & Strings",
          summary:
            "Contiguous memory, indexing, in-place manipulation, prefix sums, string building and immutability.",
          why: "The substrate for ~40% of all interview problems; prefix sums alone unlock a whole problem family.",
          estHours: 8,
          resources: [
            {
              title: "LeetCode Arrays 101 Explore Card",
              url: "https://leetcode.com/explore/learn/card/fun-with-arrays/",
              type: "course",
            },
            {
              title: "NeetCode — Arrays & Hashing playlist",
              url: "https://neetcode.io/practice",
              type: "practice",
              note: "Do the Arrays & Hashing section of NeetCode 150",
            },
            {
              title: "Prefix Sums — USACO Guide",
              url: "https://usaco.guide/silver/prefix-sums",
              type: "article",
            },
          ],
          projectSlugs: ["ds-library"],
        },
        {
          slug: "hashing",
          title: "Hash Maps & Sets",
          summary:
            "Hash functions, collision handling, O(1) lookup tables, frequency counting, seen-sets.",
          why: "The single most-used tool in interviews — 'can a hash map make this O(n)?' is always the first question to ask.",
          estHours: 6,
          resources: [
            {
              title: "Hash Tables — CS50 shorts",
              url: "https://www.youtube.com/watch?v=nvzVHwrrub0",
              type: "video",
            },
            {
              title: "LeetCode Hash Table Explore Card",
              url: "https://leetcode.com/explore/learn/card/hash-table/",
              type: "course",
            },
            {
              title: "Open addressing vs chaining — cp-algorithms style writeup",
              url: "https://en.wikipedia.org/wiki/Hash_table",
              type: "article",
            },
          ],
          projectSlugs: ["ds-library", "lru-lfu-cache"],
        },
      ],
    },
    {
      title: "Core Patterns",
      nodes: [
        {
          slug: "two-pointers",
          title: "Two Pointers",
          summary:
            "Converging, parallel, and fast/slow pointer techniques over sorted arrays and sequences.",
          why: "Turns brute-force O(n²) pair scans into O(n); shows up in dozens of top-100 problems.",
          estHours: 6,
          row: 1,
          resources: [
            {
              title: "NeetCode — Two Pointers section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
            {
              title: "Two Pointers technique — LeetCode tag",
              url: "https://leetcode.com/tag/two-pointers/",
              type: "practice",
            },
            {
              title: "Striver's A2Z DSA sheet",
              url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
              type: "course",
              note: "Steps 3-5 cover pointer patterns with videos",
            },
          ],
        },
        {
          slug: "sliding-window",
          title: "Sliding Window",
          summary:
            "Fixed and variable-size windows for substring/subarray problems; expand-shrink with a hash map.",
          why: "The canonical way to handle 'longest/shortest subarray with property X' — a guaranteed interview topic.",
          estHours: 6,
          row: 1,
          resources: [
            {
              title: "Sliding Window Technique — NeetCode video",
              url: "https://www.youtube.com/watch?v=1pkOgXD63yU",
              type: "video",
            },
            {
              title: "NeetCode — Sliding Window section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
            {
              title: "LeetCode sliding-window tag",
              url: "https://leetcode.com/tag/sliding-window/",
              type: "practice",
            },
          ],
        },
        {
          slug: "stack",
          title: "Stack & Monotonic Stack",
          summary:
            "LIFO processing, matching brackets, expression evaluation, and monotonic stacks for next-greater-element problems.",
          why: "Monotonic stack is the trick behind a family of 'previous/next greater' problems that are brutal without it.",
          estHours: 6,
          row: 2,
          resources: [
            {
              title: "LeetCode Queue & Stack Explore Card",
              url: "https://leetcode.com/explore/learn/card/queue-stack/",
              type: "course",
            },
            {
              title: "Monotonic Stack — USACO Guide",
              url: "https://usaco.guide/gold/stacks",
              type: "article",
            },
            {
              title: "NeetCode — Stack section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
          ],
          projectSlugs: ["json-parser"],
        },
        {
          slug: "queue-deque",
          title: "Queues & Deques",
          summary:
            "FIFO processing, circular buffers, and deques for sliding-window-maximum style problems.",
          why: "Foundation for BFS later; the monotonic deque pattern is a classic hard-problem unlock.",
          estHours: 4,
          row: 2,
          resources: [
            {
              title: "Queues — VisuAlgo",
              url: "https://visualgo.net/en/list",
              type: "practice",
            },
            {
              title: "Sliding Window Maximum (monotonic deque) — NeetCode",
              url: "https://www.youtube.com/watch?v=DfljaUwZsOk",
              type: "video",
            },
            {
              title: "Python collections.deque docs",
              url: "https://docs.python.org/3/library/collections.html#collections.deque",
              type: "docs",
            },
          ],
        },
        {
          slug: "linked-lists",
          title: "Linked Lists",
          summary:
            "Singly/doubly linked lists, pointer surgery, reversal, cycle detection (Floyd's), merging.",
          why: "Tests raw pointer manipulation; fast/slow cycle detection is a perennial favorite.",
          estHours: 6,
          resources: [
            {
              title: "LeetCode Linked List Explore Card",
              url: "https://leetcode.com/explore/learn/card/linked-list/",
              type: "course",
            },
            {
              title: "NeetCode — Linked List section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
            {
              title: "Floyd's cycle detection explained",
              url: "https://cp-algorithms.com/others/tortoise_and_hare.html",
              type: "article",
            },
          ],
          projectSlugs: ["ds-library", "lru-lfu-cache"],
        },
        {
          slug: "binary-search",
          title: "Binary Search",
          summary:
            "Classic search plus 'binary search on the answer' — searching any monotonic condition space.",
          why: "The O(log n) workhorse; the on-the-answer variant solves problems that look nothing like search.",
          estHours: 6,
          row: 3,
          resources: [
            {
              title: "LeetCode Binary Search Explore Card",
              url: "https://leetcode.com/explore/learn/card/binary-search/",
              type: "course",
            },
            {
              title: "Binary Search — cp-algorithms",
              url: "https://cp-algorithms.com/num_methods/binary_search.html",
              type: "article",
            },
            {
              title: "NeetCode — Binary Search section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
          ],
        },
        {
          slug: "sorting",
          title: "Sorting Algorithms",
          summary:
            "Merge sort, quick sort, heap sort, counting sort — mechanics, stability, and when each wins.",
          why: "Sort-first is a common simplification step, and merge/quick sort mechanics get asked directly.",
          estHours: 6,
          row: 3,
          resources: [
            {
              title: "Sorting — VisuAlgo interactive",
              url: "https://visualgo.net/en/sorting",
              type: "practice",
            },
            {
              title: "Abdul Bari — Algorithms playlist (sorting lectures)",
              url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
              type: "video",
            },
            {
              title: "Sorting summary — USACO Guide",
              url: "https://usaco.guide/bronze/intro-sorting",
              type: "article",
            },
          ],
          projectSlugs: ["ds-library"],
        },
        {
          slug: "recursion",
          title: "Recursion & Divide-and-Conquer",
          summary:
            "Base cases, call stacks, recurrence relations, and splitting problems into independent halves.",
          why: "The mental model that trees, backtracking, and DP are all built on — weak recursion sinks everything after it.",
          estHours: 6,
          resources: [
            {
              title: "Recursion — LeetCode Explore Card (part I)",
              url: "https://leetcode.com/explore/learn/card/recursion-i/",
              type: "course",
            },
            {
              title: "Abdul Bari — recursion lectures",
              url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
              type: "video",
            },
            {
              title: "Master theorem — cp-algorithms adjacent writeup",
              url: "https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)",
              type: "article",
            },
          ],
        },
      ],
    },
    {
      title: "Trees & Heaps",
      nodes: [
        {
          slug: "binary-trees",
          title: "Binary Trees",
          summary:
            "Tree traversal (pre/in/post/level order), recursion on trees, depth/diameter/path problems.",
          why: "Trees are the most-asked interview structure, and traversal recursion is the template for all of them.",
          estHours: 8,
          resources: [
            {
              title: "LeetCode Binary Tree Explore Card",
              url: "https://leetcode.com/explore/learn/card/data-structure-tree/",
              type: "course",
            },
            {
              title: "NeetCode — Trees section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
            {
              title: "Tree traversals — VisuAlgo",
              url: "https://visualgo.net/en/bst",
              type: "practice",
            },
          ],
        },
        {
          slug: "bst",
          title: "Binary Search Trees",
          summary:
            "BST invariant, insert/delete/search, validation, in-order successor, and balanced-tree intuition.",
          why: "The in-order-traversal-is-sorted property powers a family of elegant problems; also explains how DB indexes think.",
          estHours: 5,
          row: 1,
          resources: [
            {
              title: "BST operations — VisuAlgo",
              url: "https://visualgo.net/en/bst",
              type: "practice",
            },
            {
              title: "Validate BST — NeetCode walkthrough",
              url: "https://www.youtube.com/watch?v=s6ATEkipzow",
              type: "video",
            },
            {
              title: "Self-balancing trees (AVL/Red-Black) overview",
              url: "https://en.wikipedia.org/wiki/Self-balancing_binary_search_tree",
              type: "article",
            },
          ],
        },
        {
          slug: "heaps",
          title: "Heaps & Priority Queues",
          summary:
            "Binary heap mechanics, heapify, top-K problems, two-heap median pattern, K-way merge.",
          why: "'Top K' and 'K-way merge' problems are everywhere, and heaps are the only efficient answer.",
          estHours: 6,
          row: 1,
          resources: [
            {
              title: "Heaps — VisuAlgo",
              url: "https://visualgo.net/en/heap",
              type: "practice",
            },
            {
              title: "NeetCode — Heap / Priority Queue section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
            {
              title: "Python heapq — official docs",
              url: "https://docs.python.org/3/library/heapq.html",
              type: "docs",
            },
          ],
          projectSlugs: ["rate-limiter-lib"],
        },
        {
          slug: "tries",
          title: "Tries (Prefix Trees)",
          summary:
            "Character-by-character trees for prefix matching, autocomplete, and word search problems.",
          why: "The right structure whenever the word 'prefix' appears; a favorite medium-hard interview topic.",
          estHours: 4,
          resources: [
            {
              title: "Implement Trie — NeetCode walkthrough",
              url: "https://www.youtube.com/watch?v=oobqoCJlHA0",
              type: "video",
            },
            {
              title: "LeetCode Trie Explore Card",
              url: "https://leetcode.com/explore/learn/card/trie/",
              type: "course",
            },
            {
              title: "Trie — USACO Guide",
              url: "https://usaco.guide/adv/string-search",
              type: "article",
            },
          ],
          projectSlugs: ["trie-autocomplete"],
        },
      ],
    },
    {
      title: "Graphs",
      nodes: [
        {
          slug: "graph-basics-bfs-dfs",
          title: "Graph Representations, BFS & DFS",
          summary:
            "Adjacency lists/matrices, BFS for shortest unweighted paths, DFS for connectivity, islands, and flood fill.",
          why: "Graphs are the hardest common interview family — BFS/DFS fluency is the entry ticket.",
          estHours: 10,
          resources: [
            {
              title: "Graph Algorithms for Technical Interviews — freeCodeCamp (5h)",
              url: "https://www.youtube.com/watch?v=tWVWeAqZ0WU",
              type: "video",
            },
            {
              title: "NeetCode — Graphs section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
            {
              title: "BFS — cp-algorithms",
              url: "https://cp-algorithms.com/graph/breadth-first-search.html",
              type: "article",
            },
          ],
          projectSlugs: ["pathfinding-visualizer"],
        },
        {
          slug: "topological-sort",
          title: "Topological Sort",
          summary:
            "Ordering DAG nodes by dependency: Kahn's algorithm (BFS) and DFS post-order, cycle detection.",
          why: "Course-schedule-style dependency problems are an interview staple, and it powers real build systems.",
          estHours: 4,
          row: 1,
          resources: [
            {
              title: "Topological Sort — cp-algorithms",
              url: "https://cp-algorithms.com/graph/topological-sort.html",
              type: "article",
            },
            {
              title: "Course Schedule — NeetCode walkthrough",
              url: "https://www.youtube.com/watch?v=EgI5nU9etnU",
              type: "video",
            },
            {
              title: "LeetCode topological-sort tag",
              url: "https://leetcode.com/tag/topological-sort/",
              type: "practice",
            },
          ],
        },
        {
          slug: "union-find",
          title: "Union-Find (DSU)",
          summary:
            "Disjoint sets with path compression and union by rank for dynamic connectivity problems.",
          why: "Turns 'are these connected / count components as edges arrive' into near-O(1) — unbeatable when it applies.",
          estHours: 4,
          row: 1,
          resources: [
            {
              title: "Disjoint Set Union — cp-algorithms",
              url: "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
              type: "article",
            },
            {
              title: "Union Find in 5 minutes — NeetCode",
              url: "https://www.youtube.com/watch?v=8f1XPm4WOUc",
              type: "video",
            },
            {
              title: "USACO Guide — DSU",
              url: "https://usaco.guide/gold/dsu",
              type: "article",
            },
          ],
        },
        {
          slug: "shortest-paths",
          title: "Shortest Paths (Dijkstra, Bellman-Ford)",
          summary:
            "Weighted shortest paths: Dijkstra with a heap, Bellman-Ford for negative edges, intro to A*.",
          why: "The capstone graph algorithm — appears in interviews and in every routing/maps system you'll ever design.",
          estHours: 6,
          resources: [
            {
              title: "Dijkstra — cp-algorithms",
              url: "https://cp-algorithms.com/graph/dijkstra.html",
              type: "article",
            },
            {
              title: "Dijkstra's algorithm — Computerphile",
              url: "https://www.youtube.com/watch?v=GazC3A4OQTE",
              type: "video",
            },
            {
              title: "CSES Graph problems set",
              url: "https://cses.fi/problemset/",
              type: "practice",
              note: "Graph section — brutal but the best drill set there is",
            },
          ],
          projectSlugs: ["pathfinding-visualizer"],
        },
      ],
    },
    {
      title: "Backtracking, Greedy & DP",
      nodes: [
        {
          slug: "backtracking",
          title: "Backtracking",
          summary:
            "Systematic choice-explore-unchoose search: subsets, permutations, combination sums, N-Queens, word search.",
          why: "The bridge between recursion and DP; 'generate all X' problems have exactly one right template.",
          estHours: 8,
          resources: [
            {
              title: "Backtracking template explained — NeetCode subsets video",
              url: "https://www.youtube.com/watch?v=REOH22Xwdkk",
              type: "video",
            },
            {
              title: "NeetCode — Backtracking section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
            {
              title: "USACO Guide — complete search with recursion",
              url: "https://usaco.guide/bronze/complete-rec",
              type: "article",
            },
          ],
          projectSlugs: ["mini-regex"],
        },
        {
          slug: "greedy",
          title: "Greedy Algorithms",
          summary:
            "Local-optimum choices with an exchange-argument proof mindset: jump game, gas station, scheduling.",
          why: "When greedy works it destroys the DP alternative — the skill is proving to yourself it's safe.",
          estHours: 5,
          row: 1,
          resources: [
            {
              title: "NeetCode — Greedy section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
            {
              title: "Greedy algorithms — USACO Guide",
              url: "https://usaco.guide/silver/greedy-sorting",
              type: "article",
            },
            {
              title: "LeetCode greedy tag",
              url: "https://leetcode.com/tag/greedy/",
              type: "practice",
            },
          ],
        },
        {
          slug: "intervals",
          title: "Intervals",
          summary:
            "Sort-then-sweep over ranges: merge intervals, meeting rooms, insert interval, min arrows.",
          why: "A compact, learnable pattern that shows up constantly in scheduling-flavored questions.",
          estHours: 4,
          row: 1,
          resources: [
            {
              title: "NeetCode — Intervals section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
            {
              title: "Merge Intervals — NeetCode walkthrough",
              url: "https://www.youtube.com/watch?v=44H3cEC2fFM",
              type: "video",
            },
            {
              title: "LeetCode intervals problem list",
              url: "https://leetcode.com/tag/line-sweep/",
              type: "practice",
            },
          ],
        },
        {
          slug: "dp-1d",
          title: "1-D Dynamic Programming",
          summary:
            "Memoization vs tabulation, state definition, transitions: climbing stairs, house robber, coin change, LIS.",
          why: "DP separates strong candidates from the rest; 1-D problems teach the state-definition skill everything else needs.",
          estHours: 12,
          resources: [
            {
              title: "Dynamic Programming — 5 steps framework (Reducible)",
              url: "https://www.youtube.com/watch?v=aPQY__2H3tE",
              type: "video",
            },
            {
              title: "NeetCode — 1-D DP section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
            {
              title: "DP introduction — USACO Guide",
              url: "https://usaco.guide/gold/intro-dp",
              type: "article",
            },
          ],
        },
        {
          slug: "dp-2d",
          title: "Multi-dimensional DP",
          summary:
            "Grid DP, knapsack, edit distance, longest common subsequence, interval DP, DP on strings.",
          why: "Knapsack + LCS + edit distance are the three archetypes behind most hard DP interview questions.",
          estHours: 12,
          resources: [
            {
              title: "NeetCode — 2-D DP section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
            {
              title: "Knapsack patterns — USACO Guide",
              url: "https://usaco.guide/gold/knapsack",
              type: "article",
            },
            {
              title: "Edit Distance — NeetCode walkthrough",
              url: "https://www.youtube.com/watch?v=XYi2-LPrwm4",
              type: "video",
            },
          ],
          projectSlugs: ["mini-regex"],
        },
      ],
    },
    {
      title: "Advanced",
      nodes: [
        {
          slug: "bit-manipulation",
          title: "Bit Manipulation",
          summary:
            "AND/OR/XOR tricks, masks, counting bits, single-number problems, bitset thinking.",
          why: "Cheap wins on a small set of classic problems, and essential vocabulary for low-level work.",
          estHours: 4,
          row: 1,
          resources: [
            {
              title: "Bit Twiddling Hacks — Sean Anderson (Stanford)",
              url: "https://graphics.stanford.edu/~seander/bithacks.html",
              type: "article",
            },
            {
              title: "NeetCode — Bit Manipulation section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
            {
              title: "Bitwise operations — cp-algorithms",
              url: "https://cp-algorithms.com/algebra/bit-manipulation.html",
              type: "article",
            },
          ],
        },
        {
          slug: "math-geometry",
          title: "Math & Geometry",
          summary:
            "GCD/LCM, primes and sieves, modular arithmetic, matrix rotation, coordinate tricks.",
          why: "Occasional but unavoidable; the sieve and modular arithmetic also underpin hashing and crypto.",
          estHours: 5,
          row: 1,
          resources: [
            {
              title: "Sieve of Eratosthenes — cp-algorithms",
              url: "https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html",
              type: "article",
            },
            {
              title: "NeetCode — Math & Geometry section (150)",
              url: "https://neetcode.io/practice",
              type: "practice",
            },
            {
              title: "Modular arithmetic — cp-algorithms",
              url: "https://cp-algorithms.com/algebra/module-inverse.html",
              type: "article",
            },
          ],
        },
        {
          slug: "string-algorithms",
          title: "String Algorithms (KMP, Rabin-Karp)",
          summary:
            "Prefix function/KMP for pattern matching, rolling hashes, Z-function, palindrome tricks.",
          why: "Substring-search questions become mechanical once you own the prefix function.",
          estHours: 6,
          resources: [
            {
              title: "Prefix function & KMP — cp-algorithms",
              url: "https://cp-algorithms.com/string/prefix-function.html",
              type: "article",
            },
            {
              title: "Rabin-Karp & rolling hashes — cp-algorithms",
              url: "https://cp-algorithms.com/string/string-hashing.html",
              type: "article",
            },
            {
              title: "KMP explained visually",
              url: "https://www.youtube.com/watch?v=V5-7GzOfADQ",
              type: "video",
            },
          ],
        },
        {
          slug: "segment-trees",
          title: "Segment & Fenwick Trees",
          summary:
            "Range queries with point updates in O(log n): segment trees, lazy propagation, binary indexed trees.",
          why: "Beyond-interview territory that occasionally appears in hard rounds; core competitive-programming kit.",
          estHours: 8,
          resources: [
            {
              title: "Segment Tree — cp-algorithms",
              url: "https://cp-algorithms.com/data_structures/segment_tree.html",
              type: "article",
            },
            {
              title: "Fenwick Tree — cp-algorithms",
              url: "https://cp-algorithms.com/data_structures/fenwick.html",
              type: "article",
            },
            {
              title: "CSES Range Queries section",
              url: "https://cses.fi/problemset/",
              type: "practice",
            },
          ],
        },
      ],
    },
  ],
};
