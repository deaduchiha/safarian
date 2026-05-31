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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createUser } from '../actions';

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set('role', role);

    startTransition(async () => {
      try {
        await createUser(formData);
        setOpen(false);
        setRole('user');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ایجاد کاربر ناموفق بود');
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>ایجاد کاربر</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد کاربر</DialogTitle>
          <DialogDescription>
            کاربر جدید با نام کاربری و رمز عبور اضافه کنید.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">نام کاربری</Label>
            <Input id="username" name="username" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">رمز عبور</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">نقش</Label>
            <Select value={role} onValueChange={(value: 'user' | 'admin') => setRole(value)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="انتخاب نقش" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">کاربر</SelectItem>
                <SelectItem value="admin">مدیر</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'در حال ایجاد...' : 'ایجاد'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
