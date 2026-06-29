import { type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Ruler,
  Scale,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Button, Card, ProgressBar } from "../components/ui";
import {
  personalInfoQuestions,
  type PersonalInfoAnswers,
  type PersonalInfoQuestion,
  type PersonalInfoQuestionId,
} from "../data/personalInfo";
import { cn } from "../lib/cn";
import { useOnboarding } from "../onboarding/useOnboarding";

const STORAGE_KEY = "cura-sim-personal-info";

const inputClass =
  "min-h-[3.25rem] min-w-0 flex-1 bg-transparent px-4 py-3 text-[15px] font-semibold text-ink-900 outline-none placeholder:text-ink-400";

const icons: Record<PersonalInfoQuestionId, typeof CalendarDays> = {
  birthDate: CalendarDays,
  gender: UserRound,
  pregnant: HeartPulse,
  height: Ruler,
  weight: Scale,
  waistCircumference: Ruler,
  relationshipStatus: UsersRound,
};

function readStoredAnswers(): PersonalInfoAnswers {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as PersonalInfoAnswers) : {};
  } catch {
    return {};
  }
}

export function PersonalInfo() {
  const navigate = useNavigate();
  const onboarding = useOnboarding();
  const [answers, setAnswers] = useState<PersonalInfoAnswers>(readStoredAnswers);

  const visibleQuestions = useMemo(
    () => personalInfoQuestions.filter((question) => !question.visibleIf || question.visibleIf(answers)),
    [answers],
  );
  const requiredQuestions = visibleQuestions.filter((question) => question.required);
  const answeredRequired = requiredQuestions.filter((question) => Boolean(answers[question.id])).length;
  const ready = answeredRequired === requiredQuestions.length;
  const progress = Math.round((answeredRequired / requiredQuestions.length) * 100);

  function update(id: PersonalInfoQuestion["id"], value: string) {
    setAnswers((previous) => {
      const next: PersonalInfoAnswers = { ...previous, [id]: value };
      if (id === "gender" && value !== "2") delete next.pregnant;
      return next;
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* ignore unavailable storage */
    }
    onboarding.complete();
    navigate("/");
  }

  function backToInvitation() {
    onboarding.setStep("invitation");
    navigate("/invitation");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-canvas px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={backToInvitation}
          aria-label="العودة"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-200 bg-surface text-ink-700 transition hover:border-ink-300 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[0.8125rem] font-semibold text-ink-400">الخطوة الأخيرة</p>
          <h1 className="truncate text-lg font-extrabold text-ink-900">معلومات شخصية</h1>
        </div>
        <img src="/cura.svg" alt="cura" className="h-8 w-auto" />
      </header>

      <main className="animate-rise flex flex-1 flex-col pt-6">
        <div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-pill bg-brand-50 px-3 py-1.5 text-[11px] font-bold text-brand-700">
            قبل الصفحة الرئيسية
          </span>
          <h2 className="mt-4 text-[1.55rem] font-extrabold leading-[1.32] text-ink-900">
            قبل أن نبدأ نود أن نتعرف عليك أكثر
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
            يرجى إدخال قياساتك الأساسية حتى تكون نتائج التقييم والتوصيات أدق.
          </p>
        </div>

        <div className="mt-5 rounded-card border border-ink-100 bg-surface p-4 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-ink-900">اكتمال البيانات</p>
            <span className="nums text-sm font-extrabold text-brand-700">{progress}%</span>
          </div>
          <div className="mt-3">
            <ProgressBar value={progress} barClassName="bg-brand-600" />
          </div>
        </div>

        <form className="mt-4 flex flex-1 flex-col" onSubmit={submit}>
          <Card className="space-y-5">
            {visibleQuestions.map((question) => (
              <PersonalInfoField
                key={question.id}
                question={question}
                value={answers[question.id] ?? ""}
                onChange={(value) => update(question.id, value)}
              />
            ))}
          </Card>

          <div className="sticky bottom-0 -mx-5 mt-auto bg-gradient-to-t from-canvas via-canvas to-transparent px-5 pb-1 pt-5">
            <Button fullWidth size="lg" disabled={!ready}>
              الدخول إلى الرئيسية
              <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-ink-400">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
              بياناتك الصحية سرية وتستخدم لتخصيص تجربتك فقط
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

function PersonalInfoField({
  question,
  value,
  onChange,
}: {
  question: PersonalInfoQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  const Icon = icons[question.id];

  return (
    <fieldset>
      <legend className="mb-2 flex items-center gap-2 text-sm font-bold text-ink-900">
        <span className="grid h-8 w-8 place-items-center rounded-[0.6rem] bg-brand-50 text-brand-700">
          <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.2} />
        </span>
        {question.title}
        {!question.required && <span className="text-xs font-semibold text-ink-400">اختياري</span>}
      </legend>

      {question.kind === "input" && (
        <div className="flex items-center overflow-hidden rounded-md border border-ink-200 bg-surface transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
          <input
            className={cn(inputClass, question.inputType === "number" && "nums")}
            type={question.inputType}
            inputMode={question.inputType === "number" ? "decimal" : undefined}
            min={question.inputType === "number" ? "0" : undefined}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
          {question.unit && (
            <span className="shrink-0 border-r border-ink-100 px-4 text-xs font-bold text-ink-400">
              {question.unit}
            </span>
          )}
        </div>
      )}

      {question.kind === "choice" && (
        <div className={cn("grid gap-2", question.id === "gender" && "grid-cols-2")}>
          {question.answers.map((answer) => (
            <ChoiceButton
              key={answer.value}
              label={answer.title}
              selected={value === answer.value}
              onClick={() => onChange(answer.value)}
            />
          ))}
        </div>
      )}

      {question.kind === "boolean" && (
        <div className="grid grid-cols-2 gap-2">
          <ChoiceButton label={question.trueTitle} selected={value === "true"} onClick={() => onChange("true")} />
          <ChoiceButton label={question.falseTitle} selected={value === "false"} onClick={() => onChange("false")} />
        </div>
      )}
    </fieldset>
  );
}

function ChoiceButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-12 w-full items-center gap-2 rounded-md border px-3 py-2.5 text-right text-sm font-bold transition active:scale-[0.99]",
        selected
          ? "border-brand-500 bg-brand-50 text-brand-900 shadow-soft"
          : "border-ink-200 bg-surface text-ink-600 hover:border-ink-300",
      )}
    >
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
          selected ? "border-brand-600 bg-brand-600 text-white" : "border-ink-300",
        )}
      >
        <Check className={cn("h-3 w-3", selected ? "opacity-100" : "opacity-0")} strokeWidth={3} />
      </span>
      <span className="min-w-0 flex-1">{label}</span>
    </button>
  );
}
