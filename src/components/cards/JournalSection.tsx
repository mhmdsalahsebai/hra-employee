import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  Frown,
  History,
  Laugh,
  LockKeyhole,
  Meh,
  PenLine,
  Plus,
  Save,
  Smile,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button, SectionHeader } from "../ui";
import { cn } from "../../lib/cn";
import {
  createJournalEntry,
  persistJournalEntries,
  readJournalEntries,
  type JournalEntry,
  type JournalMoodId,
} from "../../journal/journalStorage";

interface MoodOption {
  id: JournalMoodId;
  icon: LucideIcon;
  label: string;
  color: string;
  soft: string;
}

const moods: MoodOption[] = [
  { id: "hard", icon: Frown, label: "صعب", color: "#c0653e", soft: "#fae3dd" },
  { id: "tired", icon: Meh, label: "متعب", color: "#b8923a", soft: "#f4ecd8" },
  { id: "good", icon: Smile, label: "جيد", color: "#2f8a66", soft: "#e1efe8" },
  { id: "great", icon: Laugh, label: "رائع", color: "#e23e6b", soft: "#ffe1ea" },
];

type JournalScreen =
  | { kind: "history" }
  | { kind: "editor"; entryId?: string; returnTo: "home" | "history" };

const dayFormatter = new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
  hour: "numeric",
  minute: "2-digit",
});

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function entryDateLabel(iso: string, includeTime = false) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const day = sameDay(date, today)
    ? "اليوم"
    : sameDay(date, yesterday)
      ? "أمس"
      : dayFormatter.format(date);

  return includeTime ? `${day}، ${timeFormatter.format(date)}` : day;
}

function moodFor(id: JournalMoodId) {
  return moods.find((mood) => mood.id === id) ?? moods[2];
}

export function JournalSection() {
  const [entries, setEntries] = useState<JournalEntry[]>(readJournalEntries);
  const [screen, setScreen] = useState<JournalScreen | null>(null);
  const recentEntries = entries.slice(0, 2);

  function commit(next: JournalEntry[]) {
    const sorted = [...next].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    persistJournalEntries(sorted);
    setEntries(sorted);
  }

  function saveEntry(entryId: string | undefined, mood: JournalMoodId, text: string) {
    if (!entryId) {
      commit([createJournalEntry(mood, text), ...entries]);
      return;
    }

    commit(
      entries.map((entry) =>
        entry.id === entryId
          ? { ...entry, mood, text: text.trim(), updatedAt: new Date().toISOString() }
          : entry,
      ),
    );
  }

  function deleteEntry(entryId: string) {
    commit(entries.filter((entry) => entry.id !== entryId));
  }

  function leaveEditor(returnTo: "home" | "history") {
    setScreen(returnTo === "history" ? { kind: "history" } : null);
  }

  const activeEntry =
    screen?.kind === "editor" && screen.entryId
      ? entries.find((entry) => entry.id === screen.entryId)
      : undefined;

  return (
    <section className="px-5 pt-7">
      <SectionHeader title="يومياتك" action="الكل" onAction={() => setScreen({ kind: "history" })} />

      <button
        onClick={() => setScreen({ kind: "editor", returnTo: "home" })}
        style={{ background: "color-mix(in srgb, #2e80d2 11%, white)" }}
        className="flex w-full items-center gap-3.5 rounded-[1.4rem] p-4 text-right shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-card active:translate-y-0"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[1rem] bg-white text-brand-600 shadow-soft">
          <PenLine className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-[15px] font-bold text-ink-900">كيف كان يومك؟</h3>
            <Sparkles className="h-3.5 w-3.5 text-brand-500" strokeWidth={2.4} />
          </div>
          <p className="mt-0.5 text-xs font-semibold text-ink-400">دوّن لحظة من يومك في سطور قليلة</p>
        </div>
        <span className="shrink-0 rounded-pill bg-brand-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-soft">
          اكتب
        </span>
      </button>

      {recentEntries.length > 0 ? (
        <div className="mt-3 space-y-2.5">
          {recentEntries.map((entry) => (
            <JournalEntryRow
              key={entry.id}
              entry={entry}
              onClick={() => setScreen({ kind: "editor", entryId: entry.id, returnTo: "home" })}
            />
          ))}
        </div>
      ) : (
        <button
          onClick={() => setScreen({ kind: "editor", returnTo: "home" })}
          className="mt-3 flex w-full items-center gap-3 rounded-xl border border-dashed border-ink-200 px-4 py-3.5 text-right transition hover:border-brand-300 hover:bg-brand-50/50"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink-50 text-ink-400">
            <History className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <div>
            <p className="text-[13px] font-bold text-ink-600">لا توجد تدوينات بعد</p>
            <p className="mt-0.5 text-[11px] font-semibold text-ink-400">ابدأ بأول لحظة تريد أن تتذكرها</p>
          </div>
        </button>
      )}

      {screen &&
        createPortal(
          <JournalOverlay
            screen={screen}
            entries={entries}
            activeEntry={activeEntry}
            onClose={() => setScreen(null)}
            onBack={leaveEditor}
            onNew={() => setScreen({ kind: "editor", returnTo: "history" })}
            onOpen={(entryId) =>
              setScreen({ kind: "editor", entryId, returnTo: "history" })
            }
            onSave={saveEntry}
            onDelete={deleteEntry}
          />,
          document.body,
        )}
    </section>
  );
}

