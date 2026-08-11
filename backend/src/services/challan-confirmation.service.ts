import { PrismaClient, ChallanStatus, MovementType } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

const prisma = new PrismaClient();

export async function confirmChallan(challanId: string) {
  // Use transaction for atomic operations
  const result = await prisma.$transaction(
    async (tx) => {
      // 1. Get challan and verify it exists and is DRAFT
      const challan = await tx.salesChallan.findUnique({
        where: { id: challanId },
        include: { items: true },
      });

      if (!challan) {
        throw new ApiError(404, 'Challan not found');
      }

      if (challan.status !== ChallanStatus.DRAFT) {
        throw new ApiError(400, `Cannot confirm ${challan.status} challan. Only DRAFT challans can be confirmed.`);
      }

      if (challan.items.length === 0) {
        throw new ApiError(400, 'Cannot confirm challan with no items');
      }

      // 2. For each item, verify product has sufficient stock
      // We do this in a loop and check product within the transaction
      const productsToDeduct: Array<{ productId: string; quantity: number; sku: string; name: string }> = [];

      for (const item of challan.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new ApiError(404, `Product ${item.productId} not found`);
        }

        if (!product.isActive) {
          throw new ApiError(400, `Product ${product.sku} is inactive`);
        }

        // Check current stock
        if (product.currentStock < item.quantity) {
          throw new ApiError(
            400,
            `Insufficient stock for ${product.sku}. Available: ${product.currentStock}, Requested: ${item.quantity}`
          );
        }

        productsToDeduct.push({
          productId: product.id,
          quantity: item.quantity,
          sku: product.sku,
          name: product.name,
        });
      }

      // 3. Atomic stock deduction using raw SQL to prevent race conditions
      // This ensures the update only happens if stock is still sufficient

      for (const item of productsToDeduct) {
        // Use raw SQL for conditional update that cannot fail silently
        const updateResult = await tx.$executeRaw`
          UPDATE "products"
          SET "currentStock" = "currentStock" - ${item.quantity},
              "updatedAt" = NOW()
          WHERE "id" = ${item.productId}
          AND "currentStock" >= ${item.quantity}
          AND "isActive" = true
        `;

        // If zero rows were updated, it means stock is insufficient (race condition or earlier failure)
        if (updateResult === 0) {
          throw new ApiError(
            400,
            `Stock check failed for ${item.sku}. This may indicate concurrent confirmation or insufficient stock.`
          );
        }
      }

      // 4. Create STOCK OUT movement records for each deducted item
      const movements = [];

      for (const item of productsToDeduct) {
        const movement = await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantityChanged: item.quantity,
            movementType: MovementType.OUT,
            reason: `Challan ${challan.challanNumber} confirmation`,
            createdById: challan.createdById,
          },
        });

        movements.push(movement);
      }

      // 5. Update challan status to CONFIRMED and set confirmedAt timestamp
      const confirmedChallan = await tx.salesChallan.update({
        where: { id: challanId },
        data: {
          status: ChallanStatus.CONFIRMED,
          confirmedAt: new Date(),
        },
        include: {
          items: true,
          customer: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return {
        challan: confirmedChallan,
        movements,
      };
    },
    {
      // Use serializable isolation level to prevent race conditions
      isolationLevel: 'Serializable',
    }
  );

  return result.challan;
}
