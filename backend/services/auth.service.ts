import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../database/index.js';
import type { User } from '../database/types.js';
import { env } from '../config/env';
import { emailService } from './email.service';
import { randomBytes, randomUUID } from 'crypto';

const SALT_ROUNDS = 10;

const verificationRateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

interface VerifyEmailResult {
  success: boolean;
  message: string;
}

interface ResendVerificationResult {
  success: boolean;
  message: string;
  rateLimitRemaining?: number;
}

export class AuthService {
  async login(loginDto: LoginRequest): Promise<{ user: User; token: string }> {
    const { username, password } = loginDto;

    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirst();

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  async register(registerDto: RegisterRequest): Promise<{ user: User; token: string }> {
    const { username, email, password, fullName } = registerDto;

    const existingUser = await db
      .selectFrom('users')
      .selectAll()
      .where((eb) => eb.or([eb('username', '=', username), eb('email', '=', email)]))
      .executeTakeFirst();

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const id = randomUUID();

    const user = await db
      .insertInto('users')
      .values({
        id,
        username,
        email,
        password: hashedPassword,
        fullName: fullName ?? null,
        role: 'user',
        isActive: true,
        emailVerified: false,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const token = this.generateToken(user);
    const verificationToken = randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await db
      .updateTable('users')
      .set({
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      })
      .where('id', '=', user.id)
      .execute();

    emailService.sendVerification(email, verificationToken).catch((err) => {
      console.error('Failed to send verification email:', err);
    });

    emailService.sendWelcome(email).catch((err) => {
      console.error('Failed to send welcome email:', err);
    });

    return { user, token };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
      return await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', payload.userId)
        .executeTakeFirst() ?? null;
    } catch {
      return null;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user) {
      return;
    }

    const resetToken = randomUUID();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await db
      .updateTable('users')
      .set({
        resetToken,
        resetTokenExpires,
      })
      .where('id', '=', user.id)
      .execute();

    await emailService.sendPasswordReset(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('resetToken', '=', token)
      .executeTakeFirst();

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    if (!user.resetTokenExpires || new Date(user.resetTokenExpires) < new Date()) {
      throw new Error('Reset token has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await db
      .updateTable('users')
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      })
      .where('id', '=', user.id)
      .execute();
  }

  async verifyEmail(token: string): Promise<VerifyEmailResult> {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('emailVerificationToken', '=', token)
      .executeTakeFirst();

    if (!user) {
      return { success: false, message: 'Invalid verification token' };
    }

    if (!user.emailVerificationExpires || new Date(user.emailVerificationExpires) < new Date()) {
      await db
        .updateTable('users')
        .set({
          emailVerificationToken: null,
          emailVerificationExpires: null,
        })
        .where('id', '=', user.id)
        .execute();
      return { success: false, message: 'Verification token has expired' };
    }

    await db
      .updateTable('users')
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      })
      .where('id', '=', user.id)
      .execute();

    return { success: true, message: 'Email verified successfully' };
  }

  async resendVerification(email: string): Promise<ResendVerificationResult> {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user) {
      return { success: true, message: 'If an account exists with that email, a verification email has been sent.' };
    }

    if (user.emailVerified) {
      return { success: false, message: 'Email is already verified' };
    }

    const now = Date.now();
    const rateLimitEntry = verificationRateLimitMap.get(email);

    if (rateLimitEntry) {
      if (now > rateLimitEntry.resetTime) {
        rateLimitEntry.count = 1;
        rateLimitEntry.resetTime = now + 60 * 60 * 1000;
      } else {
        if (rateLimitEntry.count >= 3) {
          const remainingTime = Math.ceil((rateLimitEntry.resetTime - now) / 60000);
          return {
            success: false,
            message: `Too many verification emails. Please try again in ${remainingTime} minute(s).`,
          };
        }
        rateLimitEntry.count++;
      }
    } else {
      verificationRateLimitMap.set(email, {
        count: 1,
        resetTime: now + 60 * 60 * 1000,
      });
    }

    const verificationToken = randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await db
      .updateTable('users')
      .set({
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      })
      .where('id', '=', user.id)
      .execute();

    emailService.sendVerification(email, verificationToken).catch((err) => {
      console.error('Failed to send verification email:', err);
    });

    return { success: true, message: 'Verification email sent successfully' };
  }

  private generateToken(user: Pick<User, 'id' | 'username' | 'email' | 'role'>): string {
    return jwt.sign(
      { userId: user.id, username: user.username, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
  }
}

export const authService = new AuthService();
