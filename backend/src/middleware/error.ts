import { Request, Response, NextFunction } from "express";

export const notFound = (
  req: Request,
  res: Response
) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};