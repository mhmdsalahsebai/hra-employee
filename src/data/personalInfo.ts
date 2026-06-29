export type PersonalInfoQuestionId =
  | "birthDate"
  | "gender"
  | "pregnant"
  | "height"
  | "weight"
  | "waistCircumference"
  | "relationshipStatus";

export type PersonalInfoInputType = "date" | "number";

export interface PersonalInfoChoice {
  value: string;
  title: string;
}

export interface PersonalInfoQuestionBase {
  id: PersonalInfoQuestionId;
  title: string;
  required: boolean;
  visibleIf?: (answers: PersonalInfoAnswers) => boolean;
}

export interface PersonalInfoInputQuestion extends PersonalInfoQuestionBase {
  kind: "input";
  inputType: PersonalInfoInputType;
  unit?: string;
}

export interface PersonalInfoChoiceQuestion extends PersonalInfoQuestionBase {
  kind: "choice";
  answers: PersonalInfoChoice[];
}

export interface PersonalInfoBooleanQuestion extends PersonalInfoQuestionBase {
  kind: "boolean";
  trueTitle: string;
  falseTitle: string;
}

export type PersonalInfoQuestion =
  | PersonalInfoInputQuestion
  | PersonalInfoChoiceQuestion
  | PersonalInfoBooleanQuestion;

export type PersonalInfoAnswers = Partial<Record<PersonalInfoQuestionId, string>>;

export const personalInfoQuestions: PersonalInfoQuestion[] = [
  {
    id: "birthDate",
    kind: "input",
    inputType: "date",
    title: "تاريخ الميلاد",
    required: true,
  },
  {
    id: "gender",
    kind: "choice",
    title: "الجنس",
    required: true,
    answers: [
      { value: "1", title: "ذكر" },
      { value: "2", title: "أنثى" },
    ],
  },
  {
    id: "pregnant",
    kind: "boolean",
    title: "هل يوجد حمل؟",
    required: true,
    visibleIf: (answers) => answers.gender === "2",
    trueTitle: "نعم",
    falseTitle: "لا",
  },
  {
    id: "height",
    kind: "input",
    inputType: "number",
    title: "الطول",
    required: true,
    unit: "سم",
  },
  {
    id: "weight",
    kind: "input",
    inputType: "number",
    title: "الوزن",
    required: true,
    unit: "كجم",
  },
  {
    id: "waistCircumference",
    kind: "input",
    inputType: "number",
    title: "محيط الخصر",
    required: false,
    unit: "سم",
  },
  {
    id: "relationshipStatus",
    kind: "choice",
    title: "الحالة الاجتماعية",
    required: true,
    answers: [
      { value: "1", title: "متزوج.ـة" },
      { value: "2", title: "عازب.ـة" },
      { value: "3", title: "مطلق.ـة/منفصل.ـة" },
      { value: "4", title: "مرتبط.ـة" },
    ],
  },
];
