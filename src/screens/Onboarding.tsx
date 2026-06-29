import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "../components/ui";
import { CalmScene } from "../components/illustrations/CalmScene";
import { useOnboarding } from "../onboarding/useOnboarding";

export function Onboarding() {
  const navigate = useNavigate();
  const onboarding = useOnboarding();

  function goToLogin() {
    onboarding.setStep("login");
    navigate("/login");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-canvas px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))]">
      {/* brand mark */}
      <div className="flex items-center justify-center gap-2">
        <img src="/cura.svg" alt="cura" className="h-7 w-auto" />
        <span className="text-xl font-extrabold text-ink-900">cura</span>
      </div>

      {/* illustration */}
      <div className="mt-4 flex flex-1 items-center justify-center">
        <div className="animate-rise w-full">
          <CalmScene className="mx-auto w-full max-w-[300px]" />
        </div>
      </div>

      {/* copy */}
      <div className="animate-rise text-center">
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-surface px-3 py-1.5 text-[11px] font-bold text-brand-700 shadow-soft ring-1 ring-ink-100">
          مقدّمة من شركتك
        </span>
        <h1 className="mx-auto mt-4 max-w-[20rem] text-[1.75rem] font-extrabold leading-[1.25] text-ink-900">
          رفيقك نحو حياة
          <br />
          أكثر توازنًا
        </h1>
        <p className="mx-auto mt-3 max-w-[19rem] text-[15px] leading-relaxed text-ink-500">
          افهم رفاهيتك النفسية والجسدية، واحصل على تقرير وخطة واستشارة ومحتوى مصمّم خصيصًا لك.
        </p>
      </div>

      {/* actions */}
      <div className="mt-8 space-y-3">
        <Button fullWidth size="lg" onClick={goToLogin}>
          ابدأ رحلتك
        </Button>
        <button
          onClick={goToLogin}
          className="w-full py-1.5 text-center text-[0.8125rem] font-semibold text-ink-500"
        >
          لديك حساب؟ <span className="font-bold text-brand-700">تسجيل الدخول</span>
        </button>
        <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs font-semibold text-ink-400">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
          بياناتك سرية تمامًا ولا تُشارك مع جهة عملك
        </p>
      </div>
    </div>
  );
}
