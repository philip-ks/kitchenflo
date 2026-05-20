import { z } from "zod";

export const createInvoiceSchema = z.object({
  restaurantId: z.string(),
  orderId: z.string(),
  taxAmount: z.number().optional(),
  discount: z.number().optional(),
});

export const createPaymentSchema = z.object({
  restaurantId: z.string(),
  invoiceId: z.string(),
  amount: z.number().positive(),
  method: z.enum(["CASH", "CARD", "UPI", "WALLET", "OTHER"]),
  reference: z.string().optional(),
});
