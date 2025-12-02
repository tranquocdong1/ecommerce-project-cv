import express from "express";
const router = express.Router();
import authRoutes from "./auth.routes.js";

router.get("/health", (req, res) => {
    res.json({
        status: "ok".a,
        message: "API is running"
    })
});

router.use("/auth", authRoutes);

export default router;