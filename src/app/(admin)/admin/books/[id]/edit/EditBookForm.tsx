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
  availableCopies: z.string().min(1, "Available copies is required"),
  categoryId: z.string().min(1, "Category is required"),
});

type BookForm = z.infer<typeof bookSchema>;

interface Props {
  book: BookForm & { id: string };
  categories: { id: string; name: string }[];
}

export function EditBookForm({ book, categories }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
    defaultValues: book,
  });

  const onSubmit = async (data: BookForm) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          totalCopies: parseInt(data.totalCopies),
          availableCopies: parseInt(data.availableCopies),
          publishedYear: data.publishedYear ? parseInt(data.publishedYear) : null,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Failed to update");
        return;
      }

      toast.success("Book updated!");
      router.push("/admin/books");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this book permanently? This cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/books/${book.id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Failed to delete");
        return;
      }
      toast.success("Book deleted");
      router.push("/admin/books");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Book Title *</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author *</Label>
          <Input id="author" {...register("author")} />
          {errors.author && <p className="text-sm text-red-500">{errors.author.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input id="isbn" {...register("isbn")} />
        </div>

        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            defaultValue={book.categoryId}
            onValueChange={(value) => setValue("categoryId", value)}
          >
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalCopies">Total Copies *</Label>
          <Input id="totalCopies" type="number" min="0" {...register("totalCopies")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableCopies">Available Copies *</Label>
          <Input id="availableCopies" type="number" min="0" {...register("availableCopies")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publisher">Publisher</Label>
          <Input id="publisher" {...register("publisher")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publishedYear">Published Year</Label>
          <Input id="publishedYear" type="number" {...register("publishedYear")} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={4}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("description")}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="ml-auto"
        >
          {isDeleting ? "Deleting..." : "Delete Book"}
        </Button>
      </div>
    </form>
  );
}