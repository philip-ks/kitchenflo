import { Router } from "express";

import {
  getStaff,
  addStaff,
  editStaff,
  removeStaff,
} from "./staff.controller";

import {
  requireAuth,
} from "../../middleware/auth";

const router = Router();

router.get(
  "/",
  requireAuth,
  getStaff
);

router.post(
  "/",
  requireAuth,
  addStaff
);

router.put(
  "/:id",
  requireAuth,
  editStaff
);

router.delete(
  "/:id",
  requireAuth,
  removeStaff
);

export default router;
