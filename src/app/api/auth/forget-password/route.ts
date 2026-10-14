import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success (security – don’t reveal if email exists)
    if (!user) {
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store in OtpToken table (reuse for password reset)
    await prisma.otpToken.deleteMany({
      where: { email, type: "password_reset" },
    });

    await prisma.otpToken.create({
      data: {
        email,
        token,
        type: "password_reset",
        expiresAt,
      },
    });

    // In development: log the reset link
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    console.log("\n========================================");
    console.log("PASSWORD RESET LINK (dev only):");
    console.log(resetUrl);
    console.log("========================================\n");

    // TODO: Send real email later with Resend / Nodemailer

    return NextResponse.json({
      message: "If an account exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}