function JournalEntryRow({ entry, onClick }: { entry: JournalEntry; onClick: () => void }) {
  const mood = moodFor(entry.mood);

  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-[1.4rem] bg-surface p-3.5 text-right shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-card active:translate-y-0"
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
        style={{ background: mood.soft, color: mood.color }}
      >
        <mood.icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-bold text-ink-400">{entryDateLabel(entry.createdAt)}</span>
        <p className="mt-0.5 line-clamp-2 text-[13px] font-semibold leading-snug text-ink-700">
          {entry.text}
        </p>
      </div>
      <ChevronLeft className="mt-1 h-4 w-4 shrink-0 text-ink-300" strokeWidth={2.4} />
    </button>
  );
}

function JournalOverlay({
  screen,
  entries,
  activeEntry,
  onClose,
  onBack,
  onNew,
  onOpen,
  onSave,
  onDelete,
}: {
  screen: JournalScreen;
  entries: JournalEntry[];
  activeEntry?: JournalEntry;
  onClose: () => void;
  onBack: (returnTo: "home" | "history") => void;
  onNew: () => void;
  onOpen: (entryId: string) => void;
  onSave: (entryId: string | undefined, mood: JournalMoodId, text: string) => void;
  onDelete: (entryId: string) => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (screen.kind === "editor") onBack(screen.returnTo);
      else onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onBack, onClose, screen]);

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-dialog-title"
      className="fixed inset-0 z-50 mx-auto flex h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-canvas shadow-pop"
    >
      {screen.kind === "history" ? (
        <JournalHistory
          entries={entries}
          onClose={onClose}
          onNew={onNew}
          onOpen={onOpen}
        />
      ) : (
        <JournalEditor
          key={activeEntry?.id ?? "new-entry"}
          entry={activeEntry}
          onBack={() => onBack(screen.returnTo)}
          onSave={(mood, text) => {
            onSave(activeEntry?.id, mood, text);
            onBack(screen.returnTo);
          }}
          onDelete={
            activeEntry
              ? () => {
                  onDelete(activeEntry.id);
                  onBack(screen.returnTo);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

function OverlayHeader({
  title,
  subtitle,
  onBack,
  onClose,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onClose?: () => void;
}) {
  return (
    <header className="shrink-0 border-b border-ink-100 bg-surface px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="رجوع"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink-50 text-ink-700 transition hover:bg-ink-100 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 id="journal-dialog-title" className="text-lg font-extrabold text-ink-900">
            {title}
          </h1>
          {subtitle && <p className="mt-0.5 text-xs font-semibold text-ink-400">{subtitle}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="إغلاق اليوميات"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink-50 text-ink-500 transition hover:bg-ink-100 hover:text-ink-800 active:scale-95"
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>
        )}
      </div>
    </header>
  );
}

function JournalHistory({
  entries,
  onClose,
  onNew,
  onOpen,
}: {
  entries: JournalEntry[];
  onClose: () => void;
  onNew: () => void;
  onOpen: (entryId: string) => void;
}) {
  return (
    <>
      <OverlayHeader
        title="يومياتك"
        subtitle={entries.length ? `${entries.length.toLocaleString("en-US")} تدوينة خاصة` : "مساحتك الخاصة للتأمل"}
        onClose={onClose}
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {entries.length ? (
          <div className="stagger space-y-3 pb-24">
            {entries.map((entry) => (
              <JournalEntryRow key={entry.id} entry={entry} onClick={() => onOpen(entry.id)} />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 pb-20 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-soft text-brand-700">
              <PenLine className="h-8 w-8" strokeWidth={1.8} />
            </span>
            <h2 className="mt-5 text-xl font-extrabold text-ink-900">ابدأ من لحظة اليوم</h2>
            <p className="mt-2 max-w-xs text-sm font-semibold leading-relaxed text-ink-400">
              لا تحتاج إلى كتابة الكثير؛ سطر صادق يكفي لتلاحظ كيف تتغيّر أيامك.
            </p>
            <Button className="mt-6" onClick={onNew}>
              <Plus className="h-4 w-4" strokeWidth={2.6} />
              أضف أول تدوينة
            </Button>
          </div>
        )}
      </div>

      {entries.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 border-t border-ink-100 bg-surface/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
          <Button fullWidth onClick={onNew}>
            <Plus className="h-4 w-4" strokeWidth={2.6} />
            تدوينة جديدة
          </Button>
        </div>
      )}
    </>
  );
}

function JournalEditor({
  entry,
  onBack,
  onSave,
  onDelete,
}: {
  entry?: JournalEntry;
  onBack: () => void;
  onSave: (mood: JournalMoodId, text: string) => void;
  onDelete?: () => void;
}) {
  const [mood, setMood] = useState<JournalMoodId | null>(entry?.mood ?? null);
  const [text, setText] = useState(entry?.text ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const trimmedText = text.trim();
  const canSave = mood !== null && trimmedText.length > 0;
  const isDirty = mood !== (entry?.mood ?? null) || trimmedText !== (entry?.text ?? "");
  const editorDate = useMemo(
    () => entryDateLabel(entry?.createdAt ?? new Date().toISOString(), true),
    [entry?.createdAt],
  );

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  return (
    <>
      <OverlayHeader
        title={entry ? "تدوينتك" : "تدوينة جديدة"}
        subtitle={editorDate}
        onBack={onBack}
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <section aria-labelledby="mood-heading">
          <h2 id="mood-heading" className="text-sm font-bold text-ink-800">
            كيف تصف شعورك؟
          </h2>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {moods.map((option) => {
              const selected = mood === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setMood(option.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border py-3 transition active:scale-95",
                    selected
                      ? "border-transparent bg-surface shadow-soft ring-2 ring-brand-500/25"
                      : "border-ink-100 bg-surface hover:border-ink-200",
                  )}
                >
                  <span
                    className="grid h-10 w-10 place-items-center rounded-full transition"
                    style={
                      selected
                        ? { background: option.color, color: "#fff" }
                        : { background: option.soft, color: option.color }
                    }
                  >
                    <option.icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: selected ? option.color : "#70807d" }}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6" aria-labelledby="reflection-heading">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 id="reflection-heading" className="text-sm font-bold text-ink-800">
                ماذا تريد أن تتذكر؟
              </h2>
              <p className="mt-1 text-xs font-semibold text-ink-400">اكتب بطريقتك، من دون أحكام.</p>
            </div>
            <span className="nums text-[10px] font-semibold text-ink-400">{text.length}/1000</span>
          </div>
          <textarea
            ref={textAreaRef}
            value={text}
            maxLength={1000}
            onChange={(event) => setText(event.target.value)}
            placeholder="اليوم شعرت بـ..."
            className="mt-3 min-h-48 w-full resize-none rounded-xl border border-ink-100 bg-surface p-4 text-[15px] font-semibold leading-relaxed text-ink-800 shadow-soft outline-none transition placeholder:font-medium focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
        </section>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-brand-50 px-3.5 py-3 text-brand-800">
          <LockKeyhole className="h-4 w-4 shrink-0" strokeWidth={2.2} />
          <p className="text-[11px] font-bold leading-relaxed">هذه التدوينة خاصة بك ومحفوظة على هذا الجهاز.</p>
        </div>

        {entry && (
          <div className="mt-8 border-t border-ink-100 pt-5">
            {confirmDelete ? (
              <div className="rounded-xl border border-alert/20 bg-alert-soft p-4">
                <p className="text-sm font-bold text-ink-900">حذف هذه التدوينة نهائيًا؟</p>
                <p className="mt-1 text-xs font-semibold text-ink-500">لا يمكن التراجع عن هذا الإجراء.</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="coral" size="sm" onClick={onDelete}>
                    نعم، احذفها
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                    تراجع
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-2 rounded-pill px-3 py-2 text-sm font-bold text-alert transition hover:bg-alert-soft active:scale-95"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                حذف التدوينة
              </button>
            )}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-ink-100 bg-surface px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <Button
          fullWidth
          disabled={!canSave || (entry !== undefined && !isDirty)}
          onClick={() => mood && onSave(mood, trimmedText)}
        >
          <Save className="h-4 w-4" strokeWidth={2.4} />
          {entry ? "حفظ التغييرات" : "حفظ التدوينة"}
        </Button>
      </div>
    </>
  );
}
