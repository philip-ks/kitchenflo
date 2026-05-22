import { Router } from "express";

import {
  getProfile,
  updateProfile,
  updateRestaurant,
} from "./profile.controller";

import {
  requireAuth,
} from "../../middleware/auth";

const router = Router();

router.get(
  "/me",
  requireAuth,
  getProfile
);

router.put(
  "/me",
  requireAuth,
  updateProfile
);

router.put(
  "/restaurant",
  requireAuth,
  updateRestaurant
);

export default router;