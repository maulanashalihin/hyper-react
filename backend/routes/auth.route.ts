import type { Router, Request, Response } from 'hyper-express';
import { authService } from '../services/auth.service';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from '../validators/auth.validator';

export function setupAuthRoutes(router: Router): void {
  // POST /api/auth/login
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const body = await req.json();
      const result = loginSchema.safeParse(body);

      if (!result.success) {
        const error = result.error.issues[0];
        return res.status(400).json({
          error: error.message,
          field: error.path[0],
        });
      }

      const authResult = await authService.login(result.data);
      return res.json({
        message: 'Login successful',
        user: {
          id: authResult.user.id,
          username: authResult.user.username,
          email: authResult.user.email,
          fullName: authResult.user.fullName,
        },
        token: authResult.token,
      });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  });

  // POST /api/auth/register
  router.post('/register', async (req: Request, res: Response) => {
    try {
      const body = await req.json();
      const result = registerSchema.safeParse(body);

      if (!result.success) {
        const error = result.error.issues[0];
        return res.status(400).json({
          error: error.message,
          field: error.path[0],
        });
      }

      const authResult = await authService.register(result.data);
      return res.status(201).json({
        message: 'Registration successful',
        user: {
          id: authResult.user.id,
          username: authResult.user.username,
          email: authResult.user.email,
          fullName: authResult.user.fullName,
        },
        token: authResult.token,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  // GET /api/auth/me (protected)
  router.get('/me', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

      if (!token) {
        return res.status(401).json({ error: 'Token required' });
      }

      const user = await authService.validateToken(token);

      if (!user) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      return res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
        },
      });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  });

  // POST /api/auth/forgot-password
  router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
      const body = await req.json();
      const result = forgotPasswordSchema.safeParse(body);

      if (!result.success) {
        const error = result.error.issues[0];
        return res.status(400).json({
          error: error.message,
          field: error.path[0],
        });
      }

      await authService.forgotPassword(result.data.email);

      // Always return success to avoid revealing if email exists
      return res.json({
        message: 'If an account exists with that email, a password reset link has been sent.',
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  // POST /api/auth/reset-password
  router.post('/reset-password', async (req: Request, res: Response) => {
    try {
      const body = await req.json();
      const result = resetPasswordSchema.safeParse(body);

      if (!result.success) {
        const error = result.error.issues[0];
        return res.status(400).json({
          error: error.message,
          field: error.path[0],
        });
      }

      await authService.resetPassword(result.data.token, result.data.newPassword);

      return res.json({
        message: 'Password has been reset successfully.',
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  // POST /api/auth/verify-email
  router.post('/verify-email', async (req: Request, res: Response) => {
    try {
      const body = await req.json();
      const result = verifyEmailSchema.safeParse(body);

      if (!result.success) {
        const error = result.error.issues[0];
        return res.status(400).json({
          error: error.message,
          field: error.path[0],
        });
      }

      const authResult = await authService.verifyEmail(result.data.token);

      if (!authResult.success) {
        return res.status(400).json({ error: authResult.message });
      }

      return res.json({ message: authResult.message });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  // POST /api/auth/resend-verification
  router.post('/resend-verification', async (req: Request, res: Response) => {
    try {
      const body = await req.json();
      const result = resendVerificationSchema.safeParse(body);

      if (!result.success) {
        const error = result.error.issues[0];
        return res.status(400).json({
          error: error.message,
          field: error.path[0],
        });
      }

      const authResult = await authService.resendVerification(result.data.email);

      if (!authResult.success) {
        // Check if it's a rate limit error
        if (authResult.message.includes('Too many verification emails')) {
          return res.status(429).json({ error: authResult.message });
        }
        return res.status(400).json({ error: authResult.message });
      }

      return res.json({ message: authResult.message });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });
}
