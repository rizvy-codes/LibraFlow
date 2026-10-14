import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  publishedYear: z.number().optional().nullable(),
  description: z.string().optional().nullable(),
  totalCopies: z.number().min(1),
  categoryId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "LIBRARIAN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = bookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const data = parsed.data;

    const book = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        isbn: data.isbn || null,
        publisher: data.publisher || null,
        publishedYear: data.publishedYear || null,
        description: data.description || null,
        totalCopies: data.totalCopies,
        availableCopies: data.totalCopies,
        categoryId: data.categoryId,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "BOOK_ADDED",
        entity: "Book",
        entityId: book.id,
        details: `Added book: ${book.title}`,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error("Add book error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}