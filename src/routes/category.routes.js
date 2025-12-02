import express from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove
} from "../controllers/category.controller.js";

import auth from "../middlewares/auth.js";
import requireRole from "../middlewares/requireRole.js";

const router = express.Router();

// Admin-only routes
router.post("/", auth, requireRole("admin"), create);
router.put("/:id", auth, requireRole("admin"), update);
router.delete("/:id", auth, requireRole("admin"), remove);

// Public routes
router.get("/", getAll);
router.get("/:id", getById);

export default router;
