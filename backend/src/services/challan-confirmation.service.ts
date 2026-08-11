import { ChallanStatus, MovementType } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/ApiError';

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

      // 3. Atomic transition of challan status from DRAFT to CONFIRMED
      // This prevents double-confirmation if concurrent requests target the same challan
      const updatedChallanCount = await tx.$executeRaw`
        UPDATE "sales_challans"
        SET "status" = 'CONFIRMED'::"ChallanStatus",
            "confirmedAt" = NOW(),
            "updatedAt" = NOW()
        WHERE "id" = ${challanId}
        AND "status" = 'DRAFT'::"ChallanStatus"
      `;

      if (updatedChallanCount === 0) {
        throw new ApiError(400, 'Challan is no longer in DRAFT status or is being processed by another transaction');
      }

      // 4. Atomic stock deduction using raw SQL to prevent negative stock or race conditions
      for (const item of productsToDeduct) {
        const updateResult = await tx.$executeRaw`
          UPDATE "products"
          SET "currentStock" = "currentStock" - ${item.quantity},
              "updatedAt" = NOW()
          WHERE "id" = ${item.productId}
          AND "currentStock" >= ${item.quantity}
          AND "isActive" = true
        `;

        if (updateResult === 0) {
          throw new ApiError(
            400,
            `Stock check failed for ${item.sku}. This may indicate concurrent confirmation or insufficient stock.`
          );
        }
      }

      // 5. Create STOCK OUT movement records for each deducted item
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

      // 6. Fetch confirmed challan details
      const confirmedChallan = await tx.salesChallan.findUniqueOrThrow({
        where: { id: challanId },
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
