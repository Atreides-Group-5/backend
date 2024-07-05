import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import userProfileRoutes from './routes/userProfileRoutes.js'; 

import errorMiddleware from './middlewares/errorMiddleware.js'; 

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('MONGO_URI:', process.env.MONGO_URI);  // Debug
console.log('PORT:', process.env.PORT);  // Debug

const app = express();

// Define CORS options
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    optionsSuccessStatus: 200
};

// Enable CORS with options
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Routes
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/profile', userProfileRoutes); // Use the new routes

// Handle 404 route not found
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
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

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });