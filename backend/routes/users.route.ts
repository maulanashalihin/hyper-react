import type { Router, Request, Response } from 'hyper-express';
import { usersService } from '../services/users.service';
import { authMiddleware } from '../middleware/auth.middleware';

export function setupUsersRoutes(router: Router): void {
  // All users routes are protected
  router.use((req, res, next) => {
    authMiddleware(req, res).then((isValid) => {
      if (isValid) {
        next();
      }
    });
  });

  // GET /api/users - Get all users
  router.get('/', async (req: Request, res: Response) => {
    try {
      const users = await usersService.findAll();
      return res.json({ users });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // GET /api/users/:id - Get user by ID
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await usersService.findOne(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({ user });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // PUT /api/users/:id - Update user
  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await req.json();

      const user = await usersService.update(id, data);
      return res.json({ user });
    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  });

  // DELETE /api/users/:id - Delete user
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await usersService.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  });
}
