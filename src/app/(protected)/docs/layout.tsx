import { getCurrentUser } from "@/lib/auth";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

export default async function Layout({ children }: LayoutProps<"/docs">) {
  const user = await getCurrentUser();

  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions({
        children: user ? (
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            {user.username}
          </span>
        ) : null,
      })}
    >
      {children}
    </DocsLayout>
  );
}
