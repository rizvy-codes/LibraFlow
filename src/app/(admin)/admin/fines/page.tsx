import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { FinesTable } from "./FineTable";

export default async function AdminFinesPage() {
  const fines = await prisma.fine.findMany({
    include: {
      user: true,
      borrowing: { include: { book: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = fines.map((f) => ({
    id: f.id,
    amount: f.amount,
    status: f.status,
    reason: f.reason,
    waivedReason: f.waivedReason,
    createdAt: f.createdAt.toISOString(),
    studentName: f.user.name,
    studentId: f.user.studentId || "—",
    bookTitle: f.borrowing?.book?.title || "—",
    paidAt: f.payment?.createdAt?.toISOString() || null,
  }));

  return (
    <div>
      <PageHeader
        title="Fines & Payments"
        description="Manage student fines, record payments, and waive fines"
      />
      <FinesTable data={serialized} />
    </div>
  );
}