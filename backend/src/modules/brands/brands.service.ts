import prisma from "../../lib/prisma";

const getBrands = async (
  restaurantId: string
) => {
  return prisma.brand.findMany({
    where: {
      restaurantId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createBrand = async (
  restaurantId: string,
  data: {
    name: string;
    description?: string;
    active?: boolean;
  }
) => {
  const existingBrand =
    await prisma.brand.findFirst({
      where: {
        restaurantId,
        name: data.name,
      },
    });

  if (existingBrand) {
    throw new Error(
      "Brand already exists"
    );
  }

  return prisma.brand.create({
    data: {
      name: data.name,
      description:
        data.description || null,
      active:
        data.active ?? true,
      restaurantId,
    },
  });
};

const updateBrand = async (
  restaurantId: string,
  brandId: string,
  data: {
    name?: string;
    description?: string;
    active?: boolean;
  }
) => {
  const brand =
    await prisma.brand.findFirst({
      where: {
        id: brandId,
        restaurantId,
      },
    });

  if (!brand) {
    throw new Error(
      "Brand not found"
    );
  }

  return prisma.brand.update({
    where: {
      id: brandId,
    },
    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),
      ...(data.description !== undefined && {
        description:
          data.description || null,
      }),
      ...(data.active !== undefined && {
        active: data.active,
      }),
    },
  });
};

const deleteBrand = async (
  restaurantId: string,
  brandId: string
) => {
  const brand =
    await prisma.brand.findFirst({
      where: {
        id: brandId,
        restaurantId,
      },
      include: {
        menuItems: true,
        orders: true,
      },
    });

  if (!brand) {
    throw new Error(
      "Brand not found"
    );
  }

  if (
    brand.menuItems.length > 0 ||
    brand.orders.length > 0
  ) {
    return prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        active: false,
      },
    });
  }

  await prisma.brand.delete({
    where: {
      id: brandId,
    },
  });

  return {
    success: true,
    message:
      "Brand deleted successfully",
  };
};

export {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};
