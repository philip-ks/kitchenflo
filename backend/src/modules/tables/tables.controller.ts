import { Request, Response } from "express";

import {
  createTable,
  getTables,
} from "./tables.service";

import { createTableSchema } from "./tables.schema";

export const createTableController = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = createTableSchema.parse(req.body);

    const table = await createTable(validatedData);

    return res.status(201).json({
      success: true,
      data: table,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTablesController = async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId = Array.isArray(req.params.restaurantId)
      ? req.params.restaurantId[0]
      : req.params.restaurantId;

    const tables = await getTables(restaurantId);

    return res.json({
      success: true,
      data: tables,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};