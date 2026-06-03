import { getSessionCookie } from 'better-auth/cookies';
import type { NextRequest } from 'next/server';

/** Optimistic check for proxy — does not validate the token. */
export function hasSessionCookie(request: NextRequest) {
  return getSessionCookie(request) !== null;
}
