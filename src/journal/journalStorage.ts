export type JournalMoodId = "hard" | "tired" | "good" | "great";

export interface JournalEntry {
  id: string;
  mood: JournalMoodId;
  text: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "cura-journal-entries";
const moodIds: JournalMoodId[] = ["hard", "tired", "good", "great"];

function isMood(value: unknown): value is JournalMoodId {
  return typeof value === "string" && moodIds.includes(value as JournalMoodId);
}

function isDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isEntry(value: unknown): value is JournalEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<JournalEntry>;
  return (
    typeof entry.id === "string" &&
    isMood(entry.mood) &&
    typeof entry.text === "string" &&
    entry.text.trim().length > 0 &&
    isDate(entry.createdAt) &&
    isDate(entry.updatedAt)
  );
}

export function readJournalEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(isEntry)
      .map((entry) => ({ ...entry, text: entry.text.trim().slice(0, 1000) }))
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  } catch {
    return [];
  }
}

export function persistJournalEntries(entries: JournalEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* Keep the current session usable when browser storage is unavailable. */
  }
}

export function createJournalEntry(mood: JournalMoodId, text: string): JournalEntry {
  const now = new Date().toISOString();
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `journal-${Date.now()}`;

  return {
    id,
    mood,
    text: text.trim(),
    createdAt: now,
    updatedAt: now,
  };
}
