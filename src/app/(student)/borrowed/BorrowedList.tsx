"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInDays, isPast } from "date-fns";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BookOpen, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";

type Borrowing = {
  id: string;
  issueDate: string;
  dueDate: string;
  status: string;
  renewCount: number;
  book: {
    id: string;
    title: string;
    author: string;
    category: string;
  };
};

interface Props {
  borrowings: Borrowing[];
}

export function BorrowedList({ borrowings }: Props) {
  const router = useRouter();
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const handleRenew = async (id: string) => {
    setRenewingId(id);
    try {
      const res = await fetch(`/api/borrowings/${id}/renew`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to renew");
        return;
      }

      toast.success("Book renewed successfully!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setRenewingId(null);
    }
  };

  if (borrowings.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No active loans"
        description="You haven't borrowed any books yet."
        actionLabel="Browse Books"
        actionHref="/browse"
      />
    );
  }

  return (
    <div className="space-y-4">
      {borrowings.map((b) => {
        const due = new Date(b.dueDate);
        const daysLeft = differenceInDays(due, new Date());
        const isOverdue = isPast(due) && b.status !== "RETURNED";

        return (
          <div
            key={b.id}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex gap-4">
              <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{b.book.title}</h3>
                <p className="text-sm text-muted-foreground">{b.book.author}</p>
                <p className="text-xs text-primary">{b.book.category}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>Issued: {format(new Date(b.issueDate), "dd MMM yyyy")}</span>
                  <span>•</span>
                  <span>Due: {format(due, "dd MMM yyyy")}</span>
                  <span>•</span>
                  <span>Renewed: {b.renewCount} time(s)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={isOverdue ? "danger" : daysLeft <= 3 ? "warning" : "success"}>
                {isOverdue
                  ? `Overdue by ${Math.abs(daysLeft)} day(s)`
                  : daysLeft === 0
                  ? "Due today"
                  : `${daysLeft} day(s) left`}
              </StatusBadge>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRenew(b.id)}
                disabled={renewingId === b.id || isOverdue}
              >
                {renewingId === b.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="mr-1 h-4 w-4" />
                    Renew
                  </>
                )}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}