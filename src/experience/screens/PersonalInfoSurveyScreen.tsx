import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";
import { ProgressHeader } from "../components/ProgressHeader";
import { SurveyOption } from "../components/SurveyOption";
import { PrimaryButton } from "../components/PrimaryButton";
import type { Accent } from "../survey";
import {
  personalInfoQuestions,
  type PersonalInfoAnswers,
  type PersonalInfoQuestionId,
} from "../../data/personalInfo";

/**
 * The post-login survey: the real personal-info questions (from the HRA
 * "معلومات شخصية" set), rendered in the dark premium card style. One question
 * per card, Arabic / RTL, with the same calm transitions as the rest of the
 * experience. Answers persist so the main app can read them.
 */

/** Soft wellbeing-coded accents, cycled so the card mood shifts per question. */
const lavender: Accent = { solid: "#7c6cf0", soft: "#efeefe", ring: "#cfc8fb" };
const coral: Accent = { solid: "#f4675f", soft: "#ffece9", ring: "#fbc9c4" };
const amber: Accent = { solid: "#e3992f", soft: "#fff3dd", ring: "#f6d699" };
const blue: Accent = { solid: "#3877ff", soft: "#e7eeff", ring: "#bcd1ff" };
const ACCENTS = [lavender, coral, amber, blue];

const PERSONAL_STORAGE_KEY = "cura-sim-personal-info";

function readStored(): PersonalInfoAnswers {
  try {
    const saved = localStorage.getItem(PERSONAL_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as PersonalInfoAnswers) : {};
  } catch {
    return {};
  }
}

export function PersonalInfoSurveyScreen({
  onFinish,
  onExit,
  finishing,
}: {
  onFinish: (answers: PersonalInfoAnswers) => void;
  onExit: () => void;
  /** True while the finish→completion transition is loading. */
  finishing: boolean;
}) {
  const [answers, setAnswers] = useState<PersonalInfoAnswers>(readStored);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "back">("next");

  // The visible list can grow/shrink (pregnant shows only for gender = أنثى).
  const visible = useMemo(
    () => personalInfoQuestions.filter((q) => !q.visibleIf || q.visibleIf(answers)),
    [answers],
  );
  const total = visible.length;
  const idx = Math.min(index, total - 1);
  const q = visible[idx];
  const accent = ACCENTS[idx % ACCENTS.length];
  const isLast = idx === total - 1;
  const answered = !q.required || Boolean(answers[q.id]);

  function update(id: PersonalInfoQuestionId, value: string) {
    setAnswers((prev) => {
      const nextAnswers: PersonalInfoAnswers = { ...prev, [id]: value };
      if (id === "gender" && value !== "2") delete nextAnswers.pregnant;
      return nextAnswers;
    });
  }

  function goNext() {
    if (!answered) return;
    if (isLast) {
      try {
        localStorage.setItem(PERSONAL_STORAGE_KEY, JSON.stringify(answers));
      } catch {
        /* ignore unavailable storage */
      }
      onFinish(answers);
      return;
    }
    setDirection("next");
    setIndex(idx + 1);
  }

  function goBack() {
    if (idx === 0) {
      onExit();
      return;
    }
    setDirection("back");
    setIndex(idx - 1);
  }

  return (
    <>
      <ProgressHeader current={idx + 1} total={total} accent={accent.solid} />

      {/* perspective wrapper enables the gentle 3D card rotation on transitions */}
      <div className="mt-6 flex flex-1 flex-col" style={{ perspective: "1200px" }}>
        <div
          key={q.id}
          dir="rtl"
          className={cn(
            "flex min-h-0 flex-1 flex-col rounded-[24px] bg-white p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)]",
            // RTL-aware: forward slides in from the leading (left) edge.
            direction === "next" ? "exp-q-back" : "exp-q-next",
          )}
        >
          {/* eyebrow */}
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9aa0ae]">
            معلومات شخصية
          </span>

          {/* colour dot + question */}
          <div className="mt-3 flex gap-3">
            <span
              className="mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: accent.solid, boxShadow: `0 0 10px ${accent.solid}` }}
            />
            <h2 className="text-[21px] font-bold leading-[1.34] text-[#10121a]">
              {q.title}
              {!q.required && <span className="mr-2 text-[13px] font-semibold text-[#9aa0ae]">اختياري</span>}
            </h2>
          </div>

          {/* body — radios for choices/booleans, a field for inputs;
              scrolls within the card when a question has many/long options */}
          <div className="-mx-1 mt-6 min-h-0 flex-1 overflow-y-auto px-1">
            {q.kind === "choice" && (
              <div className="exp-stagger flex flex-col gap-2.5">
                {q.answers.map((opt) => (
                  <SurveyOption
                    key={opt.value}
                    label={opt.title}
                    selected={answers[q.id] === opt.value}
                    accent={accent}
                    onClick={() => update(q.id, opt.value)}
                  />
                ))}
              </div>
            )}

            {q.kind === "boolean" && (
              <div className="exp-stagger flex flex-col gap-2.5">
                <SurveyOption
                  label={q.trueTitle}
                  selected={answers[q.id] === "true"}
                  accent={accent}
                  onClick={() => update(q.id, "true")}
                />
                <SurveyOption
                  label={q.falseTitle}
                  selected={answers[q.id] === "false"}
                  accent={accent}
                  onClick={() => update(q.id, "false")}
                />
              </div>
            )}

            {q.kind === "input" && (
              <div className="flex items-center overflow-hidden rounded-[14px] border border-[#e6e8ef] bg-[#fafafa] transition focus-within:border-[#0057ff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0057ff]/10">
                <input
                  autoFocus
                  type={q.inputType}
                  inputMode={q.inputType === "number" ? "decimal" : undefined}
                  min={q.inputType === "number" ? "0" : undefined}
                  value={answers[q.id] ?? ""}
                  onChange={(e) => update(q.id, e.target.value)}
                  className="h-[54px] w-full min-w-0 flex-1 bg-transparent px-4 text-[15px] font-medium text-[#10121a] outline-none placeholder:text-[#aab0be]"
                />
                {q.unit && (
                  <span className="shrink-0 border-r border-[#ececf1] px-4 text-xs font-bold text-[#9aa0ae]">
                    {q.unit}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* navigation — anchored to the bottom of the tall card */}
          <div className="flex shrink-0 items-center gap-3 pt-6">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-[56px] items-center gap-1 rounded-[16px] px-3 text-[15px] font-semibold text-[#7b8194] transition hover:text-[#10121a]"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.3} />
              السابق
            </button>
            <PrimaryButton
              fullWidth={false}
              className="flex-1"
              disabled={!answered}
              loading={isLast && finishing}
              onClick={goNext}
            >
              {isLast ? "إنهاء" : "التالي"}
              {!isLast && <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
}
