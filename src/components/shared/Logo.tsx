import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  variant?: "full" | "icon";
  theme?: "light" | "dark";
  className?: string;
  href?: string;
}

export function Logo({
  variant = "full",
  theme = "light",
  className,
  href = "/",
}: LogoProps) {
  const isDark = theme === "dark";

  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Book icon */}
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          isDark ? "bg-primary text-white" : "bg-primary text-white"
        )}
      >
        <BookOpen className="h-5 w-5" />
      </div>

      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "text-lg font-bold tracking-tight",
              isDark ? "text-white" : "text-navy"
            )}
          >
            Libra
            <span className="text-primary">Flow</span>
          </span>
          <span
            className={cn(
              "text-[11px] font-medium",
              isDark ? "text-white/70" : "text-muted-foreground"
            )}
          >
            CPI Library System
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Link href={href} className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
      {content}
    </Link>
  );
}