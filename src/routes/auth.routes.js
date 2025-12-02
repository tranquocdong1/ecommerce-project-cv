import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getMe
} from "../controllers/auth.controller.js";

import { loginLimiter } from "../middlewares/rateLimit.js";
import auth from "../middlewares/auth.js";  // sẽ tạo ở phần 2.5

const router = express.Router();

router.post("/register", register);

router.post("/login", loginLimiter, login);

router.post("/refresh", refreshToken);

router.post("/logout", auth, logout);

router.get("/me", auth, getMe);

export default router;
