"use client";

import { useState } from "react";
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
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

type Transaction = {
  id: string;
  status: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  renewCount: number;
  bookTitle: string;
  studentName: string;
  studentId: string;
};

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "bookTitle",
    header: "Book",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.bookTitle}</p>
        <p className="text-xs text-muted-foreground font-mono">{row.original.id.slice(0, 8)}…</p>
      </div>
    ),
  },
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
    accessorKey: "issueDate",
    header: "Issued",
    cell: ({ row }) => format(new Date(row.original.issueDate), "dd MMM yyyy"),
  },
  {
    accessorKey: "dueDate",
    header: "Due",
    cell: ({ row }) => format(new Date(row.original.dueDate), "dd MMM yyyy"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      const statusMap: Record<string, "success" | "warning" | "danger" | "info"> = {
        ACTIVE: "success",
        RETURNED: "info",
        OVERDUE: "danger",
      };
      return <StatusBadge status={statusMap[s] || "default"}>{s}</StatusBadge>;
    },
  },
  {
    accessorKey: "renewCount",
    header: "Renews",
  },
];

interface Props {
  data: Transaction[];
}

export function TransactionsTable({ data }: Props) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by book or student..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.length}
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
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
    </div>
  );
}