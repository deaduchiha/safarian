import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { fumadocsI18n } from '@/lib/fumadocs-i18n';
import { arad } from '@/lib/fonts';
import { getSiteUrl } from '@/lib/site-url';
import './global.css';

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={arad.variable}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col font-sans">
        <RootProvider dir="rtl" i18n={fumadocsI18n}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
