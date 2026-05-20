import { Router } from "express";

import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";

import { getDailySalesReportController } from "./reports.controller";

const router = Router();

router.get(
  "/daily-sales/:restaurantId",
  requireAuth,
  requireRole(["OWNER", "MANAGER", "CASHIER"]),
  getDailySalesReportController
);

export default router;
