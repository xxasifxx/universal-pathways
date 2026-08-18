import { useState } from "react";

import { ISSUE_TAGS, type FieldHousehold } from "@/lib/canvass";
import type { PendingVisit } from "@/lib/canvass-outbox";

type VoterAnswer = PendingVisit["responses"][number];

function emptyAnswer(voterId: string): VoterAnswer {
  return {
    voter_id: voterId,
    support: null,
    issues: [],
    wants_lawn_sign: false,
    volunteer_lead: false,
    vote_by_mail: false,
    do_not_contact: false,
  };
}

const FLAGS = [
  { key: "wants_lawn_sign", label: "Lawn sign" },
  { key: "volunteer_lead", label: "Wants to volunteer" },
  { key: "vote_by_mail", label: "Vote-by-mail app" },
  { key: "do_not_contact", label: "Do not contact" },
] as const;

export function OutcomeSheet({
  household,
  onCancel,
  onSave,
}: {
  household: FieldHousehold;
  onCancel: () => void;
  onSave: (responses: VoterAnswer[], note: string) => void;
}) {
  const [answers, setAnswers] = useState<VoterAnswer[]>(
    household.voters.map((v) => emptyAnswer(v.id)),
  );
  const [note, setNote] = useState("");

  const patch = (voterId: string, next: Partial<VoterAnswer>) =>
    setAnswers((prev) => prev.map((a) => (a.voter_id === voterId ? { ...a, ...next } : a)));

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50">
      <div className="max-h-[92dvh] overflow-y-auto rounded-t-2xl bg-background p-4 pb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-extrabold text-foreground">
            {household.address}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="min-h-12 min-w-12 rounded-full border-2 border-border px-4 text-base font-bold"
          >
            Close
          </button>
        </div>

        {household.voters.length === 0 ? (
          <p className="text-base text-foreground">No registered voters on file at this address.</p>
        ) : null}

        {household.voters.map((voter) => {
          const answer = answers.find((a) => a.voter_id === voter.id)!;
          return (
            <section key={voter.id} className="mb-4 rounded-xl border-2 border-border p-3">
              <h3 className="text-lg font-bold text-foreground">
                {voter.name}
                <span className="ml-2 text-sm font-semibold text-foreground/80">
                  {voter.propensity}
                  {voter.party ? ` · ${voter.party}` : ""}
                </span>
              </h3>

              <p className="mt-3 text-sm font-bold uppercase tracking-wide text-foreground/80">
                Support (1 opposed – 5 strong)
              </p>
              <div className="mt-1 flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    aria-pressed={answer.support === level}
                    onClick={() => patch(voter.id, { support: answer.support === level ? null : level })}
                    className={`h-12 flex-1 rounded-lg border-2 text-lg font-extrabold ${
                      answer.support === level
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-sm font-bold uppercase tracking-wide text-foreground/80">
                Issues raised
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {ISSUE_TAGS.map((tag) => {
                  const on = answer.issues.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        patch(voter.id, {
                          issues: on ? answer.issues.filter((t) => t !== tag) : [...answer.issues, tag],
                        })
                      }
                      className={`min-h-12 rounded-full border-2 px-4 text-base font-bold ${
                        on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {FLAGS.map((flag) => {
                  const on = Boolean(answer[flag.key]);
                  return (
                    <button
                      key={flag.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => patch(voter.id, { [flag.key]: !on } as Partial<VoterAnswer>)}
                      className={`min-h-12 rounded-lg border-2 px-3 text-base font-bold ${
                        on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
                      }`}
                    >
                      {on ? "✓ " : ""}
                      {flag.label}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        <label className="block text-sm font-bold uppercase tracking-wide text-foreground/80">
          Notes
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Anything worth passing back to the campaign"
            className="mt-1 w-full rounded-lg border-2 border-border bg-card p-3 text-base text-foreground"
          />
        </label>

        <button
          type="button"
          onClick={() => onSave(answers, note.trim())}
          className="mt-4 min-h-14 w-full rounded-xl bg-primary text-lg font-extrabold text-primary-foreground"
        >
          Save and next door
        </button>
      </div>
    </div>
  );
}
