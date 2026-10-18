"use client";

import { format, differenceInDays, isPast } from "date-fns";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";

type Book = {
  id: string;
  title: string;
  author: string;
  dueDate: string;
  status: string;
};

interface Props {
  books: Book[];
}

export function CurrentlyBorrowed({ books }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Currently Borrowed</h3>
        <Button variant="outline" size="sm" asChild>
          <Link href="/borrowed">View All</Link>
        </Button>
      </div>

      {books.length === 0 ? (
        <div className="py-10 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-2 text-sm text-muted-foreground">
            No books borrowed yet
          </p>
          <Button size="sm" className="mt-3" asChild>
            <Link href="/browse">Browse Books</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {books.map((b) => {
            const due = new Date(b.dueDate);
            const days = differenceInDays(due, new Date());
            const overdue = isPast(due);

            return (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.author}</p>
                  <p className="text-xs text-muted-foreground">
                    Due {format(due, "dd MMM yyyy")}
                  </p>
                </div>
                <StatusBadge status={overdue ? "danger" : days <= 2 ? "warning" : "success"}>
                  {overdue
                    ? `${Math.abs(days)}d overdue`
                    : days === 0
                    ? "Due today"
                    : `${days}d left`}
                </StatusBadge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}