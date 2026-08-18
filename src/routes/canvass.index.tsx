import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { useAdminSession } from "@/hooks/use-admin-session";
import { listMyTurfs, openAssignedTurf } from "@/lib/canvass.functions";

export const Route = createFileRoute("/canvass/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Canvass · Volunteer turfs" },
      { name: "description", content: "Pick up your assigned walk list and start knocking." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Canvass · Volunteer turfs" },
      {
        property: "og:description",
        content: "Pick up your assigned walk list and start knocking.",
      },
    ],
  }),
  component: CanvassHome,
});

function CanvassHome() {
  const { loading, session } = useAdminSession();
  const { data } = useQuery({
    queryKey: ["my-turfs"],
    queryFn: () => listMyTurfs(),
    enabled: Boolean(session),
  });

  async function open(turfId: string) {
    const result = await openAssignedTurf({ data: { turfId } });
    if (result.ok) window.location.href = `/canvass/walk/${turfId}`;
  }

  return (
    <div className="mx-auto max-w-md p-5">
      <h1 className="font-display text-3xl font-extrabold text-foreground">Your turfs</h1>

      {loading ? <p className="mt-3 text-base text-foreground">Loading…</p> : null}

      {!loading && !session ? (
        <div className="mt-3 space-y-3">
          <p className="text-base text-foreground">
            If the organizer sent you a turf link, open that link on your phone and enter the
            passcode. Volunteers with an account can sign in instead.
          </p>
          <Link
            to="/admin/login"
            className="inline-flex min-h-14 items-center rounded-xl bg-primary px-5 text-lg font-extrabold text-primary-foreground"
          >
            Sign in
          </Link>
        </div>
      ) : null}

      <ul className="mt-4 space-y-3">
        {(data?.turfs ?? []).map((turf) => (
          <li key={String(turf["id"])}>
            <button
              type="button"
              onClick={() => void open(String(turf["id"]))}
              className="min-h-16 w-full rounded-xl border-2 border-border bg-card p-4 text-left"
            >
              <p className="text-lg font-extrabold text-foreground">{String(turf["name"])}</p>
              <p className="text-sm font-semibold text-foreground/80">
                {String(turf["door_count"])} doors · {String(turf["status"]).replace("_", " ")}
              </p>
            </button>
          </li>
        ))}
      </ul>

      {session && (data?.turfs.length ?? 0) === 0 ? (
        <p className="mt-4 text-base text-foreground">No turf assigned to you yet.</p>
      ) : null}
    </div>
  );
}
