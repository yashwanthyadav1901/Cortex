import type { Roadmap } from "../types";

export const aiRoadmap: Roadmap = {
  pillar: "ai",
  title: "AI & Machine Learning",
  description:
    "Math intuition → classical ML → deep learning → transformers/LLMs → applied AI engineering. Build-from-scratch first (Karpathy style), then frameworks, then production.",
  stages: [
    {
      title: "Math Foundations",
      nodes: [
        {
          slug: "linear-algebra",
          title: "Linear Algebra",
          summary:
            "Vectors, matrices, dot products, matrix multiplication as transformation, eigenvalues — geometrically, not just symbolically.",
          why: "Every model is matrix multiplication; attention, embeddings, and PCA all read as linear algebra.",
          estHours: 12,
          resources: [
            {
              title: "Essence of Linear Algebra — 3Blue1Brown",
              url: "https://www.3blue1brown.com/topics/linear-algebra",
              type: "video",
              note: "The single best intuition builder — watch all of it",
            },
            {
              title: "Linear Algebra — Khan Academy",
              url: "https://www.khanacademy.org/math/linear-algebra",
              type: "course",
            },
            {
              title: "Mathematics for Machine Learning (free book) — ch. 2-4",
              url: "https://mml-book.github.io/",
              type: "book",
            },
          ],
        },
        {
          slug: "calculus",
          title: "Calculus for ML",
          summary:
            "Derivatives, partial derivatives, the chain rule, and gradients — the machinery of backprop.",
          why: "Backpropagation IS the chain rule; you can't debug training without gradient intuition.",
          estHours: 8,
          row: 1,
          resources: [
            {
              title: "Essence of Calculus — 3Blue1Brown",
              url: "https://www.3blue1brown.com/topics/calculus",
              type: "video",
            },
            {
              title: "Multivariable calculus (gradients) — Khan Academy",
              url: "https://www.khanacademy.org/math/multivariable-calculus",
              type: "course",
            },
            {
              title: "Mathematics for Machine Learning — ch. 5 (vector calculus)",
              url: "https://mml-book.github.io/",
              type: "book",
            },
          ],
        },
        {
          slug: "probability-stats",
          title: "Probability & Statistics",
          summary:
            "Distributions, conditional probability, Bayes' rule, expectation/variance, MLE, hypothesis testing.",
          why: "ML is applied probability — loss functions, sampling, and evaluation all live here.",
          estHours: 10,
          row: 1,
          resources: [
            {
              title: "Seeing Theory — visual intro to probability & stats",
              url: "https://seeing-theory.brown.edu/",
              type: "article",
            },
            {
              title: "StatQuest — statistics fundamentals playlist",
              url: "https://www.youtube.com/@statquest",
              type: "video",
            },
            {
              title: "Probability — Khan Academy statistics course",
              url: "https://www.khanacademy.org/math/statistics-probability",
              type: "course",
            },
          ],
        },
      ],
    },
    {
      title: "Python & Data Stack",
      nodes: [
        {
          slug: "numpy-pandas",
          title: "NumPy & pandas",
          summary:
            "Vectorized array computing, broadcasting, DataFrame wrangling, joins/groupbys — no Python loops.",
          why: "The lingua franca of all ML work; broadcasting intuition transfers directly to tensor code.",
          estHours: 8,
          resources: [
            {
              title: "NumPy — the absolute basics for beginners (official)",
              url: "https://numpy.org/doc/stable/user/absolute_beginners.html",
              type: "docs",
            },
            {
              title: "10 minutes to pandas (official)",
              url: "https://pandas.pydata.org/docs/user_guide/10min.html",
              type: "docs",
            },
            {
              title: "Kaggle Learn — pandas micro-course",
              url: "https://www.kaggle.com/learn/pandas",
              type: "course",
            },
          ],
          projectSlugs: ["mnist-from-scratch"],
        },
        {
          slug: "data-prep-viz",
          title: "Data Prep & Visualization",
          summary:
            "Cleaning, missing values, outliers, train/test leakage, matplotlib/seaborn EDA habits.",
          why: "Garbage in, garbage out — most real-world model failures are data failures.",
          estHours: 6,
          resources: [
            {
              title: "Kaggle Learn — data cleaning micro-course",
              url: "https://www.kaggle.com/learn/data-cleaning",
              type: "course",
            },
            {
              title: "Kaggle Learn — data visualization micro-course",
              url: "https://www.kaggle.com/learn/data-visualization",
              type: "course",
            },
            {
              title: "scikit-learn — common pitfalls & leakage guide",
              url: "https://scikit-learn.org/stable/common_pitfalls.html",
              type: "docs",
            },
          ],
          projectSlugs: ["sentiment-classifier"],
        },
      ],
    },
    {
      title: "Classical Machine Learning",
      nodes: [
        {
          slug: "regression",
          title: "Linear & Logistic Regression",
          summary:
            "Least squares, gradient descent from scratch, decision boundaries, regularization (L1/L2).",
          why: "The simplest complete ML loop — loss, gradient, optimization — everything deep learning scales up.",
          estHours: 8,
          resources: [
            {
              title: "Machine Learning Specialization — Andrew Ng (course 1)",
              url: "https://www.coursera.org/specializations/machine-learning-introduction",
              type: "course",
              note: "Audit for free; the canonical ML on-ramp",
            },
            {
              title: "StatQuest — linear regression, clearly explained",
              url: "https://www.youtube.com/watch?v=nk2CQITm_eo",
              type: "video",
            },
            {
              title: "scikit-learn — linear models user guide",
              url: "https://scikit-learn.org/stable/modules/linear_model.html",
              type: "docs",
            },
          ],
        },
        {
          slug: "trees-ensembles",
          title: "Decision Trees & Ensembles",
          summary:
            "Trees, bagging, random forests, gradient boosting (XGBoost/LightGBM) — the tabular-data champions.",
          why: "Boosted trees still beat neural nets on most tabular problems; every applied role touches them.",
          estHours: 8,
          row: 1,
          resources: [
            {
              title: "StatQuest — decision trees & random forests playlists",
              url: "https://www.youtube.com/@statquest",
              type: "video",
            },
            {
              title: "XGBoost — official tutorials",
              url: "https://xgboost.readthedocs.io/en/stable/tutorials/model.html",
              type: "docs",
            },
            {
              title: "Kaggle Learn — intermediate ML (ensembles in practice)",
              url: "https://www.kaggle.com/learn/intermediate-machine-learning",
              type: "course",
            },
          ],
        },
        {
          slug: "svm-knn-clustering",
          title: "SVM, kNN, Clustering & PCA",
          summary:
            "Margin-based classification, distance-based methods, k-means/DBSCAN, dimensionality reduction.",
          why: "Rounds out the classical toolbox and builds the embedding-space intuition LLM work relies on.",
          estHours: 8,
          row: 1,
          resources: [
            {
              title: "StatQuest — SVM / PCA / clustering videos",
              url: "https://www.youtube.com/@statquest",
              type: "video",
            },
            {
              title: "scikit-learn — user guide (SVM, clustering, decomposition)",
              url: "https://scikit-learn.org/stable/user_guide.html",
              type: "docs",
            },
            {
              title: "k-means visualized — Naftali Harris",
              url: "https://www.naftaliharris.com/blog/visualizing-k-means-clustering/",
              type: "article",
            },
          ],
        },
        {
          slug: "model-evaluation",
          title: "Model Evaluation & Validation",
          summary:
            "Cross-validation, precision/recall/F1, ROC-AUC, calibration, bias-variance, data leakage traps.",
          why: "A model is only as real as its evaluation — this skill transfers straight to LLM evals later.",
          estHours: 6,
          resources: [
            {
              title: "scikit-learn — model evaluation guide",
              url: "https://scikit-learn.org/stable/modules/model_evaluation.html",
              type: "docs",
            },
            {
              title: "StatQuest — ROC and AUC, clearly explained",
              url: "https://www.youtube.com/watch?v=4jRBRDbJemM",
              type: "video",
            },
            {
              title: "Google ML crash course — classification metrics",
              url: "https://developers.google.com/machine-learning/crash-course/classification",
              type: "course",
            },
          ],
          projectSlugs: ["sentiment-classifier"],
        },
      ],
    },
    {
      title: "Deep Learning",
      nodes: [
        {
          slug: "neural-nets-backprop",
          title: "Neural Networks & Backpropagation",
          summary:
            "Neurons, activation functions, computational graphs, and backprop built by hand — micrograd style.",
          why: "Build it once from scratch and every framework becomes transparent instead of magic.",
          estHours: 12,
          resources: [
            {
              title: "Neural Networks: Zero to Hero — Andrej Karpathy",
              url: "https://karpathy.ai/zero-to-hero.html",
              type: "course",
              note: "Start with 'spelled-out intro to neural networks and backpropagation'",
            },
            {
              title: "But what is a neural network? — 3Blue1Brown series",
              url: "https://www.3blue1brown.com/topics/neural-networks",
              type: "video",
            },
            {
              title: "micrograd — Karpathy's 100-line autograd engine",
              url: "https://github.com/karpathy/micrograd",
              type: "docs",
            },
          ],
          projectSlugs: ["autograd-engine", "mnist-from-scratch"],
        },
        {
          slug: "training-dynamics",
          title: "Optimizers & Regularization",
          summary:
            "SGD, momentum, Adam, learning-rate schedules, batch norm, dropout, weight decay, debugging loss curves.",
          why: "Training is where things actually go wrong — reading a loss curve is a daily skill.",
          estHours: 8,
          resources: [
            {
              title: "Dive into Deep Learning (d2l.ai) — optimization chapters",
              url: "https://d2l.ai/",
              type: "book",
            },
            {
              title: "A recipe for training neural networks — Karpathy",
              url: "https://karpathy.github.io/2019/04/25/recipe/",
              type: "article",
            },
            {
              title: "Why momentum really works — Distill",
              url: "https://distill.pub/2017/momentum/",
              type: "article",
            },
          ],
        },
        {
          slug: "cnns",
          title: "CNNs & Computer Vision",
          summary:
            "Convolutions, pooling, classic architectures (ResNet), transfer learning for image tasks.",
          why: "Convolution is a core idea beyond vision, and transfer learning is the pattern for all applied DL.",
          estHours: 8,
          row: 1,
          resources: [
            {
              title: "CS231n — CNNs for visual recognition (notes)",
              url: "https://cs231n.github.io/",
              type: "course",
            },
            {
              title: "fast.ai — Practical Deep Learning for Coders",
              url: "https://course.fast.ai/",
              type: "course",
            },
            {
              title: "CNNs explained — 3Blue1Brown convolution video",
              url: "https://www.youtube.com/watch?v=KuXjwB4LzSA",
              type: "video",
            },
          ],
          projectSlugs: ["image-classifier"],
        },
        {
          slug: "rnns-sequences",
          title: "RNNs & Sequence Models",
          summary:
            "Recurrence, LSTMs/GRUs, why long-range dependencies are hard — the road that led to attention.",
          why: "You'll appreciate transformers only after seeing the problems RNNs couldn't solve.",
          estHours: 6,
          row: 1,
          resources: [
            {
              title: "Understanding LSTM Networks — Chris Olah",
              url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
              type: "article",
            },
            {
              title: "The Unreasonable Effectiveness of RNNs — Karpathy",
              url: "https://karpathy.github.io/2015/05/21/rnn-effectiveness/",
              type: "article",
            },
            {
              title: "d2l.ai — recurrent networks chapters",
              url: "https://d2l.ai/",
              type: "book",
            },
          ],
        },
        {
          slug: "embeddings",
          title: "Embeddings",
          summary:
            "Word2vec intuition, learned representations, cosine similarity, embedding spaces as geometry.",
          why: "Embeddings power RAG, search, recommendations, and clustering — the workhorse of applied AI.",
          estHours: 5,
          resources: [
            {
              title: "The Illustrated Word2vec — Jay Alammar",
              url: "https://jalammar.github.io/illustrated-word2vec/",
              type: "article",
            },
            {
              title: "What are embeddings? — Vicki Boykis (free book)",
              url: "https://vickiboykis.com/what_are_embeddings/",
              type: "book",
            },
            {
              title: "OpenAI docs — embeddings guide",
              url: "https://platform.openai.com/docs/guides/embeddings",
              type: "docs",
            },
          ],
          projectSlugs: ["rag-notes", "semantic-search"],
        },
      ],
    },
    {
      title: "Transformers & LLMs",
      nodes: [
        {
          slug: "attention-transformers",
          title: "Attention & the Transformer",
          summary:
            "Self-attention, multi-head attention, positional encodings, encoder/decoder — the architecture behind everything.",
          why: "One architecture runs the entire modern AI stack; you should be able to draw it from memory.",
          estHours: 10,
          resources: [
            {
              title: "The Illustrated Transformer — Jay Alammar",
              url: "https://jalammar.github.io/illustrated-transformer/",
              type: "article",
            },
            {
              title: "Attention Is All You Need (the paper)",
              url: "https://arxiv.org/abs/1706.03762",
              type: "article",
            },
            {
              title: "Let's build GPT from scratch — Karpathy",
              url: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
              type: "video",
            },
          ],
          projectSlugs: ["train-nanogpt"],
        },
        {
          slug: "tokenization",
          title: "Tokenization",
          summary:
            "BPE, vocabularies, why tokenizers cause weird model behavior, context-window accounting.",
          why: "Half of LLM gotchas (costs, truncation, odd failures on spelling/math) trace back to tokenization.",
          estHours: 4,
          row: 1,
          resources: [
            {
              title: "Let's build the GPT Tokenizer — Karpathy",
              url: "https://www.youtube.com/watch?v=zduSFxRajkE",
              type: "video",
            },
            {
              title: "Hugging Face — tokenizers course chapter",
              url: "https://huggingface.co/learn/llm-course/chapter6/1",
              type: "course",
            },
            {
              title: "tiktokenizer — interactive tokenizer playground",
              url: "https://tiktokenizer.vercel.app/",
              type: "practice",
            },
          ],
        },
        {
          slug: "llm-training",
          title: "How LLMs Are Trained",
          summary:
            "Pretraining objectives, scaling laws, instruction tuning, RLHF/DPO — the full pipeline from web text to assistant.",
          why: "Knowing how the sausage is made explains model strengths, failure modes, and why prompting works.",
          estHours: 6,
          row: 1,
          resources: [
            {
              title: "Deep dive into LLMs like ChatGPT — Karpathy",
              url: "https://www.youtube.com/watch?v=7xTGNNLPyMI",
              type: "video",
            },
            {
              title: "LLMs from scratch — Sebastian Raschka (book repo)",
              url: "https://github.com/rasbt/LLMs-from-scratch",
              type: "book",
            },
            {
              title: "InstructGPT / RLHF paper",
              url: "https://arxiv.org/abs/2203.02155",
              type: "article",
            },
          ],
          projectSlugs: ["train-nanogpt"],
        },
        {
          slug: "fine-tuning",
          title: "Fine-tuning & LoRA",
          summary:
            "Full fine-tuning vs parameter-efficient methods (LoRA/QLoRA), datasets, when fine-tuning beats prompting.",
          why: "The cheapest way to specialize a model — and a very employable, hands-on skill.",
          estHours: 8,
          resources: [
            {
              title: "LoRA paper — Low-Rank Adaptation",
              url: "https://arxiv.org/abs/2106.09685",
              type: "article",
            },
            {
              title: "Hugging Face PEFT docs",
              url: "https://huggingface.co/docs/peft",
              type: "docs",
            },
            {
              title: "Fine-tuning guide — Unsloth docs",
              url: "https://docs.unsloth.ai/",
              type: "docs",
            },
          ],
          projectSlugs: ["lora-finetune"],
        },
        {
          slug: "prompt-engineering",
          title: "Prompt Engineering",
          summary:
            "System prompts, few-shot examples, chain-of-thought, structured output, prompt-injection awareness.",
          why: "The highest-leverage, zero-cost way to improve LLM apps — and it compounds with everything else.",
          estHours: 4,
          resources: [
            {
              title: "Claude prompt engineering guide — Anthropic docs",
              url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview",
              type: "docs",
            },
            {
              title: "Prompt Engineering Guide (promptingguide.ai)",
              url: "https://www.promptingguide.ai/",
              type: "docs",
            },
            {
              title: "Anthropic cookbook — worked examples",
              url: "https://github.com/anthropics/anthropic-cookbook",
              type: "docs",
            },
          ],
          projectSlugs: ["tool-using-agent"],
        },
      ],
    },
    {
      title: "Applied AI Engineering",
      nodes: [
        {
          slug: "rag-vector-dbs",
          title: "RAG & Vector Databases",
          summary:
            "Chunking, embedding, ANN indexes (HNSW), hybrid search, reranking, and grounding LLM answers in your data.",
          why: "The default architecture for 'LLM + my company's data' — the most-built AI system of this era.",
          estHours: 8,
          resources: [
            {
              title: "Retrieval augmented generation — Pinecone learning center",
              url: "https://www.pinecone.io/learn/retrieval-augmented-generation/",
              type: "article",
            },
            {
              title: "RAG chapter — Chip Huyen's AI Engineering notes",
              url: "https://huyenchip.com/2023/10/10/multimodal.html",
              type: "article",
              note: "See also her RAG posts on the same blog",
            },
            {
              title: "pgvector — Postgres vector search",
              url: "https://github.com/pgvector/pgvector",
              type: "docs",
            },
          ],
          projectSlugs: ["rag-notes", "semantic-search"],
        },
        {
          slug: "agents-tool-use",
          title: "Agents & Tool Use",
          summary:
            "Function calling, agent loops (reason → act → observe), MCP, multi-step planning, guardrails.",
          why: "The frontier of applied AI — agentic patterns are what companies are hiring for right now.",
          estHours: 8,
          resources: [
            {
              title: "Building effective agents — Anthropic",
              url: "https://www.anthropic.com/research/building-effective-agents",
              type: "article",
            },
            {
              title: "Tool use — Claude docs",
              url: "https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview",
              type: "docs",
            },
            {
              title: "Model Context Protocol (MCP)",
              url: "https://modelcontextprotocol.io/",
              type: "docs",
            },
          ],
          projectSlugs: ["tool-using-agent"],
        },
        {
          slug: "serving-mlops",
          title: "Serving & MLOps",
          summary:
            "Model serving (vLLM), batching, GPU basics, quantization, experiment tracking, deployment pipelines.",
          why: "Models create value only in production; serving economics decide what's actually shippable.",
          estHours: 8,
          resources: [
            {
              title: "vLLM docs — high-throughput LLM serving",
              url: "https://docs.vllm.ai/",
              type: "docs",
            },
            {
              title: "Made With ML — MLOps course",
              url: "https://madewithml.com/",
              type: "course",
            },
            {
              title: "Full Stack Deep Learning — course materials",
              url: "https://fullstackdeeplearning.com/",
              type: "course",
            },
          ],
        },
        {
          slug: "llm-evaluation",
          title: "LLM Evaluation",
          summary:
            "Golden sets, LLM-as-judge, regression suites for prompts, human eval, benchmark skepticism.",
          why: "Teams that can't measure quality can't improve it — evals are the #1 differentiator in AI product work.",
          estHours: 6,
          row: 1,
          resources: [
            {
              title: "Your AI product needs evals — Hamel Husain",
              url: "https://hamel.dev/blog/posts/evals/",
              type: "article",
            },
            {
              title: "Define success criteria & build evals — Claude docs",
              url: "https://docs.claude.com/en/docs/test-and-evaluate/define-success",
              type: "docs",
            },
            {
              title: "OpenAI cookbook — evaluation examples",
              url: "https://cookbook.openai.com/",
              type: "docs",
            },
          ],
          projectSlugs: ["eval-harness"],
        },
        {
          slug: "ai-safety",
          title: "Safety & Responsible AI",
          summary:
            "Prompt injection, jailbreaks, data privacy, hallucination mitigation, alignment basics.",
          why: "Production AI without a threat model is a liability; safety fluency is increasingly table stakes.",
          estHours: 4,
          row: 1,
          resources: [
            {
              title: "Anthropic research — alignment & safety publications",
              url: "https://www.anthropic.com/research",
              type: "article",
            },
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
          ],
        },
      ],
    },
  ],
};
