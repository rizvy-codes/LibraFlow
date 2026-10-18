"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";

const COLORS = ["#059669", "#0B2535", "#047857", "#10b981", "#34d399", "#6ee7b7"];

interface Props {
  borrowingTrend: { date: string; count: number }[];
  categoryData: { name: string; value: number }[];
}

export function DashboardCharts({ borrowingTrend, categoryData }: Props) {
  return (
    <div className="space-y-6">
      {/* Borrowing Trend */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 font-semibold">Borrowing Trend (Last 7 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={borrowingTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => format(parseISO(v), "dd MMM")}
                className="text-xs"
              />
              <YAxis allowDecimals={false} className="text-xs" />
              <Tooltip
                labelFormatter={(v) => format(parseISO(v as string), "dd MMM yyyy")}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#059669"
                fill="#059669"
                fillOpacity={0.2}
                name="Borrowings"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 font-semibold">Books by Category</h3>
        <div className="h-64">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-full items-center justify-center text-muted-foreground">
              No category data
            </p>
          )}
        </div>
      </div>
    </div>
  );
}