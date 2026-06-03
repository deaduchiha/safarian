import Link from "next/link";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { getCurrentUser } from "@/lib/auth";
import { appName } from "@/lib/shared";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.role !== "admin") {
    redirect("/docs");
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="font-semibold">مدیریت {appName}</span>
          <nav className="flex gap-4">
            <Link href="/admin/users" className="text-sm font-medium">
              کاربران
            </Link>
            <Link
              href="/docs"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              مستندات
            </Link>
          </nav>
        </div>
        <UserNav username={user.username} />
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
