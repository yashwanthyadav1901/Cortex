export interface ChallengeLevel {
  name: string;
  icon: string;
  dayStart: number;
  dayEnd: number;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export interface ChallengeMilestone {
  day: number;
  title: string;
  description: string;
  icon: string;
}

export const CHALLENGE_LEVELS: ChallengeLevel[] = [
  {
    name: "Foundation",
    icon: "🧱",
    dayStart: 1,
    dayEnd: 15,
    color: "blue",
    bgClass: "bg-blue-50 dark:bg-blue-950",
    borderClass: "border-blue-300 dark:border-blue-700",
    textClass: "text-blue-700 dark:text-blue-300",
  },
  {
    name: "Momentum",
    icon: "🔥",
    dayStart: 16,
    dayEnd: 30,
    color: "amber",
    bgClass: "bg-amber-50 dark:bg-amber-950",
    borderClass: "border-amber-300 dark:border-amber-700",
    textClass: "text-amber-700 dark:text-amber-300",
  },
  {
    name: "Discipline",
    icon: "⚡",
    dayStart: 31,
    dayEnd: 50,
    color: "purple",
    bgClass: "bg-purple-50 dark:bg-purple-950",
    borderClass: "border-purple-300 dark:border-purple-700",
    textClass: "text-purple-700 dark:text-purple-300",
  },
  {
    name: "Unstoppable",
    icon: "👑",
    dayStart: 51,
    dayEnd: 75,
    color: "emerald",
    bgClass: "bg-emerald-50 dark:bg-emerald-950",
    borderClass: "border-emerald-300 dark:border-emerald-700",
    textClass: "text-emerald-700 dark:text-emerald-300",
  },
];

export const CHALLENGE_MILESTONES: ChallengeMilestone[] = [
  { day: 7, title: "First Week", description: "You survived the hardest week", icon: "🌱" },
  { day: 21, title: "Habit Forming", description: "21 days — the habit is real now", icon: "🔗" },
  { day: 30, title: "One Month", description: "30 days of pure discipline", icon: "🏔️" },
  { day: 50, title: "Two-Thirds", description: "Past the point of no return", icon: "🚀" },
  { day: 75, title: "75 Hard Complete", description: "You did what most won't", icon: "🏆" },
];

export function getLevel(dayNumber: number): ChallengeLevel {
  return (
    CHALLENGE_LEVELS.find((l) => dayNumber >= l.dayStart && dayNumber <= l.dayEnd) ??
    CHALLENGE_LEVELS[0]
  );
}

export function getLevelProgress(dayNumber: number): {
  current: number;
  total: number;
  percent: number;
} {
  const level = getLevel(dayNumber);
  const current = dayNumber - level.dayStart + 1;
  const total = level.dayEnd - level.dayStart + 1;
  return { current, total, percent: Math.round((current / total) * 100) };
}

export const CHALLENGE_TASKS = [
  { key: "wake_up_early", label: "Wake up at 6 AM", icon: "⏰" },
  { key: "workout", label: "Two 45-min workouts", icon: "🏋️" },
  { key: "learning", label: "2 hours learning", icon: "📖" },
  { key: "deep_work", label: "5 hours deep work", icon: "💻" },
  { key: "reading", label: "Read 10 pages", icon: "📚" },
  { key: "water", label: "4L water", icon: "💧" },
  { key: "meditation", label: "10 min meditation", icon: "🧘" },
] as const;

export type ChallengeTaskKey = (typeof CHALLENGE_TASKS)[number]["key"];

export const CHALLENGE_QUOTES: string[] = [
  "The secret of getting ahead is getting started.",
  "Discipline is choosing between what you want now and what you want most.",
  "It's not about motivation. It's about discipline.",
  "The only bad workout is the one that didn't happen.",
  "Small daily improvements over time lead to stunning results.",
  "You don't have to be extreme, just consistent.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't wish it were easier. Wish you were better.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "The difference between who you are and who you want to be is what you do.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Every champion was once a contender that refused to give up.",
  "Motivation gets you started. Habit keeps you going.",
  "You are what you repeatedly do. Excellence is not an act, but a habit.",
  "The only way to do great work is to love what you do — and keep showing up.",
  "Hard work beats talent when talent doesn't work hard.",
  "Two weeks in. You're building something most people never will.",
  "Comfort is the enemy of progress.",
  "21 days. You've crossed the habit threshold. This is who you are now.",
  "Don't stop when you're tired. Stop when you're done.",
  "The grind is where champions are made.",
  "Fall in love with the process and the results will come.",
  "What you do every day matters more than what you do once in a while.",
  "Tough times don't last. Tough people do.",
  "Be stronger than your excuses.",
  "The only limit is the one you set yourself.",
  "You're not almost there. You're already there — just keep going.",
  "One month. 30 days of choosing discipline over comfort.",
  "Greatness is not a destination, it's a continuous journey.",
  "The best time to start was yesterday. The next best time is now — and you already started.",
  "Push yourself because no one else is going to do it for you.",
  "It always seems impossible until it's done.",
  "A river cuts through rock not because of its power, but its persistence.",
  "Believe you can and you're halfway there.",
  "Champions keep playing until they get it right.",
  "The struggle you're in today is developing the strength you need for tomorrow.",
  "Don't count the days. Make the days count.",
  "You've been going 40 days. That's not luck. That's character.",
  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
  "The more you sweat in practice, the less you bleed in battle.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Discipline is the bridge between goals and accomplishment.",
  "The mind is everything. What you think, you become.",
  "Don't wait for opportunity. Create it.",
  "Energy and persistence conquer all things.",
  "Every day is a new chance to get stronger.",
  "Be patient with yourself. Self-growth is tender.",
  "50 days. Past the point of no return. You're not stopping now.",
  "The only person you should try to be better than is the person you were yesterday.",
  "Do something today that your future self will thank you for.",
  "It's a slow process, but quitting won't speed it up.",
  "You didn't come this far to only come this far.",
  "Obsessed is a word the lazy use to describe the dedicated.",
  "What consumes your mind controls your life. Choose discipline.",
  "Great things never come from comfort zones.",
  "The body achieves what the mind believes.",
  "Winners are not people who never fail, but people who never quit.",
  "60 days. You've done what most people only talk about.",
  "Your future is created by what you do today, not tomorrow.",
  "If it doesn't challenge you, it doesn't change you.",
  "The distance between your dreams and reality is called discipline.",
  "Hard days are the best because that's when champions are made.",
  "Stay focused. Stay humble. Stay hard.",
  "You're in the final stretch. Every day counts more now.",
  "The last 10 days will define everything. Leave nothing behind.",
  "Pain is temporary. The pride of finishing lasts forever.",
  "Almost there. Don't you dare slow down.",
  "This is what you trained for. Finish it.",
  "Three more days. You can do anything for three days.",
  "Two days. The finish line is right there.",
  "Tomorrow you finish. Tonight you prepare like a champion.",
  "One more day. One more push. One more time.",
  "Day 75. You did it. You are 75 Hard.",
];
