'use client';

import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

/** Must be a button — never use a GET link to sign out (Next.js prefetches links and clears the session). */
export function SignOutButton() {
  async function handleSignOut() {
    await signOut();
    window.location.assign('/sign-in');
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      title="خروج"
      aria-label="خروج"
      onClick={handleSignOut}
    >
      <LogOut className="size-4 text-red-500" />
    </Button>
  );
}
