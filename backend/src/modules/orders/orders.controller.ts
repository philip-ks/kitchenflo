import { Request, Response } from "express";

import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "./orders.service";

import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "./orders.schema";

export const createOrderController = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);

    const order = await createOrder(validatedData);

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrdersController = async (
  req: Request,
  res: Response
) => {
  try {
    const orders = await getOrders(
      req.params.restaurantId
    );

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData =
      updateOrderStatusSchema.parse(req.body);

    const order = await updateOrderStatus(
      req.params.orderId,
      validatedData.status
    );

    return res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};