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
  "nav.pilot": "PILOT deals",
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
    "An independent, community-run campaign for the East Brunswick Board of Education.",
  "footer.rights": "Paid for by Friends of Saqeeb.",

  "home.hero.headline": "A Voice for Excellence",
  "home.hero.sub": "Muhammad Saqeeb for East Brunswick Board of Education",
  "home.hero.cta.primary": "Volunteer",
  "home.hero.cta.secondary": "Donate",
  "home.hero.badge": "Column #1",
  "home.hero.social": "Follow our campaign",

  "pitch.problem":
    "Healthcare premiums, special education costs, and repairs on aging buildings are all rising faster than school revenue, and East Brunswick is no exception. When a board runs out of room in the budget, the usual response is to trim programs, leave positions unfilled, and move costs onto families through activity fees and supply lists. Those decisions are made a line at a time, in meetings most people never see, and they add up to a school system that quietly asks parents to pay for things it used to provide.",
  "pitch.ask":
    "A board member should be able to explain where the money goes and push for schools families can afford to be part of.",
  "fightFor.heading": "Saqeeb will fight for:",

  "budget.eyebrow": "District budget",
  "budget.title": "Where East Brunswick's $209 million goes",
  "budget.intro":
    "The district publishes its budget under state accounting labels. The toggle below swaps those labels for a description of what each line pays for.",
  "budget.toggle": "Translate to Plain English",
  "budget.total": "2026\u201327 general fund",
  "budget.share": "share of budget",
  "budget.revenue.title": "Where the money comes from",
  "budget.movement.title": "What is growing, and what is not",
  "budget.reserves.title": "What is left in the bank",
  "budget.perpupil.title": "Cost per student",

  "priorities.eyebrow": "Our platform",
  "priorities.title": "Our platform for East Brunswick schools",

  "volunteer.title": "Powered by Neighbors",
  "volunteer.intro":
    "School board races here are decided by a few hundred votes. Pick how you want to help; you can choose more than one.",
  "volunteer.options.signup": "Sign up to help",
  "volunteer.options.canvass": "Join a canvassing day",
  "volunteer.options.phone": "Phone or text bank",
  "volunteer.sign": "Request a yard sign",
  "volunteer.sign.detail":
    "Fill in the form and include your street address. A volunteer will drop one off. Signs are free, and we'll pick them up after the election if you'd like.",

  "form.name": "Name",
  "form.email": "Email",
  "form.zip": "Zip code",
  "form.mobile": "Mobile number",
  "form.mobile.optional": "Mobile number (optional)",
  "form.address": "Street address (optional)",
  "form.help": "How do you want to help? Pick one or more.",
  "form.submit.volunteer": "Count me in",
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