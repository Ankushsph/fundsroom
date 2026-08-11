import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
};

// Validate critical environment variables
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

if (!config.jwt.secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
