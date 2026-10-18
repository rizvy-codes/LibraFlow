import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { EditBookForm } from "./EditBookForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: Props) {
  const { id } = await params;

  const [book, categories] = await Promise.all([
    prisma.book.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!book) notFound();

  return (
    <div>
      <PageHeader
        title="Edit Book"
        description={`Editing: ${book.title}`}
      />
      <EditBookForm
        book={{
          id: book.id,
          title: book.title,
          author: book.author,
          isbn: book.isbn || "",
          publisher: book.publisher || "",
          publishedYear: book.publishedYear?.toString() || "",
          description: book.description || "",
          totalCopies: book.totalCopies.toString(),
          availableCopies: book.availableCopies.toString(),
          categoryId: book.categoryId,
        }}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}