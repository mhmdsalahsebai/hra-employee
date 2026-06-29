export type WellbeingMoodId = "hard" | "tired" | "good" | "great";

export interface DailyWellbeingEntry {
  date: string;
  waterCups: number;
  steps: number;
  sleepHours: number;
  activeMinutes: number;
  calories: number;
  mood: WellbeingMoodId | null;
  updatedAt: string;
}

const STORAGE_KEY = "cura-wellbeing-daily";
const moodIds: WellbeingMoodId[] = ["hard", "tired", "good", "great"];

const limits = {
  waterCups: { min: 0, max: 16 },
  steps: { min: 0, max: 100_000 },
  sleepHours: { min: 0, max: 24 },
  activeMinutes: { min: 0, max: 1_440 },
  calories: { min: 0, max: 10_000 },
} as const;

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function emptyEntry(date: string): DailyWellbeingEntry {
  return {
    date,
    waterCups: 0,
    steps: 0,
    sleepHours: 0,
    activeMinutes: 0,
    calories: 0,
    mood: null,
    updatedAt: new Date().toISOString(),
  };
}

function numberInRange(value: unknown, min: number, max: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(max, Math.max(min, value));
}

function normalizeEntry(value: unknown, date: string): DailyWellbeingEntry {
  if (!value || typeof value !== "object") return emptyEntry(date);
  const entry = value as Partial<DailyWellbeingEntry>;

  return {
    date,
    waterCups: Math.round(
      numberInRange(entry.waterCups, limits.waterCups.min, limits.waterCups.max),
    ),
    steps: Math.round(numberInRange(entry.steps, limits.steps.min, limits.steps.max)),
    sleepHours:
      Math.round(
        numberInRange(entry.sleepHours, limits.sleepHours.min, limits.sleepHours.max) * 10,
      ) / 10,
    activeMinutes: Math.round(
      numberInRange(entry.activeMinutes, limits.activeMinutes.min, limits.activeMinutes.max),
    ),
    calories: Math.round(
      numberInRange(entry.calories, limits.calories.min, limits.calories.max),
    ),
    mood:
      typeof entry.mood === "string" && moodIds.includes(entry.mood as WellbeingMoodId)
        ? (entry.mood as WellbeingMoodId)
        : null,
    updatedAt:
      typeof entry.updatedAt === "string" && !Number.isNaN(Date.parse(entry.updatedAt))
        ? entry.updatedAt
        : new Date().toISOString(),
  };
}

function readAll(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function readDailyWellbeing(date = new Date()) {
  const key = localDateKey(date);
  return normalizeEntry(readAll()[key], key);
}

export function persistDailyWellbeing(entry: DailyWellbeingEntry) {
  try {
    const normalized = normalizeEntry(entry, entry.date);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...readAll(), [normalized.date]: normalized }),
    );
  } catch {
    /* Keep the current session usable when browser storage is unavailable. */
  }
}
