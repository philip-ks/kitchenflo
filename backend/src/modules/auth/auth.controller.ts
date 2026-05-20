import { Request, Response } from "express";

import {
  registerUser,
  loginUser,
} from "./auth.service";

import {
  registerSchema,
  loginSchema,
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

    const result = await loginUser(
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