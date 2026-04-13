import 'dotenv/config';

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || '7d') as any,
  DATABASE_PATH: process.env.DATABASE_PATH || 'database.sqlite',
};

export function validateEnv(): void {
  if (env.NODE_ENV === 'production' && env.JWT_SECRET === 'your-secret-key-change-in-production') {
    throw new Error('JWT_SECRET must be set in production environment');
  }
}
