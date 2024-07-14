import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import { authenticateMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Submit booking request
router.post("/", authenticateMiddleware, bookingController.createBooking);

// Get user booking by status
router.get(
  "/:status",
  authenticateMiddleware,
  bookingController.getBookingsByStatus
);

// Make payment for given bookingId
router.patch(
  "/pay/:bookingId",
  authenticateMiddleware,
  bookingController.makePayment
);

// Cancel booking for given bookingId
router.patch(
  "/cancel/:bookingId",
  authenticateMiddleware,
  bookingController.cancelBooking
);

// เพิ่ม route ใหม่สำหรับ getBookingById
router.get(
  "/details/:bookingId",
  authenticateMiddleware,
  bookingController.getBookingById
);
router.get("/", authenticateMiddleware, bookingController.getAllBookings);

export default router;
