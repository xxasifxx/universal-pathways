import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

import type { DraftStatus } from "@/lib/drafts";

/** Kept local so the draft text module is never pulled into the client bundle. */
const STATUSES: readonly string[] = ["drafting", "in-review", "cleared", "hold"];

type GateSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["REVIEW_SESSION_SECRET"]!,
    name: "review-gate",
    maxAge: 60 * 60 * 24 * 30,
    cookie: {
      httpOnly: true,
      // Local preview is served over plain http; a secure-only cookie is dropped there.
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function isUnlocked(): Promise<boolean> {
  const session = await useSession<GateSession>(sessionConfig());
  return session.data.unlocked === true;
}

export const unlockReview = createServerFn({ method: "POST" })
  .inputValidator((data: { passcode: string }) => ({ passcode: String(data.passcode ?? "") }))
  .handler(async ({ data }) => {
    const expected = process.env["REVIEW_PASSCODE"];
    if (!expected) throw new Error("REVIEW_PASSCODE is not set");
    if (!data.passcode || !passwordMatches(data.passcode, expected)) {
      return { ok: false as const };
    }
    const session = await useSession<GateSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockReview = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

/** Cheap gate probe for the review layout's beforeLoad. Leaks nothing. */
export const checkReviewUnlocked = createServerFn({ method: "GET" }).handler(async () => ({
  unlocked: await isUnlocked(),
}));

export type ReviewComment = {
  id: string;
  draft_key: string;
  body: string;
  reviewer_name: string;
  resolved: boolean;
  created_at: string;
};

/**
 * Gate + payload in one call. The draft text itself only leaves the server
 * once the passcode session checks out, so a locked visitor never receives it.
 */
export const getReviewContent = createServerFn({ method: "GET" }).handler(async () => {
  if (!(await isUnlocked())) return { locked: true as const };

  const { DRAFT_SECTIONS, REVIEW_BRIEF } = await import("@/lib/drafts");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: statusRows }, { data: commentRows }] = await Promise.all([
    supabaseAdmin.from("draft_status").select("draft_key,status"),
    supabaseAdmin
      .from("draft_comments")
      .select("id,draft_key,body,reviewer_name,author_email,resolved,created_at")
      .order("created_at", { ascending: false }),
  ]);

  return {
    locked: false as const,
    brief: REVIEW_BRIEF,
    sections: DRAFT_SECTIONS,
    statuses: (statusRows ?? []).map((r) => ({ draft_key: r.draft_key, status: r.status })),
    comments: (commentRows ?? []).map((c) => ({
      id: c.id,
      draft_key: c.draft_key,
      body: c.body,
      reviewer_name: c.reviewer_name ?? c.author_email ?? "reviewer",
      resolved: c.resolved,
      created_at: c.created_at,
    })) satisfies ReviewComment[],
  };
});

export const postReviewComment = createServerFn({ method: "POST" })
  .inputValidator((data: { draftKey: string; body: string; reviewerName: string }) => ({
    draftKey: String(data.draftKey ?? "").slice(0, 200),
    body: String(data.body ?? "").trim().slice(0, 2000),
    reviewerName: String(data.reviewerName ?? "").trim().slice(0, 80),
  }))
  .handler(async ({ data }) => {
    if (!(await isUnlocked())) return { ok: false as const, reason: "locked" as const };
    if (data.body.length < 3 || data.reviewerName.length < 2 || !data.draftKey) {
      return { ok: false as const, reason: "invalid" as const };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("draft_comments").insert({
      draft_key: data.draftKey,
      body: data.body,
      reviewer_name: data.reviewerName,
      source: "reviewer",
    });
    if (error) throw error;
    return { ok: true as const };
  });

export const setReviewStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { draftKey: string; status: string; reviewerName: string }) => ({
    draftKey: String(data.draftKey ?? "").slice(0, 200),
    status: String(data.status ?? ""),
    reviewerName: String(data.reviewerName ?? "").trim().slice(0, 80),
  }))
  .handler(async ({ data }) => {
    if (!(await isUnlocked())) return { ok: false as const, reason: "locked" as const };
    if (!STATUSES.includes(data.status) || !data.draftKey) {
      return { ok: false as const, reason: "invalid" as const };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("draft_status").upsert(
      {
        draft_key: data.draftKey,
        status: data.status as DraftStatus,
        updated_by_name: data.reviewerName || null,
      },
      { onConflict: "draft_key" },
    );
    if (error) throw error;
    return { ok: true as const };
  });

export const resolveReviewComment = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; resolved: boolean }) => ({
    id: String(data.id ?? ""),
    resolved: Boolean(data.resolved),
  }))
  .handler(async ({ data }) => {
    if (!(await isUnlocked())) return { ok: false as const, reason: "locked" as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("draft_comments")
      .update({ resolved: data.resolved })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });

const PAGES = ["budget", "pilot", "growth", "priorities"] as const;
export type ReviewPageKey = (typeof PAGES)[number];

/** Notes on a research page are stored under this key. */
export function pageDraftKey(page: ReviewPageKey) {
  return `page:${page}`;
}

/**
 * Gate + research-page payload in one call. Locked visitors get nothing but a
 * flag: the page text never leaves the server without a valid passcode session.
 */
export const getReviewPage = createServerFn({ method: "GET" })
  .inputValidator((data: { page: string }) => ({ page: String(data.page ?? "") }))
  .handler(async ({ data }) => {
    if (!PAGES.includes(data.page as ReviewPageKey)) return { locked: true as const };
    if (!(await isUnlocked())) return { locked: true as const };
    const page = data.page as ReviewPageKey;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: commentRows } = await supabaseAdmin
      .from("draft_comments")
      .select("id,draft_key,body,reviewer_name,author_email,resolved,created_at")
      .eq("draft_key", pageDraftKey(page))
      .order("created_at", { ascending: false });

    const comments = (commentRows ?? []).map((c) => ({
      id: c.id,
      draft_key: c.draft_key,
      body: c.body,
      reviewer_name: c.reviewer_name ?? c.author_email ?? "reviewer",
      resolved: c.resolved,
      created_at: c.created_at,
    })) satisfies ReviewComment[];

    if (page === "budget") {
      const { BUDGET_PAYLOAD } = await import("@/lib/review-content/budget.server");
      return { locked: false as const, page, comments, budget: BUDGET_PAYLOAD };
    }
    if (page === "pilot") {
      const { PILOT_PAYLOAD } = await import("@/lib/review-content/pilot.server");
      return { locked: false as const, page, comments, pilot: PILOT_PAYLOAD };
    }
    if (page === "priorities") {
      const { PRIORITY_DETAIL, LEVER_LABELS } = await import(
        "@/lib/review-content/priorities.server"
      );
      return {
        locked: false as const,
        page,
        comments,
        priorities: PRIORITY_DETAIL.map((priority) => ({
          id: priority.id,
          number: priority.number,
          title: priority.title,
          summary: priority.summary,
          points: priority.points.map((point) => ({
            text: point.text,
            leverLabel: point.detail ? LEVER_LABELS[point.detail.leverKind] : null,
            lever: point.detail?.lever ?? null,
            mechanism: point.detail ? [...point.detail.mechanism] : [],
            openQuestion: point.detail?.openQuestion ?? null,
            sources: (point.detail?.sources ?? []).map((s) => ({ label: s.label, href: s.href })),
          })),
        })),
      };
    }

    const { DRAFT_SECTIONS } = await import("@/lib/drafts");
    const section = DRAFT_SECTIONS.find((s) => s.key === "growth:apartments-enrollment");
    return {
      locked: false as const,
      page,
      comments,
      growth: {
        title: section?.title ?? "Growth",
        context: section?.context ?? "",
        blocks: (section?.blocks ?? []).map((b) => ({ heading: b.heading, body: [...b.body] })),
        sources: (section?.sources ?? []).map((s) => ({ label: s.label, href: s.href })),
      },
    };
  });
