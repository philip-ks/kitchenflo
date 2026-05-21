import prisma from "../../lib/prisma";

export const getLowStockIngredients =
async (
  restaurantId: string
) => {

  const ingredients =
    await prisma.ingredient.findMany({

      where: {

        restaurantId,

        currentStock: {
          lte:
            prisma.ingredient.fields
              .minimumStock,
        },

      },

      orderBy: {
        currentStock: "asc",
      },

    });

  return ingredients;

};