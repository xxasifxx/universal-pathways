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
  "nav.priorities": "Priorities",
  "nav.dashboard": "District dashboard",
  "nav.volunteer": "Volunteer",
  "nav.donate": "Donate",
  "nav.menu": "Open menu",
  "nav.close": "Close menu",
  "nav.language": "Choose language",

  "footer.register.title": "Not registered yet?",
  "footer.register.body":
    "Register to vote by October 13th to have a say in who runs East Brunswick's schools.",
  "footer.register.cta": "Register to vote in New Jersey",
  "footer.tagline":
    "An independent, community-run campaign for the East Brunswick Board of Education. No party line, no consultants.",
  "footer.rights": "Paid for by Saqeeb for East Brunswick.",

  "home.hero.headline": "Hi, I'm Saqeeb.",
  "home.hero.sub": "Nice to meet you!",
  "home.hero.cta.primary": "Read my priorities",
  "home.hero.cta.secondary": "Volunteer",
  "home.hero.badge": "East Brunswick Board of Education · 2026",
  "home.hero.social": "Follow our campaign",

  "budget.eyebrow": "Follow the money",
  "budget.title": "Where East Brunswick's $229 million actually goes",
  "budget.intro":
    "The district publishes these numbers, technically. Here they are with the accounting language switched off. Flip the toggle.",
  "budget.toggle": "Translate to Plain English",
  "budget.total": "Total operating budget",
  "budget.share": "share of budget",
  "budget.disclaimer":
    "Illustrative breakdown of the adopted 2024\u20132025 operating budget, grouped from publicly reported district figures. Line items shift from year to year, so treat these as approximate until the district publishes something better. We'd like it to.",

  "priorities.eyebrow": "Our platform",
  "priorities.title": "Our platform for East Brunswick schools",

  "volunteer.title": "Powered by Neighbors",

  "form.name": "Name",
  "form.email": "Email",
  "form.zip": "Zip code",
  "form.mobile": "Mobile number",
  "form.mobile.optional": "Mobile number (optional)",
  "form.address": "Street address (optional)",
  "form.help": "How do you want to help?",
  "form.submit.volunteer": "Sign me up",
  "form.submitting": "Sending…",
  "form.success.volunteer":
    "You're on the list. Someone will reach out this week, probably in the evening.",
  "form.error": "That didn't go through. Try again?",
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