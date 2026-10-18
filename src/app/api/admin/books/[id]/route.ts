import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  publishedYear: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
  totalCopies: z.number().min(0),
  availableCopies: z.number().min(0),
  categoryId: z.string().min(1),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "LIBRARIAN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    if (parsed.data.availableCopies > parsed.data.totalCopies) {
      return NextResponse.json(
        { error: "Available copies cannot exceed total copies" },
        { status: 400 }
      );
    }

    const book = await prisma.book.update({
      where: { id },
      data: parsed.data,
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "BOOK_UPDATED",
        entity: "Book",
        entityId: id,
        details: `Updated book: ${book.title}`,
      },
    });

    return NextResponse.json(book);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only Admin can delete books" }, { status: 401 });
    }

    const { id } = await params;

    // Prevent delete if active borrowings exist
    const active = await prisma.borrowing.count({
      where: { bookId: id, status: { in: ["ACTIVE", "OVERDUE"] } },
    });
    if (active > 0) {
      return NextResponse.json(
        { error: "Cannot delete book with active loans" },
        { status: 400 }
      );
    }

    await prisma.book.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "BOOK_DELETED",
        entity: "Book",
        entityId: id,
        details: "Book deleted",
      },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}