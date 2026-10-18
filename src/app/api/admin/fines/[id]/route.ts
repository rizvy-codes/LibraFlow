import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  action: z.enum(["pay", "waive"]),
  waivedReason: z.string().optional(),
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
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const fine = await prisma.fine.findUnique({ where: { id } });
    if (!fine) return NextResponse.json({ error: "Fine not found" }, { status: 404 });
    if (fine.status !== "PENDING") {
      return NextResponse.json({ error: "Fine is not pending" }, { status: 400 });
    }

    if (parsed.data.action === "pay") {
      await prisma.$transaction([
        prisma.fine.update({
          where: { id },
          data: { status: "PAID" },
        }),
        prisma.payment.create({
          data: {
            userId: fine.userId,
            fineId: id,
            amount: fine.amount,
            method: "Cash",
            note: "Recorded by admin",
          },
        }),
        prisma.activityLog.create({
          data: {
            userId: session.user.id,
            action: "FINE_PAID",
            entity: "Fine",
            entityId: id,
            details: `Payment recorded: ৳${fine.amount}`,
          },
        }),
      ]);
    } else {
      if (!parsed.data.waivedReason?.trim()) {
        return NextResponse.json({ error: "Waive reason required" }, { status: 400 });
      }
      await prisma.$transaction([
        prisma.fine.update({
          where: { id },
          data: {
            status: "WAIVED",
            waivedReason: parsed.data.waivedReason,
          },
        }),
        prisma.activityLog.create({
          data: {
            userId: session.user.id,
            action: "FINE_WAIVED",
            entity: "Fine",
            entityId: id,
            details: `Waived: ${parsed.data.waivedReason}`,
          },
        }),
      ]);
    }

    return NextResponse.json({ message: "Success" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}