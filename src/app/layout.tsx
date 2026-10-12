import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LibraFlow – CPI Library System",
    template: "%s | LibraFlow",
  },
  description:
    "Official library management system of Chattogram Polytechnic Institute. Access thousands of books, manage borrowings, and explore a world of learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "min-h-screen font-sans antialiased")}>
        {children}
      </body>
    </html>
  );
}