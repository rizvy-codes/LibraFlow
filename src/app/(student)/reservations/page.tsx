import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReservationsList } from "./ReservationsList";

export default async function ReservationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const reservations = await prisma.reservation.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["PENDING", "READY"] },
    },
    include: {
      book: { include: { category: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = reservations.map((r) => ({
    id: r.id,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    expiresAt: r.expiresAt?.toISOString() || null,
    book: {
      id: r.book.id,
      title: r.book.title,
      author: r.book.author,
      category: r.book.category.name,
    },
  }));

  return (
    <div>
      <PageHeader
        title="My Reservations"
        description="Books you have reserved"
      />
      <ReservationsList reservations={serialized} />
    </div>
  );
}