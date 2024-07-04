import express from "express";
import * as tripController from "../controllers/tripController.js";

const router = express.Router();

// Get all trips
router.get('/', tripController.getAllTrips);

export default router;