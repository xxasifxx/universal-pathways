import { createFileRoute } from "@tanstack/react-router";

import { ContactForm } from "@/components/contact-form";
import { CONTACT_EMAIL } from "@/lib/campaign";
import { useI18n } from "@/lib/i18n";

const TITLE = "Contact — The Solutions Inbox";
const DESCRIPTION =
  "Tell me about the bureaucratic bottlenecks you face in your classroom or with your child.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t } = useI18n();

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-14">
        <div>
          <p className="eyebrow text-primary">Contact</p>
          <h1 className="mt-3 text-4xl leading-[1.05] sm:text-6xl">{t("contact.title")}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {t("contact.body")}
          </p>
          <div className="mt-8 rounded-xl border border-border bg-secondary/60 p-6">
            <p className="font-display text-base font-bold">What actually gets read</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Specifics beat sentiment. The form your kid&apos;s school made you fill out twice.
              The aide position that has been open since September. The notice that only came in
              English. Those are the details that turn into policy.
            </p>
            <p className="mt-4 text-sm">
              Prefer email?{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}