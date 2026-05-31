import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listUsers } from '@/lib/user-service';
import { CreateUserDialog } from './_components/create-user-dialog';
import { UserActions } from './_components/user-actions';

const roleLabels = {
  admin: 'مدیر',
  user: 'کاربر',
} as const;

export default async function AdminUsersPage() {
  const users = await listUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">کاربران</h1>
          <p className="text-sm text-muted-foreground">
            مدیریت حساب‌ها و نقش‌های کاربران
          </p>
        </div>
        <CreateUserDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>شناسه</TableHead>
            <TableHead>نام کاربری</TableHead>
            <TableHead>نقش</TableHead>
            <TableHead>تاریخ ایجاد</TableHead>
            <TableHead className="text-end">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{roleLabels[user.role]}</TableCell>
              <TableCell>
                {user.createdAt.toLocaleDateString('fa-IR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell>
                <UserActions userId={user.id} role={user.role} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
