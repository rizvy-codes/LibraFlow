import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { returnBook } from "@/services/borrowing";
import { z } from "zod";

const schema = z.object({
  borrowingId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "LIBRARIAN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await returnBook(parsed.data.borrowingId);

    return NextResponse.json({ message: "Book returned successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to return book" },
      { status: 400 }
    );
  }
}