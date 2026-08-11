import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { prisma } from './lib/prisma';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import productRoutes from './routes/product.routes';
import inventoryRoutes from './routes/inventory.routes';
import challanRoutes from './routes/challan.routes';

const app = express();

app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Fundsroom ERP API Server',
    health: '/api/health',
  });
});

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: 'Fundsroom ERP API is running',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      database: 'connected',
    });
  } catch {
    res.status(503).json({
      success: false,
      message: 'Fundsroom ERP API is running but database is unavailable',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      database: 'disconnected',
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/challans', challanRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} (${config.nodeEnv})`);
});

const shutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
