import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { issueBook } from "@/services/borrowing";
import { z } from "zod";

const schema = z.object({
  bookId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const borrowing = await issueBook(session.user.id, parsed.data.bookId);

    return NextResponse.json(
      { message: "Book borrowed successfully", borrowing },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to borrow book" },
      { status: 400 }
    );
  }
}