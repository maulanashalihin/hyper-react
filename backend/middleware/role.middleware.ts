import type { Request, Response } from 'hyper-express';

/**
 * Role-based middleware factory
 * 
 * Creates middleware that checks if the user has one of the allowed roles.
 * Must be used AFTER authMiddleware (requires req.user to be set).
 * 
 * @param roles - Array of allowed roles (e.g., ['admin'], ['user', 'admin'])
 * @returns Middleware function
 * 
 * @example
 * // Protect admin-only routes
 * router.get('/admin/users', requireRole(['admin']), handler);
 * 
 * @example
 * // Protect routes for both user and admin
 * router.get('/profile', requireRole(['user', 'admin']), handler);
 */
export function requireRole(roles: string[]) {
  return function (req: Request, res: Response): boolean {
    const userRole = req.user?.role;

    if (!userRole) {
      res.status(403).json({ error: 'Access denied: Role information missing' });
      return false;
    }

    if (!roles.includes(userRole)) {
      res.status(403).json({ error: 'Access denied: Insufficient permissions' });
      return false;
    }

    return true;
  };
}
