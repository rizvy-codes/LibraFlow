import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: number; // percentage change
  trendLabel?: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel = "from last month",
  iconColor = "bg-primary/10 text-primary",
  className,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-soft",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>

        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {trend}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        {trend !== undefined && (
          <p className="mt-0.5 text-xs text-muted-foreground">{trendLabel}</p>
        )}
      </div>
    </div>
  );
}