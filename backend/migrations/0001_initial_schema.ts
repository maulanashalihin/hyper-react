import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('username', 'varchar', (col) => col.notNull().unique())
    .addColumn('email', 'varchar', (col) => col.notNull().unique())
    .addColumn('password', 'varchar', (col) => col.notNull())
    .addColumn('fullName', 'varchar')
    .addColumn('isActive', 'boolean', (col) => col.notNull().defaultTo(sql.lit('1')))
    .addColumn('createdAt', 'datetime', (col) => col.notNull().defaultTo(sql`(datetime('now'))`))
    .addColumn('updatedAt', 'datetime', (col) => col.notNull().defaultTo(sql`(datetime('now'))`))
    .addColumn('role', 'varchar', (col) => col.notNull().defaultTo('user'))
    .addColumn('emailVerified', 'boolean', (col) => col.notNull().defaultTo(sql.lit('0')))
    .addColumn('emailVerificationToken', 'varchar')
    .addColumn('emailVerificationExpires', 'datetime')
    .addColumn('resetToken', 'varchar')
    .addColumn('resetTokenExpires', 'datetime')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute()
}
