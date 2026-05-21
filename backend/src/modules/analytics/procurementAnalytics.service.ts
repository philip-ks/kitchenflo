import prisma from "../../lib/prisma";

export const getProcurementRecommendations =
async (
  restaurantId: string
) => {

  const ingredients =
    await prisma.ingredient.findMany({

      where: {
        restaurantId,
      },

    });

  const recommendations = [];

  for (
    const ingredient
    of ingredients
  ) {

    const consumptionLogs =
      await prisma.consumptionLog.findMany({

        where: {
          restaurantId,
          ingredientId: ingredient.id,
        },

      });

    const totalConsumed =
      consumptionLogs.reduce(
        (sum, log) =>
          sum + log.quantity,
        0
      );

    const averageDailyConsumption =
      totalConsumed / 7;

    const daysRemaining =
      averageDailyConsumption > 0
        ? ingredient.currentStock
          / averageDailyConsumption
        : 999;

    const recommendedPurchaseQuantity =
      averageDailyConsumption * 7;

    recommendations.push({

      ingredientId:
        ingredient.id,

      ingredientName:
        ingredient.name,

      currentStock:
        ingredient.currentStock,

      minimumStock:
        ingredient.minimumStock,

      averageDailyConsumption,

      daysRemaining,

      recommendedPurchaseQuantity,

    });

  }

  return recommendations.sort(
    (a, b) =>
      a.daysRemaining
      - b.daysRemaining
  );

};