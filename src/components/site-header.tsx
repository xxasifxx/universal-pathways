import { Link } from "@tanstack/react-router";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

import logoAsset from "@/assets/saqeeb-logo.jpg.asset.json";
import { actblueUrl, CANDIDATE_NAME } from "@/lib/campaign";
import { LOCALES, useI18n, type LocaleCode } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", key: "nav.home" },
  { to: "/priorities", key: "nav.priorities" },
  { to: "/dashboard", key: "nav.dashboard" },
  { to: "/volunteer", key: "nav.volunteer" },
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
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Link to="/" className="group flex min-w-0 items-center" onClick={() => setOpen(false)}>
          <img
            src={logoAsset.url}
            alt={`${CANDIDATE_NAME} for East Brunswick Board of Education`}
            width={220}
            height={56}
            className="w-36 object-contain sm:w-44"
          />
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
            href={actblueUrl("header")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
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