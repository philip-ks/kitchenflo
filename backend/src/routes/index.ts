import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import restaurantRoutes from "../modules/restaurant/restaurant.routes";
import menuRoutes from "../modules/menu/menu.routes";
import tableRoutes from "../modules/tables/tables.routes";
import orderRoutes from "../modules/orders/orders.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "KitchenFlo API running",
  });
});

router.use("/auth", authRoutes);

router.use("/restaurants", restaurantRoutes);

router.use("/menu", menuRoutes);

router.use("/tables", tableRoutes);

router.use("/orders", orderRoutes);

export default router;