import { getSessionCookie } from 'better-auth/cookies';
import { getWebcryptoSubtle } from '@better-auth/utils';

const hmacAlgorithm = { name: 'HMAC', hash: 'SHA-256' };

async function verifySignedCookieValue(
  cookieValue: string,
  secret: string,
): Promise<string | null> {
  const signatureStartPos = cookieValue.lastIndexOf('.');
  if (signatureStartPos < 1) {
    return null;
  }

  const signedValue = cookieValue.substring(0, signatureStartPos);
  const signature = cookieValue.substring(signatureStartPos + 1);
  if (signature.length !== 44 || !signature.endsWith('=')) {
    return null;
  }

  try {
    const key = await getWebcryptoSubtle().importKey(
      'raw',
      new TextEncoder().encode(secret),
      hmacAlgorithm,
      false,
      ['verify'],
    );
    const signatureBinStr = atob(signature);
    const signatureBytes = new Uint8Array(signatureBinStr.length);
    for (let i = 0; i < signatureBinStr.length; i++) {
      signatureBytes[i] = signatureBinStr.charCodeAt(i);
    }
    const valid = await getWebcryptoSubtle().verify(
      hmacAlgorithm,
      key,
      signatureBytes,
      new TextEncoder().encode(signedValue),
    );
    return valid ? signedValue : null;
  } catch {
    return null;
  }
}

/** Extract and verify the session token from a Cookie header (no side effects). */
export async function getVerifiedSessionToken(
  cookieHeader: string,
  secret: string | undefined,
): Promise<string | null> {
  if (!secret || !cookieHeader) {
    return null;
  }

  const raw = getSessionCookie(
    new Request('http://localhost', { headers: { cookie: cookieHeader } }),
  );
  if (!raw) {
    return null;
  }

  return verifySignedCookieValue(decodeURIComponent(raw), secret);
}
