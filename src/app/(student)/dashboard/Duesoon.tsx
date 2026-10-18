"use client";

import { format, differenceInDays } from "date-fns";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

type Book = {
  id: string;
  title: string;
  dueDate: string;
};

interface Props {
  books: Book[];
}

export function DueSoon({ books }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Due Soon</h3>
        <Button variant="outline" size="sm" asChild>
          <Link href="/borrowed">Manage</Link>
        </Button>
      </div>

      {books.length === 0 ? (
        <div className="py-10 text-center">
          <Clock className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-2 text-sm text-muted-foreground">
            No books due in the next 3 days
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {books.map((b) => {
            const days = differenceInDays(new Date(b.dueDate), new Date());
            return (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{b.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due {format(new Date(b.dueDate), "dd MMM yyyy")}
                  </p>
                </div>
                <span className="text-sm font-medium text-amber-600">
                  {days === 0 ? "Today" : `${days} day(s)`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}