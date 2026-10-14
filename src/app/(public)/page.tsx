import Link from "next/link";
import {
  Search,
  BookOpen,
  Zap,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/Logo";
import { prisma } from "@/lib/prisma";

async function getFeaturedBooks() {
  try {
    return await prisma.book.findMany({
      take: 5,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const [totalBooks, totalStudents, activeBorrowings] = await Promise.all([
      prisma.book.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.borrowing.count({ where: { status: "ACTIVE" } }),
    ]);
    return { totalBooks, totalStudents, activeBorrowings };
  } catch {
    return { totalBooks: 0, totalStudents: 0, activeBorrowings: 0 };
  }
}

export default async function HomePage() {
  const [featuredBooks, stats] = await Promise.all([
    getFeaturedBooks(),
    getStats(),
  ]);

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
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary">
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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2535]/90 to-[#0B2535]/60" />

        <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-32">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
              Chattogram Polytechnic Institute
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Welcome to <span className="text-primary">LibraFlow</span>
            </h1>
            <p className="mt-4 text-lg text-white/70 md:text-xl">
              Your Gateway to Knowledge. Access thousands of books, manage your borrowings, and explore a world of learning — all in one place.
            </p>

            <div className="mt-8 flex max-w-lg overflow-hidden rounded-xl bg-white shadow-lg">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for books, authors, or categories..."
                  className="h-14 border-0 pl-12 text-base text-foreground shadow-none focus-visible:ring-0"
                />
              </div>
              <Button className="h-14 rounded-none rounded-r-xl px-6">Search</Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-white/50">Popular:</span>
              {["Programming", "Database", "Computer Science", "Business"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== 4 FEATURES ========== */}
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

      {/* ========== FEATURED BOOKS ========== */}
      <section id="books" className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Books</h2>
            <p className="mt-1 text-muted-foreground">Popular titles from our collection</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/login">View All Books →</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {featuredBooks.length > 0 ? (
            featuredBooks.map((book) => (
              <div
                key={book.id}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary/40" />
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{book.author}</p>
                  <p className="mt-0.5 text-[11px] text-primary">{book.category.name}</p>
                  <Button size="sm" className="mt-3 w-full" asChild>
                    <Link href="/login">Borrow Now</Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No books available yet. Seed the database first.
            </p>
          )}
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className="bg-[#0B2535] py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">
                {stats.totalBooks.toLocaleString()}+
              </p>
              <p className="mt-1 text-sm text-white/60">Total Books</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">
                {stats.totalStudents.toLocaleString()}+
              </p>
              <p className="mt-1 text-sm text-white/60">Registered Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">
                {stats.activeBorrowings.toLocaleString()}+
              </p>
              <p className="mt-1 text-sm text-white/60">Active Borrowings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">98%</p>
              <p className="mt-1 text-sm text-white/60">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ABOUT ========== */}
      <section id="about" className="container mx-auto px-4 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              More Than Just a Library
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              LibraFlow is the official library management system of Chattogram Polytechnic Institute.
              We aim to make knowledge accessible, convenient, and enjoyable for everyone in our academic community.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Easy Book Search",
                "Online Reservation",
                "Borrowing History",
                "Due Date Reminders",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button className="mt-6" asChild>
              <Link href="/register">Learn More →</Link>
            </Button>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-10 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-primary" />
            <p className="mt-4 text-lg font-semibold">Books Build Better Minds</p>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Simple Steps to Get Started
            </h2>
            <p className="mt-2 text-muted-foreground">How LibraFlow works</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Register / Login", desc: "Create your account or login to your existing one." },
              { step: "02", title: "Search Books", desc: "Find your desired books using our smart search." },
              { step: "03", title: "Borrow Request", desc: "Request the book and wait for confirmation." },
              { step: "04", title: "Read & Return", desc: "Enjoy your book and return it on time." },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-border bg-card p-6 text-center shadow-sm"
              >
                <span className="text-3xl font-bold text-primary/30">{item.step}</span>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Trusted by Our Community
          </h2>
          <p className="mt-2 text-muted-foreground">What our students say</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Farhan Ahmed",
              role: "CPI Student",
              text: "LibraFlow has made it so easy to find and borrow books. The interface is simple and fast!",
            },
            {
              name: "Nusrat Jahan",
              role: "CPI Student",
              text: "I love how organized everything is. It really helps me manage my study time better.",
            },
            {
              name: "Rakib Hasan",
              role: "CPI Student",
              text: "The online reservation feature is a game changer. Highly recommended!",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <Quote className="h-8 w-8 text-primary/30" />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                “{t.text}”
              </p>
              <div className="mt-4">
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Ready to Explore Our Library?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/80">
            Join thousands of students who are already using LibraFlow.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-6"
            asChild
          >
            <Link href="/register">
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer id="contact" className="border-t border-border bg-[#0B2535] py-12 text-white">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-4">
          <div>
            <Logo variant="full" theme="dark" />
            <p className="mt-3 text-sm text-white/60">
              Empowering students with knowledge and better access to resources.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="#books" className="hover:text-white">Books</Link></li>
              <li><Link href="#about" className="hover:text-white">About</Link></li>
              <li><Link href="/login" className="hover:text-white">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Useful Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li><Link href="/login" className="hover:text-white">My Account</Link></li>
              <li><Link href="#" className="hover:text-white">Borrowing Guide</Link></li>
              <li><Link href="#" className="hover:text-white">Library Rules</Link></li>
              <li><Link href="#" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Contact Us</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li>Chattogram Polytechnic Institute</li>
              <li>Chattogram, Bangladesh</li>
              <li>libraflow@cpi.edu.bd</li>
              <li>+880 31 250 1234</li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto mt-10 border-t border-white/10 px-4 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} LibraFlow. All rights reserved. | Chattogram Polytechnic Institute
        </div>
      </footer>
    </div>
  );
}