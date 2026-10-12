"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  List,
  FolderOpen,
  Users,
  User,
  Shield,
  ArrowLeftRight,
  Clock,
  AlertTriangle,
  Wallet,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";

const navGroups = [
  {
    title: null, // Dashboard alone
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Books",
    items: [
      { name: "Add Book", href: "/admin/books/add", icon: PlusCircle },
      { name: "All Books", href: "/admin/books", icon: List },
      { name: "Categories", href: "/admin/categories", icon: FolderOpen },
    ],
  },
  {
    title: "Users",
    items: [
      { name: "Students", href: "/admin/users/students", icon: User },
      { name: "Librarians", href: "/admin/users/librarians", icon: Users },
      { name: "Roles & Permissions", href: "/admin/users/roles", icon: Shield },
    ],
  },
  {
    title: "Borrowing & Returns",
    items: [
      { name: "All Transactions", href: "/admin/borrowings", icon: ArrowLeftRight },
      { name: "Pending Returns", href: "/admin/borrowings/pending", icon: Clock },
      { name: "Overdue Books", href: "/admin/borrowings/overdue", icon: AlertTriangle },
    ],
  },
  {
    title: "Fines & Payments",
    items: [
      { name: "All Fines", href: "/admin/fines", icon: Wallet },
      { name: "Payment Records", href: "/admin/payments", icon: CreditCard },
    ],
  },
  {
    title: "Reports",
    items: [
      { name: "Library Reports", href: "/admin/reports", icon: FileText },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: null,
    items: [
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>([
    "Books",
    "Users",
    "Borrowing & Returns",
    "Fines & Payments",
    "Reports",
  ]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-[#0B2535] text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <Logo variant="full" theme="dark" href="/admin/dashboard" />
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="px-4 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-1">
            {group.title ? (
              <>
                <button
                  onClick={() => toggleGroup(group.title!)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-white/80"
                >
                  {group.title}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openGroups.includes(group.title!) && "rotate-180"
                    )}
                  />
                </button>

                {openGroups.includes(group.title!) && (
                  <div className="ml-1 space-y-0.5 border-l border-white/10 pl-2">
                    {group.items.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-primary text-white"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              group.items.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                  </Link>
                );
              })
            )}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-4">
        <p className="text-[10px] text-white/40">
          Chattogram Polytechnic Institute
        </p>
        <p className="text-[10px] text-white/30">Knowledge Builds the Nation</p>
      </div>
    </aside>
  );
}