import { PrimaryButton } from "../components/PrimaryButton";
import { WellbeingBloom } from "../illustrations/WellbeingBloom";

/**
 * Assessment complete. A reassuring wellbeing bloom above a white card that
 * hands off to the personalised plan / dashboard.
 */
export function CompletionScreen({ onView, loading }: { onView: () => void; loading: boolean }) {
  return (
    <>
      <div className="flex flex-1 items-center justify-center">
        <WellbeingBloom className="exp-breathe w-full max-w-[300px] drop-shadow-[0_20px_60px_rgba(126,240,208,0.28)]" />
      </div>

      <div className="exp-scale-in rounded-[26px] bg-white p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f7f1] px-3 py-1.5 text-[12px] font-bold text-[#0e8c66]">
          Assessment complete
        </span>
        <h1 className="mt-4 text-[26px] font-extrabold leading-[1.2] tracking-tight text-[#10121a]">
          Thank you for your answers
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#6b7180]">
          We&apos;ve analysed your responses and prepared a personalised wellbeing overview for you.
        </p>
        <PrimaryButton className="mt-7" onClick={onView} loading={loading}>
          View my wellbeing plan
        </PrimaryButton>
      </div>
    </>
  );
}
