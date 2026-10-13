import { PrismaClient, Role, BorrowStatus, ReservationStatus, FineStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.fine.deleteMany();
  await prisma.borrowing.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.otpToken.deleteMany();
  await prisma.book.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Admin
  const admin = await prisma.user.create({
    data: {
      name: "Md. Tanvir Hasan",
      email: "admin@cpi.edu.bd",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Librarians
  await prisma.user.createMany({
    data: [
      {
        name: "Fatima Begum",
        email: "librarian1@cpi.edu.bd",
        password: hashedPassword,
        role: Role.LIBRARIAN,
      },
      {
        name: "Karim Uddin",
        email: "librarian2@cpi.edu.bd",
        password: hashedPassword,
        role: Role.LIBRARIAN,
      },
    ],
  });

  // Students (sample)
  const students = await Promise.all(
    [
      { name: "Md. Rahim Islam", studentId: "2023-0543", email: "rahim@student.cpi.edu.bd", department: "CSE", semester: "5th" },
      { name: "Sadia Akter", studentId: "2022-0678", email: "sadia@student.cpi.edu.bd", department: "CSE", semester: "6th" },
      { name: "Tanjim Hasan", studentId: "2021-0321", email: "tanjim@student.cpi.edu.bd", department: "EEE", semester: "7th" },
      { name: "Mehedi Hasan", studentId: "2023-0765", email: "mehedi@student.cpi.edu.bd", department: "CSE", semester: "4th" },
      { name: "Nusrat Jahan", studentId: "2022-0442", email: "nusrat@student.cpi.edu.bd", department: "Civil", semester: "5th" },
    ].map((s) =>
      prisma.user.create({
        data: {
          ...s,
          password: hashedPassword,
          role: Role.STUDENT,
        },
      })
    )
  );

  // Categories
  const categories = await Promise.all(
    [
      "Programming",
      "Computer Science",
      "Engineering",
      "Business",
      "Science",
      "Mathematics",
      "Literature",
      "History",
      "Electronics",
      "Others",
    ].map((name) => prisma.category.create({ data: { name } }))
  );

  // Books
  const booksData = [
    { title: "Clean Code", author: "Robert C. Martin", category: "Programming", copies: 5 },
    { title: "Design Patterns", author: "Erich Gamma", category: "Programming", copies: 3 },
    { title: "Database System Concepts", author: "Abraham Silberschatz", category: "Computer Science", copies: 4 },
    { title: "Operating System Concepts", author: "Abraham Silberschatz", category: "Computer Science", copies: 4 },
    { title: "Computer Networks", author: "Tanenbaum & Wetherall", category: "Computer Science", copies: 3 },
    { title: "Data Structures and Algorithms", author: "Seymour Lipschutz", category: "Computer Science", copies: 5 },
    { title: "Introduction to Algorithms", author: "CLRS", category: "Computer Science", copies: 2 },
    { title: "The Pragmatic Programmer", author: "Hunt & Thomas", category: "Programming", copies: 3 },
    { title: "Refactoring", author: "Martin Fowler", category: "Programming", copies: 2 },
    { title: "Discrete Mathematics", author: "Rosen", category: "Mathematics", copies: 4 },
  ];

  const books = [];
  for (const b of booksData) {
    const cat = categories.find((c) => c.name === b.category)!;
    const book = await prisma.book.create({
      data: {
        title: b.title,
        author: b.author,
        totalCopies: b.copies,
        availableCopies: b.copies,
        categoryId: cat.id,
        isbn: `978-${Math.floor(Math.random() * 10000000000)}`,
      },
    });
    books.push(book);
  }

  // Settings
  await prisma.setting.createMany({
    data: [
      { key: "loanDays", value: "14" },
      { key: "maxRenew", value: "2" },
      { key: "maxBooks", value: "3" },
      { key: "finePerDay", value: "5" },
    ],
  });

  // Sample borrowings
  const now = new Date();
  await prisma.borrowing.create({
    data: {
      userId: students[0].id,
      bookId: books[0].id,
      issueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
      status: BorrowStatus.ACTIVE,
    },
  });

  console.log("Seed completed!");
  console.log("Admin login: admin@cpi.edu.bd / password123");
  console.log("Student login: rahim@student.cpi.edu.bd / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });