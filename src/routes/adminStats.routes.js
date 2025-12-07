import express from "express";
import auth from "../middlewares/auth.js";
import requireRole from "../middlewares/requireRole.js";
import {
  getOverviewStats,
  getMonthlyRevenue,
  getDailyRevenue,
  getOrderStatusStats,
  getBestSellingProducts
} from "../controllers/adminStats.controller.js";

const router = express.Router();

router.get(
  "/overview",
  auth,
  requireRole("admin"),
  getOverviewStats
);

router.get(
  "/revenue/monthly",
  auth,
  requireRole("admin"),
  getMonthlyRevenue
);

router.get(
  "/revenue/daily",
  auth,
  requireRole("admin"),
  getDailyRevenue
);

router.get(
  "/orders/status",
  auth,
  requireRole("admin"),
  getOrderStatusStats
);

router.get(
  "/products/best-selling",
  auth,
  requireRole("admin"),
  getBestSellingProducts
);

export default router;
