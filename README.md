# LibraFlow – CPI Library Management System

Official library management system for **Chattogram Polytechnic Institute (CPI)**, Bangladesh.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + SQLite (dev) / PostgreSQL (prod)
- Auth.js (NextAuth v5)
- Zod + React Hook Form
- TanStack Table + Recharts

## Roles

| Role       | Access                                      |
|------------|---------------------------------------------|
| STUDENT    | Browse, borrow, reserve, fines, profile     |
| LIBRARIAN  | Admin panel (books, borrowings, fines)      |
| ADMIN      | Full admin access                           |

## Getting Started

### 1. Install dependencies

```bash
npm install