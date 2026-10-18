import Link from "next/link";
import { Plus, Undo2, BookOpen, Users, Wallet, FileText } from "lucide-react";

const actions = [
  { label: "Add Book", href: "/admin/books/add", icon: Plus },
  { label: "Record Borrowing", href: "/admin/borrowings/issue", icon: BookOpen },
  { label: "Process Return", href: "/admin/borrowings/return", icon: Undo2 },
  { label: "Manage Fines", href: "/admin/fines", icon: Wallet },
  { label: "All Students", href: "/admin/users/students", icon: Users },
  { label: "All Books", href: "/admin/books", icon: FileText },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 font-semibold">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center transition hover:bg-accent hover:text-accent-foreground"
          >
            <a.icon className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}