import { Router } from "express";

import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";

import {
  createInvoiceController,
  getInvoicesController,
  createPaymentController,
} from "./billing.controller";

const router = Router();

router.post(
  "/invoices",
  requireAuth,
  requireRole(["OWNER", "MANAGER", "CASHIER"]),
  createInvoiceController
);

router.get(
  "/invoices/:restaurantId",
  requireAuth,
  requireRole(["OWNER", "MANAGER", "CASHIER"]),
  getInvoicesController
);

router.post(
  "/payments",
  requireAuth,
  requireRole(["OWNER", "MANAGER", "CASHIER"]),
  createPaymentController
);

export default router;
