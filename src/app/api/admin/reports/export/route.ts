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

  const borrowings = await prisma.borrowing.findMany({
    where: { issueDate: { gte: fromDate, lte: toDate } },
    include: {
      book: true,
      user: true,
    },
    orderBy: { issueDate: "desc" },
  });

  // Build CSV
  const headers = [
    "Borrowing ID",
    "Book Title",
    "Author",
    "Student Name",
    "Student ID",
    "Issue Date",
    "Due Date",
    "Return Date",
    "Status",
    "Renew Count",
  ];

  const rows = borrowings.map((b) => [
    b.id,
    `"${b.book.title.replace(/"/g, '""')}"`,
    `"${b.book.author.replace(/"/g, '""')}"`,
    `"${b.user.name.replace(/"/g, '""')}"`,
    b.user.studentId || "",
    b.issueDate.toISOString().slice(0, 10),
    b.dueDate.toISOString().slice(0, 10),
    b.returnDate ? b.returnDate.toISOString().slice(0, 10) : "",
    b.status,
    b.renewCount,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="libraflow-report-${from}-to-${to}.csv"`,
    },
  });
}