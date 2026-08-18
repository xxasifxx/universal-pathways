import { createFileRoute, Link } from "@tanstack/react-router";

import { OUTCOMES } from "@/lib/canvass";

export const Route = createFileRoute("/canvass/guide")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Field guide · Canvass" },
      { name: "description", content: "Rules, role boundaries, and what to record at each stop." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Field guide · Canvass" },
      {
        property: "og:description",
        content: "Rules, role boundaries, and what to record at each stop.",
      },
    ],
  }),
  component: FieldGuide,
});

function FieldGuide() {
  return (
    <div className="mx-auto max-w-2xl p-5 pb-24">
      <Link
        to="/canvass"
        className="inline-flex min-h-12 items-center text-base font-bold text-foreground"
      >
        ‹ Back to turfs
      </Link>

      <h1 className="mt-2 font-display text-4xl font-extrabold text-foreground">
        Field guide
      </h1>
      <p className="mt-2 text-lg font-semibold text-foreground/80">
        How to use the canvassing app, what each role can see, and what to record at every door.
      </p>

      <section className="mt-8 rounded-2xl border-2 border-border bg-card p-5">
        <h2 className="font-display text-2xl font-extrabold text-foreground">Rules of the walk</h2>
        <ul className="mt-4 space-y-3 text-base text-foreground">
          <li className="flex gap-3">
            <span className="font-extrabold text-primary">1.</span>
            <span>
              Be polite and brief. Introduce yourself, say you are volunteering for Saqeeb for East
              Brunswick Board of Education, and ask if they have a moment to talk.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-extrabold text-primary">2.</span>
            <span>
              Do not enter homes or argue with residents. If someone is hostile, mark{" "}
              <strong>Refused</strong> and move on.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-extrabold text-primary">3.</span>
            <span>
              Only knock during reasonable hours: weekdays after 10 a.m. and before 8 p.m.,
              weekends after 11 a.m. and before 7 p.m.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-extrabold text-primary">4.</span>
            <span>
              Leave no campaign material at <strong>Refused</strong> or <strong>Moved</strong>{" "}
              households unless the voter specifically asks for it.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-extrabold text-primary">5.</span>
            <span>
              Never share turf links, passcodes, screenshots, or voter lists with anyone who is not
              an assigned canvasser or organizer.
            </span>
          </li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border-2 border-border bg-card p-5">
        <h2 className="font-display text-2xl font-extrabold text-foreground">Role boundaries</h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-foreground">Canvasser</h3>
            <p className="text-base text-foreground/90">
              You can only open turfs that are assigned to you or unlocked with a passcode. You see
              the households on that turf, the voters in each household, and their propensity badge.
              You cannot search the full voter file, view other turfs, or export data.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground">Organizer</h3>
            <p className="text-base text-foreground/90">
              Organizers can create turfs, assign them to volunteers, set passcodes, and view
              aggregate progress across all turfs. They do not hand out full voter exports; they cut
              turf-sized walk lists and share links with passcodes.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground">Admin</h3>
            <p className="text-base text-foreground/90">
              Admins manage roles and can see everything organizers see. Only admins can grant
              organizer or canvasser access.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border-2 border-border bg-card p-5">
        <h2 className="font-display text-2xl font-extrabold text-foreground">What to record at each stop</h2>
        <p className="mt-2 text-base text-foreground/90">
          Tap the button that matches what happened. The app advances automatically and saves your
          answer locally until it can sync.
        </p>

        <div className="mt-4 space-y-4">
          {OUTCOMES.map((outcome) => (
            <div key={outcome.key} className="rounded-xl bg-background p-4">
              <h3 className="text-lg font-extrabold text-foreground">{outcome.label}</h3>
              <p className="text-base text-foreground/90">
                {descriptionFor(outcome.key)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border-2 border-border bg-card p-5">
        <h2 className="font-display text-2xl font-extrabold text-foreground">When you speak to a voter</h2>
        <p className="mt-2 text-base text-foreground/90">
          Tap <strong>Spoke to voter</strong> and use the bottom sheet to record:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-foreground/90">
          <li>
            <strong>Support level:</strong> 1 = strong support for Saqeeb, 5 = strong opposition.
            Use 3 for undecided.
          </li>
          <li>
            <strong>Top issue:</strong> pick the issue the voter cares about most, such as Pre-K,
            high school, staff pay, taxes, class size, special ed, safety, or transparency.
          </li>
          <li>
            <strong>Action flags:</strong> lawn sign request, volunteer lead, vote-by-mail
            application, or do-not-contact.
          </li>
          <li>
            <strong>Note:</strong> a short sentence with updated contact info, a specific concern,
            or anything the voter asked you to pass along.
          </li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border-2 border-border bg-card p-5">
        <h2 className="font-display text-2xl font-extrabold text-foreground">Offline and sync</h2>
        <p className="mt-2 text-base text-foreground/90">
          The app caches your turf on your phone when you open it. If you lose signal, keep
          knocking. The pending count in the header shows unsaved doors. When you reconnect, the
          app syncs automatically. Do not close the page until you see <strong>All synced</strong>{" "}
          if possible.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border-2 border-destructive bg-card p-5">
        <h2 className="font-display text-2xl font-extrabold text-foreground">Privacy</h2>
        <p className="mt-2 text-base text-foreground/90">
          Voter data is for campaign use only. Do not screenshot lists, text them to friends, or
          leave your phone unlocked where others can read it. If you stop volunteering, let the
          organizer know so your access can be removed.
        </p>
      </section>
    </div>
  );
}

function descriptionFor(key: (typeof OUTCOMES)[number]["key"]): string {
  switch (key) {
    case "not_home":
      return "No one answered. Do not leave material unless a resident asks for it.";
    case "moved":
      return "The resident no longer lives here or the unit is vacant.";
    case "refused":
      return "The resident declined to speak or was unwelcoming. Mark and move on.";
    case "inaccessible":
      return "The building was locked, a dog was present, or the door was unreachable.";
    case "spoke":
      return "You had a conversation. Record support, issues, and action flags.";
  }
}
