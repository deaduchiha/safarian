import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  serverExternalPackages: [
    'better-sqlite3',
    'better-auth',
    'kysely',
    '@better-auth/core',
    '@better-auth/kysely-adapter',
  ],
};

export default withMDX(config);
