import { Kysely } from 'kysely';
import { GenericSqliteDialect, parseBigInt } from 'kysely-generic-sqlite';
import type { IGenericSqlite } from 'kysely-generic-sqlite';
import Database from 'better-sqlite3';
import { join } from 'path';
import type { Database as DB } from './types.js';

const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';
const databasePath = isTest
  ? ':memory:'
  : join(process.env.DATABASE_PATH || 'data', 'database.sqlite');

const sqliteDb = new Database(databasePath);

// Enable WAL mode and optimize for high write throughput
sqliteDb.pragma('journal_mode = WAL');
sqliteDb.pragma('synchronous = NORMAL');
sqliteDb.pragma('cache_size = -64000'); // 64MB cache
sqliteDb.pragma('temp_store = memory');
sqliteDb.pragma('foreign_keys = ON');
sqliteDb.pragma('busy_timeout = 5000'); // 5 seconds timeout for concurrent access

console.log('SQLite WAL mode enabled for high write throughput');

function createSqliteExecutor(db: Database.Database): IGenericSqlite<Database.Database> {
  const getStmt = (sql: string) => db.prepare(sql);

  return {
    db,
    query: (_isSelect, sql, parameters) => {
      const stmt = getStmt(sql);
      if (stmt.reader) {
        return { rows: stmt.all(parameters) };
      }
      const { changes, lastInsertRowid } = stmt.run(parameters);
      return {
        rows: [],
        numAffectedRows: parseBigInt(changes),
        insertId: parseBigInt(lastInsertRowid),
      };
    },
    close: () => db.close(),
    iterator: (isSelect, sql, parameters) => {
      if (!isSelect) {
        throw new Error('Only support select in stream()');
      }
      return getStmt(sql).iterate(parameters) as any;
    },
  };
}

export const db = new Kysely<DB>({
  dialect: new GenericSqliteDialect(() => createSqliteExecutor(sqliteDb)),
});

export async function initializeDatabase(): Promise<void> {
  try {
    // Simple check to ensure database is accessible
    sqliteDb.prepare('SELECT 1').get();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  await db.destroy();
  sqliteDb.close();
}