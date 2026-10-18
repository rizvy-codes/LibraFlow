import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "LIBRARIAN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ error: "from and to required" }, { status: 400 });
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999);

  const [
    totalIssued,
    totalReturned,
    overdueCount,
    paidFines,
    pendingFines,
    newBooks,
    newStudents,
  ] = await Promise.all([
    prisma.borrowing.count({
      where: { issueDate: { gte: fromDate, lte: toDate } },
    }),
    prisma.borrowing.count({
      where: {
        returnDate: { gte: fromDate, lte: toDate },
        status: "RETURNED",
      },
    }),
    prisma.borrowing.count({
      where: {
        status: "OVERDUE",
        dueDate: { gte: fromDate, lte: toDate },
      },
    }),
    prisma.payment.aggregate({
      where: { createdAt: { gte: fromDate, lte: toDate } },
      _sum: { amount: true },
    }),
    prisma.fine.aggregate({
      where: { status: "PENDING" },
      _sum: { amount: true },
    }),
    prisma.book.count({
      where: { createdAt: { gte: fromDate, lte: toDate } },
    }),
    prisma.user.count({
      where: {
        role: "STUDENT",
        createdAt: { gte: fromDate, lte: toDate },
      },
    }),
  ]);

  return NextResponse.json({
    totalIssued,
    totalReturned,
    overdueCount,
    totalFines: paidFines._sum.amount || 0,
    pendingFines: pendingFines._sum.amount || 0,
    newBooks,
    newStudents,
  });
}