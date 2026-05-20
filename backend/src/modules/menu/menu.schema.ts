import { z } from "zod";

export const createCategorySchema =
  z.object({
    name: z.string().min(2),

    restaurantId: z.string(),
  });

export const createMenuItemSchema =
  z.object({
    name: z.string().min(2),

    description: z.string().optional(),

    price: z.number(),

    available: z.boolean().optional(),

    image: z.string().optional(),

    restaurantId: z.string(),

    categoryId: z.string(),
  });