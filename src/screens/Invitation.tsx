import { type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Building2, ChevronLeft, KeyRound, ShieldCheck } from "lucide-react";
import { Button, Card } from "../components/ui";
import { useOnboarding } from "../onboarding/useOnboarding";

const inputClass =
  "h-[3.25rem] w-full rounded-md border border-ink-200 bg-surface px-4 text-center font-mono text-lg font-bold uppercase tracking-[0.12em] text-ink-900 outline-none transition placeholder:tracking-normal placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

export function Invitation() {
  const navigate = useNavigate();
  const onboarding = useOnboarding();
  const [code, setCode] = useState(() => {
    try {
      return localStorage.getItem("cura-sim-invitation-code") ?? "";
    } catch {
      return "";
    }
  });

  const normalizedCode = code.trim().replace(/\s+/g, "").toUpperCase();
  const ready = useMemo(() => normalizedCode.length >= 4, [normalizedCode]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    try {
      localStorage.setItem("cura-sim-invitation-code", normalizedCode);
    } catch {
      /* ignore unavailable storage */
    }
    onboarding.setStep("personal_info");
    navigate("/personal-info");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-canvas px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="flex items-center justify-center gap-2">
        <img src="/cura.svg" alt="cura" className="h-7 w-auto" />
        <span className="text-xl font-extrabold text-ink-900">cura</span>
      </div>

      <main className="animate-rise flex flex-1 flex-col justify-center py-7">
        <div className="grid h-14 w-14 place-items-center rounded-[0.9rem] bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-500/10">
          <KeyRound className="h-7 w-7" strokeWidth={2.2} />
        </div>
        <h1 className="mt-5 text-[1.7rem] font-extrabold leading-[1.3] text-ink-900">
          أدخل رمز الدعوة الخاص بك
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
          يربط الرمز تجربتك ببرنامج الرفاهية الخاص بمنظمتك.
        </p>

        <Card className="mt-7">
          <form className="space-y-5" onSubmit={submit}>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink-900">رمز الدعوة</span>
              <input
                className={inputClass}
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="HRA2026"
                autoCapitalize="characters"
                autoComplete="one-time-code"
                maxLength={18}
              />
            </label>

            <div className="grid gap-2.5">
              <div className="flex items-center gap-3 rounded-md bg-sand p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.65rem] bg-surface text-brand-700 ring-1 ring-inset ring-ink-100">
                  <Building2 className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-900">برنامج الشركة</p>
                  <p className="text-xs font-semibold text-ink-500">سيظهر المحتوى والخطة حسب اشتراك منظمتك</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-sand p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.65rem] bg-surface text-good ring-1 ring-inset ring-ink-100">
                  <BadgeCheck className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-900">دعوة فعالة</p>
                  <p className="text-xs font-semibold text-ink-500">سنستخدمها لتفعيل المزايا المتاحة لك</p>
                </div>
              </div>
            </div>

            <Button fullWidth size="lg" disabled={!ready}>
              تأكيد الرمز
              <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
            </Button>
          </form>
        </Card>
      </main>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-ink-400">
        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
        الدعوة تتحقق من الأهلية فقط ولا تكشف إجاباتك
      </p>
    </div>
  );
}
