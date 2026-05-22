import prisma from "../../lib/prisma";

import {
  hashPassword,
  comparePassword,
} from "../../services/password.service";

import { generateToken } from "../../services/jwt.service";

import { sanitizeUser } from "../../utils/sanitize";

import { OAuth2Client } from "google-auth-library";

const registerUser = async (data: any) => {
  const existingUser =
    await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword =
    await hashPassword(data.password);

  const restaurant =
    await prisma.restaurant.create({
      data: {
        name: `${data.name}'s Restaurant`,
        email: data.email,
      },
    });

  const user =
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        restaurantId: restaurant.id,
      },
    });

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
  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    throw new Error("User not found");
  }

  const validPassword =
    await comparePassword(
      password,
      user.password
    );

  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

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

const loginWithGoogle = async (
  credential: string
) => {
  const googleClientId =
    process.env.GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    throw new Error(
      "Google Client ID is not configured"
    );
  }

  console.log(
    "Backend GOOGLE_CLIENT_ID:",
    googleClientId
  );

  const googleClient =
    new OAuth2Client(googleClientId);

  const ticket =
    await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new Error(
      "Google account email not found"
    );
  }

  const email =
    payload.email.toLowerCase();

  const name =
    payload.name ||
    email.split("@")[0];

  let user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  let restaurant = null;

  if (!user) {
    const randomPassword =
      await hashPassword(
        `google_${Date.now()}_${email}`
      );

    restaurant =
      await prisma.restaurant.create({
        data: {
          name: `${name}'s Restaurant`,
          email,
        },
      });

    user =
      await prisma.user.create({
        data: {
          name,
          email,
          password: randomPassword,
          role: "OWNER",
          restaurantId: restaurant.id,
        },
      });
  }

  return {
    success: true,
    user: sanitizeUser(user),
    restaurant,
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
  loginWithGoogle,
};