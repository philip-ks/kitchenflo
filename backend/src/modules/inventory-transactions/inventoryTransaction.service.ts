import prisma from "../../lib/prisma";

import { InventoryTransactionType }
from "@prisma/client";

interface CreateTransactionInput {
  ingredientId: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  type: InventoryTransactionType;
  restaurantId: string;
  referenceId?: string;
  notes?: string;
}

export const createInventoryTransaction =
async (
  data: CreateTransactionInput
) => {

  return prisma.inventoryTransaction.create({
    data,
  });

};