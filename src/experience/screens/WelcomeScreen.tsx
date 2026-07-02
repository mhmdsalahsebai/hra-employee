import { PrimaryButton } from "../components/PrimaryButton";
import { BrandMark } from "../components/BrandMark";
import { WellbeingOrb } from "../illustrations/WellbeingOrb";

/**
 * Welcome / onboarding. A floating wellbeing orb above a white card that
 * invites the person to begin the assessment.
 */
export function WelcomeScreen({ onStart, loading }: { onStart: () => void; loading: boolean }) {
  return (
    <>
      <BrandMark className="pt-2" />

      {/* hero illustration, floating above the card */}
      <div className="flex flex-1 items-center justify-center">
        <WellbeingOrb className="exp-breathe w-full max-w-[280px] drop-shadow-[0_20px_60px_rgba(60,92,255,0.35)]" />
      </div>

      {/* invitation card */}
      <div dir="rtl" className="exp-card-rise rounded-[26px] bg-white p-7 text-right shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
        <h1 className="text-[27px] font-extrabold leading-[1.3] text-[#10121a]">
          افهم رفاهيتك
          <br />
          وابدأ من مكان أوضح
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#6b7180]">
          أجب عن بعض الأسئلة البسيطة لنفهم احتياجاتك الصحية والنفسية، ونصمّم لك تجربة تناسبك.
        </p>
        <PrimaryButton className="mt-7" onClick={onStart} loading={loading}>
          ابدأ رحلتك
        </PrimaryButton>
      </div>
    </>
  );
}
