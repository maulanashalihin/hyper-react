import type { Request, Response } from 'hyper-express';
import { authService } from '../services/auth.service';
import type { User } from '../database/types.js';

declare module 'hyper-express' {
  interface Request {
    user?: User;
  }
}

export async function authMiddleware(
  req: Request,
  res: Response
): Promise<boolean> {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      res.status(401).json({ error: 'Authorization header required' });
      return false;
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    const user = await authService.validateToken(token);

    if (!user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return false;
    }

    req.user = user;
    return true;
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
    return false;
  }
}
