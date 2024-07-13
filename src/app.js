import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import recommendedRoutes from "./routes/recommendedRoutes.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("PORT:", process.env.PORT);

const app = express();

// Define CORS options (แก้ไขส่วนนี้)
const corsOptions = {
  origin: ["https://voyage-frontend-chi.vercel.app", "http://localhost:5173"],
  optionsSuccessStatus: 200,
};

// Enable CORS with options (ย้ายขึ้นมาบนสุด)
app.use(cors());

app.use(express.json({ limit: "4mb" }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/recommended", recommendedRoutes);

// Handle 404 route not found
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Handle Errors
app.use(errorMiddleware);

// Start Express Server
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MongoDB URI is not defined in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
