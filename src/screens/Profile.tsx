import { useState, type FormEvent, type ReactNode } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Bell,
  BellRing,
  Building2,
  Check,
  ChevronLeft,
  CircleHelp,
  Download,
  FileText,
  HeartHandshake,
  LogOut,
  Mail,
  Pencil,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, Badge, Button, Card, ProgressBar } from "../components/ui";
import { PageHeader } from "../components/PageHeader";
import { Spotlight } from "../components/Spotlight";
import { cn } from "../lib/cn";
import { scoreMeta } from "../lib/score";
import { useAssessment } from "../assessment/useAssessment";
import { useOnboarding } from "../onboarding/useOnboarding";
import { currentUser } from "../data/app";
import { dimensionsById } from "../data/dimensions";
import type { PersonalInfoAnswers } from "../data/personalInfo";
import {
  collectStoredUserData,
  type ProfileDetails,
  type ProfilePreferences,
  useStoredProfile,
} from "../profile/profileStorage";

type ProfileSection = "details" | "assessments" | "notifications" | "privacy" | "help";

interface Row {
  icon: LucideIcon;
  label: string;
  description: string;
  fg: string;
  soft: string;
  to: ProfileSection;
  hint?: string;
}

const inputClass =
  "h-12 w-full rounded-md border border-ink-200 bg-surface px-3.5 text-sm font-semibold text-ink-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

const sectionTitles: Record<ProfileSection, string> = {
  details: "معلوماتي الشخصية",
  assessments: "تقييمي ونتائجي",
  notifications: "الإشعارات والتذكيرات",
  privacy: "الخصوصية والبيانات",
  help: "المساعدة والدعم",
};

function isProfileSection(value?: string): value is ProfileSection {
  return Boolean(value && value in sectionTitles);
}

