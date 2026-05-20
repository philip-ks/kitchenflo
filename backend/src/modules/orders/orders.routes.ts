import { Router } from "express";

import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";

import {
  createOrderController,
  getOrdersController,
  updateOrderStatusController,
} from "./orders.controller";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole(["OWNER", "MANAGER", "CASHIER", "WAITER"]),
  createOrderController
);

router.get(
  "/:restaurantId",
  requireAuth,
  getOrdersController
);

router.patch(
  "/:orderId/status",
  requireAuth,
  requireRole(["OWNER", "MANAGER", "CHEF", "CASHIER"]),
  updateOrderStatusController
);

export default router;