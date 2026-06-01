export function getSiteUrl() {
  const url = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';

  return new URL(url);
}
