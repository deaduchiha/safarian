import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: LayoutProps<"/docs">) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return children;
}
