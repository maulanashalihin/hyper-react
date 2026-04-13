import { db } from '../database/index.js';
import type { User } from '../database/types.js';

const USER_PUBLIC_FIELDS = ['id', 'username', 'email', 'fullName', 'isActive', 'createdAt', 'updatedAt'] as const;

export class UsersService {
  async findAll(): Promise<User[]> {
    return db
      .selectFrom('users')
      .select(USER_PUBLIC_FIELDS)
      .orderBy('createdAt', 'desc')
      .execute();
  }

  async findOne(id: string): Promise<User | null> {
    return db
      .selectFrom('users')
      .select(USER_PUBLIC_FIELDS)
      .where('id', '=', id)
      .executeTakeFirst() ?? null;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!user) {
      throw new Error('User not found');
    }

    await db
      .updateTable('users')
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where('id', '=', id)
      .execute();

    const updated = await db
      .selectFrom('users')
      .select(USER_PUBLIC_FIELDS)
      .where('id', '=', id)
      .executeTakeFirst();

    return updated!;
  }

  async delete(id: string): Promise<void> {
    const result = await db
      .deleteFrom('users')
      .where('id', '=', id)
      .executeTakeFirst();

    if (Number(result.numAffectedRows) === 0) {
      throw new Error('User not found');
    }
  }
}

export const usersService = new UsersService();
