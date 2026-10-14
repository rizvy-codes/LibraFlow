"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, BookMarked, CalendarCheck } from "lucide-react";
import { toast } from "sonner";

interface Props {
  bookId: string;
  availableCopies: number;
}

export function BorrowActions({ bookId, availableCopies }: Props) {
  const router = useRouter();
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isReserving, setIsReserving] = useState(false);

  const handleBorrow = async () => {
    setIsBorrowing(true);
    try {
      const res = await fetch("/api/borrowings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to borrow book");
        return;
      }

      toast.success("Book borrowed successfully!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsBorrowing(false);
    }
  };

  const handleReserve = async () => {
    setIsReserving(true);
    try {
      // Reserve API will be added next
      toast.info("Reservation feature coming in next step");
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      {availableCopies > 0 ? (
        <Button onClick={handleBorrow} disabled={isBorrowing} size="lg">
          {isBorrowing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <BookMarked className="mr-2 h-4 w-4" />
              Borrow Book
            </>
          )}
        </Button>
      ) : (
        <Button onClick={handleReserve} disabled={isReserving} size="lg" variant="secondary">
          {isReserving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CalendarCheck className="mr-2 h-4 w-4" />
              Reserve Book
            </>
          )}
        </Button>
      )}
    </div>
  );
}