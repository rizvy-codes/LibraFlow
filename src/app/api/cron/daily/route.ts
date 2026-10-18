import { NextResponse } from "next/server";
import { processOverdueAndFines, sendDueSoonReminders } from "@/services/fines";

export async function GET(req: Request) {
  // Secure with CRON_SECRET
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const overdueResult = await processOverdueAndFines();
    const reminderResult = await sendDueSoonReminders();

    return NextResponse.json({
      success: true,
      overdue: overdueResult,
      reminders: reminderResult,
      ranAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Cron error:", error);
    return NextResponse.json(
      { error: error.message || "Cron failed" },
      { status: 500 }
    );
  }
}