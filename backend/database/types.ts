import { Generated, Insertable, Selectable, Updateable } from 'kysely';

/**
 * User table interface
 * Matches the schema from the original TypeORM entity
 */
export interface UserTable {
  id: Generated<string>;
  username: string;
  email: string;
  password: string;
  fullName: string | null;
  isActive: boolean;
  role: 'user' | 'admin';
  emailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpires: Date | null;
  resetToken: string | null;
  resetTokenExpires: Date | null;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

/**
 * Migrations tracking table
 */
export interface MigrationTable {
  id: Generated<number>;
  name: string;
  executedAt: Generated<Date>;
}

/**
 * Database interface - defines all tables in the database
 */
export interface Database {
  users: UserTable;
  migrations: MigrationTable;
}

/**
 * Type aliases for common user operations
 */
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
