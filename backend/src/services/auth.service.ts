import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/env';
import { ApiError } from '../utils/ApiError';

const prisma = new PrismaClient();

export async function authenticateUser(email: string, password: string) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // User not found
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Compare password with hash
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Generate JWT with minimal claims
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as any
  );

  // Return safe user data (no password hash)
  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as {
      userId: string;
      role: string;
    };
    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, 'Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Token expired');
    }
    throw new ApiError(401, 'Authentication failed');
  }
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  return user;
}
