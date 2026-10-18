"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Search, Menu, Moon, Sun, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { NotificationBell } from "@/components/layout/NotificationBell";

interface StudentTopbarProps {
  onMenuClick: () => void;
}

export function StudentTopbar({ onMenuClick }: StudentTopbarProps) {
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-md lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* CPI Branding */}
      <div className="hidden items-center gap-2 lg:flex">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
          CPI
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">
            Chattogram Polytechnic Institute
          </p>
          <p className="text-[11px] text-muted-foreground">
            Knowledge Builds the Nation
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative ml-auto flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search books, authors, or categories..."
          className="h-10 pl-9 pr-16"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:flex">
          Ctrl+K
        </kbd>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Dark mode */}
        <Button variant="ghost" size="icon" onClick={toggleDark}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notifications */}
        <NotificationBell />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full outline-none ring-offset-background transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-white">
                  RI
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">Md. Rahim Islam</span>
                <span className="text-xs text-muted-foreground">
                  CSE 5th Semester
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}