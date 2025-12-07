import express from "express";
import auth from "../middlewares/auth.js";
import {
  createPaymentUrl,
  vnpReturn,
  vnpIpn
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/vnpay", auth, createPaymentUrl);

router.get("/vnpay/return", vnpReturn);

router.get("/vnpay/ipn", vnpIpn);

export default router;
