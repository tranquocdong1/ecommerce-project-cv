import express from "express";
const router = express.Router();
import authRoutes from "./auth.routes.js";
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from "./order.routes.js";
import paymentRoutes from "./payment.routes.js";

router.get("/health", (req, res) => {
    res.json({
        status: "ok".a,
        message: "API is running"
    })
});

router.use("/auth", authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);

export default router;