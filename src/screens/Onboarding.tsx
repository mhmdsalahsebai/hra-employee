import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import { Button } from "../components/ui";
import { Illustration, type IllustrationName } from "../illustrations/Illustration";
import { cn } from "../lib/cn";
import { useOnboarding } from "../onboarding/useOnboarding";

type Accent = "brand" | "coral";

interface FeatureSlide {
  art: IllustrationName;
  accent: Accent;
  eyebrow: string;
  title: string;
  body: string;
}

/** Value before effort: what the employee gets — ending with how little it costs. */
const slides: FeatureSlide[] = [
  {
    art: "instant-support",
    accent: "coral",
    eyebrow: "استشارة مجانية",
    title: "مختص معتمد يستمع لك",
    body: "جلسة خاصة وسرّية تناقش فيها حالك مع مختص — مجانية بالكامل، تدفع عنك شركتك.",
  },
  {
    art: "regain-focus",
    accent: "brand",
    eyebrow: "تقريرك الشخصي",
    title: "اعرف نقاط قوّتك بوضوح",
    body: "تقرير مفصّل عبر 9 أبعاد يبرز ما تتميّز به وما يستحق انتباهك — يراه أنت وحدك.",
  },
  {
    art: "personal-goals",
    accent: "brand",
    eyebrow: "خطتك",
    title: "خطة مصمّمة لك",
    body: "خطوات عملية وبرامج يومية مبنية على نتائجك أنت — لا نصائح عامة.",
  },
  {
    art: "questions",
    accent: "coral",
    eyebrow: "كل هذا مقابل دقائق",
    title: "أسئلة قصيرة بلمسة واحدة",
    body: "9 أبعاد قصيرة، دقيقة إلى دقيقتين لكل بُعد، وتقدّمك محفوظ دائمًا. تقريرك المبدئي يفتح بعد 3 أبعاد فقط.",
  },
];

const accentTone: Record<Accent, string> = {
  brand: "var(--color-brand-400)",
  coral: "var(--color-coral-400)",
};

const accentHalo: Record<Accent, string> = {
  brand: "bg-brand-soft",
  coral: "bg-coral-soft",
};

export function Onboarding() {
  const navigate = useNavigate();
  const onboarding = useOnboarding();
  const swiperRef = useRef<SwiperClass | null>(null);
  const [active, setActive] = useState(0);

  // Slide 0 is the brand welcome; the rest are feature slides.
  const total = slides.length + 1;
  const isLast = active === total - 1;

  function goToLogin() {
    onboarding.setStep("login");
    navigate("/login");
  }

  function handleNext() {
    if (isLast) goToLogin();
    else swiperRef.current?.slideNext();
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-canvas px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))]">
      {/* top bar: brand + skip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/cura.svg" alt="cura" className="h-7 w-auto" />
          <span className="text-xl font-extrabold text-ink-900">cura</span>
        </div>
        <button
          onClick={goToLogin}
          className="rounded-pill px-3 py-1.5 text-[0.8125rem] font-semibold text-ink-500 transition-colors hover:text-ink-800"
        >
          تخطّي
        </button>
      </div>

      {/* feature slider */}
      <Swiper
        dir="rtl"
        className="w-full flex-1"
        modules={[A11y]}
        slidesPerView={1}
        speed={420}
        grabCursor
        threshold={8}
        onSwiper={(s) => {
          swiperRef.current = s;
          setActive(s.activeIndex);
        }}
        onSlideChange={(s) => setActive(s.activeIndex)}
        a11y={{
          enabled: true,
          containerMessage: "جولة تعريفية بمزايا التطبيق",
          slideLabelMessage: "الشريحة {{index}} من {{slidesLength}}",
        }}
      >
        {/* welcome slide */}
        <SwiperSlide className="!h-auto">
          <div className="flex h-full flex-col items-center justify-center px-1 text-center">
            <div className="relative flex w-full items-center justify-center">
              <div className="absolute h-56 w-56 rounded-full bg-brand-soft blur-2xl" />
              <Illustration
                name="mindfulness"
                tone="var(--color-brand-400)"
                className="animate-rise relative mx-auto w-full max-w-[264px]"
              />
            </div>
            <div className="animate-rise mt-8">
              <span className="inline-flex items-center gap-1.5 rounded-pill bg-surface px-3 py-1.5 text-[11px] font-bold text-brand-700 shadow-soft ring-1 ring-ink-100">
                هدية لك من شركتك
              </span>
              <h1 className="mx-auto mt-4 max-w-[20rem] text-[1.75rem] font-extrabold leading-[1.25] text-ink-900">
                نحو حياة
                <br />
                أكثر توازنًا
              </h1>
              <p className="mx-auto mt-3 max-w-[19rem] text-[15px] leading-relaxed text-ink-500">
                استشارة مجانية مع مختص، وتقرير يشرح حالك، وخطة مصمّمة لك — كل ذلك دون أي تكلفة
                عليك.
              </p>
            </div>
          </div>
        </SwiperSlide>

        {/* feature slides */}
        {slides.map(({ art, accent, eyebrow, title, body }) => (
          <SwiperSlide key={title} className="!h-auto">
            <div className="flex h-full flex-col items-center justify-center px-1 text-center">
              <div className="relative flex w-full items-center justify-center">
                <div
                  className={cn(
                    "absolute h-56 w-56 rounded-full blur-2xl",
                    accentHalo[accent],
                  )}
                />
                <Illustration
                  name={art}
                  tone={accentTone[accent]}
                  className="animate-rise relative mx-auto w-full max-w-[264px]"
                />
              </div>
              <div className="animate-rise mt-8">
                <span
                  className={cn(
                    "text-[11px] font-bold tracking-wide",
                    accent === "coral" ? "text-coral-600" : "text-brand-700",
                  )}
                >
                  {eyebrow}
                </span>
                <h2 className="mx-auto mt-2 max-w-[18rem] text-[1.6rem] font-extrabold leading-[1.3] text-ink-900">
                  {title}
                </h2>
                <p className="mx-auto mt-3 max-w-[19rem] text-[15px] leading-relaxed text-ink-500">
                  {body}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* progress dots */}
      <div className="mt-6 flex items-center justify-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-pill transition-all duration-300",
              i === active ? "w-5 bg-brand-600" : "w-1.5 bg-ink-300",
            )}
          />
        ))}
      </div>

      {/* actions */}
      <div className="mt-5 space-y-3">
        <Button fullWidth size="lg" onClick={handleNext}>
          {isLast ? "ابدأ رحلتك" : "التالي"}
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
