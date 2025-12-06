import dotenv from "dotenv";
dotenv.config();
import cloudinary from "./config/cloudinary.js";

import app from "./app.js";
import connectDB from "../src/config/db.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
};

start();