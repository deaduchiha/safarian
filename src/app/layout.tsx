import { RootProvider } from 'fumadocs-ui/provider/next';
import { fumadocsI18n } from '@/lib/fumadocs-i18n';
import { arad } from '@/lib/fonts';
import './global.css';

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
