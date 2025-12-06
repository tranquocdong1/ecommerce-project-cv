import express from "express";
const router = express.Router();
import authRoutes from "./auth.routes.js";
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';

router.get("/health", (req, res) => {
    res.json({
        status: "ok".a,
        message: "API is running"
    })
});

router.use("/auth", authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

export default router;