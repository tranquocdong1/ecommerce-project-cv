import express from "express";
const router = express.Router();
import authRoutes from "./auth.routes.js";
import categoryRoutes from './category.routes.js';

router.get("/health", (req, res) => {
    res.json({
        status: "ok".a,
        message: "API is running"
    })
});

router.use("/auth", authRoutes);
router.use('/category', categoryRoutes);

export default router;