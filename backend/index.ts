import 'dotenv/config';
import HyperExpress from 'hyper-express';
import { initializeDatabase } from './database/index.js';
import { runMigrations } from './database/migration-runner.js';
import { setupAuthRoutes } from './routes/auth.route';
import { setupUsersRoutes } from './routes/users.route';
import { setupAdminRoutes } from './routes/admin.route';
import { env, validateEnv } from './config/env';

async function bootstrap(): Promise<void> {
  try {
    validateEnv();

    await initializeDatabase();
    await runMigrations();

    // Create HyperExpress server
    const server = new HyperExpress.Server();

    // CORS middleware - with next() callback
    server.use((req, res, next) => {
      const origin = req.headers['origin'] || '';
      
      // Allow all localhost ports for development
      if (origin.match(/^http:\/\/localhost:\d+$/)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      // Handle preflight OPTIONS request - end here
      if (req.method === 'OPTIONS') {
        res.status(204).send();
        return; // Don't call next()
      }
      
      // Continue to next middleware/route
      next();
    });

    // Request logging - with next()
    server.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });

    // Health check endpoint
    server.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // API Routes
    const apiRouter = new HyperExpress.Router();
    setupAuthRoutes(apiRouter);
    server.use('/api/auth', apiRouter);

    const usersRouter = new HyperExpress.Router();
    setupUsersRoutes(usersRouter);
    server.use('/api/users', usersRouter);

    const adminRouter = new HyperExpress.Router();
    setupAdminRoutes(adminRouter);
    server.use('/api/admin', adminRouter);

    // Start server
    await server.listen(env.PORT);
    console.log(`🚀 Server is running on http://localhost:${env.PORT}`);
    console.log(`   Environment: ${env.NODE_ENV}`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

export default bootstrap;
