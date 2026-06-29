import { type FormEvent, useMemo, useState } from "react";
import { ArrowRight, LockKeyhole, Mail, ScanFace } from "lucide-react";
import { PrimaryButton } from "../components/PrimaryButton";
import { AuthInput } from "../components/AuthInput";
import { SocialLoginButton } from "../components/SocialLoginButton";
import { BrandMark } from "../components/BrandMark";

/** Multicolour Google "G". */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.92v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.92a9 9 0 0 0 0 8.1l3.06-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .92 4.95l3.06 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

/**
 * Login. A back arrow on the dark stage, then a tall white card with the form,
 * social sign-in, and a sign-up footer.
 */
export function LoginScreen({
  onBack,
  onLogin,
  loading,
}: {
  onBack?: () => void;
  onLogin: () => void;
  loading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ready = useMemo(() => email.includes("@") && password.length >= 4, [email, password]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (ready && !loading) onLogin();
  }

  return (
    <div dir="rtl" className="contents">
      {/* top bar: optional back arrow + brand */}
      <div className="relative flex h-11 items-center">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="العودة"
            className="grid h-10 w-10 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
          </button>
        )}
        <BrandMark className="absolute left-1/2 -translate-x-1/2" />
      </div>

      {/* card pinned to the lower screen */}
      <form
        onSubmit={submit}
        className="exp-card-rise mt-auto rounded-[26px] bg-white p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]"
      >
        <h1 className="text-[26px] font-extrabold text-[#10121a]">تسجيل الدخول</h1>
        <p className="mt-1.5 text-[14px] text-[#6b7180]">
          سجّل دخولك للمتابعة إلى تقييم الرفاهية الخاص بك.
        </p>

        <div className="mt-6 space-y-4">
          <AuthInput
            label="البريد الإلكتروني"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@company.com"
            dir="ltr"
            icon={<Mail className="h-[18px] w-[18px]" strokeWidth={2} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <AuthInput
              label="كلمة المرور"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              icon={<LockKeyhole className="h-[18px] w-[18px]" strokeWidth={2} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="mt-2 block w-full text-start text-[13px] font-semibold text-[#0057ff] hover:underline"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
        </div>

        <PrimaryButton type="submit" className="mt-6" disabled={!ready} loading={loading}>
          تسجيل الدخول
        </PrimaryButton>

        {/* divider */}
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-[#ececf1]" />
          <span className="text-[12px] font-semibold text-[#aab0be]">أو</span>
          <span className="h-px flex-1 bg-[#ececf1]" />
        </div>

        <div className="space-y-2.5">
          <SocialLoginButton icon={<GoogleIcon />} type="button">
            المتابعة باستخدام Google
          </SocialLoginButton>
          <SocialLoginButton
            icon={<ScanFace className="h-[18px] w-[18px] text-[#2a2e3a]" strokeWidth={2} />}
            type="button"
          >
            المتابعة باستخدام بصمة الوجه
          </SocialLoginButton>
        </div>

        <p className="mt-6 text-center text-[13.5px] font-medium text-[#6b7180]">
          ليس لديك حساب؟ <span className="font-bold text-[#0057ff]">إنشاء حساب</span>
        </p>
      </form>
    </div>
  );
}
