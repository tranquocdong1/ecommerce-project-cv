import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "../routes/index.js";
import notFound from "../middlewares/notFound.js";
import errorHandler from "../middlewares/errorHandler.js";
import { apiLimiter } from "../middlewares/rateLimit.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extend: true }));

app.use(cookieParser());

app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use("/api", apiLimiter);

app.use("/api/v1", routes);

app.use(notFound);

app.use(errorHandler);

export default app;
