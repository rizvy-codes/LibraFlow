import { prisma } from "@/lib/prisma";
import { AddBookForm } from "./AddBooksForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AddBookPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Add New Book"
        description="Add a new book to the library collection"
      />
      <AddBookForm categories={categories} />
    </div>
  );
}