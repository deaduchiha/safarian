'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

type UserNavProps = {
  username: string;
};

export function UserNav({ username }: UserNavProps) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/sign-in');
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">{username}</span>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        خروج
      </Button>
    </div>
  );
}
