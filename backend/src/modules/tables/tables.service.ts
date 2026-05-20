import prisma from "../../lib/prisma";

const createTable = async (data: any) => {
  return prisma.restaurant.create({
    data,
  });
};

const getTables = async (restaurantId: string) => {
  return prisma.restaurant.findMany({
    where: {
      id: restaurantId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export { createTable, getTables };