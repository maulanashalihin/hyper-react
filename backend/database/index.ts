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
sqliteDb.pragma('foreign_keys = ON');

function createSqliteExecutor(db: Database): IGenericSqlite<Database> {
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
    await db.selectFrom('sqlite_master').select('type').executeTakeFirst();
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