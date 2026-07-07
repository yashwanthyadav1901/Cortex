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
          tasks: [
            "Watch 'Big-O Notation in 100 Seconds → full explanation' by NeetCode and write down each complexity class with a concrete code example",
            "Analyze 10 short code snippets (nested loops, recursive calls, hash lookups) and label each with its Big-O time and space — then verify with the Big-O Cheat Sheet",
            "Step through 3 VisuAlgo visualizations (binary search, merge sort, BFS) and trace why each is O(log n), O(n log n), and O(V+E) respectively",
            "Write a cheat card from memory: list every common complexity class, one canonical algorithm for each, and its recurrence relation if applicable",
          ],
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
            {
              title: "Abdul Bari — Time Complexity analysis lecture",
              url: "https://www.youtube.com/watch?v=9TlHvipP5yA",
              type: "video",
              note: "One of the best step-by-step complexity breakdowns on YouTube",
            },
            {
              title: "Introduction to Algorithms (CLRS) — Chapter 3: Growth of Functions",
              url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
              type: "book",
            },
            {
              title: "GeeksforGeeks — Analysis of Algorithms",
              url: "https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/",
              type: "article",
            },
            {
              title: "TheAlgorithms — algorithm implementations in multiple languages",
              url: "https://github.com/TheAlgorithms",
              type: "docs",
              note: "Browse implementations to see complexity trade-offs in real code",
            },
          ],
        },
        {
          slug: "arrays-strings",
          title: "Arrays & Strings",
          summary:
            "Contiguous memory, indexing, in-place manipulation, prefix sums, string building and immutability.",
          why: "The substrate for ~40% of all interview problems; prefix sums alone unlock a whole problem family.",
          tasks: [
            "Complete the first 10 problems of the LeetCode Arrays 101 Explore Card",
            "Implement a prefix sum array from scratch and use it to solve 'Subarray Sum Equals K'",
            "Solve 3 sliding-window problems from the NeetCode Arrays & Hashing section: 'Two Sum', 'Group Anagrams', and 'Top K Frequent Elements'",
            "Read the USACO Guide prefix sums article and solve 2 practice problems from it",
            "Write out the time/space complexity for each solution and verify against the Big-O Cheat Sheet",
          ],
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
            {
              title: "mycodeschool — Arrays playlist",
              url: "https://www.youtube.com/playlist?list=PL2_aWCzGMAwLz3g66WrxFGSXvSsvyfzCO",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Array Data Structure guide",
              url: "https://www.geeksforgeeks.org/array-data-structure/",
              type: "article",
            },
            {
              title: "Introduction to Algorithms (CLRS) — Chapter 2: Getting Started",
              url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
              type: "book",
              note: "Covers insertion sort on arrays as a gateway to algorithm analysis",
            },
            {
              title: "LeetCode — Top Interview 150 (Arrays section)",
              url: "https://leetcode.com/studyplan/top-interview-150/",
              type: "practice",
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
          tasks: [
            "Watch the CS50 Hash Tables short and implement a hash map from scratch with chaining collision resolution",
            "Complete the LeetCode Hash Table Explore Card (first 8 problems)",
            "Solve 'Two Sum', 'Contains Duplicate', and 'Valid Anagram' using hash-map-based O(n) approaches",
            "Implement an LRU Cache (LeetCode #146) using a hash map + doubly linked list",
            "Reimplement your hash map with open addressing (linear probing) and compare performance against chaining",
          ],
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
            {
              title: "William Fiset — Hash table concepts",
              url: "https://www.youtube.com/watch?v=2E54GqF0H4s",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Hashing Data Structure",
              url: "https://www.geeksforgeeks.org/hashing-data-structure/",
              type: "article",
            },
            {
              title: "NeetCode — Hash Map implementation from scratch",
              url: "https://www.youtube.com/watch?v=cNWsgbKwwoU",
              type: "video",
              note: "Walks through building a hash map step by step in Python",
            },
            {
              title: "LeetCode — Top Interview 150 (Hashmap section)",
              url: "https://leetcode.com/studyplan/top-interview-150/",
              type: "practice",
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
          tasks: [
            "Solve 'Two Sum II' (sorted array) and 'Three Sum' using converging two pointers",
            "Solve 'Container With Most Water' and 'Trapping Rain Water' from the NeetCode Two Pointers section",
            "Implement the fast/slow pointer pattern to solve 'Linked List Cycle' and 'Happy Number'",
            "Complete all problems in Striver's A2Z sheet Steps 3-5 that use pointer techniques",
          ],
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
            {
              title: "Back To Back SWE — Two Pointer technique",
              url: "https://www.youtube.com/watch?v=xZ4AfXHQ1VQ",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Two Pointers technique",
              url: "https://www.geeksforgeeks.org/two-pointers-technique/",
              type: "article",
            },
            {
              title: "coding-interview-university — Two Pointers study notes",
              url: "https://github.com/jwasham/coding-interview-university",
              type: "docs",
              note: "Comprehensive study plan with two-pointer references in the arrays section",
            },
          ],
        },
        {
          slug: "sliding-window",
          title: "Sliding Window",
          summary:
            "Fixed and variable-size windows for substring/subarray problems; expand-shrink with a hash map.",
          why: "The canonical way to handle 'longest/shortest subarray with property X' — a guaranteed interview topic.",
          tasks: [
            "Watch the NeetCode Sliding Window Technique video and write out the expand-shrink template in your own code",
            "Solve 3 fixed-window problems: 'Maximum Sum Subarray of Size K', 'Maximum Average Subarray I', and 'Find All Anagrams in a String'",
            "Solve 3 variable-window problems: 'Longest Substring Without Repeating Characters', 'Minimum Window Substring', and 'Longest Repeating Character Replacement'",
            "Complete the full NeetCode 150 Sliding Window section and write a one-paragraph summary of when to use fixed vs variable windows",
          ],
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
            {
              title: "Abdul Bari — Sliding Window technique explained",
              url: "https://www.youtube.com/watch?v=p-ss2JNynmw",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Window Sliding technique",
              url: "https://www.geeksforgeeks.org/window-sliding-technique/",
              type: "article",
            },
            {
              title: "Algorithm Design Manual (Skiena) — Chapter 3",
              url: "https://www.algorist.com/",
              type: "book",
              note: "Covers data structure fundamentals underpinning sliding window patterns",
            },
          ],
        },
        {
          slug: "stack",
          title: "Stack & Monotonic Stack",
          summary:
            "LIFO processing, matching brackets, expression evaluation, and monotonic stacks for next-greater-element problems.",
          why: "Monotonic stack is the trick behind a family of 'previous/next greater' problems that are brutal without it.",
          tasks: [
            "Implement a stack from scratch (array-backed) and solve 'Valid Parentheses' and 'Min Stack'",
            "Complete the LeetCode Queue & Stack Explore Card stack section",
            "Read the USACO Guide monotonic stack article, then solve 'Next Greater Element I', 'Daily Temperatures', and 'Largest Rectangle in Histogram'",
            "Solve 'Evaluate Reverse Polish Notation' and 'Generate Parentheses' from the NeetCode Stack section",
          ],
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
            {
              title: "Back To Back SWE — Monotonic Stack explained",
              url: "https://www.youtube.com/watch?v=Dq_ObZwTY_Q",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Stack Data Structure",
              url: "https://www.geeksforgeeks.org/stack-data-structure/",
              type: "article",
            },
            {
              title: "mycodeschool — Stacks playlist (implementation + applications)",
              url: "https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_JlcBbtYTwiQSsOTa6P",
              type: "video",
            },
            {
              title: "Competitive Programmer's Handbook — Chapter 8: Stacks",
              url: "https://cses.fi/book/book.pdf",
              type: "book",
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
          tasks: [
            "Implement a queue from scratch using a circular buffer (fixed-size array)",
            "Watch the NeetCode 'Sliding Window Maximum' video and implement the monotonic deque solution",
            "Solve 'Sliding Window Maximum' (LeetCode #239) and 'Design Circular Deque' (LeetCode #641)",
            "Read the Python collections.deque docs and rewrite one of your queue solutions using deque to compare ergonomics",
          ],
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
            {
              title: "mycodeschool — Queues playlist (array and linked list implementations)",
              url: "https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_JlcBbtYTwiQSsOTa6P",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Queue Data Structure",
              url: "https://www.geeksforgeeks.org/queue-data-structure/",
              type: "article",
            },
            {
              title: "LeetCode — Design Circular Queue (problem #622)",
              url: "https://leetcode.com/problems/design-circular-queue/",
              type: "practice",
            },
          ],
        },
        {
          slug: "linked-lists",
          title: "Linked Lists",
          summary:
            "Singly/doubly linked lists, pointer surgery, reversal, cycle detection (Floyd's), merging.",
          why: "Tests raw pointer manipulation; fast/slow cycle detection is a perennial favorite.",
          tasks: [
            "Implement a singly linked list from scratch with insert, delete, search, and reverse operations",
            "Complete the LeetCode Linked List Explore Card (all problems)",
            "Solve 'Reverse Linked List', 'Merge Two Sorted Lists', and 'Reorder List' from NeetCode 150",
            "Read the Floyd's cycle detection article on cp-algorithms, then solve 'Linked List Cycle II' and 'Find the Duplicate Number'",
            "Implement a doubly linked list and use it to build an LRU Cache from scratch",
          ],
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
            {
              title: "mycodeschool — Linked List playlist",
              url: "https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_JlcBbtYTwiQSsOTa6P",
              type: "video",
              note: "One of the clearest linked list explanation series on YouTube",
            },
            {
              title: "GeeksforGeeks — Linked List Data Structure",
              url: "https://www.geeksforgeeks.org/data-structures/linked-list/",
              type: "article",
            },
            {
              title: "Tushar Roy — Linked List Interview Problems",
              url: "https://www.youtube.com/watch?v=KYH83T4q6Vs",
              type: "video",
            },
            {
              title: "TheAlgorithms — Linked List implementations",
              url: "https://github.com/TheAlgorithms/Python/tree/master/data_structures/linked_list",
              type: "docs",
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
          tasks: [
            "Complete the LeetCode Binary Search Explore Card (all 3 templates)",
            "Solve 'Binary Search', 'Search a 2D Matrix', and 'Koko Eating Bananas' from NeetCode 150",
            "Read the cp-algorithms binary search article and implement both lower-bound and upper-bound variants from scratch",
            "Solve 2 'binary search on the answer' problems: 'Capacity to Ship Packages Within D Days' and 'Split Array Largest Sum'",
          ],
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
            {
              title: "Abdul Bari — Binary Search lecture",
              url: "https://www.youtube.com/watch?v=C2apEw9pgtw",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Binary Search tutorial",
              url: "https://www.geeksforgeeks.org/binary-search/",
              type: "article",
            },
            {
              title: "Competitive Programmer's Handbook — Chapter 3: Sorting & Searching",
              url: "https://cses.fi/book/book.pdf",
              type: "book",
              note: "Covers binary search on the answer pattern used in competitive programming",
            },
            {
              title: "CSES Sorting & Searching problem set",
              url: "https://cses.fi/problemset/",
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
          tasks: [
            "Implement merge sort from scratch and trace the recursion tree for an 8-element array on paper",
            "Implement quicksort with Lomuto and Hoare partition schemes; compare their swap counts on a sorted vs random array",
            "Watch the Abdul Bari sorting lectures and implement counting sort for an array of integers in range [0, k]",
            "Use VisuAlgo's sorting page to visualize each algorithm, then write a comparison table: best/worst/average time, space, and stability for merge sort, quick sort, heap sort, and counting sort",
          ],
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
            {
              title: "William Fiset — Sorting algorithms playlist",
              url: "https://www.youtube.com/playlist?list=PLDV1Zeh2NRsB6SWUrDFW2RmDotAfPbeHu",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Sorting Algorithms overview",
              url: "https://www.geeksforgeeks.org/sorting-algorithms/",
              type: "article",
            },
            {
              title: "Introduction to Algorithms (CLRS) — Chapters 6-8: Heapsort, Quicksort, Sorting in Linear Time",
              url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
              type: "book",
            },
            {
              title: "TheAlgorithms — Sorting implementations in Python",
              url: "https://github.com/TheAlgorithms/Python/tree/master/sorts",
              type: "docs",
              note: "Reference implementations of 30+ sorting algorithms",
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
          tasks: [
            "Complete the LeetCode Recursion I Explore Card (all problems)",
            "Implement merge sort and binary search recursively, drawing the call stack for each on paper",
            "Solve 'Pow(x, n)' and 'Maximum Subarray' (divide-and-conquer approach) to practice splitting problems",
            "Watch the Abdul Bari recursion lectures and write recurrence relations for 3 recursive functions, then solve them using the Master theorem",
          ],
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
            {
              title: "LeetCode Recursion II Explore Card",
              url: "https://leetcode.com/explore/learn/card/recursion-ii/",
              type: "course",
              note: "Covers divide-and-conquer, backtracking, and recursion to iteration conversion",
            },
            {
              title: "mycodeschool — Recursion playlist",
              url: "https://www.youtube.com/playlist?list=PL2_aWCzGMAwLz3g66WrxFGSXvSsvyfzCO",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Recursion tutorial",
              url: "https://www.geeksforgeeks.org/introduction-to-recursion-data-structure-and-algorithm-tutorials/",
              type: "article",
            },
            {
              title: "Introduction to Algorithms (CLRS) — Chapter 4: Divide-and-Conquer",
              url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
              type: "book",
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
          tasks: [
            "Implement a binary tree from scratch with insert and all 4 traversals: preorder, inorder, postorder (recursive), and level-order (BFS with queue)",
            "Complete the LeetCode Binary Tree Explore Card",
            "Solve 'Maximum Depth of Binary Tree', 'Invert Binary Tree', 'Same Tree', and 'Diameter of Binary Tree' from NeetCode 150",
            "Solve 'Binary Tree Level Order Traversal', 'Lowest Common Ancestor', and 'Serialize and Deserialize Binary Tree'",
            "Visualize tree traversals on VisuAlgo, then whiteboard the recursive structure of 'Maximum Path Sum'",
          ],
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
            {
              title: "Abdul Bari — Tree traversals lecture",
              url: "https://www.youtube.com/watch?v=BHB0B1jFKQc",
              type: "video",
            },
            {
              title: "mycodeschool — Binary Tree playlist",
              url: "https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_JlcBbtYTwiQSsOTa6P",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Binary Tree Data Structure",
              url: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
              type: "article",
            },
            {
              title: "LeetCode — Top Interview 150 (Binary Tree section)",
              url: "https://leetcode.com/studyplan/top-interview-150/",
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
          tasks: [
            "Implement a BST from scratch with insert, delete, search, and in-order traversal",
            "Watch the NeetCode 'Validate BST' walkthrough, then solve 'Validate Binary Search Tree' and 'Kth Smallest Element in a BST'",
            "Solve 'Lowest Common Ancestor of a BST' and 'Convert Sorted Array to BST' from NeetCode 150",
            "Read the self-balancing trees overview (AVL/Red-Black) on Wikipedia and implement an AVL tree with rotations",
            "Use VisuAlgo's BST page to insert 20 random keys, observing when the tree becomes unbalanced",
          ],
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
            {
              title: "Abdul Bari — BST operations lecture",
              url: "https://www.youtube.com/watch?v=cWjIZbyBVOo",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Binary Search Tree tutorial",
              url: "https://www.geeksforgeeks.org/binary-search-tree-data-structure/",
              type: "article",
            },
            {
              title: "Introduction to Algorithms (CLRS) — Chapter 12: Binary Search Trees",
              url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
              type: "book",
            },
            {
              title: "LeetCode BST tag — practice problems",
              url: "https://leetcode.com/tag/binary-search-tree/",
              type: "practice",
            },
          ],
        },
        {
          slug: "heaps",
          title: "Heaps & Priority Queues",
          summary:
            "Binary heap mechanics, heapify, top-K problems, two-heap median pattern, K-way merge.",
          why: "'Top K' and 'K-way merge' problems are everywhere, and heaps are the only efficient answer.",
          tasks: [
            "Implement a min-heap from scratch with insert, extract-min, and heapify operations",
            "Solve 'Kth Largest Element in a Stream', 'Last Stone Weight', and 'K Closest Points to Origin' from NeetCode 150",
            "Implement the two-heap pattern to solve 'Find Median from Data Stream'",
            "Solve 'Merge K Sorted Lists' using a min-heap for K-way merge",
            "Read the Python heapq docs and rewrite your heap solutions using the standard library",
          ],
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
            {
              title: "Abdul Bari — Heap & Heap Sort lecture",
              url: "https://www.youtube.com/watch?v=HqPJF2L5h9U",
              type: "video",
            },
            {
              title: "William Fiset — Priority Queue / Heap playlist",
              url: "https://www.youtube.com/playlist?list=PLDV1Zeh2NRsCLFSHm1nYb9daYf60lCcag",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Heap Data Structure",
              url: "https://www.geeksforgeeks.org/heap-data-structure/",
              type: "article",
            },
            {
              title: "Introduction to Algorithms (CLRS) — Chapter 6: Heapsort",
              url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
              type: "book",
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
          tasks: [
            "Watch the NeetCode 'Implement Trie' walkthrough and implement a trie from scratch with insert, search, and startsWith",
            "Solve 'Implement Trie (Prefix Tree)' and 'Design Add and Search Words Data Structure' on LeetCode",
            "Complete the LeetCode Trie Explore Card",
            "Solve 'Word Search II' using a trie to prune the backtracking search space",
          ],
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
            {
              title: "Tushar Roy — Implement Trie (Prefix Tree)",
              url: "https://www.youtube.com/watch?v=AXjmTQ8LEoI",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Trie Data Structure",
              url: "https://www.geeksforgeeks.org/trie-insert-and-search/",
              type: "article",
            },
            {
              title: "William Fiset — Trie data structure",
              url: "https://www.youtube.com/watch?v=zIjfhVPRZCg",
              type: "video",
            },
            {
              title: "LeetCode Trie tag — practice problems",
              url: "https://leetcode.com/tag/trie/",
              type: "practice",
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
          tasks: [
            "Implement a graph class from scratch supporting both adjacency list and adjacency matrix representations",
            "Implement BFS and DFS (iterative + recursive) on your graph class; trace visit order on a 6-node sample graph",
            "Watch the freeCodeCamp Graph Algorithms video (first 2 hours) and solve 'Number of Islands' and 'Clone Graph'",
            "Solve 'Pacific Atlantic Water Flow', 'Rotting Oranges', and 'Surrounded Regions' from NeetCode 150",
            "Read the cp-algorithms BFS article and implement shortest-path-in-unweighted-graph using BFS",
          ],
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
            {
              title: "William Fiset — Graph Theory playlist",
              url: "https://www.youtube.com/playlist?list=PLDV1Zeh2NRsDGO4--qE8yH72HFL1Km93",
              type: "video",
              note: "Comprehensive graph theory series covering BFS, DFS, and beyond",
            },
            {
              title: "DFS — cp-algorithms",
              url: "https://cp-algorithms.com/graph/depth-first-search.html",
              type: "article",
            },
            {
              title: "GeeksforGeeks — Graph Data Structure and Algorithms",
              url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
              type: "article",
            },
            {
              title: "CSES Graph section — introductory problems",
              url: "https://cses.fi/problemset/",
              type: "practice",
              note: "Start with Counting Rooms, Labyrinth, and Building Roads",
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
          tasks: [
            "Read the cp-algorithms topological sort article and implement both Kahn's (BFS) and DFS-based topological sort",
            "Watch the NeetCode 'Course Schedule' walkthrough, then solve 'Course Schedule' and 'Course Schedule II'",
            "Solve 'Alien Dictionary' to apply topological sort to a non-obvious problem",
            "Add cycle detection to both implementations and verify they reject a graph with a back edge",
          ],
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
            {
              title: "William Fiset — Topological Sort algorithm",
              url: "https://www.youtube.com/watch?v=eL-KzMXSXXI",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Topological Sorting",
              url: "https://www.geeksforgeeks.org/topological-sorting/",
              type: "article",
            },
            {
              title: "Tushar Roy — Topological Sort",
              url: "https://www.youtube.com/watch?v=ddTC4Zovtbc",
              type: "video",
            },
            {
              title: "USACO Guide — Topological Sort",
              url: "https://usaco.guide/gold/toposort",
              type: "article",
            },
          ],
        },
        {
          slug: "union-find",
          title: "Union-Find (DSU)",
          summary:
            "Disjoint sets with path compression and union by rank for dynamic connectivity problems.",
          why: "Turns 'are these connected / count components as edges arrive' into near-O(1) — unbeatable when it applies.",
          tasks: [
            "Read the cp-algorithms DSU article and implement Union-Find from scratch with path compression and union by rank",
            "Watch NeetCode's 'Union Find in 5 minutes' and solve 'Number of Connected Components in an Undirected Graph'",
            "Solve 'Redundant Connection' and 'Accounts Merge' using your Union-Find implementation",
            "Read the USACO Guide DSU section and solve 2 practice problems from it",
          ],
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
            {
              title: "William Fiset — Union Find playlist",
              url: "https://www.youtube.com/playlist?list=PLDV1Zeh2NRsBI1C-mR6ZhHTyfoEJWlxvq",
              type: "video",
            },
            {
              title: "Tushar Roy — Disjoint Set Union",
              url: "https://www.youtube.com/watch?v=ID00PMy0-vE",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Disjoint Set Union (Union-Find)",
              url: "https://www.geeksforgeeks.org/introduction-to-disjoint-set-data-structure-or-union-find-algorithm/",
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
          tasks: [
            "Read the cp-algorithms Dijkstra article and implement Dijkstra's algorithm with a min-heap from scratch",
            "Watch the Computerphile Dijkstra video and trace the algorithm step-by-step on a 7-node weighted graph on paper",
            "Solve 'Network Delay Time' and 'Cheapest Flights Within K Stops' on LeetCode",
            "Implement Bellman-Ford from scratch and verify it detects a negative-weight cycle on a test graph",
            "Solve 3 problems from the CSES Graph section: 'Shortest Routes I', 'Shortest Routes II', and 'Flight Discount'",
          ],
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
            {
              title: "William Fiset — Dijkstra's Shortest Path algorithm",
              url: "https://www.youtube.com/watch?v=pSqmAO-m7Lk",
              type: "video",
            },
            {
              title: "Bellman-Ford — cp-algorithms",
              url: "https://cp-algorithms.com/graph/bellman_ford.html",
              type: "article",
            },
            {
              title: "GeeksforGeeks — Dijkstra's Algorithm tutorial",
              url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/",
              type: "article",
            },
            {
              title: "Introduction to Algorithms (CLRS) — Chapter 24: Single-Source Shortest Paths",
              url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
              type: "book",
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
          tasks: [
            "Watch NeetCode's backtracking template video (Subsets) and write the choose-explore-unchoose template from memory",
            "Solve 'Subsets', 'Subsets II', and 'Permutations' to drill the core template",
            "Solve 'Combination Sum', 'Combination Sum II', and 'Palindrome Partitioning' from NeetCode 150",
            "Solve 'N-Queens' and 'Word Search' to practice constraint pruning within backtracking",
            "Read the USACO Guide complete search article and solve 1 additional problem from it",
          ],
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
            {
              title: "Back To Back SWE — The Backtracking Blueprint",
              url: "https://www.youtube.com/watch?v=Zq4upTEaQyM",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Backtracking Algorithm",
              url: "https://www.geeksforgeeks.org/backtracking-algorithms/",
              type: "article",
            },
            {
              title: "Tushar Roy — Permutations & Combinations using backtracking",
              url: "https://www.youtube.com/watch?v=nYFd7VHKyWQ",
              type: "video",
            },
            {
              title: "LeetCode backtracking tag",
              url: "https://leetcode.com/tag/backtracking/",
              type: "practice",
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
          tasks: [
            "Read the USACO Guide greedy algorithms article and summarize the exchange-argument proof technique in your own words",
            "Solve 'Jump Game' and 'Jump Game II' from NeetCode 150 using greedy approaches",
            "Solve 'Gas Station', 'Hand of Straights', and 'Maximum Subarray' (Kadane's algorithm) from NeetCode 150",
            "For each solution, write a 2-sentence argument for why greedy is correct (exchange argument or stays-ahead proof)",
          ],
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
            {
              title: "Abdul Bari — Greedy Algorithms playlist",
              url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
              type: "video",
              note: "Includes job sequencing, fractional knapsack, Huffman coding",
            },
            {
              title: "GeeksforGeeks — Greedy Algorithms tutorial",
              url: "https://www.geeksforgeeks.org/greedy-algorithms/",
              type: "article",
            },
            {
              title: "Competitive Programmer's Handbook — Chapter 6: Greedy Algorithms",
              url: "https://cses.fi/book/book.pdf",
              type: "book",
            },
          ],
        },
        {
          slug: "intervals",
          title: "Intervals",
          summary:
            "Sort-then-sweep over ranges: merge intervals, meeting rooms, insert interval, min arrows.",
          why: "A compact, learnable pattern that shows up constantly in scheduling-flavored questions.",
          tasks: [
            "Watch the NeetCode 'Merge Intervals' walkthrough and implement the sort-then-merge pattern",
            "Solve 'Merge Intervals', 'Insert Interval', and 'Non-overlapping Intervals' from NeetCode 150",
            "Solve 'Meeting Rooms' and 'Meeting Rooms II' to practice the sweep-line variant",
            "Solve 'Minimum Number of Arrows to Burst Balloons' and write out the greedy proof for why sorting by end time works",
          ],
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
            {
              title: "Back To Back SWE — Merge Intervals explanation",
              url: "https://www.youtube.com/watch?v=qKczfGUrFY4",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Interval Scheduling problems",
              url: "https://www.geeksforgeeks.org/merge-overlapping-intervals/",
              type: "article",
            },
            {
              title: "Tushar Roy — Meeting Rooms II",
              url: "https://www.youtube.com/watch?v=FdzJmTCVyJU",
              type: "video",
            },
          ],
        },
        {
          slug: "dp-1d",
          title: "1-D Dynamic Programming",
          summary:
            "Memoization vs tabulation, state definition, transitions: climbing stairs, house robber, coin change, LIS.",
          why: "DP separates strong candidates from the rest; 1-D problems teach the state-definition skill everything else needs.",
          tasks: [
            "Watch the Reducible 'Dynamic Programming — 5 steps framework' video and write the 5-step template in your notes",
            "Solve 'Climbing Stairs' and 'House Robber' both top-down (memoization) and bottom-up (tabulation) to internalize both styles",
            "Solve 'Coin Change', 'Longest Increasing Subsequence', and 'Word Break' from NeetCode 150",
            "Read the USACO Guide DP introduction and solve 2 practice problems from it",
            "Solve 'Decode Ways' and 'Maximum Product Subarray', writing out the state definition and transition for each before coding",
          ],
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
            {
              title: "Tushar Roy — Dynamic Programming playlist",
              url: "https://www.youtube.com/playlist?list=PLrmLmBdmIlpsHaNTPP_jHHDx_os9ItYXr",
              type: "video",
              note: "Excellent visual walkthroughs of classic DP problems",
            },
            {
              title: "Abdul Bari — Dynamic Programming lectures",
              url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
              type: "video",
            },
            {
              title: "LeetCode Dynamic Programming Explore Card",
              url: "https://leetcode.com/explore/learn/card/dynamic-programming/",
              type: "course",
            },
            {
              title: "Introduction to Algorithms (CLRS) — Chapter 15: Dynamic Programming",
              url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
              type: "book",
            },
          ],
        },
        {
          slug: "dp-2d",
          title: "Multi-dimensional DP",
          summary:
            "Grid DP, knapsack, edit distance, longest common subsequence, interval DP, DP on strings.",
          why: "Knapsack + LCS + edit distance are the three archetypes behind most hard DP interview questions.",
          tasks: [
            "Implement 0/1 Knapsack from scratch (both 2D table and space-optimized 1D), tracing the table fill on paper for a small example",
            "Watch the NeetCode 'Edit Distance' walkthrough, then solve 'Edit Distance' and 'Longest Common Subsequence'",
            "Solve 'Unique Paths', 'Coin Change II' (unbounded knapsack), and 'Target Sum' from NeetCode 150",
            "Read the USACO Guide knapsack patterns article and solve 2 practice problems from it",
            "Solve 'Interleaving String' and 'Longest Palindromic Subsequence', drawing the DP table for each before coding",
          ],
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
            {
              title: "Tushar Roy — 0/1 Knapsack Problem",
              url: "https://www.youtube.com/watch?v=8LusJS5-AGo",
              type: "video",
            },
            {
              title: "Back To Back SWE — Edit Distance deep dive",
              url: "https://www.youtube.com/watch?v=MiqoA-yF-0M",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Longest Common Subsequence",
              url: "https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/",
              type: "article",
            },
            {
              title: "Competitive Programmer's Handbook — Chapter 7: Dynamic Programming",
              url: "https://cses.fi/book/book.pdf",
              type: "book",
              note: "Covers grid DP, knapsack, and edit distance with clean pseudocode",
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
          tasks: [
            "Read the Bit Twiddling Hacks article (Stanford) and implement 5 useful tricks: check power of 2, count set bits, swap without temp, find single number, and toggle nth bit",
            "Solve 'Single Number', 'Number of 1 Bits', and 'Counting Bits' from NeetCode 150",
            "Solve 'Reverse Bits' and 'Missing Number' using bitwise operations",
            "Read the cp-algorithms bitwise operations article and solve 'Sum of Two Integers' without using + or - operators",
          ],
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
            {
              title: "NeetCode — Bit Manipulation for interviews (video)",
              url: "https://www.youtube.com/watch?v=5Km3utixwZs",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Bit Manipulation techniques",
              url: "https://www.geeksforgeeks.org/bits-manipulation-important-tactics/",
              type: "article",
            },
            {
              title: "LeetCode bit manipulation tag",
              url: "https://leetcode.com/tag/bit-manipulation/",
              type: "practice",
            },
          ],
        },
        {
          slug: "math-geometry",
          title: "Math & Geometry",
          summary:
            "GCD/LCM, primes and sieves, modular arithmetic, matrix rotation, coordinate tricks.",
          why: "Occasional but unavoidable; the sieve and modular arithmetic also underpin hashing and crypto.",
          tasks: [
            "Read the cp-algorithms Sieve of Eratosthenes article and implement the sieve from scratch to find all primes up to N",
            "Solve 'Rotate Image', 'Spiral Matrix', and 'Set Matrix Zeroes' from NeetCode 150",
            "Implement GCD (Euclidean algorithm) and LCM from scratch, then solve 'Greatest Common Divisor of Strings'",
            "Read the cp-algorithms modular arithmetic article and implement modular exponentiation (fast power)",
            "Solve 'Happy Number' and 'Plus One' to practice number manipulation patterns",
          ],
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
            {
              title: "William Fiset — Number Theory playlist",
              url: "https://www.youtube.com/playlist?list=PLDV1Zeh2NRsD06x59fxczdWLhDDyNMwCA",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Mathematical Algorithms",
              url: "https://www.geeksforgeeks.org/mathematical-algorithms/",
              type: "article",
            },
            {
              title: "LeetCode math tag",
              url: "https://leetcode.com/tag/math/",
              type: "practice",
            },
            {
              title: "Introduction to Algorithms (CLRS) — Chapter 31: Number-Theoretic Algorithms",
              url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
              type: "book",
            },
          ],
        },
        {
          slug: "string-algorithms",
          title: "String Algorithms (KMP, Rabin-Karp)",
          summary:
            "Prefix function/KMP for pattern matching, rolling hashes, Z-function, palindrome tricks.",
          why: "Substring-search questions become mechanical once you own the prefix function.",
          tasks: [
            "Read the cp-algorithms prefix function & KMP article and implement KMP pattern matching from scratch",
            "Watch the KMP visual explanation video and trace the failure function table for the pattern 'ABABAC' on paper",
            "Read the cp-algorithms rolling hashes article and implement Rabin-Karp string matching from scratch",
            "Solve 'Find the Index of the First Occurrence in a String' (LeetCode #28) using both KMP and Rabin-Karp",
            "Solve 'Longest Happy Prefix' and 'Repeated Substring Pattern' using the prefix function",
          ],
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
            {
              title: "Z-function — cp-algorithms",
              url: "https://cp-algorithms.com/string/z-function.html",
              type: "article",
            },
            {
              title: "Tushar Roy — KMP String Matching Algorithm",
              url: "https://www.youtube.com/watch?v=GTJr8OvyEVQ",
              type: "video",
            },
            {
              title: "GeeksforGeeks — KMP Algorithm for Pattern Searching",
              url: "https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/",
              type: "article",
            },
            {
              title: "LeetCode string matching tag",
              url: "https://leetcode.com/tag/string-matching/",
              type: "practice",
            },
          ],
        },
        {
          slug: "segment-trees",
          title: "Segment & Fenwick Trees",
          summary:
            "Range queries with point updates in O(log n): segment trees, lazy propagation, binary indexed trees.",
          why: "Beyond-interview territory that occasionally appears in hard rounds; core competitive-programming kit.",
          tasks: [
            "Read the cp-algorithms segment tree article and implement a segment tree from scratch supporting range sum queries and point updates",
            "Add lazy propagation to your segment tree to support range updates in O(log n)",
            "Read the cp-algorithms Fenwick tree article and implement a BIT (Binary Indexed Tree) from scratch for prefix sums",
            "Solve 3 problems from the CSES Range Queries section: 'Range Sum Queries II', 'Range Minimum Queries I', and 'Range Update Queries'",
            "Solve 'Range Sum Query - Mutable' (LeetCode #307) using both your segment tree and Fenwick tree implementations",
          ],
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
            {
              title: "William Fiset — Segment Tree playlist",
              url: "https://www.youtube.com/playlist?list=PLDV1Zeh2NRsCvoyP-bztk6uXAYn3a3T1x",
              type: "video",
            },
            {
              title: "Tushar Roy — Segment Tree Range Query",
              url: "https://www.youtube.com/watch?v=ZBHKZF5w4YU",
              type: "video",
            },
            {
              title: "GeeksforGeeks — Segment Tree tutorial",
              url: "https://www.geeksforgeeks.org/segment-tree-data-structure/",
              type: "article",
            },
            {
              title: "USACO Guide — Point Update Range Sum",
              url: "https://usaco.guide/gold/PURS",
              type: "article",
              note: "Covers both segment trees and BITs with practice problems",
            },
          ],
        },
      ],
    },
  ],
};
