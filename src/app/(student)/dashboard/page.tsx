import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import {
  BookOpen,
  CalendarCheck,
  AlertTriangle,
  Wallet,
  Clock,
} from "lucide-react";
import { CurrentlyBorrowed } from "./CurrentlyBorrowed";
import { DueSoon } from "./Duesoon";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function StudentDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const now = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);

  const [
    activeBorrowings,
    overdueCount,
    pendingReservations,
    pendingFines,
    currentBooks,
    dueSoonBooks,
  ] = await Promise.all([
    prisma.borrowing.count({
      where: { userId, status: "ACTIVE" },
    }),
    prisma.borrowing.count({
      where: { userId, status: "OVERDUE" },
    }),
    prisma.reservation.count({
      where: { userId, status: { in: ["PENDING", "READY"] } },
    }),
    prisma.fine.aggregate({
      where: { userId, status: "PENDING" },
      _sum: { amount: true },
    }),
    prisma.borrowing.findMany({
      where: { userId, status: { in: ["ACTIVE", "OVERDUE"] } },
      include: { book: true },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
    prisma.borrowing.findMany({
      where: {
        userId,
        status: "ACTIVE",
        dueDate: { lte: threeDaysLater, gte: now },
      },
      include: { book: true },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  const studentName = session.user.name?.split(" ")[0] || "Student";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${studentName}! 👋`}
        description="Here’s an overview of your library activity."
      >
        <Button asChild>
          <Link href="/browse">Browse Books</Link>
        </Button>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Currently Borrowed"
          value={activeBorrowings}
          icon={BookOpen}
        />
        <StatCard
          title="Overdue"
          value={overdueCount}
          icon={AlertTriangle}
          description={overdueCount > 0 ? "Please return soon" : "All clear"}
        />
        <StatCard
          title="Reservations"
          value={pendingReservations}
          icon={CalendarCheck}
        />
        <StatCard
          title="Pending Fines"
          value={`৳${(pendingFines._sum.amount || 0).toFixed(0)}`}
          icon={Wallet}
        />
      </div>

      {/* Two columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CurrentlyBorrowed
          books={currentBooks.map((b) => ({
            id: b.id,
            title: b.book.title,
            author: b.book.author,
            dueDate: b.dueDate.toISOString(),
            status: b.status,
          }))}
        />
        <DueSoon
          books={dueSoonBooks.map((b) => ({
            id: b.id,
            title: b.book.title,
            dueDate: b.dueDate.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}