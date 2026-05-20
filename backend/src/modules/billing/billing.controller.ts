import { Request, Response } from "express";

import {
  createInvoice,
  getInvoices,
  createPayment,
} from "./billing.service";

import {
  createInvoiceSchema,
  createPaymentSchema,
} from "./billing.schema";

export const createInvoiceController = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = createInvoiceSchema.parse(req.body);

    const invoice = await createInvoice(validatedData);

    return res.status(201).json({
      success: true,
      data: invoice,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInvoicesController = async (
  req: Request,
  res: Response
) => {
  try {
    const invoices = await getInvoices(req.params.restaurantId);

    return res.json({
      success: true,
      data: invoices,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createPaymentController = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = createPaymentSchema.parse(req.body);

    const payment = await createPayment(validatedData);

    return res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
