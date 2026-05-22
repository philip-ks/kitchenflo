import { Router } from "express";

import {
  register,
  login,
  googleLogin,
  microsoftLogin,
} from "./auth.controller";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/google", googleLogin);

router.post("/microsoft", microsoftLogin);

export default router;