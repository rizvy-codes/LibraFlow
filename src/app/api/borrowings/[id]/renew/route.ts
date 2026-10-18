import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { renewBook } from "@/services/borrowing";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const updated = await renewBook(id, session.user.id);

    return NextResponse.json({
      message: "Book renewed successfully",
      borrowing: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to renew" },
      { status: 400 }
    );
  }
}