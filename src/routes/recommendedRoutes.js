import express from "express";
import {
  getRecommended,
  createRecommended,
  updateRecommended,
  deleteRecommended,
} from "../controllers/recommendedController.js";
import { upload } from "../controllers/tripController.js";

const router = express.Router();

router.get("/", getRecommended);
router.post("/", upload.array("image", 1), createRecommended);
router.put("/:id", upload.array("image", 1), updateRecommended);
router.delete("/:id", deleteRecommended);

export default router;
