import { Router } from "express";

import {
  getProfitabilityAnalytics,
  getConsumptionAnalytics,
  getLowStockAnalytics,
  getProcurementAnalytics,
} from "./analytics.controller";

import {
  requireAuth,
} from "../../middleware/auth";

const router = Router();

router.get(
  "/profitability",
  requireAuth,
  getProfitabilityAnalytics
);

router.get(
  "/consumption",
  requireAuth,
  getConsumptionAnalytics
);

router.get(
  "/low-stock",
  requireAuth,
  getLowStockAnalytics
);

router.get(
  "/procurement",
  requireAuth,
  getProcurementAnalytics
);

export default router;