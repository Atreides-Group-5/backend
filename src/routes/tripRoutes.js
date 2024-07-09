import express from "express";
import {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  upload,
} from "../controllers/tripController.js";

const router = express.Router();

router.get("/", getAllTrips);
router.get("/:id", getTripById);
router.post("/", upload.array("images"), createTrip);
router.put("/:id", upload.array("images"), updateTrip);
router.patch("/:id", upload.array("images"), updateTrip);
router.delete("/:id", deleteTrip);

export default router;
