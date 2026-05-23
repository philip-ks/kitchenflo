import prisma from "../../lib/prisma";

import {
  hashPassword,
} from "../../services/password.service";

const safeStaffSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  restaurantId: true,
  createdAt: true,
  updatedAt: true,
};

const getStaffList = async (
  restaurantId: string
) => {
  return prisma.user.findMany({
    where: {
      restaurantId,
      role: {
        in: [
          "MANAGER",
          "CASHIER",
          "CHEF",
          "WAITER",
        ],
      },
    },
    select: safeStaffSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createStaff = async (
  restaurantId: string,
  data: {
    name: string;
    email: string;
    phone?: string;
    role: any;
    pin: string;
  }
) => {
  const existingUser =
    await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.email,
          },
          ...(data.phone
            ? [
                {
                  phone: data.phone,
                },
              ]
            : []),
        ],
      },
    });

  if (existingUser) {
    throw new Error(
      "A user with this email or phone already exists"
    );
  }

  if (!data.pin || data.pin.length < 4) {
    throw new Error(
      "PIN must be at least 4 digits"
    );
  }

  const hashedPassword =
    await hashPassword(
      `staff_${Date.now()}_${data.email}`
    );

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      password: hashedPassword,
      pin: data.pin,
      role: data.role,
      restaurantId,
    },
    select: safeStaffSelect,
  });
};

const updateStaff = async (
  restaurantId: string,
  staffId: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    role?: any;
    pin?: string;
  }
) => {
  const staff =
    await prisma.user.findFirst({
      where: {
        id: staffId,
        restaurantId,
      },
    });

  if (!staff) {
    throw new Error("Staff member not found");
  }

  if (staff.role === "OWNER") {
    throw new Error(
      "Owner account cannot be updated from staff module"
    );
  }

  return prisma.user.update({
    where: {
      id: staffId,
    },
    data: {
      ...(data.name && {
        name: data.name,
      }),
      ...(data.email && {
        email: data.email,
      }),
      ...(data.phone !== undefined && {
        phone: data.phone || null,
      }),
      ...(data.role && {
        role: data.role,
      }),
      ...(data.pin && {
        pin: data.pin,
      }),
    },
    select: safeStaffSelect,
  });
};

const deleteStaff = async (
  restaurantId: string,
  staffId: string
) => {
  const staff =
    await prisma.user.findFirst({
      where: {
        id: staffId,
        restaurantId,
      },
    });

  if (!staff) {
    throw new Error("Staff member not found");
  }

  if (staff.role === "OWNER") {
    throw new Error(
      "Owner account cannot be deleted"
    );
  }

  await prisma.user.delete({
    where: {
      id: staffId,
    },
  });

  return {
    success: true,
    message: "Staff member deleted successfully",
  };
};

export {
  getStaffList,
  createStaff,
  updateStaff,
  deleteStaff,
};
