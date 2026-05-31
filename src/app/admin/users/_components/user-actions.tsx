'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteUser, updateUserRole } from '../actions';

type UserActionsProps = {
  userId: number;
  role: 'user' | 'admin';
};

export function UserActions({ userId, role }: UserActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteUser(userId);
      setDeleteOpen(false);
    });
  }

  function handleToggleRole() {
    const nextRole = role === 'admin' ? 'user' : 'admin';

    startTransition(async () => {
      await updateUserRole(userId, nextRole);
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={handleToggleRole}
      >
        {role === 'admin' ? 'تبدیل به کاربر' : 'تبدیل به مدیر'}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() => setDeleteOpen(true)}
      >
        حذف
      </Button>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف کاربر</DialogTitle>
            <DialogDescription>
              این عملیات قابل بازگشت نیست. کاربر برای همیشه حذف خواهد شد.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              انصراف
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              {isPending ? 'در حال حذف...' : 'حذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
