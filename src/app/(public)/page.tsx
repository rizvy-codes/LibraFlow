import Link from "next/link";
import { Search, BookOpen, Zap, Users, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/Logo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ========== NAVBAR ========== */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo variant="full" theme="light" href="/" />

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary">
              Home
            </Link>
            <Link href="#books" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Books
            </Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary">
              About
            </Link>
            <Link href="#services" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Services
            </Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B2535] via-[#0a1f2c] to-[#06202e] text-white">
        {/* Background pattern / overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2535]/90 to-[#0B2535]/60" />

        <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-32">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
              Chattogram Polytechnic Institute
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Welcome to{" "}
              <span className="text-primary">LibraFlow</span>
            </h1>
            <p className="mt-4 text-lg text-white/70 md:text-xl">
              Your Gateway to Knowledge. Access thousands of books, manage your borrowings, and explore a world of learning — all in one place.
            </p>

            {/* Search bar */}
            <div className="mt-8 flex max-w-lg overflow-hidden rounded-xl bg-white shadow-lg">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for books, authors, or categories..."
                  className="h-14 border-0 pl-12 text-base text-foreground shadow-none focus-visible:ring-0"
                />
              </div>
              <Button className="h-14 rounded-none rounded-r-xl px-6">
                Search
              </Button>
            </div>

            {/* Popular chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-white/50">Popular:</span>
              {["Programming", "Database", "Computer Science", "Business"].map(
                (tag) => (
                  <button
                    key={tag}
                    className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80 transition hover:bg-white/20"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========== 4 FEATURE STRIP ========== */}
      <section className="border-b border-border bg-card py-12">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {[
            { icon: BookOpen, title: "Huge Collection", desc: "Access thousands of books across multiple categories." },
            { icon: Zap, title: "Easy Borrowing", desc: "Quick and simple book borrowing process." },
            { icon: Users, title: "Student Friendly", desc: "Designed for students, by students." },
            { icon: Shield, title: "Secure & Reliable", desc: "Your data and account are always safe." },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Placeholder for next sections */}
      <section className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">
          Featured Books, Stats, About, How It Works, Testimonials & Footer coming in the next step...
        </p>
        <Button className="mt-6" asChild>
          <Link href="/register">
            Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}