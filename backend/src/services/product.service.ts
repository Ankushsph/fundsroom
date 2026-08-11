import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { ApiError } from '../utils/ApiError';
import { CreateProductRequest, UpdateProductRequest } from '../schemas/product.schema';

const prisma = new PrismaClient();

export async function getProducts(
  page: number = 1,
  limit: number = 10,
  search?: string,
  active?: boolean
) {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (active !== undefined) {
    where.isActive = active;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return product;
}

export async function createProduct(data: CreateProductRequest) {
  // Check for duplicate SKU
  const existingProduct = await prisma.product.findUnique({
    where: { sku: data.sku },
  });

  if (existingProduct) {
    throw new ApiError(409, 'Product with this SKU already exists');
  }

  const product = await prisma.product.create({
    data: {
      ...data,
      unitPrice: new Decimal(typeof data.unitPrice === 'string' ? data.unitPrice : data.unitPrice.toString()),
    },
  });

  return product;
}

export async function updateProduct(id: string, data: UpdateProductRequest) {
  await getProductById(id);

  const updateData: any = { ...data };

  // Convert unitPrice to Decimal if provided
  if (updateData.unitPrice !== undefined) {
    updateData.unitPrice = new Decimal(
      typeof updateData.unitPrice === 'string' ? updateData.unitPrice : updateData.unitPrice.toString()
    );
  }

  const updated = await prisma.product.update({
    where: { id },
    data: updateData,
  });

  return updated;
}

export async function deleteProduct(id: string) {
  await getProductById(id);

  // Mark as inactive instead of hard delete to preserve history
  const deleted = await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  return deleted;
}
