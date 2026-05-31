'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import {
  createUserRecord,
  deleteUserRecord,
  updateUserRoleRecord,
} from '@/lib/user-service';
import { type UserRole } from '@/lib/schema';

function parseRole(value: FormDataEntryValue | null): UserRole {
  if (value === 'admin' || value === 'user') {
    return value;
  }

  throw new Error('Invalid role');
}

export async function createUser(formData: FormData) {
  await requireAdmin();

  const username = formData.get('username');
  const password = formData.get('password');
  const role = parseRole(formData.get('role'));

  if (typeof username !== 'string' || typeof password !== 'string') {
    throw new Error('Username and password are required');
  }

  if (!username.trim() || !password.trim()) {
    throw new Error('Username and password are required');
  }

  await createUserRecord(username, password, role);
  revalidatePath('/admin/users');
}

export async function deleteUser(id: number) {
  await requireAdmin();
  await deleteUserRecord(id);
  revalidatePath('/admin/users');
}

export async function updateUserRole(id: number, role: UserRole) {
  await requireAdmin();
  await updateUserRoleRecord(id, role);
  revalidatePath('/admin/users');
}
