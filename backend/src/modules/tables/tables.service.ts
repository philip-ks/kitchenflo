import prisma from "../../lib/prisma";

const createTable = async (data: any) => {
  return prisma.restaurantTable.create({
    data,
  });
};

const getTables = async (restaurantId: string) => {
  return prisma.restaurantTable.findMany({
    where: {
      restaurantId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export { createTable, getTables };