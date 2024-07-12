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
import recommendedRoutes from "./routes/recommendedRoutes.js";  // นำเข้า recommendedRoutes

import errorMiddleware from "./middlewares/errorMiddleware.js";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("MONGO_URI:", process.env.MONGO_URI); // Debug
console.log("PORT:", process.env.PORT); // Debug

const app = express();

// Define CORS options
const corsOptions = {
  origin: "voyage-frontend-chi.vercel.app",
  optionsSuccessStatus: 200,
};

// Enable CORS with options
app.use(cors(corsOptions));
app.use(express.json({ limit: "4mb" }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ไม่ต้องใช้แล้ว

// Routes
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/profile", userProfileRoutes); // Use the new routes
app.use("/api/coupons", couponRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/recommended", recommendedRoutes);  // เพิ่ม recommendedRoutes

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

