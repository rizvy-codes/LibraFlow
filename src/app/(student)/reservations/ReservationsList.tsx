"use client";

import { format } from "date-fns";
import { BookOpen, CalendarCheck } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

type Reservation = {
  id: string;
  status: string;
  createdAt: string;
  expiresAt: string | null;
  book: {
    id: string;
    title: string;
    author: string;
    category: string;
  };
};

interface Props {
  reservations: Reservation[];
}

export function ReservationsList({ reservations }: Props) {
  if (reservations.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="No active reservations"
        description="When a book is unavailable you can reserve it from the book detail page."
        actionLabel="Browse Books"
        actionHref="/browse"
      />
    );
  }

  return (
    <div className="space-y-4">
      {reservations.map((r) => (
        <div
          key={r.id}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex gap-4">
            <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{r.book.title}</h3>
              <p className="text-sm text-muted-foreground">{r.book.author}</p>
              <p className="text-xs text-primary">{r.book.category}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Reserved on {format(new Date(r.createdAt), "dd MMM yyyy")}
                {r.expiresAt && (
                  <> • Expires {format(new Date(r.expiresAt), "dd MMM yyyy")}</>
                )}
              </p>
            </div>
          </div>

          <StatusBadge status={r.status === "READY" ? "success" : "warning"}>
            {r.status === "READY" ? "Ready for pickup" : "Waiting"}
          </StatusBadge>
        </div>
      ))}
    </div>
  );
}