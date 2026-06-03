import { and, eq, gt } from 'drizzle-orm';
import { headers } from 'next/headers';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { username } from 'better-auth/plugins';
import { db } from '@/lib/db';
import * as schema from '@/lib/schema';
import { getVerifiedSessionToken } from '@/lib/session-token';
import { type SafeUser, type UserRole, sessions, users } from '@/lib/schema';

const baseURL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';
const productionOrigins = ['https://pc.nikode.ir', 'https://www.pc.nikode.ir'];
const trustedOrigins = Array.from(new Set([baseURL, ...productionOrigins]));
const baseHost = new URL(baseURL).hostname;
const usesProductionHost =
  baseHost === 'pc.nikode.ir' || baseHost.endsWith('.pc.nikode.ir');

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins,
  advanced: {
    ...(usesProductionHost
      ? {
          crossSubDomainCookies: {
            enabled: true,
            domain: 'pc.nikode.ir',
          },
        }
      : {}),
  },
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
  session: {
    // Avoid session refresh writes during RSC/proxy; prevents cookie churn in Next.js.
    deferSessionRefresh: true,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
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

async function getUserById(userId: number): Promise<SafeUser | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user ? toSafeUser(user) : null;
}

async function getUserFromSessionToken(token: string): Promise<SafeUser | null> {
  const row = await db.query.sessions.findFirst({
    where: and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())),
  });
  if (!row) {
    return null;
  }
  return getUserById(row.userId);
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const headersList = await headers();
  const cookieHeader = headersList.get('cookie') ?? '';
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!cookieHeader || !secret) {
    return null;
  }

  // Cookie cache — read-only, never clears cookies on failure.
  const { getCookieCache } = await import('better-auth/cookies');
  const cached = await getCookieCache(
    new Request(baseURL, { headers: { cookie: cookieHeader } }),
    { secret },
  );
  if (cached?.user?.id) {
    const userId = Number(cached.user.id);
    if (!Number.isNaN(userId)) {
      const user = await getUserById(userId);
      if (user) {
        return user;
      }
    }
  }

  // DB lookup from signed session cookie — never call auth.api.getSession here;
  // getSession sends Set-Cookie headers that delete the session when lookup fails.
  const token = await getVerifiedSessionToken(cookieHeader, secret);
  if (!token) {
    return null;
  }

  return getUserFromSessionToken(token);
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
