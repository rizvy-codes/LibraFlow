"use client";

import { format } from "date-fns";
import { Wallet } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

type Fine = {
  id: string;
  amount: number;
  status: string;
  reason: string | null;
  createdAt: string;
  bookTitle: string;
  paidAt: string | null;
};

interface Props {
  fines: Fine[];
}

export function FinesList({ fines }: Props) {
  if (fines.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="No fines"
        description="You have a clean record. Keep returning books on time!"
      />
    );
  }

  return (
    <div className="space-y-3">
      {fines.map((f) => (
        <div
          key={f.id}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium">{f.bookTitle}</p>
            <p className="text-sm text-muted-foreground">{f.reason}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Created {format(new Date(f.createdAt), "dd MMM yyyy")}
              {f.paidAt && (
                <> • Paid {format(new Date(f.paidAt), "dd MMM yyyy")}</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-lg font-bold">৳{f.amount.toFixed(2)}</p>
            <StatusBadge
              status={
                f.status === "PAID"
                  ? "success"
                  : f.status === "WAIVED"
                  ? "info"
                  : "danger"
              }
            >
              {f.status}
            </StatusBadge>
          </div>
        </div>
      ))}
    </div>
  );
}