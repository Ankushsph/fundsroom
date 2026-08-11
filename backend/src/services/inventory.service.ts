import { MovementType } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/ApiError';
import { StockInRequest, StockOutRequest } from '../schemas/inventory.schema';

export async function addStockIn(data: StockInRequest, userId: string) {
  // Verify product exists and is active
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (!product.isActive) {
    throw new ApiError(400, 'Cannot add stock to an inactive product');
  }

  // Use transaction to atomically update stock and create movement record
  const result = await prisma.$transaction(async (tx) => {
    // Update product stock
    const updated = await tx.product.update({
      where: { id: data.productId },
      data: {
        currentStock: {
          increment: data.quantity,
        },
      },
    });

    // Create stock movement record
    const movement = await tx.stockMovement.create({
      data: {
        productId: data.productId,
        quantityChanged: data.quantity,
        movementType: MovementType.IN,
        reason: data.reason,
        createdById: userId,
      },
    });

    return { updated, movement };
  });

  return result;
}

export async function addStockOut(data: StockOutRequest, userId: string) {
  // Verify product exists and is active
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (!product.isActive) {
    throw new ApiError(400, 'Cannot remove stock from an inactive product');
  }

  // Check if sufficient stock
  if (product.currentStock < data.quantity) {
    throw new ApiError(400, `Insufficient stock. Available: ${product.currentStock}, Requested: ${data.quantity}`);
  }

  // Use transaction to atomically verify, update stock, and create movement record
  const result = await prisma.$transaction(async (tx) => {
    const updateResult = await tx.$executeRaw`
      UPDATE "products"
      SET "currentStock" = "currentStock" - ${data.quantity},
          "updatedAt" = NOW()
      WHERE "id" = ${data.productId}
      AND "currentStock" >= ${data.quantity}
      AND "isActive" = true
    `;

    if (updateResult === 0) {
      throw new ApiError(400, 'Insufficient stock for this product');
    }

    const updated = await tx.product.findUniqueOrThrow({
      where: { id: data.productId },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId: data.productId,
        quantityChanged: data.quantity,
        movementType: MovementType.OUT,
        reason: data.reason,
        createdById: userId,
      },
    });

    return { updated, movement };
  });

  return result;
}

export async function getStockMovementHistory(
  productId: string,
  page: number = 1,
  limit: number = 10
) {
  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const skip = (page - 1) * limit;

  const [movements, total] = await Promise.all([
    prisma.stockMovement.findMany({
      where: { productId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { id: true, name: true, sku: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.stockMovement.count({ where: { productId } }),
  ]);

  return {
    movements,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAllStockMovements(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [movements, total] = await Promise.all([
    prisma.stockMovement.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { id: true, name: true, sku: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.stockMovement.count(),
  ]);

  return {
    movements,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
