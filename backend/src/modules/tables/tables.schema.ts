import { z } from "zod";

export const createTableSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().positive(),
  restaurantId: z.string(),
});