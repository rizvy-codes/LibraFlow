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
  borrowingId: z.string().min(1, "Borrowing ID is required"),
});

type FormData = z.infer<typeof schema>;

export function ReturnBookForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const lookup = async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/admin/lookup/borrowing?id=${id}`);
      const data = await res.json();
      if (res.ok) {
        setInfo(data);
        toast.success("Borrowing found");
      } else {
        setInfo(null);
        toast.error(data.error || "Not found");
      }
    } catch {
      toast.error("Lookup failed");
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/borrowings/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to process return");
        return;
      }

      toast.success("Book returned successfully!");
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
      <div className="space-y-2">
        <Label htmlFor="borrowingId">Borrowing ID *</Label>
        <div className="flex gap-2">
          <Input
            id="borrowingId"
            placeholder="Paste Borrowing ID"
            {...register("borrowingId")}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const val = (document.getElementById("borrowingId") as HTMLInputElement)?.value;
              lookup(val);
            }}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {errors.borrowingId && (
          <p className="text-sm text-red-500">{errors.borrowingId.message}</p>
        )}
        {info && (
          <div className="rounded-lg border bg-muted/50 p-3 text-sm space-y-1">
            <p className="font-medium">{info.bookTitle}</p>
            <p>Student: {info.studentName} ({info.studentId})</p>
            <p>Status: {info.status} • Due: {new Date(info.dueDate).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Process Return"
        )}
      </Button>
    </form>
  );
}