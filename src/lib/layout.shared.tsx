import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { appName } from "./shared";

type BaseOptionsArgs = {
  children?: ReactNode;
};

export function baseOptions({
  children,
}: BaseOptionsArgs = {}): BaseLayoutProps {
  return {
    nav: {
      title: appName,
      children,
    },
    links: [
      {
        type: "icon",
        url: "/auth/sign-out",
        label: "خروج",
        text: "خروج",
        icon: <LogOut className="size-4 text-red-500" />,
      },
    ],
  };
}
