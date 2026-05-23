import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import menuRoutes from "../modules/menu/menu.routes";
import tablesRoutes from "../modules/tables/tables.routes";
import ordersRoutes from "../modules/orders/orders.routes";
import kitchenRoutes from "../modules/kitchen/kitchen.routes";
import billingRoutes from "../modules/billing/billing.routes";
import reportsRoutes from "../modules/reports/reports.routes";
import restaurantRoutes from "../modules/restaurant/restaurant.routes";
import profileRoutes from "../modules/profile/profile.routes";
import staffRoutes from "../modules/staff/staff.routes";

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
router.use("/billing", billingRoutes);
router.use("/reports", reportsRoutes);
router.use("/profile", profileRoutes);
router.use("/staff", staffRoutes);

// Keep this last
router.use("/restaurants", restaurantRoutes);

export default router;
