import express from "express";
import {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  getTripsByName,
  deleteTrip,
  upload,
} from "../controllers/tripController.js";
import { authenticateAdminMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllTrips);
router.get("/search", getTripsByName);
router.get("/:id", getTripById);
router.post(
  "/",
  authenticateAdminMiddleware,
  upload.array("images"),
  createTrip
);
router.put(
  "/:id",
  authenticateAdminMiddleware,
  upload.array("images"),
  updateTrip
);
router.patch(
  "/:id",
  authenticateAdminMiddleware,
  upload.array("images"),
  updateTrip
);
router.delete("/:id", authenticateAdminMiddleware, deleteTrip);

export default router;
