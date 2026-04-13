import { db } from '../database/index.js';
import type { User, UserUpdate } from '../database/types.js';

type PublicUser = Pick<User, 'id' | 'username' | 'email' | 'fullName' | 'isActive' | 'createdAt' | 'updatedAt'>;

const USER_PUBLIC_FIELDS: readonly (keyof PublicUser)[] = ['id', 'username', 'email', 'fullName', 'isActive', 'createdAt', 'updatedAt'] as const;

export class UsersService {
  async findAll(): Promise<PublicUser[]> {
    return db
      .selectFrom('users')
      .select(USER_PUBLIC_FIELDS)
      .orderBy('createdAt', 'desc')
      .execute() as Promise<PublicUser[]>;
  }

  async findOne(id: string): Promise<PublicUser | null> {
    const result = await db
      .selectFrom('users')
      .select(USER_PUBLIC_FIELDS)
      .where('id', '=', id)
      .executeTakeFirst();
    return (result ?? null) as PublicUser | null;
  }

  async update(id: string, data: Partial<UserUpdate>): Promise<PublicUser> {
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
      .set({ ...data, updatedAt: new Date().toISOString() as any })
      .where('id', '=', id)
      .execute();

    const updated = await db
      .selectFrom('users')
      .select(USER_PUBLIC_FIELDS)
      .where('id', '=', id)
      .executeTakeFirst();

    return updated as PublicUser;
  }

  async delete(id: string): Promise<void> {
    await db
      .deleteFrom('users')
      .where('id', '=', id)
      .execute();
  }
}

export const usersService = new UsersService();
