"use client";

import { formatDistanceToNow } from "date-fns";

type Activity = {
  id: string;
  action: string;
  details: string | null;
  userName: string;
  createdAt: string;
};

interface Props {
  activities: Activity[];
}

export function RecentActivity({ activities }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 font-semibold">Recent Activity</h3>

      {activities.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No recent activity
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map((a) => (
            <div key={a.id} className="flex gap-3">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-sm">
                  <span className="font-medium">{a.userName}</span>{" "}
                  <span className="text-muted-foreground">
                    {a.details || a.action}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(a.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}