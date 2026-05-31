import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'node:path';
import * as schema from './schema';

const databaseFile = process.env.DATABASE_URL?.replace(/^\.\//, '') ?? 'sqlite.db';
const resolvedPath = path.join(/* turbopackIgnore: true */ process.cwd(), databaseFile);

const sqlite = new Database(resolvedPath);

sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
