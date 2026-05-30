import { Router } from "express";

import {
  listBrands,
  addBrand,
  editBrand,
  removeBrand,
} from "./brands.controller";

import {
  requireAuth,
} from "../../middleware/auth";

const router = Router();

router.get(
  "/",
  requireAuth,
  listBrands
);

router.post(
  "/",
  requireAuth,
  addBrand
);

router.put(
  "/:id",
  requireAuth,
  editBrand
);

router.delete(
  "/:id",
  requireAuth,
  removeBrand
);

export default router;
