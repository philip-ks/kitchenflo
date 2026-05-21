import prisma from "../../lib/prisma";

export const calculateRecipeCost =
async (
  recipeId: string
) => {

  const recipeIngredients =
    await prisma.recipeIngredient.findMany({

      where: {
        recipeId,
      },

      include: {
        ingredient: true,
      },

    });

  let totalCost = 0;

  for (
    const recipeIngredient
    of recipeIngredients
  ) {

    const ingredientCost =
      recipeIngredient.quantity
      * recipeIngredient
          .ingredient
          .costPerUnit;

    totalCost += ingredientCost;

  }

  return totalCost;

};

export const calculateMenuItemProfitability =
async (
  menuItemId: string
) => {

  const menuItem =
    await prisma.menuItem.findUnique({

      where: {
        id: menuItemId,
      },

      include: {
        recipe: true,
      },

    });

  if (
    !menuItem ||
    !menuItem.recipe
  ) {

    throw new Error(
      "Recipe not found"
    );

  }

  const recipeCost =
    await calculateRecipeCost(
      menuItem.recipe.id
    );

  const sellingPrice =
    menuItem.price;

  const profit =
    sellingPrice - recipeCost;

  const foodCostPercentage =
    (recipeCost / sellingPrice)
    * 100;

  return {

    menuItemId:
      menuItem.id,

    menuItemName:
      menuItem.name,

    sellingPrice,

    recipeCost,

    profit,

    foodCostPercentage,

  };

};