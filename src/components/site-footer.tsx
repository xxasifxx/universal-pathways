import { Link } from "@tanstack/react-router";

import {
  actblueUrl,
  CANDIDATE_NAME,
  CONTACT_EMAIL,
  REGISTRATION_DEADLINE,
} from "@/lib/campaign";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="rounded-xl border border-gold/40 bg-gold/10 p-6 sm:p-8">
          <p className="eyebrow text-ink-foreground/75">
            {t("footer.register.title")}
          </p>
          <p className="mt-3 max-w-2xl font-display text-2xl font-extrabold leading-tight sm:text-3xl">
            Register to vote by{" "}
            <span className="text-gold">{REGISTRATION_DEADLINE}</span> to have a say
            in who runs East Brunswick&apos;s schools.
          </p>
          <a
            href="https://www.nj.gov/state/elections/voter-registration.shtml"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-md bg-gold px-5 py-2.5 font-display text-base tracking-wide text-gold-foreground transition-opacity hover:opacity-90"
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
            <Link to="/priorities" className="w-fit hover:text-gold">
              {t("nav.priorities")}
            </Link>
            <Link to="/dashboard" className="w-fit hover:text-gold">
              {t("nav.dashboard")}
            </Link>
            <Link to="/volunteer" className="w-fit hover:text-gold">
              {t("nav.volunteer")}
            </Link>
          </nav>
          <div className="flex flex-col gap-2 text-sm">
            <a href={`mailto:${CONTACT_EMAIL}`} className="w-fit font-semibold hover:text-gold">
              {CONTACT_EMAIL}
            </a>
            <a
              href={actblueUrl("footer")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit font-semibold hover:text-gold"
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