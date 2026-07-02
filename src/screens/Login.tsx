import { type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Button, Card } from "../components/ui";
import { useOnboarding } from "../onboarding/useOnboarding";

const inputClass =
  "h-[3.25rem] w-full rounded-md border border-ink-200 bg-surface px-4 text-[15px] font-semibold text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

export function Login() {
  const navigate = useNavigate();
  const onboarding = useOnboarding();
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem("cura-sim-login-email") ?? "";
    } catch {
      return "";
    }
  });
  const [password, setPassword] = useState("");

  const ready = useMemo(() => email.trim().length > 3 && password.length >= 4, [email, password]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    try {
      localStorage.setItem("cura-sim-login-email", email.trim());
    } catch {
      /* ignore unavailable storage */
    }
    onboarding.setStep("invitation");
    navigate("/invitation");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-canvas px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="flex items-center justify-center gap-2">
        <img src="/cura.svg" alt="كيورا" className="h-8 w-auto" />
        <span className="text-xl font-extrabold tracking-tight text-ink-900">كيورا</span>
      </div>

      <main className="animate-rise flex flex-1 flex-col justify-center py-7">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-pill bg-brand-50 px-3 py-1.5 text-[11px] font-bold text-brand-700">
          تسجيل الدخول
        </span>
        <h1 className="mt-4 text-[1.7rem] font-extrabold leading-[1.3] text-ink-900">
          أهلاً بك، لنؤكد حسابك أولاً
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
          استخدم بياناتك للوصول إلى تجربة الرفاهية المقدّمة من شركتك.
        </p>

        <Card className="mt-7">
          <form className="space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink-900">البريد الإلكتروني</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input
                  className={`${inputClass} pr-11`}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink-900">كلمة المرور</span>
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input
                  className={`${inputClass} pr-11`}
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                />
              </span>
            </label>

            <Button fullWidth size="lg" disabled={!ready}>
              متابعة
              <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
            </Button>
          </form>
        </Card>
      </main>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-ink-400">
        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
        دخول آمن ومشفّر لبياناتك
      </p>
    </div>
  );
}
