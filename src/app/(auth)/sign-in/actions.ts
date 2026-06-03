'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function signInAction(
  _prevState: { error?: string; ok?: boolean } | null,
  formData: FormData,
) {
  const username = formData.get('username');
  const password = formData.get('password');

  if (typeof username !== 'string' || typeof password !== 'string') {
    return { error: 'نام کاربری و رمز عبور الزامی است' };
  }

  if (!username.trim() || !password.trim()) {
    return { error: 'نام کاربری و رمز عبور الزامی است' };
  }

  try {
    await auth.api.signInUsername({
      body: {
        username: username.trim(),
        password,
      },
      headers: await headers(),
    });
  } catch {
    return { error: 'نام کاربری یا رمز عبور اشتباه است' };
  }

  // Client uses full page navigation so cookies are committed before /docs loads.
  return { ok: true };
}
