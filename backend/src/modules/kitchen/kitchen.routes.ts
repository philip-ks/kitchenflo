import { Router } from "express";

import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";

import {
  createKitchenTicketController,
  getKitchenTicketsController,
  updateKitchenTicketStatusController,
} from "./kitchen.controller";

const router = Router();

router.post(
  "/tickets",
  requireAuth,
  requireRole(["OWNER", "MANAGER", "CASHIER", "WAITER"]),
  createKitchenTicketController
);

router.get(
  "/tickets/:restaurantId",
  requireAuth,
  requireRole(["OWNER", "MANAGER", "CHEF", "CASHIER"]),
  getKitchenTicketsController
);

router.patch(
  "/tickets/:ticketId/status",
  requireAuth,
  requireRole(["OWNER", "MANAGER", "CHEF"]),
  updateKitchenTicketStatusController
);

export default router;