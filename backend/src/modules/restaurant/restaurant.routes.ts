import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Restaurant routes working",
  });
});

export default router;