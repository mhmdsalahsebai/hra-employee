# Metrics Reference — how every number the employee sees is derived

This is the canonical reference for **every metric, score, index, and flag** the
app computes from the HRA answers. If you are adding, changing, or debugging a
metric, start here.

The question bank lives in [`data/hraDimensions.ts`](../data/hraDimensions.ts)
(backend source of truth) and is mirrored into
[`src/data/hra.generated.ts`](../src/data/hra.generated.ts). Score bands
(verdict + advices per raw-score range) live in
[`data/hraResults.ts`](../data/hraResults.ts).

---

## 0. The answer model (read this first)

Answers are stored as a flat map, one number per question slug:

```ts
answers: Record<string, number>   // e.g. { WorkEmotionalExhaustion: 4, ... }
```

Three facts every formula below depends on:

1. **Reversed items are pre-baked.** Questions marked `reversed: true` already
   store the flipped value (e.g. for the positive burnout item "أشعر بأني مفعم
   بالحيوية", answering "يوميا" stores `0`, not `6`). Formulas never need to
   re-reverse anything — within one dimension, all raw values point the same way.
2. **Two dimensions are distress-oriented** (`LOWER_IS_BETTER` in
   `src/data/hra.ts`, `metrics.ts`, `analysis.ts`): **المهني (professional)**
   and **النفسي (psycho)**. There a *higher* raw value means *more* distress.
   Every other dimension is satisfaction-oriented: higher raw = healthier.
3. **Scales differ per dimension**, so nothing is ever compared on raw values
   across dimensions. Everything is first normalised to a 0–1 *position*:

   ```
   pos(q) = (value − min(q)) / (max(q) − min(q))
   ```

   with min/max read live from the question's own answer options.

Scale ranges per dimension:

| Dimension | Slug | Items | Scale | Orientation |
|---|---|---|---|---|
| المهني | `professional` | 22 | 0–6 frequency (MBI) | higher = worse |
| النفسي | `psycho` | 12 | 1–5 agreement (NEO-N) | higher = worse |
| الفكري | `intellectual` | 12 | 1–5 agreement (NEO-O) | higher = better |
| المجتمعي | `community` | 12 | 1–5 agreement (NEO-A) | higher = better |
| الاجتماعي | `social` | 12 | 1–5 agreement (NEO-E) | higher = better |
| الشمولي | `belonging` | 12 | 1–5 agreement (NEO-C) | higher = better |
| البدني | `physical` | 24 | mostly 1–4 (mixed) | higher = better |
| المالي | `financial` | 14 | 1–4 | higher = better |
| بيئة العمل | `workplace` | 21 | 1–5 agreement | higher = better |

Personal info (`cura-sim-personal-info` in localStorage, shape
`PersonalInfoAnswers`) supplies **height, weight, waistCircumference, gender**
("1" male / "2" female) for BMI/waist-based metrics, and **birthDate** for
age-aware findings (`retirement-runway`).

**Special slugs:** `MedicalConditions` is a categorical pick (1 = none,
2 = diabetes, 3 = hypertension, 4 = heart disease, …) — it is *not* an ordinal
health scale and is excluded from every mean/position computation. It is only
read categorically (chronic-condition flag, cardiometabolic factor).

---

## 1. Layer 1 — Dimension score (0–100) and verdict band

Source: [`src/data/hra.ts`](../src/data/hra.ts), consumed by `useAssessment`.

- **Raw score** = sum of stored answer values over the dimension's questions.
- **Display score** (0–100, higher always = doing well):

  ```
  norm = (raw − minRaw) / (maxRaw − minRaw) × 100
  score = LOWER_IS_BETTER ? 100 − norm : norm
  ```

- **Verdict band**: the raw sum is looked up in the dimension's
  `insightsData` ranges from `data/hraResults.ts` (`findBand`). The band
  carries the verdict title (e.g. "معرض للاحتراق الوظيفي"), description, alert,
  and the advice list shown as "توصيات تناسب نتيجتك".
- **Level** (`good` / `moderate` / `attention`): the band's index relative to
  the healthy end (`bandLevel`), honouring the dimension's orientation.
- **Overall wellbeing score** = mean of the display scores of completed
  dimensions.

The generic 0–100 → level mapping used everywhere else
(`scoreMeta` in `src/lib/score.ts`): **≥75 good · 60–74 moderate ·
<60 attention**.

---

## 2. Layer 2 — Sub-scale metrics (always shown, 0–100 each)

Source: [`src/data/metrics.ts`](../src/data/metrics.ts) (`computeMetrics`),
rendered by `MetricsBreakdown` / `DimensionMetricsPanel`.

Formula for every metric: **mean position of its answered slugs**, flipped for
the two distress dimensions, × 100:

```
f     = mean(pos(slug) for answered slugs)
score = round( (LOWER_IS_BETTER ? 1 − f : f) × 100 )
level = scoreMeta(score)          // 75 / 60 cut-offs
```

A metric renders only if at least one of its slugs is answered; `answered/total`
records coverage.

### Metric → slug map

**المهني** (the three MBI sub-scales):
| id | Label | Slugs |
|---|---|---|
| `ee` | الإنهاك العاطفي | WorkEmotionalExhaustion, PatienceExhaustionWorkday, MorningFatigueWorkday, ColleagueInteractionEffort, WorkBreakdown, WorkFrustration, DifficultWork, DirectContactStress, ApproachingBurnout |
| `dp` | العلاقة مع الزملاء | DehumanizingColleagues, IncreasedHardnessPeople, FearIndifference, IndifferenceColleaguesWellbeing, BlamedForColleaguesProblems |
| `pa` | الإحساس بالإنجاز | EmpathyColleagues, HandleColleagueProblems, PositiveImpactPeople, VitalityEnergy, CreateComfortableAtmosphere, RefreshedWithColleagues, ValuableAccomplishments, EmotionalProblemssCalmly |

**النفسي** (NEO-N facets):
| id | Label | Slugs |
|---|---|---|
| `depression` | المزاج والاكتئاب | SadnessDepressionFree, LonelinessSadnessFree, WorthlessnessFeelings, InferiorityFeelings, FrustrationHelplessness, HelplessnessPassivity |
| `anxiety` | القلق والتوجّس | AnxietyNotProne, FearAnxietyFree |
| `stress` | التوتر والعصبية | StressNervousness, EmotionalCollapse |
| `reactivity` | الاتزان الانفعالي | AngerTreatment, ShameHiding |

**Trait dimensions** — four NEO-style facet metrics each (16 total):

*الفكري (Openness facets):*
| id | Label | Slugs |
|---|---|---|
| `o-curiosity` | الفضول المعرفي | IntellectualCuriosity, TheoriesIdeasEnjoyment, UniversePhilosophyInterest |
| `o-aesthetics` | التذوق الفني والجمالي | PoetryArtEnjoyment, AestheticAppreciation, PoetryLittleImpact |
| `o-flexibility` | المرونة تجاه الجديد | TryingNewFoods, AdherenceTradition, OpposingSpeakers, ReligiousAuthorityEthics |
| `o-imagination` | الخيال والوعي بالمشاعر | DaydreamingDislike, MoodChangeSensitivity |

*المجتمعي (Agreeableness facets):*
| id | Label | Slugs |
|---|---|---|
| `a-trust` | الثقة بالآخرين | CynicismOthers, OthersExploitation |
| `a-kindness` | اللطف ومراعاة الآخرين | KindnessPeople, ConsiderationRights, PeopleLikeMe |
| `a-cooperation` | التعاون وتجنب الصدام | CooperationPreference, ArgumentsFamilyWork, DirectDislike |
| `a-sincerity` | النزاهة والتواضع | SelfishArrogant, IndifferenceSelfishness, ManipulationNecessity, RationalConvictions |

*الاجتماعي (Extraversion facets):*
| id | Label | Slugs |
|---|---|---|
| `e-warmth` | الدفء الاجتماعي | PeopleAroundMe, EnjoyTalkingOthers, WorkAlonePreference |
| `e-positivity` | المشاعر الإيجابية | SmileLaughEasily, HappyCheerful, CarefreeNot, CarefreeeFree |
| `e-energy` | وتيرة الطاقة والنشاط | EnergeticActive, VeryActive, LifePassesQuickly |
| `e-assertiveness` | الحضور والمبادرة | CenterAttention, LeadSelfPreference |

*الشمولي (Conscientiousness facets):*
| id | Label | Slugs |
|---|---|---|
| `c-order` | الترتيب والتنظيم | KeepThingsOrganized, NotOrganized, NeverOrganized |
| `c-discipline` | الانضباط الذاتي وإدارة الوقت | TimeManagementSkill, WasteTimeProcrastination, ProductivePerson |
| `c-reliability` | الالتزام والموثوقية | ConscientiousDuty, CommitmentCompletion, UnreliableInconsistent |
| `c-ambition` | السعي للإنجاز والتميز | ClearGoalsSystematic, HardWorkAchievement, StriveExcellence |

(The single whole-dimension trait positions still exist as the Big-Five bars in
§4 — the facets are the per-dimension breakdown.)

**البدني**:
| id | Label | Slugs |
|---|---|---|
| `activity` | النشاط البدني | VigorousActivityDays, ModerateActivityDays, WalkingDays, StrengthTrainingDays |
| `sitting` | الجلوس والخمول | SittingHours, SedentaryWork |
| `commute` | التنقل النشط | VehicleUseDays, VehicleDuration |
| `sleep` | جودة النوم | SleepDuration |
| `nutrition` | نمط التغذية | FruitVegetableIntake, FastFoodFrequency, HighFatFoodPreference, HighSaltFoodPreference |
| `hydration` | شرب الماء | WaterIntake |
| `screening` | الفحوصات الوقائية | BloodPressureCheck, CholesterolCheck, BloodSugarCheck |
| `tobacco` | الامتناع عن التدخين | TobaccoUse |
| `fitness` | اللياقة العامة | FitnessLevel |
| `bmi` | مؤشر كتلة الجسم | *(personal info — see below)* |

**المالي**:
| id | Label | Slugs |
|---|---|---|
| `fin-stress` | الضغط المالي | FinancialStressFeeling, GeneralFinancialStress, MonthlyExpenseWorry |
| `fin-emergency` | الاستعداد للطوارئ | EmergencyConfidence, EmergencyFund |
| `fin-obligations` | تغطية الالتزامات | MeetFinancialObligations, IncomeExceedsExpenses, PaycheckToPaycheck |
| `fin-debt` | عبء الديون | DebtBurden |
| `fin-retirement` | الاستعداد للتقاعد | RetirementReadiness |
| `fin-planning` | التخطيط والوعي المالي | LongTermGoals, DailySpendingAwareness, SeekFinancialAdvice |
| `fin-satisfaction` | الرضا المالي | FinancialSatisfaction |

**بيئة العمل**:
| id | Label | Slugs |
|---|---|---|
| `wp-vigour` | الحماس والاندماج | WorkEnthusiasm, ImmersionFlow, JobSatisfaction, MorningMotivation |
| `wp-meaning` | معنى العمل | WorkMeaning, PurposeMission, ContributionToGoals |
| `wp-growth` | فرص النمو | GrowthOpportunities, CareerPathClarity |
| `wp-belonging` | الانتماء للفريق | TeamBelonging, RespectInclusion, FeelLikeOutsider, ProudRecommend |
| `wp-recognition` | التقدير ودعم المدير | EffortRecognized, FairRecognition, ManagerSupport |
| `wp-safety` | الأمان النفسي للتعبير | SpeakUpSafety, IdeaFearHesitation |
| `wp-retention` | الاستقرار الوظيفي | TurnoverIntention |
| `wp-respect` | بيئة محترمة وآمنة | WorkplaceBullying, BullyingHandling |

**BMI metric** (`bmi`): `BMI = weight / (height/100)²`, valid only when
80 < height < 260 and 25 < weight < 400. Fixed scores per band:
≥35 → 22 · 30–34.9 → 38 · 25–29.9 → 62 · <18.5 → 60 · normal → 90.

---

## 3. Layer 3 — Detailed insight flags (fire only past a threshold)

Source: [`src/data/insights.ts`](../src/data/insights.ts)
(`summarizeInsights`), rendered by `DetailedInsights`. Where Layer 2 always
shows a score, Layer 3 surfaces a *finding* only when an answer crosses a
clinical threshold. Severities: `critical` > `warning` > `info` > `positive`.

Key thresholds (raw answer values):

- **BMI**: ≥40 critical · ≥35 critical · ≥30 warning · ≥25 warning ·
  <18.5 warning · else positive.
- **Waist**: high if ≥102 cm (men) / ≥88 cm (women); "watch" from 94/80.
- **Chronic**: `MedicalConditions` > 1 → flag (heart/cancer/COPD = critical);
  `ChronicPain` ≤ 2 → flag.
- **Screenings**: BloodPressureCheck/CholesterolCheck/BloodSugarCheck ≤ 1
  counts as missing; ≥2 missing → warning, 1 → info.
- **Burnout** (mean of stored 0–6 values): EE mean ≥3 = high, ≥1.8 moderate;
  DP mean ≥2.2 high; PA mean ≥3 high (stored-inverted). EE-high + (DP-high or
  PA-high) → critical "مؤشرات احتراق وظيفي واضحة".
- **Mental** (means of stored 1–5): ≥4 critical, ≥3.2 warning, per
  depression/anxiety/stress groups.
- Lifestyle / financial / workplace flags follow the same pattern — see the
  file; each `analyze*` function is self-contained.

---

## 4. Layer 4 — Composite deep-analysis indices (cross-dimension)

Source: [`src/data/analysis.ts`](../src/data/analysis.ts)
(`computeDeepAnalysis`), rendered by `DeepAnalysis` (report "رؤى وأثر" tab, and
scoped per dimension on the dimension page). Every index outputs a 0–100 score
(higher = healthier), a level, a headline verdict, a grounded paragraph, an
**evidence list of the concrete numbers used**, and its **named scientific
basis**. An index returns `null` (renders nothing) below its minimum answer
coverage.

### 4.1 `burnout-profile` — خريطة الاحتراق الوظيفي (MBI)

Requires ≥11 of the 22 professional items.

- Sub-scale **raw sums** (stored values, PA recovered as `n×6 − sum` since PA
  items are stored inverted):
  - EE (9 items, 0–54): low ≤16 · moderate 17–26 · **high ≥27**
  - DP (5 items, 0–30): low ≤6 · moderate 7–12 · **high ≥13**
  - PA (8 items, 0–48): **low ≤31 (bad)** · moderate 32–38 · high ≥39 (good)
  - Cut-offs are scaled by `answered/total` when items are missing.
- **Profile** (Leiter & Maslach): EE-high + DP-high → *Burnout* ·
  EE-high only → *Overextended* · DP-high only → *Disengaged* ·
  PA-low only → *Ineffective* · any moderate → grey zone · else *Engaged*.
- **Score** = mean of the three sub-scale healthiness fractions × 100
  (EE: `1 − sum/(n×6)`, DP same, PA: `paTrue/(n×6)`).

### 4.2 `activity-target` — رصيد الحركة الأسبوعي (WHO / IPAQ)

Weekly minutes are estimated from days × session-duration midpoints:

- Days midpoints: answer 1→0.5, 2→2.5, 3→4.5, 4→6.5 days.
- Duration midpoints: answer 1→20, 2→45, 3→75, 4→100 minutes.
- `vig`, `mod`, `walk` = days × duration per pair
  (VigorousActivityDays/Duration, ModerateActivityDays/Duration,
  WalkingDays/Duration).
- **Moderate-equivalent minutes** = `2×vig + mod + walk` (WHO: 75 vigorous ≡
  150 moderate).
- **Score** = `min(100, modEq/150 × 100)`; headline states the % of the WHO
  150-minute target. Strength training (`StrengthTrainingDays`, midpoints
  0/1.5/3.5/5 days) is shown as evidence vs the ≥2 days/week guideline.

### 4.3 `cardiometabolic` — عوامل الخطر القلبية الاستقلابية

Counts modifiable risk factors, only among the ones that were actually
answered (`checked`); requires ≥4 checked. Flags:

| Factor | Trigger |
|---|---|
| Obesity / overweight | BMI ≥30 (attention) / ≥25 (moderate) |
| Central obesity | waist ≥102 cm men / ≥88 cm women |
| Tobacco | TobaccoUse ≤2 |
| Prolonged sitting | SittingHours ≤2 (=1 → attention) |
| Inactivity | moderate-equivalent minutes <150 |
| Diet | mean pos(FruitVegetableIntake, FastFoodFrequency, HighFatFoodPreference, HighSaltFoodPreference) < 0.45 |
| Short sleep | SleepDuration ≤2 |
| Diagnosed condition | MedicalConditions ∈ {2 diabetes, 3 hypertension, 4 heart} |

**Score** = `100 − (Σ weight / (checked × 1.5)) × 100`, where attention-level
flags weigh 1.5 and moderate flags 1 — so 100 means no flags and 0 means every
checked factor flagged at attention level. Presented explicitly as screening,
not diagnosis.

### 4.4 `jdr-balance` — ميزان الضغوط والموارد (JD-R, Demerouti & Bakker)

- **Demands** (0–100) = mean of available components:
  EE position · financial strain (`1 − pos` of FinancialStressFeeling,
  GeneralFinancialStress, MonthlyExpenseWorry) · bullying strain
  (`1 − pos(WorkplaceBullying)`).
- **Resources** (0–100) = mean position of ManagerSupport, EffortRecognized,
  FairRecognition, GrowthOpportunities, CareerPathClarity, SpeakUpSafety,
  IdeaFearHesitation, TeamBelonging, RespectInclusion, WorkMeaning,
  PurposeMission, BullyingHandling.
- **Score** = `50 + (resources − demands)/2`, clamped 0–100.
- Quadrant verdicts at demands ≥55 and resources ≥65: high/low → burnout-risk
  zone · high/high → supported challenge · low/low → fragile calm ·
  low/high → healthy surplus.

### 4.5 `retention` — بوصلة الاستقرار الوظيفي

Requires `TurnoverIntention` answered. Weighted stay-score (weights
renormalised over available components):

```
stay = 0.50·pos(TurnoverIntention) + 0.20·pos(vigour) +
       0.15·pos(recognition)       + 0.15·pos(growth)
```

vigour = WorkEnthusiasm, ImmersionFlow, JobSatisfaction, MorningMotivation ·
recognition = EffortRecognized, FairRecognition, ManagerSupport ·
growth = GrowthOpportunities, CareerPathClarity. Drivers with position <0.6
are named as the levers. Bands: ≥75 stable · 55–74 swing · <55 early flight
risk. Basis: Rubenstein et al. meta-analysis of turnover antecedents.

### 4.6 `resilience` — مخزون الصمود (Conservation of Resources, Hobfoll)

Mean of the available pillars (needs ≥4), each 0–1:

| Pillar | Derivation |
|---|---|
| الاستقرار النفسي | `1 − mean pos(all psycho items)` |
| الطاقة الاجتماعية | mean pos(all social items) |
| شبكة الثقة والعلاقات | mean pos(all community items) |
| نوم التعافي | SleepDuration: 3→1.0 · 4→0.85 · 2→0.45 · 1→0.15 |
| اللياقة كمخزون طاقة | `min(1, modEq/150)` (from 4.2) |
| الاحتياطي المالي | mean pos(EmergencyFund, EmergencyConfidence) |
| الإسناد في العمل | mean pos(TeamBelonging, RespectInclusion, ManagerSupport) |

Weakest and strongest pillars are named in the reading.

### 4.7 `vitality` — مؤشر الطاقة الحيوية

Energy read across four scales (needs ≥3 components), mean of:

| Component | Derivation |
|---|---|
| طاقتك في العمل | `1 − mean pos(VitalityEnergy, MorningFatigueWorkday)` |
| نشاطك اليومي العام | mean pos(EnergeticActive, VeryActive) |
| لياقتك كما تقيّمها | pos(FitnessLevel) |
| وقود النوم | SleepDuration: 3→1.0 · 4→0.85 · 2→0.45 · 1→0.15 |

Names the weakest source. Basis: Subjective Vitality (Ryan & Frederick 1997).

### 4.8 `self-regulation` — ضبط الذات عبر المجالات

Four self-control domains scored side by side (needs ≥3):

| Domain | Derivation |
|---|---|
| ضبط المهام والوقت | mean pos(TimeManagementSkill, WasteTimeProcrastination, ProductivePerson, CommitmentCompletion) |
| ضبط المال | mean pos(LongTermGoals, DailySpendingAwareness, EmergencyFund) |
| ضبط الانفعالات | `1 − mean pos(AngerTreatment, ShameHiding, EmotionalCollapse, FrustrationHelplessness)` |
| ضبط العادات الصحية | mean pos(FastFoodFrequency, TobaccoUse) |

When the strongest–weakest gap ≥30 points, the headline names the split and
the detail recommends transferring tactics from the strong domain. Basis:
Moffitt et al., PNAS 2011 (Dunedin cohort).

### 4.9 `sedentary-load` — الحمل الجلوسي اليومي

Requires SittingHours. Estimated daily sedentary hours =
sitting midpoint (`1→10.5h, 2→8, 3→5, 4→3`) + daily commute
(weekly vehicle minutes ÷ 7; vehicle days midpoints `1→6.5 … 4→0.5`,
duration midpoints `1→75, 2→45, 3→22, 4→10` — note these answers are ordered
worst-first). Base score by total: ≤5h→88 · ≤7→72 · ≤9→55 · ≤11→40 · else 28;
+12 when daily moderate-equivalent activity (modEq/7) ≥60 min ("offset
covered"). Basis: Ekelund et al., The Lancet 2016.

### 4.10 Measurement quality — جودة القياس

`quality` on the analysis result (rendered as a strip above the composites):

- **coverage** = answered / total question bank × 100.
- **consistency** = `100 − avgSD × 260`, where avgSD is the mean standard
  deviation of the person's positions *within* near-duplicate item groups
  (EE, depression core, VIGOUR, FIN_STRAIN, the order triplet
  KeepThingsOrganized/NotOrganized/NeverOrganized). Low spread inside a group
  that measures one construct = reliable responding.

### 4.11 `wellness-age` — عمرك الصحي التقديري

Requires age (from `birthDate`) and ≥5 checked factors. Chronological age +
an itemised ledger of ± years (each row shown as evidence):

| Factor | Years |
|---|---|
| Tobacco daily / occasional / never | +4 / +2 / −1 |
| BMI ≥35 / ≥30 / ≥25 / normal | +4 / +3 / +1.5 / −1 |
| Waist over gender cut-off | +1.5 |
| Activity modEq ≥300 / ≥150 / 75–149 / <75 | −2 / −1 / +1 / +2 |
| Sleep <5h / 5–6h / 7–8h | +2 / +1 / −0.5 |
| Diet mean pos ≥.7 / <.45 | −1 / +1.5 |
| Diagnosed diabetes/hypertension/heart | +3 |
| Chronic strain (EE ≥.6 ∨ psy ≥.65) | +1 |
| All three screenings current | −0.5 |

Delta clamped to [−8, +15]. Score by delta: ≤−3→92 · ≤0→80 · ≤3→62 · ≤6→45 ·
else 28. Basis: Framingham Heart Age concept (D'Agostino 2008), simplified —
explicitly labelled awareness arithmetic, not diagnosis.

### 4.12 `stress-map` — خريطة مصادر الضغط

Four independent strain sources, each 0–1 (needs ≥3): work (EE pos), financial
(`1 − FIN_STRAIN pos`), general anxiety/stress (psy pos), workplace safety
(`1 − mean pos(WorkplaceBullying, SpeakUpSafety, IdeaFearHesitation)`).
Evidence shows each source's intensity /100 **and its share of the total**.
Headline names the top source with its share; "calm" framing when mean strain
<0.35. Score = `(1 − mean strain) × 100`. Basis: JD-R demand decomposition +
APA Stress-in-America source-wise measurement.

### 4.13 Metric extremes — قمم وقيعان مؤشراتك

`extremes` on the analysis result (needs ≥10 metrics): all Layer-2 metrics
ranked by score; top 5 and bottom 5 with dimension chips. Rendered as the
first card of the composites section.

### 4.14 Big-Five traits + persona — شخصيتك في العمل (NEO-FFI)

Per trait: mean position over the whole dimension (needs ≥6 items),
× 100. `stability` inverts psycho (`1 − f`). **Positions are descriptive, not
good/bad** — the UI renders neutral brand-coloured bars with pole labels.

| Trait | Dimension | Inverted |
|---|---|---|
| الانفتاح على الخبرة | intellectual | no |
| يقظة الضمير | belonging | no |
| الانبساط | social | no |
| الطيبة والتعاون | community | no |
| الاتزان الانفعالي | psycho | **yes** |

Readings switch at 65 (high) and 40 (mid). **Persona name** comes from a fixed
rule cascade on trait scores (≥65 thresholds), e.g. C∧O → "المهندس المستكشف",
C∧A → "المنجز المتعاون", O∧E → "المُلهِم الاجتماعي" … fallback
"المتوازن الواقعي" (see `personaOf`). Needs ≥4 traits computed.

---

## 4b. Layer 5 — Cross-answer findings (الاكتشافات) + the leverage point

Source: [`src/data/findings.ts`](../src/data/findings.ts) (`computeFindings`),
rendered by `Findings` — **first** in the report's رؤى وأثر tab, and scoped by
`dims` on dimension pages. The completion screen counts them as
"اكتشافات مترابطة".

**Design rule:** a finding must cross **two or more different scales** and say
something the person could *not* have written themselves right after
answering. Restating an answer is not a finding. Every finding carries:
`title` (the discovery), `story` (the reasoning with the person's numbers),
`why` (mechanism + one named research figure), `move` (exactly one action),
`receipts` (the numbers used), `tone` (`risk`/`watch`/`strength`), `dims`.

All thresholds below are on 0–1 mean positions (§0) unless stated.

| id | Discovery | Fires when | Named basis |
|---|---|---|---|
| `eri` | Effort–reward imbalance | EE ≥.5 ∧ reward(EffortRecognized, FairRecognition, ManagerSupport, GrowthOpportunities, CareerPathClarity) ≤.5 ∧ ratio ≥1.4 | Siegrist ERI; Rugulies 2017 meta (~1.5× depression) |
| `engaged-exhausted` | Burning out on work they love | EE ≥.48 ∧ vigour ≥.62 | Moeller et al. (Yale) 2018 — 1 in 5, highest turnover intent |
| `detached-drain` | Exhaustion is a meaning problem | EE ≥.5 ∧ vigour ≤.4 ∧ meaning ≤.45 | Maslach & Leiter values-mismatch |
| `recovery-shutdown` | High strain, both recovery channels closed | (EE ≥.45 ∨ psy-stress ≥.55) ∧ SleepDuration ≤2 ∧ modEq <120 | Yoo 2007 (+60% amygdala); Prather 2015 (4× infection) |
| `fitness-gap` | Self-image vs computed behaviour | FitnessLevel ≥3 ∧ modEq <100 (overestimate) — or ≤2 ∧ modEq ≥150 (underestimate → strength) | Prince 2008 systematic review; Bandura self-efficacy |
| `money-upstream` | Financial strain feeding psych/sleep symptoms | finStrain ≥.55 ∧ (psy-stress ≥.5 ∨ SleepDuration ≤2) | APA Stress in America; CFPB financial well-being |
| `social-shield` | Strong buffer under real strain (strength) | strain ≥.45/.55 ∧ community ≥.65 ∧ TeamBelonging ≥.6 | Holt-Lunstad 2010 (+50% survival); Cohen & Wills buffering |
| `unbuffered-stress` | High strain with thin social buffer | strain high ∧ community ≤.45 ∧ social ≤.42 | Holt-Lunstad (≈15 cigarettes/day equivalence) |
| `conscientious-overload` | High-C silently absorbing overload | conscientiousness ≥.65 ∧ EE ≥.5 | Overcommitment component of Siegrist's model |
| `silence-tax` | Engaged but unsafe to speak | safety(SpeakUpSafety, IdeaFearHesitation) ≤.42 ∧ vigour ≥.55 | Edmondson psychological safety; Google Project Aristotle |
| `push-not-pull` | Leaving intent despite loving the work — names the weakest push driver | stay ≤.45 ∧ vigour ≥.6 | Gallup: 52% of exits preventable |
| `flying-blind` | ≥2 risk factors + ≥2 skipped screenings that detect exactly those | missing screenings ≥2 ∧ risk factors ≥2 | WHO (~46% of hypertension undiagnosed) |
| `condition-clash` | Diagnosed condition × the exact behaviour that feeds it | MedicalConditions ∈ {2,3,4,5,6,9} ∧ its matching behaviour trigger (hypertension×salt, diabetes×fast-food/low-veg, heart×tobacco, asthma×tobacco, osteoporosis×zero strength training, arthritis×inactivity) — see `CONDITION_CLASHES` | WHO salt guidance; DPP; Critchley & Capewell; Wolff's law; ACR |
| `retirement-runway` | Years of work left (age from birthDate) vs near-zero readiness | RetirementReadiness ≤2 raw; age enriches (≥45 → risk, else watch) | Rule of 72 / compound-savings arithmetic |
| `commute-drain` | Heavy vehicle time compounding exhaustion/sitting | weekly commute ≥270 min ∧ (EE ≥.45 ∨ SittingHours ≤2) | Stutzer & Frey "commuting paradox" |
| `unprotected-giver` | High agreeableness in a low-fairness environment | community ≥.68 ∧ mean pos(FairRecognition, RespectInclusion) ≤.42 | Adam Grant, Give and Take |
| `blocked-extravert` | High social energy, cut off inside work specifically | social ≥.65 ∧ mean pos(TeamBelonging, FeelLikeOutsider) ≤.45 | Person–Environment Fit research |

`psy-stress` = mean pos(StressNervousness, EmotionalCollapse, AnxietyNotProne,
FearAnxietyFree); `modEq` = the §4.2 weekly minutes; `finStrain` =
`1 − mean pos(FIN_STRAIN)`.

Findings are sorted risk → watch → strength.

### The leverage point — لو غيّرت شيئًا واحدًا

A dependency graph over the Layer-2 metric ids (`EDGES` in findings.ts): an
edge A → B means the literature consistently shows improving A drags B.
Sources: sleep, activity, fin-stress, fin-emergency, wp-recognition,
wp-growth, wp-safety, ee, sitting, commute, nutrition.

Selection: among sources with **score <60**, count downstream metrics with
**score <65** that the person actually has; pick the source with the most weak
downstream (needs ≥2; ties → lower source score). Output: the chain with each
metric's real score, plus a fixed first `move` per source (`LEVER_MOVES`).

**What-if projection** (`projection` on the leverage): every answer slug of
the source metric (`METRIC_SLUGS`) is stepped **one scale step toward the
healthy pole** (direction from `DISTRESS_DIMS`), then `computeMetrics` and
`computeDeepAnalysis` are re-run on the modified answers. The deltas shown are
the source metric's new score plus any composite whose score moved ≥2 — an
honest simulation: only formulas sharing those answers change; causal
downstream effects are noted as expected, not computed.

---

## 5. Static / demo values (⚠ not derived from answers)

These are currently hardcoded and must be replaced by real backend data when
it exists:

- `src/data/report.ts`: `prevOverall` (56), `percentile` (64),
  `pastHistory` (trend chart months), `patterns[]` (the two "أنماط لاحظناها"
  cards).
- `src/data/dimensions.ts`: per-dimension `benchmark` (peer average) and
  `trend` (delta since last assessment).

Everything in sections 1–4 is computed live from the stored answers.

---

## 6. Adding a new metric — checklist

1. **Pick the layer.** Always-shown sub-scale → `metrics.ts` · threshold
   finding → `insights.ts` · cross-dimension index → `analysis.ts`.
2. Group by **slug**, never by question order/index.
3. Never hand-normalise: use the file's `position`/`pos` helpers so scale
   min/max come from the live answer options.
4. Remember the two distress dimensions (professional, psycho) — flip with
   `LOWER_IS_BETTER`, and remember reversed items are already baked.
5. Gate on coverage (return `null` below a sensible minimum of answered items)
   rather than scoring from one stray answer.
6. Write the Arabic reading for all three levels; cite a **named** source in
   `basis` — per product policy, no generic unsourced claims.
7. Exclude `MedicalConditions` from any mean.
8. Document it here.
