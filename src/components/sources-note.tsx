import { Link } from "@tanstack/react-router";

import { SOURCE_LINE } from "@/lib/sources";

export function SourcesNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-muted-foreground ${className}`}>
      <span className="font-semibold text-foreground">Source: </span>
      {SOURCE_LINE}{" "}
      <Link to="/methodology" className="font-semibold text-primary underline">
        See the sources and every assumption
      </Link>
      .
    </p>
  );
}