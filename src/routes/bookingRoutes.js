import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import { authenticateMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Submit booking request
router.post('/', authenticateMiddleware, bookingController.createBooking);

// Get user booking by status
router.get('/:status', authenticateMiddleware, bookingController.getBookingsByStatus);

export default router;