"use client";

import { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatCard } from "@/components/shared/StatCard";
import {
  BookOpen,
  ArrowLeftRight,
  AlertTriangle,
  Wallet,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type ReportData = {
  totalIssued: number;
  totalReturned: number;
  overdueCount: number;
  totalFines: number;
  pendingFines: number;
  newBooks: number;
  newStudents: number;
};

export function ReportsClient() {
  const [from, setFrom] = useState(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [to, setTo] = useState(format(new Date(), "yyyy-MM-dd"));
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/reports?from=${from}&to=${to}`
      );
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Failed to load report");
        return;
      }
      setData(result);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(
        `/api/admin/reports/export?from=${from}&to=${to}`
      );
      if (!res.ok) {
        toast.error("Export failed");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `libraflow-report-${from}-to-${to}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("CSV downloaded");
    } catch {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const quickRanges = [
    {
      label: "Last 7 days",
      from: format(subDays(new Date(), 6), "yyyy-MM-dd"),
      to: format(new Date(), "yyyy-MM-dd"),
    },
    {
      label: "This month",
      from: format(startOfMonth(new Date()), "yyyy-MM-dd"),
      to: format(endOfMonth(new Date()), "yyyy-MM-dd"),
    },
    {
      label: "Last 30 days",
      from: format(subDays(new Date(), 29), "yyyy-MM-dd"),
      to: format(new Date(), "yyyy-MM-dd"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <Input
              id="from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <Button onClick={loadReport} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Generate Report
          </Button>
          <Button
            variant="outline"
            onClick={exportCSV}
            disabled={isExporting || !data}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export CSV
          </Button>
        </div>

        {/* Quick ranges */}
        <div className="mt-3 flex flex-wrap gap-2">
          {quickRanges.map((r) => (
            <button
              key={r.label}
              onClick={() => {
                setFrom(r.from);
                setTo(r.to);
              }}
              className="rounded-full border border-border px-3 py-1 text-xs hover:bg-accent"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Books Issued"
            value={data.totalIssued}
            icon={ArrowLeftRight}
          />
          <StatCard
            title="Books Returned"
            value={data.totalReturned}
            icon={BookOpen}
          />
          <StatCard
            title="Overdue (period)"
            value={data.overdueCount}
            icon={AlertTriangle}
          />
          <StatCard
            title="Fines Collected"
            value={`৳${data.totalFines.toFixed(0)}`}
            icon={Wallet}
            description={`Pending: ৳${data.pendingFines.toFixed(0)}`}
          />
        </div>
      )}

      {!data && !isLoading && (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          Select a date range and click <strong>Generate Report</strong>
        </div>
      )}
    </div>
  );
}