import { prisma } from "@/lib/prisma";
import { BorrowStatus, ReservationStatus } from "@prisma/client";

async function getSetting(key: string, fallback: string) {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? fallback;
}

export async function issueBook(userId: string, bookId: string) {
  return prisma.$transaction(async (tx) => {
    // 1. Load settings
    const maxBooks = parseInt(await getSetting("maxBooks", "3"));
    const loanDays = parseInt(await getSetting("loanDays", "14"));

    // 2. Check user has no unpaid fines
    const unpaidFines = await tx.fine.count({
      where: { userId, status: "PENDING" },
    });
    if (unpaidFines > 0) {
      throw new Error("You have unpaid fines. Please clear them first.");
    }

    // 3. Check user has no overdue books
    const overdue = await tx.borrowing.count({
      where: { userId, status: "OVERDUE" },
    });
    if (overdue > 0) {
      throw new Error("You have overdue books. Please return them first.");
    }

    // 4. Check active loan limit
    const activeLoans = await tx.borrowing.count({
      where: { userId, status: "ACTIVE" },
    });
    if (activeLoans >= maxBooks) {
      throw new Error(`You can borrow maximum ${maxBooks} books at a time.`);
    }

    // 5. Check not already borrowed the same book
    const alreadyBorrowed = await tx.borrowing.findFirst({
      where: { userId, bookId, status: "ACTIVE" },
    });
    if (alreadyBorrowed) {
      throw new Error("You already have an active loan for this book.");
    }

    // 6. Check availability
    const book = await tx.book.findUnique({ where: { id: bookId } });
    if (!book || book.availableCopies < 1) {
      throw new Error("This book is currently unavailable.");
    }

    // 7. Create borrowing + decrease availableCopies
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + loanDays);

    const borrowing = await tx.borrowing.create({
      data: {
        userId,
        bookId,
        dueDate,
        status: BorrowStatus.ACTIVE,
      },
    });

    await tx.book.update({
      where: { id: bookId },
      data: { availableCopies: { decrement: 1 } },
    });

    // 8. Log activity
    await tx.activityLog.create({
      data: {
        userId,
        action: "BOOK_ISSUED",
        entity: "Borrowing",
        entityId: borrowing.id,
        details: `Book issued: ${book.title}`,
      },
    });

    return borrowing;
  });
}

export async function returnBook(borrowingId: string) {
  return prisma.$transaction(async (tx) => {
    const borrowing = await tx.borrowing.findUnique({
      where: { id: borrowingId },
      include: { book: true },
    });

    if (!borrowing) throw new Error("Borrowing record not found.");
    if (borrowing.status === "RETURNED") throw new Error("Book already returned.");

    // Mark as returned
    await tx.borrowing.update({
      where: { id: borrowingId },
      data: {
        status: BorrowStatus.RETURNED,
        returnDate: new Date(),
      },
    });

    // Increase available copies
    await tx.book.update({
      where: { id: borrowing.bookId },
      data: { availableCopies: { increment: 1 } },
    });

    // Check if there is a waiting reservation → mark READY
    const waitingReservation = await tx.reservation.findFirst({
      where: {
        bookId: borrowing.bookId,
        status: ReservationStatus.PENDING,
      },
      orderBy: { createdAt: "asc" },
    });

    if (waitingReservation) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);

      await tx.reservation.update({
        where: { id: waitingReservation.id },
        data: {
          status: ReservationStatus.READY,
          expiresAt,
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: waitingReservation.userId,
          title: "Book Ready for Pickup",
          message: `"${borrowing.book.title}" is now available. Please collect within 48 hours.`,
          type: "RESERVATION_READY",
          link: `/reservations`,
        },
      });
    }

    // Log
    await tx.activityLog.create({
      data: {
        userId: borrowing.userId,
        action: "BOOK_RETURNED",
        entity: "Borrowing",
        entityId: borrowingId,
        details: `Book returned: ${borrowing.book.title}`,
      },
    });

    return { success: true };
  });
}
export async function renewBook(borrowingId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const maxRenew = parseInt(await getSetting("maxRenew", "2"));
    const loanDays = parseInt(await getSetting("loanDays", "14"));

    const borrowing = await tx.borrowing.findUnique({
      where: { id: borrowingId },
      include: { book: true },
    });

    if (!borrowing) throw new Error("Borrowing record not found.");
    if (borrowing.userId !== userId) throw new Error("Unauthorized.");
    if (borrowing.status !== "ACTIVE") throw new Error("Only active loans can be renewed.");
    if (borrowing.renewCount >= maxRenew) {
      throw new Error(`Maximum ${maxRenew} renewals allowed.`);
    }

    // Check if someone else has reserved this book
    const hasReservation = await tx.reservation.findFirst({
      where: {
        bookId: borrowing.bookId,
        status: { in: ["PENDING", "READY"] },
        userId: { not: userId },
      },
    });
    if (hasReservation) {
      throw new Error("Cannot renew – this book is reserved by another user.");
    }

    const newDueDate = new Date(borrowing.dueDate);
    newDueDate.setDate(newDueDate.getDate() + loanDays);

    const updated = await tx.borrowing.update({
      where: { id: borrowingId },
      data: {
        dueDate: newDueDate,
        renewCount: { increment: 1 },
      },
    });

    await tx.activityLog.create({
      data: {
        userId,
        action: "BOOK_RENEWED",
        entity: "Borrowing",
        entityId: borrowingId,
        details: `Renewed: ${borrowing.book.title}`,
      },
    });

    return updated;
  });
}

export async function reserveBook(userId: string, bookId: string) {
  return prisma.$transaction(async (tx) => {
    const book = await tx.book.findUnique({ where: { id: bookId } });
    if (!book) throw new Error("Book not found.");

    // Already has active loan of this book?
    const activeLoan = await tx.borrowing.findFirst({
      where: { userId, bookId, status: "ACTIVE" },
    });
    if (activeLoan) throw new Error("You already have this book on loan.");

    // Already has a pending/ready reservation?
    const existing = await tx.reservation.findFirst({
      where: {
        userId,
        bookId,
        status: { in: ["PENDING", "READY"] },
      },
    });
    if (existing) throw new Error("You already have a reservation for this book.");

    const reservation = await tx.reservation.create({
      data: {
        userId,
        bookId,
        status: "PENDING",
      },
    });

    await tx.activityLog.create({
      data: {
        userId,
        action: "BOOK_RESERVED",
        entity: "Reservation",
        entityId: reservation.id,
        details: `Reserved: ${book.title}`,
      },
    });

    return reservation;
  });
}