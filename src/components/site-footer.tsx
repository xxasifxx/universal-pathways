import { Link } from "@tanstack/react-router";

import {
  CANDIDATE_NAME,
  CONTACT_EMAIL,
  DONATE_URL,
  REGISTRATION_DEADLINE,
} from "@/lib/campaign";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-6 sm:p-8">
          <p className="eyebrow text-primary-foreground/70">
            {t("footer.register.title")}
          </p>
          <p className="mt-3 max-w-2xl font-display text-2xl font-extrabold leading-tight sm:text-3xl">
            Register to vote by{" "}
            <span className="text-[oklch(0.75_0.13_45)]">{REGISTRATION_DEADLINE}</span> to have a say
            in who runs East Brunswick&apos;s schools.
          </p>
          <a
            href="https://www.nj.gov/state/elections/voter-registration.shtml"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-md bg-primary px-5 py-2.5 font-display text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("footer.register.cta")}
          </a>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg font-extrabold">{CANDIDATE_NAME}</p>
            <p className="mt-2 text-sm text-ink-foreground/85">{t("footer.tagline")}</p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-2 text-sm font-semibold">
            <Link to="/about" className="w-fit hover:text-[oklch(0.75_0.13_45)]">
              {t("nav.about")}
            </Link>
            <Link to="/priorities" className="w-fit hover:text-[oklch(0.75_0.13_45)]">
              {t("nav.priorities")}
            </Link>
            <Link to="/cost-calculator" className="w-fit hover:text-[oklch(0.75_0.13_45)]">
              {t("nav.calculator")}
            </Link>
            <Link to="/volunteer" className="w-fit hover:text-[oklch(0.75_0.13_45)]">
              {t("nav.volunteer")}
            </Link>
            <Link to="/contact" className="w-fit hover:text-[oklch(0.75_0.13_45)]">
              {t("nav.contact")}
            </Link>
          </nav>
          <div className="flex flex-col gap-2 text-sm">
            <a href={`mailto:${CONTACT_EMAIL}`} className="w-fit font-semibold hover:text-[oklch(0.75_0.13_45)]">
              {CONTACT_EMAIL}
            </a>
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit font-semibold hover:text-[oklch(0.75_0.13_45)]"
            >
              {t("nav.donate")}
            </a>
          </div>
        </div>

        <p className="mt-10 border-t border-ink-foreground/20 pt-6 text-xs text-ink-foreground/80">
          {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}