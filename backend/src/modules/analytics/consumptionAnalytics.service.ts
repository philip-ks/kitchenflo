import prisma from "../../lib/prisma";

export const getDailyConsumptionAnalytics =
async (
  restaurantId: string
) => {

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  const consumptionLogs =
    await prisma.consumptionLog.findMany({

      where: {

        restaurantId,

        createdAt: {
          gte: today,
          lt: tomorrow,
        },

      },

      include: {
        ingredient: true,
      },

    });

  const grouped: any = {};

  for (
    const log
    of consumptionLogs
  ) {

    if (
      !grouped[log.ingredientId]
    ) {

      grouped[log.ingredientId] = {
        ingredientId:
          log.ingredientId,

        ingredientName:
          log.ingredient.name,

        totalConsumed: 0,
      };

    }

    grouped[
      log.ingredientId
    ].totalConsumed += log.quantity;

  }

  return Object.values(grouped);

};