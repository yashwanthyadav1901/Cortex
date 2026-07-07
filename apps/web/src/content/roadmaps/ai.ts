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
          tasks: [
            "Watch the 3Blue1Brown Essence of Linear Algebra series (all chapters) and note what each transformation does geometrically",
            "Implement matrix multiplication from scratch in Python without using np.matmul — verify against NumPy on random inputs",
            "Solve exercises from Mathematics for Machine Learning ch. 2-4 (at least 5 per chapter)",
            "Implement eigenvalue decomposition on a 2x2 matrix by hand, then verify with np.linalg.eig",
            "Explain in your own words: why does multiplying by a matrix transform space, and what do eigenvectors represent geometrically?",
          ],
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
            {
              title: "MIT 18.06 Linear Algebra — Gilbert Strang",
              url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
              type: "course",
              note: "The legendary MIT course; lectures are on YouTube too",
            },
            {
              title: "Immersive Linear Algebra — interactive online book",
              url: "http://immersivemath.com/ila/index.html",
              type: "book",
            },
            {
              title: "Computational Linear Algebra — fast.ai",
              url: "https://github.com/fastai/numerical-linear-algebra",
              type: "course",
              note: "Focuses on practical numerical LA for ML",
            },
            {
              title: "Linear Algebra Done Right — Sheldon Axler (free)",
              url: "https://linear.axler.net/",
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
          tasks: [
            "Watch the 3Blue1Brown Essence of Calculus series (chapters on derivatives and chain rule)",
            "Compute partial derivatives of f(x,y) = x²y + sin(xy) by hand, then verify with a symbolic library (SymPy)",
            "Read Mathematics for Machine Learning ch. 5 and work through the gradient examples",
            "Implement numerical gradient checking: compute df/dx via (f(x+h)-f(x-h))/2h and compare against the analytic gradient for a small neural net",
            "Draw the computational graph for a 2-layer neural net's forward pass, then trace the chain rule backward through it on paper",
          ],
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
            {
              title: "Matrix Calculus for Deep Learning — explained.ai",
              url: "https://explained.ai/matrix-calculus/",
              type: "article",
              note: "The missing manual for matrix derivatives in ML",
            },
            {
              title: "Calculus of Backpropagation — Karpathy (Zero to Hero lecture 1)",
              url: "https://karpathy.ai/zero-to-hero.html",
              type: "video",
            },
            {
              title: "Calculus — MIT OpenCourseWare (18.01)",
              url: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/",
              type: "course",
            },
            {
              title: "Dive into Deep Learning — math preliminaries (calculus)",
              url: "https://d2l.ai/chapter_preliminaries/calculus.html",
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
          tasks: [
            "Work through the Seeing Theory interactive modules on basic probability, distributions, and Bayesian inference",
            "Watch StatQuest's videos on probability distributions, Bayes' theorem, and maximum likelihood estimation",
            "Derive Bayes' rule from scratch and solve 3 real-world conditional probability problems (e.g., medical testing false positives)",
            "Implement MLE for a Gaussian distribution from scratch: given samples, compute the mean and variance that maximize the likelihood",
            "Explain in 2-3 sentences: why is cross-entropy loss equivalent to maximizing log-likelihood?",
          ],
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
            {
              title: "Introduction to Probability — Harvard (Stat 110)",
              url: "https://projects.iq.harvard.edu/stat110",
              type: "course",
              note: "Full lectures on YouTube; excellent for Bayesian thinking",
            },
            {
              title: "Think Stats — Allen Downey (free book)",
              url: "https://greenteapress.com/thinkstats2/",
              type: "book",
            },
            {
              title: "Probability for Statistics and ML — d2l.ai",
              url: "https://d2l.ai/chapter_preliminaries/probability.html",
              type: "book",
            },
            {
              title: "3Blue1Brown — Bayes theorem visual explanation",
              url: "https://www.youtube.com/watch?v=HZGCoVF3YvM",
              type: "video",
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
          tasks: [
            "Read the NumPy absolute basics guide and implement 5 array operations using broadcasting instead of Python loops",
            "Complete the Kaggle pandas micro-course (all exercises)",
            "Load a CSV dataset with pandas, handle missing values, perform a groupby aggregation, and merge two DataFrames on a shared key",
            "Rewrite a loop-based computation (e.g., pairwise distances) as a single vectorized NumPy expression and benchmark the speedup",
          ],
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
            {
              title: "Python Data Science Handbook — Jake VanderPlas (NumPy & pandas chapters)",
              url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
              type: "book",
              note: "Chapters 2-3 cover NumPy and pandas in depth",
            },
            {
              title: "NumPy illustrated — Lev Maximov (visual guide)",
              url: "https://betterprogramming.pub/numpy-illustrated-the-visual-guide-to-numpy-3b1d4976de1d",
              type: "article",
            },
            {
              title: "Kaggle Learn — intro to Python (prerequisite check)",
              url: "https://www.kaggle.com/learn/python",
              type: "course",
            },
            {
              title: "100 pandas puzzles — practice exercises",
              url: "https://github.com/ajcr/100-pandas-puzzles",
              type: "practice",
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
          tasks: [
            "Complete the Kaggle data cleaning micro-course (all exercises on missing values, inconsistent entries, and scaling)",
            "Complete the Kaggle data visualization micro-course and recreate 3 chart types with matplotlib/seaborn on your own dataset",
            "Read the scikit-learn common pitfalls guide and write down 3 ways train/test leakage can sneak in",
            "Take a messy real-world CSV (e.g., from Kaggle Datasets) and perform a full EDA: profile missingness, detect outliers, and produce a 5-chart summary",
          ],
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
            {
              title: "Python Data Science Handbook — visualization with matplotlib",
              url: "https://jakevdp.github.io/PythonDataScienceHandbook/04.00-introduction-to-matplotlib.html",
              type: "book",
            },
            {
              title: "Seaborn official tutorial",
              url: "https://seaborn.pydata.org/tutorial.html",
              type: "docs",
            },
            {
              title: "From Data to Viz — choosing the right chart type",
              url: "https://www.data-to-viz.com/",
              type: "article",
              note: "Decision tree for picking visualizations by data shape",
            },
            {
              title: "Kaggle Learn — feature engineering micro-course",
              url: "https://www.kaggle.com/learn/feature-engineering",
              type: "course",
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
          tasks: [
            "Watch StatQuest's linear regression video, then implement linear regression with gradient descent from scratch (no scikit-learn)",
            "Extend your implementation to logistic regression: add sigmoid, switch to binary cross-entropy loss, and train on a 2D classification dataset",
            "Add L2 regularization to your gradient descent code and plot how the decision boundary changes as lambda increases",
            "Compare your from-scratch model's coefficients against scikit-learn's LinearRegression and LogisticRegression on the same data",
            "Complete Andrew Ng's Machine Learning Specialization course 1 (weeks 1-3) on Coursera",
          ],
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
            {
              title: "Google ML Crash Course — linear regression & logistic regression",
              url: "https://developers.google.com/machine-learning/crash-course/linear-regression",
              type: "course",
            },
            {
              title: "An Introduction to Statistical Learning (ISLR) — ch. 3-4",
              url: "https://www.statlearning.com/",
              type: "book",
              note: "Free PDF; the gold standard intro to regression and classification",
            },
            {
              title: "StatQuest — logistic regression, clearly explained",
              url: "https://www.youtube.com/watch?v=yIYKR4sgzI8",
              type: "video",
            },
            {
              title: "Kaggle Learn — intro to machine learning",
              url: "https://www.kaggle.com/learn/intro-to-machine-learning",
              type: "practice",
            },
          ],
        },
        {
          slug: "trees-ensembles",
          title: "Decision Trees & Ensembles",
          summary:
            "Trees, bagging, random forests, gradient boosting (XGBoost/LightGBM) — the tabular-data champions.",
          why: "Boosted trees still beat neural nets on most tabular problems; every applied role touches them.",
          tasks: [
            "Watch StatQuest's decision tree and random forest videos, then implement a decision tree classifier from scratch using recursive splitting on Gini impurity",
            "Read the XGBoost official tutorial on the boosting model and explain in your own words how gradient boosting differs from bagging",
            "Complete the Kaggle intermediate ML micro-course (exercises on random forests and XGBoost)",
            "Train XGBoost and LightGBM on a Kaggle tabular dataset, tune hyperparameters with cross-validation, and compare against your from-scratch tree",
          ],
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
            {
              title: "An Introduction to Statistical Learning (ISLR) — ch. 8 (tree-based methods)",
              url: "https://www.statlearning.com/",
              type: "book",
            },
            {
              title: "LightGBM — official documentation",
              url: "https://lightgbm.readthedocs.io/en/stable/",
              type: "docs",
            },
            {
              title: "Visual introduction to decision trees — R2D3",
              url: "http://www.r2d3.us/visual-intro-to-machine-learning-part-1/",
              type: "article",
              note: "Beautiful scrolling visualization of how trees split data",
            },
            {
              title: "How to Win a Kaggle Competition — Coursera (tree ensembles focus)",
              url: "https://www.coursera.org/learn/competitive-data-science",
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
          tasks: [
            "Watch StatQuest's SVM and PCA videos, then implement k-means clustering from scratch and test it on the Naftali Harris visualizer's example datasets",
            "Implement PCA from scratch using eigendecomposition of the covariance matrix; apply it to a high-dimensional dataset and plot the first 2 components",
            "Read the scikit-learn user guide sections on SVM, clustering, and decomposition — train each on a sample dataset",
            "Explain in your own words: how does the kernel trick let SVMs handle non-linear boundaries without explicitly computing the high-dimensional feature space?",
          ],
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
            {
              title: "An Introduction to Statistical Learning (ISLR) — ch. 9, 10, 12",
              url: "https://www.statlearning.com/",
              type: "book",
              note: "Ch. 9 = SVM, ch. 10 = clustering, ch. 12 = PCA/unsupervised",
            },
            {
              title: "Visualizing DBSCAN clustering — Naftali Harris",
              url: "https://www.naftaliharris.com/blog/visualizing-dbscan-clustering/",
              type: "article",
            },
            {
              title: "Google ML Crash Course — clustering",
              url: "https://developers.google.com/machine-learning/clustering",
              type: "course",
            },
            {
              title: "StatQuest — k-nearest neighbors, clearly explained",
              url: "https://www.youtube.com/watch?v=HVXime0nQeI",
              type: "video",
            },
          ],
        },
        {
          slug: "model-evaluation",
          title: "Model Evaluation & Validation",
          summary:
            "Cross-validation, precision/recall/F1, ROC-AUC, calibration, bias-variance, data leakage traps.",
          why: "A model is only as real as its evaluation — this skill transfers straight to LLM evals later.",
          tasks: [
            "Read the scikit-learn model evaluation guide and implement k-fold cross-validation from scratch (without using cross_val_score)",
            "Watch StatQuest's ROC and AUC video, then plot ROC curves for 3 different classifiers on the same dataset and compare",
            "Take a binary classifier and compute precision, recall, F1, and AUC by hand from the confusion matrix — verify against sklearn.metrics",
            "Create a deliberately leaky pipeline (e.g., scaling before splitting) and a correct one; show the performance gap to internalize why leakage matters",
          ],
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
            {
              title: "An Introduction to Statistical Learning (ISLR) — ch. 5 (resampling & CV)",
              url: "https://www.statlearning.com/",
              type: "book",
            },
            {
              title: "Machine Learning Mastery — cross-validation tutorial",
              url: "https://machinelearningmastery.com/k-fold-cross-validation/",
              type: "article",
            },
            {
              title: "Kaggle Learn — intermediate ML (validation & leakage)",
              url: "https://www.kaggle.com/learn/intermediate-machine-learning",
              type: "practice",
            },
            {
              title: "StatQuest — confusion matrix, clearly explained",
              url: "https://www.youtube.com/watch?v=Kdsp6soqA7o",
              type: "video",
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
          tasks: [
            "Watch Karpathy's 'spelled-out intro to neural networks and backpropagation' video and follow along in a notebook",
            "Build micrograd from scratch: implement Value class with +, *, tanh, backward() — get the full autograd engine working",
            "Watch the 3Blue1Brown neural networks series (chapters 1-4) and draw the computational graph for a 2-layer MLP",
            "Train your micrograd MLP on a toy 2D classification dataset (e.g., moons) and visualize the decision boundary",
            "Implement backprop for a 3-layer MLP using only NumPy (no autograd) and verify gradients numerically",
          ],
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
            {
              title: "Deep Learning — Ian Goodfellow et al. (ch. 6: deep feedforward networks)",
              url: "https://www.deeplearningbook.org/",
              type: "book",
              note: "The authoritative textbook; ch. 6 covers MLPs and backprop rigorously",
            },
            {
              title: "Neural Network Playground — TensorFlow",
              url: "https://playground.tensorflow.org/",
              type: "practice",
              note: "Tinker with layers, activations, and learning rate in real time",
            },
            {
              title: "Backpropagation calculus — 3Blue1Brown",
              url: "https://www.youtube.com/watch?v=tIeHLnjs5U8",
              type: "video",
            },
            {
              title: "PyTorch — official tutorials (60-min blitz)",
              url: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
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
          tasks: [
            "Read Karpathy's 'A recipe for training neural networks' blog post and write down the checklist as your personal reference",
            "Implement SGD, SGD+momentum, and Adam from scratch in NumPy; train each on the same problem and plot the loss curves side by side",
            "Read the Distill article 'Why Momentum Really Works' and explain the momentum analogy in your own words",
            "Take a model that overfits a small dataset, then add dropout and weight decay one at a time — plot how each affects train vs. val loss",
            "Read the d2l.ai optimization chapters and implement a learning rate schedule (e.g., cosine annealing) from scratch",
          ],
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
            {
              title: "An overview of gradient descent optimization algorithms — Sebastian Ruder",
              url: "https://ruder.io/optimizing-gradient-descent/",
              type: "article",
              note: "The definitive survey of SGD variants",
            },
            {
              title: "Deep Learning — Goodfellow et al. (ch. 7-8: regularization & optimization)",
              url: "https://www.deeplearningbook.org/",
              type: "book",
            },
            {
              title: "PyTorch docs — torch.optim (optimizers reference)",
              url: "https://pytorch.org/docs/stable/optim.html",
              type: "docs",
            },
            {
              title: "Weights & Biases — intro to experiment tracking",
              url: "https://docs.wandb.ai/guides",
              type: "docs",
              note: "Essential for comparing training runs and loss curves",
            },
          ],
        },
        {
          slug: "cnns",
          title: "CNNs & Computer Vision",
          summary:
            "Convolutions, pooling, classic architectures (ResNet), transfer learning for image tasks.",
          why: "Convolution is a core idea beyond vision, and transfer learning is the pattern for all applied DL.",
          tasks: [
            "Watch the 3Blue1Brown convolution video and read CS231n notes on convolutional layers, pooling, and architecture design",
            "Implement a Conv2d layer from scratch using NumPy (nested loops are fine) — verify output shape and values against PyTorch's nn.Conv2d",
            "Train a small CNN on CIFAR-10 from scratch in PyTorch, achieving at least 70% test accuracy",
            "Fine-tune a pretrained ResNet on a custom image classification task using fast.ai or PyTorch transfer learning — compare against your from-scratch CNN",
          ],
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
            {
              title: "CNN Explainer — interactive visualization",
              url: "https://poloclub.github.io/cnn-explainer/",
              type: "practice",
              note: "See how each layer transforms the image in real time",
            },
            {
              title: "Deep Residual Learning (ResNet paper)",
              url: "https://arxiv.org/abs/1512.03385",
              type: "article",
            },
            {
              title: "PyTorch — training a classifier tutorial",
              url: "https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html",
              type: "docs",
            },
            {
              title: "Dive into Deep Learning — CNNs chapters",
              url: "https://d2l.ai/chapter_convolutional-neural-networks/index.html",
              type: "book",
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
          tasks: [
            "Read Chris Olah's 'Understanding LSTM Networks' post and draw the LSTM cell diagram from memory, labeling each gate",
            "Read Karpathy's 'The Unreasonable Effectiveness of RNNs' and run his char-rnn on a small text corpus to see the generated output",
            "Implement a vanilla RNN cell from scratch in NumPy: forward pass, hidden state update, and backprop through time for 5 steps",
            "Train a character-level LSTM in PyTorch on a small text file and explain why it handles long sequences better than your vanilla RNN",
          ],
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
            {
              title: "Illustrated Guide to LSTM's and GRU's — Michael Phi",
              url: "https://towardsdatascience.com/illustrated-guide-to-lstms-and-gru-s-a-step-by-step-explanation-44e9eb85bf21",
              type: "article",
            },
            {
              title: "Sequence Models — deeplearning.ai (course 5)",
              url: "https://www.coursera.org/learn/nlp-sequence-models",
              type: "course",
            },
            {
              title: "Deep Learning — Goodfellow et al. (ch. 10: sequence modeling)",
              url: "https://www.deeplearningbook.org/",
              type: "book",
            },
            {
              title: "PyTorch — sequence-to-sequence tutorial",
              url: "https://pytorch.org/tutorials/intermediate/seq2seq_translation_tutorial.html",
              type: "docs",
            },
          ],
        },
        {
          slug: "embeddings",
          title: "Embeddings",
          summary:
            "Word2vec intuition, learned representations, cosine similarity, embedding spaces as geometry.",
          why: "Embeddings power RAG, search, recommendations, and clustering — the workhorse of applied AI.",
          tasks: [
            "Read Jay Alammar's 'The Illustrated Word2vec' and explain skip-gram vs CBOW in your own words",
            "Read Vicki Boykis's 'What are embeddings?' (chapters 1-5) and note 3 non-NLP use cases for embeddings",
            "Implement word2vec (skip-gram) from scratch in NumPy on a small corpus — train it and visualize the learned vectors with PCA/t-SNE",
            "Use an embedding API (OpenAI or sentence-transformers) to embed 50 sentences, compute cosine similarities, and cluster them with k-means",
          ],
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
            {
              title: "Sentence-Transformers documentation",
              url: "https://www.sbert.net/",
              type: "docs",
              note: "The go-to library for production sentence embeddings",
            },
            {
              title: "Embedding projector — TensorFlow (interactive visualization)",
              url: "https://projector.tensorflow.org/",
              type: "practice",
            },
            {
              title: "Word2vec Tutorial — TensorFlow",
              url: "https://www.tensorflow.org/text/tutorials/word2vec",
              type: "docs",
            },
            {
              title: "The Illustrated BERT — Jay Alammar",
              url: "https://jalammar.github.io/illustrated-bert/",
              type: "article",
              note: "Shows how contextual embeddings differ from static word2vec",
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
          tasks: [
            "Read Jay Alammar's 'The Illustrated Transformer' end to end and draw the full architecture diagram from memory",
            "Read the 'Attention Is All You Need' paper — focus on sections 3.1-3.3 (scaled dot-product attention, multi-head attention, positional encoding)",
            "Implement scaled dot-product attention from scratch in NumPy: Q, K, V matrices, softmax(QK^T/sqrt(d))V",
            "Follow Karpathy's 'Let's build GPT from scratch' video and build a working nanoGPT that trains on Shakespeare",
            "Explain in your own words: why does self-attention scale quadratically with sequence length, and what does each attention head learn to attend to?",
          ],
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
            {
              title: "The Annotated Transformer — Harvard NLP",
              url: "https://nlp.seas.harvard.edu/annotated-transformer/",
              type: "article",
              note: "Line-by-line PyTorch implementation of the original paper",
            },
            {
              title: "Transformer Explainer — interactive visualization",
              url: "https://poloclub.github.io/transformer-explainer/",
              type: "practice",
            },
            {
              title: "Attention? Attention! — Lilian Weng",
              url: "https://lilianweng.github.io/posts/2018-06-24-attention/",
              type: "article",
            },
            {
              title: "Hugging Face — NLP course (transformer architecture chapter)",
              url: "https://huggingface.co/learn/nlp-course/chapter1/1",
              type: "course",
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
          tasks: [
            "Watch Karpathy's 'Let's build the GPT Tokenizer' video and follow along to implement BPE from scratch",
            "Use the tiktokenizer playground to tokenize 10 tricky inputs (code, emoji, non-English text, numbers) and note the surprising splits",
            "Read the Hugging Face tokenizers course chapter and explain the difference between BPE, WordPiece, and SentencePiece",
            "Implement a minimal BPE tokenizer from scratch: build the merge table from a corpus, encode and decode a string, and count tokens for cost estimation",
          ],
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
            {
              title: "minbpe — Karpathy's minimal BPE implementation",
              url: "https://github.com/karpathy/minbpe",
              type: "docs",
              note: "Clean reference code to accompany the tokenizer video",
            },
            {
              title: "SentencePiece — Google's tokenizer library",
              url: "https://github.com/google/sentencepiece",
              type: "docs",
            },
            {
              title: "Hugging Face — tokenizers library docs",
              url: "https://huggingface.co/docs/tokenizers",
              type: "docs",
            },
          ],
        },
        {
          slug: "llm-training",
          title: "How LLMs Are Trained",
          summary:
            "Pretraining objectives, scaling laws, instruction tuning, RLHF/DPO — the full pipeline from web text to assistant.",
          why: "Knowing how the sausage is made explains model strengths, failure modes, and why prompting works.",
          tasks: [
            "Watch Karpathy's 'Deep dive into LLMs like ChatGPT' video and take notes on the 3-stage pipeline (pretraining, SFT, RLHF)",
            "Read the InstructGPT/RLHF paper (sections 1-3) and explain in your own words how reward modeling works",
            "Work through at least 3 chapters of Sebastian Raschka's 'LLMs from scratch' repo — run the code and train a small language model",
            "Write a 1-page summary explaining: what does the model learn during pretraining vs. instruction tuning vs. RLHF, and why are all three needed?",
          ],
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
            {
              title: "RLHF: Reinforcement Learning from Human Feedback — Chip Huyen",
              url: "https://huyenchip.com/2023/05/02/rlhf.html",
              type: "article",
              note: "Clear walkthrough of the full RLHF pipeline",
            },
            {
              title: "Scaling Laws for Neural Language Models (Kaplan et al.)",
              url: "https://arxiv.org/abs/2001.08361",
              type: "article",
            },
            {
              title: "nanoGPT — Karpathy's minimal GPT training repo",
              url: "https://github.com/karpathy/nanoGPT",
              type: "practice",
            },
            {
              title: "The Large Language Model Course — Hugging Face",
              url: "https://huggingface.co/learn/llm-course/chapter2/1",
              type: "course",
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
          tasks: [
            "Read the LoRA paper (sections 1-4) and explain in your own words: what are the low-rank matrices A and B, and why does this save memory?",
            "Read the Hugging Face PEFT docs and set up a LoRA fine-tune of a small model (e.g., Llama 3 8B or Mistral 7B) on a custom dataset",
            "Prepare a fine-tuning dataset: curate at least 200 instruction/response pairs for a specific domain task",
            "Fine-tune a model using Unsloth or Hugging Face PEFT with QLoRA, evaluate on a held-out set, and compare against the base model's zero-shot performance",
            "Write a decision checklist: when should you fine-tune vs. use few-shot prompting vs. RAG for a given task?",
          ],
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
            {
              title: "A Practical Guide to Fine-tuning LLMs — Sebastian Raschka",
              url: "https://magazine.sebastianraschka.com/p/practical-tips-for-finetuning-llms",
              type: "article",
              note: "Practical tips from the author of LLMs from Scratch",
            },
            {
              title: "QLoRA paper — Efficient Finetuning of Quantized LLMs",
              url: "https://arxiv.org/abs/2305.14314",
              type: "article",
            },
            {
              title: "Hugging Face — fine-tuning with the Trainer API",
              url: "https://huggingface.co/docs/transformers/training",
              type: "docs",
            },
            {
              title: "Axolotl — streamlined fine-tuning toolkit",
              url: "https://github.com/axolotl-ai-cloud/axolotl",
              type: "practice",
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
          tasks: [
            "Read the Claude prompt engineering guide end to end and try each technique (system prompts, few-shot, chain-of-thought) on a real task",
            "Read the Prompt Engineering Guide (promptingguide.ai) sections on advanced techniques: self-consistency, ReAct, and tree-of-thought",
            "Pick a task that fails with a naive prompt, then iteratively improve it using 3+ techniques until it reliably succeeds — document each iteration",
            "Work through 3 examples from the Anthropic cookbook, modifying them for your own use case",
          ],
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
            {
              title: "OpenAI prompt engineering guide",
              url: "https://platform.openai.com/docs/guides/prompt-engineering",
              type: "docs",
            },
            {
              title: "Chain-of-Thought Prompting paper (Wei et al.)",
              url: "https://arxiv.org/abs/2201.11903",
              type: "article",
            },
            {
              title: "Brex's Prompt Engineering Guide",
              url: "https://github.com/brexhq/prompt-engineering",
              type: "article",
              note: "Production-oriented guide with real examples",
            },
            {
              title: "Learn Prompting — open-source course",
              url: "https://learnprompting.org/",
              type: "course",
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
          tasks: [
            "Read the Pinecone RAG learning center article and diagram the full pipeline: chunk → embed → index → query → rerank → generate",
            "Read Chip Huyen's RAG blog posts and list 5 failure modes of naive RAG (e.g., wrong chunk size, no reranking)",
            "Set up pgvector in Postgres, embed 100 documents with sentence-transformers, and run similarity search queries",
            "Build a minimal RAG pipeline from scratch: chunk a PDF, embed chunks, store in a vector DB, retrieve top-k, and pass to an LLM with the context",
            "Implement hybrid search (keyword BM25 + vector similarity) and compare retrieval quality against pure vector search on 10 test queries",
          ],
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
            {
              title: "LangChain RAG tutorial",
              url: "https://python.langchain.com/docs/tutorials/rag/",
              type: "docs",
            },
            {
              title: "Building RAG-based LLM Applications — deeplearning.ai short course",
              url: "https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/",
              type: "course",
            },
            {
              title: "FAISS — Facebook AI Similarity Search",
              url: "https://github.com/facebookresearch/faiss",
              type: "docs",
              note: "The most popular open-source ANN library",
            },
            {
              title: "Chunking Strategies for RAG — Pinecone",
              url: "https://www.pinecone.io/learn/chunking-strategies/",
              type: "article",
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
          tasks: [
            "Read Anthropic's 'Building effective agents' article and diagram the 5 agentic patterns (prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer)",
            "Read the Claude tool use docs and implement a simple function-calling agent that can use 2-3 tools (e.g., calculator, web search, file reader)",
            "Read the MCP specification and set up an MCP server that exposes a tool — connect it to Claude or another LLM client",
            "Build a multi-step agent loop from scratch: reason → select tool → call tool → observe result → decide next step, with a maximum iteration limit and error handling",
          ],
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
            {
              title: "LLM Powered Autonomous Agents — Lilian Weng",
              url: "https://lilianweng.github.io/posts/2023-06-23-agent/",
              type: "article",
              note: "Comprehensive survey of agent architectures and patterns",
            },
            {
              title: "ReAct: Synergizing Reasoning and Acting (paper)",
              url: "https://arxiv.org/abs/2210.03629",
              type: "article",
            },
            {
              title: "Functions & Tools — deeplearning.ai short course",
              url: "https://www.deeplearning.ai/short-courses/function-calling-and-data-extraction-with-llms/",
              type: "course",
            },
            {
              title: "Claude Agent SDK documentation",
              url: "https://docs.claude.com/en/docs/agents-and-tools/claude-code/sdk",
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
          tasks: [
            "Read the vLLM docs and serve a small open-source model locally — measure tokens/second and compare with a naive HuggingFace generate() loop",
            "Read the Made With ML MLOps course sections on experiment tracking and set up a training run with Weights & Biases or MLflow logging",
            "Quantize a model to 4-bit (GPTQ or AWQ) and benchmark the latency vs. quality tradeoff against the full-precision version",
            "Deploy a model behind a FastAPI endpoint with batching, health checks, and basic request logging — load test it with 10 concurrent requests",
            "Read the Full Stack Deep Learning course materials on deployment and write a 1-page checklist for taking a model from notebook to production",
          ],
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
            {
              title: "MLflow — experiment tracking docs",
              url: "https://mlflow.org/docs/latest/index.html",
              type: "docs",
            },
            {
              title: "Hugging Face — Text Generation Inference (TGI)",
              url: "https://huggingface.co/docs/text-generation-inference",
              type: "docs",
            },
            {
              title: "GGML / llama.cpp — local model serving",
              url: "https://github.com/ggerganov/llama.cpp",
              type: "practice",
              note: "Run quantized models on CPU; great for understanding inference",
            },
            {
              title: "Chip Huyen — ML Systems Design (book)",
              url: "https://huyenchip.com/machine-learning-systems-design/toc.html",
              type: "book",
            },
          ],
        },
        {
          slug: "llm-evaluation",
          title: "LLM Evaluation",
          summary:
            "Golden sets, LLM-as-judge, regression suites for prompts, human eval, benchmark skepticism.",
          why: "Teams that can't measure quality can't improve it — evals are the #1 differentiator in AI product work.",
          tasks: [
            "Read Hamel Husain's 'Your AI product needs evals' blog post and list the 3 levels of eval maturity he describes",
            "Read the Claude docs on defining success criteria and build a golden test set of 20 input/expected-output pairs for a real LLM task",
            "Implement an LLM-as-judge evaluator: write a grading prompt that scores LLM outputs on a rubric, then measure inter-rater agreement against your own human scores",
            "Build a regression test suite that runs automatically when you change a prompt — flag any outputs that degrade beyond a threshold",
          ],
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
            {
              title: "Braintrust — LLM eval platform docs",
              url: "https://www.braintrust.dev/docs",
              type: "docs",
            },
            {
              title: "LLM Evaluation — deeplearning.ai short course",
              url: "https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/",
              type: "course",
            },
            {
              title: "Chatbot Arena — LMSYS leaderboard",
              url: "https://chat.lmsys.org/",
              type: "practice",
              note: "See how models are ranked via blind human eval",
            },
            {
              title: "Judging LLM-as-a-Judge — Lilian Weng",
              url: "https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/",
              type: "article",
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
          tasks: [
            "Read the OWASP Top 10 for LLM Applications and write down the top 5 risks most relevant to your work",
            "Read Simon Willison's prompt injection primer series and attempt 3 prompt injection attacks on a test chatbot you control",
            "Read 2-3 Anthropic research publications on alignment and safety — summarize the key ideas in your own words",
            "Implement input/output guardrails for an LLM app: content filtering on inputs, hallucination detection on outputs, and PII redaction",
          ],
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
            {
              title: "AI Safety Fundamentals course — BlueDot Impact",
              url: "https://aisafetyfundamentals.com/",
              type: "course",
            },
            {
              title: "Anthropic — Core Views on AI Safety",
              url: "https://www.anthropic.com/news/core-views-on-ai-safety",
              type: "article",
            },
            {
              title: "NIST AI Risk Management Framework",
              url: "https://www.nist.gov/artificial-intelligence/executive-order-safe-secure-and-trustworthy-artificial-intelligence",
              type: "docs",
              note: "The US government framework for responsible AI deployment",
            },
            {
              title: "Not what you've signed up for — prompt injection attacks (paper)",
              url: "https://arxiv.org/abs/2302.12173",
              type: "article",
            },
          ],
        },
      ],
    },
  ],
};
