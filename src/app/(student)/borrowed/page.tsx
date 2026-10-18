import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { BorrowedList } from "./BorrowedList";

export default async function BorrowedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const borrowings = await prisma.borrowing.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["ACTIVE", "OVERDUE"] },
    },
    include: {
      book: { include: { category: true } },
    },
    orderBy: { dueDate: "asc" },
  });

  const serialized = borrowings.map((b) => ({
    id: b.id,
    issueDate: b.issueDate.toISOString(),
    dueDate: b.dueDate.toISOString(),
    status: b.status,
    renewCount: b.renewCount,
    book: {
      id: b.book.id,
      title: b.book.title,
      author: b.book.author,
      category: b.book.category.name,
    },
  }));

  return (
    <div>
      <PageHeader
        title="My Borrowed Books"
        description="Manage your current loans and renewals"
      />
      <BorrowedList borrowings={serialized} />
    </div>
  );
}