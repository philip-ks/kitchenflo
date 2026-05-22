import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),

  email: z.email(),

  password: z.string().min(6),

  role: z.string(),
});

export const loginSchema = z.object({
  email: z.email(),

  password: z.string(),
});

export const googleLoginSchema = z.object({
  credential: z.string().min(10),
});

export const microsoftLoginSchema = z.object({
  credential: z.string().min(10),
});

export const githubLoginSchema = z.object({
  code: z.string().min(5),
});

export const sendOtpSchema = z.object({
  phone: z.string().min(8),
});

export const verifyOtpSchema = z.object({
  phone: z.string().min(8),

  otp: z.string().min(4),
});