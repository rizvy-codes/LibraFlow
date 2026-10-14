"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  publishedYear: z.string().optional(),
  description: z.string().optional(),
  totalCopies: z.string().min(1, "Total copies is required"),
  categoryId: z.string().min(1, "Category is required"),
});

type BookForm = z.infer<typeof bookSchema>;

interface Category {
  id: string;
  name: string;
}

interface AddBookFormProps {
  categories: Category[];
}

export function AddBookForm({ categories }: AddBookFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      totalCopies: "1",
    },
  });

  const onSubmit = async (data: BookForm) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          totalCopies: parseInt(data.totalCopies),
          publishedYear: data.publishedYear ? parseInt(data.publishedYear) : null,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to add book");
        return;
      }

      toast.success("Book added successfully!");
      router.push("/admin/books");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Title */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Book Title *</Label>
          <Input id="title" placeholder="e.g. Clean Code" {...register("title")} />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="author">Author *</Label>
          <Input id="author" placeholder="e.g. Robert C. Martin" {...register("author")} />
          {errors.author && <p className="text-sm text-red-500">{errors.author.message}</p>}
        </div>

        {/* ISBN */}
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input id="isbn" placeholder="978-..." {...register("isbn")} />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select onValueChange={(value) => setValue("categoryId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId.message}</p>
          )}
        </div>

        {/* Total Copies */}
        <div className="space-y-2">
          <Label htmlFor="totalCopies">Total Copies *</Label>
          <Input
            id="totalCopies"
            type="number"
            min="1"
            {...register("totalCopies")}
          />
          {errors.totalCopies && (
            <p className="text-sm text-red-500">{errors.totalCopies.message}</p>
          )}
        </div>

        {/* Publisher */}
        <div className="space-y-2">
          <Label htmlFor="publisher">Publisher</Label>
          <Input id="publisher" placeholder="Publisher name" {...register("publisher")} />
        </div>

        {/* Published Year */}
        <div className="space-y-2">
          <Label htmlFor="publishedYear">Published Year</Label>
          <Input
            id="publishedYear"
            type="number"
            placeholder="e.g. 2008"
            {...register("publishedYear")}
          />
        </div>

        {/* Description */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={4}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Short description of the book..."
            {...register("description")}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Book"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}