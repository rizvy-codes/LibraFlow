"use client";

import { format, differenceInDays } from "date-fns";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type OverdueItem = {
  id: string;
  bookTitle: string;
  studentName: string;
  studentId: string;
  dueDate: string;
};

interface Props {
  data: OverdueItem[];
}

export function OverdueTable({ data }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Overdue Books</h3>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/borrowings">View All</Link>
        </Button>
      </div>

      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No overdue books 🎉
        </p>
      ) : (
        <div className="space-y-3">
          {data.map((item) => {
            const days = differenceInDays(new Date(), new Date(item.dueDate));
            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{item.bookTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.studentName} ({item.studentId})
                  </p>
                </div>
                <StatusBadge status="danger">{days}d overdue</StatusBadge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}