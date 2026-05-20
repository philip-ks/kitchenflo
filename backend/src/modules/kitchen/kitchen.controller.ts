import { Request, Response } from "express";

import {
  createKitchenTicket,
  getKitchenTickets,
  updateKitchenTicketStatus,
} from "./kitchen.service";

import {
  createKitchenTicketSchema,
  updateKitchenTicketStatusSchema,
} from "./kitchen.schema";

export const createKitchenTicketController = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = createKitchenTicketSchema.parse(req.body);

    const ticket = await createKitchenTicket(validatedData);

    return res.status(201).json({
      success: true,
      data: ticket,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getKitchenTicketsController = async (
  req: Request,
  res: Response
) => {
  try {
    const tickets = await getKitchenTickets(String(req.params.restaurantId));

    return res.json({
      success: true,
      data: tickets,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateKitchenTicketStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = updateKitchenTicketStatusSchema.parse(req.body);

    const ticket = await updateKitchenTicketStatus(
      String(req.params.ticketId),
      validatedData.status
    );

    return res.json({
      success: true,
      data: ticket,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};