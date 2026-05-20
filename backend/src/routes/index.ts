import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import menuRoutes from "../modules/menu/menu.routes";
import tablesRoutes from "../modules/tables/tables.routes";
import ordersRoutes from "../modules/orders/orders.routes";
import restaurantRoutes from "../modules/restaurant/restaurant.routes";
import kitchenRoutes from "../modules/kitchen/kitchen.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "KitchenFlo API running",
  });
});

router.use("/auth", authRoutes);
router.use("/menu", menuRoutes);
router.use("/tables", tablesRoutes);
router.use("/orders", ordersRoutes);
router.use("/kitchen", kitchenRoutes);

// Keep this last
router.use("/restaurants", restaurantRoutes);

export default router;