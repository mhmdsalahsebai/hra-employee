import { useState } from "react";
import { ProgressHeader } from "../components/ProgressHeader";
import { SurveyQuestionCard } from "../components/SurveyQuestionCard";
import { SURVEY_QUESTIONS, type SurveyAnswers } from "../survey";

/**
 * The survey. Owns the question index, answers, and slide direction; renders the
 * progress header and one question card at a time. Calls `onFinish` with the
 * collected answers on the last step, and `onExit` when backing out of step 1.
 */
export function SurveyScreen({
  onFinish,
  onExit,
  finishing,
}: {
  onFinish: (answers: SurveyAnswers) => void;
  onExit: () => void;
  /** True while the finish→completion transition is loading. */
  finishing: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [direction, setDirection] = useState<"next" | "back">("next");

  const total = SURVEY_QUESTIONS.length;
  const question = SURVEY_QUESTIONS[index];
  const isLast = index === total - 1;

  function select(optionId: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  }

  function goNext() {
    if (isLast) {
      onFinish(answers);
      return;
    }
    setDirection("next");
    setIndex((i) => i + 1);
  }

  function goBack() {
    if (index === 0) {
      onExit();
      return;
    }
    setDirection("back");
    setIndex((i) => i - 1);
  }

  return (
    <>
      <ProgressHeader
        current={index + 1}
        total={total}
        accent={question.accent.solid}
        onSkip={goNext}
      />

      {/* perspective wrapper enables the gentle 3D card rotation on transitions */}
      <div className="mt-6 flex flex-1 flex-col" style={{ perspective: "1200px" }}>
        <SurveyQuestionCard
          key={question.id}
          question={question}
          selectedId={answers[question.id]}
          onSelect={select}
          onBack={goBack}
          onNext={goNext}
          direction={direction}
          isLast={isLast}
          loading={isLast && finishing}
        />
      </div>
    </>
  );
}
