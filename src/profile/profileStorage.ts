import { useCallback, useState } from "react";
import { currentUser } from "../data/app";
import type { PersonalInfoAnswers } from "../data/personalInfo";

const PROFILE_KEY = "cura-profile";
const LOGIN_EMAIL_KEY = "cura-sim-login-email";
const PERSONAL_INFO_KEY = "cura-sim-personal-info";
const PREFERENCES_KEY = "cura-profile-preferences";

export interface ProfileDetails {
  name: string;
  role: string;
  email: string;
}

export interface ProfilePreferences {
  assessmentReminders: boolean;
  planReminders: boolean;
  wellbeingTips: boolean;
  productUpdates: boolean;
  anonymousAnalytics: boolean;
  organizationInsights: boolean;
}

const defaultPreferences: ProfilePreferences = {
  assessmentReminders: true,
  planReminders: true,
  wellbeingTips: true,
  productUpdates: false,
  anonymousAnalytics: true,
  organizationInsights: true,
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore unavailable storage */
  }
}

function readProfile(): ProfileDetails {
  let email = "malik@naseej.com";
  try {
    email = localStorage.getItem(LOGIN_EMAIL_KEY) || email;
  } catch {
    /* ignore unavailable storage */
  }
  return readJson(PROFILE_KEY, { name: currentUser.name, role: currentUser.role, email });
}

export function useStoredProfile() {
  const [profile, setProfileState] = useState<ProfileDetails>(readProfile);
  const [personalInfo, setPersonalInfoState] = useState<PersonalInfoAnswers>(() =>
    readJson<PersonalInfoAnswers>(PERSONAL_INFO_KEY, {}),
  );
  const [preferences, setPreferencesState] = useState<ProfilePreferences>(() =>
    readJson(PREFERENCES_KEY, defaultPreferences),
  );

  const saveProfile = useCallback((next: ProfileDetails) => {
    const cleaned = {
      name: next.name.trim(),
      role: next.role.trim(),
      email: next.email.trim(),
    };
    setProfileState(cleaned);
    writeJson(PROFILE_KEY, cleaned);
    try {
      localStorage.setItem(LOGIN_EMAIL_KEY, cleaned.email);
    } catch {
      /* ignore unavailable storage */
    }
  }, []);

  const savePersonalInfo = useCallback((next: PersonalInfoAnswers) => {
    setPersonalInfoState(next);
    writeJson(PERSONAL_INFO_KEY, next);
  }, []);

  const setPreference = useCallback((key: keyof ProfilePreferences, value: boolean) => {
    setPreferencesState((previous) => {
      const next = { ...previous, [key]: value };
      writeJson(PREFERENCES_KEY, next);
      return next;
    });
  }, []);

  return { profile, personalInfo, preferences, saveProfile, savePersonalInfo, setPreference };
}

export function collectStoredUserData() {
  const data: Record<string, unknown> = {};
  const keys = [
    PROFILE_KEY,
    LOGIN_EMAIL_KEY,
    PERSONAL_INFO_KEY,
    PREFERENCES_KEY,
    "cura-hra-answers",
    "cura-plan-day",
    "cura-plan-log",
    "cura-journal-entries",
    "cura-wellbeing-daily",
  ];

  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) continue;
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    } catch {
      /* ignore unavailable storage */
    }
  }
  return data;
}
