import type { Router, Request, Response } from 'hyper-express';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { usersService } from '../services/users.service';

export function setupAdminRoutes(router: Router): void {
  // All admin routes require authentication AND admin role
  router.use((req, res, next) => {
    authMiddleware(req, res).then((isValid) => {
      if (isValid) {
        next();
      }
    });
  });

  // Apply role-based middleware - only admins can access
  router.use((req, res, next) => {
    if (!requireRole(['admin'])(req, res)) {
      return;
    }
    next();
  });

  // GET /api/admin/users - Get all users (admin only)
  router.get('/users', async (req: Request, res: Response) => {
    try {
      const users = await usersService.findAll();
      return res.json({ users });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // GET /api/admin/stats - Get system stats (admin only)
  router.get('/stats', async (req: Request, res: Response) => {
    try {
      const users = await usersService.findAll();
      return res.json({
        totalUsers: users.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });
}
