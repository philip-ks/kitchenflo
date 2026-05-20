import prisma from "../../lib/prisma";

const client = prisma as any;

const createCategory = async (data: any) => {
  return client.menuCategory.create({
    data,
  });
};

const getCategories = async (restaurantId: string) => {
  return client.menuCategory.findMany({
    where: {
      restaurantId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createMenuItem = async (data: any) => {
  return client.menuItem.create({
    data,
  });
};

const getMenuItems = async (restaurantId: string) => {
  return client.menuItem.findMany({
    where: {
      restaurantId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export {
  createCategory,
  getCategories,
  createMenuItem,
  getMenuItems,
};