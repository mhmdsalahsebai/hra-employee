import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";
import { PrimaryButton } from "./PrimaryButton";
import { SurveyOption } from "./SurveyOption";
import { SURVEY_EYEBROW, type SurveyQuestion } from "../survey";

/**
 * The white survey card: muted eyebrow, a colour dot + bold question, the
 * answer rows, and Back / Next navigation. Animates in per question (direction
 * aware) and disables Next until an answer is chosen.
 */
export function SurveyQuestionCard({
  question,
  selectedId,
  onSelect,
  onBack,
  onNext,
  direction,
  isLast,
  loading,
}: {
  question: SurveyQuestion;
  selectedId?: string;
  onSelect: (optionId: string) => void;
  onBack: () => void;
  onNext: () => void;
  direction: "next" | "back";
  isLast: boolean;
  loading: boolean;
}) {
  const accent = question.accent;
  const answered = Boolean(selectedId);

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col rounded-[24px] bg-white p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)]",
        direction === "back" ? "exp-q-back" : "exp-q-next",
      )}
    >
      {/* eyebrow */}
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9aa0ae]">
        {SURVEY_EYEBROW}
      </span>

      {/* colour dot + question */}
      <div className="mt-3 flex gap-3">
        <span
          className="mt-[7px] h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: accent.solid, boxShadow: `0 0 10px ${accent.solid}` }}
        />
        <h2 className="text-[21px] font-bold leading-[1.34] text-[#10121a]">{question.question}</h2>
      </div>

      {/* answers — scroll within the card when a question has many/long options */}
      <div className="exp-stagger -mx-1 mt-6 flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-1">
        {question.options.map((opt) => (
          <SurveyOption
            key={opt.id}
            label={opt.label}
            selected={selectedId === opt.id}
            accent={accent}
            onClick={() => onSelect(opt.id)}
          />
        ))}
      </div>

      {/* navigation — anchored to the bottom of the tall card */}
      <div className="flex shrink-0 items-center gap-3 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-[56px] items-center gap-1 rounded-[16px] px-3 text-[15px] font-semibold text-[#7b8194] transition hover:text-[#10121a]"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.3} />
          Back
        </button>
        <PrimaryButton
          fullWidth={false}
          className="flex-1"
          disabled={!answered}
          loading={loading}
          onClick={onNext}
        >
          {isLast ? "Finish" : "Next"}
          {!isLast && !loading && <ChevronRight className="h-5 w-5" strokeWidth={2.4} />}
        </PrimaryButton>
      </div>
    </div>
  );
}
