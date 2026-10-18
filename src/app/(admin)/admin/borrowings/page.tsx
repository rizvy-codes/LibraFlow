import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Undo2 } from "lucide-react";
import { TransactionsTable } from "./TransactionsTable";

export default async function AdminBorrowingsPage() {
  const borrowings = await prisma.borrowing.findMany({
    include: {
      book: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const serialized = borrowings.map((b) => ({
    id: b.id,
    status: b.status,
    issueDate: b.issueDate.toISOString(),
    dueDate: b.dueDate.toISOString(),
    returnDate: b.returnDate?.toISOString() || null,
    renewCount: b.renewCount,
    bookTitle: b.book.title,
    studentName: b.user.name,
    studentId: b.user.studentId || "—",
  }));

  return (
    <div>
      <PageHeader
        title="All Transactions"
        description="View and manage all borrowing records"
      >
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/borrowings/return">
              <Undo2 className="mr-2 h-4 w-4" />
              Process Return
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/borrowings/issue">
              <Plus className="mr-2 h-4 w-4" />
              Record Borrowing
            </Link>
          </Button>
        </div>
      </PageHeader>

      <TransactionsTable data={serialized} />
    </div>
  );
}