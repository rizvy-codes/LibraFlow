"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Fine = {
  id: string;
  amount: number;
  status: string;
  reason: string | null;
  waivedReason: string | null;
  createdAt: string;
  studentName: string;
  studentId: string;
  bookTitle: string;
  paidAt: string | null;
};

const columns: ColumnDef<Fine>[] = [
  {
    accessorKey: "studentName",
    header: "Student",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.studentName}</p>
        <p className="text-xs text-muted-foreground">{row.original.studentId}</p>
      </div>
    ),
  },
  {
    accessorKey: "bookTitle",
    header: "Book",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `৳${row.original.amount.toFixed(2)}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      const map: Record<string, "success" | "danger" | "info"> = {
        PAID: "success",
        PENDING: "danger",
        WAIVED: "info",
      };
      return <StatusBadge status={map[s] || "default"}>{s}</StatusBadge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.createdAt), "dd MMM yyyy"),
  },
];

interface Props {
  data: Fine[];
}

export function FinesTable({ data }: Props) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
  const [action, setAction] = useState<"pay" | "waive" | null>(null);
  const [waiveReason, setWaiveReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredData =
    statusFilter === "all"
      ? data
      : data.filter((f) => f.status === statusFilter);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const handleAction = async () => {
    if (!selectedFine || !action) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/fines/${selectedFine.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          waivedReason: action === "waive" ? waiveReason : undefined,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Action failed");
        return;
      }
      toast.success(
        action === "pay" ? "Payment recorded" : "Fine waived successfully"
      );
      setSelectedFine(null);
      setAction(null);
      setWaiveReason("");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search student or book..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="WAIVED">Waived</option>
        </select>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  <TableCell>
                    {row.original.status === "PENDING" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedFine(row.original);
                            setAction("pay");
                          }}
                        >
                          Record Payment
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedFine(row.original);
                            setAction("waive");
                          }}
                        >
                          Waive
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  No fines found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {filteredData.length}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog
        open={!!selectedFine && !!action}
        onOpenChange={() => {
          setSelectedFine(null);
          setAction(null);
          setWaiveReason("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "pay" ? "Record Payment" : "Waive Fine"}
            </DialogTitle>
          </DialogHeader>
          {selectedFine && (
            <div className="space-y-4">
              <p className="text-sm">
                <strong>{selectedFine.studentName}</strong> — ৳
                {selectedFine.amount.toFixed(2)} for{" "}
                <em>{selectedFine.bookTitle}</em>
              </p>
              {action === "waive" && (
                <div className="space-y-2">
                  <Label>Reason for waiving *</Label>
                  <Input
                    value={waiveReason}
                    onChange={(e) => setWaiveReason(e.target.value)}
                    placeholder="e.g. Special consideration by principal"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedFine(null);
                setAction(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={isLoading || (action === "waive" && !waiveReason.trim())}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : action === "pay" ? (
                "Confirm Payment"
              ) : (
                "Confirm Waive"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}