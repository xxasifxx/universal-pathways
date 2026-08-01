import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Lightweight string-catalog i18n.
 *
 * `en` is the complete catalog and the fallback for every other locale.
 * To localize the site, fill in the matching keys under the other locale
 * objects below — no component changes required.
 */

export const LOCALES = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "es", label: "Spanish", native: "Español", dir: "ltr" },
  { code: "hi", label: "Hindi", native: "हिन्दी", dir: "ltr" },
  { code: "ur", label: "Urdu", native: "اردو", dir: "rtl" },
  { code: "zh", label: "Mandarin", native: "中文", dir: "ltr" },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];

const en = {
  "nav.home": "Home",
  "nav.about": "About",
  "nav.priorities": "Priorities",
  "nav.volunteer": "Volunteer",
  "nav.contact": "Contact",
  "nav.donate": "Donate",
  "nav.menu": "Open menu",
  "nav.close": "Close menu",
  "nav.language": "Choose language",

  "footer.register.title": "Not registered yet?",
  "footer.register.body":
    "Register to vote by October 13th to have a say in who runs East Brunswick's schools.",
  "footer.register.cta": "Register to vote in New Jersey",
  "footer.tagline":
    "An independent campaign for the East Brunswick Board of Education.",
  "footer.rights": "Paid for by Saqeeb for East Brunswick.",

  "home.hero.headline": "Data-Driven Transparency. Grassroots Equity.",
  "home.hero.sub":
    "Running for East Brunswick Board of Education to build a district where every student has a personalized pathway to succeed.",
  "home.hero.cta.primary": "Read the platform",
  "home.hero.cta.secondary": "Volunteer",
  "home.hero.badge": "East Brunswick Board of Education · 2026",

  "budget.eyebrow": "Follow the money",
  "budget.title": "Where East Brunswick's $229 million actually goes",
  "budget.intro":
    "This is the kind of dashboard the district should publish itself. Flip the switch and watch the jargon turn into something a parent can act on.",
  "budget.toggle": "Translate to Plain English",
  "budget.total": "Total operating budget",
  "budget.share": "share of budget",
  "budget.disclaimer":
    "Illustrative breakdown built from publicly reported district figures. Exact line items vary year to year — which is precisely why a live dashboard should exist.",

  "priorities.eyebrow": "The platform",
  "priorities.title": "Four structural fixes",

  "about.title": "From Personal Friction to Systemic Insight",
  "about.timeline.eyebrow": "The student journey",
  "about.timeline.title": "How one student's file became a policy platform",

  "pathways.eyebrow": "Personalized pathways",
  "pathways.title": "Same student. Two systems.",
  "pathways.start": "Start: a student shows behavioral friction",
  "pathways.replay": "Replay both paths",
  "pathways.trap": "The current trap",
  "pathways.solution": "The Saqeeb solution",

  "volunteer.title": "Powered by Neighbors",
  "volunteer.map.title": "Find your neighborhood",
  "volunteer.map.help":
    "Pick your school zone to join the team working your streets.",
  "volunteer.select": "Or choose your zone from the list",

  "contact.title": "The Solutions Inbox",
  "contact.body":
    "Failures at the top come from insufficient solutions. Tell me about the bureaucratic bottlenecks you face in your classroom or with your child, so we can build better solutions together.",

  "form.name": "Name",
  "form.email": "Email",
  "form.zip": "Zip code",
  "form.mobile": "Mobile number",
  "form.mobile.optional": "Mobile number (optional)",
  "form.help": "How do you want to help?",
  "form.role": "I am a…",
  "form.message": "Message",
  "form.submit.volunteer": "Sign me up",
  "form.submit.contact": "Send it",
  "form.submitting": "Sending…",
  "form.success.volunteer":
    "You're on the list. Someone from the team will reach out this week.",
  "form.success.contact": "Message received. Thank you for writing.",
  "form.error": "Something went wrong. Please try again.",
} as const;

export type TranslationKey = keyof typeof en;

type Catalog = Partial<Record<TranslationKey, string>>;

/**
 * Translated copy goes here. Any key left out falls back to English,
 * so partial translations are safe to ship.
 */
const catalogs: Record<LocaleCode, Catalog> = {
  en,
  es: {},
  hi: {},
  ur: {},
  zh: {},
};

const STORAGE_KEY = "saqeeb-locale";

type I18nValue = {
  locale: LocaleCode;
  setLocale: (code: LocaleCode) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && LOCALES.some((l) => l.code === stored)) {
      setLocaleState(stored as LocaleCode);
    }
  }, []);

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code);
    window.localStorage.setItem(STORAGE_KEY, code);
  }, []);

  const dir = LOCALES.find((l) => l.code === locale)?.dir ?? "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const t = useCallback(
    (key: TranslationKey) => catalogs[locale][key] ?? en[key],
    [locale],
  );

  const value = useMemo<I18nValue>(
    () => ({ locale, setLocale, t, dir: dir as "ltr" | "rtl" }),
    [locale, setLocale, t, dir],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}