import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { docsContentRoute, docsRoute } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

/** RSC / Link prefetch requests often omit cookies; auth must not redirect those. */
function isRscOrPrefetch(request: NextRequest) {
  return (
    request.headers.get('rsc') === '1' ||
    request.headers.get('Rsc') === '1' ||
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('Next-Router-Prefetch') === '1'
  );
}

function handleMarkdownRewrite(request: NextRequest) {
  const suffixResult = rewriteSuffix(request.nextUrl.pathname);
  if (suffixResult) {
    return NextResponse.rewrite(new URL(suffixResult, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const docsResult = rewriteDocs(request.nextUrl.pathname);
    if (docsResult) {
      return NextResponse.rewrite(new URL(docsResult, request.nextUrl));
    }
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const rewriteResponse = handleMarkdownRewrite(request);
  if (rewriteResponse) {
    return rewriteResponse;
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (isRscOrPrefetch(request)) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (pathname === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/docs', request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/sign-in')) {
    if (session) {
      return NextResponse.redirect(new URL('/docs', request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/docs')) {
    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const role = session.user.role as string | undefined;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/docs', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
