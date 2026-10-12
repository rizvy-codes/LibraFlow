"use client";

import { useState } from "react";
import { Search, Bell, Menu, Moon, Sun, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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

      {/* CPI Logo / Title */}
      <div className="hidden items-center gap-2 lg:flex">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
          CPI
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">
            Chattogram Polytechnic Institute
          </p>
          <p className="text-[11px] text-muted-foreground">Knowledge Builds the Nation</p>
        </div>
      </div>

      {/* Global Search */}
      <div className="relative ml-auto flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search books, authors, or categories..."
          className="h-10 pl-9 pr-16"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          Ctrl+K
        </kbd>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1">
        {/* Dark mode toggle */}
        <Button variant="ghost" size="icon" onClick={toggleDark}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]">
            3
          </Badge>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-primary text-white">RI</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">Md. Rahim Islam</span>
                <span className="text-xs text-muted-foreground">CSE 5th Semester</span>
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
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}