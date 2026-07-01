/* ───────────────────────────────────────────────────────────────────────────
   Per-topic illustration for each assessment question.

   The questions fall into a handful of real-world topics — sleep, exercise,
   money, teamwork, curiosity… — so instead of one generic image per dimension
   we curate art to the *subject* of the question. It uses the themeable unDraw
   set (see illustrations/Illustration.tsx): every illustration recolors to the
   dimension accent through one CSS var, so the whole survey still reads as one
   calm family rather than a clip-art grab-bag.

   Resolution order for a question: an explicit per-slug topic first, then the
   dimension's default. Keyed by the question `slug` (as in hra.generated).
   ─────────────────────────────────────────────────────────────────────────── */

import type { DimensionId } from "./dimensions";
import type { IllustrationName } from "../illustrations/Illustration";

/** The illustration each dimension falls back to when a question has no
 *  more specific topic. Chosen to fit the dimension's overall subject. */
const DIMENSION_ART: Record<DimensionId, IllustrationName> = {
  professional: "regain-focus", // burnout, energy, workload
  psycho: "mindfulness", // emotional balance, anxiety, stress
  intellectual: "ideas", // curiosity, openness, imagination
  community: "spread-love", // kindness, cooperation, empathy
  social: "coffee-with-friends", // extraversion, warmth, connection
  belonging: "checklist", // organization, discipline, productivity
  physical: "healthy-habit", // activity, lifestyle, prevention
  financial: "finance", // money, stability, planning
  workplace: "teamwork", // engagement, belonging, recognition
};

/** Explicit topic art for questions whose subject is concrete enough to
 *  warrant its own image. Everything else uses the dimension default above. */
const QUESTION_ART: Record<string, IllustrationName> = {
  /* ── professional · burnout & colleagues ─────────────────────────────── */
  MorningFatigueWorkday: "coffee-break",
  PatienceExhaustionWorkday: "coffee-break",
  EmpathyColleagues: "teamwork",
  HandleColleagueProblems: "teamwork",
  ColleagueInteractionEffort: "teamwork",
  RefreshedWithColleagues: "coffee-with-friends",
  CreateComfortableAtmosphere: "coffee-with-friends",
  VitalityEnergy: "workout",

  /* ── psycho · already calm-themed by dimension default ───────────────── */
  StressNervousness: "a-moment-to-relax",
  EmotionalCollapse: "a-moment-to-relax",
  FearAnxietyFree: "meditation",

  /* ── intellectual · curiosity & the arts ─────────────────────────────── */
  IntellectualCuriosity: "questions",
  TheoriesIdeasEnjoyment: "questions",
  UniversePhilosophyInterest: "questions",
  PoetryArtEnjoyment: "book-lover",
  PoetryLittleImpact: "book-lover",
  AestheticAppreciation: "book-lover",

  /* ── community · kindness & cooperation ──────────────────────────────── */
  KindnessPeople: "spread-love",
  CooperationPreference: "friends",
  ConsiderationRights: "friends",

  /* ── social · warmth & energy ────────────────────────────────────────── */
  PeopleAroundMe: "friends",
  EnjoyTalkingOthers: "coffee-with-friends",
  EnergeticActive: "workout",
  VeryActive: "workout",

  /* ── belonging · goals & follow-through ──────────────────────────────── */
  ClearGoalsSystematic: "personal-goals",
  StriveExcellence: "personal-goals",
  HardWorkAchievement: "personal-goals",
  TimeManagementSkill: "checklist",

  /* ── physical · activity, sleep, nutrition, prevention ───────────────── */
  VigorousActivityDays: "running-wild",
  VigorousActivityDuration: "running-wild",
  ModerateActivityDays: "workout",
  ModerateActivityDuration: "workout",
  StrengthTrainingDays: "workout",
  WalkingDays: "walking-outside",
  WalkingDuration: "walking-outside",
  FitnessLevel: "fitness-tracker",
  SedentaryWork: "yoga",
  SittingHours: "yoga",
  VehicleUseDays: "walking-outside",
  VehicleDuration: "walking-outside",
  SleepDuration: "into-the-night",
  FruitVegetableIntake: "healthy-options",
  WaterIntake: "healthy-options",
  FastFoodFrequency: "diet",
  HighFatFoodPreference: "diet",
  HighSaltFoodPreference: "diet",
  BloodPressureCheck: "doctor",
  CholesterolCheck: "doctor",
  BloodSugarCheck: "doctor",
  ChronicPain: "medicine",
  TobaccoUse: "medicine",

  /* ── financial · stress, savings, planning ───────────────────────────── */
  EmergencyFund: "savings",
  RetirementReadiness: "savings",
  LongTermGoals: "investment",
  EmergencyConfidence: "investment",
  SeekFinancialAdvice: "finance",
  FinancialSatisfaction: "finance",

  /* ── workplace · engagement, growth, recognition ─────────────────────── */
  GrowthOpportunities: "career-progress",
  CareerPathClarity: "career-progress",
  EffortRecognized: "celebrating",
  FairRecognition: "celebrating",
  ProudRecommend: "celebrating",
  TeamBelonging: "teamwork",
  ManagerSupport: "teamwork",
  WorkMeaning: "personal-goals",
  PurposeMission: "personal-goals",
};

/** The illustration for a question — its curated topic, or the dimension's
 *  default. Always returns something, so every question card carries art. */
export function getQuestionArt(slug: string, dimension: DimensionId): IllustrationName {
  return QUESTION_ART[slug] ?? DIMENSION_ART[dimension];
}
