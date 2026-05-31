import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { accounts, users } from '../src/lib/schema';
import { createUserRecord } from '../src/lib/user-service';
import { hashPassword } from 'better-auth/crypto';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

config({ path: '.env.local' });

async function updateUserCredentials(
  userId: number,
  password: string,
  role: 'admin' | 'user',
) {
  const bcryptHash = await bcrypt.hash(password, 10);
  const authHash = await hashPassword(password);

  await db
    .update(users)
    .set({ password: bcryptHash, role })
    .where(eq(users.id, userId));

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });

  if (account) {
    await db
      .update(accounts)
      .set({ password: authHash })
      .where(eq(accounts.id, account.id));
  } else {
    await db.insert(accounts).values({
      id: randomUUID(),
      userId,
      accountId: String(userId),
      providerId: 'credential',
      password: authHash,
    });
  }
}

async function seed() {
  const username = process.env.SEED_ADMIN_USERNAME ?? 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'admin123';

  const existing = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (existing) {
    await updateUserCredentials(existing.id, password, 'admin');
    console.log(`Updated admin user "${username}" password from .env.local`);
    return;
  }

  await createUserRecord(username, password, 'admin');

  console.log(`Seeded admin user "${username}"`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
