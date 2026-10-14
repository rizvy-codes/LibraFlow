"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, BookOpen, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  categoryId: string;
  availableCopies: number;
  totalCopies: number;
};

type Category = {
  id: string;
  name: string;
};

interface Props {
  books: Book[];
  categories: Category[];
}

export function BrowseBooksClient({ books, categories }: Props) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || book.categoryId === categoryFilter;

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && book.availableCopies > 0) ||
        (availabilityFilter === "unavailable" && book.availableCopies === 0);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [books, search, categoryFilter, availabilityFilter]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Out of stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredBooks.length} of {books.length} books
      </p>

      {/* Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md"
            >
              <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5">
                <BookOpen className="h-12 w-12 text-primary/40" />
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                  {book.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{book.author}</p>
                <p className="mt-0.5 text-[11px] text-primary">{book.category}</p>

                <div className="mt-2">
                  <StatusBadge
                    status={book.availableCopies > 0 ? "success" : "danger"}
                  >
                    {book.availableCopies > 0
                      ? `${book.availableCopies} available`
                      : "Out of stock"}
                  </StatusBadge>
                </div>

                <Button size="sm" className="mt-3 w-full" asChild>
                  <Link href={`/browse/${book.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          No books match your filters.
        </div>
      )}
    </div>
  );
}