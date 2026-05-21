import prisma from "../../lib/prisma";

interface CreateConsumptionInput {
  ingredientId: string;
  quantity: number;
  restaurantId: string;
  orderId?: string;
}

export const createConsumptionLog =
async (
  data: CreateConsumptionInput
) => {

  return prisma.consumptionLog.create({
    data,
  });

};