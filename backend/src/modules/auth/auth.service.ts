import prisma from "../../lib/prisma";

import {
  hashPassword,
  comparePassword,
} from "../../services/password.service";

import { generateToken } from "../../services/jwt.service";

import { sanitizeUser } from "../../utils/sanitize";

const registerUser = async (
  data: any
) => {
  // Hash password
  const hashedPassword =
    await hashPassword(data.password);

  // Create restaurant
  const restaurant =
    await prisma.restaurant.create({
      data: {
        name: `${data.name}'s Restaurant`,

        email: data.email,
      },
    });

  // Create user
  const user = await prisma.user.create({
    data: {
      name: data.name,

      email: data.email,

      password: hashedPassword,

      role: data.role,

      restaurantId: restaurant.id,
    },
  });

  // Return secure response
  return {
    success: true,

    user: sanitizeUser(user),

    restaurant,

    token: generateToken({
      id: user.id,

      role: user.role,

      restaurantId: restaurant.id,
    }),
  };
};

const loginUser = async (
  email: string,
  password: string
) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Validate password
  const validPassword =
    await comparePassword(
      password,
      user.password
    );

  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  // Return secure response
  return {
    success: true,

    user: sanitizeUser(user),

    token: generateToken({
      id: user.id,

      role: user.role,

      restaurantId: user.restaurantId,
    }),
  };
};

export {
  registerUser,
  loginUser,
};