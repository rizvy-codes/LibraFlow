import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BorrowActions } from "./BorrowActions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!book) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/browse"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Browse
      </Link>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {/* Cover placeholder */}
        <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-card">
          <BookOpen className="h-20 w-20 text-primary/40" />
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-primary">{book.category.name}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{book.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">by {book.author}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <StatusBadge status={book.availableCopies > 0 ? "success" : "danger"}>
              {book.availableCopies > 0
                ? `${book.availableCopies} of ${book.totalCopies} available`
                : "Currently unavailable"}
            </StatusBadge>
            {book.isbn && (
              <span className="rounded-full border px-3 py-0.5 text-xs text-muted-foreground">
                ISBN: {book.isbn}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {book.publisher && (
              <div>
                <p className="text-muted-foreground">Publisher</p>
                <p className="font-medium">{book.publisher}</p>
              </div>
            )}
            {book.publishedYear && (
              <div>
                <p className="text-muted-foreground">Published Year</p>
                <p className="font-medium">{book.publishedYear}</p>
              </div>
            )}
          </div>

          {book.description && (
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {book.description}
              </p>
            </div>
          )}

          {/* Borrow / Reserve actions */}
          <BorrowActions
            bookId={book.id}
            availableCopies={book.availableCopies}
          />
        </div>
      </div>
    </div>
  );
}