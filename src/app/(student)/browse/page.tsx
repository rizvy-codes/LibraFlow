import { prisma } from "@/lib/prisma";
import { BrowseBooksClient } from "./BrowseBooksClient";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function BrowseBooksPage() {
  const [books, categories] = await Promise.all([
    prisma.book.findMany({
      include: { category: true },
      orderBy: { title: "asc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const serializedBooks = books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    category: book.category.name,
    categoryId: book.categoryId,
    availableCopies: book.availableCopies,
    totalCopies: book.totalCopies,
  }));

  return (
    <div>
      <PageHeader
        title="Browse Books"
        description="Explore our collection and find your next read"
      />
      <BrowseBooksClient
        books={serializedBooks}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}