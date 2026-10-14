"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, BookMarked, CalendarCheck } from "lucide-react";
import { toast } from "sonner";

interface Props {
  bookId: string;
  availableCopies: number;
}

export function BorrowActions({ bookId, availableCopies }: Props) {
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isReserving, setIsReserving] = useState(false);

  const handleBorrow = async () => {
    setIsBorrowing(true);
    try {
      // Will be connected to real API in Task 7
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Borrow request submitted! (API coming in next task)");
    } catch {
      toast.error("Failed to borrow book");
    } finally {
      setIsBorrowing(false);
    }
  };

  const handleReserve = async () => {
    setIsReserving(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Reservation placed! (API coming in next task)");
    } catch {
      toast.error("Failed to reserve book");
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