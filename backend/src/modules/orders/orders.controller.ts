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
    const restaurantId = Array.isArray(req.params.restaurantId)
      ? req.params.restaurantId[0]
      : req.params.restaurantId;

    const orders = await getOrders(restaurantId);

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

    const orderId = Array.isArray(req.params.orderId)
      ? req.params.orderId[0]
      : req.params.orderId;

    const order = await updateOrderStatus(
      orderId,
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