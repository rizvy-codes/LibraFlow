import { Logo } from "@/components/shared/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Hero Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#0B2535] to-[#0a1f2c] p-10 text-white lg:flex">
        <div>
          <Logo variant="full" theme="dark" href="/" />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Your Gateway to<br />
            <span className="text-primary">Knowledge</span>
          </h1>
          <p className="max-w-md text-white/70">
            Access thousands of books, manage your borrowings, and explore a world of learning — all in one place.
          </p>

          <div className="space-y-3 text-sm text-white/60">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">📚</div>
              Online Book Search
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">⚡</div>
              Easy Borrowing
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">🎓</div>
              Students & Staff
            </div>
          </div>
        </div>

        <p className="text-sm italic text-white/40">
          “A library is a hospital for the mind.” — Anonymous
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex w-full flex-col items-center justify-center bg-background p-6 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}