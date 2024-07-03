// src/app.js
import dotenv from 'dotenv';
dotenv.config();  // Load environment variables

import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';

console.log('MONGO_URI:', process.env.MONGO_URI);  // Debug
console.log('PORT:', process.env.PORT);  // Debug

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);

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
