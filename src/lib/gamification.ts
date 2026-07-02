/** The journey's points economy. Points are *derived* from real progress
 *  (answers, completed dimensions, daily-plan streaks) rather than stored, so
 *  they can never drift out of sync with the actual state. */

export const POINTS = {
  /** Every answered question. */
  question: 10,
  /** Bonus for finishing a whole dimension. */
  dimension: 50,
  /** Bonus for completing the full assessment. */
  fullAssessment: 150,
  /** Each day in the daily-tasks streak. */
  streakDay: 20,
  /** Each plan task checked off today. */
  taskDone: 15,
} as const;

export interface JourneyLevel {
  name: string;
  /** Points required to reach this level. */
  at: number;
}

/** Thresholds tuned to the real economy: ~140 questions × 10 + 9 × 50 + 150
 *  ≈ 2000 points for the full assessment alone — so the top level is reachable
 *  the week you finish, with streaks carrying you over the line. */
export const LEVELS: JourneyLevel[] = [
  { name: "بداية الرحلة", at: 0 },
  { name: "مستكشف", at: 200 },
  { name: "مثابر", at: 700 },
  { name: "متوازن", at: 1400 },
  { name: "سفير الرفاهية", at: 2100 },
];

export interface GamificationState {
  points: number;
  level: JourneyLevel;
  levelIndex: number;
  /** null once the top level is reached. */
  nextLevel: JourneyLevel | null;
  /** 0–100 progress from the current level toward the next. */
  levelPct: number;
}

export function computeGamification(input: {
  answeredQuestions: number;
  completedCount: number;
  hasResults: boolean;
  streakDays: number;
  todayDone: number;
}): GamificationState {
  const points =
    input.answeredQuestions * POINTS.question +
    input.completedCount * POINTS.dimension +
    (input.hasResults ? POINTS.fullAssessment : 0) +
    input.streakDays * POINTS.streakDay +
    input.todayDone * POINTS.taskDone;

  let levelIndex = 0;
  for (let i = 0; i < LEVELS.length; i++) if (points >= LEVELS[i].at) levelIndex = i;
  const level = LEVELS[levelIndex];
  const nextLevel = levelIndex + 1 < LEVELS.length ? LEVELS[levelIndex + 1] : null;
  const levelPct = nextLevel
    ? Math.min(100, Math.round(((points - level.at) / (nextLevel.at - level.at)) * 100))
    : 100;

  return { points, level, levelIndex, nextLevel, levelPct };
}
