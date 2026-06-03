import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
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
  };
}
