import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { reserveBook } from "@/services/borrowing";
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

    const reservation = await reserveBook(session.user.id, parsed.data.bookId);

    return NextResponse.json(
      { message: "Book reserved successfully", reservation },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to reserve" },
      { status: 400 }
    );
  }
}