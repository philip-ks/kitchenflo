import { Request, Response } from "express";

import {
  registerUser,
  loginUser,
  loginWithGoogle,
  loginWithMicrosoft,
  loginWithGitHub,
  loginWithPin,
} from "./auth.service";

import {
  sendOtpToPhone,
  verifyPhoneOtp,
} from "./otp.service";

import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  microsoftLoginSchema,
  githubLoginSchema,
  pinLoginSchema,
  sendOtpSchema,
  verifyOtpSchema,
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

export const githubLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData =
      githubLoginSchema.parse(req.body);

    const result =
      await loginWithGitHub(
        validatedData.code
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
        "GitHub login failed",
    });
  }
};

export const sendOtp = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData =
      sendOtpSchema.parse(req.body);

    const result =
      await sendOtpToPhone(
        validatedData.phone
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
        "Failed to send OTP",
    });
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData =
      verifyOtpSchema.parse(req.body);

    const result =
      await verifyPhoneOtp(
        validatedData.phone,
        validatedData.otp
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
        "OTP verification failed",
    });
  }
};
export const pinLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData =
      pinLoginSchema.parse(req.body);

    const result =
      await loginWithPin(
        validatedData.restaurantId,
        validatedData.pin
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
        "PIN login failed",
    });
  }
};
