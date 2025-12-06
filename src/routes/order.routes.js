import express from "express";
import auth from "../middlewares/auth.js";
import requireRole from "../middlewares/requireRole.js";
import {
  createOrder,
  getMyOrderList,
  getMyOrderDetail,
  adminGetOrderDetail,
  adminUpdateOrderStatus
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/", auth, getMyOrderList);
router.get("/:id", auth, getMyOrderDetail);

router.get("/admin/:id", auth, requireRole("admin"), adminGetOrderDetail);
router.put("/admin/:id", auth, requireRole("admin"), adminUpdateOrderStatus);

export default router;
