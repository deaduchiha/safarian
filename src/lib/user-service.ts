import { asc } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { type UserRole, accounts, users } from '@/lib/schema';

function placeholderEmail(username: string) {
  return `${username.toLowerCase()}@safarian.local`;
}

export async function createUserRecord(
  username: string,
  password: string,
  role: UserRole,
) {
  const normalizedUsername = username.trim();
  const bcryptHash = await bcrypt.hash(password, 10);
  const authHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      username: normalizedUsername,
      password: bcryptHash,
      role,
      name: normalizedUsername,
      email: placeholderEmail(normalizedUsername),
    })
    .returning({ id: users.id });

  await db.insert(accounts).values({
    id: randomUUID(),
    userId: user.id,
    accountId: String(user.id),
    providerId: 'credential',
    password: authHash,
  });

  return user.id;
}

export async function deleteUserRecord(id: number) {
  await db.delete(users).where(eq(users.id, id));
}

export async function updateUserRoleRecord(id: number, role: UserRole) {
  await db.update(users).set({ role }).where(eq(users.id, id));
}

export async function listUsers() {
  return db
    .select({
      id: users.id,
      username: users.username,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(asc(users.createdAt));
}
