import { Request, Response } from "express";

import {
  registerUser,
  loginUser,
  loginWithGoogle,
  loginWithMicrosoft,
} from "./auth.service";

import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  microsoftLoginSchema,
} from "./auth.schema";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData =
      registerSchema.parse(req.body);

    const result =
      await registerUser(validatedData);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData =
      loginSchema.parse(req.body);

    const result =
      await loginUser(
        validatedData.email,
        validatedData.password
      );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const googleLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData =
      googleLoginSchema.parse(req.body);

    const result =
      await loginWithGoogle(
        validatedData.credential
      );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Google login failed",
    });
  }
};

export const microsoftLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData =
      microsoftLoginSchema.parse(req.body);

    const result =
      await loginWithMicrosoft(
        validatedData.credential
      );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Microsoft login failed",
    });
  }
};