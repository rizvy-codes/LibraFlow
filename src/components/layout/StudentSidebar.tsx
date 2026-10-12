"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  CalendarCheck,
  History,
  Wallet,
  User,
  ScrollText,
  HelpCircle,
  Phone,
  ChevronLeft,
} from "lucide-react";

const mainNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Browse Books", href: "/browse", icon: BookOpen },
  { name: "My Borrowed Books", href: "/borrowed", icon: BookMarked },
  { name: "Reservations", href: "/reservations", icon: CalendarCheck },
  { name: "Reading History", href: "/history", icon: History },
  { name: "Fines & Payments", href: "/fines", icon: Wallet },
  { name: "Profile", href: "/profile", icon: User },
];

const quickLinks = [
  { name: "Library Rules", href: "/rules", icon: ScrollText },
  { name: "Help & Support", href: "/help", icon: HelpCircle },
  { name: "Contact Library", href: "/contact", icon: Phone },
];

interface StudentSidebarProps {
  onClose?: () => void;
}

export function StudentSidebar({ onClose }: StudentSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col bg-gradient-to-b from-[#0B2535] to-[#0a1f2c] text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-5">
        <Logo variant="full" theme="dark" href="/dashboard" />
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {mainNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          );
        })}

        {/* Quick Links */}
        <div className="pt-6">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            Quick Links
          </p>
          {quickLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Quote at bottom */}
      <div className="border-t border-white/10 p-4">
        <p className="text-xs italic leading-relaxed text-white/50">
          “A book is a dream you hold in your hands.”
        </p>
        <p className="mt-1 text-[10px] text-white/30">— Neil Gaiman</p>
      </div>
    </aside>
  );
}