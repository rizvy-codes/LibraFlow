import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "LIBRARIAN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const borrowing = await prisma.borrowing.findUnique({
    where: { id },
    include: {
      book: true,
      user: true,
    },
  });

  if (!borrowing) {
    return NextResponse.json({ error: "Borrowing not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: borrowing.id,
    status: borrowing.status,
    dueDate: borrowing.dueDate,
    bookTitle: borrowing.book.title,
    studentName: borrowing.user.name,
    studentId: borrowing.user.studentId,
  });
}