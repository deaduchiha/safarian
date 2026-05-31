import { RootProvider } from 'fumadocs-ui/provider/next';
import { Vazirmatn } from 'next/font/google';
import { fumadocsI18n } from '@/lib/fumadocs-i18n';
import './global.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-sans',
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={vazirmatn.variable}
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
