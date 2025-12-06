import express from "express";
import auth from "../middlewares/auth.js";
import {
  getMyCart,
  add,
  update,
  remove,
  clear
} from "../controllers/cart.controller.js";

const router = express.Router();

// Require login
router.get("/", auth, getMyCart);
router.post("/add", auth, add);
router.put("/update", auth, update);
router.delete("/remove", auth, remove);
router.delete("/clear", auth, clear);

export default router;
