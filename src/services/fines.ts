import { prisma } from "@/lib/prisma";
import { FineStatus, BorrowStatus } from "@prisma/client";

async function getSetting(key: string, fallback: string) {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? fallback;
}

/**
 * Mark overdue borrowings and create/update fines.
 * Call this from the daily cron job.
 */
export async function processOverdueAndFines() {
  const finePerDay = parseFloat(await getSetting("finePerDay", "5"));
  const now = new Date();

  // 1. Find all ACTIVE borrowings that are past due date
  const overdueBorrowings = await prisma.borrowing.findMany({
    where: {
      status: BorrowStatus.ACTIVE,
      dueDate: { lt: now },
    },
    include: { book: true, user: true },
  });

  let processed = 0;

  for (const borrowing of overdueBorrowings) {
    // Mark as OVERDUE
    await prisma.borrowing.update({
      where: { id: borrowing.id },
      data: { status: BorrowStatus.OVERDUE },
    });

    // Calculate days overdue
    const daysOverdue = Math.ceil(
      (now.getTime() - borrowing.dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const amount = daysOverdue * finePerDay;

    // Create or update fine
    const existingFine = await prisma.fine.findUnique({
      where: { borrowingId: borrowing.id },
    });

    if (existingFine) {
      if (existingFine.status === FineStatus.PENDING) {
        await prisma.fine.update({
          where: { id: existingFine.id },
          data: { amount },
        });
      }
    } else {
      await prisma.fine.create({
        data: {
          userId: borrowing.userId,
          borrowingId: borrowing.id,
          amount,
          status: FineStatus.PENDING,
          reason: `Overdue ${daysOverdue} day(s) – ${borrowing.book.title}`,
        },
      });

      // Notification
      await prisma.notification.create({
        data: {
          userId: borrowing.userId,
          title: "Overdue Book & Fine",
          message: `"${borrowing.book.title}" is overdue by ${daysOverdue} day(s). Fine: ৳${amount}`,
          type: "FINE",
          link: "/fines",
        },
      });
    }

    processed++;
  }

  return { processed, totalOverdue: overdueBorrowings.length };
}

/**
 * Create due-soon notifications (2 days before due date)
 */
export async function sendDueSoonReminders() {
  const twoDaysLater = new Date();
  twoDaysLater.setDate(twoDaysLater.getDate() + 2);
  twoDaysLater.setHours(23, 59, 59, 999);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dueSoon = await prisma.borrowing.findMany({
    where: {
      status: BorrowStatus.ACTIVE,
      dueDate: {
        gte: tomorrow,
        lte: twoDaysLater,
      },
    },
    include: { book: true },
  });

  for (const b of dueSoon) {
    // Avoid duplicate notifications on the same day
    const alreadySent = await prisma.notification.findFirst({
      where: {
        userId: b.userId,
        type: "DUE_SOON",
        link: `/borrowed`,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        message: { contains: b.book.title },
      },
    });

    if (!alreadySent) {
      await prisma.notification.create({
        data: {
          userId: b.userId,
          title: "Book Due Soon",
          message: `"${b.book.title}" is due on ${b.dueDate.toLocaleDateString()}. Please return or renew.`,
          type: "DUE_SOON",
          link: "/borrowed",
        },
      });
    }
  }

  return { sent: dueSoon.length };
}