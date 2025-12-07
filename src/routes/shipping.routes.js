import express from "express";
import auth from "../middlewares/auth.js";
import requireRole from "../middlewares/requireRole.js";
import { markDelivered } from "../controllers/shipping.controller.js";

const router = express.Router();

router.put(
  "/:id/delivered",
  auth,
  requireRole("shipper", "admin"), 
  markDelivered
);

export default router;
