import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import {
  BookOpen,
  Users,
  ArrowLeftRight,
  AlertTriangle,
  Wallet,
  CalendarCheck,
} from "lucide-react";
import { DashboardCharts } from "./DashboardCharts";
import { RecentActivity } from "./RecentActivity";
import { OverdueTable } from "./OverdueTable";
import { QuickActions } from "./QuickActions";

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalBooks,
    totalStudents,
    activeBorrowings,
    overdueCount,
    pendingFines,
    pendingReservations,
    booksThisMonth,
    recentActivities,
    overdueBooks,
  ] = await Promise.all([
    prisma.book.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.borrowing.count({ where: { status: "ACTIVE" } }),
    prisma.borrowing.count({ where: { status: "OVERDUE" } }),
    prisma.fine.aggregate({
      where: { status: "PENDING" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.reservation.count({
      where: { status: { in: ["PENDING", "READY"] } },
    }),
    prisma.book.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.activityLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.borrowing.findMany({
      where: { status: "OVERDUE" },
      take: 5,
      include: {
        book: true,
        user: true,
      },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  // Borrowing trends (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentBorrowings = await prisma.borrowing.findMany({
    where: { issueDate: { gte: sevenDaysAgo } },
    select: { issueDate: true },
  });

  const trendMap: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    trendMap[key] = 0;
  }
  recentBorrowings.forEach((b) => {
    const key = b.issueDate.toISOString().slice(0, 10);
    if (trendMap[key] !== undefined) trendMap[key]++;
  });

  const borrowingTrend = Object.entries(trendMap).map(([date, count]) => ({
    date,
    count,
  }));

  // Category distribution
  const categories = await prisma.category.findMany({
    include: { _count: { select: { books: true } } },
  });
  const categoryData = categories
    .map((c) => ({ name: c.name, value: c._count.books }))
    .filter((c) => c.value > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Here’s what’s happening in your library today."
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Books"
          value={totalBooks.toLocaleString()}
          icon={BookOpen}
          description={`+${booksThisMonth} this month`}
        />
        <StatCard
          title="Students"
          value={totalStudents.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Active Loans"
          value={activeBorrowings.toLocaleString()}
          icon={ArrowLeftRight}
        />
        <StatCard
          title="Overdue"
          value={overdueCount.toLocaleString()}
          icon={AlertTriangle}
          description={overdueCount > 0 ? "Needs attention" : "All clear"}
        />
        <StatCard
          title="Pending Fines"
          value={`৳${(pendingFines._sum.amount || 0).toFixed(0)}`}
          icon={Wallet}
          description={`${pendingFines._count} fine(s)`}
        />
        <StatCard
          title="Reservations"
          value={pendingReservations.toLocaleString()}
          icon={CalendarCheck}
        />
      </div>

      {/* Charts + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardCharts
            borrowingTrend={borrowingTrend}
            categoryData={categoryData}
          />
        </div>
        <QuickActions />
      </div>

      {/* Overdue + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <OverdueTable
          data={overdueBooks.map((b) => ({
            id: b.id,
            bookTitle: b.book.title,
            studentName: b.user.name,
            studentId: b.user.studentId || "—",
            dueDate: b.dueDate.toISOString(),
          }))}
        />
        <RecentActivity
          activities={recentActivities.map((a) => ({
            id: a.id,
            action: a.action,
            details: a.details,
            userName: a.user?.name || "System",
            createdAt: a.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}