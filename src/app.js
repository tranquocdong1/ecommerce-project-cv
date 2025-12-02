import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "../src/routes/index.js";
import notFound from "../src/middlewares/notFound.js";
import errorHandler from "../src/middlewares/errorHandler.js";
import { apiLimiter } from "../src/middlewares/rateLimit.js";

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
