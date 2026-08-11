import { ChallanStatus, MovementType } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/ApiError';
import { CreateChallanRequest, UpdateChallanRequest } from '../schemas/challan.schema';

// Generate unique challan number (CH-YYYYMMDD-SEQUENTIAL)
async function generateChallanNumber(): Promise<string> {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const count = await prisma.salesChallan.count({
    where: {
      challanNumber: {
        startsWith: `CH-${date}`,
      },
    },
  });
  return `CH-${date}-${String(count + 1).padStart(4, '0')}`;
}

export async function createChallan(data: CreateChallanRequest, userId: string) {
  // Verify customer exists and is not deleted
  const customer = await prisma.customer.findUnique({
    where: { id: data.customerId },
  });

  if (!customer || customer.isDeleted) {
    throw new ApiError(404, 'Customer not found');
  }

  // Verify all products exist and are active
  const productIds = data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    throw new ApiError(404, 'One or more products not found');
  }

  const inactiveProducts = products.filter((p) => !p.isActive);
  if (inactiveProducts.length > 0) {
    throw new ApiError(400, 'One or more products are inactive');
  }

  // Create challan with items (DRAFT status, no stock deduction yet)
  const challanNumber = await generateChallanNumber();

  const challan = await prisma.salesChallan.create({
    data: {
      challanNumber,
      customerId: data.customerId,
      status: ChallanStatus.DRAFT,
      totalQuantity: data.items.reduce((sum, item) => sum + item.quantity, 0),
      createdById: userId,
      items: {
        create: data.items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          const lineTotal = product.unitPrice.mul(item.quantity);
          return {
            productId: item.productId,
            productName: product.name,
            productSku: product.sku,
            unitPrice: product.unitPrice,
            quantity: item.quantity,
            lineTotal,
          };
        }),
      },
    },
    include: {
      items: true,
      customer: true,
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return challan;
}

export async function getChallan(id: string) {
  const challan = await prisma.salesChallan.findUnique({
    where: { id },
    include: {
      items: true,
      customer: true,
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!challan) {
    throw new ApiError(404, 'Challan not found');
  }

  return challan;
}

export async function getChallans(page: number = 1, limit: number = 10, status?: string) {
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) {
    where.status = status;
  }

  const [challans, total] = await Promise.all([
    prisma.salesChallan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        customer: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.salesChallan.count({ where }),
  ]);

  return {
    challans,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function updateChallan(id: string, data: UpdateChallanRequest) {
  const challan = await getChallan(id);

  // Can only update DRAFT challans
  if (challan.status !== ChallanStatus.DRAFT) {
    throw new ApiError(400, `Cannot update ${challan.status} challan`);
  }

  // Verify all products exist and are active
  const productIds = data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    throw new ApiError(404, 'One or more products not found');
  }

  const inactiveProducts = products.filter((p) => !p.isActive);
  if (inactiveProducts.length > 0) {
    throw new ApiError(400, 'One or more products are inactive');
  }

  // Update challan and items
  const updated = await prisma.salesChallan.update({
    where: { id },
    data: {
      totalQuantity: data.items.reduce((sum, item) => sum + item.quantity, 0),
      items: {
        deleteMany: {},
        create: data.items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          const lineTotal = product.unitPrice.mul(item.quantity);
          return {
            productId: item.productId,
            productName: product.name,
            productSku: product.sku,
            unitPrice: product.unitPrice,
            quantity: item.quantity,
            lineTotal,
          };
        }),
      },
    },
    include: {
      items: true,
      customer: true,
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updated;
}

export async function cancelChallan(id: string, userId: string) {
  const challan = await getChallan(id);

  if (challan.status === ChallanStatus.CANCELLED) {
    throw new ApiError(400, 'Challan is already cancelled');
  }

  if (challan.status !== ChallanStatus.DRAFT && challan.status !== ChallanStatus.CONFIRMED) {
    throw new ApiError(400, `Cannot cancel ${challan.status} challan`);
  }

  if (challan.status === ChallanStatus.DRAFT) {
    return prisma.salesChallan.update({
      where: { id },
      data: { status: ChallanStatus.CANCELLED },
      include: {
        items: true,
        customer: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // CONFIRMED: restore stock atomically
  return prisma.$transaction(
    async (tx) => {
      for (const item of challan.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: { increment: item.quantity },
          },
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantityChanged: item.quantity,
            movementType: MovementType.IN,
            reason: `Challan ${challan.challanNumber} cancellation - stock restored`,
            createdById: userId,
          },
        });
      }

      return tx.salesChallan.update({
        where: { id },
        data: { status: ChallanStatus.CANCELLED },
        include: {
          items: true,
          customer: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    },
    { isolationLevel: 'Serializable' }
  );
}
