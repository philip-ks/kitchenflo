import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import restaurantRoutes from "../modules/restaurant/restaurant.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "KitchenFlo API running",
  });
});

router.use("/auth", authRoutes);

router.use("/restaurants", restaurantRoutes);

export default router;