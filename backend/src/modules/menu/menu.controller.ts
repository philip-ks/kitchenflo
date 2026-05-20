import { Request, Response } from "express";

import {
  createCategory,
  getCategories,
  createMenuItem,
  getMenuItems,
} from "./menu.service";

import {
  createCategorySchema,
  createMenuItemSchema,
} from "./menu.schema";

export const createCategoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);

    const category = await createCategory(validatedData);

    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId = Array.isArray(req.params.restaurantId)
      ? req.params.restaurantId[0]
      : req.params.restaurantId;

    const categories = await getCategories(restaurantId);

    return res.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createMenuItemController = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = createMenuItemSchema.parse(req.body);

    const item = await createMenuItem(validatedData);

    return res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMenuItemsController = async (
  req: Request,
  res: Response
) => {
  try {
    const restaurantId = Array.isArray(req.params.restaurantId)
      ? req.params.restaurantId[0]
      : req.params.restaurantId;

    const items = await getMenuItems(restaurantId);

    return res.json({
      success: true,
      data: items,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};