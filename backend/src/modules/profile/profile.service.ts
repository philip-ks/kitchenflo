import prisma from "../../lib/prisma";

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  restaurantId: true,
  createdAt: true,
  updatedAt: true,
};

const getMyProfile = async (
  userId: string,
  restaurantId: string
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      restaurantId,
    },
    select: safeUserSelect,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const restaurant =
    await prisma.restaurant.findUnique({
      where: {
        id: restaurantId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

  return {
    user,
    restaurant,
  };
};

const updateMyProfile = async (
  userId: string,
  restaurantId: string,
  data: {
    name?: string;
    phone?: string;
  }
) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(data.name && {
        name: data.name,
      }),
      ...(data.phone && {
        phone: data.phone,
      }),
    },
    select: safeUserSelect,
  });

  if (user.restaurantId !== restaurantId) {
    throw new Error("Unauthorized profile update");
  }

  return user;
};

const updateRestaurantProfile = async (
  restaurantId: string,
  data: {
    name?: string;
    phone?: string;
  }
) => {
  const restaurant =
    await prisma.restaurant.update({
      where: {
        id: restaurantId,
      },
      data: {
        ...(data.name && {
          name: data.name,
        }),
        ...(data.phone && {
          phone: data.phone,
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

  return restaurant;
};

export {
  getMyProfile,
  updateMyProfile,
  updateRestaurantProfile,
};