export function Profile() {
  const navigate = useNavigate();
  const { section } = useParams();
  const assessment = useAssessment();
  const onboarding = useOnboarding();
  const stored = useStoredProfile();
  const meta = scoreMeta(assessment.overallScore);

  if (section && !isProfileSection(section)) {
    return <ProfileHomeRedirect />;
  }

  function logout() {
    onboarding.reset();
    navigate("/welcome");
  }

  if (isProfileSection(section)) {
    return (
      <div className="animate-rise">
        <PageHeader title={sectionTitles[section]} />
        <div className="px-5 pt-3">
          {section === "details" && (
            <DetailsSection
              profile={stored.profile}
              personalInfo={stored.personalInfo}
              onSaveProfile={stored.saveProfile}
              onSavePersonalInfo={stored.savePersonalInfo}
            />
          )}
          {section === "assessments" && <AssessmentsSection />}
          {section === "notifications" && (
            <NotificationsSection
              preferences={stored.preferences}
              onChange={stored.setPreference}
            />
          )}
          {section === "privacy" && (
            <PrivacySection preferences={stored.preferences} onChange={stored.setPreference} />
          )}
          {section === "help" && <HelpSection />}
        </div>
      </div>
    );
  }

  const enabledNotifications = [
    stored.preferences.assessmentReminders,
    stored.preferences.planReminders,
    stored.preferences.wellbeingTips,
    stored.preferences.productUpdates,
  ].filter(Boolean).length;
  const assessmentHint = assessment.hasResults
    ? `نتيجتك ${assessment.overallScore}`
    : assessment.started
      ? `${assessment.progressPct}% مكتمل`
      : "ابدأ الآن";
  const rows: Row[] = [
    {
      icon: UserRound,
      label: "معلوماتي الشخصية",
      description: "الاسم والبريد والبيانات الصحية",
      fg: "#6757b8",
      soft: "rgba(103,87,184,0.11)",
      to: "details",
    },
    {
      icon: FileText,
      label: "تقييمي ونتائجي",
      description: "تقدم التقييم ونتائج الأبعاد",
      fg: "#176b91",
      soft: "#e6f1f6",
      to: "assessments",
      hint: assessmentHint,
    },
    {
      icon: Bell,
      label: "الإشعارات والتذكيرات",
      description: "تحكم في ما يصلك وموعده",
      fg: "#ac7a2e",
      soft: "#f3ecdc",
      to: "notifications",
      hint: `${enabledNotifications} مفعّلة`,
    },
    {
      icon: ShieldCheck,
      label: "الخصوصية والبيانات",
      description: "المشاركة والتنزيل وإدارة البيانات",
      fg: "#2f8a66",
      soft: "#e4efe9",
      to: "privacy",
    },
    {
      icon: CircleHelp,
      label: "المساعدة والدعم",
      description: "إجابات سريعة وتواصل مع مختص",
      fg: "#486784",
      soft: "#e9eef3",
      to: "help",
    },
  ];

  return (
    <div className="animate-rise">
      <header className="px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <h1 className="text-2xl font-extrabold text-ink-900">حسابي</h1>
      </header>

      <section className="px-5 pt-5">
        <div className="relative flex flex-col items-center rounded-xl border border-ink-100 bg-surface p-7 text-center shadow-card">
          <button
            onClick={() => navigate("/profile/details")}
            aria-label="تعديل الملف الشخصي"
            title="تعديل الملف الشخصي"
            className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-ink-100 bg-canvas text-ink-500 transition hover:text-brand-700 active:scale-95"
          >
            <Pencil className="h-4 w-4" strokeWidth={2.2} />
          </button>
          <Avatar name={stored.profile.name} src={currentUser.avatar} size={84} />
          <h2 className="mt-3.5 text-lg font-bold text-ink-900">{stored.profile.name}</h2>
          <p className="text-[0.8125rem] font-semibold text-ink-400">{stored.profile.role}</p>
          {assessment.hasResults ? (
            <Badge className={cn("mt-3.5", meta.soft)}>
              <span className="nums">{assessment.overallScore}</span> · رفاهية {meta.label}
            </Badge>
          ) : (
            <button
              onClick={() => navigate("/assessment")}
              className="mt-3.5 rounded-pill bg-brand-50 px-3.5 py-1.5 text-xs font-bold text-brand-700"
            >
              {assessment.started ? `أكمل تقييمك · ${assessment.progressPct}%` : "ابدأ تقييمك الأول"}
            </button>
          )}
        </div>
      </section>

      <section className="px-5 pt-4">
        <Spotlight className="text-white">
          <div className="flex items-center gap-3.5 p-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[0.85rem] bg-white/10">
              <Building2 className="h-6 w-6" strokeWidth={2} />
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-brand-200">اشتراكك مفعّل عبر</p>
              <p className="text-base font-bold">{currentUser.org}</p>
            </div>
            <Badge className="bg-good/25 text-white ring-1 ring-inset ring-good/30">نشِط</Badge>
          </div>
        </Spotlight>
      </section>

      <section className="px-5 pt-4">
        <div className="overflow-hidden rounded-card border border-ink-100 bg-surface shadow-soft">
          {rows.map((row, index) => (
            <button
              key={row.to}
              onClick={() => navigate(`/profile/${row.to}`)}
              className={cn(
                "flex w-full items-center gap-3 p-3.5 text-right transition hover:bg-sand",
                index < rows.length - 1 && "border-b border-ink-100",
              )}
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.7rem]"
                style={{ color: row.fg, background: row.soft }}
              >
                <row.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.8125rem] font-bold text-ink-800">{row.label}</span>
                <span className="mt-0.5 block text-[11px] font-semibold text-ink-400">
                  {row.description}
                </span>
              </span>
              {row.hint && (
                <span className="max-w-20 text-left text-[10px] font-bold text-ink-400">{row.hint}</span>
              )}
              <ChevronLeft className="h-5 w-5 shrink-0 text-ink-300" strokeWidth={2.2} />
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 pt-4">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-card border border-coral-100 bg-coral-50 py-3.5 text-[0.8125rem] font-bold text-coral-600 transition hover:bg-coral-100 active:scale-[0.99]"
        >
          <LogOut className="h-5 w-5" strokeWidth={2} />
          تسجيل الخروج
        </button>
        <p className="nums pt-4 text-center text-xs font-semibold text-ink-300">cura · الإصدار 1.0</p>
      </section>
    </div>
  );
}

function ProfileHomeRedirect() {
  return <Navigate to="/profile" replace />;
}

function DetailsSection({
  profile,
  personalInfo,
  onSaveProfile,
  onSavePersonalInfo,
}: {
  profile: ProfileDetails;
  personalInfo: PersonalInfoAnswers;
  onSaveProfile: (profile: ProfileDetails) => void;
  onSavePersonalInfo: (info: PersonalInfoAnswers) => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [infoDraft, setInfoDraft] = useState(personalInfo);
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.email.trim()) return;
    onSaveProfile(draft);
    onSavePersonalInfo(infoDraft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Card className="flex items-center gap-4">
        <Avatar name={draft.name || profile.name} src={currentUser.avatar} size={64} />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-ink-900">{draft.name || "اسمك"}</p>
          <p className="truncate text-xs font-semibold text-ink-400">{draft.email}</p>
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionLabel icon={UserRound}>بيانات الحساب</SectionLabel>
        <Field label="الاسم الكامل">
          <input
            className={inputClass}
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            autoComplete="name"
          />
        </Field>
        <Field label="المسمى الوظيفي">
          <input
            className={inputClass}
            value={draft.role}
            onChange={(event) => setDraft({ ...draft, role: event.target.value })}
          />
        </Field>
        <Field label="البريد الإلكتروني">
          <input
            className={`${inputClass} nums text-left`}
            dir="ltr"
            type="email"
            value={draft.email}
            onChange={(event) => setDraft({ ...draft, email: event.target.value })}
            autoComplete="email"
          />
        </Field>
      </Card>

      <Card className="space-y-4">
        <SectionLabel icon={Sparkles}>البيانات الصحية الأساسية</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <Field label="تاريخ الميلاد">
            <input
              className={`${inputClass} nums`}
              type="date"
              value={infoDraft.birthDate ?? ""}
              onChange={(event) => setInfoDraft({ ...infoDraft, birthDate: event.target.value })}
            />
          </Field>
          <Field label="الجنس">
            <select
              className={inputClass}
              value={infoDraft.gender ?? ""}
              onChange={(event) => setInfoDraft({ ...infoDraft, gender: event.target.value })}
            >
              <option value="">غير محدد</option>
              <option value="1">ذكر</option>
              <option value="2">أنثى</option>
            </select>
          </Field>
          <Field label="الطول (سم)">
            <input
              className={`${inputClass} nums`}
              type="number"
              min="0"
              value={infoDraft.height ?? ""}
              onChange={(event) => setInfoDraft({ ...infoDraft, height: event.target.value })}
            />
          </Field>
          <Field label="الوزن (كجم)">
            <input
              className={`${inputClass} nums`}
              type="number"
              min="0"
              value={infoDraft.weight ?? ""}
              onChange={(event) => setInfoDraft({ ...infoDraft, weight: event.target.value })}
            />
          </Field>
        </div>
        <p className="text-xs font-semibold leading-relaxed text-ink-400">
          تستخدم هذه البيانات لتحسين دقة النتائج والتوصيات ولا تظهر لجهة العمل.
        </p>
      </Card>

      <Button fullWidth size="lg" disabled={!draft.name.trim() || !draft.email.trim()}>
        {saved ? <Check className="h-5 w-5" /> : null}
        {saved ? "تم حفظ التغييرات" : "حفظ التغييرات"}
      </Button>
    </form>
  );
}

function AssessmentsSection() {
  const navigate = useNavigate();
  const assessment = useAssessment();
  const meta = scoreMeta(assessment.overallScore);
  const completeResults = assessment.results.filter((result) => result.complete);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-ink-900">
              {assessment.hasResults ? "آخر نتيجة مكتملة" : "التقييم الحالي"}
            </p>
            <p className="mt-1 text-xs font-semibold text-ink-400">
              {assessment.completedCount} من {assessment.totalDimensions} أبعاد مكتملة
            </p>
          </div>
          {assessment.hasResults && (
            <Badge className={meta.soft}>
              <span className="nums">{assessment.overallScore}</span> · {meta.label}
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs font-bold">
            <span className="text-ink-500">نسبة الاكتمال</span>
            <span className="nums text-brand-700">{assessment.progressPct}%</span>
          </div>
          <ProgressBar value={assessment.progressPct} barClassName="bg-brand-600" />
        </div>
        <Button
          fullWidth
          className="mt-5"
          onClick={() => navigate(assessment.hasResults ? "/report" : "/assessment")}
        >
          {assessment.hasResults ? "عرض التقرير الكامل" : assessment.started ? "متابعة التقييم" : "بدء التقييم"}
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </Card>

      <section>
        <h2 className="mb-3 text-sm font-extrabold text-ink-900">نتائج الأبعاد</h2>
        {completeResults.length ? (
          <div className="overflow-hidden rounded-card border border-ink-100 bg-surface shadow-soft">
            {completeResults.map((result, index) => {
              const dimension = dimensionsById[result.slug];
              const Icon = dimension.icon;
              const resultMeta = scoreMeta(result.score);
              return (
                <button
                  key={result.slug}
                  onClick={() => navigate(`/dimension/${result.slug}`)}
                  className={cn(
                    "flex w-full items-center gap-3 p-3.5 text-right transition hover:bg-sand",
                    index < completeResults.length - 1 && "border-b border-ink-100",
                  )}
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.7rem]"
                    style={{ color: dimension.accent.fg, background: dimension.accent.soft }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ink-900">{dimension.title}</span>
                    <span className="block text-[11px] font-semibold text-ink-400">{result.band.title}</span>
                  </span>
                  <Badge className={resultMeta.soft}>
                    <span className="nums">{result.score}</span>
                  </Badge>
                  <ChevronLeft className="h-5 w-5 text-ink-300" />
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={FileText} title="لا توجد نتائج مكتملة بعد">
            أكمل أول بُعد في التقييم وستظهر نتيجته هنا مباشرة.
          </EmptyState>
        )}
      </section>
    </div>
  );
}

function NotificationsSection({
  preferences,
  onChange,
}: {
  preferences: ProfilePreferences;
  onChange: (key: keyof ProfilePreferences, value: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <Card className="flex items-start gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[0.7rem] bg-warn-soft text-warn">
          <BellRing className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink-900">ابقَ على مسارك بهدوء</p>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-500">
            اختر التنبيهات المفيدة لك. تحفظ التغييرات فورًا على هذا الجهاز.
          </p>
        </div>
      </Card>
      <SettingsGroup>
        <SettingToggle
          label="تذكير التقييم"
          description="عند وجود أجزاء لم تكتمل"
          checked={preferences.assessmentReminders}
          onChange={(value) => onChange("assessmentReminders", value)}
        />
        <SettingToggle
          label="تذكير الخطة اليومية"
          description="تنبيه لطيف لمهام الرفاهية"
          checked={preferences.planReminders}
          onChange={(value) => onChange("planReminders", value)}
        />
        <SettingToggle
          label="نصائح الرفاهية"
          description="محتوى ملائم لنتائجك واهتماماتك"
          checked={preferences.wellbeingTips}
          onChange={(value) => onChange("wellbeingTips", value)}
        />
        <SettingToggle
          label="تحديثات كيورا"
          description="الميزات والبرامج الجديدة"
          checked={preferences.productUpdates}
          onChange={(value) => onChange("productUpdates", value)}
        />
      </SettingsGroup>
    </div>
  );
}

function PrivacySection({
  preferences,
  onChange,
}: {
  preferences: ProfilePreferences;
  onChange: (key: keyof ProfilePreferences, value: boolean) => void;
}) {
  const navigate = useNavigate();
  const { resetAnswers } = useAssessment();
  const [cleared, setCleared] = useState(false);

  function downloadData() {
    const blob = new Blob([JSON.stringify(collectStoredUserData(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cura-user-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function clearAssessment() {
    if (!window.confirm("هل تريد حذف إجابات التقييم ونتائجه من هذا الجهاز؟")) return;
    resetAnswers();
    setCleared(true);
  }

  return (
    <div className="space-y-4">
      <Card className="border-good/20 bg-good-soft">
        <div className="flex gap-3">
          <ShieldCheck className="h-6 w-6 shrink-0 text-good" />
          <div>
            <p className="text-sm font-bold text-ink-900">نتائجك الصحية خاصة</p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-600">
              جهة العمل ترى مؤشرات مجمعة ومجهولة الهوية فقط، ولا يمكنها الاطلاع على إجاباتك الفردية.
            </p>
          </div>
        </div>
      </Card>

      <SettingsGroup>
        <SettingToggle
          label="تحسين التجربة"
          description="إرسال بيانات استخدام مجهولة لتحسين التطبيق"
          checked={preferences.anonymousAnalytics}
          onChange={(value) => onChange("anonymousAnalytics", value)}
        />
        <SettingToggle
          label="المؤشرات المؤسسية المجمعة"
          description="إضافة نتيجتك دون اسم إلى مؤشرات الرفاهية العامة"
          checked={preferences.organizationInsights}
          onChange={(value) => onChange("organizationInsights", value)}
        />
      </SettingsGroup>

      <Card className="space-y-3">
        <SectionLabel icon={Download}>إدارة بياناتك</SectionLabel>
        <Button type="button" fullWidth variant="outline" onClick={downloadData}>
          <Download className="h-5 w-5" />
          تنزيل نسخة من بياناتي
        </Button>
        <button
          type="button"
          onClick={clearAssessment}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-pill border border-coral-100 bg-coral-50 text-sm font-bold text-coral-600 transition hover:bg-coral-100 active:scale-[0.98]"
        >
          <RotateCcw className="h-5 w-5" />
          {cleared ? "تم حذف بيانات التقييم" : "حذف بيانات التقييم"}
        </button>
        {cleared && (
          <button className="w-full text-xs font-bold text-brand-700" onClick={() => navigate("/assessment")}>
            بدء تقييم جديد
          </button>
        )}
      </Card>
    </div>
  );
}

function HelpSection() {
  const navigate = useNavigate();
  const faqs = [
    ["هل تستطيع شركتي رؤية إجاباتي؟", "لا. تظهر للشركة مؤشرات مجمعة ومجهولة الهوية، بينما تظل إجاباتك ونتائجك الفردية خاصة بك."],
    ["كيف يتم حساب نتيجة الرفاهية؟", "تحسب النتيجة من الأبعاد التي أكملتها، ثم تتحول إجابات كل بُعد إلى درجة من 100 وتوصيات مناسبة."],
    ["هل يمكنني إعادة التقييم؟", "نعم. يمكنك حذف بيانات التقييم الحالي من قسم الخصوصية ثم بدء تقييم جديد في أي وقت."],
    ["لماذا لا تظهر بعض النتائج؟", "تظهر نتيجة البُعد بعد الإجابة عن جميع أسئلته. يمكنك متابعة التقييم من قسم تقييمي ونتائجي."],
  ];

  return (
    <div className="space-y-4">
      <Card className="text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-[0.8rem] bg-brand-50 text-brand-700">
          <HeartHandshake className="h-6 w-6" />
        </span>
        <h2 className="mt-3 text-base font-extrabold text-ink-900">كيف يمكننا مساعدتك؟</h2>
        <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink-500">
          تحدث مع أحد مختصي الرفاهية أو راسل فريق الدعم.
        </p>
        <div className="mt-4 grid gap-2.5">
          <Button fullWidth onClick={() => navigate("/consultation")}>
            حجز استشارة مجانية
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <a
            href="mailto:support@cura.example?subject=Cura%20Support"
            className="flex h-12 items-center justify-center gap-2 rounded-pill border border-ink-200 bg-surface text-sm font-bold text-ink-800 transition hover:bg-sand"
          >
            <Mail className="h-5 w-5" />
            مراسلة فريق الدعم
          </a>
        </div>
      </Card>

      <section>
        <h2 className="mb-3 text-sm font-extrabold text-ink-900">الأسئلة الشائعة</h2>
        <div className="overflow-hidden rounded-card border border-ink-100 bg-surface shadow-soft">
          {faqs.map(([question, answer], index) => (
            <details key={question} className={cn("group", index < faqs.length - 1 && "border-b border-ink-100")}>
              <summary className="flex cursor-pointer list-none items-center gap-3 p-4 text-sm font-bold text-ink-900">
                <span className="min-w-0 flex-1">{question}</span>
                <ChevronLeft className="h-5 w-5 shrink-0 text-ink-300 transition-transform group-open:-rotate-90" />
              </summary>
              <p className="selectable px-4 pb-4 text-xs font-semibold leading-relaxed text-ink-500">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-bold text-ink-600">{label}</span>
      {children}
    </label>
  );
}

function SectionLabel({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-extrabold text-ink-900">
      <span className="grid h-8 w-8 place-items-center rounded-[0.55rem] bg-brand-50 text-brand-700">
        <Icon className="h-4 w-4" />
      </span>
      {children}
    </div>
  );
}

function SettingsGroup({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-ink-100 overflow-hidden rounded-card border border-ink-100 bg-surface shadow-soft">{children}</div>;
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink-900">{label}</p>
        <p className="mt-0.5 text-[11px] font-semibold leading-relaxed text-ink-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-pill transition-colors",
          checked ? "bg-brand-600" : "bg-ink-200",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-soft transition-[right]",
            checked ? "right-6" : "right-1",
          )}
        />
      </button>
    </div>
  );
}

function EmptyState({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <Card className="text-center">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-[0.7rem] bg-ink-50 text-ink-400">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm font-bold text-ink-900">{title}</p>
      <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-400">{children}</p>
    </Card>
  );
}
