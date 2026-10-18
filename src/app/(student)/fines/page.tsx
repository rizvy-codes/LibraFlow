import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { FinesList } from "./FineList";

export default async function FinesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const fines = await prisma.fine.findMany({
    where: { userId: session.user.id },
    include: {
      borrowing: { include: { book: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const pendingTotal = fines
    .filter((f) => f.status === "PENDING")
    .reduce((sum, f) => sum + f.amount, 0);

  const serialized = fines.map((f) => ({
    id: f.id,
    amount: f.amount,
    status: f.status,
    reason: f.reason,
    createdAt: f.createdAt.toISOString(),
    bookTitle: f.borrowing?.book?.title || "—",
    paidAt: f.payment?.createdAt?.toISOString() || null,
  }));

  return (
    <div>
      <PageHeader
        title="Fines & Payments"
        description="View your fines and payment history"
      />

      {/* Pending total */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Total Pending Fines</p>
        <p className="mt-1 text-3xl font-bold text-red-600">
          ৳{pendingTotal.toFixed(2)}
        </p>
      </div>

      <FinesList fines={serialized} />
    </div>
  );
}