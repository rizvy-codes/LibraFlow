"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  bookId: z.string().min(1, "Book ID is required"),
});

type FormData = z.infer<typeof schema>;

export function IssueBookForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [bookInfo, setBookInfo] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Lookup student by Student ID
  const lookupStudent = async (studentId: string) => {
    if (!studentId) return;
    try {
      const res = await fetch(`/api/admin/lookup/student?studentId=${studentId}`);
      const data = await res.json();
      if (res.ok) {
        setStudentInfo(data);
        toast.success(`Found: ${data.name}`);
      } else {
        setStudentInfo(null);
        toast.error(data.error || "Student not found");
      }
    } catch {
      toast.error("Lookup failed");
    }
  };

  // Lookup book by ID or title (simple ID for now)
  const lookupBook = async (bookId: string) => {
    if (!bookId) return;
    try {
      const res = await fetch(`/api/admin/lookup/book?id=${bookId}`);
      const data = await res.json();
      if (res.ok) {
        setBookInfo(data);
        toast.success(`Found: ${data.title}`);
      } else {
        setBookInfo(null);
        toast.error(data.error || "Book not found");
      }
    } catch {
      toast.error("Lookup failed");
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/borrowings/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to issue book");
        return;
      }

      toast.success("Book issued successfully!");
      router.push("/admin/borrowings");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      {/* Student ID */}
      <div className="space-y-2">
        <Label htmlFor="studentId">Student ID *</Label>
        <div className="flex gap-2">
          <Input
            id="studentId"
            placeholder="e.g. 2023-0543"
            {...register("studentId")}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const val = (document.getElementById("studentId") as HTMLInputElement)?.value;
              lookupStudent(val);
            }}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {errors.studentId && (
          <p className="text-sm text-red-500">{errors.studentId.message}</p>
        )}
        {studentInfo && (
          <div className="rounded-lg border bg-muted/50 p-3 text-sm">
            <p className="font-medium">{studentInfo.name}</p>
            <p className="text-muted-foreground">
              {studentInfo.email} • {studentInfo.department || "N/A"}
            </p>
          </div>
        )}
      </div>

      {/* Book ID */}
      <div className="space-y-2">
        <Label htmlFor="bookId">Book ID *</Label>
        <div className="flex gap-2">
          <Input
            id="bookId"
            placeholder="Paste Book ID from All Books page"
            {...register("bookId")}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const val = (document.getElementById("bookId") as HTMLInputElement)?.value;
              lookupBook(val);
            }}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {errors.bookId && (
          <p className="text-sm text-red-500">{errors.bookId.message}</p>
        )}
        {bookInfo && (
          <div className="rounded-lg border bg-muted/50 p-3 text-sm">
            <p className="font-medium">{bookInfo.title}</p>
            <p className="text-muted-foreground">
              {bookInfo.author} • Available: {bookInfo.availableCopies}
            </p>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Issuing...
          </>
        ) : (
          "Issue Book"
        )}
      </Button>
    </form>
  );
}