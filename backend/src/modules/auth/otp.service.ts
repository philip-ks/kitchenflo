import prisma from "../../lib/prisma";

import { hashPassword } from "../../services/password.service";

import { generateToken } from "../../services/jwt.service";

import { sanitizeUser } from "../../utils/sanitize";

type OtpRecord = {
  otp: string;
  expiresAt: number;
};

const otpStore = new Map<string, OtpRecord>();

const normalizePhone = (phone: string) => {
  return phone.replace(/\s+/g, "").trim();
};

const generateOtp = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

export const sendOtpToPhone = async (
  phone: string
) => {
  const normalizedPhone =
    normalizePhone(phone);

  if (!normalizedPhone) {
    throw new Error(
      "Phone number is required"
    );
  }

  const otp = generateOtp();

  const expiresAt =
    Date.now() + 5 * 60 * 1000;

  otpStore.set(normalizedPhone, {
    otp,
    expiresAt,
  });

  console.log(
    `📲 KitchenFlo OTP for ${normalizedPhone}: ${otp}`
  );

  return {
    success: true,
    message:
      "OTP sent successfully.",
  };
};

export const verifyPhoneOtp = async (
  phone: string,
  otp: string
) => {
  const normalizedPhone =
    normalizePhone(phone);

  const record =
    otpStore.get(normalizedPhone);

  if (!record) {
    throw new Error(
      "OTP not found or expired"
    );
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedPhone);

    throw new Error(
      "OTP expired"
    );
  }

  if (record.otp !== otp) {
    throw new Error(
      "Invalid OTP"
    );
  }

  otpStore.delete(normalizedPhone);

  let user =
    await prisma.user.findUnique({
      where: {
        phone: normalizedPhone,
      },
    });

  let restaurant = null;

  if (!user) {
    const fallbackEmail =
      `${normalizedPhone.replace(/\+/g, "")}@phone.kitchenflo.local`;

    const randomPassword =
      await hashPassword(
        `otp_${Date.now()}_${normalizedPhone}`
      );

    restaurant =
      await prisma.restaurant.create({
        data: {
          name: `${normalizedPhone}'s Restaurant`,
          email: fallbackEmail,
        },
      });

    user =
      await prisma.user.create({
        data: {
          name: normalizedPhone,
          email: fallbackEmail,
          phone: normalizedPhone,
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