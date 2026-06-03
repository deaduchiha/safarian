import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { NextRequest, NextResponse } from 'next/server';
import { hasSessionCookie } from '@/lib/auth-cookie';
import { docsContentRoute, docsRoute } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

function isRscOrPrefetch(request: NextRequest) {
  if (request.nextUrl.searchParams.has('_rsc')) {
    return true;
  }

  const secFetchDest = request.headers.get('sec-fetch-dest');
  const secFetchMode = request.headers.get('sec-fetch-mode');

  return (
    request.headers.get('rsc') === '1' ||
    request.headers.get('Rsc') === '1' ||
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('Next-Router-Prefetch') === '1' ||
    request.headers.get('purpose') === 'prefetch' ||
    (secFetchMode === 'cors' && secFetchDest === 'empty')
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

  // Legacy GET /auth/sign-out used to sign users out when Next.js prefetched the docs nav link.
  if (pathname.startsWith('/auth/sign-out')) {
    return NextResponse.redirect(new URL('/docs', request.url));
  }

  if (isRscOrPrefetch(request)) {
    return NextResponse.next();
  }

  // Cookie-only checks (Better Auth docs). Never call auth.api.getSession here —
  // a failed lookup sends Set-Cookie headers that DELETE the session cookie.
  const hasCookie = hasSessionCookie(request);

  if (pathname === '/') {
    if (hasCookie) {
      return NextResponse.redirect(new URL('/docs', request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/sign-in')) {
    if (hasCookie) {
      return NextResponse.redirect(new URL('/docs', request.url));
    }

    return NextResponse.next();
  }

  // /docs and /admin: real validation in route layouts only
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
