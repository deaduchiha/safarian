import { OgImage } from '@/components/og-image';
import { getOgFonts } from '@/lib/og-fonts';
import { source } from '@/lib/source';
import { appName } from '@/lib/shared';
import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: RouteContext<'/og/docs/[...slug]'>,
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const fonts = await getOgFonts();

  return new ImageResponse(
    <OgImage
      title={page.data.title}
      description={page.data.description}
      site={appName}
    />,
    {
      width: 1200,
      height: 630,
      fonts,
    },
  );
}
