import { Illustration, type IllustrationName } from "../illustrations/Illustration";
import { Button, ProgressBar } from "./ui";

/** Empty / gated screen shown before the assessment unlocks a feature. */
export function LockedState({
  title,
  subtitle,
  ctaLabel,
  onCta,
  progress,
  illustration = "mindfulness",
}: {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onCta: () => void;
  /** Optional progress bar (used for the "mid-assessment" state). */
  progress?: number;
  /** Calm illustration that sets the mood of the empty state. */
  illustration?: IllustrationName;
}) {
  return (
    <div className="px-5 pt-6">
      <div className="flex flex-col items-center rounded-xl border border-ink-100 bg-surface px-7 py-10 text-center shadow-soft">
        <Illustration
          name={illustration}
          className="mb-6 w-44 max-w-[60%]"
          tone="var(--color-brand-400)"
        />
        <h2 className="mt-1 text-lg font-bold text-ink-900">{title}</h2>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-500">{subtitle}</p>

        {progress !== undefined && (
          <div className="mt-6 w-full max-w-xs">
            <div className="mb-2 flex items-center justify-between text-xs font-bold">
              <span className="text-ink-500">تقدّمك في التقييم</span>
              <span className="nums text-brand-700">{progress}%</span>
            </div>
            <ProgressBar value={progress} barClassName="bg-brand-600" />
          </div>
        )}

        <div className="mt-7 w-full max-w-xs">
          <Button fullWidth size="lg" onClick={onCta}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
