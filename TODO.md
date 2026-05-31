Build a Next.js 16 (App Router) application with the following setup.
I already have all packages installed.

## Tech Stack
- Next.js 16.2 (App Router, Turbopack)
- Better Auth for authentication (self-hosted, no third party)
- Drizzle ORM + SQLite (better-sqlite3) for database
- Fumadocs MDX (non-RSC version) for documentation
- Tailwind CSS + shadcn/ui for UI
- TypeScript

## Important Next.js 16 Notes
- Use proxy.ts instead of middleware.ts for route protection (Next.js 16 replaced middleware with proxy)
- Use the new caching APIs (use cache) instead of old fetch cache options
- Turbopack is the default bundler, do not change this

## Project Structure
app/
├── (auth)/
│   └── sign-in/
│       └── page.tsx            # Login page
├── (protected)/
│   ├── layout.tsx              # Auth guard layout
│   └── docs/
│       └── [[...slug]]/
│           └── page.tsx        # Fumadocs pages
├── admin/
│   ├── layout.tsx              # Admin-only guard
│   └── users/
│       └── page.tsx            # User management page
├── layout.tsx                  # Root layout
└── proxy.ts                    # Route protection (Next.js 16)

lib/
├── auth.ts                     # Better Auth config
├── db.ts                       # Drizzle + SQLite connection
└── schema.ts                   # Drizzle schema

content/
└── docs/                       # MDX doc files

## Database Schema (Drizzle + SQLite)
- users table:
  - id (integer, primary key, autoincrement)
  - username (text, unique, not null)
  - password (text, not null) — bcrypt hashed
  - role (text, default 'user') — 'user' | 'admin'
  - createdAt (integer timestamp)

- sessions table: (handled by Better Auth automatically)

## Authentication (Better Auth)
- Setup Better Auth with username + password credentials
- No social login needed
- Session stored in SQLite via Drizzle adapter
- Helper function: getCurrentUser() — returns user from session
- Helper function: requireAdmin() — throws if user is not admin

## Route Protection (proxy.ts)
- /docs/* → redirect to /sign-in if no valid session
- /admin/* → redirect to /docs if session exists but role !== 'admin'
- / → redirect to /docs if already signed in

## Sign-In Page (/)
- Centered on screen
- App title above the form
- Username + password inputs
- Submit button
- Show error message on invalid credentials
- On success redirect to /docs
- No sign-up page — only admins can create users

## Docs (/docs)
- Setup Fumadocs MDX non-RSC version
- Content lives in /content/docs folder
- Auto-generated sidebar from file structure
- Show logged-in username and sign-out button in top navbar

## Admin Panel (/admin/users)
- Only accessible to users with role === 'admin'
- List all users from SQLite using Drizzle (id, username, role, createdAt)
- Create user: dialog form with username + password fields, role selector
- Delete user: confirm dialog before deleting
- Promote/demote user: toggle role between 'user' and 'admin'
- Use shadcn/ui Table, Dialog, Button, Input, Select components
- All actions are Next.js Server Actions with 'use server'

## Server Actions
Create these in app/admin/users/actions.ts:
- createUser(username, password, role) — hash password with bcrypt, insert to db
- deleteUser(id) — delete from db
- updateUserRole(id, role) — update role in db
- All actions should revalidatePath('/admin/users') after mutation

## UI Design
- Clean minimal design
- Sign-in page: centered card with title
- Docs layout: left sidebar (Fumadocs default) + top navbar with username + sign out
- Admin layout: top navbar with "Users" link + sign out button
- Use shadcn/ui components throughout

## Environment Variables (.env.local)
BETTER_AUTH_SECRET=your_random_secret_here
DATABASE_URL=./sqlite.db

## Notes
- No Clerk, no external auth service — everything self-hosted
- Passwords must be hashed with bcrypt before storing
- Never return password field from any server action or API
- Use Drizzle's db.select() / db.insert() / db.update() / db.delete() syntax
- Run drizzle-kit push to sync schema to SQLite
