import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json({
      status: "error",
      message: "Too many requests, please try again later."
    });
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json({
      status: "error",
      message: "Too many login attempts, please try again later."
    });
  },
  standardHeaders: true,
  legacyHeaders: false
});
