import { Router } from "express";

import {
  register,
  login,
  googleLogin,
  microsoftLogin,
  githubLogin,
  pinLogin,
  sendOtp,
  verifyOtp,
} from "./auth.controller";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/google", googleLogin);

router.post("/microsoft", microsoftLogin);

router.post("/github", githubLogin);

router.post("/pin-login", pinLogin);

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

export default router;
