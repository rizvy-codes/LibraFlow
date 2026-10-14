import { prisma } from "@/lib/prisma";
import { BooksTable } from "./BooksTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Serialize for client component
  const serializedBooks = books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    category: book.category.name,
    totalCopies: book.totalCopies,
    availableCopies: book.availableCopies,
    createdAt: book.createdAt.toISOString(),
  }));

  return (
    <div>
      <PageHeader
        title="All Books"
        description="Manage the library book collection"
      >
        <Button asChild>
          <Link href="/admin/books/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Link>
        </Button>
      </PageHeader>

      <BooksTable data={serializedBooks} />
    </div>
  );
}