import express from "express";
import upload from "../middlewares/upload.js";
import {
  create,
  getAll,
  getById,
  update,
  remove
} from "../controllers/product.controller.js";

import auth from "../middlewares/auth.js";
import requireRole from "../middlewares/requireRole.js";

const router = express.Router();

router.post(
  "/",
  auth,
  requireRole("admin"),
  upload.array("images", 5),
  create
);

router.get("/", getAll);
router.get("/:id", getById);

router.put("/:id", auth, requireRole("admin"), update);
router.delete("/:id", auth, requireRole("admin"), remove);

export default router;
