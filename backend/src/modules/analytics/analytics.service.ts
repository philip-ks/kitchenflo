import prisma from "../../lib/prisma";

import {
  calculateMenuItemProfitability,
} from "../costing/costing.service";

export const getMenuProfitability =
async (
  restaurantId: string
) => {

  const menuItems =
    await prisma.menuItem.findMany({

      where: {
        restaurantId,
      },

      include: {
        recipe: true,
      },

    });

  const profitabilityData = [];

  for (
    const menuItem
    of menuItems
  ) {

    if (!menuItem.recipe) {
      continue;
    }

    const profitability =
      await calculateMenuItemProfitability(
        menuItem.id
      );

    profitabilityData.push(
      profitability
    );

  }

  return profitabilityData;

};