import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { username } from 'better-auth/plugins';
import { db } from '@/lib/db';
import * as schema from '@/lib/schema';
import { type SafeUser, type UserRole, users } from '@/lib/schema';

const baseURL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3004';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins: [baseURL],
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      users: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: 'users',
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
        required: false,
        input: false,
      },
    },
  },
  plugins: [username(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type { UserRole, SafeUser };

export function toSafeUser(user: typeof users.$inferSelect): SafeUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const userId = Number(session.user.id);
  if (Number.isNaN(userId)) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return user ? toSafeUser(user) : null;
}

export async function requireAdmin(): Promise<SafeUser> {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  return user;
}

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  return user?.role ?? null;
}
