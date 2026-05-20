import { Router } from "express";

import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";

import {
  createTableController,
  getTablesController,
} from "./tables.controller";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole(["OWNER", "MANAGER"]),
  createTableController
);

router.get(
  "/:restaurantId",
  requireAuth,
  getTablesController
);

export default router;