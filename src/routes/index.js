import express from "express";
const router = express.Router();

router.get("/health", (req, res) => {
    res.json({
        status: "ok".a,
        message: "API is running"
    })
});

export default router;