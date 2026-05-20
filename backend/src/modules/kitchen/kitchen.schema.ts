import { z } from "zod";

export const createKitchenTicketSchema = z.object({
  restaurantId: z.string(),
  orderId: z.string(),
  notes: z.string().optional(),
});

export const updateKitchenTicketStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PREPARING",
    "READY",
    "COMPLETED",
    "CANCELLED",
  ]),
});