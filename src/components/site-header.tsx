import { Link } from "@tanstack/react-router";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

import { CANDIDATE_NAME, DONATE_URL } from "@/lib/campaign";
import { LOCALES, useI18n, type LocaleCode } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", key: "nav.home" },
  { to: "/about", key: "nav.about" },
  { to: "/priorities", key: "nav.priorities" },
  { to: "/cost-calculator", key: "nav.calculator" },
  { to: "/volunteer", key: "nav.volunteer" },
  { to: "/contact", key: "nav.contact" },
] as const;

function LanguageSelect() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className="relative inline-flex items-center">
      <Globe aria-hidden="true" className="pointer-events-none absolute left-2 size-4 text-muted-foreground" />
      <select
        aria-label={t("nav.language")}
        value={locale}
        onChange={(e) => setLocale(e.target.value as LocaleCode)}
        className="appearance-none rounded-md border border-border bg-card py-2 pl-8 pr-7 text-sm font-medium text-foreground transition-colors hover:border-primary"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2 size-3.5 text-muted-foreground" />
    </div>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="group flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex min-w-0 flex-col items-center rounded-md bg-gold px-3 py-1.5 text-center leading-none">
            <span className="block text-[8px] font-bold uppercase tracking-[0.28em] text-gold-foreground">
              Muhammad
            </span>
            <span className="mt-0.5 block truncate font-display text-2xl tracking-[0.02em] text-gold-foreground">
              Saqeeb
            </span>
            <span
              aria-hidden="true"
              className="my-1 flex w-full items-center gap-1.5"
            >
              <span className="h-px flex-1 bg-gold-foreground/70" />
              <span className="text-[7px] text-gold-foreground">★</span>
              <span className="h-px flex-1 bg-gold-foreground/70" />
            </span>
            <span className="block truncate text-[8px] font-bold uppercase tracking-[0.16em] text-gold-foreground">
              EB Board of Education
            </span>
          </span>
          <span className="sr-only">{CANDIDATE_NAME} for East Brunswick Board of Education</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-primary" }}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSelect />
          </div>
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-primary px-4 py-2 font-display text-base tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("nav.donate")}
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("nav.close") : t("nav.menu")}
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-md border border-border text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-t border-border bg-card lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 font-display text-base font-bold text-foreground"
              activeProps={{ className: "bg-secondary text-primary" }}
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="pt-2 sm:hidden">
            <LanguageSelect />
          </div>
        </nav>
      </div>
    </header>
  );
}